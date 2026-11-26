# ARCUBE

A clean, dark-mode dashboard for **ARCUBE** styled after [arnavgupta2003.github.io](https://arnavgupta2003.github.io/), designed for non-tech family members.

## Pages
- **Services**:
  - **Section 1**: Everyday click-to-redirect apps (Immich at `photos.kontour.in`, Jellyfin, Ghost, Syncthing, etc.) with app icons.
  - **Section 2**: Debug & Admin consoles (Portainer, Tailscale, Cockpit, Uptime Kuma, Nginx Proxy Manager, etc.).
- **FAQs**: Plain-English answers for family members.
- **Contact Arnav**: Form that posts directly to Slack (or an n8n webhook) so automated workflows can reply.

## Configuration
Edit `config.js`:
1. Update `services` and `debugServices` URLs/icons.
2. Paste your Slack Incoming Webhook or n8n Webhook URL into `contact.slackWebhookUrl`.
