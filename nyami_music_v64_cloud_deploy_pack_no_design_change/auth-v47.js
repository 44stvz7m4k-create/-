
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const TEXT = {
    uk: {
      kicker: "nyami secure account",
      loginTitle: "Вхід у Nyami",
      registerTitle: "Створи акаунт",
      loginDesc: "Увійди саме тим способом і паролем, які вказував під час реєстрації.",
      registerDesc: "Обери email, нік або телефон. Потім вхід буде тільки з цими даними.",
      loginTab: "Вхід",
      registerTab: "Реєстрація",
      email: "Email",
      nick: "Нік",
      phone: "Телефон",
      name: "Імʼя",
      loginField: "Логін",
      password: "Пароль",
      repeat: "Повтори пароль",
      submitLogin: "Увійти",
      submitRegister: "Зареєструватися",
      guest: "Продовжити як гість",
      guestLimit: "Гість може слухати музику, але не може лайкати, створювати плейлисти й редагувати профіль.",
      c1: "✓ Python backend",
      c2: "✓ SQLite база",
      c3: "✓ Cookie-сесія",
      errName: "Введи імʼя від 2 символів",
      errEmail: "Введи нормальний email",
      errNick: "Нік: 3–24 символи, латиниця/цифри/._-",
      errPhone: "Телефон: мінімум 7 цифр",
      errPass: "Пароль мінімум 6 символів",
      errRepeat: "Паролі не збігаються",
      errTaken: "Такі дані вже зареєстровані",
      errWrong: "Невірний логін або пароль",
      errBackend: "Backend недоступний. Запусти START_WINDOWS.bat і відкрий http://127.0.0.1:5000",
      guestBlocked: "У гостьовому режимі ця дія недоступна. Зареєструй акаунт.",
      loading: "Зачекай…"
    },
    en: {
      kicker: "nyami secure account",
      loginTitle: "Sign in to Nyami",
      registerTitle: "Create account",
      loginDesc: "Sign in with the exact method and password used during registration.",
      registerDesc: "Choose email, handle, or phone. Login will work only with the same data.",
      loginTab: "Login",
      registerTab: "Register",
      email: "Email",
      nick: "Handle",
      phone: "Phone",
      name: "Name",
      loginField: "Login",
      password: "Password",
      repeat: "Repeat password",
      submitLogin: "Log in",
      submitRegister: "Register",
      guest: "Continue as guest",
      guestLimit: "Guests can listen, but cannot like, create playlists, or edit profile.",
      c1: "✓ Python backend",
      c2: "✓ SQLite database",
      c3: "✓ Cookie session",
      errName: "Enter a name with at least 2 characters",
      errEmail: "Enter a valid email",
      errNick: "Handle: 3–24 chars, letters/numbers/._-",
      errPhone: "Phone: at least 7 digits",
      errPass: "Password must be at least 6 characters",
      errRepeat: "Passwords do not match",
      errTaken: "These data are already registered",
      errWrong: "Wrong login or password",
      errBackend: "Backend unavailable. Run START_WINDOWS.bat and open http://127.0.0.1:5000",
      guestBlocked: "This action is unavailable in guest mode. Register an account.",
      loading: "Wait…"
    }
  };

  const state = {
    mode: "login",
    method: "email",
    session: null,
    mounted: false
  };

  function lang() {
    const htmlLang = document.documentElement.lang;
    const saved = localStorage.getItem("nyamiLang") || localStorage.getItem("nyami_language") || localStorage.getItem("nyami.lang");
    return (saved || htmlLang || "uk").startsWith("en") ? "en" : "uk";
  }

  function t(key) {
    return TEXT[lang()][key] || TEXT.uk[key] || key;
  }

  function toast(message) {
    if (typeof window.showToast === "function") {
      try {
        window.showToast(message);
        return;
      } catch {}
    }

    let box = $("#nyamiToastV47");
    if (!box) {
      box = document.createElement("div");
      box.id = "nyamiToastV47";
      box.style.cssText = `
        position:fixed; left:50%; bottom:120px; transform:translateX(-50%);
        z-index:2147483640; padding:10px 14px; border-radius:999px;
        color:white; background:linear-gradient(135deg,#efb5cf,#b79dff);
        box-shadow:0 14px 34px rgba(132,92,172,.24); font:800 12px system-ui;
        pointer-events:none; opacity:0; transition:opacity .18s ease, transform .18s ease;
      `;
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.style.opacity = "1";
    box.style.transform = "translateX(-50%) translateY(-3px)";
    clearTimeout(box._timer);
    box._timer = setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translateX(-50%)";
    }, 2100);
  }

  function purgeLegacyAuth() {
    const keys = [
      "nyamiAuth", "nyamiAuthSessionV1", "nyamiAuthUsersV1",
      "nyamiBackendToken", "nyamiV46Token", "nyamiV46State",
      "authToken", "demoAuth", "guestMode", "currentUser"
    ];

    keys.forEach((key) => {
      try { localStorage.removeItem(key); } catch {}
      try { sessionStorage.removeItem(key); } catch {}
    });

    ["#authScreen", "#authV46Screen"].forEach((sel) => {
      const node = $(sel);
      if (node) {
        node.setAttribute("aria-hidden", "true");
        node.style.display = "none";
        node.style.pointerEvents = "none";
      }
    });
  }

  function ensureOverlay() {
    let overlay = $("#nyamiAuthV47");
    if (overlay) return overlay;

    overlay = document.createElement("section");
    overlay.id = "nyamiAuthV47";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="nyami-auth-card-v47" role="dialog" aria-modal="true" aria-labelledby="nyamiAuthTitleV47">
        <div class="nyami-auth-head-v47">
          <div class="nyami-auth-logo-v47">猫</div>
          <div>
            <p class="nyami-auth-kicker-v47" data-v47="kicker"></p>
            <h1 class="nyami-auth-title-v47" id="nyamiAuthTitleV47"></h1>
          </div>
        </div>

        <p class="nyami-auth-desc-v47" id="nyamiAuthDescV47"></p>

        <div class="nyami-auth-tabs-v47" role="tablist" aria-label="Auth mode">
          <button type="button" data-mode="login"></button>
          <button type="button" data-mode="register"></button>
        </div>

        <div class="nyami-auth-methods-v47" role="group" aria-label="Login method">
          <button type="button" data-method="email"></button>
          <button type="button" data-method="nick"></button>
          <button type="button" data-method="phone"></button>
        </div>

        <div class="nyami-auth-summary-v47" id="nyamiAuthSummaryV47" role="alert"></div>

        <form class="nyami-auth-form-v47" id="nyamiAuthFormV47" novalidate>
          <div class="nyami-field-v47" data-field="name">
            <label for="nyamiAuthNameV47"></label>
            <input id="nyamiAuthNameV47" name="name" type="text" autocomplete="name" placeholder="Denis">
            <div class="nyami-field-error-v47" id="nyamiAuthNameErrorV47"></div>
          </div>

          <div class="nyami-field-v47" data-field="identifier">
            <label for="nyamiAuthIdentifierV47"></label>
            <input id="nyamiAuthIdentifierV47" name="identifier" type="email" autocomplete="username" placeholder="name@email.com">
            <div class="nyami-field-error-v47" id="nyamiAuthIdentifierErrorV47"></div>
          </div>

          <div class="nyami-field-v47" data-field="password">
            <label for="nyamiAuthPasswordV47"></label>
            <input id="nyamiAuthPasswordV47" name="password" type="password" autocomplete="current-password" placeholder="••••••••">
            <div class="nyami-field-error-v47" id="nyamiAuthPasswordErrorV47"></div>
          </div>

          <div class="nyami-field-v47" data-field="repeat">
            <label for="nyamiAuthRepeatV47"></label>
            <input id="nyamiAuthRepeatV47" name="passwordRepeat" type="password" autocomplete="new-password" placeholder="••••••••">
            <div class="nyami-field-error-v47" id="nyamiAuthRepeatErrorV47"></div>
          </div>

          <button class="nyami-auth-submit-v47" id="nyamiAuthSubmitV47" type="submit"></button>
        </form>

        <button class="nyami-auth-guest-v47" id="nyamiAuthGuestV47" type="button"></button>

        <p class="nyami-auth-limit-v47"></p>

        <div class="nyami-auth-checks-v47">
          <span data-check="c1"></span>
          <span data-check="c2"></span>
          <span data-check="c3"></span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function nodes() {
    return {
      overlay: $("#nyamiAuthV47"),
      title: $("#nyamiAuthTitleV47"),
      desc: $("#nyamiAuthDescV47"),
      form: $("#nyamiAuthFormV47"),
      name: $("#nyamiAuthNameV47"),
      ident: $("#nyamiAuthIdentifierV47"),
      pass: $("#nyamiAuthPasswordV47"),
      repeat: $("#nyamiAuthRepeatV47"),
      submit: $("#nyamiAuthSubmitV47"),
      guest: $("#nyamiAuthGuestV47"),
      summary: $("#nyamiAuthSummaryV47"),
      fieldName: $('.nyami-field-v47[data-field="name"]'),
      fieldIdent: $('.nyami-field-v47[data-field="identifier"]'),
      fieldPass: $('.nyami-field-v47[data-field="password"]'),
      fieldRepeat: $('.nyami-field-v47[data-field="repeat"]'),
      errName: $("#nyamiAuthNameErrorV47"),
      errIdent: $("#nyamiAuthIdentifierErrorV47"),
      errPass: $("#nyamiAuthPasswordErrorV47"),
      errRepeat: $("#nyamiAuthRepeatErrorV47")
    };
  }

  function updateTexts() {
    const n = nodes();

    $$("[data-v47]").forEach((el) => el.textContent = t(el.dataset.v47));
    $$("[data-check]").forEach((el) => el.textContent = t(el.dataset.check));

    n.title.textContent = t(state.mode === "register" ? "registerTitle" : "loginTitle");
    n.desc.textContent = t(state.mode === "register" ? "registerDesc" : "loginDesc");

    $('[data-mode="login"]').textContent = t("loginTab");
    $('[data-mode="register"]').textContent = t("registerTab");
    $('[data-method="email"]').textContent = t("email");
    $('[data-method="nick"]').textContent = t("nick");
    $('[data-method="phone"]').textContent = t("phone");

    $('label[for="nyamiAuthNameV47"]').textContent = t("name");
    $('label[for="nyamiAuthIdentifierV47"]').textContent =
      state.mode === "login"
        ? t("loginField")
        : state.method === "email"
          ? t("email")
          : state.method === "nick"
            ? t("nick")
            : t("phone");
    $('label[for="nyamiAuthPasswordV47"]').textContent = t("password");
    $('label[for="nyamiAuthRepeatV47"]').textContent = t("repeat");

    n.submit.textContent = t(state.mode === "register" ? "submitRegister" : "submitLogin");
    n.guest.textContent = t("guest");
    $(".nyami-auth-limit-v47").textContent = t("guestLimit");
  }

  function clearErrors() {
    const n = nodes();
    [n.fieldName, n.fieldIdent, n.fieldPass, n.fieldRepeat].forEach((field) => field?.classList.remove("has-error"));
    [n.errName, n.errIdent, n.errPass, n.errRepeat].forEach((el) => { if (el) el.textContent = ""; });
    if (n.summary) n.summary.textContent = "";
  }

  function setFieldError(field, message) {
    const n = nodes();
    const map = {
      name: [n.fieldName, n.errName],
      identifier: [n.fieldIdent, n.errIdent],
      password: [n.fieldPass, n.errPass],
      repeat: [n.fieldRepeat, n.errRepeat]
    };
    const [wrap, err] = map[field] || [];
    wrap?.classList.add("has-error");
    if (err) err.textContent = message;
    if (n.summary && !n.summary.textContent) n.summary.textContent = message;
  }

  function updateMode() {
    const n = nodes();

    $$("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === state.mode);
      button.setAttribute("aria-selected", button.dataset.mode === state.mode ? "true" : "false");
    });

    $$("[data-method]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.method === state.method);
    });

    n.fieldName.classList.toggle("is-hidden", state.mode !== "register");
    n.fieldRepeat.classList.toggle("is-hidden", state.mode !== "register");

    if (state.method === "email") {
      n.ident.type = "email";
      n.ident.placeholder = "name@email.com";
      n.ident.autocomplete = "email";
    } else if (state.method === "nick") {
      n.ident.type = "text";
      n.ident.placeholder = "@nyami";
      n.ident.autocomplete = "username";
    } else {
      n.ident.type = "tel";
      n.ident.placeholder = "+380...";
      n.ident.autocomplete = "tel";
    }

    n.pass.autocomplete = state.mode === "register" ? "new-password" : "current-password";

    updateTexts();
    clearErrors();
  }

  function normalizeIdentifier(value) {
    value = String(value || "").trim().toLowerCase();

    if (state.method === "email") return value.replace(/\s+/g, "");
    if (state.method === "nick") return value.replace(/\s+/g, "").replace(/^@/, "");
    if (state.method === "phone") {
      const plus = value.startsWith("+") ? "+" : "";
      return plus + value.replace(/[^\d]/g, "");
    }

    return value;
  }

  function validate() {
    clearErrors();

    const n = nodes();
    let ok = true;

    const name = n.name.value.trim();
    const identifier = normalizeIdentifier(n.ident.value);
    const pass = n.pass.value;
    const repeat = n.repeat.value;

    if (state.mode === "register" && name.length < 2) {
      setFieldError("name", t("errName"));
      ok = false;
    }

    if (state.method === "email") {
      const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier);
      if (!isEmail) {
        setFieldError("identifier", t("errEmail"));
        ok = false;
      }
    }

    if (state.method === "nick") {
      if (!/^[a-z0-9._-]{3,24}$/i.test(identifier)) {
        setFieldError("identifier", t("errNick"));
        ok = false;
      }
    }

    if (state.method === "phone") {
      const digits = identifier.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) {
        setFieldError("identifier", t("errPhone"));
        ok = false;
      }
    }

    if (pass.length < 6) {
      setFieldError("password", t("errPass"));
      ok = false;
    }

    if (state.mode === "register" && pass !== repeat) {
      setFieldError("repeat", t("errRepeat"));
      ok = false;
    }

    return ok;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Accept": "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      const error = new Error(data?.error?.message || "API error");
      error.status = response.status;
      error.code = data?.error?.code || "api_error";
      error.fields = data?.error?.fields || {};
      throw error;
    }
    return data;
  }

  function applySession(sessionPayload) {
    state.session = sessionPayload;

    document.body.classList.remove("nyami-v47-locked", "nyami-v47-upgrade", "auth-required");
    document.body.classList.toggle("nyami-guest-v47", !!sessionPayload.guest);

    const overlay = $("#nyamiAuthV47");
    if (overlay) overlay.setAttribute("aria-hidden", "true");

    window.authState = {
      isLoggedIn: !!sessionPayload.authenticated,
      isGuest: !!sessionPayload.guest,
      userId: sessionPayload.user?.id || null,
      name: sessionPayload.user?.name || (sessionPayload.guest ? "Guest" : ""),
      handle: sessionPayload.user?.handle || sessionPayload.user?.profile?.handle || (sessionPayload.guest ? "@guest" : "")
    };

    if (sessionPayload.user?.profile) {
      try {
        localStorage.setItem("nyamiProfile", JSON.stringify({
          ...(JSON.parse(localStorage.getItem("nyamiProfile") || "{}")),
          ...sessionPayload.user.profile
        }));
      } catch {
        localStorage.setItem("nyamiProfile", JSON.stringify(sessionPayload.user.profile));
      }
    }

    try { window.updateProfileUI?.(); } catch {}
    try { window.renderTopProfileAvatar?.(); } catch {}
    try { window.renderProfileDropdown?.(); } catch {}
  }


  function syncGuestAuthUI() {
    const isAuthenticated = !!window.authState?.isLoggedIn && !window.authState?.isGuest;
    const isGuest = !isAuthenticated;

    document.body.classList.toggle("nyami-public-guest-v49", isGuest);
    document.body.classList.toggle("nyami-public-user-v49", isAuthenticated);

    const topActions = $(".top-actions");
    const profileChip = $("#profileOpenBtn");

    if (topActions && !$("#nyamiPublicAuthButtonsV49")) {
      const box = document.createElement("div");
      box.id = "nyamiPublicAuthButtonsV49";
      box.className = "nyami-public-auth-buttons-v49";
      box.innerHTML = `
        <button type="button" data-nyami-auth-open="login">Увійти</button>
        <button type="button" data-nyami-auth-open="register">Реєстрація</button>
      `;

      if (profileChip) {
        topActions.insertBefore(box, profileChip);
      } else {
        topActions.appendChild(box);
      }
    }

    const publicButtons = $("#nyamiPublicAuthButtonsV49");
    if (publicButtons) {
      publicButtons.hidden = !isGuest;
    }

    const logoutButton = $('[data-profile-menu-action="logout"]');
    if (logoutButton) {
      logoutButton.hidden = isGuest;
      logoutButton.style.display = isGuest ? "none" : "";
    }

    const dropdown = $("#profileDropdown");
    if (dropdown && !$("#nyamiProfileAuthMenuV49")) {
      const menu = document.createElement("div");
      menu.id = "nyamiProfileAuthMenuV49";
      menu.className = "nyami-profile-auth-menu-v49";
      menu.innerHTML = `
        <div class="profile-dropdown-line"></div>
        <button type="button" role="menuitem" data-nyami-auth-open="login">
          <span>↪</span>
          <b>Увійти</b>
        </button>
        <button type="button" role="menuitem" data-nyami-auth-open="register">
          <span>＋</span>
          <b>Реєстрація</b>
        </button>
      `;
      dropdown.appendChild(menu);
    }

    const menu = $("#nyamiProfileAuthMenuV49");
    if (menu) {
      menu.hidden = !isGuest;
      menu.style.display = isGuest ? "" : "none";
    }

    if (isGuest) {
      const chipName = $("#profileChipName");
      const dropdownName = $("#profileDropdownName");
      const dropdownHandle = $("#profileDropdownHandle");

      if (chipName) chipName.textContent = lang() === "en" ? "Account" : "Акаунт";
      if (dropdownName) dropdownName.textContent = lang() === "en" ? "Guest mode" : "Гостьовий режим";
      if (dropdownHandle) dropdownHandle.textContent = lang() === "en" ? "login or register" : "увійди або зареєструйся";
    }

    document.querySelectorAll('[data-settings-action="logout"]').forEach((button) => {
      button.hidden = isGuest;
      button.style.display = isGuest ? "none" : "";
    });
  }

  function applyGuestSession() {
    applySession({
      ok: true,
      authenticated: false,
      guest: true,
      admin: false,
      role: "guest",
      user: null,
      permissions: {
        canListen: true,
        canLike: false,
        canCreatePlaylist: false,
        canEditProfile: false,
        canAdmin: false
      }
    });
  }


  function showAuth(upgrade = false) {
    if (document.body.classList.contains("nyami-admin-open")) return;
    ensureOverlay();
    updateMode();
    document.body.classList.add("nyami-v47-locked");
    document.body.classList.toggle("nyami-v47-upgrade", upgrade);
    document.body.classList.remove("auth-required");
    $("#nyamiAuthV47").setAttribute("aria-hidden", "false");
    setTimeout(() => nodes().ident?.focus?.(), 50);
  }

  async function checkSession() {
    try {
      const session = await api("/api/session");
      if (session.authenticated || session.guest) {
        applySession(session);
      } else {
        showAuth(false);
      }
    } catch {
      showAuth(false);
      nodes().summary.textContent = t("errBackend");
    }
  }

  function mapApiError(error) {
    if (error.status === 409 || error.code === "identifier_taken") return t("errTaken");
    if (error.status === 401 || error.code === "invalid_credentials") return t("errWrong");
    if (error.status === 0 || error instanceof TypeError) return t("errBackend");
    if (error.code === "validation_error") return "";
    return error.message || t("errBackend");
  }

  function applyServerFieldErrors(error) {
    const fields = error.fields || {};
    if (fields.name) setFieldError("name", fields.name);
    if (fields.email || fields.nick || fields.phone || fields.identifier) {
      setFieldError("identifier", fields.email || fields.nick || fields.phone || fields.identifier);
    }
    if (fields.password) setFieldError("password", fields.password);
    if (fields.passwordRepeat) setFieldError("repeat", fields.passwordRepeat);
  }

  async function submit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!validate()) return;

    const n = nodes();
    n.submit.classList.add("is-loading");
    n.submit.textContent = t("loading");

    const identifier = normalizeIdentifier(n.ident.value);
    const payload = {
      loginType: state.method,
      method: state.method,
      name: n.name.value.trim(),
      password: n.pass.value,
      passwordRepeat: n.repeat.value,
      confirmPassword: n.repeat.value
    };

    if (state.method === "email") payload.email = identifier;
    if (state.method === "nick") payload.nick = identifier;
    if (state.method === "phone") payload.phone = identifier;

    try {
      if (state.mode === "register") {
        await api("/api/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      } else {
        await api("/api/login", {
          method: "POST",
          body: JSON.stringify({
            method: state.method,
            identifier,
            login: identifier,
            password: n.pass.value
          })
        });
      }

      const session = await api("/api/session");
      applySession(session);
      toast(state.mode === "register" ? "Акаунт створено" : "Вхід виконано");
    } catch (error) {
      applyServerFieldErrors(error);
      const msg = mapApiError(error);
      if (msg) n.summary.textContent = msg;
      toast(msg || t("errBackend"));
    } finally {
      n.submit.classList.remove("is-loading");
      updateTexts();
    }
  }

  async function guest(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    try {
      await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ mode: "guest" })
      });
      const session = await api("/api/session");
      applySession(session);
      toast(TEXT[lang()].guestLimit);
    } catch {
      nodes().summary.textContent = t("errBackend");
    }
  }

  function blockGuestAction(event) {
    const isGuest = state.session?.guest || window.authState?.isGuest;
    if (!isGuest) return;

    const target = event.target.closest(`
      #bottomLikeBtn,
      #rightLikeBtn,
      #bottomAddBtn,
      [data-profile-menu-action="edit"],
      [data-settings-action="edit-profile"],
      [data-settings-action="clear-likes"],
      [data-settings-action="clear-playlists"],
      [data-settings-action="clear-all"],
      [data-playlist-create],
      #saveProfileBtn,
      .playlist-create,
      .create-playlist
    `);

    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    showAuth(true);
    nodes().summary.textContent = t("guestBlocked");
    toast(t("guestBlocked"));
  }

  async function logout() {
    try {
      await api("/api/logout", { method: "POST", body: JSON.stringify({}) });
    } catch {}

    document.body.classList.remove("nyami-guest-v47");
    window.authState = { isLoggedIn: false, isGuest: false, name: "", handle: "" };
    showAuth(false);
    toast("Вийшов з акаунта");
  }

  function bind() {
    if (state.mounted) return;
    state.mounted = true;

    ensureOverlay();
    updateMode();

    $("#nyamiAuthFormV47").addEventListener("submit", submit, true);
    $("#nyamiAuthGuestV47").addEventListener("click", guest, true);

    $$("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        updateMode();
      }, true);
    });

    $$("[data-method]").forEach((button) => {
      button.addEventListener("click", () => {
        state.method = button.dataset.method;
        updateMode();
      }, true);
    });

    $$("#nyamiAuthV47 input").forEach((input) => {
      input.disabled = false;
      input.readOnly = false;
      input.addEventListener("input", clearErrors, true);
      input.addEventListener("pointerdown", (event) => event.stopPropagation(), true);
      input.addEventListener("click", (event) => event.stopPropagation(), true);
    });

    document.addEventListener("click", blockGuestAction, true);

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-nyami-auth-open]");
      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      state.mode = button.dataset.nyamiAuthOpen === "register" ? "register" : "login";
      showAuth(false);
      updateMode();
    }, true);

    const syncTimer = setInterval(syncGuestAuthUI, 600);
    window.addEventListener("beforeunload", () => clearInterval(syncTimer));


    window.nyamiAuthV47 = {
      show: showAuth,
      logout,
      session: () => state.session
    };

    window.logoutUser = logout;
  }

  function boot() {
    purgeLegacyAuth();
    bind();

    if (location.protocol === "file:") {
      showAuth(false);
      nodes().summary.textContent = t("errBackend");
      return;
    }

    checkSession();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
