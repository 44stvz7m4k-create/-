
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    queue: [],
    history: [],
    smartMix: [],
    panelOpen: false,
    patched: false
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
      file: track?.file || "",
      source: track?.source || "local",
      sourceType: track?.sourceType || "",
      sourceLabel: track?.sourceLabel || "",
      serverId: track?.serverId || "",
      uploadedAt: track?.uploadedAt || "",
      isServerTrack: !!track?.isServerTrack,
      isExternalDirect: !!track?.isExternalDirect,
      playerType: track?.playerType || "",
      playUrl: track?.playUrl || "",
      embedUrl: track?.embedUrl || "",
      pageUrl: track?.pageUrl || "",
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

  function playPayload(track) {
    const index = ensureTrack(track);
    currentIndex = index;
    loadTrack(currentIndex);
    playTrack();
    try { renderTracks(); } catch {}
  }

  function saveQueueLocal() {
    localStorage.setItem("nyamiQueueV60", JSON.stringify(state.queue.slice(0, 100)));
  }

  function loadQueueLocal() {
    try {
      state.queue = JSON.parse(localStorage.getItem("nyamiQueueV60") || "[]");
    } catch {
      state.queue = [];
    }
  }

  function addToQueue(track, next = false) {
    const payload = trackPayload(track);
    if (next) state.queue.unshift(payload);
    else state.queue.push(payload);

    state.queue = state.queue.slice(0, 100);
    saveQueueLocal();
    renderPanel();
    try { showToast(next ? "Играет следующим" : "Добавлено в очередь"); } catch {}
  }

  function clearQueue() {
    state.queue = [];
    saveQueueLocal();
    renderPanel();
  }

  function playNextFromQueue() {
    if (!state.queue.length) return false;
    const next = state.queue.shift();
    saveQueueLocal();
    playPayload(next);
    renderPanel();
    return true;
  }

  async function saveHistory(track, eventType = "play") {
    if (!track) return;
    const payload = trackPayload(track);

    const key = trackKey(payload);
    const localItem = { trackKey: key, track: payload, eventType, createdAt: new Date().toISOString() };
    state.history = [localItem, ...state.history.filter((item) => item.trackKey !== key)].slice(0, 40);
    localStorage.setItem("nyamiHistoryV60", JSON.stringify(state.history));
    renderPanel();

    try {
      await api("/api/history", {
        method: "POST",
        body: JSON.stringify({ trackKey: key, track: payload, eventType })
      });
    } catch {}
  }

  async function loadHistory() {
    try {
      const data = await api("/api/history");
      if (Array.isArray(data.history) && data.history.length) {
        state.history = data.history;
        localStorage.setItem("nyamiHistoryV60", JSON.stringify(state.history));
        renderPanel();
        return;
      }
    } catch {}

    try {
      state.history = JSON.parse(localStorage.getItem("nyamiHistoryV60") || "[]");
    } catch {
      state.history = [];
    }
    renderPanel();
  }

  async function clearHistory() {
    state.history = [];
    localStorage.removeItem("nyamiHistoryV60");
    renderPanel();
    try { await api("/api/history", { method: "DELETE" }); } catch {}
  }

  async function buildSmartMix(seedTrack) {
    const seed = trackPayload(seedTrack || tracks[currentIndex]);
    try {
      const data = await api("/api/smart-mix", {
        method: "POST",
        body: JSON.stringify({ seed, limit: 24 })
      });
      state.smartMix = (data.mix || []).map((item) => item.track || item);
    } catch {
      state.smartMix = fallbackSmartMix(seed);
    }

    renderPanel();
    openPanel("mix");
    try { showToast("Smart Mix готов"); } catch {}
  }

  function fallbackSmartMix(seed) {
    const seedArtist = String(seed.artist || "").toLowerCase();
    const seedVibe = String(seed.vibe || seed.category || "").toLowerCase();

    return tracks
      .filter((track) => track && trackKey(track) !== trackKey(seed))
      .map((track) => {
        let score = 1;
        if (String(track.artist || "").toLowerCase() === seedArtist) score += 10;
        if (String(track.vibe || track.category || "").toLowerCase() === seedVibe) score += 5;
        return { score, track };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((item) => trackPayload(item.track));
  }

  function queueSmartMix() {
    state.queue.push(...state.smartMix.map(trackPayload));
    state.queue = state.queue.slice(0, 100);
    saveQueueLocal();
    renderPanel();
    try { showToast("Smart Mix добавлен в очередь"); } catch {}
  }

  function ensurePanel() {
    if ($("#queueHistoryPanelV60")) return;

    const panel = document.createElement("aside");
    panel.id = "queueHistoryPanelV60";
    panel.className = "panel queue-history-panel-v60";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <div class="queue-head-v60">
        <div>
          <b>Queue</b>
          <small>History / Smart Mix</small>
        </div>
        <button type="button" class="soft-action" data-queue-close-v60>×</button>
      </div>

      <div class="queue-tabs-v60">
        <button type="button" class="soft-action is-active" data-queue-tab-v60="queue">Queue</button>
        <button type="button" class="soft-action" data-queue-tab-v60="history">History</button>
        <button type="button" class="soft-action" data-queue-tab-v60="mix">Smart Mix</button>
      </div>

      <div class="queue-actions-v60">
        <button type="button" class="soft-action" data-queue-smart-v60>Smart Mix</button>
        <button type="button" class="soft-action" data-queue-clear-v60>Clear queue</button>
      </div>

      <div class="queue-list-v60" data-queue-view-v60="queue"></div>
      <div class="queue-list-v60" data-queue-view-v60="history" hidden></div>
      <div class="queue-list-v60" data-queue-view-v60="mix" hidden></div>
    `;
    document.body.appendChild(panel);

    const launcher = document.createElement("button");
    launcher.id = "queueLauncherV60";
    launcher.className = "soft-action queue-launcher-v60";
    launcher.type = "button";
    launcher.textContent = "Queue";
    document.body.appendChild(launcher);
  }

  function openPanel(tab = "queue") {
    ensurePanel();
    state.panelOpen = true;
    $("#queueHistoryPanelV60").setAttribute("aria-hidden", "false");
    setTab(tab);
    renderPanel();
  }

  function closePanel() {
    state.panelOpen = false;
    $("#queueHistoryPanelV60")?.setAttribute("aria-hidden", "true");
  }

  function setTab(tab) {
    $$("[data-queue-tab-v60]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.queueTabV60 === tab));
    $$("[data-queue-view-v60]").forEach((view) => view.hidden = view.dataset.queueViewV60 !== tab);
  }

  function itemHtml(track, index, type) {
    const payload = trackPayload(track);
    return `
      <button type="button" class="profile-mini-item queue-item-v60" data-queue-item-v60="${index}" data-queue-type-v60="${type}">
        <img src="${safe(payload.cover)}" alt="">
        <span>
          <b>${safe(payload.title)}</b>
          <small>${safe(payload.artist)}${payload.sourceLabel ? " · " + safe(payload.sourceLabel) : ""}</small>
        </span>
        <em>${safe(payload.duration || "play")}</em>
      </button>
    `;
  }

  function renderPanel() {
    ensurePanel();

    const queueView = $('[data-queue-view-v60="queue"]');
    const historyView = $('[data-queue-view-v60="history"]');
    const mixView = $('[data-queue-view-v60="mix"]');

    queueView.innerHTML = state.queue.length
      ? state.queue.map((track, index) => itemHtml(track, index, "queue")).join("")
      : `<div class="popover-empty"><b>Очередь пустая</b><span>Добавь трек через ⋯ или Smart Mix</span></div>`;

    historyView.innerHTML = state.history.length
      ? `
        <div class="queue-actions-v60"><button type="button" class="soft-action" data-history-clear-v60>Clear history</button></div>
        ${state.history.map((item, index) => itemHtml(item.track, index, "history")).join("")}
      `
      : `<div class="popover-empty"><b>История пустая</b><span>Начни слушать треки</span></div>`;

    mixView.innerHTML = state.smartMix.length
      ? `
        <div class="queue-actions-v60"><button type="button" class="soft-action" data-mix-queue-v60>Добавить микс в очередь</button></div>
        ${state.smartMix.map((track, index) => itemHtml(track, index, "mix")).join("")}
      `
      : `<div class="popover-empty"><b>Smart Mix ещё не создан</b><span>Нажми Smart Mix по текущему треку</span></div>`;
  }

  function injectTrackMenuButtons() {
    // This works with the existing action/menu UI if it exposes track index buttons.
    $$("[data-play-track]").forEach((node) => {
      const row = node.closest("[data-track-index], .track-row, .track-card, .track-item") || node.parentElement;
      if (!row || row.querySelector(".queue-mini-actions-v60")) return;

      const index = Number(node.dataset.playTrack ?? row.dataset.trackIndex);
      if (!Number.isInteger(index) || index < 0) return;

      const wrap = document.createElement("span");
      wrap.className = "queue-mini-actions-v60";
      wrap.innerHTML = `
        <button type="button" class="soft-action" data-add-next-v60="${index}" title="Play next">Next</button>
        <button type="button" class="soft-action" data-add-queue-v60="${index}" title="Add to queue">Queue</button>
      `;
      row.appendChild(wrap);
    });
  }

  function patchPlayerFlow() {
    if (state.patched) return;
    if (typeof playTrack !== "function" || typeof nextTrack !== "function") return;
    state.patched = true;

    const oldPlay = playTrack;
    playTrack = async function patchedPlayTrackV60() {
      const result = await oldPlay();
      try { saveHistory(tracks[currentIndex], "play"); } catch {}
      return result;
    };

    const oldNext = nextTrack;
    nextTrack = function patchedNextTrackV60() {
      if (playNextFromQueue()) return;
      return oldNext();
    };
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const launcher = event.target.closest("#queueLauncherV60");
      if (launcher) return openPanel("queue");

      if (event.target.closest("[data-queue-close-v60]")) return closePanel();

      const tab = event.target.closest("[data-queue-tab-v60]");
      if (tab) return setTab(tab.dataset.queueTabV60);

      if (event.target.closest("[data-queue-clear-v60]")) return clearQueue();
      if (event.target.closest("[data-history-clear-v60]")) return clearHistory();
      if (event.target.closest("[data-queue-smart-v60]")) return buildSmartMix(tracks[currentIndex]);
      if (event.target.closest("[data-mix-queue-v60]")) return queueSmartMix();

      const addQueue = event.target.closest("[data-add-queue-v60]");
      if (addQueue) {
        event.preventDefault();
        event.stopPropagation();
        const track = tracks[Number(addQueue.dataset.addQueueV60)];
        if (track) addToQueue(track, false);
        return;
      }

      const addNext = event.target.closest("[data-add-next-v60]");
      if (addNext) {
        event.preventDefault();
        event.stopPropagation();
        const track = tracks[Number(addNext.dataset.addNextV60)];
        if (track) addToQueue(track, true);
        return;
      }

      const item = event.target.closest("[data-queue-item-v60]");
      if (item) {
        const type = item.dataset.queueTypeV60;
        const index = Number(item.dataset.queueItemV60);
        if (type === "queue") {
          const [track] = state.queue.splice(index, 1);
          saveQueueLocal();
          if (track) playPayload(track);
        } else if (type === "history") {
          const track = state.history[index]?.track;
          if (track) playPayload(track);
        } else if (type === "mix") {
          const track = state.smartMix[index];
          if (track) playPayload(track);
        }
        renderPanel();
      }
    });
  }

  function boot() {
    ensurePanel();
    loadQueueLocal();
    loadHistory();
    patchPlayerFlow();
    bindEvents();
    renderPanel();

    setInterval(() => {
      patchPlayerFlow();
      injectTrackMenuButtons();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiQueueHistoryV60 = {
    addToQueue,
    clearQueue,
    buildSmartMix,
    loadHistory,
    openPanel
  };
})();
