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

  // Render inline-code spans for `text` between backticks; everything else is plain text.
  // Both code-spans AND prose get any <placeholder> substituted to concrete values.
  function renderInlineMarkdown(parent, text) {
    if (!text) return;
    const parts = String(text).split(/(`[^`]+`)/g);
    for (const p of parts) {
      if (p.startsWith("`") && p.endsWith("`") && p.length > 1) {
        const codeEl = document.createElement("code");
        codeEl.className = "inline-code";
        const raw = p.slice(1, -1);
        codeEl.textContent = (typeof resolvePrereqLine === "function") ? resolvePrereqLine(raw) : raw;
        parent.appendChild(codeEl);
      } else if (p.length) {
        const txt = (typeof _substituteAngles === "function") ? _substituteAngles(p) : p;
        parent.appendChild(document.createTextNode(txt));
      }
    }
  }

  const navList = document.getElementById("nav-list");
  const categoriesEl = document.getElementById("categories");
  const cmdCountEl = document.getElementById("cmd-count");
  const catCountEl = document.getElementById("cat-count");

  let totalCommands = 0;
  // Pre-build the name -> anchor-id lookup so steps in EVERY category can link
  // to commands in ANY category (including ones that haven't been rendered yet).
  const _cmdAnchorByName = (function () {
    const map = {};
    for (const cat of CATEGORIES) {
      for (const cmd of cat.commands) {
        const slug = "cmd-" + cat.id + "--" + cmd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        map[cmd.name] = slug;
      }
    }
    return map;
  })();

  // Build a name -> "decorated syntax" lookup. For each known command, we align
  // the syntax tokens with the example tokens and produce a version where any
  // placeholder tokens get replaced with <concreteValue> from the example —
  // brackets preserved so the user knows what they need to change.
  const _concreteByName = (function () {
    const promptRe = /^[\w-]+(\([^)]+\))?[#>]\s*/;
    const map = {};
    for (const cat of CATEGORIES) {
      for (const c of cat.commands) {
        if (!c.example) continue;
        const exFirst = c.example.split("\n")[0].replace(promptRe, "");
        if (!exFirst) continue;
        if (!c.syntax) { map[c.name] = exFirst; continue; }
        // Token-align: replace any <placeholder>-style token in syntax with
        // the corresponding example token wrapped in <>.
        const synTok = c.syntax.split(/\s+/);
        const exTok = exFirst.split(/\s+/);
        const out = [];
        for (let i = 0; i < synTok.length; i++) {
          const t = synTok[i];
          if (/[<{].*[>}]/.test(t) && i < exTok.length) {
            out.push("<" + exTok[i] + ">");
          } else if (i < exTok.length) {
            out.push(exTok[i]);
          } else {
            out.push(t);
          }
        }
        map[c.name] = out.join(" ");
      }
    }
    return map;
  })();
  // Default concrete values for common placeholder names. Used as fallback when
  // the line isn't a known command. Keep entries short and realistic.
  const _placeholderDefaults = {
    "id": "10", "vlan": "10", "vlan-id": "10", "vlan-list": "10,20,30",
    "name": "EXAMPLE", "text": "MyDescription", "message": "Authorized access only",
    "addr": "192.168.1.1", "address": "192.168.1.1", "ip": "192.168.1.1",
    "ipv6-addr": "2001:db8::1", "ipv6": "2001:db8::1",
    "mask": "255.255.255.0", "wildcard": "0.0.0.255",
    "subnet-mask": "255.255.255.0", "subnet": "192.168.1.0",
    "network": "192.168.1.0", "network-address": "192.168.1.0",
    "gateway-ip": "192.168.1.1", "gw": "192.168.1.1",
    "next-hop": "10.0.0.2", "next-hop-ip": "10.0.0.2",
    "ip-start": "192.168.1.1", "ip-end": "192.168.1.10",
    "start": "192.168.1.1", "end": "192.168.1.10", "start-ip": "192.168.1.1", "end-ip": "192.168.1.10",
    "type": "GigabitEthernet", "number": "0/0", "range": "0/1 - 12", "sub-id": "10",
    "if": "GigabitEthernet0/0", "interface": "GigabitEthernet0/0", "exit-interface": "Serial0/0/0",
    "dhcp-server-ip": "10.0.0.50", "server-ip": "10.0.0.50", "server": "10.0.0.50",
    "pool-name": "LAN1",
    "process-id": "1", "pid": "1", "as-number": "65001", "as": "65001",
    "area": "0", "area-id": "0",
    "process-id|as-number": "1",
    "next-hop|interface": "10.0.0.2", "next-hop|exit-interface": "10.0.0.2",
    "protocol": "ospf", "proto": "tcp",
    "port": "80", "ports": "80", "src-port": "1024", "dst-port": "80",
    "src": "192.168.1.0", "dst": "10.0.0.0", "src-wild": "0.0.0.255", "dst-wild": "0.0.0.255", "wc": "0.0.0.255",
    "host": "10.0.0.5",
    "secret": "Cisco123", "password": "Cisco123", "pwd": "Cisco123", "pw": "Cisco123",
    "user": "admin", "username": "admin",
    "key": "SecretKey", "community": "public", "string": "public",
    "days": "7", "hours": "0", "minutes": "0", "seconds": "5",
    "bps": "64000", "kbps": "1544", "mbps": "1000",
    "percent": "5.00",
    "num": "1", "group": "10", "grp": "10", "n": "10", "seq": "10",
    "filename": "config.bak", "file": "config.bak", "filesystem": "flash",
    "method1": "local", "method2": "enable",
    "list": "1", "acl": "100",
    "command": "shutdown", "het-originele-commando": "hostname R1", "exec-command": "show ip interface brief",
    "console|vty|aux": "vty", "console|vty": "vty",
    "ipv4": "1.1.1.1", "a.b.c.d": "1.1.1.1",
    "H.H.H": "aabb.cc00.0100",
    "prefix": "2001:db8::", "len": "64", "link-local-addr": "fe80::1",
    "vlan-id": "10",
    "ip-of-hostname": "8.8.8.8",
    "delim": "#", "tag": "10",
    "inside-local": "192.168.1.100", "inside-global": "203.0.113.1",
    "name-of-server": "ntp1.example.com",
    "policy-name": "VOICE", "dscp-value": "ef", "step": "10",
    "bits": "2048", "modulus": "2048", "domain": "lab.local",
    "ip-or-hostname": "10.0.0.1",
    "name|number": "100", "name|num": "100",
    "src": "192.168.1.0", "source": "192.168.1.0",
    "hello": "10", "hold": "30",
    "ad": "200", "distance": "200",
    "virtual-ip": "192.168.1.254",
    "min": "5", "bytes": "100", "count": "5",
    "Mbps": "10000", "mode": "active",
    "isp-ip": "203.0.113.1", "outside": "GigabitEthernet0/1", "mgmt": "1",
    "hours-offset": "1"
  };

  function _substituteAngles(s) {
    if (!s || !/[<>]/.test(s)) return s;
    return s.replace(/<([^<>]+)>/g, function (m, inner) {
      const key = inner.toLowerCase();
      let val;
      if (_placeholderDefaults[key] !== undefined) val = _placeholderDefaults[key];
      else if (_placeholderDefaults[inner] !== undefined) val = _placeholderDefaults[inner];
      else val = inner;
      // Keep the <> brackets so users see what part is theirs to change
      return "<" + val + ">";
    });
  }

  // Given the raw text of an inline-code span (or any short snippet), find
  // the anchor ID of the command card it should link to. Strips placeholders
  // and uses longest-name-prefix matching against the command catalogue.
  function findCommandAnchor(raw) {
    if (!raw) return null;
    const clean = raw.replace(/<[^<>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return null;
    if (_cmdAnchorByName[clean]) return _cmdAnchorByName[clean];
    if (_cmdAnchorByName[raw]) return _cmdAnchorByName[raw];
    // Longest-name-prefix match
    const candidates = Object.keys(_cmdAnchorByName).sort((a, b) => b.length - a.length);
    for (const n of candidates) {
      if (clean === n || clean.startsWith(n + " ") || raw === n || raw.startsWith(n + " ")) {
        return _cmdAnchorByName[n];
      }
    }
    return null;
  }


  // Find the best command-anchor for a step/rule. Tries explicit cmd, then
  // longest backtick-matched command name, then prose scan, then the see/
  // category fallback. Always returns SOMETHING so every step/gotcha clicks.
  function deriveTarget(item, currentCatId) {
    if (item.cmd && _cmdAnchorByName[item.cmd]) return _cmdAnchorByName[item.cmd];
    const haystack = (item.title || "") + " " + (item.body || "") + " " + (item.symptom || "");
    // 1) Longest match across all backtick spans
    const matches = haystack.match(/`([^`]+)`/g) || [];
    let best = null, bestLen = -1;
    const sorted = Object.keys(_cmdAnchorByName).sort((a, b) => b.length - a.length);
    for (const m of matches) {
      const inner = m.slice(1, -1).replace(/<[^<>]+>/g, "").replace(/\s+/g, " ").trim();
      for (const n of sorted) {
        if (inner === n || inner.startsWith(n + " ")) {
          if (n.length > bestLen) { bestLen = n.length; best = _cmdAnchorByName[n]; }
          break;
        }
      }
    }
    if (best) return best;
    // 2) Prose scan: look for command names appearing in the plain text
    const plain = haystack.replace(/`[^`]*`/g, " ").toLowerCase();
    for (const n of sorted) {
      if (n.length < 4) continue; // skip too-short names like "?" or "do"
      const nLower = n.toLowerCase();
      if (plain.indexOf(nLower) !== -1) {
        return _cmdAnchorByName[n];
      }
    }
    // 3) Fall back to the see-category section, or the current category section
    if (item.see) return item.see;
    return currentCatId;
  }
  function attachClickToTarget(node, anchor) {
    if (!anchor) return;
    node.setAttribute("data-target", "#" + anchor);
    node.setAttribute("title", "Jump to the related command");
    node.setAttribute("role", "link");
    node.setAttribute("tabindex", "0");
    node.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      window.location.hash = anchor;
    });
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.hash = anchor; }
    });
  }

  function resolvePrereqLine(line) {
    if (!/[<>]/.test(line)) return line;
    if (_concreteByName[line]) return _concreteByName[line];
    const candidates = Object.keys(_concreteByName).sort((a, b) => b.length - a.length);
    for (const n of candidates) {
      if (line === n || line.startsWith(n + " ")) {
        return _concreteByName[n];
      }
    }
    return _substituteAngles(line);
  }

  CATEGORIES.forEach(cat => {
    const navLi = el("li", null, el("a", { href: "#" + cat.id, "data-cat": cat.id }, cat.title));
    navList.appendChild(navLi);

    const catRules = (typeof RULES !== "undefined" && RULES[cat.id]) ? RULES[cat.id] : null;
    const rulesText = catRules ? catRules.map(r => (r.title + " " + r.body + " " + (r.symptom || ""))).join(" ") : "";
    const catRequiresPreview = (typeof REQUIRES !== "undefined" && REQUIRES[cat.id]) ? REQUIRES[cat.id] : null;
    const requiresText = catRequiresPreview ? (catRequiresPreview.feature + " " + catRequiresPreview.steps.map(s => s.title + " " + s.body).join(" ")) : "";
    const section = el("section", { class: "category", id: cat.id, "data-search": (cat.title + " " + (cat.blurb || "") + " " + rulesText + " " + requiresText).toLowerCase() });
    section.appendChild(el("h3", null, cat.title));
    if (cat.blurb) section.appendChild(el("p", { class: "blurb" }, cat.blurb));

    const catReq = (typeof REQUIRES !== "undefined" && REQUIRES[cat.id]) ? REQUIRES[cat.id] : null;
    const catModesCheck = (typeof MODES !== "undefined" && MODES[cat.id]) ? MODES[cat.id] : null;
    if ((catRules && catRules.length) || catReq || catModesCheck) {
      const panel = el("div", { class: "rules-panel" });
      const headerBtn = el("button", { class: "rules-panel-header", type: "button", "aria-expanded": "false" });
      headerBtn.appendChild(el("span", { class: "rules-panel-icon", "aria-hidden": "true" }, "!"));
      const countParts = [];
      const catModesForCount = (typeof MODES !== "undefined" && MODES[cat.id]) ? MODES[cat.id] : null;
      if (catReq) countParts.push(catReq.steps.length + " step" + (catReq.steps.length === 1 ? "" : "s"));
      if (catModesForCount && catModesForCount.options) countParts.push(catModesForCount.options.length + " mode" + (catModesForCount.options.length === 1 ? "" : "s"));
      if (catRules && catRules.length) countParts.push(catRules.length + " gotcha" + (catRules.length === 1 ? "" : "s"));
      headerBtn.appendChild(el("span", { class: "rules-panel-title" }, "Rules (" + countParts.join(" + ") + ")"));
      headerBtn.appendChild(el("span", { class: "rules-panel-chev", "aria-hidden": "true" }, ">"));
      panel.appendChild(headerBtn);

      const body = el("div", { class: "rules-panel-body" });

      if (catReq) {
        const reqHead = el("div", { class: "rules-section-header rules-section-requires" });
        reqHead.appendChild(el("span", { class: "rules-section-badge" }, "OK"));
        reqHead.appendChild(el("span", { class: "rules-section-title" }, "To make " + catReq.feature + ", you need:"));
        body.appendChild(reqHead);

        const reqList = el("ol", { class: "req-list" });
        catReq.steps.forEach((step, idx) => {
          const stepHay = (step.title + " " + step.body).toLowerCase();
          const targetAnchor = deriveTarget(step, cat.id);
          const li = el("li", { class: "req-step req-step-link", "data-search": stepHay });
          attachClickToTarget(li, targetAnchor);
          li.appendChild(el("span", { class: "req-num", "aria-hidden": "true" }, String(idx + 1)));
          const content = el("div", { class: "req-content" });
          const titleEl = el("div", { class: "req-title" });
          renderInlineMarkdown(titleEl, step.title);
          titleEl.appendChild(el("span", { class: "req-step-arrow", "aria-hidden": "true" }, " \u2192"));
          content.appendChild(titleEl);
          const bodyEl = el("div", { class: "req-body" });
          renderInlineMarkdown(bodyEl, step.body);
          content.appendChild(bodyEl);
          if (step.see) {
            const seeLink = el("a", { class: "req-see", href: "#" + step.see });
            const linkedCat = CATEGORIES.find(c => c.id === step.see);
            seeLink.appendChild(document.createTextNode("see " + (linkedCat ? linkedCat.title : step.see)));
            content.appendChild(seeLink);
          }
          li.appendChild(content);
          reqList.appendChild(li);
        });
        body.appendChild(reqList);
      }

      const catModes = (typeof MODES !== "undefined" && MODES[cat.id]) ? MODES[cat.id] : null;
      if (catModes && catModes.options && catModes.options.length) {
        const modesHead = el("div", { class: "rules-section-header rules-section-modes" });
        modesHead.appendChild(el("span", { class: "rules-section-badge modes-badge" }, "?"));
        modesHead.appendChild(el("span", { class: "rules-section-title" }, catModes.title || "Modes — wanneer welke?"));
        body.appendChild(modesHead);
        if (catModes.subtitle) {
          body.appendChild(el("p", { class: "modes-subtitle" }, catModes.subtitle));
        }
        const grid = el("div", { class: "modes-grid" });
        catModes.options.forEach(opt => {
          const card = el("div", { class: "mode-card mode-" + (opt.color || "gray") });
          const cardHead = el("div", { class: "mode-head" });
          cardHead.appendChild(el("span", { class: "mode-icon", "aria-hidden": "true" }, opt.icon || "?"));
          cardHead.appendChild(el("span", { class: "mode-name" }, opt.name));
          card.appendChild(cardHead);
          if (opt.command) {
            const cmdEl = el("code", { class: "mode-cmd" }, opt.command);
            card.appendChild(cmdEl);
          }
          if (opt.use) {
            const useEl = el("p", { class: "mode-use" });
            renderInlineMarkdown(useEl, opt.use);
            card.appendChild(useEl);
          }
          if (opt.tip) {
            const tipEl = el("div", { class: "mode-tip" });
            tipEl.appendChild(el("span", { class: "mode-tip-label" }, "Tip: "));
            const t = el("span", null);
            renderInlineMarkdown(t, opt.tip);
            tipEl.appendChild(t);
            card.appendChild(tipEl);
          }
          grid.appendChild(card);
        });
        body.appendChild(grid);
      }

      if (catRules && catRules.length) {
        if (catReq) {
          const gotchaHead = el("div", { class: "rules-section-header rules-section-gotchas" });
          gotchaHead.appendChild(el("span", { class: "rules-section-badge gotcha-badge" }, "!"));
          gotchaHead.appendChild(el("span", { class: "rules-section-title" }, "Common gotchas:"));
          body.appendChild(gotchaHead);
        }
        catRules.forEach(rule => {
          const ruleHay = (rule.title + " " + rule.body + " " + (rule.symptom || "")).toLowerCase();
          const targetAnchor = deriveTarget(rule, cat.id);
          const item = el("div", { class: "rule rule-link", "data-search": ruleHay });
          attachClickToTarget(item, targetAnchor);
          item.appendChild(el("span", { class: "rule-dot", "aria-hidden": "true" }, "*"));
          const ruleContent = el("div", { class: "rule-content" });
          const titleEl = el("div", { class: "rule-title" });
          renderInlineMarkdown(titleEl, rule.title);
          titleEl.appendChild(el("span", { class: "req-step-arrow", "aria-hidden": "true" }, " \u2192"));
          ruleContent.appendChild(titleEl);
          const bodyEl = el("p", { class: "rule-body" });
          renderInlineMarkdown(bodyEl, rule.body);
          ruleContent.appendChild(bodyEl);
          if (rule.symptom) {
            const sym = el("div", { class: "rule-symptom" });
            sym.appendChild(el("span", { class: "rule-symptom-label" }, "Symptom: "));
            const symBody = el("span", null);
            renderInlineMarkdown(symBody, rule.symptom);
            sym.appendChild(symBody);
            ruleContent.appendChild(sym);
          }
          item.appendChild(ruleContent);
          body.appendChild(item);
        });
      }
      panel.appendChild(body);

      headerBtn.addEventListener("click", () => {
        const open = panel.classList.toggle("open");
        headerBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });

      section.appendChild(panel);
    }

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

      const cmdSlug = _cmdAnchorByName[cmd.name];
      const card = el("div", { class: "cmd", id: cmdSlug, "data-search": haystack });
      const head = el("div", { class: "cmd-head" });
      head.appendChild(el("span", { class: "cmd-name" }, _substituteAngles(cmd.name)));
      if (cmd.mode) head.appendChild(el("span", { class: "cmd-mode" }, cmd.mode));
      card.appendChild(head);

      if (cmd.syntax) {
        // Use the decorated version (concrete values wrapped in <>) when we have one;
        // fall back to a generic placeholder substitution otherwise.
        let displaySyntax = _concreteByName[cmd.name] || _substituteAngles(cmd.syntax) || cmd.syntax;
        card.appendChild(el("code", { class: "cmd-syntax" }, displaySyntax));
      }
      if (cmd.description) card.appendChild(el("p", { class: "cmd-desc" }, _substituteAngles(cmd.description)));

      // ----- Prereqs: CLI-style path to reach this command -----
      if (cmd.prereqs && cmd.prereqs.length) {
        const prereqWrap = el("div", { class: "cmd-prereqs" });
        prereqWrap.appendChild(el("span", { class: "cmd-prereqs-label" }, "Get there with:"));
        const cliLines = buildCliPath(cat, cmd);
        const cliBlock = el("pre", { class: "snippet cli-path" });
        cliLines.forEach((L, i) => {
          if (i > 0) cliBlock.appendChild(document.createTextNode("\n"));
          cliBlock.appendChild(el("span", { class: "cli-prompt" }, L.prompt + " "));
          cliBlock.appendChild(document.createTextNode(resolvePrereqLine(L.cmd)));
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

      if (cmd.notes) card.appendChild(el("div", { class: "cmd-notes" }, _substituteAngles(cmd.notes)));
      section.appendChild(card);
    });

    categoriesEl.appendChild(section);
  });


  // ============================================================
  // WALKTHROUGHS — render after CATEGORIES, before troubleshooting link
  // ============================================================
  if (typeof WALKTHROUGHS !== "undefined" && WALKTHROUGHS.length) {
    const wtNavHead = el("li", { class: "nav-header" }, "Setup Guides");
    navList.appendChild(wtNavHead);

    WALKTHROUGHS.forEach(wt => {
      // Sidebar entry
      const wtNavLi = el("li", null, el("a", { href: "#" + wt.id, "data-cat": wt.id }, wt.title));
      navList.appendChild(wtNavLi);

      // Main content section
      const wtText = wt.title + " " + wt.blurb + " " +
        wt.steps.map(s => s.title + " " + s.body + " " + s.lines.map(l => l.cmd).join(" ")).join(" ") + " " +
        (wt.gotchas || []).map(g => g.title + " " + g.body + " " + (g.bad || "") + " " + (g.good || "")).join(" ");
      const section = el("section", { class: "category walkthrough", id: wt.id, "data-search": wtText.toLowerCase() });
      const h3 = el("h3", null);
      h3.appendChild(el("span", { class: "wt-icon", "aria-hidden": "true" }, wt.device === "Switch" ? "S" : "R"));
      h3.appendChild(document.createTextNode(" " + wt.title));
      section.appendChild(h3);
      section.appendChild(el("p", { class: "blurb" }, wt.blurb));

      // Steps
      wt.steps.forEach((step, idx) => {
        const stepBox = el("div", { class: "wt-step" });
        const head = el("div", { class: "wt-step-head" });
        head.appendChild(el("span", { class: "wt-step-num", "aria-hidden": "true" }, String(idx + 1)));
        head.appendChild(el("span", { class: "wt-step-title" }, step.title));
        stepBox.appendChild(head);
        if (step.body) {
          stepBox.appendChild(el("div", { class: "wt-step-body" }, step.body));
        }
        // Code snippet (with copy button)
        const snip = el("pre", { class: "snippet wt-snippet" });
        // Copy text = just the commands, no prompts
        const copyText = step.lines.map(l => l.cmd.trim()).filter(Boolean).join("\n");
        const copyBtn = el("button", {
          class: "copy-btn", type: "button",
          "aria-label": "Copy commands to clipboard",
          title: "Copy: " + (copyText.length > 60 ? copyText.slice(0, 60) + "..." : copyText),
          onclick: e => copyText && copyTextToClipboard(copyText, e.target)
        }, "Copy");
        snip.appendChild(copyBtn);
        step.lines.forEach((line, i) => {
          if (i > 0) snip.appendChild(document.createTextNode("\n"));
          snip.appendChild(el("span", { class: "cli-prompt" }, line.prompt + " "));
          // Split cmd on <...> segments to colorize the changeable parts
          const parts = line.cmd.split(/(<[^<>]+>)/g);
          parts.forEach(p => {
            if (p.length === 0) return;
            if (p.startsWith("<") && p.endsWith(">") && p.length > 2) {
              snip.appendChild(el("span", { class: "cli-placeholder" }, p));
            } else {
              snip.appendChild(document.createTextNode(p));
            }
          });
        });
        stepBox.appendChild(snip);

        // Make the whole step clickable to the most relevant command card
        const stepHaystack = step.title + " " + step.body + " " + step.lines.map(l => l.cmd).join(" ");
        const target = deriveTarget({title: step.title, body: stepHaystack}, wt.id);
        if (target && target !== wt.id) {
          stepBox.classList.add("wt-step-link");
          attachClickToTarget(stepBox, target);
        }
        section.appendChild(stepBox);
      });

      // Gotchas as collapsible dropdown
      if (wt.gotchas && wt.gotchas.length) {
        const panel = el("div", { class: "rules-panel" });
        const hbtn = el("button", { class: "rules-panel-header", type: "button", "aria-expanded": "false" });
        hbtn.appendChild(el("span", { class: "rules-panel-icon", "aria-hidden": "true" }, "!"));
        hbtn.appendChild(el("span", { class: "rules-panel-title" }, "Veelgemaakte fouten (" + wt.gotchas.length + ")"));
        hbtn.appendChild(el("span", { class: "rules-panel-chev", "aria-hidden": "true" }, ">"));
        panel.appendChild(hbtn);
        const body = el("div", { class: "rules-panel-body" });
        wt.gotchas.forEach(g => {
          const item = el("div", { class: "rule wt-gotcha" });
          item.appendChild(el("span", { class: "rule-dot", "aria-hidden": "true" }, "*"));
          const content = el("div", { class: "rule-content" });
          const tEl = el("div", { class: "rule-title" });
          renderInlineMarkdown(tEl, g.title);
          content.appendChild(tEl);
          if (g.body) {
            const bEl = el("p", { class: "rule-body" });
            renderInlineMarkdown(bEl, g.body);
            content.appendChild(bEl);
          }
          if (g.bad || g.good) {
            const diff = el("div", { class: "wt-gotcha-diff" });
            if (g.bad) {
              const badRow = el("div", { class: "wt-gotcha-row wt-bad" });
              badRow.appendChild(el("span", { class: "wt-gotcha-label" }, "Fout"));
              badRow.appendChild(el("code", { class: "wt-gotcha-code" }, g.bad));
              diff.appendChild(badRow);
            }
            if (g.good) {
              const goodRow = el("div", { class: "wt-gotcha-row wt-good" });
              goodRow.appendChild(el("span", { class: "wt-gotcha-label" }, "Goed"));
              goodRow.appendChild(el("code", { class: "wt-gotcha-code" }, g.good));
              diff.appendChild(goodRow);
            }
            content.appendChild(diff);
          }
          item.appendChild(content);
          body.appendChild(item);
        });
        panel.appendChild(body);
        hbtn.addEventListener("click", () => {
          const open = panel.classList.toggle("open");
          hbtn.setAttribute("aria-expanded", open ? "true" : "false");
        });
        section.appendChild(panel);
      }

      categoriesEl.appendChild(section);
    });
  }

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
    if (p === "interface <type><number>") return "interface <GigabitEthernet0/1>";
    if (p === "interface Serial<number>") return "interface Serial<0/0/0>";
    if (p === "interface <type><number>.<sub-id>") return "interface <GigabitEthernet0/0.10>";
    if (p === "interface range <type><range>") return "interface range <FastEthernet0/1 - 12>";
    if (p === "vlan <id>") return "vlan <10>";
    if (/^router /.test(p)) {
      if (cat.id === "rip") return "router rip";
      if (cat.id === "ospf") return "router ospf <1>";
      if (cat.id === "eigrp") return "router eigrp <100>";
      return "router ospf <1>";
    }
    if (/^line /.test(p)) return "line vty <0> <4>";
    if (p === "ip access-list standard <name>") return "ip access-list standard <BLOCK_HR>";
    if (p === "ip access-list extended <name>") return "ip access-list extended <WEB_FILTER>";
    if (p === "ip access-list standard|extended <name>") {
      return cat.id === "acl-extended" ? "ip access-list extended <WEB_FILTER>" : "ip access-list standard <BLOCK_HR>";
    }
    if (p === "ip dhcp pool <name>") return "ip dhcp pool <LAN_POOL>";
    // Fallback: try the decorated lookup we built earlier
    if (_concreteByName[p]) return _concreteByName[p];
    return p;
  }
  function finalCommand() {
    // Prefer the decorated syntax (concrete values wrapped in <>) so users see
    // exactly which parts they need to change.
    if (_concreteByName[cmd.name]) return _concreteByName[cmd.name];
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
  const STOPWORDS = new Set(["a","an","and","are","as","at","be","but","by","can","cant","cannot","do","does","for","from","get","got","has","have","how","i","if","in","is","it","its","my","no","not","of","on","or","that","the","then","there","these","they","this","to","too","up","was","were","what","when","why","will","with","you","your","there's","im","ive","wont","dont","didnt","just","like","me","so","still","very"]);
  function tokenize(q) {
    return q.toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .split(/\s+/)
      .filter(t => t && t.length >= 2 && !STOPWORDS.has(t));
  }
  function matchScore(hay, tokens) {
    if (!tokens.length) return 1;
    let hits = 0;
    for (const t of tokens) if (hay.indexOf(t) !== -1) hits++;
    return hits;
  }
  function runSearch() {
    const qRaw = searchEl.value.trim().toLowerCase();
    const tokens = tokenize(qRaw);
    const useTokens = tokens.length >= 2;
    let visibleCmds = 0;
    document.querySelectorAll(".category").forEach(catSec => {
      let anyVisible = false;
      catSec.querySelectorAll(".cmd").forEach(card => {
        const hay = card.getAttribute("data-search");
        let match;
        if (!qRaw) match = true;
        else if (useTokens) match = matchScore(hay, tokens) > 0;
        else match = hay.includes(qRaw);
        card.classList.toggle("hidden", !match);
        if (match) { anyVisible = true; visibleCmds++; }
      });
      let anyRuleMatch = false;
      catSec.querySelectorAll(".rule, .req-step").forEach(r => {
        const hay = r.getAttribute("data-search") || "";
        let match;
        if (!qRaw) match = true;
        else if (useTokens) match = matchScore(hay, tokens) > 0;
        else match = hay.includes(qRaw);
        r.classList.toggle("hidden", !match);
        r.classList.toggle("rule-matched", !!qRaw && match);
        if (match && qRaw) { anyVisible = true; anyRuleMatch = true; }
      });
      const catHay = catSec.getAttribute("data-search") || "";
      let catMatch;
      if (!qRaw) catMatch = true;
      else if (useTokens) catMatch = matchScore(catHay, tokens) > 0 || anyVisible;
      else catMatch = catHay.includes(qRaw) || anyVisible;
      catSec.classList.toggle("hidden", !catMatch);
      const panel = catSec.querySelector(".rules-panel");
      if (panel) {
        if (qRaw && anyRuleMatch) {
          panel.classList.add("open");
          const hb = panel.querySelector(".rules-panel-header");
          if (hb) hb.setAttribute("aria-expanded", "true");
          panel.classList.remove("hidden");
        } else if (qRaw && !anyRuleMatch) {
          panel.classList.add("hidden");
        } else {
          panel.classList.remove("hidden");
        }
      }
    });
    let nores = document.getElementById("no-results");
    if (qRaw && visibleCmds === 0) {
      if (!nores) {
        nores = el("div", { class: "no-results", id: "no-results" },
          "No commands match \u201C" + qRaw + "\u201D. Try a shorter term or fewer words.");
        categoriesEl.appendChild(nores);
      } else {
        nores.textContent = "No commands match \u201C" + qRaw + "\u201D. Try a shorter term or fewer words.";
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
    .req-step-link, .rule-link { cursor: pointer; border-radius: 4px; margin-left: -8px; margin-right: -8px; padding-left: 8px; padding-right: 8px; transition: background 0.12s; }
    .rule-link:hover { background: rgba(192,86,33,0.10); }
    [data-theme="dark"] .rule-link:hover { background: rgba(251,146,60,0.10); }
    .rule-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .rule-link:hover .rule-title { color: var(--accent); }
    .rule-link .req-step-arrow { opacity: 0; transition: opacity 0.12s, transform 0.12s; }
    .rule-link:hover .req-step-arrow { opacity: 1; transform: translateX(3px); }
    .req-step-orig { cursor: pointer; border-radius: 4px; margin-left: -8px; margin-right: -8px; padding-left: 8px; padding-right: 8px; transition: background 0.12s; }
    .req-step-link:hover { background: rgba(192,86,33,0.10); }
    [data-theme="dark"] .req-step-link:hover { background: rgba(251,146,60,0.10); }
    .req-step-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .req-step-link .req-title { color: var(--text); }
    .req-step-link:hover .req-title { color: var(--accent); }
    .req-step-arrow { color: var(--accent); font-weight: 700; opacity: 0; transition: opacity 0.12s, transform 0.12s; display: inline-block; }
    .req-step-link:hover .req-step-arrow { opacity: 1; transform: translateX(3px); }
    .cmd { scroll-margin-top: 70px; }
    .cmd:target { box-shadow: 0 0 0 3px var(--accent); animation: targetPulse 1.4s ease-out 1; }
    @keyframes targetPulse { 0% { background: rgba(192,86,33,0.18); } 100% { background: transparent; } }
    .rules-panel { margin: 0 0 18px 0; background: var(--surface-2); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; overflow: hidden; }
    .rules-panel-header { display: flex; align-items: center; gap: 10px; width: 100%; background: transparent; border: 0; padding: 12px 16px; font-family: inherit; cursor: pointer; text-align: left; }
    .rules-panel-header:hover { background: rgba(192,86,33,0.06); }
    [data-theme="dark"] .rules-panel-header:hover { background: rgba(251,146,60,0.08); }
    .rules-panel-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; line-height: 1; flex-shrink: 0; }
    .rules-panel-title { flex: 1; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent); }
    .rules-panel-chev { color: var(--accent); font-size: 20px; line-height: 1; transition: transform 0.18s; flex-shrink: 0; font-family: ui-monospace, Consolas, monospace; }
    .rules-panel.open .rules-panel-chev { transform: rotate(90deg); }
    .rules-panel-body { display: none; padding: 8px 16px 12px 16px; border-top: 1px solid var(--border); }
    .rules-panel.open .rules-panel-body { display: block; }
    .rules-section-header { display: flex; align-items: center; gap: 8px; margin: 10px 0 8px 0; font-size: 13px; font-weight: 700; color: var(--text); }
    .rules-section-header:first-child { margin-top: 4px; }
    .rules-section-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 4px; background: #16a34a; color: #fff; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    [data-theme="dark"] .rules-section-badge { background: #15803d; }
    .gotcha-badge { background: var(--accent) !important; }
    .rules-section-title { color: var(--text); font-size: 13px; font-weight: 700; }
    .req-list { list-style: none; counter-reset: req; margin: 0 0 14px 0; padding: 0 0 0 12px; border-left: 2px dashed #16a34a; }
    [data-theme="dark"] .req-list { border-left-color: #4ade80; }
    .req-step { display: flex; gap: 10px; padding: 8px 0; margin: 0; }
    .req-step + .req-step { border-top: 1px solid var(--border); }
    .req-num { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: #16a34a; color: #fff; font-size: 11px; font-weight: 700; margin-top: 1px; }
    [data-theme="dark"] .req-num { background: #4ade80; color: #052e16; }
    .req-content { flex: 1; font-size: 13.5px; line-height: 1.55; }
    .req-title { font-weight: 600; color: var(--text); margin: 0 0 3px 0; }
    .req-body { color: var(--text); font-size: 13px; margin: 0 0 4px 0; }
    .req-see { display: inline-block; font-size: 12px; color: var(--primary); text-decoration: none; padding: 2px 8px; background: rgba(30,64,175,0.08); border-radius: 4px; margin-top: 2px; font-weight: 600; }
    [data-theme="dark"] .req-see { color: var(--primary); background: rgba(96,165,250,0.10); }
    .req-see:hover { background: rgba(30,64,175,0.16); }
    [data-theme="dark"] .req-see:hover { background: rgba(96,165,250,0.18); }
    .rule { display: flex; gap: 10px; padding: 12px 0; border-top: 1px solid var(--border); }
    .rule:first-of-type { border-top: none; padding-top: 4px; }
    .rule-dot { color: var(--accent); flex-shrink: 0; font-size: 16px; line-height: 1.5; margin-top: -2px; }
    .rule-content { flex: 1; font-size: 14px; line-height: 1.55; }
    .rule-title { font-weight: 600; color: var(--text); margin: 0 0 4px 0; }
    .rule-body { margin: 0 0 6px 0; color: var(--text); font-size: 13.5px; }
    .rule-symptom { font-size: 13px; color: var(--text-muted); padding: 6px 10px; background: var(--surface); border-left: 3px solid var(--accent); border-radius: 0 4px 4px 0; margin-top: 4px; }
    .rule-symptom-label { font-weight: 600; color: var(--accent); margin-right: 4px; }
    .rule.rule-matched .rule-title, .req-step.rule-matched .req-title { color: var(--accent); }
    .rule.hidden, .rules-panel.hidden, .req-step.hidden { display: none; }
    .nav-header { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); padding: 12px 12px 4px 12px; margin-top: 8px; border-top: 1px solid var(--border); font-weight: 600; }
    .walkthrough h3 { display: flex; align-items: center; gap: 10px; }
    .wt-icon { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #22c55e; color: #0b1120; font-size: 13px; font-weight: 700; }
    [data-theme="dark"] .wt-icon { background: #4ade80; color: #052e16; }
    .wt-step { background: var(--surface-2); border: 1px solid var(--border); border-left: 4px solid #22c55e; border-radius: 0 8px 8px 0; padding: 12px 14px; margin: 10px 0; }
    [data-theme="dark"] .wt-step { border-left-color: #4ade80; }
    .wt-step-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .wt-step-num { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #22c55e; color: #0b1120; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    [data-theme="dark"] .wt-step-num { background: #4ade80; color: #052e16; }
    .wt-step-title { font-weight: 600; font-size: 15px; color: var(--text); }
    .wt-step-body { color: var(--text-muted); font-size: 13.5px; margin: 4px 0 8px 36px; }
    .wt-snippet { margin-left: 36px; line-height: 1.55; }
    .wt-step-link { cursor: pointer; transition: border-color 0.12s; }
    .wt-step-link:hover { border-color: var(--accent); border-left-color: var(--accent); }
    .wt-gotcha-diff { display: grid; grid-template-columns: 1fr; gap: 6px; margin-top: 8px; padding-top: 6px; }
    .wt-gotcha-row { display: grid; grid-template-columns: 48px 1fr; gap: 8px; align-items: start; padding: 6px 10px; border-radius: 4px; font-size: 12.5px; }
    .wt-gotcha-row.wt-bad { background: rgba(220,38,38,0.10); border: 1px solid rgba(220,38,38,0.30); }
    [data-theme="dark"] .wt-gotcha-row.wt-bad { background: rgba(220,38,38,0.12); }
    .wt-gotcha-row.wt-good { background: rgba(34,197,94,0.10); border: 1px solid rgba(34,197,94,0.30); }
    [data-theme="dark"] .wt-gotcha-row.wt-good { background: rgba(34,197,94,0.12); }
    .wt-gotcha-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; padding: 2px 6px; border-radius: 3px; align-self: start; }
    .wt-bad .wt-gotcha-label { background: #dc2626; color: #fff; }
    .wt-good .wt-gotcha-label { background: #16a34a; color: #fff; }
    .wt-gotcha-code { font-family: ui-monospace, Consolas, monospace; font-size: 12.5px; color: var(--text); word-break: break-all; }

    .rules-section-modes .modes-badge { background: #3b82f6 !important; }
    [data-theme="dark"] .rules-section-modes .modes-badge { background: #60a5fa !important; }
    .modes-subtitle { color: var(--text-muted); font-size: 12.5px; margin: 0 0 10px 0; }
    .modes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin: 0 0 14px 0; }
    .mode-card { background: var(--surface); border: 1px solid var(--border); border-top: 4px solid var(--border); border-radius: 6px; padding: 10px 12px; }
    .mode-card.mode-blue { border-top-color: #3b82f6; }
    .mode-card.mode-green { border-top-color: #22c55e; }
    .mode-card.mode-amber { border-top-color: #f59e0b; }
    .mode-card.mode-gray { border-top-color: #6b7280; }
    .mode-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .mode-icon { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .mode-card.mode-blue .mode-icon { background: #3b82f6; }
    .mode-card.mode-green .mode-icon { background: #22c55e; }
    .mode-card.mode-amber .mode-icon { background: #f59e0b; }
    .mode-card.mode-gray .mode-icon { background: #6b7280; }
    .mode-name { font-size: 14px; font-weight: 600; color: var(--text); }
    .mode-cmd { display: block; font: 12px ui-monospace, Consolas, monospace; color: var(--accent); background: var(--surface-2); padding: 3px 7px; border-radius: 3px; border: 1px solid var(--border); margin: 4px 0 8px 0; }
    .mode-use { font-size: 13px; color: var(--text); margin: 0 0 8px 0; line-height: 1.5; }
    .mode-tip { font-size: 12px; color: var(--text-muted); padding: 6px 8px; background: var(--surface-2); border-left: 3px solid var(--accent); border-radius: 0 3px 3px 0; }
    .mode-tip-label { font-weight: 600; color: var(--accent); margin-right: 3px; }

    .wt-snippet .cli-placeholder { color: var(--accent); font-weight: 600; }
    [data-theme="dark"] .wt-snippet .cli-placeholder { color: #fb923c; }
    .wt-snippet { color: var(--code-text); }
    .wt-snippet .cli-prompt { color: #7ec7ff; font-weight: 600; user-select: none; opacity: 0.95; }
    .wt-gotcha-code { color: var(--text); }
    .wt-bad .wt-gotcha-code { color: #fca5a5; }
    [data-theme="dark"] .wt-bad .wt-gotcha-code { color: #fca5a5; }
    .wt-good .wt-gotcha-code { color: #86efac; }
    [data-theme="dark"] .wt-good .wt-gotcha-code { color: #86efac; }

  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
