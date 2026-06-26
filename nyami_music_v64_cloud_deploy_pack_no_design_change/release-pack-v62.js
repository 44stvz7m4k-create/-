
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    publicPlaylist: null,
    artist: null,
    onboardingStep: 0
  };

  function safe(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
    if (!response.ok || data.ok === false) throw new Error(data?.error?.message || "API error");
    return data;
  }

  function trackKey(track) {
    return [
      track?.source || track?.sourceType || track?.sourceLabel || "local",
      track?.serverId || "",
      track?.playerType || "",
      track?.file || track?.playUrl || track?.audioUrl || "",
      track?.embedUrl || "",
      track?.title || "",
      track?.artist || ""
    ].join("|").toLowerCase();
  }

  function trackPayload(track) {
    return {
      title: track?.title || "Untitled",
      artist: track?.artist || "Unknown",
      vibe: track?.vibe || "new",
      category: track?.category || "new",
      duration: track?.duration || "",
      cover: track?.cover || "assets/covers/nowplaying.jpg",
      file: track?.file || track?.playUrl || "",
      source: track?.source || "local",
      sourceType: track?.sourceType || "",
      sourceLabel: track?.sourceLabel || "",
      serverId: track?.serverId || "",
      playerType: track?.playerType || "",
      playUrl: track?.playUrl || track?.file || "",
      embedUrl: track?.embedUrl || "",
      pageUrl: track?.pageUrl || "",
      isServerTrack: !!track?.isServerTrack,
      isExternalSearch: !!track?.isExternalSearch
    };
  }

  function ensureTrack(track) {
    const payload = trackPayload(track);
    const key = trackKey(payload);
    const found = tracks.findIndex((item) => trackKey(item) === key);
    if (found >= 0) return found;
    tracks.push(payload);
    return tracks.length - 1;
  }

  function playTrackPayload(track) {
    const index = ensureTrack(track);
    currentIndex = index;
    loadTrack(currentIndex);
    playTrack();
    try { renderTracks(); } catch {}
  }

  // Splash
  function showSplash() {
    if (sessionStorage.getItem("nyamiSplashSeenV62")) return;

    const splash = document.createElement("div");
    splash.id = "nyamiSplashV62";
    splash.className = "nyami-splash-v62";
    splash.innerHTML = `
      <div class="nyami-splash-card-v62">
        <img src="assets/logo/nyami-logo-v61.svg" alt="">
        <b>Nyami Music</b>
        <span>Loading your sound…</span>
      </div>
    `;
    document.body.appendChild(splash);

    sessionStorage.setItem("nyamiSplashSeenV62", "1");
    setTimeout(() => splash.classList.add("is-hide"), 850);
    setTimeout(() => splash.remove(), 1250);
  }

  // Onboarding
  function ensureOnboarding() {
    if (localStorage.getItem("nyamiOnboardingDoneV62")) return;
    if ($("#nyamiOnboardingV62")) return;

    const steps = [
      ["Welcome to Nyami", "Search music, create playlists, and let AI learn your taste."],
      ["Universal Search", "Use FULL for legal full audio or PREV for preview/embed sources."],
      ["Queue & Smart Mix", "Add tracks to queue or create a Smart Mix from the current track."],
      ["Profile & Playlists", "Login to save playlists, stats, and your AI taste across sessions."]
    ];

    const modal = document.createElement("div");
    modal.id = "nyamiOnboardingV62";
    modal.className = "nyami-onboarding-v62";
    modal.innerHTML = `
      <div class="panel nyami-onboarding-card-v62">
        <img src="assets/logo/nyami-logo-v61.svg" alt="">
        <h2></h2>
        <p></p>
        <div class="nyami-onboarding-dots-v62"></div>
        <div class="nyami-onboarding-actions-v62">
          <button type="button" class="soft-action" data-onboarding-skip-v62>Skip</button>
          <button type="button" class="primary-btn" data-onboarding-next-v62>Next</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    function render() {
      const [title, text] = steps[state.onboardingStep];
      modal.querySelector("h2").textContent = title;
      modal.querySelector("p").textContent = text;
      modal.querySelector(".nyami-onboarding-dots-v62").innerHTML = steps.map((_, index) => `<i class="${index === state.onboardingStep ? "is-active" : ""}"></i>`).join("");
      modal.querySelector("[data-onboarding-next-v62]").textContent = state.onboardingStep === steps.length - 1 ? "Start" : "Next";
    }

    function done() {
      localStorage.setItem("nyamiOnboardingDoneV62", "1");
      modal.remove();
    }

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-onboarding-skip-v62]")) return done();
      if (event.target.closest("[data-onboarding-next-v62]")) {
        if (state.onboardingStep >= steps.length - 1) return done();
        state.onboardingStep += 1;
        render();
      }
    });

    render();
  }

  // Public playlists
  async function loadPublicPlaylistFromUrl() {
    const params = new URLSearchParams(location.search);
    const shareId = params.get("playlist");
    if (!shareId) return;

    try {
      const data = await api(`/api/public-playlists/${encodeURIComponent(shareId)}`);
      state.publicPlaylist = data.playlist;
      renderPublicPlaylist(data.playlist);
    } catch {
      try { showToast("Public playlist not found"); } catch {}
    }
  }

  function renderPublicPlaylist(playlist) {
    const main = $(".main");
    if (!main || $("#publicPlaylistV62")) return;

    const section = document.createElement("section");
    section.id = "publicPlaylistV62";
    section.className = "tracks panel release-public-playlist-v62";
    section.innerHTML = `
      <div class="panel-title">
        <div>
          <h2>${safe(playlist.name)}</h2>
          <p>Public playlist · ${safe(playlist.owner?.name || "Nyami user")} · ${playlist.trackCount || 0} tracks</p>
        </div>
        <button type="button" class="soft-action" data-public-close-v62>Close</button>
      </div>
      <div class="profile-mini-list">
        ${(playlist.tracks || []).map((item, index) => {
          const track = trackPayload(item.track || {});
          return `
            <button class="profile-mini-item" type="button" data-public-track-v62="${index}">
              <img src="${safe(track.cover)}" alt="">
              <span>
                <b>${safe(track.title)}</b>
                <small>${safe(track.artist)}${track.sourceLabel ? " · " + safe(track.sourceLabel) : ""}</small>
              </span>
              <em>${safe(track.duration || "play")}</em>
            </button>
          `;
        }).join("")}
      </div>
    `;

    main.prepend(section);
    try { setView("home"); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function shareActivePlaylist() {
    if (!activePlaylist?.serverPlaylistId) {
      try { showToast("Only server playlists can be public"); } catch {}
      return;
    }

    try {
      const data = await api(`/api/playlists/${activePlaylist.serverPlaylistId}/share`, { method: "POST", body: JSON.stringify({}) });
      const url = new URL(data.url || `/?playlist=${data.shareId}`, location.origin).toString();

      try {
        await navigator.clipboard.writeText(url);
        showToast("Public link copied");
      } catch {
        prompt("Public playlist link:", url);
      }
    } catch {
      try { showToast("Share failed"); } catch {}
    }
  }

  function ensureShareButton() {
    const actions = $(".playlist-actions") || $("#playlistDeleteBtn")?.parentElement;
    if (!actions || $("#sharePlaylistV62")) return;

    const btn = document.createElement("button");
    btn.id = "sharePlaylistV62";
    btn.type = "button";
    btn.className = "soft-action";
    btn.textContent = "Share";
    actions.insertBefore(btn, actions.firstChild);
  }

  // Lyrics
  async function fetchLyricsForCurrent() {
    const track = tracks[currentIndex];
    if (!track) return;
    const key = trackKey(track).replace(/[^a-z0-9]/g, "").slice(0, 32);

    try {
      const data = await api(`/api/lyrics/${key}`);
      renderLyrics(data.lyrics || "", track);
    } catch {}
  }

  function renderLyrics(lyrics, track) {
    let block = $("#lyricsBlockV62");
    const right = $(".right.panel");
    if (!right) return;

    if (!block) {
      block = document.createElement("section");
      block.id = "lyricsBlockV62";
      block.className = "lyrics-block-v62";
      block.innerHTML = `
        <div class="panel-title">
          <div>
            <h2>Lyrics</h2>
            <p></p>
          </div>
          <button type="button" class="soft-action" data-lyrics-toggle-v62>Show</button>
        </div>
        <pre hidden></pre>
      `;
      right.appendChild(block);
    }

    block.querySelector("p").textContent = track ? `${track.title} · ${track.artist}` : "";
    block.querySelector("pre").textContent = lyrics || "Lyrics not added yet.";
  }

  function patchLyricsLoad() {
    if (window.NyamiLyricsPatchedV62 || typeof loadTrack !== "function") return;
    window.NyamiLyricsPatchedV62 = true;

    const oldLoad = loadTrack;
    loadTrack = function patchedLoadTrackV62(index) {
      const result = oldLoad(index);
      setTimeout(fetchLyricsForCurrent, 120);
      return result;
    };

    setTimeout(fetchLyricsForCurrent, 300);
  }

  // Artist pages
  function artistSlug(name) {
    return encodeURIComponent(String(name || "").trim());
  }

  async function openArtistPage(name) {
    if (!name) return;

    try {
      const data = await api(`/api/artists/${artistSlug(name)}`);
      state.artist = data;
      renderArtistPage(data);
    } catch {
      try { showToast("Artist not found"); } catch {}
    }
  }

  function renderArtistPage(data) {
    const main = $(".main");
    if (!main) return;

    $("#artistPageV62")?.remove();

    const section = document.createElement("section");
    section.id = "artistPageV62";
    section.className = "tracks panel artist-page-v62";
    section.innerHTML = `
      <div class="panel-title">
        <div>
          <h2>${safe(data.artist)}</h2>
          <p>Artist page · ${data.trackCount || 0} tracks</p>
        </div>
        <button type="button" class="soft-action" data-artist-close-v62>Close</button>
      </div>
      <div class="profile-mini-list">
        ${(data.tracks || []).map((track, index) => {
          const payload = trackPayload(track);
          return `
            <button class="profile-mini-item" type="button" data-artist-track-v62="${index}">
              <img src="${safe(payload.cover)}" alt="">
              <span>
                <b>${safe(payload.title)}</b>
                <small>${safe(payload.artist)}${payload.sourceLabel ? " · " + safe(payload.sourceLabel) : ""}</small>
              </span>
              <em>${safe(payload.duration || "play")}</em>
            </button>
          `;
        }).join("") || `<div class="popover-empty"><b>No tracks yet</b><span>Add tracks in admin</span></div>`}
      </div>
    `;

    main.prepend(section);
    try { setView("home"); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindClicks() {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-onboarding-reset-v62]")) {
        localStorage.removeItem("nyamiOnboardingDoneV62");
        ensureOnboarding();
        return;
      }

      if (event.target.closest("#sharePlaylistV62")) return shareActivePlaylist();

      if (event.target.closest("[data-public-close-v62]")) {
        $("#publicPlaylistV62")?.remove();
        const url = new URL(location.href);
        url.searchParams.delete("playlist");
        history.replaceState(null, "", url.pathname + url.search + url.hash);
        return;
      }

      const publicTrack = event.target.closest("[data-public-track-v62]");
      if (publicTrack) {
        const item = state.publicPlaylist?.tracks?.[Number(publicTrack.dataset.publicTrackV62)];
        if (item?.track) playTrackPayload(item.track);
        return;
      }

      const artistClose = event.target.closest("[data-artist-close-v62]");
      if (artistClose) {
        $("#artistPageV62")?.remove();
        return;
      }

      const artistTrack = event.target.closest("[data-artist-track-v62]");
      if (artistTrack) {
        const track = state.artist?.tracks?.[Number(artistTrack.dataset.artistTrackV62)];
        if (track) playTrackPayload(track);
        return;
      }

      if (event.target.closest("[data-lyrics-toggle-v62]")) {
        const pre = $("#lyricsBlockV62 pre");
        const btn = event.target.closest("[data-lyrics-toggle-v62]");
        if (pre) {
          pre.hidden = !pre.hidden;
          btn.textContent = pre.hidden ? "Show" : "Hide";
        }
        return;
      }

      // Artist click: any visible artist text in current/right/bottom can open the page.
      const artistTargets = ["#nowArtist", "#bottomArtist"];
      for (const sel of artistTargets) {
        const node = event.target.closest(sel);
        if (node) {
          const artist = node.textContent.split("·")[0].trim();
          openArtistPage(artist);
          return;
        }
      }
    });
  }

  function patchArtistLabels() {
    ["#nowArtist", "#bottomArtist"].forEach((sel) => {
      const node = $(sel);
      if (node && !node.dataset.artistClickableV62) {
        node.dataset.artistClickableV62 = "1";
        node.title = "Open artist page";
        node.classList.add("artist-clickable-v62");
      }
    });
  }

  function boot() {
    showSplash();
    setTimeout(ensureOnboarding, 950);
    bindClicks();
    loadPublicPlaylistFromUrl();
    patchLyricsLoad();

    setInterval(() => {
      ensureShareButton();
      patchArtistLabels();
      patchLyricsLoad();
    }, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiReleasePackV62 = {
    openArtistPage,
    shareActivePlaylist,
    fetchLyricsForCurrent
  };
})();
