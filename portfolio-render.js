/* ============================================================
   Render the portfolio from window.PORTFOLIO into the scaffold.
   Card markup for education & experience is identical (unified).
   ============================================================ */
(function () {
  "use strict";
  var D = window.PORTFOLIO || {};
  var POPS = 5; // number of pop colors available (--pop-1..5)

  function esc(s) { return String(s == null ? "" : s); }
  function pop(i) { return "var(--pop-" + ((i % POPS) + 1) + ")"; }
  // {{x}} → wrap x in <tag class>
  function emph(str, open, close) {
    return esc(str).replace(/\{\{(.+?)\}\}/g, open + "$1" + close);
  }
  function q(sel) { return document.querySelector(sel); }

  /* ---- nav / identity ---- */
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = esc(D.brand || D.name); });
  var navLinks = q("[data-nav-links]");
  if (navLinks) {
    var links = [
      { t: "About", h: "#about", c: "var(--pop-3)" }, { t: "Journey", h: "#journey", c: "var(--pop-2)" },
      { t: "Projects", h: "#projects", c: "var(--pop-4)" }, { t: "Contact", h: "#contact", c: "var(--pop-5)" }
    ];
    navLinks.innerHTML = links.map(function (l) {
      return '<a class="nav-link" href="' + l.h + '" style="--accent:' + l.c + '">' + l.t + "</a>";
    }).join("");
  }
  document.querySelectorAll("[data-resume]").forEach(function (el) { el.setAttribute("href", D.resumeHref || "#"); });

  /* ---- hero ---- */
  if (q("[data-role]")) q("[data-role]").textContent = esc(D.role);
  if (q("[data-split]")) q("[data-split]").innerHTML = emph(D.headline, '<span class="accent">', "</span>");
  if (q("[data-quote]")) {
    var pool = (D.quotes && D.quotes.length) ? D.quotes : (D.quote ? [D.quote] : []);
    if (pool.length) {
      var idx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1) {
        try {
          var last = parseInt(localStorage.getItem("pf_lastQuote"), 10);
          if (!isNaN(last) && last === idx) idx = (idx + 1) % pool.length;
          localStorage.setItem("pf_lastQuote", String(idx));
        } catch (e) {}
      }
      q("[data-quote]").textContent = esc(pool[idx]);
    }
  }
  var heroCta = q("[data-hero-cta]");
  if (heroCta) {
    var findSocial = function (label) {
      var m = (D.socials || []).filter(function (s) { return (s.label || "").toLowerCase() === label; })[0];
      return m ? m.href : "#";
    };
    var GH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
    var LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>';
    heroCta.innerHTML =
      '<a class="btn social gh" href="' + findSocial("github") + '" aria-label="GitHub">' + GH + 'GitHub</a>' +
      '<a class="btn solid" href="#projects">View work <span class="arw">↗</span></a>' +
      '<a class="btn social li" href="' + findSocial("linkedin") + '" aria-label="LinkedIn">' + LI + 'LinkedIn</a>';
  }

  /* ---- about ---- */
  if (q("[data-statement]")) q("[data-statement]").innerHTML = emph(D.about && D.about.statement, "<b>", "</b>");
  var aboutBody = q("[data-about-body]");
  if (aboutBody && D.about) aboutBody.innerHTML = (D.about.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  // real headshot, if provided
  if (D.about && D.about.photo) {
    var photoPh = q(".about-photo .ph");
    if (photoPh) {
      photoPh.classList.add("has-img");
      photoPh.innerHTML = '<img src="' + esc(D.about.photo) + '" alt="" loading="lazy">';
    }
  }
  if (q("[data-status]") && D.about) q("[data-status]").textContent = esc(D.about.status);
  var statusLink = q("[data-status-link]");
  if (statusLink) {
    var li = (D.socials || []).filter(function (s) { return (s.label || "").toLowerCase() === "linkedin"; })[0];
    if (li) { statusLink.setAttribute("href", li.href); statusLink.setAttribute("target", "_blank"); statusLink.setAttribute("rel", "noopener"); }
  }
  var stats = q("[data-stats]");
  if (stats && D.about) stats.innerHTML = (D.about.stats || []).map(function (s) {
    return '<div class="stat"><div class="n">' + esc(s.n) + '</div><div class="l">' + esc(s.l) + "</div></div>";
  }).join("");

  /* ---- unified card builder (education + experience) ---- */
  function cardHTML(item, idx) {
    var c = pop(idx);
    var tags = (item.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
    var side = idx % 2 === 0 ? "left" : "right";
    return '' +
      '<article class="card slide" data-side="' + side + '" style="--c:' + c + '">' +
        '<div class="card-mark">' + esc(item.mark || "•") + '</div>' +
        '<div class="card-body">' +
          '<div class="card-title">' + esc(item.title) + '</div>' +
          '<div class="card-sub">' + esc(item.sub) + '</div>' +
          (item.blurb ? '<p class="card-blurb">' + esc(item.blurb) + '</p>' : "") +
          (tags ? '<div class="card-tags">' + tags + '</div>' : "") +
        '</div>' +
        '<div class="card-date">' + esc(item.date) + '</div>' +
      '</article>';
  }
  var eduMount = q("[data-education]");
  if (eduMount) eduMount.innerHTML = (D.education || []).map(cardHTML).join("");
  var expMount = q("[data-experience]");
  // continue the alternating side/pop sequence after education
  if (expMount) {
    var offset = (D.education || []).length;
    expMount.innerHTML = (D.experience || []).map(function (it, i) { return cardHTML(it, offset + i); }).join("");
  }

  /* ---- tools (two marquee rows) ---- */
  var toolsMount = q("[data-tools]");
  if (toolsMount) {
    var tools = D.tools || [];
    var half = Math.ceil(tools.length / 2);
    var rows = [tools.slice(0, half), tools.slice(half)];
    toolsMount.innerHTML = '<div class="marquee-mask">' + rows.map(function (row, r) {
      var chips = row.map(function (t, i) {
        return '<span class="chip" style="--c:' + pop(r * 3 + i) + '"><span class="mk"></span>' + esc(t) + "</span>";
      }).join("");
      return '<div class="marquee row' + (r + 1) + '">' + chips + chips + "</div>";
    }).join("") + "</div>";
  }

  /* ---- project posters (CSS recreations of each project's key art) ---- */
  var GEAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54A.5.5 0 0013.9 2h-3.8a.5.5 0 00-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.7 8.48a.5.5 0 00.12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.82 16.16a.5.5 0 00-.12.64l1.92 3.32c.14.24.43.34.7.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.05.24.25.42.5.42h3.8c.25 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.27.12.56.02.7-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/></svg>';
  function posterHTML(p) {
    var d = p.posterDesign || {};
    if (d.kind === "wordmark") {
      var mark = d.brandMark
        ? '<div class="cap6" aria-hidden="true">Capital <span class="num">6</span></div>'
        : "";
      return '<div class="poster poster-wordmark">' + mark + '<span class="wm">' + esc(d.word || "") + '.</span></div>';
    }
    if (d.kind === "terminal") {
      var lines = d.lines || [];
      var rows = lines.map(function (ln, i) {
        var pfx = ln.t === "cmd" ? "$" : ln.t === "info" ? "\u25b8" : ln.t === "ok" ? "\u2713" : "";
        var last = i === lines.length - 1;
        return '<p class="tl ' + esc(ln.t) + '">' +
          (pfx ? '<span class="pfx">' + pfx + '</span>' : '') +
          '<span>' + esc(ln.s) + '</span>' +
          (last ? '<span class="tcur"></span>' : '') +
        '</p>';
      }).join("");
      return '<div class="poster poster-terminal"><div class="term">' +
          '<div class="term-bar"><i></i><i></i><i></i><span>' + esc(d.title || "") + '</span></div>' +
          '<div class="term-body" aria-hidden="true">' + rows + '</div>' +
        '</div></div>';
    }
    if (d.kind === "radar") {
      return '<div class="poster poster-radar">' +
        '<div class="radar-top"><span><span class="live">\u25cf</span> locating</span><span>scope \u00b7 360\u00b0</span></div>' +
        '<div class="scope" aria-hidden="true">' +
          '<div class="ring r1"></div><div class="ring r2"></div>' +
          '<div class="ch h"></div><div class="ch v"></div>' +
          '<div class="sweep"></div>' +
          '<div class="blip">\ud83e\udd86</div>' +
        '</div>' +
        '<div class="radar-foot">duck \u00b7 1 found \u00b7 sweep \u2191</div>' +
      '</div>';
    }
    if (d.kind === "script") {
      return '<div class="poster poster-script">' +
        '<div class="orbit" aria-hidden="true"></div>' +
        '<i class="spark s1" aria-hidden="true"></i><i class="spark s2" aria-hidden="true"></i>' +
        '<i class="spark s3" aria-hidden="true"></i><i class="spark s4" aria-hidden="true"></i>' +
        '<div class="sc"><span class="l1">' + esc(d.line1 || "") + '</span><span class="l2">' + esc(d.line2 || "") + '</span></div>' +
      '</div>';
    }
    if (d.kind === "app") {
      return '<div class="poster poster-app">' +
        '<span class="app-title">' + esc(d.title || "") + '.</span>' +
        '<span class="sun" aria-hidden="true"></span>' +
        '<span class="moon" aria-hidden="true"></span>' +
        '<div class="ring2"><div class="ring2-in"><b>' + esc(d.time || "") + '</b></div></div>' +
        '<div class="controls" aria-hidden="true"><span class="play"></span><span class="cog">' + GEAR_SVG + '</span></div>' +
      '</div>';
    }
    return "";
  }

  /* ---- projects ---- */
  var projMount = q("[data-projects]");
  if (projMount) projMount.innerHTML = (D.projects || []).map(function (p, i) {
    var c = pop(i);
    var flip = i % 2 === 1;
    var side = i % 2 === 0 ? "left" : "right";
    var stack = (p.stack || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
    var num = "PROJECT " + ("0" + (i + 1)).slice(-2);
    var media = p.posterDesign
      ? posterHTML(p)
      : (p.poster
        ? '<div class="ph has-img" data-label="' + esc(p.label || "project") + '"><img src="' + esc(p.poster) + '" alt="" loading="lazy"></div>'
        : (p.emoji
          ? '<div class="ph ph-emoji"><span class="ph-emoji-glyph">' + esc(p.emoji) + '</span></div>'
          : '<div class="ph" data-label="' + esc(p.label || "project") + '"></div>'));
    var linkText = esc(p.linkText || "View project");
    var arrow = esc(p.arrow || "↗");
    var external = p.href && p.href.charAt(0) !== "#";
    var link = p.href
      ? '<a class="link-line" href="' + p.href + '"' + (external ? ' target="_blank" rel="noopener"' : "") + '>' + linkText + ' <span class="arw">' + arrow + '</span></a>'
      : "";
    return '' +
      '<article class="project slide' + (flip ? " flip" : "") + '" data-side="' + side + '" style="--c:' + c + '">' +
        '<div class="project-media">' + media + '</div>' +
        '<div class="project-body">' +
          '<span class="project-index">' + num + '</span>' +
          '<h3 class="project-name">' + esc(p.name) + '</h3>' +
          '<p class="project-desc">' + esc(p.desc) + '</p>' +
          (stack ? '<div class="project-stack">' + stack + '</div>' : "") +
          link +
        '</div>' +
      '</article>';
  }).join("");

  /* ---- contact + footer ---- */
  var contactCta = q("[data-contact-cta]");
  if (contactCta) {
    var emailSocial = (D.socials || []).filter(function (s) { return (s.label || "").toLowerCase() === "email"; })[0];
    contactCta.innerHTML = '<a class="btn solid" href="' + (emailSocial ? emailSocial.href : "#") + '">Email me <span class="arw">↗</span></a>';
  }
  var footSocial = q("[data-footer-social]");
  if (footSocial) footSocial.innerHTML = "";
  document.querySelectorAll("[data-year-name]").forEach(function (el) {
    el.textContent = "© " + new Date().getFullYear() + " " + esc(D.name);
  });

  /* signal that content is in the DOM so interactions can wire up */
  window.__portfolioRendered = true;
  window.dispatchEvent(new CustomEvent("portfolio:rendered"));
})();
