
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>
  <header class="header">
    <div class="container bar">
      <a class="brand" href="index.html">PAYTON ST GEME</a>
      <nav class="nav">
        <a class="nav-link active" href="index.html">Home</a>
        <a class="nav-link" href="posts.html">Posts</a>
        <a class="nav-link" href="views.html">Views</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>Home</h1>
    <figure>
      <img src="assets/Kanji and Hexagram of Harmony.png" alt="Harmony" style="max-width:100%;height:auto;" />
      <figcaption>© Payton St Geme</figcaption>
    </figure>
    <p class="lede">Welcome to my site.</p>
  </main>

  <footer class="footer">
    <div class="container">© <span id="year"></span> Payton St Geme</div>
  </footer>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>
</body>
</html>
