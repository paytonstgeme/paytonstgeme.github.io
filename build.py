# build.py — run this once and your entire site is updated & ready to push
import os
import shutil
from datetime import datetime

# 1. Regenerate posts index
print("Generating posts_index.json...")
os.system("python build_posts_index.py")

# 2. Copy global files into every HTML page (super simple templating)
template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined">
</head>
<body>
  <div id="header"></div>
  <div id="sidebar"></div>

  <main class="container">
    {content}
  </main>

  <script src="js/main.js" defer></script>
  {extra_scripts}
</body>
</html>"""

pages = [
    {"file": "index.html",   "title": "Payton St. Geme",               "extra_scripts": '<script src="js/views-hero.js" defer></script>'},
    {"file": "posts.html",   "title": "Payton St. Geme — Posts",        "extra_scripts": ""},
    {"file": "views.html",   "title": "Payton St. Geme — Views",        "extra_scripts": ""},
    # add new pages here — one line each!
]

for page_content = ""
for page in pages:
    with open(page["file"], "r", encoding="utf-8") as f:
        # Everything between <main> and </main> is kept
        content = f.read()
        import re
        match = re.search(r"<main[^>]*>(.*?)</main>", content, re.S | re.I)
        page_content = match.group(1).strip() if match else "<h1>Page under construction</h1>"

    final_html = template.format(
        title=page["title"],
        content=page_content,
        extra_scripts=page["extra_scripts"]
    )

    # Inject header & sidebar
    with open("components/header.html", "r", encoding="utf-8") as f:
        final_html = final_html.replace('<div id="header"></div>', f.read())
    with open("components/sidebar.html", "r", encoding="utf-8") as f:
        final_html = final_html.replace('<div id="sidebar"></div>', f.read())

    with open(page["file"], "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"Built {page['file']}")

print("\nBuild complete! Site is ready to push!")
print("Run: git add . && git commit -m 'Update site' && git push")