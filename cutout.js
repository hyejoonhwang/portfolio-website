/* ═══ Magazine Cutout / Ransom Note Letter Effect ═══ */
(function() {
  var fonts = [
    "'Gambarino', Georgia, serif",
    "'General Sans', sans-serif",
    "Georgia, serif",
    "'Courier New', monospace",
    "'Times New Roman', serif",
  ];

  var colors = ['#F5542E', '#F2C327', '#008B6E', '#00AEDE', '#0067AD', '#2A2725'];

  var bgColors = [
    null, null, null, null, null,
    '#FFF8E1', '#FFE8E8', '#E8F4FD',
    '#E8F5E9', '#F3E5F5', '#FFF3E0',
  ];

  var weights = ['400','500','600','700','800'];

  /* Color sweep: a wave runs left to right once. Each letter cycles through a few random colors
     (ink, and paper if it has paper), then lands on its own colors. Font, size, tilt and which
     letters have paper never change, so nothing moves. */
  var STEP_MS = 120;       /* time on each color */
  var LOAD_STEPS = 3;      /* colors before landing, on page load */
  var HOVER_STEPS = 2;     /* colors before landing, on hover (lighter: people hover the nav a lot) */
  var LETTER_DELAY = 70;   /* the wave: delay from one letter to the next */

  var paperColors = bgColors.filter(Boolean);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Deterministic seeded random for nav consistency ── */
  function seededRand(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  }

  function seededRange(seed, min, max) {
    return seededRand(seed) * (max - min) + min;
  }

  function seededPick(seed, arr) {
    return arr[Math.floor(seededRand(seed) * arr.length)];
  }

  /* ── True random helpers ── */
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* One paper scrap: a fixed look from a seed (nav), or a fresh random one */
  function seededStyle(seed) {
    return {
      rot: seededRange(seed, -5, 5).toFixed(1),
      y: seededRange(seed + 1, -1.5, 1.5).toFixed(1),
      font: seededPick(seed + 2, fonts),
      color: seededPick(seed + 3, colors),
      size: seededRange(seed + 4, 0.88, 1.18).toFixed(2),
      weight: seededPick(seed + 5, weights),
      bg: seededPick(seed + 6, bgColors),
      puncColor: seededPick(seed + 7, colors),
    };
  }

  function randomStyle() {
    return {
      rot: rand(-5, 5).toFixed(1),
      y: rand(-1.5, 1.5).toFixed(1),
      font: pick(fonts),
      color: pick(colors),
      size: rand(0.88, 1.18).toFixed(2),
      weight: pick(weights),
      bg: pick(bgColors),
      puncColor: pick(colors),
    };
  }

  function applyStyle(s, st) {
    if (s._punc) {
      s.style.color = st.puncColor;
      return;
    }
    s.style.fontFamily = st.font;
    s.style.color = st.color;
    s.style.fontWeight = st.weight;
    s.style.fontSize = st.size + 'em';
    s.style.setProperty('--rot', st.rot + 'deg');
    s.style.setProperty('--y', st.y + 'px');
    if (st.bg) {
      s.style.backgroundColor = st.bg;
      s.style.padding = '1px 2px';
      s.style.borderRadius = '2px';
    } else {
      s.style.backgroundColor = '';
      s.style.padding = '';
      s.style.borderRadius = '';
    }
  }

  /* A random color step: new ink, and new paper only on letters that already have paper */
  function colorStep(s) {
    if (s._punc) { s.style.color = pick(colors); return; }
    s.style.color = pick(colors);
    if (s._final.bg) s.style.backgroundColor = pick(paperColors);
  }

  function sweep(el, steps) {
    if (reduceMotion || el._sweeping) return;
    el._sweeping = true;
    var spans = el._letters;
    spans.forEach(function(s, i) {
      var start = i * LETTER_DELAY;
      for (var k = 0; k < steps; k++) {
        setTimeout(function() { colorStep(s); }, start + k * STEP_MS);
      }
      setTimeout(function() { applyStyle(s, s._final); }, start + steps * STEP_MS);
    });
    setTimeout(function() { el._sweeping = false; }, (spans.length - 1) * LETTER_DELAY + steps * STEP_MS + 20);
  }

  document.querySelectorAll('.cutout').forEach(function(el) {
    var text = el.textContent;
    el.innerHTML = '';
    el._letters = [];

    /* Check if this cutout is inside nav — use deterministic styling */
    var isNav = !!el.closest('.nav-links, .mobile-nav');

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];

      if (ch === ' ') {
        el.appendChild(document.createTextNode(' '));
        continue;
      }

      /* Seed from char code + position for stable per-letter identity */
      var seed = ch.charCodeAt(0) * 100 + i * 7;
      var delay = (i * 0.018).toFixed(3);

      var s = document.createElement('span');
      s.textContent = ch;
      s.style.cssText = [
        'display:inline-block',
        '--delay:' + delay + 's',
        'transform:rotate(var(--rot)) translateY(var(--y))',
        'position:relative',
        'line-height:1',
        'transition:transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay), filter 0.3s ease var(--delay)',
        'cursor:inherit',
      ].join(';');

      s._punc = /[''""".,!?;:\-–—()']/.test(ch);
      if (s._punc) {
        s.style.fontSize = '0.6em';
        s.style.transform = 'none';
        s.style.top = '0';
      }

      s._final = isNav ? seededStyle(seed) : randomStyle();
      applyStyle(s, s._final);

      el.appendChild(s);
      el._letters.push(s);
    }

    /* On load, a color sweep runs across the word */
    sweep(el, LOAD_STEPS);

    /* On hover, a shorter sweep that lands back on the same look */
    var target = el.closest('a') || el;
    target.addEventListener('mouseenter', function() {
      sweep(el, HOVER_STEPS);
    });
  });
})();

/* ═══ Mobile Nav Toggle ═══ */
(function() {
  var hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      document.body.classList.toggle('nav-open');
    });
  }

  document.querySelectorAll('.mobile-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      document.body.classList.remove('nav-open');
    });
  });
})();
