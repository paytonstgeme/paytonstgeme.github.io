# Static HTML Blog Starter

A minimal, total-control static blog for GitHub Pages. No frameworks, no generators.

## Structure
```
/
  index.html
  posts/
    YYYY-MM-DD-title.html
  assets/
    style.css
  404.html
  .nojekyll
```
Do not use folders starting with an underscore while Jekyll is on. The `.nojekyll` file disables Jekyll so your files are served as-is.

## How to use
1. Create a new public repo named `yourusername.github.io`.
2. Upload these files to the repo root and commit.
3. In the repo, open Settings → Pages and set Source to Deploy from a branch and select the `main` branch.
4. Visit `https://yourusername.github.io`.

## Create a new post
1. Copy `posts/2025-08-30-hello-world.html` to a new file named `YYYY-MM-DD-your-title.html`.
2. Edit the HTML content and the `<time>` tag.
3. Open `index.html` and add a new list item linking to your post.

## Custom domain
- Add a file named `CNAME` in the repo root that contains only your domain, for example `www.example.com`.
- In your domain registrar DNS, create a CNAME for `www` that points to `yourusername.github.io`.
- For the root domain, use your registrar's ALIAS/ANAME or follow GitHub's Pages DNS instructions.
- In Settings → Pages, add your custom domain and enforce HTTPS.

