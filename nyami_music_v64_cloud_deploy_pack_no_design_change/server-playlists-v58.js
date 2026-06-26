
(() => {
  "use strict";

  const SYNC_FLAG = "_nyamiServerPlaylistV58";
  let loading = false;
  let lastLoadedAt = 0;

  function toast(key) {
    try { showToast(key); } catch {}
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
      throw error;
    }
    return data;
  }

  async function realUserSession() {
    try {
      const data = await api("/api/session");
      return !!(data.authenticated && !data.guest && data.user);
    } catch {
      return false;
    }
  }

  function trackKey(track) {
    const parts = [
      track?.source || track?.sourceType || track?.sourceLabel || "local",
      track?.serverId || "",
      track?.playerType || "",
      track?.file || track?.playUrl || track?.audioUrl || "",
      track?.embedUrl || "",
      track?.title || "",
      track?.artist || ""
    ];
    return parts.join("|").toLowerCase();
  }

  function trackPayload(track) {
    if (!track) return {};
    const payload = {
      title: track.title || "Untitled",
      artist: track.artist || "Unknown",
      vibe: track.vibe || "new",
      category: track.category || "new",
      duration: track.duration || "",
      cover: track.cover || "assets/covers/nowplaying.jpg",
      file: track.file || "",
      source: track.source || "local",
      sourceType: track.sourceType || "",
      sourceLabel: track.sourceLabel || "",
      serverId: track.serverId || "",
      playerType: track.playerType || "",
      playUrl: track.playUrl || "",
      embedUrl: track.embedUrl || "",
      pageUrl: track.pageUrl || "",
      isServerTrack: !!track.isServerTrack,
      isExternalSearch: !!track.isExternalSearch
    };
    payload.trackKey = trackKey(payload);
    return payload;
  }

  function ensureTrackIndex(savedTrack, savedKey) {
    const key = savedKey || trackKey(savedTrack);
    const found = tracks.findIndex((track) => trackKey(track) === key);
    if (found >= 0) return found;

    const normalized = {
      title: savedTrack?.title || "Untitled",
      artist: savedTrack?.artist || "Unknown",
      vibe: savedTrack?.vibe || "new",
      category: savedTrack?.category || "new",
      duration: savedTrack?.duration || "",
      cover: savedTrack?.cover || "assets/covers/nowplaying.jpg",
      file: savedTrack?.file || savedTrack?.playUrl || "",
      source: savedTrack?.source || "server-playlist-v58",
      sourceType: savedTrack?.sourceType || "",
      sourceLabel: savedTrack?.sourceLabel || "",
      serverId: savedTrack?.serverId || "",
      playerType: savedTrack?.playerType || "",
      playUrl: savedTrack?.playUrl || "",
      embedUrl: savedTrack?.embedUrl || "",
      pageUrl: savedTrack?.pageUrl || "",
      isServerTrack: !!savedTrack?.isServerTrack,
      isExternalSearch: !!savedTrack?.isExternalSearch
    };

    tracks.push(normalized);
    return tracks.length - 1;
  }

  function serverToLocalPlaylist(playlist) {
    const ids = (playlist.tracks || [])
      .map((item) => ensureTrackIndex(item.track || {}, item.trackKey))
      .filter((index) => Number.isInteger(index) && index >= 0);

    return {
      id: `server-${playlist.id}`,
      serverPlaylistId: playlist.id,
      [SYNC_FLAG]: true,
      kind: "custom",
      name: playlist.name,
      description: playlist.description || "",
      filter: playlist.filter || "all",
      cover: playlist.cover || coverForFilter(playlist.filter || "all"),
      trackIds: ids
    };
  }

  function applyServerPlaylists(playlists) {
    const serverMapped = playlists.map(serverToLocalPlaylist);
    const localOnly = userPlaylists.filter((playlist) => !playlist[SYNC_FLAG] && !playlist.serverPlaylistId);

    userPlaylists = [...serverMapped, ...localOnly];
    try { savePlaylists(); } catch {}
    try { renderUserPlaylists(); } catch {}
    try { if (currentView === "library") renderLibraryView(); } catch {}
    try { if (currentView === "playlist" && activePlaylist?.serverPlaylistId) {
      const fresh = userPlaylists.find((item) => item.serverPlaylistId === activePlaylist.serverPlaylistId);
      if (fresh) {
        activePlaylist = { ...fresh, kind: "custom" };
        renderTracks();
      }
    }} catch {}
  }

  async function loadServerPlaylists(force = false) {
    if (loading) return;
    if (!force && Date.now() - lastLoadedAt < 1400) return;

    const ok = await realUserSession();
    if (!ok) return;

    loading = true;
    try {
      const data = await api("/api/playlists");
      applyServerPlaylists(data.playlists || []);
      lastLoadedAt = Date.now();
    } catch (error) {
      if (error.status !== 401 && error.status !== 403) console.warn("Server playlists load failed", error);
    } finally {
      loading = false;
    }
  }

  async function createServerPlaylistFromLocal(localPlaylist) {
    const ok = await realUserSession();
    if (!ok) {
      toast("auth.loginRequired");
      return null;
    }

    const playlistTracks = (localPlaylist.trackIds || [])
      .map((index) => tracks[index])
      .filter(Boolean)
      .map(trackPayload);

    const data = await api("/api/playlists", {
      method: "POST",
      body: JSON.stringify({
        name: localPlaylist.name,
        description: localPlaylist.description || "",
        filter: localPlaylist.filter || "all",
        cover: localPlaylist.cover || coverForFilter(localPlaylist.filter || "all"),
        tracks: playlistTracks
      })
    });

    return data.playlist;
  }

  async function syncAddTrack(playlist, trackIndex) {
    if (!playlist?.serverPlaylistId || !tracks[trackIndex]) return;

    const payload = trackPayload(tracks[trackIndex]);
    try {
      await api(`/api/playlists/${playlist.serverPlaylistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({
          trackKey: payload.trackKey,
          track: payload
        })
      });
      await loadServerPlaylists(true);
    } catch (error) {
      console.warn("Server playlist add failed", error);
    }
  }

  async function syncRemoveTrack(playlist, trackIndex) {
    if (!playlist?.serverPlaylistId || !tracks[trackIndex]) return;

    const key = encodeURIComponent(trackPayload(tracks[trackIndex]).trackKey);
    try {
      await api(`/api/playlists/${playlist.serverPlaylistId}/tracks?key=${key}`, {
        method: "DELETE"
      });
      await loadServerPlaylists(true);
    } catch (error) {
      console.warn("Server playlist remove failed", error);
    }
  }

  async function syncDeletePlaylist(playlist) {
    if (!playlist?.serverPlaylistId) return;

    try {
      await api(`/api/playlists/${playlist.serverPlaylistId}`, {
        method: "DELETE"
      });
    } catch (error) {
      console.warn("Server playlist delete failed", error);
    }
  }

  function patchTrackMenuActions() {
    if (window.NyamiServerPlaylistsPatchedV58) return;
    window.NyamiServerPlaylistsPatchedV58 = true;

    const oldAdd = typeof addTrackToPlaylist === "function" ? addTrackToPlaylist : null;
    if (oldAdd) {
      addTrackToPlaylist = function patchedAddTrackToPlaylistV58(playlistId, trackIndex) {
        const result = oldAdd(playlistId, trackIndex);
        const playlist = userPlaylists.find((item) => String(item.id) === String(playlistId));
        if (playlist?.serverPlaylistId) syncAddTrack(playlist, trackIndex);
        return result;
      };
    }

    const oldRemove = typeof removeTrackFromActivePlaylist === "function" ? removeTrackFromActivePlaylist : null;
    if (oldRemove) {
      removeTrackFromActivePlaylist = function patchedRemoveTrackV58(trackIndex) {
        const playlist = activePlaylist ? { ...activePlaylist } : null;
        const result = oldRemove(trackIndex);
        if (playlist?.serverPlaylistId) syncRemoveTrack(playlist, trackIndex);
        return result;
      };
    }
  }

  function bindCreateButton() {
    const button = document.querySelector("#createPlaylistSubmitBtn");
    if (!button || button.dataset.serverPlaylistBoundV58) return;
    button.dataset.serverPlaylistBoundV58 = "1";

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const beforeIds = new Set(userPlaylists.map((playlist) => String(playlist.id)));

      try {
        createPlaylist();
      } catch (error) {
        console.warn("Local create playlist failed", error);
        return;
      }

      const created = userPlaylists.find((playlist) => !beforeIds.has(String(playlist.id)));
      if (!created) return;

      if (created.serverPlaylistId) return;

      try {
        const serverPlaylist = await createServerPlaylistFromLocal(created);
        if (!serverPlaylist) return;

        userPlaylists = userPlaylists.filter((playlist) => String(playlist.id) !== String(created.id));
        applyServerPlaylists([serverPlaylist, ...userPlaylists.filter((playlist) => playlist[SYNC_FLAG]).map((playlist) => ({
          id: playlist.serverPlaylistId,
          name: playlist.name,
          description: playlist.description,
          filter: playlist.filter,
          cover: playlist.cover,
          tracks: (playlist.trackIds || []).map((index) => ({ track: trackPayload(tracks[index]), trackKey: trackPayload(tracks[index]).trackKey }))
        }))]);

        await loadServerPlaylists(true);
      } catch (error) {
        console.warn("Server create playlist failed", error);
      }
    }, true);
  }

  function bindDeleteButton() {
    const button = document.querySelector("#playlistDeleteBtn");
    if (!button || button.dataset.serverPlaylistBoundV58) return;
    button.dataset.serverPlaylistBoundV58 = "1";

    button.addEventListener("click", async (event) => {
      if (!activePlaylist?.serverPlaylistId) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const playlist = { ...activePlaylist };
      await syncDeletePlaylist(playlist);

      userPlaylists = userPlaylists.filter((item) => item.serverPlaylistId !== playlist.serverPlaylistId && String(item.id) !== String(playlist.id));
      try { savePlaylists(); } catch {}
      activePlaylist = null;
      try { renderUserPlaylists(); } catch {}
      try { setView("library"); } catch {}
      toast("toast.playlistDeleted");
    }, true);
  }

  function bindSessionTriggers() {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-nyami-auth-open], #profileOpenBtn, .library-create-btn, #openCreateBtn")) {
        setTimeout(() => loadServerPlaylists(true), 900);
      }
    });

    window.addEventListener("focus", () => loadServerPlaylists(true));
  }

  function boot() {
    patchTrackMenuActions();
    bindCreateButton();
    bindDeleteButton();
    bindSessionTriggers();

    loadServerPlaylists(true);

    setInterval(() => {
      patchTrackMenuActions();
      bindCreateButton();
      bindDeleteButton();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiServerPlaylistsV58 = {
    load: loadServerPlaylists,
    trackKey,
    trackPayload
  };
})();
