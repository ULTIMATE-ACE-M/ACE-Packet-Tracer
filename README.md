# Cisco Packet Tracer Command Reference

A comprehensive, searchable reference of Cisco IOS commands used in Cisco Packet Tracer, with explanations and diagrams.

Live site (after you enable Pages): `https://ultimate-ace-m.github.io/ACE-Packet-Tracer/`

## Features

- 200+ commands across 18 categories (EXEC modes, interfaces, routing, switching, security, NAT, DHCP, IPv6, troubleshooting, and more)
- Live search across every command, description, and example
- Categorized sidebar navigation
- One-click copy-to-clipboard for every command snippet
- Light / dark theme toggle (preference saved in browser)
- Hand-drawn SVG network topology diagrams + Mermaid flowcharts
- Pure static site — no build step, runs on GitHub Pages out of the box

## Project layout

```
ACE-Packet-Tracer/
├── index.html              # Single-page shell
├── assets/
│   ├── styles.css          # Theme + layout
│   ├── app.js              # Search, render, copy, theme toggle
│   ├── data.js             # All command data (edit to add commands)
│   └── diagrams/           # Hand-drawn SVG network diagrams
├── LICENSE
└── README.md
```

## Run locally

It is a static site with no build step:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

Settings → Pages → Source: Deploy from a branch → main / (root). Site goes live at the URL shown there.

## License

MIT — see `LICENSE`. Independent learning reference; not affiliated with Cisco Systems, Inc.
