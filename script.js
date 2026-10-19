(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // Aleatorio con semilla: la ciudad y las estrellas salen siempre iguales
  function seeded(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function cssVar(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  // --- Tema claro / oscuro (con transición circular si el navegador la soporta) ---
  (function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function label() {
      btn.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    function apply(next) {
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    }
    label();

    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (!document.startViewTransition || reduced) { apply(next); return; }

      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(function () { apply(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 620, easing: 'cubic-bezier(0.2, 0, 0, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
    });

    // Si no ha elegido tema, seguir al sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (err) {}
      if (!stored) { root.dataset.theme = e.matches ? 'light' : 'dark'; label(); }
    });
  })();

  // --- Estrellas pixel (fondo y pantalla del juego) ---
  function sprinkleStars(el, count, seed, maxTop) {
    if (!el) return;
    var rand = seeded(seed);
    var frag = document.createDocumentFragment();
    var plusColors = ['#ffc861', '#b9a6ff', '#ff9ec8'];
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      var kind = rand();
      s.className = 'star' + (kind > 0.93 ? ' plus' : kind > 0.75 ? ' big' : '');
      s.style.left = (rand() * 100).toFixed(2) + '%';
      s.style.top = (rand() * maxTop).toFixed(2) + '%';
      s.style.setProperty('--dur', (2.4 + rand() * 3.6).toFixed(2) + 's');
      s.style.setProperty('--delay', (-rand() * 6).toFixed(2) + 's');
      if (kind > 0.93) s.style.setProperty('--c', plusColors[Math.floor(rand() * plusColors.length)]);
      frag.appendChild(s);
    }
    el.appendChild(frag);
  }
  sprinkleStars(document.getElementById('bg-stars'), 70, 11, 100);
  sprinkleStars(document.getElementById('sky-stars'), 34, 5, 100);

  // --- Ciudad pixel generada en SVG ---
  (function () {
    var svg = document.getElementById('city');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var W = 320, H = 96;
    var rand = seeded(7);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');

    function rect(x, y, w, h, cls) {
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('class', cls);
      return r;
    }

    var frag = document.createDocumentFragment();

    // fila trasera: más baja y clara
    for (var x = -6; x < W;) {
      var w = 14 + Math.floor(rand() * 20);
      var h = 30 + Math.floor(rand() * 40);
      frag.appendChild(rect(x, H - h, w, h, 'b-back'));
      x += w + Math.floor(rand() * 3);
    }

    // fila delantera: con ventanas
    for (x = -4; x < W;) {
      w = 16 + Math.floor(rand() * 22);
      h = 22 + Math.floor(rand() * 46);
      var top = H - h;
      frag.appendChild(rect(x, top, w, h, 'b-front'));
      if (h > 52 && rand() > 0.4) {
        var ax = x + Math.floor(w / 2);
        frag.appendChild(rect(ax, top - 7, 1, 7, 'b-front'));
        frag.appendChild(rect(ax - 0.5, top - 9, 2, 2, 'beacon'));
      }
      for (var wy = top + 4; wy < H - 5; wy += 6) {
        for (var wx = x + 3; wx < x + w - 4; wx += 5) {
          var p = rand();
          if (p < 0.34) {
            var win = rect(wx, wy, 2, 3, 'win' + (p < 0.06 ? ' tw' : ''));
            if (p < 0.06) {
              win.style.setProperty('--delay', (-rand() * 8).toFixed(2) + 's');
              win.style.setProperty('--dur', (4 + rand() * 6).toFixed(2) + 's');
            }
            frag.appendChild(win);
          }
        }
      }
      x += w + 1 + Math.floor(rand() * 4);
    }
    svg.appendChild(frag);
  })();

  // --- Rol con efecto máquina de escribir ---
  (function () {
    var el = document.getElementById('role-text');
    if (!el || reduced) return;
    var roles = ['Data Analyst en Inetum', 'Vibe coder en mis ratos libres', 'Convierto datos en decisiones'];
    var ri = 0;
    var ci = roles[0].length;
    var deleting = true;

    function tick() {
      var full = roles[ri];
      if (deleting) {
        if (ci > 0) {
          ci--;
          el.textContent = full.slice(0, ci);
          setTimeout(tick, 26);
        } else {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(tick, 280);
        }
      } else {
        full = roles[ri];
        if (ci < full.length) {
          ci++;
          el.textContent = full.slice(0, ci);
          setTimeout(tick, 48 + Math.random() * 44);
        } else {
          deleting = true;
          setTimeout(tick, 2400);
        }
      }
    }
    setTimeout(tick, 3000);
  })();

  // --- Aparición al hacer scroll ---
  (function () {
    var els = document.querySelectorAll('[data-reveal], [data-draw]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  // --- Navegación: sombra al bajar, barra de progreso y pastilla activa ---
  (function () {
    var wrap = document.querySelector('.nav-wrap');
    var nav = document.querySelector('.nav');
    var pill = document.querySelector('.nav-pill');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var current = null;
    var ticking = false;

    function setActive(link) {
      if (link === current) return;
      current = link;
      links.forEach(function (l) {
        l.classList.toggle('active', l === link);
        if (l === link) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      if (!link || !link.offsetWidth) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.width = link.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    }

    function update() {
      ticking = false;
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - innerHeight;
      wrap.classList.toggle('scrolled', y > 12);
      nav.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

      // sección activa: la que cruza el 40% superior de la pantalla
      var mark = innerHeight * 0.4;
      var active = null;
      sections.forEach(function (s, i) {
        if (!s) return;
        var r = s.getBoundingClientRect();
        if (r.top <= mark && r.bottom > mark) active = links[i];
      });
      if (y >= max - 4 && links.length) active = links[links.length - 1];
      setActive(active);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', function () { current = null; update(); });
    update();
  })();

  // --- Foco de luz que sigue al cursor en las tarjetas ---
  if (finePointer) {
    document.querySelectorAll('.spot').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // --- Inclinación 3D suave de la tarjeta del juego ---
  (function () {
    var card = document.getElementById('player-card');
    if (!card || reduced || !finePointer) return;
    var MAX = 5;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transitionDuration = '120ms';
      card.style.transform = 'rotateX(' + (-py * MAX * 2).toFixed(2) + 'deg) rotateY(' + (px * MAX * 2).toFixed(2) + 'deg)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transitionDuration = '';
      card.style.transform = '';
    });
  })();

  // --- Confeti pixel ---
  function confetti(originEl, amount) {
    if (reduced) return;
    var r = originEl.getBoundingClientRect();
    var ox = r.left + r.width / 2;
    var oy = r.top + r.height / 2;
    var colors = [cssVar('--violet'), cssVar('--pink'), cssVar('--amber'), cssVar('--teal'), '#ffffff'];
    for (var n = 0; n < (amount || 24); n++) {
      var piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = ox + 'px';
      piece.style.top = oy + 'px';
      piece.style.background = colors[n % colors.length];
      var angle = Math.random() * Math.PI * 2;
      var dist = 70 + Math.random() * 100;
      piece.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
      piece.style.setProperty('--dy', (Math.sin(angle) * dist - 50) + 'px');
      piece.style.setProperty('--rot', (Math.random() * 480 - 240) + 'deg');
      document.body.appendChild(piece);
      setTimeout(piece.remove.bind(piece), 800);
    }
  }

  document.querySelectorAll('[data-confetti]').forEach(function (el) {
    el.addEventListener('click', function () { confetti(el); });
  });

  // --- Toast de logros ---
  var toastTimer;
  function showToast(text) {
    var toast = document.getElementById('toast');
    var txt = document.getElementById('toast-text');
    if (!toast || !txt) return;
    txt.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  // --- Mini juego: Jon salta y gana XP ---
  (function () {
    var screen = document.getElementById('screen');
    var jumper = document.getElementById('jumper');
    var walker = document.querySelector('.walker');
    var xpEl = document.getElementById('xp-value');
    var hint = document.getElementById('press-start');
    var hearts = document.querySelector('.hearts');
    if (!screen || !jumper) return;

    Array.prototype.forEach.call(hearts.children, function (h, i) { h.style.setProperty('--n', i); });

    var xp = 0;
    var jumping = false;
    var achievements = { 10: 'Saltarín profesional · 10 saltos', 30: 'Imparable · 30 saltos', 100: 'Leyenda del salto · 100 saltos' };

    function addXp() {
      xp++;
      xpEl.textContent = String(xp).padStart(4, '0');
      xpEl.classList.remove('pop');
      void xpEl.offsetWidth;
      xpEl.classList.add('pop');

      // "+1 XP" flotando sobre Jon
      var sr = screen.getBoundingClientRect();
      var jr = jumper.getBoundingClientRect();
      var pop = document.createElement('span');
      pop.className = 'xp-pop';
      pop.textContent = '+1 XP';
      pop.style.left = (jr.left - sr.left + jr.width / 2) + 'px';
      pop.style.top = (jr.top - sr.top - 6) + 'px';
      screen.appendChild(pop);
      setTimeout(pop.remove.bind(pop), 950);

      if (achievements[xp]) {
        showToast(achievements[xp]);
        hearts.classList.remove('beat');
        void hearts.offsetWidth;
        hearts.classList.add('beat');
        confetti(jumper, 30);
      }
    }

    screen.addEventListener('click', function () {
      if (hint) hint.classList.add('gone');
      if (jumping) return;
      addXp();
      if (reduced) return;
      jumping = true;
      jumper.classList.add('is-jumping');
      walker.classList.add('jumping');
    });

    jumper.addEventListener('animationend', function (e) {
      if (e.animationName !== 'jump') return;
      jumping = false;
      jumper.classList.remove('is-jumping');
      walker.classList.remove('jumping');
    });
  })();

  // --- Copiar email ---
  (function () {
    var btn = document.getElementById('copy-email');
    if (!btn) return;
    var label = btn.querySelector('.copy-label');
    var status = document.getElementById('copy-status');
    var email = btn.dataset.email;
    var timer;

    function reset() {
      btn.classList.remove('copied', 'error');
      label.textContent = email;
    }

    btn.addEventListener('click', function () {
      clearTimeout(timer);
      var write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(email)
        : Promise.reject(new Error('sin portapapeles'));

      write.then(function () {
        btn.classList.remove('error');
        btn.classList.add('copied');
        label.textContent = '¡Copiado!';
        status.textContent = 'Email copiado al portapapeles';
        confetti(btn);
        timer = setTimeout(reset, 2200);
      }).catch(function () {
        btn.classList.remove('error');
        void btn.offsetWidth;
        btn.classList.add('error');
        status.textContent = 'No se pudo copiar; abriendo tu cliente de correo';
        timer = setTimeout(function () {
          reset();
          window.location.href = 'mailto:' + email;
        }, 450);
      });
    });
  })();

  // --- Año del pie ---
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // --- easter egg ---
  console.log('%c👋 Hola, curioso.', 'font-size:14px;font-weight:600;color:#8b6cff;');
  console.log('Si estás mirando el código, seguramente también te gusta construir cosas. Hablemos: jonrio11@gmail.com');
  console.log('Pista: pulsa a Jon en la pantalla del héroe. Hay logros escondidos.');
})();
