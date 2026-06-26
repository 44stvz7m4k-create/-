
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  const TEXT = {
    uk: {
      title: "Або увійди через",
      google: "Google",
      apple: "Apple",
      disabled: "Провайдер не налаштований"
    },
    en: {
      title: "Or continue with",
      google: "Google",
      apple: "Apple",
      disabled: "Provider is not configured"
    }
  };

  function lang() {
    return localStorage.getItem("nyamiLanguage") === "en" ? "en" : "uk";
  }

  function t(key) {
    return TEXT[lang()][key] || TEXT.uk[key] || key;
  }

  async function config() {
    try {
      const response = await fetch("/api/auth/social/config", {
        credentials: "same-origin",
        headers: { "Accept": "application/json" }
      });
      const data = await response.json();
      return data.providers || {};
    } catch {
      return {};
    }
  }

  function ensureBox(providers = {}) {
    const form = $("#nyamiAuthFormV47");
    if (!form || $("#nyamiSocialAuthV57")) return;

    const box = document.createElement("div");
    box.id = "nyamiSocialAuthV57";
    box.className = "nyami-social-auth-v57";
    box.innerHTML = `
      <div class="nyami-social-divider-v57"><span>${t("title")}</span></div>
      <div class="nyami-social-grid-v57">
        <button type="button" class="nyami-auth-guest-v47 nyami-social-btn-v57" data-social-provider="google">
          <span>G</span><b>${t("google")}</b>
        </button>
        <button type="button" class="nyami-auth-guest-v47 nyami-social-btn-v57" data-social-provider="apple">
          <span></span><b>${t("apple")}</b>
        </button>
      </div>
    `;

    form.parentNode.insertBefore(box, form);

    box.querySelectorAll("[data-social-provider]").forEach((button) => {
      const provider = button.dataset.socialProvider;
      button.hidden = !providers[provider];

      button.addEventListener("click", () => {
        if (!providers[provider]) {
          try { showToast(t("disabled")); } catch {}
          return;
        }
        window.location.href = `/api/auth/${provider}/start`;
      });
    });

    if (!providers.google && !providers.apple) {
      box.hidden = true;
    }
  }

  function showAuthStatusToast() {
    const params = new URLSearchParams(location.search);
    const value = params.get("auth");
    if (!value) return;

    const messages = {
      "social-ok": "Вхід виконано",
      "social-provider-disabled": "Провайдер не налаштований",
      "social-state-error": "Помилка OAuth state",
      "social-token-error": "Помилка OAuth token",
      "social-google-error": "Помилка входу Google",
      "social-apple-error": "Помилка входу Apple"
    };

    try { showToast(messages[value] || value); } catch {}

    params.delete("auth");
    const next = location.pathname + (params.toString() ? `?${params.toString()}` : "") + location.hash;
    history.replaceState(null, "", next);
  }

  async function boot() {
    const providers = await config();

    const mount = () => ensureBox(providers);
    mount();
    setInterval(mount, 700);

    showAuthStatusToast();

    window.addEventListener("storage", () => {
      const box = $("#nyamiSocialAuthV57");
      if (box) box.querySelector(".nyami-social-divider-v57 span").textContent = t("title");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
