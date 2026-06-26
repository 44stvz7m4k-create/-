
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    query: "",
    results: [],
    recent: [],
    lastStatus: "",
    fullMode: true,
    loading: false,
    timer: null,
    externalActive: false,
    currentExternal: null,
    cookieMode: localStorage.getItem("nyamiCookieConsentV54") || "",
  };

  const TEXT = {
    uk: {
      searching: "Шукаю по джерелах…",
      noUniversal: "Зовнішніх результатів поки немає",
      openSource: "Відкрити",
      aiOn: "AI-смак увімкнено",
      aiOff: "Тільки потрібні cookies",
      cookieTitle: "Cookies для музичного смаку",
      cookieText: "Можна зберігати тільки технічні cookies або дозволити AI-підбір під твій смак.",
      necessary: "Тільки потрібні",
      acceptAi: "Прийняти + AI смак",
      resetAi: "Скинути AI-профіль",
      resetDone: "AI-профіль скинуто",
      soonTitle: "Скоро буде!",
      soonDesc: "Функції вже підготовлені під цей дизайн.",
      source: "джерело",
      found: "Знайдено",
      recent: "Останні зовнішні пошуки",
      favorite: "В обране",
      favorited: "Додано в обране",
      fullMode: "Повні версії",
      previewsMode: "Preview/Embed",
      fullSearching: "Шукаю повні легальні версії…",
      aiLearns: "AI навчається на твоїх діях"
    },
    en: {
      searching: "Searching sources…",
      noUniversal: "No external results yet",
      openSource: "Open",
      aiOn: "AI taste enabled",
      aiOff: "Necessary cookies only",
      cookieTitle: "Cookies for music taste",
      cookieText: "Use only technical cookies, or allow AI taste personalization.",
      necessary: "Necessary only",
      acceptAi: "Accept + AI taste",
      resetAi: "Reset AI profile",
      resetDone: "AI profile reset",
      soonTitle: "Coming soon!",
      soonDesc: "Features are prepared inside the current design.",
      source: "source",
      found: "Found",
      recent: "Recent external searches",
      favorite: "Favorite",
      favorited: "Added to favorites",
      fullMode: "Full versions",
      previewsMode: "Preview/Embed",
      fullSearching: "Searching legal full versions…",
      aiLearns: "AI learns from your actions"
    }
  };

  function lang() {
    return localStorage.getItem("nyamiLanguage") === "en" ? "en" : "uk";
  }

  function t(key) {
    return TEXT[lang()]?.[key] || TEXT.uk[key] || key;
  }

  function safe(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeExternalTrack(item) {
    const playerType = item.player_type || item.playerType || "external";
    const isAudio = ["itunes_preview", "jamendo_audio", "local_audio", "direct_audio", "archive_audio"].includes(playerType);

    return {
      title: item.title || "Untitled",
      artist: item.artist || item.source || "Unknown",
      vibe: item.mood || "new",
      category: "new",
      duration: isAudio ? "preview" : item.source || "embed",
      cover: item.thumbnail || item.cover || "assets/covers/nowplaying.jpg",
      file: item.play_url || item.playUrl || "",
      source: "universal-v54",
      sourceType: item.source || "external",
      sourceLabel: item.source || "external",
      playerType,
      playUrl: item.play_url || item.playUrl || "",
      embedUrl: item.embed_url || item.embedUrl || "",
      pageUrl: item.page_url || item.pageUrl || item.play_url || item.playUrl || "",
      isExternalSearch: true,
      raw: item
    };
  }

  function externalKey(track) {
    return `${track.source}|${track.sourceType}|${track.title}|${track.artist}|${track.playUrl}|${track.embedUrl}`;
  }

  function mergeUniversalResults(results) {
    if (typeof tracks === "undefined" || !Array.isArray(tracks)) return;

    const current = tracks[currentIndex];
    const currentKey = current ? externalKey(current) : "";

    for (let i = tracks.length - 1; i >= 0; i -= 1) {
      if (tracks[i]?.source === "universal-v54") tracks.splice(i, 1);
    }

    const normalized = results.map(normalizeExternalTrack);
    tracks.unshift(...normalized);

    if (currentKey) {
      const nextIndex = tracks.findIndex((track) => externalKey(track) === currentKey);
      if (nextIndex >= 0) currentIndex = nextIndex;
      else currentIndex = Math.min(currentIndex + normalized.length, Math.max(0, tracks.length - 1));
    }

    try { renderTracks(); } catch {}
    try { renderSearchPopover(); } catch {}
  }

  async function api(path, payload) {
    const response = await fetch(path, {
      method: payload ? "POST" : "GET",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        ...(payload ? { "Content-Type": "application/json" } : {})
      },
      ...(payload ? { body: JSON.stringify(payload) } : {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error(data?.error?.message || "API error");
    return data;
  }


  function localRecentSearchesV55() {
    try {
      return JSON.parse(localStorage.getItem("nyamiRecentUniversalSearchesV55") || "[]");
    } catch {
      return [];
    }
  }

  function saveLocalRecentSearchV55(query, count) {
    const q = String(query || "").trim();
    if (!q) return;

    const next = [
      { query: q, resultCount: count || 0, createdAt: new Date().toISOString() },
      ...localRecentSearchesV55().filter((item) => item.query !== q)
    ].slice(0, 8);

    localStorage.setItem("nyamiRecentUniversalSearchesV55", JSON.stringify(next));
    state.recent = next;
  }

  function loadRecentSearchesV55() {
    state.recent = localRecentSearchesV55();
    renderUniversalPopoverBlock();
  }

  function statusTextV55() {
    if (state.loading) return state.fullMode ? t("fullSearching") : t("searching");
    if (state.results.length) return `${t("found")}: ${state.results.length}`;
    return state.lastStatus || "";
  }


  async function universalSearch(query) {
    const q = String(query || "").trim();
    state.query = q;

    if (q.length < 2) {
      state.results = [];
      return [];
    }

    state.loading = true;
    renderUniversalPopoverBlock();

    try {
      const endpoint = state.fullMode ? "/api/full-track-search" : "/api/universal-search";
      const data = await api(`${endpoint}?q=${encodeURIComponent(q)}`);
      state.results = Array.isArray(data.results) ? data.results : [];
      state.lastStatus = `${t("found")}: ${state.results.length}`;
      saveLocalRecentSearchV55(q, state.results.length);
      mergeUniversalResults(state.results);
      renderUniversalPopoverBlock();
      return state.results;
    } catch (error) {
      console.warn("Universal search failed", error);
      state.results = [];
      renderUniversalPopoverBlock();
      return [];
    } finally {
      state.loading = false;
      renderUniversalPopoverBlock();
    }
  }

  function scheduleUniversalSearch() {
    const input = $("#searchInput");
    if (!input) return;

    clearTimeout(state.timer);
    const query = input.value.trim();

    state.timer = setTimeout(() => {
      if (query.length >= 2) universalSearch(query);
    }, 550);
  }

  function ensureUniversalBlock() {
    const popover = $("#searchPopover");
    if (!popover) return null;

    let block = $("#universalResultsV54");
    if (block) return block;

    const history = $("#searchHistoryBlock");
    block = document.createElement("div");
    block.id = "universalResultsV54";
    block.className = "popover-section universal-results-v54";
    block.innerHTML = `
      <div class="popover-label-row universal-label-row-v55">
        <span class="popover-label">Universal Search</span>
        <small id="universalStatusV55"></small>
        <button type="button" id="universalFullToggleV56">FULL</button>
        <button type="button" id="universalRefreshV54">↻</button>
      </div>
      <div class="popover-list" id="universalResultListV54"></div>
      <div class="popover-list universal-recent-list-v55" id="universalRecentListV55"></div>
    `;

    if (history) popover.insertBefore(block, history);
    else popover.appendChild(block);

    $("#universalFullToggleV56")?.addEventListener("click", () => {
      state.fullMode = !state.fullMode;
      const btn = $("#universalFullToggleV56");
      if (btn) btn.textContent = state.fullMode ? "FULL" : "PREV";
      universalSearch($("#searchInput")?.value || "");
    });

    $("#universalRefreshV54")?.addEventListener("click", () => {
      universalSearch($("#searchInput")?.value || "");
    });

    return block;
  }


  function renderRecentSearchesV55() {
    const list = $("#universalRecentListV55");
    if (!list) return;

    const query = $("#searchInput")?.value?.trim() || "";
    if (query.length >= 2 || !state.recent.length) {
      list.innerHTML = "";
      return;
    }

    list.innerHTML = `
      <div class="popover-label-row universal-recent-title-v55">
        <span class="popover-label">${safe(t("recent"))}</span>
      </div>
      ${state.recent.slice(0, 5).map((item) => `
        <button type="button" class="search-result-item universal-recent-item-v55" data-universal-recent="${safe(item.query)}">
          <span>
            <b>${safe(item.query)}</b>
            <small>${safe(t("found"))}: ${safe(item.resultCount || 0)}</small>
          </span>
        </button>
      `).join("")}
    `;
  }


  function renderUniversalPopoverBlock() {
    const block = ensureUniversalBlock();
    const list = $("#universalResultListV54");
    if (!block || !list) return;

    const query = $("#searchInput")?.value?.trim() || "";
    const status = $("#universalStatusV55");
    if (status) status.textContent = statusTextV55();
    block.hidden = query.length < 2 && !state.results.length && !state.recent.length;

    if (state.loading) {
      list.innerHTML = `
        <div class="popover-empty">
          <b>${safe(t("searching"))}</b>
          <span>iTunes / Jamendo / YouTube / Spotify / SoundCloud</span>
        </div>
      `;
      renderRecentSearchesV55();
      return;
    }

    if (!state.results.length) {
      list.innerHTML = `
        <div class="popover-empty">
          <b>${safe(t("noUniversal"))}</b>
          <span>${safe(query)}</span>
        </div>
      `;
      renderRecentSearchesV55();
      return;
    }

    list.innerHTML = state.results.slice(0, 8).map((item) => `
      <button type="button" class="search-result-item universal-result-item-v54" data-universal-index="${state.results.indexOf(item)}">
        <img src="${safe(item.thumbnail || "assets/covers/nowplaying.jpg")}" alt="${safe(item.title)}">
        <span>
          <b>${safe(item.title)}</b>
          <small>${safe(item.artist)} • ${safe(item.source)}${item.is_full_track ? " • full" : ""}</small>
        </span>
        <em>${safe(item.player_type?.replace("_", " ") || item.source)}</em>
        <small class="universal-fav-v55" data-universal-favorite="${state.results.indexOf(item)}">♡</small>
      </button>
    `).join("");
    renderRecentSearchesV55();
  }

  function clearExternalEmbed() {
    const frame = $("#universalEmbedFrameV54");
    if (frame) frame.remove();

    const cover = $("#nowCover");
    if (cover) cover.classList.remove("universal-cover-hidden-v54");

    document.body.classList.remove("universal-embed-active-v54");
    state.externalActive = false;
    state.currentExternal = null;
  }

  function embedSrcFor(track, autoplay = false) {
    const type = track.playerType || "";
    let src = track.embedUrl || "";

    if (type === "youtube_embed" && src) {
      const separator = src.includes("?") ? "&" : "?";
      src += `${separator}rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
    }

    if (type === "spotify_embed" && src) {
      const separator = src.includes("?") ? "&" : "?";
      src += `${separator}utm_source=generator`;
    }

    if (type === "soundcloud_embed" && src) {
      const separator = src.includes("?") ? "&" : "?";
      src += `${separator}auto_play=${autoplay ? "true" : "false"}&show_artwork=true`;
    }

    return src;
  }

  function renderExternalEmbed(track, autoplay = false) {
    if (!track || !track.playerType?.endsWith("_embed")) {
      clearExternalEmbed();
      return false;
    }

    const wrap = $(".cover-wrap");
    const cover = $("#nowCover");
    if (!wrap) return false;

    let frame = $("#universalEmbedFrameV54");
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = "universalEmbedFrameV54";
      frame.className = "universal-embed-frame-v54";
      frame.setAttribute("frameborder", "0");
      frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");
      wrap.appendChild(frame);
    }

    frame.src = embedSrcFor(track, autoplay);
    if (cover) cover.classList.add("universal-cover-hidden-v54");

    document.body.classList.add("universal-embed-active-v54");
    state.externalActive = true;
    state.currentExternal = track;

    return true;
  }

  function patchPlayer() {
    if (typeof loadTrack !== "function" || typeof playTrack !== "function" || typeof pauseTrack !== "function") {
      return;
    }

    if (window.NyamiUniversalPlayerPatchedV54) return;
    window.NyamiUniversalPlayerPatchedV54 = true;

    const originalLoadTrack = loadTrack;
    const originalPlayTrack = playTrack;
    const originalPauseTrack = pauseTrack;
    const originalUpdateCurrentUI = updateCurrentUI;

    loadTrack = function patchedLoadTrack(index) {
      const track = tracks[index];

      if (track?.playerType?.endsWith("_embed")) {
        try { audio.pause(); } catch {}
        try {
          audio.removeAttribute("src");
          audio.load();
        } catch {}

        originalUpdateCurrentUI();
        renderExternalEmbed(track, false);
        isPlaying = false;
        updatePlayButtons();
        return;
      }

      clearExternalEmbed();
      originalLoadTrack(index);
    };

    playTrack = async function patchedPlayTrack() {
      const track = tracks[currentIndex];

      if (track?.playerType?.endsWith("_embed")) {
        renderExternalEmbed(track, true);
        isPlaying = true;
        updatePlayButtons();
        sendPlayEvent(track);
        return;
      }

      clearExternalEmbed();
      await originalPlayTrack();
      sendPlayEvent(track);
    };

    pauseTrack = function patchedPauseTrack() {
      const track = tracks[currentIndex];

      if (track?.playerType?.endsWith("_embed")) {
        renderExternalEmbed(track, false);
        isPlaying = false;
        updatePlayButtons();
        return;
      }

      originalPauseTrack();
    };

    updateCurrentUI = function patchedUpdateCurrentUI() {
      originalUpdateCurrentUI();

      const track = tracks[currentIndex];
      if (!track) return;

      const source = track.sourceLabel || track.sourceType || "";
      if (source && track.source === "universal-v54") {
        const nowArtist = $("#nowArtist");
        const bottomArtist = $("#bottomArtist");
        const text = `${track.artist} · ${source}`;
        if (nowArtist) nowArtist.textContent = text;
        if (bottomArtist) bottomArtist.textContent = text;
      }

      if (track.playerType?.endsWith("_embed")) {
        renderExternalEmbed(track, false);
      } else {
        clearExternalEmbed();
      }
    };

    const originalToggleLike = typeof toggleLike === "function" ? toggleLike : null;
    if (originalToggleLike) {
      toggleLike = function patchedToggleLike(index) {
        const track = tracks[index];
        if (track?.source === "universal-v54") {
          likeExternalTrack(track);
        }
        return originalToggleLike(index);
      };
    }
  }

  function sendPlayEvent(track) {
    if (!track) return;
    if (state.cookieMode !== "ai") return;

    api("/api/play-event", {
      query: state.query || $("#searchInput")?.value || "",
      source: track.sourceType || track.sourceLabel || track.source || "local",
      title: track.title,
      artist: track.artist,
      mood: track.vibe || ""
    }).catch(() => {});
  }

  function likeExternalTrack(track) {
    if (!track || track.source !== "universal-v54") return;

    api("/api/like-external-track", {
      query: state.query || $("#searchInput")?.value || "",
      source: track.sourceType || track.sourceLabel || "external",
      title: track.title,
      artist: track.artist,
      mood: track.vibe || "",
      play_url: track.playUrl || track.file || "",
      embed_url: track.embedUrl || "",
      player_type: track.playerType || "",
      thumbnail: track.cover || ""
    }).catch(() => {});
  }

  function bindUniversalSearch() {
    const input = $("#searchInput");
    if (!input) return;

    input.addEventListener("input", scheduleUniversalSearch);
    input.addEventListener("focus", () => {
      ensureUniversalBlock();
      renderUniversalPopoverBlock();
    });

    document.addEventListener("click", (event) => {
      const recentButton = event.target.closest("[data-universal-recent]");
      if (recentButton) {
        event.preventDefault();
        const input = $("#searchInput");
        if (input) {
          input.value = recentButton.dataset.universalRecent || "";
          universalSearch(input.value);
        }
        return;
      }

      const favoriteButton = event.target.closest("[data-universal-favorite]");
      if (favoriteButton) {
        event.preventDefault();
        event.stopPropagation();
        const item = state.results[Number(favoriteButton.dataset.universalFavorite)];
        if (item) {
          likeExternalTrack(normalizeExternalTrack(item));
          favoriteButton.textContent = "♥";
          try { showToast(t("favorited")); } catch {}
        }
        return;
      }

      const button = event.target.closest("[data-universal-index]");
      if (!button) return;

      const item = state.results[Number(button.dataset.universalIndex)];
      if (!item) return;

      const track = normalizeExternalTrack(item);
      const existingIndex = tracks.findIndex((candidate) => externalKey(candidate) === externalKey(track));

      if (existingIndex >= 0) {
        currentIndex = existingIndex;
      } else {
        tracks.unshift(track);
        currentIndex = 0;
      }

      try {
        if (typeof addSearchHistory === "function" && input.value.trim()) addSearchHistory(input.value);
      } catch {}

      loadTrack(currentIndex);
      playTrack();
      try { hideSearchPopover(); } catch {}
      try { renderTracks(); } catch {}
    });
  }

  function ensureCookieBanner() {
    if (localStorage.getItem("nyamiCookieConsentV54")) return;
    if ($("#cookieConsentV54")) return;

    const banner = document.createElement("div");
    banner.id = "cookieConsentV54";
    banner.className = "panel cookie-consent-v54";
    banner.innerHTML = `
      <div>
        <b>${safe(t("cookieTitle"))}</b>
        <p>${safe(t("cookieText"))}</p>
      </div>
      <div class="cookie-actions-v54">
        <button class="soft-action" type="button" data-cookie-choice-v54="necessary">${safe(t("necessary"))}</button>
        <button class="primary-btn" type="button" data-cookie-choice-v54="ai">${safe(t("acceptAi"))}</button>
      </div>
    `;
    document.body.appendChild(banner);
  }

  function bindCookieBanner() {
    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-cookie-choice-v54]");
      if (!button) return;

      const mode = button.dataset.cookieChoiceV54 === "ai" ? "ai" : "necessary";
      state.cookieMode = mode;
      localStorage.setItem("nyamiCookieConsentV54", mode);

      try { await api("/api/cookie-consent", { mode }); } catch {}

      $("#cookieConsentV54")?.remove();
      try { showToast(mode === "ai" ? t("aiOn") : t("aiOff")); } catch {}
    });
  }

  function ensureProfileResetButton() {
    const dropdown = $("#profileDropdown");
    if (!dropdown || $("#resetAiProfileV54")) return;

    const line = document.createElement("div");
    line.className = "profile-dropdown-line ai-reset-line-v54";

    const button = document.createElement("button");
    button.id = "resetAiProfileV54";
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.innerHTML = `<span>✦</span><b>${safe(t("resetAi"))}</b>`;

    const logout = $('[data-profile-menu-action="logout"]', dropdown);
    if (logout) {
      dropdown.insertBefore(line, logout);
      dropdown.insertBefore(button, logout);
    } else {
      dropdown.appendChild(line);
      dropdown.appendChild(button);
    }

    button.addEventListener("click", async () => {
      try { await api("/api/reset-ai-profile", {}); } catch {}
      try { showToast(t("resetDone")); } catch {}
    });
  }

  function ensureSoonBlock() {
    if ($("#soonBlockV54")) return;

    const tracksPanel = $(".tracks.panel");
    if (!tracksPanel || !tracksPanel.parentNode) return;

    const block = document.createElement("section");
    block.id = "soonBlockV54";
    block.className = "tracks panel soon-block-v54";
    block.innerHTML = `
      <div class="panel-title">
        <div>
          <h2>${safe(t("soonTitle"))}</h2>
          <p>${safe(t("soonDesc"))}</p>
        </div>
      </div>
      <div class="soon-grid-v54">
        ${["AI DJ", "Smart Mixes", "PWA App", "Voice Search", "SoundCloud Search", "Personal Wrapped"]
          .map((name) => `<button class="mood-card panel" type="button"><span>✧</span><b>${safe(name)}</b><small>${safe(t("source"))}</small></button>`)
          .join("")}
      </div>
    `;

    tracksPanel.parentNode.insertBefore(block, tracksPanel.nextSibling);
  }


  function registerPWAV55() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }


  function boot() {
    patchPlayer();
    bindUniversalSearch();
    bindCookieBanner();
    ensureCookieBanner();
    loadRecentSearchesV55();
    registerPWAV55();
    ensureProfileResetButton();
    ensureSoonBlock();

    setInterval(() => {
      patchPlayer();
      ensureProfileResetButton();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiUniversalSearchV54 = {
    search: universalSearch,
    renderExternalEmbed,
    clearExternalEmbed
  };
})();


/* v56-ai-learning-hooks: no design changes */
(() => {
  "use strict";

  function sendEventV56(type, track) {
    if (!track) return;
    try {
      const mode = localStorage.getItem("nyamiCookieConsentV54") || "";
      if (mode !== "ai") return;

      fetch("/api/play-event", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          event_type: type,
          eventType: type,
          query: document.querySelector("#searchInput")?.value || "",
          source: track.sourceType || track.sourceLabel || track.source || "local",
          title: track.title || "",
          artist: track.artist || "",
          mood: track.vibe || ""
        })
      }).catch(() => {});
    } catch {}
  }

  function bootV56() {
    if (window.NyamiAiEndedHookV56) return;
    window.NyamiAiEndedHookV56 = true;

    try {
      audio.addEventListener("ended", () => {
        sendEventV56("complete", tracks[currentIndex]);
      });
    } catch {}

    const oldNext = typeof nextTrack === "function" ? nextTrack : null;
    if (oldNext) {
      nextTrack = function patchedNextTrackV56() {
        try { sendEventV56("skip", tracks[currentIndex]); } catch {}
        return oldNext();
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootV56, { once: true });
  } else {
    bootV56();
  }
})();
