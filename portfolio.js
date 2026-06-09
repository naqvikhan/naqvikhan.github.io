/* ============================================================
   Portfolio — interactions
   nav frost/shrink · cursor-reactive hero · hero title reveal ·
   alternating slide-in cards · scroll reveal · smooth anchors
   Runs after content is rendered (portfolio:rendered).
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- nav frost + shrink + hide-on-scroll + close-menu-on-scroll ---- */
    var nav = document.querySelector(".nav");
    var burger = document.querySelector("[data-burger]");
    var lastY = window.scrollY;
    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("menu-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
    function onScroll() {
      if (!nav) return;
      var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      nav.classList.toggle("scrolled", y > 40);

      /* any real scroll dismisses the open mobile menu */
      if (nav.classList.contains("menu-open") && Math.abs(y - lastY) > 2) closeMenu();

      var mobile = window.innerWidth <= 860;
      if (!mobile || y <= 60) {
        nav.classList.remove("nav-hidden");
      } else if (y > lastY + 4) {
        nav.classList.add("nav-hidden");      /* scrolling down → hide */
      } else if (y < lastY - 4) {
        nav.classList.remove("nav-hidden");   /* scrolling up → reveal */
      }
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- mobile menu toggle ---- */
    if (burger && nav) {
      burger.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = nav.classList.toggle("menu-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.querySelectorAll("[data-nav-menu] a").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
      document.addEventListener("click", function (e) {
        if (nav.classList.contains("menu-open") && !nav.contains(e.target)) closeMenu();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
    }

    /* ---- nav scroll-spy: highlight the section currently in view ----
       Stateless (recomputed every scroll) so it's correct in BOTH directions.
       Hero/home highlights the brand "Your Name"; sections highlight their link. */
    var navLinkEls = {};
    document.querySelectorAll(".nav-link").forEach(function (a) {
      navLinkEls[a.getAttribute("href")] = a;
    });
    var spyTargets = [
      { sel: "#top",      el: document.querySelector(".nav-brand"), accent: "var(--pop-1)" },
      { sel: "#about",    el: navLinkEls["#about"],    accent: "var(--pop-3)" },
      { sel: "#journey",  el: navLinkEls["#journey"],  accent: "var(--pop-2)" },
      { sel: "#projects", el: navLinkEls["#projects"], accent: "var(--pop-4)" },
      { sel: "#contact",  el: navLinkEls["#contact"],  accent: "var(--pop-5)" }
    ].filter(function (s) { return s.el && document.querySelector(s.sel); });

    /* active text color (no pill) */
    function spyOnScroll() {
      var line = window.innerHeight * 0.35;   /* reference line, 35% down the viewport */
      var activeIdx = 0;
      for (var i = 0; i < spyTargets.length; i++) {
        var sec = document.querySelector(spyTargets[i].sel);
        if (sec && sec.getBoundingClientRect().top <= line) activeIdx = i;
      }
      spyTargets.forEach(function (s, i) { s.el.classList.toggle("active", i === activeIdx); });
    }
    window.addEventListener("scroll", spyOnScroll, { passive: true });
    spyOnScroll();

    /* ---- split hero title into chars (visible base, transition from hidden) ---- */
    var titleEl = document.querySelector("[data-split]");
    if (titleEl) {
      var tmp = document.createElement("div");
      tmp.innerHTML = titleEl.innerHTML;
      var i = 0;
      (function wrap(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split("").forEach(function (ch) {
              if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
              var s = document.createElement("span");
              s.className = "char";
              s.textContent = ch;
              s.style.transitionDelay = (i * 0.026 + 0.1) + "s";
              i++;
              frag.appendChild(s);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== "BR") {
            wrap(n);
          }
        });
      })(tmp);
      titleEl.innerHTML = tmp.innerHTML;
      if (!reduce) {
        titleEl.classList.add("pre");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { titleEl.classList.remove("pre"); });
        });
        setTimeout(function () { titleEl.classList.remove("pre"); }, 2000);
      }
    }

    /* ---- cursor-reactive page background (global) ---- */
    var siteBg = document.querySelector(".site-bg");
    var aurora = siteBg && siteBg.querySelector(".aurora");
    if (siteBg) {
      window.addEventListener("pointermove", function (e) {
        var px = e.clientX / window.innerWidth;
        var py = e.clientY / window.innerHeight;
        siteBg.style.setProperty("--mx", (px * 100) + "%");
        siteBg.style.setProperty("--my", (py * 100) + "%");
        if (aurora) aurora.style.transform = "translate(" + ((px - 0.5) * 30) + "px," + ((py - 0.5) * 30) + "px)";
      }, { passive: true });
    }

    /* ---- pixel-duck easter eggs (flashlight reveals + static perchers) ---- */
    (function () {
      var MAP = [
        ".....YYY....",
        "....YYYYY...",
        "...YYYYYYY..",
        "...YYYkYYoo.",
        "...YYYkYYoo.",
        "...YYYYYYY..",
        "..YYYYYYYYY.",
        ".YYYYYYYYYYY",
        ".YYYdddYYYYY",
        ".YYYYYYYYYYY",
        "..YYYYYYYYY.",
        "...YYYYYYY.."
      ];
      var COLOR = { Y: "#ffce32", d: "#eaa400", o: "#ff7a1a", k: "#222831" };

      function buildSprite(px) {
        var s = document.createElement("div");
        s.className = "duck-sprite";
        s.style.gridTemplateColumns = "repeat(12," + px + "px)";
        s.style.gridAutoRows = px + "px";
        s.style.width = (12 * px) + "px";
        s.style.height = (MAP.length * px) + "px";
        MAP.forEach(function (row) {
          for (var i = 0; i < row.length; i++) {
            var c = document.createElement("span");
            c.className = "duck-px";
            c.style.width = px + "px"; c.style.height = px + "px";
            if (COLOR[row[i]]) c.style.background = COLOR[row[i]];
            s.appendChild(c);
          }
        });
        return s;
      }

      var flSprites = [];
      function makeDuck(opts) {
        var host = document.createElement("div");
        host.className = "duck-egg" + (opts.flashlight ? " fl" : " static");
        host.setAttribute("aria-hidden", "true");
        var sprite = buildSprite(opts.px || 6);
        host.appendChild(sprite);
        if (opts.style) for (var k in opts.style) host.style[k] = opts.style[k];
        if (opts.insert === "prepend" && opts.parent.firstChild) opts.parent.insertBefore(host, opts.parent.firstChild);
        else opts.parent.appendChild(host);
        if (opts.flashlight) flSprites.push(sprite);
        return host;
      }

      var fine = window.matchMedia("(pointer: fine)").matches;
      if (location.hash === "#touch") fine = false;   // debug: force touch rendering
      var qs = function (s) { return document.querySelector(s); };

      /* ---------- STATIC ducks (always visible) ---------- */
      var footCol = qs(".footer .wrap .col");
      if (footCol) makeDuck({ parent: footCol, px: 3, flashlight: false, insert: "prepend",
        style: { position: "static", marginRight: "2px" } });

      var chip = qs('[data-tools] .marquee.row1');
      if (chip) {
        // a dedicated "I spy a [duck]" pill, added to BOTH marquee halves so the loop stays seamless
        var makePill = function () {
          var pill = document.createElement("span");
          pill.className = "chip duck-chip";
          pill.style.setProperty("--c", "var(--pop-4)");
          pill.style.display = "inline-flex";
          pill.style.alignItems = "center";
          pill.style.gap = "9px";
          pill.style.padding = "9px 18px";
          var txt = document.createElement("span");
          txt.textContent = "I spy a";
          pill.appendChild(txt);
          var dh = document.createElement("div");
          dh.className = "duck-egg static";
          dh.style.position = "static";
          dh.appendChild(buildSprite(2));
          pill.appendChild(dh);
          return pill;
        };
        var chips = chip.querySelectorAll(".chip");
        var half = Math.floor(chips.length / 2);
        if (chips.length && chips[half]) {
          chip.insertBefore(makePill(), chips[half]);
          chip.appendChild(makePill());
        }
      }

      /* ---------- FLASHLIGHT ducks on cursor devices · STATIC ducks on touch ----------
         Touch screens have no cursor, so on coarse-pointer devices we render the
         same ducks as always-visible perchers, repositioned to stay on-screen. */
      var coarse = !fine;
      var DPX = fine ? 5 : 4;            // slightly smaller pixels on mobile

      // hero — right of the quote (cursor) / clamped at content's right edge (touch)
      var quote = qs("[data-quote]"), content = qs(".hero-content");
      if (quote && content) {
        content.style.position = "relative";
        var heroDuck = makeDuck({ parent: content, px: fine ? 6 : DPX, flashlight: fine, style: { position: "absolute" } });
        var placeHero = function () {
          var cr = content.getBoundingClientRect(), qr = quote.getBoundingClientRect();
          var dw = heroDuck.firstChild.offsetWidth || 60;
          var cy = Math.round(qr.top - cr.top + qr.height / 2 - dw / 2);
          if (fine) {
            heroDuck.style.left = Math.round(qr.right - cr.left + 30) + "px";
          } else {
            heroDuck.style.left = Math.round(cr.width - dw - 2) + "px"; // hug right edge, stay on-screen
          }
          heroDuck.style.top = cy + "px";
        };
        placeHero(); window.addEventListener("resize", placeHero); setTimeout(placeHero, 450);
      }

      // nav — in line with the bar, right of the brand
      var hero = qs("header.hero"), brand = qs(".nav-brand");
      if (hero && brand) {
        hero.style.position = "relative";
        var navDuck = makeDuck({ parent: hero, px: fine ? 4 : 3, flashlight: fine, style: { position: "absolute" } });
        var placeNav = function () {
          var br = brand.getBoundingClientRect();
          var dh = navDuck.firstChild.offsetHeight || 48;
          navDuck.style.left = Math.round(br.right + (fine ? 18 : 12)) + "px";
          navDuck.style.top = Math.round(br.top + br.height / 2 - dh / 2) + "px";
        };
        placeNav(); window.addEventListener("resize", placeNav); setTimeout(placeNav, 300);
      }

      // about — left & overlapping (cursor) / perched on the card's top-right (touch)
      var aboutCard = qs(".about-card");
      if (aboutCard) {
        aboutCard.style.position = "relative";
        makeDuck({ parent: aboutCard, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", top: "50%", left: "-46px", right: "auto", transform: "translateY(-50%)" }
            : { position: "absolute", top: "-22px", right: "16px", left: "auto" } });
      }

      // experience — right & overlapping (cursor) / perched on the card's top-right (touch)
      var simple = null;
      document.querySelectorAll("[data-experience] .card").forEach(function (cd) {
        var t = cd.querySelector(".card-title");
        if (t && /simplecitizen/i.test(t.textContent)) simple = cd;
      });
      if (simple) {
        simple.style.position = "relative";
        makeDuck({ parent: simple, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", left: "calc(100% - 24px)", top: "50%", transform: "translateY(-50%)" }
            : { position: "absolute", right: "10px", top: "-20px", left: "auto" } });
      }

      // projects — just below the word "Projects"
      var projTitle = qs("#projects .section-head .title");
      if (projTitle) {
        projTitle.style.position = "relative";
        makeDuck({ parent: projTitle, px: DPX, flashlight: fine,
          style: { position: "absolute", top: "calc(100% + 12px)", left: "2px" } });
      }

      // contact — next to the word "build"
      var build = qs("[data-build]");
      if (build) {
        build.style.position = "relative";
        makeDuck({ parent: build, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", left: "calc(100% - 18px)", top: "50%", transform: "translateY(-50%)" }
            : { position: "absolute", left: "calc(100% - 14px)", top: "-6px" } });
      }

      /* ---------- one pointermove drives every flashlight duck ---------- */
      if (flSprites.length) {
        window.addEventListener("pointermove", function (e) {
          for (var i = 0; i < flSprites.length; i++) {
            var r = flSprites[i].getBoundingClientRect();
            if (!r.width) continue;
            flSprites[i].style.setProperty("--dx", (e.clientX - r.left) + "px");
            flSprites[i].style.setProperty("--dy", (e.clientY - r.top) + "px");
          }
        }, { passive: true });
      }
    })();

    /* ---- slide-in + reveal on scroll ---- */
    var animated = document.querySelectorAll(".slide, .reveal");
    if ("IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -7% 0px" });
      animated.forEach(function (el) { io.observe(el); });
    } else {
      animated.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---- custom cursor (fine pointer only) ---- */
    if (window.matchMedia("(pointer: fine)").matches) {
      var dot = document.createElement("div"); dot.className = "cursor-dot";
      var ring = document.createElement("div"); ring.className = "cursor-ring";
      document.body.appendChild(dot); document.body.appendChild(ring);
      document.documentElement.classList.add("has-cursor");

      var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, shown = false;
      var sel = "a,button,.btn,.chip,.card,.project,.link-line,.nav-link,.nav-brand,input,textarea,select,[role='button']";

      /* random glow color from the tools/chip palette (--pop-1..5) */
      var POPS = ["--pop-1", "--pop-2", "--pop-3", "--pop-4", "--pop-5"];
      var lastPop = null;
      function randCur() {
        var p;
        do { p = POPS[Math.floor(Math.random() * POPS.length)]; } while (p === lastPop && POPS.length > 1);
        lastPop = p;
        document.documentElement.style.setProperty("--cur-color", "var(" + p + ")");
      }
      randCur();

      function place(el, x, y) { el.style.transform = "translate3d(" + x + "px," + y + "px,0)"; }
      place(dot, mx, my); place(ring, rx, ry);

      window.addEventListener("pointermove", function (e) {
        mx = e.clientX; my = e.clientY;
        place(dot, mx, my);
        if (reduce) place(ring, mx, my);
        if (!shown) { shown = true; dot.classList.add("show"); ring.classList.add("show"); }
      }, { passive: true });

      document.addEventListener("pointerover", function (e) {
        if (e.target.closest && e.target.closest(sel)) {
          if (!ring.classList.contains("active")) randCur();
          ring.classList.add("active"); dot.classList.add("active");
        }
      });
      document.addEventListener("pointerout", function (e) {
        if (e.target.closest && e.target.closest(sel)) {
          var to = e.relatedTarget;
          if (!to || !to.closest || !to.closest(sel)) { ring.classList.remove("active"); dot.classList.remove("active"); }
        }
      });
      window.addEventListener("pointerdown", function () { randCur(); ring.classList.add("press"); });
      window.addEventListener("pointerup", function () { ring.classList.remove("press"); });
      document.addEventListener("mouseleave", function () { dot.classList.remove("show"); ring.classList.remove("show"); shown = false; });
      document.addEventListener("mouseenter", function () { dot.classList.add("show"); ring.classList.add("show"); shown = true; });

      if (!reduce) {
        (function loop() {
          rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
          place(ring, rx, ry);
          requestAnimationFrame(loop);
        })();
      }
    }

    /* ---- smooth anchor scrolling ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          var y = t.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
        }
      });
    });
  }

  if (window.__portfolioRendered) init();
  else window.addEventListener("portfolio:rendered", init, { once: true });
})();
