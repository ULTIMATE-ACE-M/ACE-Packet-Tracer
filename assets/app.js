/* ============================================================
   Cisco Packet Tracer Command Reference - app logic
   - Renders categories + commands from data.js
   - Now also renders `prereqs` (commands to reach this mode)
     and `customize` (what to swap with your own values)
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "\u2600\ufe0f" : "\ud83c\udf19";
    if (window.mermaid) {
      try {
        window.mermaid.initialize({ startOnLoad: false, theme: theme === "dark" ? "dark" : "default", securityLevel: "loose" });
        renderMermaid();
      } catch (e) {}
    }
  }

  let currentTheme;
  try {
    currentTheme = localStorage.getItem("ciscoref-theme")
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) { currentTheme = "light"; }
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    try { localStorage.setItem("ciscoref-theme", currentTheme); } catch (e) {}
    applyTheme(currentTheme);
  });

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const key in attrs) {
      if (key === "class") node.className = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      else node.setAttribute(key, attrs[key]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // Render inline-code spans for `text` between backticks; everything else is plain text
  function renderInlineMarkdown(parent, text) {
    if (!text) return;
    const parts = String(text).split(/(`[^`]+`)/g);
    for (const p of parts) {
      if (p.startsWith("`") && p.endsWith("`") && p.length > 1) {
        const c = document.createElement("code");
        c.className = "inline-code";
        c.textContent = p.slice(1, -1);
        parent.appendChild(c);
      } else if (p.length) {
        parent.appendChild(document.createTextNode(p));
      }
    }
  }

  const navList = document.getElementById("nav-list");
  const categoriesEl = document.getElementById("categories");
  const cmdCountEl = document.getElementById("cmd-count");
  const catCountEl = document.getElementById("cat-count");

  let totalCommands = 0;

  CATEGORIES.forEach(cat => {
    const navLi = el("li", null, el("a", { href: "#" + cat.id, "data-cat": cat.id }, cat.title));
    navList.appendChild(navLi);

    const section = el("section", { class: "category", id: cat.id, "data-search": (cat.title + " " + (cat.blurb || "")).toLowerCase() });
    section.appendChild(el("h3", null, cat.title));
    if (cat.blurb) section.appendChild(el("p", { class: "blurb" }, cat.blurb));

    if (cat.diagram) {
      const wrap = el("div", { class: "diagram" });
      const obj = el("object", { type: "image/svg+xml", data: cat.diagram.src, "aria-label": cat.diagram.alt || "" });
      obj.appendChild(el("img", { src: cat.diagram.src, alt: cat.diagram.alt || "" }));
      wrap.appendChild(obj);
      section.appendChild(wrap);
    }
    if (cat.mermaid) {
      const wrap = el("div", { class: "diagram" });
      const m = el("div", { class: "mermaid" });
      m.textContent = cat.mermaid;
      wrap.appendChild(m);
      section.appendChild(wrap);
    }

    cat.commands.forEach(cmd => {
      totalCommands++;
      const haystack = [
        cmd.name, cmd.syntax, cmd.description, cmd.notes || "",
        cmd.mode || "", cmd.example || "", cmd.customize || "",
        (cmd.prereqs || []).join(" "), (cmd.related || []).join(" ")
      ].join(" ").toLowerCase();

      const card = el("div", { class: "cmd", "data-search": haystack });
      const head = el("div", { class: "cmd-head" });
      head.appendChild(el("span", { class: "cmd-name" }, cmd.name));
      if (cmd.mode) head.appendChild(el("span", { class: "cmd-mode" }, cmd.mode));
      card.appendChild(head);

      if (cmd.syntax) card.appendChild(el("code", { class: "cmd-syntax" }, cmd.syntax));
      if (cmd.description) card.appendChild(el("p", { class: "cmd-desc" }, cmd.description));

      // ----- Prereqs: CLI-style path to reach this command -----
      if (cmd.prereqs && cmd.prereqs.length) {
        const prereqWrap = el("div", { class: "cmd-prereqs" });
        prereqWrap.appendChild(el("span", { class: "cmd-prereqs-label" }, "Get there with:"));
        const cliLines = buildCliPath(cat, cmd);
        const cliBlock = el("pre", { class: "snippet cli-path" });
        cliLines.forEach((L, i) => {
          if (i > 0) cliBlock.appendChild(document.createTextNode("\n"));
          cliBlock.appendChild(el("span", { class: "cli-prompt" }, L.prompt + " "));
          cliBlock.appendChild(document.createTextNode(L.cmd));
        });
        prereqWrap.appendChild(cliBlock);
        card.appendChild(prereqWrap);
      }

      // ----- Example -----
      if (cmd.example) {
        const snippet = el("pre", { class: "snippet" });
        // Strip the device prompt from each line and skip lines that are
        // just an empty prompt — so the Copy button gives you only what
        // you actually need to type.
        const promptRe = /^[\w-]+(\([^)]+\))?[#>]\s*/;
        const copyValue = cmd.example.split("\n")
          .map(line => line.replace(promptRe, ""))
          .filter(line => line.trim().length > 0)
          .join("\n");
        const copyBtn = el("button", {
          class: "copy-btn", type: "button", "aria-label": "Copy to clipboard",
          title: "Copy: " + (copyValue.length > 60 ? copyValue.slice(0, 60) + "…" : copyValue),
          onclick: e => copyText(copyValue, e.target)
        }, "Copy");
        snippet.appendChild(copyBtn);
        snippet.appendChild(document.createTextNode(cmd.example));
        card.appendChild(snippet);
      }

      // ----- What to change -----
      if (cmd.customize) {
        const cust = el("div", { class: "cmd-customize" });
        cust.appendChild(el("span", { class: "cmd-customize-label" }, "What to change: "));
        const body = el("span", null);
        renderInlineMarkdown(body, cmd.customize);
        cust.appendChild(body);
        card.appendChild(cust);
      }

      if (cmd.notes) card.appendChild(el("div", { class: "cmd-notes" }, cmd.notes));
      section.appendChild(card);
    });

    categoriesEl.appendChild(section);
  });

  // Extra sidebar link: troubleshooting page (separate file, not a category)
  const tsLi = el("li", { class: "nav-extra" }, el("a", { href: "troubleshooting.html" }, "Troubleshooting"));
  navList.appendChild(tsLi);

  cmdCountEl.textContent = totalCommands;
  catCountEl.textContent = CATEGORIES.length;

  function buildCliPath(cat, cmd) {
  const SWITCH_CATS = new Set(["vlans","trunking","stp","etherchannel","port-security"]);
  const ROUTER_CATS = new Set(["static-routing","rip","ospf","eigrp","router-on-stick","nat","dhcp","acl-standard","acl-extended"]);
  function deviceFor() {
    if (SWITCH_CATS.has(cat.id)) return "Switch";
    if (ROUTER_CATS.has(cat.id)) return "Router";
    if (cmd.example) {
      const m = cmd.example.match(/^([A-Za-z][\w-]*?)(?:\([^)]+\))?[#>]/m);
      if (m) {
        const n = m[1];
        if (/^R/i.test(n)) return "Router";
        if (/^S/i.test(n)) return "Switch";
      }
    }
    return "Switch";
  }
  function modePrompt(mode) {
    const m = (mode || "").toLowerCase();
    if (m.includes("user exec")) return ">";
    if (m.includes("privileged exec")) return "#";
    if (m.includes("interface config / range")) return "(config-if-range)#";
    if (m.includes("interface config")) return "(config-if)#";
    if (m.includes("sub-interface")) return "(config-subif)#";
    if (m.includes("vlan config")) return "(config-vlan)#";
    if (m.includes("line config")) return "(config-line)#";
    if (m.includes("router config")) return "(config-router)#";
    if (m.includes("dhcp config")) return "(dhcp-config)#";
    if (m.includes("std-nacl")) return "(config-std-nacl)#";
    if (m.includes("ext-nacl")) return "(config-ext-nacl)#";
    if (m.includes("std/ext")) return "(config-ext-nacl)#";
    if (m.includes("any config sub-mode")) return "(config-*)#";
    if (m.includes("global config")) return "(config)#";
    return "#";
  }
  function subModeFor(mode) {
    const m = (mode || "").toLowerCase();
    if (m.includes("interface config / range")) return "interface range FastEthernet0/1 - 12";
    if (m.includes("sub-interface")) return "interface GigabitEthernet0/0.10";
    if (m.includes("interface config")) return "interface GigabitEthernet0/1";
    if (m.includes("vlan config")) return "vlan 10";
    if (m.includes("line config")) return "line vty 0 4";
    if (m.includes("router config")) {
      if (cat.id === "rip") return "router rip";
      if (cat.id === "ospf") return "router ospf 1";
      if (cat.id === "eigrp") return "router eigrp 100";
      return "router ospf 1";
    }
    if (m.includes("dhcp config")) return "ip dhcp pool LAN_POOL";
    if (m.includes("std-nacl")) return "ip access-list standard BLOCK_HR";
    if (m.includes("ext-nacl")) return "ip access-list extended WEB_FILTER";
    if (m.includes("std/ext")) return cat.id === "acl-extended" ? "ip access-list extended WEB_FILTER" : "ip access-list standard BLOCK_HR";
    return null;
  }
  function concretize(step) {
    const p = (step || "").trim();
    if (p === "enable") return "enable";
    if (p === "configure terminal" || p === "conf t") return "configure terminal";
    if (p === "<enter the desired sub-mode>") return subModeFor(cmd.mode) || p;
    if (p === "interface <type><number>") return "interface GigabitEthernet0/1";
    if (p === "interface Serial<number>") return "interface Serial0/0/0";
    if (p === "interface <type><number>.<sub-id>") return "interface GigabitEthernet0/0.10";
    if (p === "interface range <type><range>") return "interface range FastEthernet0/1 - 12";
    if (p === "vlan <id>") return "vlan 10";
    if (/^router /.test(p)) {
      if (cat.id === "rip") return "router rip";
      if (cat.id === "ospf") return "router ospf 1";
      if (cat.id === "eigrp") return "router eigrp 100";
      return "router ospf 1";
    }
    if (/^line /.test(p)) return "line vty 0 4";
    if (p === "ip access-list standard <name>") return "ip access-list standard BLOCK_HR";
    if (p === "ip access-list extended <name>") return "ip access-list extended WEB_FILTER";
    if (p === "ip access-list standard|extended <name>") {
      return cat.id === "acl-extended" ? "ip access-list extended WEB_FILTER" : "ip access-list standard BLOCK_HR";
    }
    if (p === "ip dhcp pool <name>") return "ip dhcp pool LAN_POOL";
    return p;
  }
  function finalCommand() {
    if (cmd.example) {
      const firstLine = cmd.example.split("\n").map(l => l.trim()).find(l => l.length > 0);
      if (firstLine) {
        const m = firstLine.match(/^[\w-]+(?:\([^)]+\))?[#>]\s*(.+)$/);
        if (m) return m[1].trim();
      }
    }
    return cmd.syntax || cmd.name;
  }
  const dev = deviceFor();
  const lines = [];
  let curr = ">";
  for (const step of (cmd.prereqs || [])) {
    const s = step.toLowerCase().trim();
    lines.push({ prompt: dev + curr, cmd: concretize(step) });
    if (s === "enable") curr = "#";
    else if (s === "configure terminal" || s === "conf t") curr = "(config)#";
    else curr = modePrompt(cmd.mode);
  }
  lines.push({ prompt: dev + curr, cmd: finalCommand() });
  return lines;
}

function copyText(text, btn) {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    };
    const finish = () => {
      btn.textContent = "Copied!"; btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(() => { fallback(); finish(); });
    } else { fallback(); finish(); }
  }

  const searchEl = document.getElementById("search");
  let searchTimer = null;
  searchEl.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 80);
  });
  function runSearch() {
    const q = searchEl.value.trim().toLowerCase();
    let visibleCmds = 0;
    document.querySelectorAll(".category").forEach(catSec => {
      let anyVisible = false;
      catSec.querySelectorAll(".cmd").forEach(card => {
        const hay = card.getAttribute("data-search");
        const match = !q || hay.includes(q);
        card.classList.toggle("hidden", !match);
        if (match) { anyVisible = true; visibleCmds++; }
      });
      const catMatch = !q || catSec.getAttribute("data-search").includes(q) || anyVisible;
      catSec.classList.toggle("hidden", !catMatch);
    });
    let nores = document.getElementById("no-results");
    if (q && visibleCmds === 0) {
      if (!nores) {
        nores = el("div", { class: "no-results", id: "no-results" },
          "No commands match \u201C" + q + "\u201D. Try a shorter term.");
        categoriesEl.appendChild(nores);
      } else {
        nores.textContent = "No commands match \u201C" + q + "\u201D. Try a shorter term.";
      }
    } else if (nores) { nores.remove(); }
  }

  const navLinks = navList.querySelectorAll("a");
  const sectionEls = Array.from(document.querySelectorAll(".category"));
  function updateActive() {
    const scrollPos = window.scrollY + 90;
    let active = sectionEls[0];
    for (const sec of sectionEls) if (sec.offsetTop <= scrollPos) active = sec;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("data-cat") === (active && active.id)));
  }
  window.addEventListener("scroll", () => requestAnimationFrame(updateActive));
  updateActive();

  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  navLinks.forEach(a => a.addEventListener("click", () => sidebar.classList.remove("open")));

  function renderMermaid() {
    if (!window.mermaid) return;
    document.querySelectorAll(".mermaid").forEach(b => {
      if (b.getAttribute("data-processed") === "true") {
        const original = b.getAttribute("data-original");
        if (original != null) { b.removeAttribute("data-processed"); b.innerHTML = ""; b.textContent = original; }
      } else { b.setAttribute("data-original", b.textContent); }
    });
    try { window.mermaid.run({ querySelector: ".mermaid" }); } catch (e) {}
  }
  if (window.mermaid) {
    window.mermaid.initialize({ startOnLoad: false, theme: currentTheme === "dark" ? "dark" : "default", securityLevel: "loose" });
    renderMermaid();
  }

  document.getElementById("github-link").addEventListener("click", e => {
    e.preventDefault();
    window.open("https://github.com/ULTIMATE-ACE-M/ACE-Packet-Tracer", "_blank");
  });

  // Inject styles for the new sections (so we don't have to update styles.css separately)
  const css = `
    .cmd-prereqs { font-size: 13px; margin: 8px 0; padding: 8px 12px; background: var(--surface-2); border-left: 3px solid var(--primary); border-radius: 0 6px 6px 0; }
    .cmd-prereqs-label { font-weight: 600; color: var(--text); margin-right: 6px; }
    .cli-path { margin: 4px 0 0; padding: 10px 12px; white-space: pre; font-family: ui-monospace, Consolas, monospace; font-size: 13px; line-height: 1.55; }
    .cli-path .cli-prompt { color: #7ec7ff; user-select: none; font-weight: 600; opacity: 0.95; }
    [data-theme="light"] .cli-path .cli-prompt { color: #7ec7ff; }
    .cmd-customize { font-size: 14px; margin: 8px 0; padding: 8px 12px; background: var(--surface-2); border-left: 3px solid #16a34a; border-radius: 0 6px 6px 0; }
    [data-theme="dark"] .cmd-customize { border-left-color: #4ade80; }
    .cmd-customize-label { font-weight: 600; color: var(--text); }
    .cmd-customize .inline-code, .inline-code { font-family: ui-monospace, Consolas, monospace; background: var(--surface); padding: 1px 5px; border-radius: 4px; border: 1px solid var(--border); font-size: 12.5px; color: var(--accent); }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
