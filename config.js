/**
 * ARCUBE Configuration
 * ---------------------------------------------------------------------------
 * - services: Section 1 (Everyday click-to-redirect apps)
 * - debugServices: Section 2 (Admin & debug tools)
 * - contact.slackWebhookUrl: Paste your Slack Incoming Webhook or n8n Webhook URL
 *   so family messages from the "Contact Arnav" page post straight to Slack.
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
    fallbackEmail: "mailto:arnav@example.com",
  },

  // SECTION 1: Everyday Services (Click-to-Redirect with App Icons)
  // Icons use dashboard-icons (walkxcode/dashboard-icons) with Lucide fallback.
  services: [
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
      subtitle: "Movies & TV Shows",
      url: "http://192.168.1.5:8096",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/jellyfin.svg",
      fallbackIcon: "film",
      status: "online",
    },
    {
      name: "Ghost",
      subtitle: "Blog & Notes",
      url: "http://192.168.1.5:2368",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/ghost.svg",
      fallbackIcon: "book-open",
      status: "online",
    },
    {
      name: "Syncthing",
      subtitle: "Folder & File Sync",
      url: "http://192.168.1.5:8384",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/syncthing.svg",
      fallbackIcon: "folder-sync",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8580",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8580",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8200",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8200",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:5000",
      subtitle: "Web Service",
      url: "http://192.168.1.5:5000",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8088",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8088",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8051",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8051",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8080",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8080",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8000",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8000",
      fallbackIcon: "globe",
      status: "online",
    },
    {
      name: "http://192.168.1.5:8430",
      subtitle: "Web Service",
      url: "http://192.168.1.5:8430",
      fallbackIcon: "globe",
      status: "online",
    },
  ],

  // SECTION 2: Debug & Admin Services
  debugServices: [
    {
      name: "Portainer",
      subtitle: "Container Manager",
      url: "https://192.168.1.5:9443",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/portainer.svg",
      fallbackIcon: "boxes",
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
      name: "Cockpit",
      subtitle: "System Console",
      url: "https://192.168.1.5:9090",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/cockpit.svg",
      fallbackIcon: "cpu",
      status: "online",
    },
    {
      name: "Uptime Kuma",
      subtitle: "Service Monitor",
      url: "http://190.1.0.4:3001",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/uptime-kuma.svg",
      fallbackIcon: "activity",
      status: "online",
    },
    {
      name: "Nginx Proxy Manager",
      subtitle: "Gateway Proxy",
      url: "http://127.0.0.1:81",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/nginx-proxy-manager.svg",
      fallbackIcon: "shield-check",
      status: "online",
    },
    {
      name: "NPM (190.1.0.2)",
      subtitle: "Secondary Proxy",
      url: "http://190.1.0.2:81",
      iconUrl: "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg/nginx-proxy-manager.svg",
      fallbackIcon: "network",
      status: "online",
    },
    {
      name: "http://190.1.0.3:20241",
      subtitle: "Debug Endpoint",
      url: "http://190.1.0.3:20241",
      fallbackIcon: "terminal",
      status: "online",
    },
    {
      name: "http://192.168.1.5:20211",
      subtitle: "Debug Endpoint",
      url: "http://192.168.1.5:20211",
      fallbackIcon: "terminal",
      status: "online",
    },
    {
      name: "http://192.168.1.5:5680",
      subtitle: "Debug Endpoint",
      url: "http://192.168.1.5:5680",
      fallbackIcon: "terminal",
      status: "online",
    },
    {
      name: "http://192.168.1.5:3909",
      subtitle: "Storage Console",
      url: "http://192.168.1.5:3909",
      fallbackIcon: "database",
      status: "online",
    },
    {
      name: "http://192.168.1.5:3900",
      subtitle: "Storage Endpoint",
      url: "http://192.168.1.5:3900",
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
      question: "How do I watch movies or shows on the TV or phone?",
      answer:
        "Connect to Home Wi-Fi, then click Jellyfin on the Services page (or open the Jellyfin app on the TV). Pick your profile and press Play.",
    },
    {
      question: "What should I do if a website doesn't open?",
      answer:
        "First, check if you are on Home Wi-Fi—or if you are outside the house, make sure the Tailscale app switch is turned ON. Wait 1 minute and refresh. If it still doesn't load, send a message on the Contact Arnav page.",
    },
    {
      question: "How do I use ARCUBE apps when I'm traveling?",
      answer:
        "Open the Tailscale app on your phone or laptop and turn it ON. Once connected, links like Immich and Jellyfin work just like at home.",
    },
    {
      question: "Do I ever need to open Section 2 (Debug & Admin)?",
      answer:
        "No! Section 2 is only for Arnav when maintaining or fixing things. Everything you need for daily use is in Section 1.",
    },
  ],
};
