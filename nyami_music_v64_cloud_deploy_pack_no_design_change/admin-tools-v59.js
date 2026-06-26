
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let tracksCache = [];
  let currentEditTrack = null;

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
      throw new Error(data?.error?.message || "API error");
    }
    return data;
  }

  async function loadAdminTracks() {
    const data = await api("/api/admin/tracks");
    tracksCache = data.tracks || [];
    return tracksCache;
  }

  function ensureModal() {
    if ($("#adminEditTrackV59")) return;

    const modal = document.createElement("div");
    modal.id = "adminEditTrackV59";
    modal.className = "admin-edit-modal-v59";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="nyami-admin-card admin-edit-card-v59">
        <div class="admin-edit-head-v59">
          <div>
            <p class="nyami-admin-kicker">edit source</p>
            <h2>Edit track</h2>
          </div>
          <button class="nyami-admin-btn is-ghost" type="button" data-admin-edit-close>×</button>
        </div>

        <form class="nyami-admin-form" id="adminEditTrackFormV59">
          <div class="nyami-admin-row">
            <label class="nyami-admin-label">
              <span>Title</span>
              <input name="title" required>
            </label>
            <label class="nyami-admin-label">
              <span>Artist</span>
              <input name="artist" required>
            </label>
          </div>

          <label class="nyami-admin-label">
            <span>Source type</span>
            <select name="sourceType">
              <option value="upload">Upload/local</option>
              <option value="direct">Direct URL</option>
              <option value="youtube">YouTube</option>
              <option value="spotify">Spotify</option>
              <option value="soundcloud">SoundCloud</option>
              <option value="jamendo">Jamendo</option>
              <option value="internet_archive">Internet Archive</option>
            </select>
          </label>

          <label class="nyami-admin-label">
            <span>External / page URL</span>
            <input name="externalUrl" placeholder="https://...">
          </label>

          <label class="nyami-admin-label">
            <span>Cover URL</span>
            <input name="coverUrl" placeholder="https://...">
          </label>

          <label class="nyami-admin-label">
            <span>Source label</span>
            <input name="sourceLabel" placeholder="Server / YouTube / Spotify">
          </label>

          <button class="nyami-admin-btn" type="submit">Save changes</button>
          <div class="nyami-admin-message" id="adminEditTrackMsgV59"></div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-admin-edit-close]")) {
        closeModal();
      }
    });

    $("#adminEditTrackFormV59").addEventListener("submit", saveEdit);
  }

  function openModal(track) {
    ensureModal();
    currentEditTrack = track;

    const modal = $("#adminEditTrackV59");
    const form = $("#adminEditTrackFormV59");

    form.title.value = track.title || "";
    form.artist.value = track.artist || "";
    form.sourceType.value = track.sourceType || "upload";
    form.externalUrl.value = track.externalUrl || track.pageUrl || track.audioUrl || "";
    form.coverUrl.value = track.coverUrl && !track.coverUrl.startsWith("/uploads/") ? track.coverUrl : "";
    form.sourceLabel.value = track.sourceLabel || "";

    $("#adminEditTrackMsgV59").textContent = "";
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    $("#adminEditTrackV59")?.setAttribute("aria-hidden", "true");
    currentEditTrack = null;
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!currentEditTrack) return;

    const form = event.currentTarget;
    const msg = $("#adminEditTrackMsgV59");
    msg.textContent = "Saving…";

    try {
      await api(`/api/admin/tracks/${currentEditTrack.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: form.title.value,
          artist: form.artist.value,
          sourceType: form.sourceType.value,
          externalUrl: form.externalUrl.value,
          coverUrl: form.coverUrl.value,
          sourceLabel: form.sourceLabel.value
        })
      });

      msg.textContent = "Saved.";
      await refreshAdminAndPublic();
      setTimeout(closeModal, 350);
    } catch (error) {
      msg.textContent = error.message || "Save failed.";
    }
  }

  async function refreshAdminAndPublic() {
    try { await loadAdminTracks(); } catch {}
    try { if (window.nyamiAdminV48?.refresh) window.nyamiAdminV48.refresh(); } catch {}
    try { if (window.loadServerTracks) window.loadServerTracks(); } catch {}
  }

  async function injectEditButtons() {
    if (!document.body.classList.contains("nyami-admin-open")) return;

    const buttons = $$("[data-delete-track]");
    if (!buttons.length) return;

    if (!tracksCache.length) {
      try { await loadAdminTracks(); } catch { return; }
    }

    buttons.forEach((deleteButton) => {
      const id = deleteButton.dataset.deleteTrack;
      const actions = deleteButton.closest(".nyami-admin-track-actions") || deleteButton.parentElement;
      if (!actions || actions.querySelector(`[data-edit-track="${id}"]`)) return;

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "nyami-admin-btn is-ghost";
      edit.dataset.editTrack = id;
      edit.textContent = "Edit";
      actions.insertBefore(edit, deleteButton);
    });
  }

  async function ensureToolsPanel() {
    if (!document.body.classList.contains("nyami-admin-open")) return;
    if ($("#adminDataToolsV59")) return;

    const grid = $("#nyamiAdminDashboard .nyami-admin-grid");
    if (!grid) return;

    const card = document.createElement("div");
    card.id = "adminDataToolsV59";
    card.className = "nyami-admin-card admin-data-tools-v59";
    card.innerHTML = `
      <p class="nyami-admin-kicker">backup</p>
      <h2>Export / Import</h2>
      <div class="admin-tools-actions-v59">
        <a class="nyami-admin-btn" href="/api/admin/export-content" target="_blank" rel="noopener">Export content</a>
      </div>
      <label class="nyami-admin-label">
        <span>Import JSON backup</span>
        <textarea id="adminImportJsonV59" rows="8" placeholder='{"type":"nyami_content_backup","tables":{...}}'></textarea>
      </label>
      <div class="admin-tools-actions-v59">
        <button class="nyami-admin-btn is-ghost" id="adminImportMergeV59" type="button">Import merge</button>
        <button class="nyami-admin-btn is-danger" id="adminImportReplaceV59" type="button">Replace tracks</button>
      </div>
      <div class="nyami-admin-message" id="adminImportMsgV59"></div>
    `;
    grid.appendChild(card);

    $("#adminImportMergeV59").addEventListener("click", () => importBackup("merge"));
    $("#adminImportReplaceV59").addEventListener("click", () => importBackup("replace"));
  }

  async function importBackup(mode) {
    const msg = $("#adminImportMsgV59");
    const raw = $("#adminImportJsonV59").value.trim();
    if (!raw) {
      msg.textContent = "Paste backup JSON first.";
      return;
    }

    try {
      const backup = JSON.parse(raw);
      msg.textContent = "Importing…";
      const data = await api("/api/admin/import-content", {
        method: "POST",
        body: JSON.stringify({ mode, backup })
      });
      msg.textContent = `Imported: tracks ${data.imported?.tracks || 0}, playlists ${data.imported?.playlists || 0}.`;
      await refreshAdminAndPublic();
    } catch (error) {
      msg.textContent = error.message || "Import failed.";
    }
  }

  document.addEventListener("click", async (event) => {
    const edit = event.target.closest("[data-edit-track]");
    if (!edit) return;

    event.preventDefault();
    event.stopPropagation();

    try {
      const tracks = await loadAdminTracks();
      const track = tracks.find((item) => String(item.id) === String(edit.dataset.editTrack));
      if (track) openModal(track);
    } catch {}
  });

  function boot() {
    ensureModal();
    setInterval(() => {
      injectEditButtons();
      ensureToolsPanel();
    }, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
