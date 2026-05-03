document.addEventListener('DOMContentLoaded', () => {
  const headerDiv = document.querySelector('[data-include*="header"]');
  const sidebarDiv = document.querySelector('[data-include*="sidebar"]');

  Promise.all([
    fetch('/components/header.html').then(r => r.text()),
    fetch('/components/sidebar.html').then(r => r.text())
  ]).then(([headerHtml, sidebarHtml]) => {
    if (headerDiv) headerDiv.innerHTML = headerHtml;
    if (sidebarDiv) sidebarDiv.innerHTML = sidebarHtml;
    initMenu();
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 0);
  }, { passive: true });

  initGallery();

  if (window.location.pathname.includes('posts')) loadPosts();
});

function initMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!sidebar || !overlay) return;

  const openSidebar = () => { sidebar.classList.add('open'); overlay.classList.add('active'); };
  const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); };

  document.querySelector('header .menu-toggle')?.addEventListener('click', openSidebar);
  document.querySelector('.sidebar .menu-toggle')?.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar a').forEach(a => a.addEventListener('click', closeSidebar));
}

function initGallery() {
  const gallery = document.querySelector('.gallery-grid');
  if (!gallery) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const figures = Array.from(gallery.querySelectorAll('figure'));
  let currentIndex = 0;

  figures.forEach((fig, i) => {
    fig.addEventListener('click', () => { currentIndex = i; showLightbox(fig.querySelector('img')); });
  });

  function showLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() { lightbox.setAttribute('aria-hidden', 'true'); }

  function showNext() {
    currentIndex = (currentIndex + 1) % figures.length;
    showLightbox(figures[currentIndex].querySelector('img'));
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + figures.length) % figures.length;
    showLightbox(figures[currentIndex].querySelector('img'));
  }

  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-next')?.addEventListener('click', showNext);
  document.querySelector('.lightbox-prev')?.addEventListener('click', showPrev);
  document.querySelector('.gallery-arrow.next')?.addEventListener('click', showNext);
  document.querySelector('.gallery-arrow.prev')?.addEventListener('click', showPrev);

  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
    }
  });
}

function loadPosts() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  fetch('/posts_index.json')
    .then(r => r.json())
    .then(posts => {
      grid.innerHTML = posts.map(post => `
        <article class="post-card" onclick="location.href='${post.url}'">
          <h3>${post.title}</h3>
          <time class="date">${new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
          <p>${post.desc}</p>
        </article>
      `).join('');
    })
    .catch(() => { grid.innerHTML = '<p class="loading">No posts found</p>'; });
}
