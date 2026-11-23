/* NIHILISTBBS // shared runtime */
(function () {
  'use strict';

  // ---------- config ----------
  var SCRIPT = document.currentScript;
  var ASSETS = SCRIPT ? new URL('.', SCRIPT.src).href : '';
  var ROOT = new URL('../', ASSETS).href;            // .../nihilistbbs/
  var HOST = 'bbs.nihilist.triomphe/null';
  var AMBIENT_SRC = new URL('ambient.mp3', ASSETS).href;
  var AMBIENT_VOL = 0.4;
  var SFX = {
    touch: 'https://files.catbox.moe/mnu2xv.mp3',
    select: 'https://files.catbox.moe/ggrm2i.mp3',
    oops: 'https://files.catbox.moe/n8cd4o.mp3',
    alert: 'https://files.catbox.moe/mcggi1.mp3'
  };
  var QUOTES = [
    "La presse libre est le quatrième pouvoir. Les trois autres l'ont rachetée."
  ];

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && matchMedia('(hover: hover)').matches;
  var skip = REDUCED;

  // ---------- utils ----------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, skip ? 0 : ms); }); }
  function mkStore(kind) {
    return {
      get: function (k) { try { return window[kind].getItem('nbbs.' + k); } catch (e) { return null; } },
      set: function (k, v) { try { window[kind].setItem('nbbs.' + k, v); } catch (e) {} }
    };
  }
  var sess = mkStore('sessionStorage');
  var pref = mkStore('localStorage');

  function slugify(s) {
    return String(s)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/['’`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // post body: blank line = paragraph, newline = <br>, *x* = em, @handle = mention
  function fmt(body) {
    return String(body).split(/\n{2,}/).map(function (p) {
      var h = esc(p)
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/(^|[\s(«])@([\w\-]+)/g, '$1<span class="at">@$2</span>')
        .replace(/\n/g, '<br>');
      return '<p>' + h + '</p>';
    }).join('');
  }

  // ---------- sound effects ----------
  var Sfx = (function () {
    var cache = {}, last = {};
    function muted() { return pref.get('mute') === '1'; }
    function play(n, gap, vol) {
      if (muted() || !SFX[n]) return;
      var t = Date.now();
      if (last[n] && t - last[n] < (gap || 60)) return;
      last[n] = t;
      try {
        if (!cache[n]) { cache[n] = new Audio(SFX[n]); cache[n].preload = 'auto'; }
        var a = cache[n].cloneNode();
        a.volume = vol || 0.55;
        var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
      } catch (e) {}
    }
    function bind(root) {
      $$('.btn, .foot a, .foot button', root).forEach(function (b) {
        if (b.dataset.sfx) return;
        b.dataset.sfx = '1';
        if (FINE) b.addEventListener('mouseenter', function () { play('select', 40, 0.35); });
        b.addEventListener('click', function () { play('touch', 40); });
      });
    }
    return { play: play, bind: bind, muted: muted };
  })();

  // ---------- ambient channel (opt-in, fades) ----------
  var Ambient = (function () {
    var audio = null, dead = false, fadeT = null;
    function on() { return sess.get('ambient') === 'on'; }
    function paint() {
      $$('[data-ambient]').forEach(function (b) {
        var s = dead ? 'dead' : (on() ? 'on' : 'off');
        b.dataset.state = s;
        b.textContent = '[ AMBIENT : ' + { on: 'ON', off: 'OFF', dead: 'HORS LIGNE' }[s] + ' ]';
      });
    }
    function fade(to, ms, done) {
      clearInterval(fadeT);
      var from = audio.volume, steps = Math.max(1, Math.round(ms / 40)), i = 0;
      fadeT = setInterval(function () {
        i++;
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * i / steps));
        if (i >= steps) { clearInterval(fadeT); if (done) done(); }
      }, 40);
    }
    function ensure() {
      if (audio) return audio;
      audio = new Audio();
      audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
      audio.addEventListener('error', function () { dead = true; sess.set('ambient', 'off'); paint(); });
      audio.src = AMBIENT_SRC;
      var t = parseFloat(sess.get('t'));
      if (t > 0) audio.addEventListener('loadedmetadata', function () {
        try { audio.currentTime = t % (audio.duration || Infinity); } catch (e) {}
      }, { once: true });
      setInterval(function () { if (!audio.paused) sess.set('t', audio.currentTime); }, 2000);
      window.addEventListener('pagehide', function () { sess.set('t', audio.currentTime); });
      return audio;
    }
    function start() {
      if (dead) return;
      var a = ensure();
      var pr = a.play();
      var ok = function () { fade(AMBIENT_VOL, 900); };
      if (pr && pr.then) pr.then(ok, function () { arm(); }); else ok();
    }
    function arm() {
      function go() {
        document.removeEventListener('pointerdown', go, true);
        document.removeEventListener('keydown', go, true);
        if (on()) start();
      }
      document.addEventListener('pointerdown', go, true);
      document.addEventListener('keydown', go, true);
    }
    function toggle() {
      if (dead) return;
      if (on()) {
        sess.set('ambient', 'off');
        if (audio) fade(0, 500, function () { if (!on()) audio.pause(); });
      } else {
        sess.set('ambient', 'on');
        start();
      }
      paint();
    }
    function mount() {
      $$('[data-ambient]').forEach(function (b) { b.addEventListener('click', toggle); });
      paint();
      try {
        fetch(AMBIENT_SRC, { method: 'HEAD' }).then(function (r) {
          if (!r.ok) { dead = true; sess.set('ambient', 'off'); paint(); }
        }, function () {});
      } catch (e) {}
      if (on()) start();
    }
    return { mount: mount };
  })();

  function footer(withBack) {
    var f = el('div', 'foot');
    f.innerHTML =
      (withBack ? '<a href="' + ROOT + '">&lt;= RETOUR AU NODE</a><span class="sep">·</span>' : '') +
      '<button type="button" data-sfxtoggle></button><span class="sep">·</span>' +
      '<button type="button" data-ambient></button>';
    var s = $('[data-sfxtoggle]', f);
    function paint() {
      var m = Sfx.muted();
      s.dataset.state = m ? 'off' : 'on';
      s.textContent = '[ SON : ' + (m ? 'OFF' : 'ON') + ' ]';
    }
    s.addEventListener('click', function () { pref.set('mute', Sfx.muted() ? '0' : '1'); paint(); });
    paint();
    return f;
  }

  // ---------- typed log ----------
  function typeLine(box, text, cls) {
    var ln = el('div', 'ln' + (cls ? ' ' + cls : ''));
    box.appendChild(ln);
    if (skip) { ln.textContent = text; return Promise.resolve(); }
    return new Promise(function (res) {
      var i = 0;
      (function tick() {
        if (skip) { ln.textContent = text; return res(); }
        i += 2;
        ln.textContent = text.slice(0, i);
        if (i >= text.length) return res();
        setTimeout(tick, 14);
      })();
    });
  }
  function runLog(box, lines, gap) {
    var p = Promise.resolve();
    lines.forEach(function (l) {
      p = p.then(function () {
        return typeof l === 'string' ? typeLine(box, l) : typeLine(box, l.t, l.c);
      }).then(function () { return wait(gap == null ? 140 : gap); });
    });
    return p;
  }
  function enableSkip() {
    function s() { skip = true; }
    document.addEventListener('keydown', s, { once: true });
    document.addEventListener('pointerdown', s, { once: true });
  }
  var HANDSHAKE = [
    'handshake accepted',
    'routing dead mirror',
    { t: 'token incomplete', c: 'warn' },
    'read-only fallback enabled'
  ];

  // ---------- request prompt ----------
  function requestBlock(label) {
    var f = el('form', 'req');
    f.setAttribute('autocomplete', 'off');
    f.innerHTML =
      '<div class="req-l">' + esc(label || 'MOT-CLÉ DU CANAL') + '</div>' +
      '<label class="req-in"><span>&gt;</span>' +
      '<input name="q" type="text" spellcheck="false" autocapitalize="off" aria-label="Mot-clé du canal"></label><br>' +
      '<button class="btn" type="submit">[ OUVRIR ]</button>' +
      '<div class="log" aria-live="polite"></div>';
    var input = $('input', f), box = $('.log', f), busy = false;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var slug = slugify(input.value.trim());
      box.innerHTML = '';
      if (!slug) {
        f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
        Sfx.play('oops', 300);
        typeLine(box, 'requête vide', 'err');
        input.focus();
        return;
      }
      busy = true;
      var was = skip; skip = false;
      runLog(box, ['résolution « ' + slug + ' »', { t: 'connexion', c: 'ok' }], 120).then(function () {
        skip = was;
        location.href = ROOT + encodeURIComponent(slug) + '/';
      });
    });
    return f;
  }

  function win(bar, inner) {
    var w = el('div', 'win');
    w.innerHTML = '<div class="bar">' + bar + '</div><div class="scr">' + inner + '</div>';
    return w;
  }

  // ---------- pages ----------
  function landing() {
    var app = $('#app');
    var d = Math.floor(Date.now() / 86400000);
    var w = win('NIHILISTBBS // TELNET-SHADOW',
      '<div class="log" id="boot"></div>' +
      '<hr class="rule">' +
      '<div class="logo"><span class="l1">NIHILIST</span><span class="l2">BULLETIN BOARD SYSTEM</span></div>' +
      '<div class="host">hôte <b>' + esc(HOST) + '</b></div>' +
      '<hr class="rule">' +
      '<p class="motd"><span class="lbl">QUOTE OF THE DAY</span>' + esc(QUOTES[d % QUOTES.length]) + '</p>' +
      '<hr class="rule">' +
      '<div id="req"></div>');
    app.appendChild(w);
    var f = requestBlock();
    $('#req', w).appendChild(f);
    $('.scr', w).appendChild(footer(false));
    Sfx.bind(w); Ambient.mount(); enableSkip();
    runLog($('#boot', w), HANDSHAKE.concat([{ t: 'en attente d\'un mot-clé', c: 'ok' }])).then(function () {
      $('#boot', w).lastChild.insertAdjacentHTML('beforeend', '<i class="caret"></i>');
      $('input', f).focus({ preventScroll: true });
    });
  }

  function thread() {
    var app = $('#app');
    var data;
    try { data = JSON.parse($('#thread').textContent); } catch (e) { data = null; }
    if (!data) {
      app.appendChild(win('NIHILISTBBS', '<div class="log"><div class="ln err">canal corrompu</div></div>'));
      return;
    }
    var slug = slugify(data.keyword || '');
    var viewer = data.viewer || 'anonymous';
    var posts = data.posts || [];
    var first = posts[0], last = posts[posts.length - 1];
    document.title = (data.keyword || 'Canal') + ' // NIHILISTBBS';

    var w = win('NIHILISTBBS // ' + esc(slug),
      '<div class="kv">' +
        '<div><b>LOGIN</b><span class="v">' + esc(viewer) + '</span></div>' +
        '<div><b>PASSWORD</b><span class="dots">••••••••</span></div>' +
        '<div><b>STATUS</b><span class="y">' + esc(data.status || 'READ-ONLY') + '</span></div>' +
      '</div>' +
      '<div class="log" id="slog" style="margin-top:10px"></div>' +
      '<div id="tb" class="hidden">' +
        '<hr class="rule">' +
        '<h1 class="t-title">' + (data.tag ? '<span class="t-tag">[' + esc(data.tag) + ']</span>' : '') + esc(data.title || data.keyword) + '</h1>' +
        '<div class="t-meta">' + posts.length + ' MSG' +
          (first ? ' · ' + esc(first.date) : '') + (last && last !== first ? ' → ' + esc(last.date) : '') + '</div>' +
        '<hr class="rule">' +
        '<div class="board" tabindex="0" aria-label="Messages"></div>' +
        '<hr class="rule">' +
        '<div id="req"></div>' +
      '</div>');
    app.appendChild(w);

    var board = $('.board', w);
    var lv = viewer.toLowerCase();
    var n = posts.length;
    var nodes = posts.map(function (p, i) {
      var cls = 'msg' + (p.role ? ' r-' + p.role : '') + (String(p.author).toLowerCase() === lv ? ' is-viewer' : '');
      var m = el('article', cls);
      m.innerHTML =
        '<div class="msg-n">MSG ' + pad(i + 1) + '/' + pad(n) + '</div>' +
        '<div class="msg-m"><div><b>DE</b><span class="au">' + esc(p.author) + '</span>' +
          (p.badge ? '<span class="badge">[' + esc(p.badge) + ']</span>' : '') + '</div>' +
        '<div><b>DATE</b><span class="ts">' + esc(p.date || '') + '</span></div></div>' +
        '<div class="msg-b">' + fmt(p.body || '') + '</div>';
      return m;
    });

    $('#req', w).appendChild(requestBlock('NOUVELLE REQUÊTE'));
    $('.scr', w).appendChild(footer(true));
    Sfx.bind(w); Ambient.mount(); enableSkip();

    runLog($('#slog', w), HANDSHAKE.concat([{ t: 'canal « ' + slug + ' » ouvert', c: 'ok' }])).then(function () {
      $('#tb', w).classList.remove('hidden');
      var p = Promise.resolve();
      nodes.forEach(function (m) {
        p = p.then(function () { m.classList.add('in'); board.appendChild(m); return wait(50); });
      });
    });
  }

  function notfound() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('nihilistbbs');
    var slug = parts[i + 1] ? decodeURIComponent(parts[i + 1]) : '';
    var w = win('NIHILISTBBS // TELNET-SHADOW', '<div class="log" id="nlog"></div><hr class="rule"><div id="req"></div>');
    $('#app').appendChild(w);
    var f = requestBlock('NOUVELLE REQUÊTE');
    $('#req', w).appendChild(f);
    $('.scr', w).appendChild(footer(true));
    Sfx.bind(w); Ambient.mount(); enableSkip();
    Sfx.play('alert', 900);
    runLog($('#nlog', w), [
      'handshake accepted',
      'résolution « ' + slug + ' »',
      { t: 'aucun canal à ce mot-clé', c: 'err' },
      { t: 'requête journalisée', c: 'warn' }
    ]).then(function () { $('input', f).focus({ preventScroll: true }); });
  }

  // ---------- boot ----------
  function boot() {
    var page = document.body.getAttribute('data-page');
    if (page === 'landing') landing();
    else if (page === 'thread') thread();
    else if (page === 'notfound') notfound();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.NihilistBBS = { slugify: slugify };
})();
