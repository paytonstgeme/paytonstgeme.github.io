import re, json, os, glob, html
from datetime import datetime

POSTS_DIR = "posts"
OUTFILE = "posts_index.json"

def extract(text, pattern, flags=0):
    m = re.search(pattern, text, flags)
    return m.group(1).strip() if m else ""

def read_post_info(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        s = f.read()

    # Title: prefer <main><h1>, else any <h1>, else <title>
    title = extract(s, r"<main[^>]*?>.*?<h1[^>]*?>(.*?)</h1>.*?</main>", re.S|re.I)
    if not title:
        title = extract(s, r"<h1[^>]*?>(.*?)</h1>", re.S|re.I)
    if not title:
        title = extract(s, r"<title[^>]*?>(.*?)</title>", re.S|re.I)
    title = html.unescape(re.sub(r"\s+", " ", title))

    # Description: prefer <meta[name=description]>, then <h2>, then first <p>
    desc = extract(s, r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', re.I)
    if not desc:
        desc = extract(s, r"<h2[^>]*?>(.*?)</h2>", re.S|re.I)
    if not desc:
        desc = extract(s, r"<main[^>]*?>.*?<p[^>]*?>(.*?)</p>", re.S|re.I) or extract(s, r"<p[^>]*?>(.*?)</p>", re.S|re.I)
    desc = html.unescape(re.sub(r"\s+", " ", desc))

    # Date: prefer <time datetime="YYYY-MM-DD">, else parse from filename prefix
    date = extract(s, r'<time[^>]+datetime=["\'](\d{4}-\d{2}-\d{2})["\']', re.I)
    if not date:
        fn = os.path.basename(path)
        m = re.match(r"(\d{4}-\d{2}-\d{2})-", fn)
        if m:
            date = m.group(1)

    # URL
    url = f"/posts/{os.path.basename(path)}"

    return {
        "url": url,
        "title": title or os.path.splitext(os.path.basename(path))[0].replace("-", " "),
        "desc": desc,
        "date": date or ""
    }

def main():
    posts = []
    for p in glob.glob(os.path.join(POSTS_DIR, "*.html")):
        posts.append(read_post_info(p))

    # sort newest first if dates exist
    def key(x):
        try:
            return datetime.strptime(x["date"], "%Y-%m-%d")
        except Exception:
            return datetime.min
    posts.sort(key=key, reverse=True)

    with open(OUTFILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
