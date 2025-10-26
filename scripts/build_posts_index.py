import re
import json
import os
import glob
import html
from datetime import datetime

POSTS_DIR = "posts"
OUTFILE = "posts_index.json"

def extract(text, pattern, flags=0):
    match = re.search(pattern, text, flags)
    return match.group(1).strip() if match else ""

def read_post_info(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Title: main > h1 → h1 → <title>
    title = (
        extract(content, r"<main[^>]*>.*?<h1[^>]*>(.*?)</h1>.*?</main>", re.S | re.I) or
        extract(content, r"<h1[^>]*>(.*?)</h1>", re.S | re.I) or
        extract(content, r"<title[^>]*>(.*?)</title>", re.I)
    )
    title = html.unescape(re.sub(r"\s+", " ", title))

    # Description: <meta name="description"> → h2 → first <p>
    desc = (
        extract(content, r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', re.I) or
        extract(content, r"<h2[^>]*>(.*?)</h2>", re.S | re.I) or
        extract(content, r"<main[^>]*>.*?<p[^>]*>(.*?)</p>", re.S | re.I) or
        extract(content, r"<p[^>]*>(.*?)</p>", re.I)
    )
    desc = html.unescape(re.sub(r"\s+", " ", desc))

    # Date: <time datetime=""> → filename prefix
    date = extract(content, r'<time[^>]+datetime=["\'](\d{4}-\d{2}-\d{2})["\']', re.I)
    if not date:
        filename = os.path.basename(path)
        match = re.match(r"(\d{4}-\d{2}-\d{2})-", filename)
        date = match.group(1) if match else ""

    url = f"/posts/{os.path.basename(path)}"

    return {
        "url": url,
        "title": title or os.path.splitext(filename)[0].replace("-", " ").title(),
        "desc": desc,
        "date": date
    }

def main():
    posts = [read_post_info(p) for p in glob.glob(os.path.join(POSTS_DIR, "*.html"))]

    # Sort newest first
    posts.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d") if x["date"] else datetime.min, reverse=True)

    with open(OUTFILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()