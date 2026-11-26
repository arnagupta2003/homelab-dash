/**
 * ARCUBE Configuration
 * ---------------------------------------------------------------------------
 * - userServices: Shown in User mode (and Admin mode) — everyday home apps.
 * - adminServices: Shown ONLY in Admin mode — admin, proxy & debug consoles.
 * - All entries use clean website URLs (no raw IP addresses) + real app icons.
 */

window.ARCUBE_CONFIG = {
  brand: {
    initials: "AC",
    title: "ARCUBE",
    subtitle: "Home Services",
    ownerName: "Arnav",
  },

  banner: {
    statusText: "ARCUBE services are online",
    rightText: "ARCUBE Private Cloud",
  },

  contact: {
    // Paste your Slack Incoming Webhook URL or n8n Webhook URL here:
    // Example Slack: "https://hooks.slack.com/services/T000/B000/XXXX"
    // Example n8n:   "https://n8n.kontour.in/webhook/arcube-help"
    slackWebhookUrl: "",
    slackChannelLabel: "#arcube-help",
  },

  // =========================================================================
  // USER SECTION: Everyday Home Services (Website URLs + App Icons)
  // =========================================================================
  userServices: [
    {
      name: "Immich",
      subtitle: "Family Photos & Videos",
      url: "https://photos.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/immich.svg",
      fallbackIcon: "image",
      status: "online",
    },
    {
      name: "Jellyfin",
      subtitle: "Watch Movies & TV Shows",
      url: "https://watch.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/jellyfin.svg",
      fallbackIcon: "film",
      status: "online",
    },
    {
      name: "Paperless",
      subtitle: "Documents, Bills & PDFs",
      url: "https://docs.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/paperless-ngx.svg",
      fallbackIcon: "file-text",
      status: "online",
    },
    {
      name: "Jellyseerr",
      subtitle: "Request Movies & Shows",
      url: "https://requests.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/jellyseerr.svg",
      fallbackIcon: "clapperboard",
      status: "online",
    },
    {
      name: "Radarr",
      subtitle: "Movies Library",
      url: "https://radarr.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/radarr.svg",
      fallbackIcon: "film",
      status: "online",
    },
    {
      name: "Sonarr",
      subtitle: "TV Shows Library",
      url: "https://sonarr.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/sonarr.svg",
      fallbackIcon: "tv",
      status: "online",
    },
    {
      name: "Bazarr",
      subtitle: "Subtitles",
      url: "https://bazarr.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/bazarr.svg",
      fallbackIcon: "subtitles",
      status: "online",
    },
  ],

  // =========================================================================
  // ADMIN SECTION: Admin & Debug Consoles (Website URLs only, NO raw IPs)
  // =========================================================================
  adminServices: [
    {
      name: "Portainer",
      subtitle: "Container Manager",
      url: "https://portainer.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/portainer.svg",
      fallbackIcon: "boxes",
      status: "online",
    },
    {
      name: "Nginx Proxy Manager",
      subtitle: "Reverse Proxy & SSL",
      url: "https://npm.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/nginx-proxy-manager.svg",
      fallbackIcon: "shield-check",
      status: "online",
    },
    {
      name: "Tailscale Console",
      subtitle: "Mesh VPN & Devices",
      url: "https://login.tailscale.com/admin/machines",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/tailscale.svg",
      fallbackIcon: "network",
      status: "online",
    },
    {
      name: "Uptime Kuma",
      subtitle: "Status & Alerts",
      url: "https://uptime.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/uptime-kuma.svg",
      fallbackIcon: "activity",
      status: "online",
    },
    {
      name: "Syncthing",
      subtitle: "Device Folder Sync",
      url: "https://sync.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/syncthing.svg",
      fallbackIcon: "folder-sync",
      status: "online",
    },
    {
      name: "Cockpit",
      subtitle: "Server System Console",
      url: "https://cockpit.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/cockpit.svg",
      fallbackIcon: "cpu",
      status: "online",
    },
    {
      name: "Prowlarr",
      subtitle: "Indexers & Search",
      url: "https://prowlarr.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/prowlarr.svg",
      fallbackIcon: "search",
      status: "online",
    },
    {
      name: "n8n",
      subtitle: "Workflows & Automations",
      url: "https://n8n.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/n8n.svg",
      fallbackIcon: "workflow",
      status: "online",
    },
    {
      name: "Duplicati",
      subtitle: "Scheduled Backups",
      url: "https://backup.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/duplicati.svg",
      fallbackIcon: "hard-drive",
      status: "online",
    },
    {
      name: "S3 Storage Console",
      subtitle: "Object Storage",
      url: "https://s3.kontour.in",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/minio.svg",
      fallbackIcon: "database",
      status: "online",
    },
  ],

  // FAQs for family members
  faqs: [
    {
      question: "How do I back up my phone photos to Immich?",
      answer:
        "Open the Immich app on your phone (or visit photos.kontour.in). In settings, make sure Automatic Backup is turned ON. Whenever you are on Wi-Fi, your photos and videos will back up safely to ARCUBE.",
    },
    {
      question: "How do I watch or request movies and TV shows?",
      answer:
        "Click Jellyfin (watch.kontour.in) to watch what's already available. Want a new movie or show? Request it via Jellyseerr (requests.kontour.in), or check Radarr/Sonarr.",
    },
    {
      question: "Where do I find family bills, IDs, and PDFs?",
      answer:
        "Click Paperless (docs.kontour.in) to search and view scanned family documents, bills, and receipts.",
    },
    {
      question: "What should I do if a website doesn't open?",
      answer:
        "First, check your internet connection—if you are outside the house, make sure the Tailscale app switch is turned ON. Wait 1 minute and refresh. If it still doesn't load, send a message on the Contact Arnav page.",
    },
    {
      question: "How do I use ARCUBE apps when I'm traveling?",
      answer:
        "Open the Tailscale app on your phone or laptop and turn it ON. Once connected, all ARCUBE links work just like at home.",
    },
  ],
};
