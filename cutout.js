/* ═══ Magazine Cutout / Ransom Note Letter Effect ═══ */
(function() {
  var fonts = [
    "'Boska', Georgia, serif",
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

  document.querySelectorAll('.cutout').forEach(function(el) {
    var text = el.textContent;
    el.innerHTML = '';

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

      var rot, y, fontFamily, color, fontSize, fontWeight, bg;

      if (isNav) {
        rot = seededRange(seed, -5, 5).toFixed(1);
        y = seededRange(seed + 1, -1.5, 1.5).toFixed(1);
        fontFamily = seededPick(seed + 2, fonts);
        color = seededPick(seed + 3, colors);
        fontSize = seededRange(seed + 4, 0.88, 1.18).toFixed(2);
        fontWeight = seededPick(seed + 5, ['400','500','600','700','800']);
        bg = seededPick(seed + 6, bgColors);
      } else {
        rot = rand(-5, 5).toFixed(1);
        y = rand(-1.5, 1.5).toFixed(1);
        fontFamily = pick(fonts);
        color = pick(colors);
        fontSize = rand(0.88, 1.18).toFixed(2);
        fontWeight = pick(['400','500','600','700','800']);
        bg = pick(bgColors);
      }

      var delay = (i * 0.018).toFixed(3);

      var s = document.createElement('span');
      s.textContent = ch;
      s.style.cssText = [
        'display:inline-block',
        'font-family:' + fontFamily,
        'color:' + color,
        'font-size:' + fontSize + 'em',
        'font-weight:' + fontWeight,
        '--rot:' + rot + 'deg',
        '--y:' + y + 'px',
        '--delay:' + delay + 's',
        'transform:rotate(var(--rot)) translateY(var(--y))',
        'position:relative',
        'line-height:1',
        'transition:transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay), filter 0.3s ease var(--delay)',
        'cursor:default',
      ].join(';');

      var isPunc = /[''""".,!?;:\-–—()']/.test(ch);
      if (!isPunc) {
        if (bg) {
          s.style.backgroundColor = bg;
          s.style.padding = '1px 2px';
          s.style.borderRadius = '2px';
        }
      } else {
        s.style.fontSize = '0.6em';
        s.style.transform = 'none';
        s.style.top = '0';
        s.style.color = isNav ? seededPick(seed + 7, colors) : pick(colors);
      }

      el.appendChild(s);
    }
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
