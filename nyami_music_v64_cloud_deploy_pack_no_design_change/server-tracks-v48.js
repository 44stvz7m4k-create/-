
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sourceEmoji(sourceType) {
    if (sourceType === "youtube") return "▶";
    if (sourceType === "spotify") return "♬";
    if (sourceType === "direct") return "URL";
    return "♫";
  }

  async function fetchTracks() {
    const response = await fetch("/api/tracks", {
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data?.error?.message || "Tracks API failed");
    }

    return Array.isArray(data.tracks) ? data.tracks : [];
  }

  function externalHost() {
    return $("#externalSourcesV53") || $("#trackList") || $(".tracks") || $(".main") || document.body;
  }

  function renderExternalSources(externalTracks) {
    const host = externalHost();
    if (!host) return;

    let mount = $("#externalSourcesV53");
    if (!externalTracks.length) {
      if (mount) mount.remove();
      return;
    }

    if (!mount) {
      mount = document.createElement("section");
      mount.id = "externalSourcesV53";
      mount.className = "external-sources-v53";

      if (host.id === "trackList") {
        host.parentNode.insertBefore(mount, host);
      } else if (host === document.body) {
        host.appendChild(mount);
      } else {
        host.prepend(mount);
      }
    }

    mount.innerHTML = `
      <div class="external-sources-head-v53">
        <div>
          <p>external library</p>
          <h2>Sources</h2>
        </div>
      </div>
      <div class="external-sources-grid-v53">
        ${externalTracks.map((track) => {
          const sourceType = String(track.sourceType || track.provider || "external").toLowerCase();
          const pageUrl = track.pageUrl || track.externalUrl || "#";
          return `
            <article class="external-source-card-v53 ${escapeHtml(sourceType)}">
              <a class="external-source-cover-v53" href="${escapeHtml(pageUrl)}" target="_blank" rel="noopener noreferrer">
                ${track.coverUrl ? `<img src="${escapeHtml(track.coverUrl)}" alt="">` : `<span>${escapeHtml(sourceEmoji(sourceType))}</span>`}
              </a>
              <div class="external-source-body-v53">
                <b>${escapeHtml(track.title)}</b>
                <span>${escapeHtml(track.artist)}</span>
                <small>${escapeHtml(track.sourceLabel || sourceType)}</small>
              </div>
              <a class="external-source-open-v53" href="${escapeHtml(pageUrl)}" target="_blank" rel="noopener noreferrer">Open</a>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  async function loadServerTracks() {
    try {
      const serverTracks = await fetchTracks();
      window.nyamiServerTracksV48 = serverTracks;

      let externalTracks = [];

      if (window.NyamiPlayerBridgeV53?.mergeServerTracks) {
        const result = window.NyamiPlayerBridgeV53.mergeServerTracks(serverTracks);
        externalTracks = result?.external || [];
      } else if (window.NyamiPlayerBridgeV52?.mergeServerTracks) {
        window.NyamiPlayerBridgeV52.mergeServerTracks(serverTracks);
        externalTracks = serverTracks.filter((track) => track.isPlayable === false);
      } else {
        externalTracks = serverTracks.filter((track) => track.isPlayable === false);
      }

      renderExternalSources(externalTracks);

      return serverTracks;
    } catch (error) {
      console.warn("Cannot load server tracks", error);
      return [];
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-server-play]");
    if (!button) return;

    if (window.NyamiPlayerBridgeV53?.playServerTrackById) {
      const ok = window.NyamiPlayerBridgeV53.playServerTrackById(button.dataset.serverPlay);
      if (ok) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadServerTracks, { once: true });
  } else {
    loadServerTracks();
  }

  window.loadServerTracks = loadServerTracks;
})();
