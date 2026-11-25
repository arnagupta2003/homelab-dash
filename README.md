# Gupta Homelab — Family & Server Dashboard

A clean, dark-mode homelab dashboard styled after [arnavgupta2003.github.io](https://arnavgupta2003.github.io/) (`#09090b` background, `zinc` borders, `Inter` + `JetBrains Mono`, and `lucide` icons), designed so non-tech family members can easily find and open home apps while you can still toggle into **Tech View** for IPs, specs, and resource usage.

## Features
- **Family View (Default)**: Plain-English app names (*Movies & TV Shows*, *Family Photos & Videos*, *Smart Home Controls*), simple "Working / Offline" badges, helpful tips, and one-click **Open App** buttons.
- **Tech View Toggle**: Switch anytime in the sidebar (or mobile header) to see real service names (`Jellyfin`, `Immich`, `Home Assistant`), server hostnames, local IPs, hardware specs, and CPU/RAM/Disk bars.
- **5 Servers Tab**: Shows all 5 servers, their physical locations, status, and which apps run on each.
- **Guides & Help Tab**: Step-by-step instructions for family members + a one-click **Copy Health Report** button.

## Quick Customization
Edit `config.js` to set your real 5 servers, URLs, and contact info:
1. Update `brand` (title, owner name, contact email/WhatsApp link).
2. Update the 5 entries in `servers` (`familyName`, `techName`, `location`, `ip`, `specs`, `status`).
3. Update `services` with your real URLs (`https://...` or `http://192.168.x.x:port`).

## Running Locally
Open `index.html` directly in a browser, or serve the folder with any static server:
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.
