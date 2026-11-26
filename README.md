# ARCUBE

A clean, dark-mode dashboard for **ARCUBE** hosted on GitHub Pages, configured with a single [`services.yaml`](services.yaml) file.

## Managing Websites (No Code / No Tokens)
1. Enable **Admin Mode** in ARCUBE and click **Edit services.yaml on GitHub** (or open `services.yaml` directly on GitHub Web / GitHub Mobile).
2. Add or remove an entry under `user:` or `admin:`:
   ```yaml
   - name: Immich
     subtitle: Family Photos & Videos
     url: https://photos.kontour.in
     icon: immich
   ```
3. Click **Commit changes** — GitHub Pages automatically redeploys in ~30 seconds.

## Pages
- **User Mode (Default)**: **Services**, **FAQs**, and **Contact Arnav** (posts to Slack via `contact.slackWebhookUrl` in `services.yaml`).
- **Admin Mode**: Unlocks **Admin & Debug** URLs and the **Edit services.yaml on GitHub** shortcut.
