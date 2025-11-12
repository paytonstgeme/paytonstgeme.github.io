// scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  function open() {
    menuBtn.textContent = 'menu_open';
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
  function close() {
    menuBtn.textContent = 'menu';
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  menuBtn.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => e.key === 'Escape' && sidebar.classList.contains('open') && close());

  // Highlight active nav link
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
});
