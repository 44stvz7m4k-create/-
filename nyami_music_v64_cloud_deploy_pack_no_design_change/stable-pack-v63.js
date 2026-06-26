
(() => {
  "use strict";

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Accept": "application/json",
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) throw new Error(data?.error?.message || "API error");
    return data;
  }

  function showRuntimeReport(report) {
    let modal = document.querySelector("#runtimeReportV63");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "runtimeReportV63";
      modal.className = "runtime-report-modal-v63";
      modal.innerHTML = `
        <div class="panel runtime-report-card-v63">
          <div class="panel-title">
            <div>
              <h2>Runtime report</h2>
              <p>Build / storage / database checks</p>
            </div>
            <button type="button" class="soft-action" data-runtime-close-v63>×</button>
          </div>
          <pre></pre>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.querySelector("pre").textContent = JSON.stringify(report, null, 2);
    modal.hidden = false;
  }

  async function openRuntimeReport() {
    try {
      const report = await api("/api/admin/runtime-report");
      showRuntimeReport(report);
    } catch {
      try { showToast("Runtime report доступен только админу"); } catch {}
    }
  }

  function ensureButtons() {
    const adminPanel = document.querySelector("#adminPanel") || document.querySelector(".admin-panel") || document.querySelector("[data-admin-panel]");
    if (adminPanel && !document.querySelector("#runtimeReportBtnV63")) {
      const btn = document.createElement("button");
      btn.id = "runtimeReportBtnV63";
      btn.type = "button";
      btn.className = "soft-action";
      btn.textContent = "Runtime report";
      const target = adminPanel.querySelector(".admin-actions") || adminPanel.querySelector(".panel-title") || adminPanel;
      target.appendChild(btn);
    }

    const profileMenu = document.querySelector("#profileDropdown") || document.querySelector(".profile-dropdown");
    if (profileMenu && !document.querySelector("#healthCheckBtnV63")) {
      const btn = document.createElement("button");
      btn.id = "healthCheckBtnV63";
      btn.type = "button";
      btn.className = "profile-menu-item";
      btn.textContent = "Health check";
      profileMenu.appendChild(btn);
    }
  }

  function bind() {
    document.addEventListener("click", async (event) => {
      if (event.target.closest("#runtimeReportBtnV63") || event.target.closest("#healthCheckBtnV63")) {
        event.preventDefault();
        try {
          const report = event.target.closest("#healthCheckBtnV63")
            ? await api("/api/health")
            : await api("/api/admin/runtime-report");
          showRuntimeReport(report);
        } catch {
          try { showToast("Не удалось открыть report"); } catch {}
        }
        return;
      }

      if (event.target.closest("[data-runtime-close-v63]")) {
        document.querySelector("#runtimeReportV63").hidden = true;
      }
    });
  }

  async function pingHealth() {
    try {
      const data = await api("/api/health");
      window.NyamiHealthV63 = data;
    } catch {}
  }

  function boot() {
    bind();
    pingHealth();
    setInterval(ensureButtons, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.NyamiStablePackV63 = { openRuntimeReport, pingHealth };
})();
