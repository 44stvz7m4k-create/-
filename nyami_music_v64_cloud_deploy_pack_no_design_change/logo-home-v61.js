
(() => {
  "use strict";

  function goHome() {
    try {
      if (typeof hideSearchPopover === "function") hideSearchPopover();
    } catch {}

    try {
      const input = document.querySelector("#searchInput");
      if (input) {
        input.value = "";
        document.querySelector("#searchBox")?.classList.remove("has-value");
      }
    } catch {}

    try {
      if (typeof setView === "function") {
        setView("home");
      } else {
        document.querySelector('.nav-item[data-view="home"]')?.click();
      }
    } catch {
      document.querySelector('.nav-item[data-view="home"]')?.click();
    }

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  function boot() {
    const brand = document.querySelector(".brand");
    if (!brand || brand.dataset.logoHomeBoundV61) return;

    brand.dataset.logoHomeBoundV61 = "1";
    brand.classList.add("brand-home-v61");
    brand.setAttribute("role", "button");
    brand.setAttribute("tabindex", "0");
    brand.setAttribute("aria-label", "Go to home");

    brand.addEventListener("click", (event) => {
      event.preventDefault();
      goHome();
    });

    brand.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goHome();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiLogoHomeV61 = { goHome };
})();
