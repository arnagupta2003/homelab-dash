(function () {
  const cfg = window.HOMELAB_CONFIG;
  if (!cfg) return;

  const state = {
    activeTab: "overview", // "overview" | "apps" | "servers" | "help"
    techMode: false, // false = Family View (default), true = Tech View
    searchQuery: "",
    selectedCategory: "All",
    selectedServerId: "All",
    lastChecked: new Date(),
  };

  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: "layout-dashboard" },
    { id: "apps", label: "Family Apps", techLabel: "All Services", icon: "grid-2x2" },
    { id: "servers", label: "5 Servers", techLabel: "5 Server Nodes", icon: "server" },
    { id: "help", label: "Guides & Help", icon: "book-open-check" },
  ];

  // --- Helpers ---
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function statusMeta(status) {
    if (status === "online") {
      return {
        dot: "bg-emerald-400",
        pill: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        familyLabel: "Working",
        techLabel: "Online",
      };
    }
    if (status === "restarting") {
      return {
        dot: "bg-amber-400",
        pill: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        familyLabel: "Updating",
        techLabel: "Restarting",
      };
    }
    return {
      dot: "bg-rose-400",
      pill: "border-rose-500/20 bg-rose-500/10 text-rose-400",
      familyLabel: "Offline",
      techLabel: "Down",
    };
  }

  function getServerById(id) {
    return cfg.servers.find((s) => s.id === id);
  }

  function getServicesForServer(serverId) {
    return cfg.services.filter((svc) => svc.serverId === serverId);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("opacity-0", "translate-y-4");
    toast.classList.add("opacity-100", "translate-y-0");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-4");
    }, 2400);
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // --- Chrome / Branding / Navigation ---
  function renderBranding() {
    const { initials, title, subtitle, contactLabel, contactUrl } = cfg.brand;
    ["sidebar-initials", "mobile-initials", "drawer-initials"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = initials;
    });
    ["sidebar-brand-title", "mobile-brand-title", "drawer-brand-title"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = title;
    });
    ["sidebar-brand-subtitle", "drawer-brand-subtitle"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = subtitle;
    });

    const contactBtn = document.getElementById("sidebar-contact-btn");
    const contactLbl = document.getElementById("sidebar-contact-label");
    const drawerContact = document.getElementById("drawer-contact-btn");
    if (contactBtn) contactBtn.href = contactUrl;
    if (contactLbl) contactLbl.textContent = contactLabel;
    if (drawerContact) drawerContact.href = contactUrl;

    const onlineCount = cfg.servers.filter((s) => s.status === "online").length;
    const allOnline = onlineCount === cfg.servers.length;
    const bannerDot = document.getElementById("banner-dot");
    const bannerText = document.getElementById("banner-text");
    const bannerLocation = document.getElementById("banner-location");

    if (bannerDot) {
      bannerDot.className = `h-2 w-2 rounded-full ${allOnline ? "bg-emerald-400" : "bg-amber-400"}`;
    }
    if (bannerText) {
      bannerText.textContent = allOnline ? cfg.banner.allGoodText : cfg.banner.degradedText;
    }
    if (bannerLocation) {
      bannerLocation.textContent = cfg.banner.location;
    }
  }

  function renderNav() {
    const html = NAV_ITEMS.map((item) => {
      const active = state.activeTab === item.id;
      const label = state.techMode && item.techLabel ? item.techLabel : item.label;
      return `
        <button
          data-tab="${item.id}"
          class="nav-tab-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
            active
              ? "bg-zinc-800/90 text-zinc-50"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          }"
        >
          <i data-lucide="${item.icon}" class="h-4 w-4 shrink-0"></i>
          <span>${escapeHtml(label)}</span>
        </button>
      `;
    }).join("");

    const desktopNav = document.getElementById("desktop-nav");
    const mobileNav = document.getElementById("mobile-nav");
    if (desktopNav) desktopNav.innerHTML = html;
    if (mobileNav) mobileNav.innerHTML = html;

    document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.getAttribute("data-tab");
        closeMobileDrawer();
        render();
      });
    });

    // Update mode toggle UI
    const badge = document.getElementById("mode-badge");
    const toggleLabel = document.getElementById("mode-toggle-label");
    const mobileToggle = document.getElementById("mobile-mode-toggle");
    if (badge) {
      badge.textContent = state.techMode ? "Tech" : "Family";
      badge.className = state.techMode
        ? "rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-400"
        : "rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400";
    }
    if (toggleLabel) {
      toggleLabel.textContent = state.techMode ? "Switch to Family View" : "Switch to Tech View";
    }
    if (mobileToggle) {
      mobileToggle.textContent = state.techMode ? "Tech View" : "Family View";
    }
  }

  // --- Shared Card Renderers ---
  function renderServiceCard(svc) {
    const srv = getServerById(svc.serverId);
    const st = statusMeta(svc.status);
    const title = state.techMode ? svc.techName : svc.familyName;
    const subtitle = state.techMode
      ? svc.techStack
      : srv
      ? `Lives on: ${srv.familyName}`
      : svc.category;

    return `
      <div class="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/60">
        <div>
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200">
                <i data-lucide="${escapeHtml(svc.icon || "box")}" class="h-4 w-4"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-zinc-100">${escapeHtml(title)}</h3>
                <p class="text-[11px] text-zinc-500">${escapeHtml(subtitle)}</p>
              </div>
            </div>
            <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${st.pill}">
              <span class="h-1.5 w-1.5 rounded-full ${st.dot}"></span>
              ${escapeHtml(state.techMode ? st.techLabel : st.familyLabel)}
            </span>
          </div>

          <p class="mt-3 text-xs leading-relaxed text-zinc-300">
            ${escapeHtml(svc.familyDescription)}
          </p>

          ${
            !state.techMode && svc.quickTip
              ? `<p class="mt-2.5 rounded-md border border-zinc-800/70 bg-zinc-900/50 px-2.5 py-1.5 text-[11px] text-zinc-400"><span class="font-medium text-zinc-300">Tip:</span> ${escapeHtml(svc.quickTip)}</p>`
              : ""
          }

          ${
            state.techMode && srv
              ? `<p class="mt-2.5 font-mono-code text-[11px] text-zinc-500">${escapeHtml(srv.techName)} · ${escapeHtml(srv.ip)} · ${escapeHtml(svc.url)}</p>`
              : ""
          }
        </div>

        <div class="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-3">
          <span class="text-[11px] text-zinc-500">${escapeHtml(svc.category)}</span>
          <a
            href="${escapeHtml(svc.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            <span>Open App</span>
            <i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i>
          </a>
        </div>
      </div>
    `;
  }

  // --- Views ---
  function renderOverview() {
    const onlineServers = cfg.servers.filter((s) => s.status === "online").length;
    const onlineServices = cfg.services.filter((s) => s.status === "online").length;
    const featuredServices = cfg.services.filter((s) => s.featured);

    const heroTitle = state.techMode
      ? `${cfg.brand.title} — Infrastructure Overview`
      : `Welcome to ${cfg.brand.title}`;
    const heroSubtitle = state.techMode
      ? `5-node self-hosted cluster · ${onlineServices}/${cfg.services.length} services healthy`
      : `Everything our family uses at home—movies, photos, smart home & files—in one simple place.`;
    const heroBody = state.techMode
      ? `Managed across ${cfg.servers.length} servers (Proxmox, TrueNAS, GPU worker, Raspberry Pi, and Cloud VPS). Toggle Family View anytime to preview the simplified experience.`
      : `Pick any app below and click "Open App" to start using it. You don't need to remember any server names or numbers.`;

    return `
      <!-- Hero Card -->
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">${escapeHtml(heroTitle)}</h1>
        <p class="mt-1.5 text-sm font-medium text-zinc-400">${escapeHtml(heroSubtitle)}</p>
        <p class="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300">${escapeHtml(heroBody)}</p>
        <div class="mt-5 flex flex-wrap gap-2.5">
          <button data-goto="apps" class="goto-btn inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">
            <i data-lucide="grid-2x2" class="h-3.5 w-3.5"></i>
            <span>Browse All Apps (${cfg.services.length})</span>
          </button>
          <button data-goto="servers" class="goto-btn inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-800">
            <i data-lucide="server" class="h-3.5 w-3.5"></i>
            <span>View 5 Servers</span>
          </button>
          <button data-goto="help" class="goto-btn inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100">
            <i data-lucide="help-circle" class="h-3.5 w-3.5"></i>
            <span>How to Use</span>
          </button>
        </div>
      </section>

      <!-- 4 KPI Cards (matching template grid) -->
      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
          <p class="text-xs font-medium text-zinc-400">Home Servers</p>
          <p class="mt-1.5 font-mono-code text-lg font-semibold text-zinc-100">${onlineServers} / ${cfg.servers.length} Online</p>
          <p class="mt-1 text-xs text-zinc-500">${state.techMode ? "Proxmox · TrueNAS · GPU · Pi · VPS" : "All home computers running"}</p>
        </div>
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
          <p class="text-xs font-medium text-zinc-400">Family Apps</p>
          <p class="mt-1.5 font-mono-code text-lg font-semibold text-zinc-100">${onlineServices} Ready</p>
          <p class="mt-1 text-xs text-zinc-500">Movies, photos, drive &amp; smart home</p>
        </div>
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
          <p class="text-xs font-medium text-zinc-400">Privacy</p>
          <p class="mt-1.5 font-mono-code text-lg font-semibold text-zinc-100">100% Local</p>
          <p class="mt-1 text-xs text-zinc-500">Photos &amp; AI stay in our house</p>
        </div>
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-4">
          <p class="text-xs font-medium text-zinc-400">Need Help?</p>
          <p class="mt-1.5 font-mono-code text-lg font-semibold text-zinc-100">Ask ${escapeHtml(cfg.brand.ownerName)}</p>
          <p class="mt-1 text-xs text-zinc-500">Simple guides in the Help tab</p>
        </div>
      </section>

      <!-- Two-Column Split: Quick-Launch Apps + 5 Servers Snapshot -->
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Quick-Launch Apps -->
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-zinc-100">${state.techMode ? "Featured Services" : "Most Used by Family"}</h2>
            <button data-goto="apps" class="goto-btn text-xs text-zinc-400 hover:text-zinc-200">View all →</button>
          </div>
          <div class="space-y-2.5">
            ${featuredServices
              .map((svc) => {
                const st = statusMeta(svc.status);
                const title = state.techMode ? svc.techName : svc.familyName;
                const desc = state.techMode ? svc.techStack : svc.familyDescription;
                return `
                  <div class="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
                    <div class="flex min-w-0 items-center gap-3">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300">
                        <i data-lucide="${escapeHtml(svc.icon || "box")}" class="h-4 w-4"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <p class="truncate text-sm font-medium text-zinc-100">${escapeHtml(title)}</p>
                          <span class="h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}"></span>
                        </div>
                        <p class="truncate text-xs text-zinc-400">${escapeHtml(desc)}</p>
                      </div>
                    </div>
                    <a
                      href="${escapeHtml(svc.url)}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="shrink-0 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-800"
                    >
                      Open
                    </a>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>

        <!-- 5 Servers Snapshot -->
        <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-zinc-100">The 5 Home Servers</h2>
            <button data-goto="servers" class="goto-btn text-xs text-zinc-400 hover:text-zinc-200">Details →</button>
          </div>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            ${cfg.servers
              .map((srv) => {
                const st = statusMeta(srv.status);
                const name = state.techMode ? srv.techName : srv.familyName;
                const sub = state.techMode ? `${srv.ip} · ${srv.uptime}` : srv.location;
                return `
                  <button
                    data-server-jump="${escapeHtml(srv.id)}"
                    class="server-jump-btn rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <span class="truncate text-xs font-semibold text-zinc-200">${escapeHtml(name)}</span>
                      <span class="h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}"></span>
                    </div>
                    <p class="mt-1 truncate text-[11px] text-zinc-500">${escapeHtml(sub)}</p>
                    <p class="mt-1.5 line-clamp-1 text-[11px] text-zinc-400">${escapeHtml(srv.role)}</p>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderApps() {
    const categories = ["All", ...new Set(cfg.services.map((s) => s.category))];
    const q = state.searchQuery.trim().toLowerCase();

    const filtered = cfg.services.filter((svc) => {
      const catOk = state.selectedCategory === "All" || svc.category === state.selectedCategory;
      const srvOk = state.selectedServerId === "All" || svc.serverId === state.selectedServerId;
      const text = `${svc.familyName} ${svc.techName} ${svc.familyDescription} ${svc.techStack} ${svc.category}`.toLowerCase();
      const qOk = !q || text.includes(q);
      return catOk && srvOk && qOk;
    });

    return `
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-xl font-semibold text-zinc-50">${state.techMode ? "All Self-Hosted Services" : "Family Apps"}</h1>
            <p class="mt-1 text-xs text-zinc-400">
              ${state.techMode ? "Filter by category, server node, or search stack details." : "Search or pick a category to open any app."}
            </p>
          </div>
          <div class="relative w-full sm:w-64">
            <i data-lucide="search" class="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500"></i>
            <input
              id="apps-search-input"
              type="text"
              value="${escapeHtml(state.searchQuery)}"
              placeholder="Search apps (e.g. photos, movies)..."
              class="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <!-- Category Pills -->
        <div class="mt-4 flex flex-wrap gap-2">
          ${categories
            .map((cat) => {
              const active = state.selectedCategory === cat;
              return `
                <button
                  data-category="${escapeHtml(cat)}"
                  class="cat-pill-btn rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-zinc-100 text-zinc-950"
                      : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }"
                >
                  ${escapeHtml(cat)}
                </button>
              `;
            })
            .join("")}
        </div>
      </section>

      ${
        filtered.length === 0
          ? `<div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-8 text-center">
              <p class="text-sm font-medium text-zinc-300">No apps matched your search.</p>
              <button id="clear-filters-btn" class="mt-3 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800">Reset Filters</button>
            </div>`
          : `<section class="grid grid-cols-1 gap-3 sm:grid-cols-2">${filtered.map(renderServiceCard).join("")}</section>`
      }
    `;
  }

  function renderMetricBar(label, value) {
    const color = value > 85 ? "bg-rose-400" : value > 65 ? "bg-amber-400" : "bg-emerald-400";
    return `
      <div>
        <div class="flex justify-between text-[11px] text-zinc-400">
          <span>${escapeHtml(label)}</span>
          <span class="font-mono-code text-zinc-300">${value}%</span>
        </div>
        <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div class="h-full rounded-full ${color}" style="width: ${value}%"></div>
        </div>
      </div>
    `;
  }

  function renderServers() {
    return `
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-xl font-semibold text-zinc-50">${state.techMode ? "Cluster Nodes (5 Servers)" : "Our 5 Home Servers"}</h1>
            <p class="mt-1 text-xs text-zinc-400">
              ${
                state.techMode
                  ? "Hardware specs, local IPs, uptime, and hosted workloads."
                  : "These 5 computers run all of our family's apps. Green means everything is working fine."
              }
            </p>
          </div>
          <span class="font-mono-code text-[11px] text-zinc-500">
            Last checked: ${state.lastChecked.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </section>

      <section class="space-y-3">
        ${cfg.servers
          .map((srv) => {
            const st = statusMeta(srv.status);
            const svcs = getServicesForServer(srv.id);
            const title = state.techMode ? srv.techName : srv.familyName;

            return `
              <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200">
                      <i data-lucide="server" class="h-4 w-4"></i>
                    </div>
                    <div>
                      <div class="flex flex-wrap items-center gap-2">
                        <h2 class="text-sm font-semibold text-zinc-100">${escapeHtml(title)}</h2>
                        <span class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${st.pill}">
                          <span class="h-1.5 w-1.5 rounded-full ${st.dot}"></span>
                          ${escapeHtml(state.techMode ? st.techLabel : st.familyLabel)}
                        </span>
                      </div>
                      <p class="mt-1 text-xs text-zinc-300">${escapeHtml(srv.role)}</p>
                      <p class="mt-1 text-[11px] text-zinc-500">
                        ${
                          state.techMode
                            ? `${escapeHtml(srv.specs)} · IP: ${escapeHtml(srv.ip)} · Uptime: ${escapeHtml(srv.uptime)}`
                            : `Location: ${escapeHtml(srv.location)}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                ${
                  state.techMode
                    ? `<div class="mt-4 grid grid-cols-1 gap-3 border-t border-zinc-800/60 pt-4 sm:grid-cols-3">
                        ${renderMetricBar("CPU", srv.metrics.cpu)}
                        ${renderMetricBar("Memory", srv.metrics.ram)}
                        ${renderMetricBar("Storage", srv.metrics.disk)}
                      </div>`
                    : ""
                }

                <div class="mt-4 border-t border-zinc-800/60 pt-3">
                  <p class="mb-2 text-[11px] font-medium text-zinc-400">Apps running on this server:</p>
                  <div class="flex flex-wrap gap-2">
                    ${svcs
                      .map((svc) => {
                        const label = state.techMode ? svc.techName : svc.familyName;
                        return `
                          <a
                            href="${escapeHtml(svc.url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
                          >
                            <i data-lucide="${escapeHtml(svc.icon || "box")}" class="h-3 w-3 text-zinc-400"></i>
                            <span>${escapeHtml(label)}</span>
                            <i data-lucide="arrow-up-right" class="h-3 w-3 text-zinc-500"></i>
                          </a>
                        `;
                      })
                      .join("")}
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </section>
    `;
  }

  function renderHelp() {
    return `
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
        <h1 class="text-xl font-semibold text-zinc-50">Family Guides &amp; Help</h1>
        <p class="mt-1 text-xs text-zinc-400">${escapeHtml(cfg.brand.supportNote)}</p>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <button id="copy-status-btn" class="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-800">
            <i data-lucide="copy" class="h-3.5 w-3.5"></i>
            <span>Copy Health Report for ${escapeHtml(cfg.brand.ownerName)}</span>
          </button>
          <a href="${escapeHtml(cfg.brand.contactUrl)}" class="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">
            <i data-lucide="mail" class="h-3.5 w-3.5"></i>
            <span>${escapeHtml(cfg.brand.contactLabel)}</span>
          </a>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 md:grid-cols-2">
        ${cfg.guides
          .map(
            (g, idx) => `
          <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
            <div class="flex items-center gap-2.5">
              <span class="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 font-mono-code text-xs font-semibold text-zinc-300">${idx + 1}</span>
              <h2 class="text-sm font-semibold text-zinc-100">${escapeHtml(g.title)}</h2>
            </div>
            <ol class="mt-3 space-y-2 pl-1 text-xs leading-relaxed text-zinc-300">
              ${g.steps
                .map(
                  (step, sIdx) => `
                <li class="flex gap-2">
                  <span class="font-mono-code text-zinc-500">${sIdx + 1}.</span>
                  <span>${escapeHtml(step)}</span>
                </li>
              `
                )
                .join("")}
            </ol>
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  // --- Event Binding & Main Render ---
  function bindViewEvents() {
    document.querySelectorAll(".goto-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.getAttribute("data-goto");
        state.selectedServerId = "All";
        render();
      });
    });

    document.querySelectorAll(".server-jump-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = "servers";
        render();
      });
    });

    const searchInput = document.getElementById("apps-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderViewOnly();
        const restored = document.getElementById("apps-search-input");
        if (restored) {
          restored.focus();
          restored.setSelectionRange(restored.value.length, restored.value.length);
        }
      });
    }

    document.querySelectorAll(".cat-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.selectedCategory = btn.getAttribute("data-category");
        render();
      });
    });

    const clearBtn = document.getElementById("clear-filters-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.searchQuery = "";
        state.selectedCategory = "All";
        state.selectedServerId = "All";
        render();
      });
    }

    const copyBtn = document.getElementById("copy-status-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const lines = [
          `${cfg.brand.title} Status (${new Date().toLocaleString()})`,
          ...cfg.servers.map((s) => `- ${s.familyName} (${s.techName}): ${s.status}`),
        ];
        navigator.clipboard
          ?.writeText(lines.join("\n"))
          .then(() => showToast("Health report copied! Paste it to Arnav."))
          .catch(() => showToast("Could not copy automatically."));
      });
    }
  }

  function renderViewOnly() {
    const container = document.getElementById("view-container");
    if (!container) return;

    if (state.activeTab === "overview") container.innerHTML = renderOverview();
    else if (state.activeTab === "apps") container.innerHTML = renderApps();
    else if (state.activeTab === "servers") container.innerHTML = renderServers();
    else if (state.activeTab === "help") container.innerHTML = renderHelp();

    bindViewEvents();
    refreshIcons();
  }

  function render() {
    renderBranding();
    renderNav();
    renderViewOnly();
  }

  // --- Mobile Drawer ---
  function openMobileDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.remove("hidden");
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer) drawer.classList.add("hidden");
  }

  function toggleMode() {
    state.techMode = !state.techMode;
    render();
    showToast(state.techMode ? "Switched to Tech View" : "Switched to Family View");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("desktop-mode-toggle")?.addEventListener("click", toggleMode);
    document.getElementById("mobile-mode-toggle")?.addEventListener("click", toggleMode);
    document.getElementById("mobile-menu-btn")?.addEventListener("click", openMobileDrawer);
    document.getElementById("mobile-drawer-close")?.addEventListener("click", closeMobileDrawer);
    document.getElementById("mobile-drawer-backdrop")?.addEventListener("click", closeMobileDrawer);

    document.getElementById("refresh-status-btn")?.addEventListener("click", () => {
      state.lastChecked = new Date();
      render();
      showToast("All 5 servers checked — everything looks good!");
    });

    render();
  });
})();
