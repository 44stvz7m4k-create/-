
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ADMIN_I18N = {
    uk: {
      ownerControl: "owner control",
      title: "Адмін-панель",
      desc: "Керування треками й джерелами прямо всередині Nyami Music.",
      refresh: "Оновити",
      back: "Назад на сайт",
      logout: "Вийти",
      theme: "Тема",
      ownerOnly: "owner only",
      loginTitle: "Вхід в адмінку",
      login: "Логін",
      password: "Пароль",
      enter: "Увійти",
      checking: "Перевірка…",
      wrong: "Невірний логін або пароль.",
      tracks: "Треки",
      users: "Користувачі",
      sessions: "Сесії",
      uploadKicker: "sources",
      addTrack: "Додати трек / джерело",
      source: "Джерело",
      sourceUpload: "Upload file",
      sourceDirect: "Direct audio URL",
      sourceYoutube: "YouTube link",
      sourceSpotify: "Spotify link",
      trackTitle: "Назва треку",
      artist: "Виконавець",
      audioFile: "Аудіофайл",
      coverFile: "Обкладинка",
      audioHint: "MP3 / WAV / OGG / M4A",
      coverHint: "JPG / PNG / WEBP",
      sourceUrl: "Посилання",
      sourceUrlHint: "https://...",
      coverUrl: "URL обкладинки",
      coverUrlHint: "можна залишити порожнім",
      sourceHelpUpload: "Файл збережеться на нашому сервері й буде грати в основному плеєрі.",
      sourceHelpDirect: "Пряме посилання на аудіо буде грати в основному плеєрі.",
      sourceHelpYoutube: "YouTube додається як зовнішня картка з переходом за посиланням.",
      sourceHelpSpotify: "Spotify додається як зовнішня картка з переходом за посиланням.",
      upload: "Додати",
      uploading: "Додавання…",
      uploaded: "Додано. Сайт оновлено.",
      uploadFailed: "Не вдалося додати.",
      serverTracks: "library",
      trackList: "Список джерел",
      empty: "Поки нічого немає. Додай перший трек.",
      delete: "Видалити",
      deleteConfirm: "Видалити це джерело?",
      deleteFailed: "Не вдалося видалити.",
      adminHidden: "Адмінка прихована. Звичайні користувачі її не бачать."
    },
    en: {
      ownerControl: "owner control",
      title: "Admin panel",
      desc: "Manage tracks and sources directly inside Nyami Music.",
      refresh: "Refresh",
      back: "Back to site",
      logout: "Logout",
      theme: "Theme",
      ownerOnly: "owner only",
      loginTitle: "Admin login",
      login: "Login",
      password: "Password",
      enter: "Enter admin",
      checking: "Checking…",
      wrong: "Wrong admin login or password.",
      tracks: "Tracks",
      users: "Users",
      sessions: "Sessions",
      uploadKicker: "sources",
      addTrack: "Add track / source",
      source: "Source",
      sourceUpload: "Upload file",
      sourceDirect: "Direct audio URL",
      sourceYoutube: "YouTube link",
      sourceSpotify: "Spotify link",
      trackTitle: "Track title",
      artist: "Artist",
      audioFile: "Audio file",
      coverFile: "Cover image",
      audioHint: "MP3 / WAV / OGG / M4A",
      coverHint: "JPG / PNG / WEBP",
      sourceUrl: "Link",
      sourceUrlHint: "https://...",
      coverUrl: "Cover URL",
      coverUrlHint: "can be empty",
      sourceHelpUpload: "The file is stored on our server and plays in the main player.",
      sourceHelpDirect: "Direct audio URL plays in the main player.",
      sourceHelpYoutube: "YouTube is added as an external card with a link.",
      sourceHelpSpotify: "Spotify is added as an external card with a link.",
      upload: "Add",
      uploading: "Adding…",
      uploaded: "Added. Site updated.",
      uploadFailed: "Could not add.",
      serverTracks: "library",
      trackList: "Source list",
      empty: "Nothing yet. Add the first track.",
      delete: "Delete",
      deleteConfirm: "Delete this source?",
      deleteFailed: "Delete failed.",
      adminHidden: "Admin is hidden. Regular users do not see it."
    }
  };

  const state = {
    admin: false,
    tracks: [],
    stats: { users: 0, tracks: 0, sessions: 0 }
  };

  function lang() {
    return localStorage.getItem("nyamiLanguage") === "en" ? "en" : "uk";
  }

  function t(key) {
    return ADMIN_I18N[lang()][key] || ADMIN_I18N.uk[key] || key;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Accept": "application/json",
        ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      const error = new Error(data?.error?.message || "API error");
      error.status = response.status;
      error.code = data?.error?.code || "api_error";
      throw error;
    }
    return data;
  }

  function ensureAdminPanel() {
    let root = $("#nyamiAdminV48");
    if (root) return root;

    root = document.createElement("section");
    root.id = "nyamiAdminV48";
    root.innerHTML = `
      <div class="nyami-admin-shell">
        <div class="nyami-admin-hero">
          <div>
            <p class="nyami-admin-kicker" data-admin-i18n="ownerControl"></p>
            <h1 data-admin-i18n="title"></h1>
            <p data-admin-i18n="desc"></p>
            <small class="nyami-admin-safe-note" data-admin-i18n="adminHidden"></small>
          </div>
          <div class="nyami-admin-actions">
            <div class="nyami-admin-switchers">
              <button class="nyami-admin-mini-btn" id="nyamiAdminTheme" type="button" data-admin-i18n-title="theme">☾</button>
              <button class="nyami-admin-mini-btn" data-admin-lang="uk" type="button">UA</button>
              <button class="nyami-admin-mini-btn" data-admin-lang="en" type="button">EN</button>
            </div>
            <button class="nyami-admin-btn is-ghost" id="nyamiAdminRefresh" type="button" data-admin-i18n="refresh"></button>
            <button class="nyami-admin-btn is-ghost" id="nyamiAdminClose" type="button" data-admin-i18n="back"></button>
            <button class="nyami-admin-btn is-danger" id="nyamiAdminLogout" type="button" data-admin-i18n="logout"></button>
          </div>
        </div>

        <div id="nyamiAdminLoginBox" class="nyami-admin-card nyami-admin-login">
          <p class="nyami-admin-kicker" data-admin-i18n="ownerOnly"></p>
          <h2 data-admin-i18n="loginTitle"></h2>
          <form class="nyami-admin-form" id="nyamiAdminLoginForm">
            <label class="nyami-admin-label">
              <span data-admin-i18n="login"></span>
              <input id="nyamiAdminLogin" name="login" autocomplete="username" placeholder="admin" required>
            </label>
            <label class="nyami-admin-label">
              <span data-admin-i18n="password"></span>
              <input id="nyamiAdminPassword" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required>
            </label>
            <button class="nyami-admin-btn" type="submit" data-admin-i18n="enter"></button>
            <div class="nyami-admin-message" id="nyamiAdminLoginMsg"></div>
          </form>
        </div>

        <div id="nyamiAdminDashboard" hidden>
          <div class="nyami-admin-stats">
            <article><span data-admin-i18n="tracks"></span><b id="nyamiAdminStatTracks">0</b></article>
            <article><span data-admin-i18n="users"></span><b id="nyamiAdminStatUsers">0</b></article>
            <article><span data-admin-i18n="sessions"></span><b id="nyamiAdminStatSessions">0</b></article>
          </div>

          <div class="nyami-admin-grid">
            <div class="nyami-admin-card">
              <p class="nyami-admin-kicker" data-admin-i18n="uploadKicker"></p>
              <h2 data-admin-i18n="addTrack"></h2>

              <form class="nyami-admin-form" id="nyamiAdminUploadForm">
                <label class="nyami-admin-label">
                  <span data-admin-i18n="source"></span>
                  <select name="sourceType" id="nyamiAdminSourceType">
                    <option value="upload" data-admin-i18n="sourceUpload"></option>
                    <option value="direct" data-admin-i18n="sourceDirect"></option>
                    <option value="youtube" data-admin-i18n="sourceYoutube"></option>
                    <option value="spotify" data-admin-i18n="sourceSpotify"></option>
                  </select>
                </label>

                <div class="nyami-admin-row">
                  <label class="nyami-admin-label">
                    <span data-admin-i18n="trackTitle"></span>
                    <input name="title" placeholder="Midnight Angel" required>
                  </label>
                  <label class="nyami-admin-label">
                    <span data-admin-i18n="artist"></span>
                    <input name="artist" placeholder="Nyami" required>
                  </label>
                </div>

                <div class="nyami-admin-upload-fields" data-source-fields="upload">
                  <div class="nyami-admin-file-grid">
                    <label class="nyami-admin-file">
                      <b data-admin-i18n="audioFile"></b>
                      <small data-file-name data-admin-i18n="audioHint"></small>
                      <input name="audio" type="file" accept=".mp3,.wav,.ogg,.m4a,audio/*">
                    </label>
                    <label class="nyami-admin-file">
                      <b data-admin-i18n="coverFile"></b>
                      <small data-file-name data-admin-i18n="coverHint"></small>
                      <input name="cover" type="file" accept=".jpg,.jpeg,.png,.webp,image/*">
                    </label>
                  </div>
                </div>

                <div class="nyami-admin-external-fields" data-source-fields="external" hidden>
                  <label class="nyami-admin-label">
                    <span data-admin-i18n="sourceUrl"></span>
                    <input name="url" type="url" placeholder="https://...">
                  </label>
                  <label class="nyami-admin-label">
                    <span data-admin-i18n="coverUrl"></span>
                    <input name="coverUrl" type="url" placeholder="">
                  </label>
                </div>

                <p class="nyami-admin-source-help" id="nyamiAdminSourceHelp"></p>

                <button class="nyami-admin-btn" type="submit" data-admin-i18n="upload"></button>
                <div class="nyami-admin-message" id="nyamiAdminUploadMsg"></div>
              </form>
            </div>

            <div class="nyami-admin-card">
              <p class="nyami-admin-kicker" data-admin-i18n="serverTracks"></p>
              <h2 data-admin-i18n="trackList"></h2>
              <div class="nyami-admin-track-list" id="nyamiAdminTrackList"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    applyAdminLanguage();
    updateSourceFields();
    updateAdminThemeButton();
    return root;
  }

  function applyAdminLanguage() {
    const activeLang = lang();

    $$("[data-admin-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.adminI18n);
    });

    $$("[data-admin-i18n-title]").forEach((node) => {
      node.title = t(node.dataset.adminI18nTitle);
    });

    $$("[data-admin-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.adminLang === activeLang);
    });

    const coverUrl = $("#nyamiAdminUploadForm input[name='coverUrl']");
    if (coverUrl) coverUrl.placeholder = t("coverUrlHint");

    updateSourceFields();
    renderTrackList();
  }

  function setAdminLang(nextLang) {
    const safe = nextLang === "en" ? "en" : "uk";
    localStorage.setItem("nyamiLanguage", safe);

    try {
      if (typeof window.animateLanguage === "function") window.animateLanguage(safe);
      else if (typeof window.applyLanguage === "function") window.applyLanguage(safe);
    } catch {}

    applyAdminLanguage();
  }

  function updateAdminThemeButton() {
    const isNight = document.body.classList.contains("night");
    const button = $("#nyamiAdminTheme");
    if (button) {
      button.textContent = isNight ? "☀" : "☾";
      button.classList.toggle("active", isNight);
    }
  }

  function toggleAdminTheme() {
    const willBeNight = !document.body.classList.contains("night");
    document.body.classList.toggle("night", willBeNight);
    localStorage.setItem("nyamiTheme", willBeNight ? "night" : "light");

    try {
      if (typeof window.updateThemeButtons === "function") window.updateThemeButtons();
    } catch {}

    updateAdminThemeButton();
  }

  function currentSourceType() {
    return $("#nyamiAdminSourceType")?.value || "upload";
  }

  function updateSourceFields() {
    const source = currentSourceType();
    const uploadFields = $('[data-source-fields="upload"]');
    const externalFields = $('[data-source-fields="external"]');
    const audioInput = $('#nyamiAdminUploadForm input[name="audio"]');
    const urlInput = $('#nyamiAdminUploadForm input[name="url"]');
    const help = $("#nyamiAdminSourceHelp");

    if (uploadFields) uploadFields.hidden = source !== "upload";
    if (externalFields) externalFields.hidden = source === "upload";
    if (audioInput) audioInput.required = source === "upload";
    if (urlInput) urlInput.required = source !== "upload";

    if (help) {
      help.textContent = t(
        source === "upload" ? "sourceHelpUpload" :
        source === "direct" ? "sourceHelpDirect" :
        source === "youtube" ? "sourceHelpYoutube" :
        "sourceHelpSpotify"
      );
    }
  }

  function hidePublicAuthForAdminV49() {
    const publicAuth = document.getElementById("nyamiAuthV47");
    if (publicAuth) publicAuth.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nyami-v47-locked", "auth-required", "nyami-v47-upgrade");
  }

  function adminOpen() {
    ensureAdminPanel();
    hidePublicAuthForAdminV49();
    document.body.classList.add("nyami-admin-open");
    location.hash = "admin";
    checkAdmin();
    applyAdminLanguage();
    updateAdminThemeButton();
  }

  function adminClose() {
    document.body.classList.remove("nyami-admin-open");
    if (location.hash === "#admin") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function renderAdminState() {
    const login = $("#nyamiAdminLoginBox");
    const dashboard = $("#nyamiAdminDashboard");

    if (!login || !dashboard) return;

    login.hidden = state.admin;
    dashboard.hidden = !state.admin;

    $("#nyamiAdminStatTracks").textContent = String(state.stats.tracks || 0);
    $("#nyamiAdminStatUsers").textContent = String(state.stats.users || 0);
    $("#nyamiAdminStatSessions").textContent = String(state.stats.sessions || 0);

    applyAdminLanguage();
    renderTrackList();
  }

  function sourceBadge(track) {
    return track.sourceLabel || track.sourceType || "Server";
  }

  function renderTrackList() {
    const list = $("#nyamiAdminTrackList");
    if (!list) return;

    if (!state.tracks.length) {
      list.innerHTML = `<p class="nyami-admin-empty">${t("empty")}</p>`;
      return;
    }

    list.innerHTML = state.tracks.map((track) => {
      const sourceType = String(track.sourceType || "upload").toLowerCase();
      const openUrl = track.pageUrl || track.externalUrl || track.audioUrl || "#";
      return `
        <article class="nyami-admin-track source-${escapeHtml(sourceType)}">
          <div class="nyami-admin-cover">
            ${track.coverUrl ? `<img src="${escapeHtml(track.coverUrl)}" alt="">` : `<span>${sourceType === "youtube" ? "▶" : sourceType === "spotify" ? "♬" : "♫"}</span>`}
          </div>
          <div>
            <b>${escapeHtml(track.title)}</b>
            <span>${escapeHtml(track.artist)}</span>
            <small>${escapeHtml(sourceBadge(track))}${track.isPlayable ? " · playable" : " · external"}</small>
          </div>
          <div class="nyami-admin-track-actions">
            ${openUrl !== "#" ? `<a class="nyami-admin-mini-link" href="${escapeHtml(openUrl)}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
            <button class="nyami-admin-btn is-danger" data-delete-track="${track.id}" type="button">${t("delete")}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function checkAdmin() {
    ensureAdminPanel();

    try {
      const session = await api("/api/admin/session");
      state.admin = !!session.admin;

      if (state.admin) {
        await Promise.all([loadStats(), loadTracks()]);
      }
    } catch {
      state.admin = false;
    }

    renderAdminState();
  }

  async function loadStats() {
    const data = await api("/api/admin/stats");
    state.stats = data.stats || {};
  }

  async function loadTracks() {
    const data = await api("/api/admin/tracks");
    state.tracks = data.tracks || [];
  }

  async function refreshPublicTracks() {
    try {
      if (typeof window.loadServerTracks === "function") {
        await window.loadServerTracks();
      }
    } catch {}
  }

  async function loginSubmit(event) {
    event.preventDefault();
    const msg = $("#nyamiAdminLoginMsg");
    msg.textContent = t("checking");

    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          login: $("#nyamiAdminLogin").value,
          password: $("#nyamiAdminPassword").value
        })
      });

      msg.textContent = "";
      state.admin = true;
      await Promise.all([loadStats(), loadTracks()]);
      renderAdminState();
      await refreshPublicTracks();
    } catch {
      msg.textContent = t("wrong");
    }
  }

  async function uploadSubmit(event) {
    event.preventDefault();
    const msg = $("#nyamiAdminUploadMsg");
    msg.textContent = t("uploading");

    const form = event.currentTarget;
    const sourceType = currentSourceType();

    try {
      if (sourceType === "upload") {
        const data = new FormData(form);
        await api("/api/admin/upload-track", {
          method: "POST",
          body: data
        });
      } else {
        const formData = new FormData(form);
        await api("/api/admin/add-source-track", {
          method: "POST",
          body: JSON.stringify({
            sourceType,
            title: formData.get("title"),
            artist: formData.get("artist"),
            url: formData.get("url"),
            coverUrl: formData.get("coverUrl")
          })
        });
      }

      form.reset();
      updateSourceFields();

      $$("#nyamiAdminUploadForm [data-file-name]").forEach((node) => {
        const input = node.closest("label").querySelector("input");
        node.textContent = input?.name === "audio" ? t("audioHint") : t("coverHint");
      });

      msg.textContent = t("uploaded");

      await Promise.all([loadStats(), loadTracks()]);
      renderAdminState();
      await refreshPublicTracks();

      if (typeof window.loadServerTracks === "function") {
        setTimeout(() => window.loadServerTracks(), 300);
      }
    } catch (error) {
      msg.textContent = error.message || t("uploadFailed");
    }
  }

  async function deleteTrack(trackId) {
    if (!confirm(t("deleteConfirm"))) return;

    try {
      await api(`/api/admin/tracks/${trackId}`, { method: "DELETE" });
      await Promise.all([loadStats(), loadTracks()]);
      renderAdminState();
      await refreshPublicTracks();
    } catch {
      alert(t("deleteFailed"));
    }
  }

  async function adminLogout() {
    try {
      await api("/api/admin/logout", { method: "POST", body: JSON.stringify({}) });
    } catch {}
    state.admin = false;
    state.tracks = [];
    state.stats = {};
    renderAdminState();
  }

  function bind() {
    ensureAdminPanel();

    $("#nyamiAdminLoginForm")?.addEventListener("submit", loginSubmit);
    $("#nyamiAdminUploadForm")?.addEventListener("submit", uploadSubmit);
    $("#nyamiAdminClose")?.addEventListener("click", adminClose);
    $("#nyamiAdminRefresh")?.addEventListener("click", checkAdmin);
    $("#nyamiAdminLogout")?.addEventListener("click", adminLogout);
    $("#nyamiAdminTheme")?.addEventListener("click", toggleAdminTheme);
    $("#nyamiAdminSourceType")?.addEventListener("change", updateSourceFields);

    document.addEventListener("click", (event) => {
      const adminLink = event.target.closest("[data-nyami-admin-open]");
      if (adminLink) {
        event.preventDefault();
        adminOpen();
      }

      const langButton = event.target.closest("[data-admin-lang]");
      if (langButton) {
        event.preventDefault();
        setAdminLang(langButton.dataset.adminLang);
      }

      const deleteButton = event.target.closest("[data-delete-track]");
      if (deleteButton) {
        event.preventDefault();
        deleteTrack(deleteButton.dataset.deleteTrack);
      }
    });

    document.querySelectorAll(".nyami-admin-file input[type='file']").forEach((input) => {
      input.addEventListener("change", () => {
        const name = input.files?.[0]?.name;
        const label = input.closest("label")?.querySelector("[data-file-name]");
        if (label) label.textContent = name || label.textContent;
      });
    });

    window.addEventListener("storage", (event) => {
      if (event.key === "nyamiLanguage") applyAdminLanguage();
      if (event.key === "nyamiTheme") updateAdminThemeButton();
    });

    if (location.hash === "#admin") {
      adminOpen();
    }

    window.addEventListener("hashchange", () => {
      if (location.hash === "#admin") adminOpen();
    });

    window.nyamiAdminV48 = { open: adminOpen, close: adminClose, refresh: checkAdmin };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
