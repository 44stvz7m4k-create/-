
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  async function api(path) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error("API error");
    return data;
  }

  function normalizeRecommendation(item) {
    const track = item.track || item;
    return {
      title: track.title || "Untitled",
      artist: track.artist || "Unknown",
      vibe: track.vibe || "new",
      category: track.category || "new",
      duration: track.duration || "for you",
      cover: track.cover || track.thumbnail || "assets/covers/nowplaying.jpg",
      file: track.file || track.playUrl || track.play_url || "",
      source: track.source || "recommendation-v59",
      sourceType: track.sourceType || track.source || "",
      sourceLabel: track.sourceLabel || track.sourceType || "",
      serverId: track.serverId || "",
      playerType: track.playerType || "",
      playUrl: track.playUrl || track.play_url || "",
      embedUrl: track.embedUrl || track.embed_url || "",
      pageUrl: track.pageUrl || track.page_url || "",
      isServerTrack: !!track.isServerTrack,
      isExternalSearch: !!track.isExternalSearch
    };
  }

  function ensureTrack(track) {
    const key = [
      track.source,
      track.sourceType,
      track.serverId,
      track.file,
      track.playUrl,
      track.embedUrl,
      track.title,
      track.artist
    ].join("|").toLowerCase();

    const found = tracks.findIndex((candidate) => [
      candidate.source,
      candidate.sourceType,
      candidate.serverId,
      candidate.file,
      candidate.playUrl,
      candidate.embedUrl,
      candidate.title,
      candidate.artist
    ].join("|").toLowerCase() === key);

    if (found >= 0) return found;

    tracks.unshift(track);
    return 0;
  }

  async function loadForYou() {
    try {
      const data = await api("/api/recommendations");
      renderForYou(data.recommendations || [], data.personalized);
    } catch {}
  }

  function renderForYou(recommendations, personalized) {
    if (!recommendations.length) return;

    const tracksPanel = document.querySelector(".tracks.panel");
    if (!tracksPanel || $("#forYouBlockV59")) return;

    const block = document.createElement("section");
    block.id = "forYouBlockV59";
    block.className = "tracks panel for-you-block-v59";
    block.innerHTML = `
      <div class="panel-title">
        <div>
          <h2>For you</h2>
          <p>${personalized ? "AI taste recommendations" : "Fresh recommendations"}</p>
        </div>
      </div>
      <div class="profile-mini-list for-you-list-v59">
        ${recommendations.slice(0, 6).map((item, index) => {
          const track = normalizeRecommendation(item);
          return `
            <button class="profile-mini-item" type="button" data-for-you-index="${index}">
              <img src="${escapeHtml(track.cover)}" alt="">
              <span>
                <b>${escapeHtml(track.title)}</b>
                <small>${escapeHtml(track.artist)}${track.sourceLabel ? ` · ${escapeHtml(track.sourceLabel)}` : ""}</small>
              </span>
              <em>${escapeHtml(track.duration || "play")}</em>
            </button>
          `;
        }).join("")}
      </div>
    `;
    block._recommendationsV59 = recommendations;
    tracksPanel.parentNode.insertBefore(block, tracksPanel.nextSibling);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function bindForYou() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-for-you-index]");
      if (!button) return;

      const block = $("#forYouBlockV59");
      const item = block?._recommendationsV59?.[Number(button.dataset.forYouIndex)];
      if (!item) return;

      const track = normalizeRecommendation(item);
      const index = ensureTrack(track);
      currentIndex = index;

      try {
        loadTrack(currentIndex);
        playTrack();
        renderTracks();
      } catch {}
    });
  }

  async function loadUserStats() {
    try {
      const data = await api("/api/user-stats");
      if (!data.authenticated) return;
      renderUserStats(data.stats || {});
    } catch {}
  }

  function renderUserStats(stats) {
    const statsGrid = document.querySelector(".profile-stats");
    if (!statsGrid) return;

    const specs = [
      ["serverPlaylists", stats.playlists ?? 0, "Server playlists"],
      ["playlistTracks", stats.playlistTracks ?? 0, "Saved tracks"],
      ["externalLikes", stats.externalLikes ?? 0, "External likes"],
      ["aiEvents", stats.events ?? 0, "AI events"]
    ];

    specs.forEach(([key, value, label]) => {
      let card = statsGrid.querySelector(`[data-server-stat-v59="${key}"]`);
      if (!card) {
        card = document.createElement("div");
        card.className = "profile-stat-card";
        card.dataset.serverStatV59 = key;
        card.innerHTML = `<b></b><span></span>`;
        statsGrid.appendChild(card);
      }
      card.querySelector("b").textContent = value;
      card.querySelector("span").textContent = label;
    });
  }

  function patchProfileViewStats() {
    if (window.NyamiProductProfileStatsPatchedV59) return;
    if (typeof renderProfileView !== "function") return;
    window.NyamiProductProfileStatsPatchedV59 = true;

    const original = renderProfileView;
    renderProfileView = function patchedRenderProfileViewV59() {
      const result = original();
      setTimeout(loadUserStats, 150);
      return result;
    };
  }

  function boot() {
    patchProfileViewStats();
    bindForYou();
    loadForYou();
    setInterval(patchProfileViewStats, 1000);
    setTimeout(loadUserStats, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiProductV59 = {
    loadForYou,
    loadUserStats
  };
})();
