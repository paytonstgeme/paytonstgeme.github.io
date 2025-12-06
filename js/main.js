// Inject header & sidebar, then initialise menu
async function includeHTML() {
  const elements = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(elements).map(async el => {
    const file = el.getAttribute('data-include');
    const resp = await fetch(file);
    if (resp.ok) el.outerHTML = await resp.text();
  }));

  // Now the header definitely exists → safe to attach events
  initMobileMenu();
}

function initMobileMenu() {
  const menuBtn = document.querySelector('.header .menu-button');
  const closeBtn = document.querySelector('.sidebar .close-btn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');

  if (!menuBtn) return;

  menuBtn.addEventListener('click', () => document.body.classList.add('menu-open'));
  closeBtn?.addEventListener('click', () => document.body.classList.remove('menu-open'));
  backdrop?.addEventListener('click', () => document.body.classList.remove('menu-open'));
}

includeHTML();

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load header and sidebar components
  Promise.all([
    fetch("components/header.html").then(r => r.ok ? r.text() : "<!-- header failed -->"),
    fetch("components/sidebar.html").then(r => r.ok ? r.text() : "<!-- sidebar failed -->")
  ])
  .then(([headerHTML, sidebarHTML]) => {
    // Replace placeholders with real components
    const headerPlaceholder = document.getElementById("header-placeholder");
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");

    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHTML;
    if (sidebarPlaceholder) sidebarPlaceholder.outerHTML = sidebarHTML;

    initMobileMenu();
    initPostsList();
  })
  .catch(err => {
    console.error("Failed to load header/sidebar:", err);
  });

  function initMobileMenu() {
    const menuBtn   = document.querySelector(".header .menu-button");
    const closeBtn  = document.querySelector(".sidebar .close-btn");
    const sidebar   = document.getElementById("sidebar");
    const backdrop  = document.getElementById("backdrop");

    if (!sidebar) return; // safety

    function openMenu() {
      document.body.classList.add("menu-open");
      sidebar.classList.add("open");
      backdrop.classList.add("open");
      sidebar.setAttribute("aria-hidden", "false");
    }

    function closeMenu() {
      document.body.classList.remove("menu-open");
      sidebar.classList.remove("open");
      backdrop.classList.remove("open");
      sidebar.setAttribute("aria-hidden", "true");
    }

    menuBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    backdrop?.addEventListener("click", closeMenu);

    // Optional: close with Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && sidebar.classList.contains("open")) closeMenu();
    });
  }

  function initPostsList() {
    const listContainer = document.getElementById("posts-list");
    if (!listContainer) return;

    fetch("posts_index.json")
      .then(r => r.ok ? r.json() : [])
      .then(posts => {
        if (!posts || posts.length === 0) {
          listContainer.innerHTML = "<p style='text-align:center;color:var(--muted)'>No posts yet.</p>";
          return;
        }

        const ul = document.createElement("ul");
        ul.className = "list";

        posts.forEach(p => {
          const li = document.createElement("li");
          li.className = "item";

          const date = p.date
            ? new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";

          li.innerHTML = `
            <a href="${p.url}" class="item-title">${p.title || "Untitled"}</a>
            ${p.desc ? `<p class="item-desc">${p.desc}</p>` : ""}
            ${date ? `<time class="item-date">${date}</time>` : ""}
          `;
          ul.appendChild(li);
        });

        listContainer.innerHTML = "";
        listContainer.appendChild(ul);
      })
      .catch(err => {
        listContainer.innerHTML = "<p style='text-align:center;color:var(--muted)'>Could not load posts.</p>";
        console.error(err);
      });
  }
});

// js/main.js (add this at the end if not already there)

document.addEventListener('DOMContentLoaded', async () => {
  await includeHTML();        // injects header + sidebar
  initMobileMenu();           // attaches menu events

  // Auto-load posts only on the Posts page
  if (window.location.pathname.includes('posts.html') || window.location.pathname === '/posts') {
    const script = document.createElement('script');
    script.src = '/js/build_posts_index.js';
    script.type = 'module';
    document.body.appendChild(script);
  }
});
