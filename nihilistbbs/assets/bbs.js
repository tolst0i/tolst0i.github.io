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
      $$('.btn, .chk, .back', root).forEach(function (b) {
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
        b.dataset.state = dead ? 'dead' : (on() ? 'on' : 'off');
        var em = b.querySelector('em'); if (em) em.textContent = dead ? 'hors ligne' : '';
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

  function settings(withBack) {
    var f = el('div', 'set');
    f.innerHTML =
      '<button type="button" class="chk" data-sfxtoggle><span>Effets sonores</span><i></i></button>' +
      '<button type="button" class="chk" data-ambient><span>Ambiance<em></em></span><i></i></button>' +
      (withBack ? '<a class="back" href="' + ROOT + '">&lt; Retour au node</a>' : '');
    var s = $('[data-sfxtoggle]', f);
    function paint() { s.dataset.state = Sfx.muted() ? 'off' : 'on'; }
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
  function requestBlock() {
    var f = el('form', 'req');
    f.setAttribute('autocomplete', 'off');
    f.innerHTML =
      '<label class="opt"><span class="t">(Canal)</span>' +
      '<input name="q" type="text" spellcheck="false" autocapitalize="off" placeholder="mot-clé" aria-label="Mot-clé du canal"></label>' +
      '<div class="btns"><button class="btn" type="submit">Ouvrir</button></div>' +
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

  function win(head, sub, inner) {
    var w = el('div', 'win');
    w.innerHTML = '<div class="in"><div class="head"><h1>' + head + '</h1>' +
      (sub ? '<small>' + sub + '</small>' : '') + '</div>' + inner + '</div>';
    return w;
  }

  var BANNER = [
    ' _  _ ___ _  _ ___ _    ___ ___ _____ ',
    '| \\| |_ _| || |_ _| |  |_ _/ __|_   _|',
    '| .` || || __ || || |__ | |\\__ \\ | |  ',
    '|_|\\_|___|_||_|___|____|___|___/ |_|  '
  ].join('\n');

  // ---------- pages ----------
  function landing() {
    var d = Math.floor(Date.now() / 86400000);
    var w = win('NihilistBBS', esc(HOST) + ' // TELNET-SHADOW',
      '<div class="body">' +
        '<div class="log" id="boot"></div>' +
        '<hr class="sep">' +
        '<pre class="ascii">' + esc(BANNER) + '</pre>' +
        '<div class="ascii-sub">BULLETIN BOARD SYSTEM</div>' +
        '<hr class="sep">' +
        '<div class="spk"><div class="nm">Quote of the day</div><p>' + esc(QUOTES[d % QUOTES.length]) + '</p></div>' +
        '<div class="opts" id="req"></div>' +
      '</div>');
    $('#app').appendChild(w);
    var f = requestBlock();
    $('#req', w).appendChild(f);
    $('.body', w).appendChild(settings(false));
    Sfx.bind(w); Ambient.mount(); enableSkip();
    runLog($('#boot', w), HANDSHAKE.concat([{ t: 'en attente d\'un mot-clé', c: 'ok' }])).then(function () {
      $('#boot', w).lastChild.insertAdjacentHTML('beforeend', '<i class="caret"></i>');
      $('input', f).focus({ preventScroll: true });
    });
  }

  function chatBody(body) {
    return String(body).split(/\n{2,}/).map(function (p) {
      return esc(p)
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/(^|[\s(«])@([\w\-]+)/g, '$1<span class="at">@$2</span>')
        .replace(/\n/g, '<br>');
    }).join('<span class="pb"></span>');
  }
  function prefix(role) { return role === 'admin' ? '@' : role === 'press' ? '+' : ''; }

  function thread() {
    var data;
    try { data = JSON.parse($('#thread').textContent); } catch (e) { data = null; }
    if (!data) {
      $('#app').appendChild(win('NihilistBBS', '', '<div class="body"><div class="log"><div class="ln err">canal corrompu</div></div></div>'));
      return;
    }
    var slug = slugify(data.keyword || '');
    var viewer = data.viewer || 'anonymous';
    var posts = data.posts || [];
    document.title = '#' + slug + ' // NIHILISTBBS';

    var seen = {}, people = [];
    posts.forEach(function (p) {
      var k = String(p.author).toLowerCase();
      if (!seen[k]) { seen[k] = 1; people.push(p); }
    });
    if (!seen[viewer.toLowerCase()]) people.push({ author: viewer });
    var who = people.map(function (p) {
      var c = p.role === 'admin' ? 'op' : p.role === 'press' ? 'vo' : '';
      return '<span class="' + c + '">' + prefix(p.role) + esc(p.author) + '</span>';
    }).join(' ');

    var w = win('#' + esc(slug), esc(HOST),
      '<div class="body">' +
        '<div class="log" id="slog"></div>' +
      '</div>' +
      '<div id="tb" class="hidden">' +
        '<div class="topic"><b>Sujet :</b> ' + (data.tag ? '<span class="tg">(' + esc(data.tag) + ')</span> ' : '') +
          '<span class="tt">' + esc(data.title || data.keyword) + '</span></div>' +
        '<div class="who">Participants (' + people.length + ') : ' + who + '</div>' +
        '<div class="chat" tabindex="0" aria-label="Messages"></div>' +
        '<div class="body" id="foot"><div id="req"></div></div>' +
      '</div>');
    $('#app').appendChild(w);

    var chat = $('.chat', w);
    var lv = viewer.toLowerCase();
    var nodes = [], lastDay = null;
    nodes.push(el('div', 'sys', '*** <b>' + esc(viewer) + '</b> a rejoint #' + esc(slug) + ' (lecture seule)'));
    posts.forEach(function (p) {
      var parts = String(p.date || '').split(/\s*·\s*/);
      var day = parts[0] || '', time = parts[1] || '';
      if (day && day !== lastDay) { nodes.push(el('div', 'sys day', '--- ' + esc(day) + ' ---')); lastDay = day; }
      var cls = 'm' + (p.role ? ' r-' + p.role : '') + (String(p.author).toLowerCase() === lv ? ' is-viewer' : '');
      nodes.push(el('p', cls,
        '<span class="ts">[' + esc(time) + ']</span>' +
        '<span class="nk">' + prefix(p.role) + esc(p.author) + '</span>' +
        (p.badge ? '<span class="bd">(' + esc(p.badge) + ')</span>' : '') + ' ' +
        '<span class="tx">' + chatBody(p.body || '') + '</span>'));
    });

    $('#req', w).appendChild(requestBlock());
    $('#foot', w).appendChild(settings(true));
    Sfx.bind(w); Ambient.mount(); enableSkip();

    runLog($('#slog', w), [
      'login ' + viewer + ' / ••••••••',
      { t: data.status || 'read-only', c: 'warn' }
    ].concat(HANDSHAKE, [{ t: 'canal #' + slug + ' ouvert', c: 'ok' }])).then(function () {
      $('#tb', w).classList.remove('hidden');
      var p = Promise.resolve();
      nodes.forEach(function (m) {
        p = p.then(function () { m.classList.add('fx'); chat.appendChild(m); return wait(40); });
      });
    });
  }

  function notfound() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('nihilistbbs');
    var slug = parts[i + 1] ? decodeURIComponent(parts[i + 1]) : '';
    var w = win('NihilistBBS', esc(HOST) + ' // TELNET-SHADOW',
      '<div class="body"><div class="log" id="nlog"></div><div class="opts" id="req"></div></div>');
    $('#app').appendChild(w);
    var f = requestBlock();
    $('#req', w).appendChild(f);
    $('.body', w).appendChild(settings(true));
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
