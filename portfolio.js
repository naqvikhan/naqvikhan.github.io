/* ============================================================
   Portfolio — interactions
   nav frost/shrink · cursor-reactive hero · hero title reveal ·
   alternating slide-in cards · scroll reveal · smooth anchors
   Runs after content is rendered (portfolio:rendered).
   ============================================================ */
(function () {
  "use strict";

  /* run fn at most once per animation frame, using the latest args */
  function rafThrottle(fn) {
    var ticking = false, lastArgs;
    return function () {
      lastArgs = arguments;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { ticking = false; fn.apply(null, lastArgs); });
      }
    };
  }

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
    window.addEventListener("scroll", rafThrottle(onScroll), { passive: true });
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
    window.addEventListener("scroll", rafThrottle(spyOnScroll), { passive: true });
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
            // split into words (and whitespace runs) so characters never break mid-word
            n.textContent.split(/(\s+)/).forEach(function (tok) {
              if (tok === "") return;
              if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
              var word = document.createElement("span");
              word.className = "word";
              tok.split("").forEach(function (ch) {
                var s = document.createElement("span");
                s.className = "char";
                s.textContent = ch;
                s.style.transitionDelay = (i * 0.026 + 0.1) + "s";
                i++;
                word.appendChild(s);
              });
              frag.appendChild(word);
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
      window.addEventListener("pointermove", rafThrottle(function (e) {
        var px = e.clientX / window.innerWidth;
        var py = e.clientY / window.innerHeight;
        siteBg.style.setProperty("--mx", (px * 100) + "%");
        siteBg.style.setProperty("--my", (py * 100) + "%");
        if (aurora) aurora.style.transform = "translate(" + ((px - 0.5) * 30) + "px," + ((py - 0.5) * 30) + "px)";
      }), { passive: true });
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
      var fadeDucks = [];               // touch perchers that fade in/out with scroll

      // hero — right of the quote (cursor) / clamped at content's right edge (touch)
      var quote = qs("[data-quote]"), content = qs(".hero-content");
      if (quote && content) {
        content.style.position = "relative";
        var heroDuck = makeDuck({ parent: content, px: fine ? 6 : DPX, flashlight: fine, style: { position: "absolute" } });
        if (coarse) fadeDucks.push(heroDuck);
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
        var aboutDuck = makeDuck({ parent: aboutCard, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", top: "50%", left: "-46px", right: "auto", transform: "translateY(-50%)" }
            : { position: "absolute", top: "-22px", right: "16px", left: "auto" } });
        if (coarse) fadeDucks.push(aboutDuck);
      }

      // experience — right & overlapping (cursor) / perched on the card's top-right (touch)
      var simple = null;
      document.querySelectorAll("[data-experience] .card").forEach(function (cd) {
        var t = cd.querySelector(".card-title");
        if (t && /simplecitizen/i.test(t.textContent)) simple = cd;
      });
      if (simple) {
        simple.style.position = "relative";
        var expDuck = makeDuck({ parent: simple, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", left: "calc(100% - 24px)", top: "50%", transform: "translateY(-50%)" }
            : { position: "absolute", right: "10px", top: "-20px", left: "auto" } });
        if (coarse) fadeDucks.push(expDuck);
      }

      // projects — just below the word "Projects"
      var projTitle = qs("#projects .section-head .title");
      if (projTitle) {
        projTitle.style.position = "relative";
        var projDuck = makeDuck({ parent: projTitle, px: DPX, flashlight: fine,
          style: { position: "absolute", top: "calc(100% + 12px)", left: "2px" } });
        if (coarse) fadeDucks.push(projDuck);
      }

      // contact — next to the word "build"
      var build = qs("[data-build]");
      if (build) {
        build.style.position = "relative";
        var contactDuck = makeDuck({ parent: build, px: DPX, flashlight: fine,
          style: fine
            ? { position: "absolute", left: "calc(100% - 18px)", top: "50%", transform: "translateY(-50%)" }
            : { position: "absolute", left: "calc(100% - 14px)", top: "-6px" } });
        if (coarse) fadeDucks.push(contactDuck);
      }

      /* ---------- touch: perched ducks fade in & out as they cross the viewport ----------
         Cursor devices reveal ducks with the flashlight; touch devices have no
         cursor, so instead of sitting put the perchers breathe in and out as you
         scroll — transparent at the edges, solid through the middle band.
         Stays fully visible under reduced-motion. */
      if (coarse && fadeDucks.length && !reduce) {
        var fadeDucksOnScroll = function () {
          var vh = window.innerHeight || document.documentElement.clientHeight || 1;
          for (var i = 0; i < fadeDucks.length; i++) {
            var r = fadeDucks[i].getBoundingClientRect();
            var p = (r.top + r.height / 2) / vh;     // 0 = top of viewport, 1 = bottom
            var o;
            if (p <= 0 || p >= 1) o = 0;             // off-screen
            else if (p < 0.22) o = p / 0.22;         // fade in rising from the bottom
            else if (p > 0.78) o = (1 - p) / 0.22;   // fade out leaving at the top
            else o = 1;                              // solid through the middle
            fadeDucks[i].style.opacity = (o < 0 ? 0 : o > 1 ? 1 : o).toFixed(3);
          }
        };
        window.addEventListener("scroll", rafThrottle(fadeDucksOnScroll), { passive: true });
        window.addEventListener("resize", rafThrottle(fadeDucksOnScroll));
        fadeDucksOnScroll();
        setTimeout(fadeDucksOnScroll, 400);
      }

      /* ---------- one pointermove drives every flashlight duck ---------- */
      if (flSprites.length) {
        /* cache sprite rects; recompute on scroll/resize (not every move) so
           pointermove does pure arithmetic instead of forcing layout each frame.
           Scrolling does NOT carry the last cursor position — the flashlight is
           pushed off-screen so ducks stay hidden while you scroll and only come
           back when the pointer actually moves again. */
        var flRects = [];
        var lastPX = -9999, lastPY = -9999;
        var applyFl = function () {
          for (var i = 0; i < flSprites.length; i++) {
            var r = flRects[i];
            if (!r || !r.width) continue;
            flSprites[i].style.setProperty("--dx", (lastPX - r.left) + "px");
            flSprites[i].style.setProperty("--dy", (lastPY - r.top) + "px");
          }
        };
        var measureFlRects = function () {
          for (var i = 0; i < flSprites.length; i++) flRects[i] = flSprites[i].getBoundingClientRect();
        };
        measureFlRects();
        /* scroll: re-measure, but reset the flashlight off-screen so a scroll never
           reveals a duck — only a real pointer move does */
        window.addEventListener("scroll", rafThrottle(function () {
          lastPX = -9999; lastPY = -9999;
          measureFlRects();
          applyFl();
        }), { passive: true });
        window.addEventListener("resize", rafThrottle(function () { measureFlRects(); applyFl(); }));
        setTimeout(measureFlRects, 500);
        window.addEventListener("pointermove", rafThrottle(function (e) {
          lastPX = e.clientX; lastPY = e.clientY;
          applyFl();
        }), { passive: true });
      }
    })();

    /* ---- slide-in + reveal on scroll (scroll-driven; replays on re-entry) ----
       Scroll-based rather than IntersectionObserver so content can never get
       stuck invisible if IO is delayed, and so it re-animates both directions.
       Reads all rects first, then writes classes — no layout thrashing. */
    var animated = Array.prototype.slice.call(document.querySelectorAll(".slide, .reveal"));
    if (reduce) {
      animated.forEach(function (el) { el.classList.add("in"); });
    } else {
      var revealCheck = function () {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var states = [];
        for (var i = 0; i < animated.length; i++) {
          var r = animated[i].getBoundingClientRect();
          states[i] = (r.top < vh * 0.92) && (r.bottom > vh * 0.08);
        }
        for (var j = 0; j < animated.length; j++) animated[j].classList.toggle("in", states[j]);
      };
      window.addEventListener("scroll", rafThrottle(revealCheck), { passive: true });
      window.addEventListener("resize", rafThrottle(revealCheck));
      revealCheck();
      setTimeout(revealCheck, 200);
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

    /* ---- smooth anchor scrolling (custom eased — consistent across browsers) ---- */
    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    var scrollAnim = null;
    function smoothScrollTo(targetY) {
      var startY = window.scrollY || window.pageYOffset || 0;
      var dist = targetY - startY;
      if (reduce || Math.abs(dist) < 4) { window.scrollTo(0, targetY); return; }
      var duration = Math.min(1000, Math.max(480, Math.abs(dist) * 0.55));
      var start = null;
      if (scrollAnim) cancelAnimationFrame(scrollAnim);
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        window.scrollTo(0, startY + dist * easeInOutCubic(p));
        if (p < 1) scrollAnim = requestAnimationFrame(step);
        else scrollAnim = null;
      }
      scrollAnim = requestAnimationFrame(step);
    }
    /* a user wheel/touch gesture cancels an in-progress programmatic scroll */
    ["wheel", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, function () { if (scrollAnim) { cancelAnimationFrame(scrollAnim); scrollAnim = null; } }, { passive: true });
    });
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          var y = t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) - 60;
          smoothScrollTo(y);
        }
      });
    });

    /* ---- contact footer "snap-back" ----
       The footer is allowed to peek when you reach the very bottom, then it
       springs back out of view so the page settles on the contact section and
       the footer stays hidden. We wait for the scroll/momentum to settle at the
       bottom first, so we never fight an in-progress gesture. */
    (function () {
      var footer = document.querySelector(".footer");
      if (!footer) return;
      var snapping = false, settle = null;
      function curY() { return window.scrollY || window.pageYOffset || 0; }
      function maxY() { return Math.max(0, (document.documentElement.scrollHeight || 0) - window.innerHeight); }
      function atBottom() { return curY() >= maxY() - 2; }
      function hideTarget() {
        // scroll position at which the footer's top sits exactly at the fold (hidden)
        var docTop = footer.getBoundingClientRect().top + curY();
        return Math.max(0, docTop - window.innerHeight);
      }
      function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
      function snapTo(targetY) {
        var startY = curY(), dist = targetY - startY;
        if (Math.abs(dist) < 2) return;
        if (reduce) { window.scrollTo(0, targetY); return; }
        snapping = true;
        var dur = 560, start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          window.scrollTo(0, Math.round(startY + dist * easeOutBack(p)));
          if (p < 1) requestAnimationFrame(step);
          else snapping = false;
        }
        requestAnimationFrame(step);
      }
      window.addEventListener("scroll", rafThrottle(function () {
        if (snapping) return;
        if (settle) clearTimeout(settle);
        if (!atBottom()) return;
        settle = setTimeout(function () {
          if (!snapping && atBottom()) snapTo(hideTarget());
        }, 140);
      }), { passive: true });
    })();
  }

  if (window.__portfolioRendered) init();
  else window.addEventListener("portfolio:rendered", init, { once: true });
})();
