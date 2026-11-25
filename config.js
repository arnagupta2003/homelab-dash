/**
 * ARCUBE Homelab Dashboard Configuration
 * ---------------------------------------------------------------------------
 * Section 1 ("services"): Click-to-open websites for everyday use.
 * Section 2 ("debugServices"): Admin & debug consoles.
 */

window.HOMELAB_CONFIG = {
  brand: {
    initials: "AC",
    title: "ARCUBE",
    subtitle: "Home Cloud · 5 Servers",
    ownerName: "Arnav",
    supportNote: "If something isn't loading, wait 1 minute and refresh. Still stuck? Message Arnav.",
    contactLabel: "Message Arnav",
    contactUrl: "mailto:arnav@example.com",
  },

  banner: {
    location: "Home Network · Bangalore",
    allGoodText: "All 5 ARCUBE servers are online and working normally",
    degradedText: "Some services are currently restarting or offline",
  },

  servers: [
    {
      id: "srv-1",
      familyName: "Main App Server",
      techName: "192.168.1.5",
      role: "Primary home server",
      location: "Home",
      status: "online",
      uptime: "Online",
      ip: "192.168.1.5",
      specs: "Primary Host",
      metrics: { cpu: 28, ram: 61, disk: 58 },
    },
    {
      id: "srv-2",
      familyName: "Proxy Gateway",
      techName: "127.0.0.1",
      role: "Web routing & SSL",
      location: "Gateway",
      status: "online",
      uptime: "Online",
      ip: "127.0.0.1",
      specs: "Nginx Proxy Manager",
      metrics: { cpu: 8, ram: 24, disk: 19 },
    },
    {
      id: "srv-3",
      familyName: "Node 2",
      techName: "190.1.0.2",
      role: "Secondary proxy node",
      location: "Network",
      status: "online",
      uptime: "Online",
      ip: "190.1.0.2",
      specs: "Proxy Node",
      metrics: { cpu: 10, ram: 29, disk: 22 },
    },
    {
      id: "srv-4",
      familyName: "Node 3",
      techName: "190.1.0.3",
      role: "Worker node",
      location: "Network",
      status: "online",
      uptime: "Online",
      ip: "190.1.0.3",
      specs: "Worker Node",
      metrics: { cpu: 14, ram: 35, disk: 30 },
    },
    {
      id: "srv-5",
      familyName: "Monitoring Server",
      techName: "190.1.0.4",
      role: "Uptime monitoring",
      location: "Network",
      status: "online",
      uptime: "Online",
      ip: "190.1.0.4",
      specs: "Uptime Kuma",
      metrics: { cpu: 11, ram: 32, disk: 25 },
    },
  ],

  // SECTION 1: Click-to-Redirect Websites (with App Icons)
  services: [
    { name: "Immich", url: "http://192.168.1.5:2283", icon: "image", status: "online", serverId: "srv-1", category: "Photos" },
    { name: "Jellyfin", url: "http://192.168.1.5:8096", icon: "film", status: "online", serverId: "srv-1", category: "Media" },
    { name: "Ghost", url: "http://192.168.1.5:2368", icon: "book-open", status: "online", serverId: "srv-1", category: "Notes" },
    { name: "Syncthing", url: "http://192.168.1.5:8384", icon: "folder-sync", status: "online", serverId: "srv-1", category: "Files" },
    { name: "http://192.168.1.5:8580", url: "http://192.168.1.5:8580", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8200", url: "http://192.168.1.5:8200", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:5000", url: "http://192.168.1.5:5000", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8088", url: "http://192.168.1.5:8088", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8051", url: "http://192.168.1.5:8051", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8080", url: "http://192.168.1.5:8080", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8000", url: "http://192.168.1.5:8000", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
    { name: "http://192.168.1.5:8430", url: "http://192.168.1.5:8430", icon: "globe", status: "online", serverId: "srv-1", category: "Web" },
  ],

  // SECTION 2: Debug & Admin Services
  debugServices: [
    { name: "Portainer", url: "https://192.168.1.5:9443", icon: "boxes", status: "online", serverId: "srv-1", category: "Admin" },
    { name: "Cockpit", url: "https://192.168.1.5:9090", icon: "cpu", status: "online", serverId: "srv-1", category: "Admin" },
    { name: "Uptime Kuma", url: "http://190.1.0.4:3001", icon: "activity", status: "online", serverId: "srv-5", category: "Monitor" },
    { name: "Nginx Proxy Manager", url: "http://127.0.0.1:81", icon: "shield-check", status: "online", serverId: "srv-2", category: "Proxy" },
    { name: "NPM (190.1.0.2)", url: "http://190.1.0.2:81", icon: "network", status: "online", serverId: "srv-3", category: "Proxy" },
    { name: "http://190.1.0.3:20241", url: "http://190.1.0.3:20241", icon: "terminal", status: "online", serverId: "srv-4", category: "Admin" },
    { name: "http://192.168.1.5:20211", url: "http://192.168.1.5:20211", icon: "terminal", status: "online", serverId: "srv-1", category: "Admin" },
    { name: "http://192.168.1.5:5680", url: "http://192.168.1.5:5680", icon: "terminal", status: "online", serverId: "srv-1", category: "Admin" },
    { name: "http://192.168.1.5:3909", url: "http://192.168.1.5:3909", icon: "database", status: "online", serverId: "srv-1", category: "Storage" },
    { name: "http://192.168.1.5:3900", url: "http://192.168.1.5:3900", icon: "database", status: "online", serverId: "srv-1", category: "Storage" },
  ],

  guides: [
    {
      title: "How to watch movies on the TV or phone",
      steps: [
        "Make sure your phone, tablet, or TV is connected to our Home Wi-Fi.",
        "Click Jellyfin on the home page (or open the Jellyfin app on the TV).",
        "Pick your profile name and press Play.",
      ],
    },
    {
      title: "How to back up your phone photos",
      steps: [
        "Open the Immich app on your phone (ask Arnav if you need it installed).",
        "Make sure 'Automatic Backup' is turned on in the app settings.",
        "Whenever you're on home Wi-Fi, new photos are saved safely to ARCUBE.",
      ],
    },
    {
      title: "What to do if a page doesn't load",
      steps: [
        "Check if you are on Home Wi-Fi (or if Tailscale VPN is turned on when traveling).",
        "Wait 60 seconds and refresh the page—a server might be doing a quick update.",
        "If it still doesn't open, message Arnav.",
      ],
    },
    {
      title: "Accessing home apps while traveling",
      steps: [
        "Open the Tailscale app on your phone or laptop and flip the switch to ON.",
        "Once connected, all links work just like at home.",
        "You can turn it off again when you're done to save battery.",
      ],
    },
  ],
};
