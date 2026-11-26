(function () {
  const ICON_CDN_BASE = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/";

  let cfg = {
    brand: {
      initials: "AC",
      title: "ARCUBE",
      subtitle: "Home Services",
      ownerName: "Arnav",
      editUrl: "https://github.com/arnagupta2003/homelab-dash/edit/master/services.yaml",
    },
    banner: {
      statusText: "ARCUBE services are online",
      rightText: "ARCUBE Private Cloud",
    },
    contact: {
      slackWebhookUrl: "",
      slackChannelLabel: "#arcube-help",
    },
    user: [],
    admin: [],
    faqs: [],
  };

  const state = {
    activeTab: "services", // "services" | "admin" | "faqs" | "contact"
    adminMode: false, // false = User Mode (default), true = Admin Mode
    searchQuery: "",
    sendingSlack: false,
    slackResult: null,
    loadError: null,
  };

  function getNavItems() {
    const items = [{ id: "services", label: "Services", icon: "layout-grid" }];
    if (state.adminMode) {
      items.push({ id: "admin", label: "Admin & Debug", icon: "terminal" });
    }
    items.push(
      { id: "faqs", label: "FAQs", icon: "help-circle" },
      { id: "contact", label: "Contact Arnav", icon: "message-square" }
    );
    return items;
  }

  // --- Helpers ---
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function resolveIconUrl(icon) {
    if (!icon) return "";
    if (/^https?:\/\//i.test(icon)) return icon;
    return `${ICON_CDN_BASE}${encodeURIComponent(icon.replace(/\.svg$/i, ""))}.svg`;
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
    }, 2600);
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // --- Chrome / Branding / Navigation ---
  function renderBranding() {
    const { initials, title, subtitle } = cfg.brand;
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
      if (el) el.textContent = state.adminMode ? "Admin Console" : subtitle;
    });

    const bannerText = document.getElementById("banner-text");
    const bannerLocation = document.getElementById("banner-location");
    if (bannerText) bannerText.textContent = cfg.banner.statusText;
    if (bannerLocation) bannerLocation.textContent = cfg.banner.rightText;
  }

  function renderNav() {
    const navItems = getNavItems();
    const html = navItems
      .map((item) => {
        const active = state.activeTab === item.id;
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
            <span>${escapeHtml(item.label)}</span>
          </button>
        `;
      })
      .join("");

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

    const badge = document.getElementById("mode-badge");
    const toggleLabel = document.getElementById("mode-toggle-label");
    const mobileToggle = document.getElementById("mobile-mode-toggle");
    if (badge) {
      badge.textContent = state.adminMode ? "Admin" : "User";
      badge.className = state.adminMode
        ? "rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400"
        : "rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400";
    }
    if (toggleLabel) {
      toggleLabel.textContent = state.adminMode ? "Switch to User" : "Switch to Admin";
    }
    if (mobileToggle) {
      mobileToggle.textContent = state.adminMode ? "Admin" : "User";
    }
  }

  // --- Service Card (App Image Icon + Website URL) ---
  function renderIcon(svc) {
    const iconUrl = resolveIconUrl(svc.icon || svc.iconUrl);
    const fallback = escapeHtml(svc.fallbackIcon || "globe");
    if (iconUrl) {
      return `
        <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-2 group-hover:border-zinc-700">
          <img
            src="${escapeHtml(iconUrl)}"
            alt="${escapeHtml(svc.name)} icon"
            class="h-6 w-6 object-contain"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"
          />
          <span style="display:none" class="items-center justify-center text-zinc-300">
            <i data-lucide="${fallback}" class="h-4 w-4"></i>
          </span>
        </div>
      `;
    }
    return `
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 group-hover:border-zinc-700">
        <i data-lucide="${fallback}" class="h-4 w-4"></i>
      </div>
    `;
  }

  function renderRedirectCard(svc, isAdmin = false) {
    const dotClass = svc.status === "offline" ? "bg-rose-400" : "bg-emerald-400";
    const borderAccent = isAdmin
      ? "border-zinc-800/80 bg-zinc-950/70 hover:border-amber-500/40 hover:bg-zinc-900/70"
      : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-600 hover:bg-zinc-900/70";

    const displayUrl = String(svc.url || "").replace(/^https?:\/\//, "");

    return `
      <a
        href="${escapeHtml(svc.url)}"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${borderAccent}"
      >
        <div class="flex min-w-0 items-center gap-3">
          ${renderIcon(svc)}
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">${escapeHtml(svc.name)}</h3>
              <span class="h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}"></span>
            </div>
            ${
              svc.subtitle
                ? `<p class="truncate text-xs text-zinc-400">${escapeHtml(svc.subtitle)}</p>`
                : ""
            }
            <p class="mt-0.5 truncate font-mono-code text-[11px] text-zinc-500">${escapeHtml(displayUrl)}</p>
          </div>
        </div>
        <i data-lucide="arrow-up-right" class="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-200"></i>
      </a>
    `;
  }

  function renderEditOnGitHubButton() {
    if (!cfg.brand.editUrl) return "";
    return `
      <a
        href="${escapeHtml(cfg.brand.editUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
      >
        <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
        <span>Edit services.yaml on GitHub</span>
      </a>
    `;
  }

  // --- Page Views ---
  function renderServices() {
    const q = state.searchQuery.trim().toLowerCase();
    const filterItem = (s) =>
      !q || `${s.name} ${s.subtitle || ""} ${s.url}`.toLowerCase().includes(q);

    const filteredUser = cfg.user.filter(filterItem);
    const filteredAdmin = cfg.admin.filter(filterItem);

    return `
      ${
        state.loadError
          ? `<div class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              Could not load <code class="font-mono-code">services.yaml</code>: ${escapeHtml(state.loadError)}
            </div>`
          : ""
      }

      <!-- Welcome / Search Header -->
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">${escapeHtml(cfg.brand.title)}</h1>
            <p class="mt-1.5 text-sm text-zinc-400">
              ${
                state.adminMode
                  ? "Admin mode active — edit services.yaml directly on GitHub to add or remove websites."
                  : `Click any app below to open it. Need help? Check FAQs or message ${escapeHtml(cfg.brand.ownerName)}.`
              }
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            ${state.adminMode ? renderEditOnGitHubButton() : ""}
            <div class="relative w-full sm:w-56">
              <i data-lucide="search" class="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500"></i>
              <input
                id="services-search-input"
                type="text"
                value="${escapeHtml(state.searchQuery)}"
                placeholder="Search services..."
                class="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- USER SECTION: Everyday Home Services -->
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
        <div class="mb-4 flex items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="rounded bg-emerald-500/10 px-2 py-0.5 font-mono-code text-[10px] font-semibold uppercase tracking-wider text-emerald-400">User</span>
              <h2 class="text-base font-semibold text-zinc-100">Home Services</h2>
            </div>
            <p class="mt-1 text-xs text-zinc-400">Photos, movies, TV shows, requests, and documents.</p>
          </div>
        </div>

        ${
          filteredUser.length === 0
            ? `<p class="text-xs text-zinc-500">No matching services.</p>`
            : `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                ${filteredUser.map((svc) => renderRedirectCard(svc, false)).join("")}
              </div>`
        }
      </section>

      ${
        state.adminMode
          ? `<!-- ADMIN SECTION (Only visible in Admin Mode) -->
             <section class="rounded-xl border border-amber-500/20 bg-zinc-900/30 p-5">
               <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
                 <div>
                   <div class="flex items-center gap-2">
                     <span class="rounded bg-amber-500/10 px-2 py-0.5 font-mono-code text-[10px] font-semibold uppercase tracking-wider text-amber-400">Admin</span>
                     <h2 class="text-base font-semibold text-zinc-100">Admin &amp; Debug</h2>
                   </div>
                   <p class="mt-1 text-xs text-zinc-400">Portainer, Nginx Proxy Manager, Tailscale, Uptime Kuma, Syncthing, and consoles.</p>
                 </div>
               </div>

               ${
                 filteredAdmin.length === 0
                   ? `<p class="text-xs text-zinc-500">No matching admin services.</p>`
                   : `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                       ${filteredAdmin.map((svc) => renderRedirectCard(svc, true)).join("")}
                     </div>`
               }
             </section>`
          : ""
      }
    `;
  }

  function renderAdminOnly() {
    const q = state.searchQuery.trim().toLowerCase();
    const filteredAdmin = cfg.admin.filter(
      (s) => !q || `${s.name} ${s.subtitle || ""} ${s.url}`.toLowerCase().includes(q)
    );

    return `
      <section class="rounded-xl border border-amber-500/20 bg-zinc-900/40 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">Admin &amp; Debug</h1>
              <span class="rounded bg-amber-500/10 px-2 py-0.5 font-mono-code text-[10px] font-semibold uppercase tracking-wider text-amber-400">Admin Mode</span>
            </div>
            <p class="mt-1.5 text-sm text-zinc-400">Direct URLs to Portainer, Nginx Proxy Manager, Tailscale, Uptime Kuma, Syncthing, Cockpit, and backups.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            ${renderEditOnGitHubButton()}
            <div class="relative w-full sm:w-56">
              <i data-lucide="search" class="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500"></i>
              <input
                id="services-search-input"
                type="text"
                value="${escapeHtml(state.searchQuery)}"
                placeholder="Search admin tools..."
                class="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2 pl-8 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${filteredAdmin.map((svc) => renderRedirectCard(svc, true)).join("")}
      </section>
    `;
  }

  function renderFaqs() {
    return `
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">FAQs</h1>
        <p class="mt-1.5 text-sm text-zinc-400">Quick answers for common questions. Still stuck? Use Contact ${escapeHtml(cfg.brand.ownerName)}.</p>
      </section>

      <section class="space-y-3">
        ${cfg.faqs
          .map(
            (item, idx) => `
          <div class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
            <div class="flex items-start gap-3">
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 font-mono-code text-xs font-semibold text-zinc-300">${idx + 1}</span>
              <div>
                <h2 class="text-sm font-semibold text-zinc-100">${escapeHtml(item.question)}</h2>
                <p class="mt-2 text-xs leading-relaxed text-zinc-300">${escapeHtml(item.answer)}</p>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </section>

      <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5">
        <p class="text-xs text-zinc-300">Didn't find what you were looking for?</p>
        <button id="faq-goto-contact" class="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">
          <i data-lucide="message-square" class="h-3.5 w-3.5"></i>
          <span>Contact ${escapeHtml(cfg.brand.ownerName)}</span>
        </button>
      </section>
    `;
  }

  function renderContact() {
    const hasWebhook = Boolean(cfg.contact && cfg.contact.slackWebhookUrl);
    const serviceNames = cfg.user.map((s) => s.name);

    return `
      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6">
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">Contact ${escapeHtml(cfg.brand.ownerName)}</h1>
        <p class="mt-1.5 text-sm text-zinc-400">
          Send a message straight to Slack (${escapeHtml(cfg.contact?.slackChannelLabel || "#arcube-help")}) so automated workflows or ${escapeHtml(cfg.brand.ownerName)} can reply right away.
        </p>
      </section>

      <section class="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6">
        <form id="slack-contact-form" class="space-y-4">
          <!-- Honeypot field for bot/spam protection -->
          <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="contact-name" class="block text-xs font-medium text-zinc-300">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="e.g. Mom, Dad, ..."
                class="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
            </div>
            <div>
              <label for="contact-service" class="block text-xs font-medium text-zinc-300">Which App / Topic?</label>
              <select
                id="contact-service"
                class="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-zinc-600 focus:outline-none"
              >
                <option value="General Question">General Question</option>
                ${serviceNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("")}
              </select>
            </div>
          </div>

          <div>
            <label for="contact-message" class="block text-xs font-medium text-zinc-300">What do you need help with?</label>
            <textarea
              id="contact-message"
              rows="4"
              required
              placeholder="Example: Immich isn't backing up my new photos..."
              class="mt-1.5 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
            ></textarea>
          </div>

          ${
            !hasWebhook
              ? `<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                  Slack webhook is not configured yet. Add your Slack or n8n webhook URL to <code class="font-mono-code">contact.slackWebhookUrl</code> in <code class="font-mono-code">services.yaml</code>.
                </div>`
              : ""
          }

          ${
            state.slackResult
              ? `<div class="rounded-lg border ${
                  state.slackResult.ok
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                } p-3 text-xs">
                  ${escapeHtml(state.slackResult.message)}
                </div>`
              : ""
          }

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              ${state.sendingSlack ? "disabled" : ""}
              class="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              <i data-lucide="send" class="h-3.5 w-3.5"></i>
              <span>${state.sendingSlack ? "Sending to Slack..." : "Send Message to Slack"}</span>
            </button>

            <button
              type="button"
              id="copy-contact-msg-btn"
              class="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              <i data-lucide="copy" class="h-3.5 w-3.5"></i>
              <span>Copy Message</span>
            </button>
          </div>
        </form>
      </section>
    `;
  }

  // --- Slack / n8n Submission ---
  async function handleSlackSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contact-name")?.value.trim() || "Family Member";
    const service = document.getElementById("contact-service")?.value || "General Question";
    const message = document.getElementById("contact-message")?.value.trim() || "";
    const website = document.getElementById("contact-website")?.value.trim() || "";
    if (!message) return;

    const webhookUrl = cfg.contact?.slackWebhookUrl?.trim();
    if (!webhookUrl) {
      state.slackResult = {
        ok: false,
        message: "Webhook URL is missing in services.yaml. Use 'Copy Message' or add slackWebhookUrl.",
      };
      render();
      return;
    }

    state.sendingSlack = true;
    state.slackResult = null;
    render();

    const payload = {
      origin: "arcube",
      name,
      service,
      message,
      website,
      text: `:satellite: *New Ping* \`arcube\`\n*Service:* ${service}\n*From:* ${name}\n*Message:*\n> ${message.replace(/\n/g, "\n> ")}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const isSlackHooks = webhookUrl.includes("hooks.slack.com");
      let responseMsg = `Sent to Slack! ${cfg.brand.ownerName}'s workflows have received your message.`;

      if (isSlackHooks) {
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `payload=${encodeURIComponent(JSON.stringify({ text: payload.text }))}`,
        });
      } else {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok === false) {
          throw new Error(data.message || `Webhook returned ${res.status}`);
        }
        if (data.message) responseMsg = data.message;
      }

      state.slackResult = {
        ok: true,
        message: responseMsg,
      };
      showToast("Message posted to Slack!");
    } catch (err) {
      state.slackResult = {
        ok: false,
        message: `Could not reach webhook (${err.message}). Try 'Copy Message' instead.`,
      };
    } finally {
      state.sendingSlack = false;
      render();
    }
  }

  // --- Event Binding & Main Render ---
  function bindViewEvents() {
    const searchInput = document.getElementById("services-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderViewOnly();
        const restored = document.getElementById("services-search-input");
        if (restored) {
          restored.focus();
          restored.setSelectionRange(restored.value.length, restored.value.length);
        }
      });
    }

    document.getElementById("faq-goto-contact")?.addEventListener("click", () => {
      state.activeTab = "contact";
      render();
    });

    document.getElementById("slack-contact-form")?.addEventListener("submit", handleSlackSubmit);

    document.getElementById("copy-contact-msg-btn")?.addEventListener("click", () => {
      const name = document.getElementById("contact-name")?.value.trim() || "Family";
      const service = document.getElementById("contact-service")?.value || "General";
      const message = document.getElementById("contact-message")?.value.trim() || "";
      const text = `ARCUBE Help (${service}) from ${name}: ${message}`;
      navigator.clipboard
        ?.writeText(text)
        .then(() => showToast("Message copied!"))
        .catch(() => showToast("Could not copy automatically."));
    });
  }

  function renderViewOnly() {
    const container = document.getElementById("view-container");
    if (!container) return;

    if (state.activeTab === "services") container.innerHTML = renderServices();
    else if (state.activeTab === "admin") {
      container.innerHTML = state.adminMode ? renderAdminOnly() : renderServices();
    } else if (state.activeTab === "faqs") container.innerHTML = renderFaqs();
    else if (state.activeTab === "contact") container.innerHTML = renderContact();

    bindViewEvents();
    refreshIcons();
  }

  function render() {
    renderBranding();
    renderNav();
    renderViewOnly();
  }

  // --- Load YAML ---
  async function loadConfig() {
    try {
      const res = await fetch(`./services.yaml?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!window.jsyaml) throw new Error("YAML parser failed to load");
      const parsed = window.jsyaml.load(text);
      if (parsed && typeof parsed === "object") {
        cfg = {
          brand: { ...cfg.brand, ...(parsed.brand || {}) },
          banner: { ...cfg.banner, ...(parsed.banner || {}) },
          contact: { ...cfg.contact, ...(parsed.contact || {}) },
          user: Array.isArray(parsed.user) ? parsed.user : [],
          admin: Array.isArray(parsed.admin) ? parsed.admin : [],
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
        };
      }
      state.loadError = null;
    } catch (err) {
      state.loadError = err.message || String(err);
    }
    render();
  }

  // --- Mode Toggle & Mobile Drawer ---
  function toggleAdminMode() {
    state.adminMode = !state.adminMode;
    if (!state.adminMode && state.activeTab === "admin") {
      state.activeTab = "services";
    }
    render();
    showToast(state.adminMode ? "Admin mode enabled" : "Switched to User mode");
  }

  function openMobileDrawer() {
    document.getElementById("mobile-drawer")?.classList.remove("hidden");
  }

  function closeMobileDrawer() {
    document.getElementById("mobile-drawer")?.classList.add("hidden");
  }

  function goToContact() {
    state.activeTab = "contact";
    closeMobileDrawer();
    render();
  }

  function init() {
    document.getElementById("desktop-mode-toggle")?.addEventListener("click", toggleAdminMode);
    document.getElementById("mobile-mode-toggle")?.addEventListener("click", toggleAdminMode);
    document.getElementById("sidebar-contact-btn")?.addEventListener("click", goToContact);
    document.getElementById("drawer-contact-btn")?.addEventListener("click", goToContact);
    document.getElementById("mobile-menu-btn")?.addEventListener("click", openMobileDrawer);
    document.getElementById("mobile-drawer-close")?.addEventListener("click", closeMobileDrawer);
    document.getElementById("mobile-drawer-backdrop")?.addEventListener("click", closeMobileDrawer);

    render();
    loadConfig();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
