# ARCUBE

A clean, dark-mode dashboard for **ARCUBE** with separate **User** and **Admin** modes.

## Modes & Pages
- **User Mode (Default)**:
  - **Services**: Everyday home apps (`Immich`, `Jellyfin`, `Paperless`, `Jellyseerr`, `Radarr`, `Sonarr`, `Bazarr`) using `*.kontour.in` website URLs and app icons.
  - **FAQs**: Plain-English Q&As for family members.
  - **Contact Arnav**: Form that posts straight to Slack (or an n8n webhook).
- **Admin Mode**:
  - Toggle **Switch to Admin** in the sidebar (or mobile header) to reveal **Admin & Debug** (`Portainer`, `Nginx Proxy Manager`, `Tailscale Console`, `Uptime Kuma`, `Syncthing`, `Cockpit`, `Prowlarr`, `n8n`, `Duplicati`, `S3 Storage`) — website URLs only, no raw IPs.

## Configuration
Edit `config.js` to adjust any `*.kontour.in` subdomain or paste your Slack / n8n webhook URL into `contact.slackWebhookUrl`.
