// Load header and sidebar components
document.addEventListener('DOMContentLoaded', () => {
  // Inject header
  fetch('/components/header.html')
    .then(res => res.text())
    .then(html => {
      const headerDiv = document.querySelector('[data-include*="header"]');
      if (headerDiv) {
        headerDiv.innerHTML = html;
        initMenu();
      }
    });

  // Inject sidebar
  fetch('/components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      const sidebarDiv = document.querySelector('[data-include*="sidebar"]');
      if (sidebarDiv) {
        sidebarDiv.innerHTML = html;
        initMenu();
      }
    });

  // Scroll header shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 0);
    }
  });

  // Gallery lightbox
  initGallery();
  
  // Posts loading
  if (window.location.pathname.includes('posts')) {
    loadPosts();
  }
});

function initMenu() {
  const toggles = document.querySelectorAll('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('active');
    });
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  });
}

function initGallery() {
  const gallery = document.querySelector('.gallery-grid');
  if (!gallery) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const figures = Array.from(gallery.querySelectorAll('figure'));

  let currentIndex = 0;

  figures.forEach((figure, index) => {
    figure.addEventListener('click', () => {
      currentIndex = index;
      showLightbox(figure.querySelector('img'));
    });
  });

  function showLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
  }

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

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });
}

function loadPosts() {
  fetch('/posts_index.json')
    .then(res => res.json())
    .then(posts => {
      const grid = document.getElementById('posts-grid');
      if (!grid) return;

      grid.innerHTML = posts.map(post => `
        <article class="post-card" onclick="location.href='${post.url}'">
          <h3>${post.title}</h3>
          <time class="date">${new Date(post.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</time>
          <p>${post.desc}</p>
        </article>
      `).join('');
    })
    .catch(() => {
      const grid = document.getElementById('posts-grid');
      if (grid) grid.innerHTML = '<p class="loading">No posts found</p>';
    });
}
