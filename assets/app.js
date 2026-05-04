/* ============================================================
   Cisco Packet Tracer Command Reference - app logic
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    if (window.mermaid) {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "loose",
        });
        renderMermaid();
      } catch (e) { /* ignore */ }
    }
  }

  let currentTheme;
  try {
    currentTheme = localStorage.getItem("ciscoref-theme")
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {
    currentTheme = "light";
  }
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    try { localStorage.setItem("ciscoref-theme", currentTheme); } catch (e) {}
    applyTheme(currentTheme);
  });

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const key in attrs) {
        if (key === "class") node.className = attrs[key];
        else if (key === "html") node.innerHTML = attrs[key];
        else if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        else node.setAttribute(key, attrs[key]);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
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
        cmd.mode || "", cmd.example || "", (cmd.related || []).join(" ")
      ].join(" ").toLowerCase();

      const card = el("div", { class: "cmd", "data-search": haystack });
      const head = el("div", { class: "cmd-head" });
      head.appendChild(el("span", { class: "cmd-name" }, cmd.name));
      if (cmd.mode) head.appendChild(el("span", { class: "cmd-mode" }, cmd.mode));
      card.appendChild(head);

      if (cmd.syntax) card.appendChild(el("code", { class: "cmd-syntax" }, cmd.syntax));
      if (cmd.description) card.appendChild(el("p", { class: "cmd-desc" }, cmd.description));

      if (cmd.example) {
        const snippet = el("pre", { class: "snippet" });
        const copyBtn = el("button", {
          class: "copy-btn",
          type: "button",
          "aria-label": "Copy to clipboard",
          onclick: e => copyText(cmd.example, e.target)
        }, "Copy");
        snippet.appendChild(copyBtn);
        snippet.appendChild(document.createTextNode(cmd.example));
        card.appendChild(snippet);
      }

      if (cmd.notes) card.appendChild(el("div", { class: "cmd-notes" }, cmd.notes));
      section.appendChild(card);
    });

    categoriesEl.appendChild(section);
  });

  cmdCountEl.textContent = totalCommands;
  catCountEl.textContent = CATEGORIES.length;

  function copyText(text, btn) {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    };

    const finish = () => {
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 1400);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(finish).catch(() => { fallback(); finish(); });
    } else {
      fallback();
      finish();
    }
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
    } else if (nores) {
      nores.remove();
    }
  }

  const navLinks = navList.querySelectorAll("a");
  const sectionEls = Array.from(document.querySelectorAll(".category"));

  function updateActive() {
    const scrollPos = window.scrollY + 90;
    let active = sectionEls[0];
    for (const sec of sectionEls) {
      if (sec.offsetTop <= scrollPos) active = sec;
    }
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("data-cat") === (active && active.id));
    });
  }
  window.addEventListener("scroll", () => requestAnimationFrame(updateActive));
  updateActive();

  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  navLinks.forEach(a => a.addEventListener("click", () => sidebar.classList.remove("open")));

  function renderMermaid() {
    if (!window.mermaid) return;
    const blocks = document.querySelectorAll(".mermaid");
    blocks.forEach((b, i) => {
      if (b.getAttribute("data-processed") === "true") {
        const original = b.getAttribute("data-original");
        if (original != null) {
          b.removeAttribute("data-processed");
          b.innerHTML = "";
          b.textContent = original;
        }
      } else {
        b.setAttribute("data-original", b.textContent);
      }
    });
    try { window.mermaid.run({ querySelector: ".mermaid" }); } catch (e) { /* ignore */ }
  }

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    });
    renderMermaid();
  }

  document.getElementById("github-link").addEventListener("click", e => {
    e.preventDefault();
    alert("Visit the repo: https://github.com/ULTIMATE-ACE-M/ACE-Packet-Tracer");
  });
})();
