// js/main.js — FINAL 2025 VERSION
// One file. Zero conflicts. Works locally + deployed.

async function includeHTML() {
  const elements = document.querySelectorAll('[data-include]');
  for (const el of elements) {
    const file = el.getAttribute('data-include');
    try {
      const resp = await fetch(file);
      if (resp.ok) {
        el.outerHTML = await resp.text();
      } else {
        el.outerHTML = `<!-- Failed to load ${file} -->`;
      }
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
      el.outerHTML = `<!-- Error loading ${file} -->`;
    }
  }
}

function initMobileMenu() {
  const menuBtn  = document.querySelector('.menu-button');
  const closeBtn = document.querySelector('.close-btn');
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');

  if (!menuBtn || !sidebar || !backdrop) return;

  const openMenu = () => {
    document.body.classList.add('menu-open');
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
  });
}

// Optional: Auto-load posts index on /posts.html (uncomment when ready)
// function loadPostsIndex() {
//   if (!location.pathname.includes('posts')) return;
//   import('./build_posts_index.js').catch(() => console.warn('Posts index not loaded'));
// }

document.addEventListener('DOMContentLoaded', async () => {
  await includeHTML();     // 1. Inject header + sidebar
  initMobileMenu();        // 2. Attach menu events (now safe — DOM exists)

// Lightbox for Views page
if (document.getElementById('gallery')) {
  const images = document.querySelectorAll('.gallery-grid img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryPrevBtn = document.querySelector('.gallery-arrow.prev');
  const galleryNextBtn = document.querySelector('.gallery-arrow.next');
  let currentIndex = 0;

  const openLightbox = (i) => {
    currentIndex = i;
    lightboxImg.src = images[i].src;
    lightboxImg.alt = images[i].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

    const showPrev = () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(prevIndex);
  };
  const showNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    openLightbox(nextIndex);
  };

  images.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
  lightbox.addEventListener('click', e => e.target === lightbox && closeLightbox());
  galleryPrevBtn?.addEventListener('click', showPrev);
  galleryNextBtn?.addEventListener('click', showNext);
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}
});
