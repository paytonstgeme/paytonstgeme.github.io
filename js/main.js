// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');

  function openMenu() {
    menuBtn.classList.add('open');
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
  function closeMenu() {
    menuBtn.classList.remove('open');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  menuBtn.addEventListener('click', () => sidebar.classList.contains('open') ? closeMenu() : openMenu());
  overlay.addEventListener('click', closeMenu);

  // Highlight active page
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn   = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');

  const toggleMenu = () => {
    menuBtn.classList.toggle('open');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  };

  menuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Highlight current page
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href').endsWith(path)) {
      link.classList.add('active');
    }
  });
});