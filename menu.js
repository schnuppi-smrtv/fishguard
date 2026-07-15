function initMenu() {
  const menuButton = document.getElementById("menu-button");
  const navMenu = document.getElementById("nav-menu");
  const menu = menuButton?.closest(".menu");
  if (!menuButton || !navMenu || !menu) return;

  function closeMenu() {
    navMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = !navMenu.hidden;
    navMenu.hidden = isOpen;
    menuButton.setAttribute("aria-expanded", String(!isOpen));
  }

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  navMenu.querySelectorAll(".nav-menu__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.hidden && !menu.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

initMenu();
