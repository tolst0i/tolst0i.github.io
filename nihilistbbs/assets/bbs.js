/* NIHILISTBBS // EREBOS ENGRAMME INTERFACE // shared runtime */
(function () {
  'use strict';

  // ---------- config ----------
  var SCRIPT = document.currentScript;
  var ASSETS = SCRIPT ? new URL('.', SCRIPT.src).href : '';
  var ROOT = new URL('../', ASSETS).href;            // .../nihilistbbs/
  var AMBIENT_SRC = new URL('ambient.mp3', ASSETS).href;
  var QUOTES = [
    "La presse libre est le quatrième pouvoir. Les trois autres l'ont rachetée."
  ];

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var skip = REDUCED;

  // ---------- utils ----------
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
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
  var store = {
    get: function (k) { try { return sessionStorage.getItem('nbbs.' + k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem('nbbs.' + k, v); } catch (e) {} }
  };

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
        var t = typeof l === 'string' ? l : l.t;
        var c = typeof l === 'string' ? '' : l.c;
        return typeLine(box, t, c);
      }).then(function () { return wait(gap == null ? 140 : gap); });
    });
    return p;
  }
  function enableSkip() {
    function s() { skip = true; }
    document.addEventListener('keydown', s, { once: true });
    document.addEventListener('pointerdown', s, { once: true });
  }

  // ---------- ambient channel ----------
  var Ambient = (function () {
    var audio = null, btns = [], dead = false, armed = false;
    function state() { return store.get('ambient') || 'on'; }
    function paint(s) {
      btns.forEach(function (b) {
        b.dataset.state = s;
        var lbl = b.querySelector('.lbl');
        lbl.textContent = {
          on: 'AMBIENT // ACTIF',
          off: 'AMBIENT // COUPÉ',
          wait: 'AMBIENT // EN ATTENTE',
          dead: 'AMBIENT // HORS LIGNE'
        }[s];
      });
    }
    function ensure() {
      if (audio) return audio;
      audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.55;
      audio.addEventListener('error', function () { dead = true; paint('dead'); });
      audio.src = AMBIENT_SRC;
      var t = parseFloat(store.get('t'));
      if (t > 0) audio.addEventListener('loadedmetadata', function () {
        try { audio.currentTime = t % (audio.duration || Infinity); } catch (e) {}
      }, { once: true });
      setInterval(function () { if (audio && !audio.paused) store.set('t', audio.currentTime); }, 2000);
      window.addEventListener('pagehide', function () { if (audio) store.set('t', audio.currentTime); });
      return audio;
    }
    function play() {
      if (dead) return;
      var a = ensure();
      var pr = a.play();
      if (pr && pr.then) {
        pr.then(function () { paint('on'); }, function () { if (!dead) { paint('wait'); arm(); } });
      } else paint('on');
    }
    function arm() {
      if (armed) return; armed = true;
      function go(e) {
        armed = false;
        document.removeEventListener('pointerdown', go, true);
        document.removeEventListener('keydown', go, true);
        if (e && e.target && e.target.closest && e.target.closest('.ambient')) return;
        if (state() === 'on') play();
      }
      document.addEventListener('pointerdown', go, true);
      document.addEventListener('keydown', go, true);
    }
    function toggle() {
      if (dead) return;
      if (state() === 'on' && audio && !audio.paused) {
        store.set('ambient', 'off'); audio.pause(); paint('off');
      } else {
        store.set('ambient', 'on'); play();
      }
    }
    function mount() {
      btns = Array.prototype.slice.call(document.querySelectorAll('.ambient'));
      if (!btns.length) return;
      btns.forEach(function (b) {
        b.innerHTML = '<i class="led"></i><span class="lbl"></span>';
        b.addEventListener('click', toggle);
      });
      if (state() === 'on') play(); else paint('off');
    }
    return { mount: mount };
  })();

  // ---------- request prompt ----------
  function bindRequest(form) {
    if (!form) return;
    var input = form.querySelector('input');
    var box = form.querySelector('.log');
    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var raw = input.value.trim();
      var slug = slugify(raw);
      box.innerHTML = '';
      if (!slug) {
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
        typeLine(box, 'requête vide // mot-clé requis', 'err');
        input.focus();
        return;
      }
      busy = true;
      var was = skip; skip = false;
      runLog(box, [
        'résolution du canal « ' + slug + ' »',
        { t: 'routing dead mirror', c: '' },
        { t: 'redirection', c: 'ok' }
      ], 90).then(function () {
        skip = was;
        location.href = ROOT + encodeURIComponent(slug) + '/';
      });
    });
  }
  function requestBlock(title) {
    var f = el('form', 'req');
    f.setAttribute('autocomplete', 'off');
    f.innerHTML =
      '<div class="req-head"><b>' + esc(title || '=> REQUÊTE DE CANAL') + '</b><span>TELNET-SHADOW // ENTRÉE</span></div>' +
      '<div class="req-row"><label for="nbbs-q">&gt;</label>' +
      '<input id="nbbs-q" name="q" type="text" spellcheck="false" autocapitalize="off" placeholder="mot-clé du canal" aria-label="Mot-clé du canal">' +
      '<button type="submit">OUVRIR</button></div>' +
      '<div class="log" aria-live="polite"></div>';
    return f;
  }

  // ---------- pages ----------
  function quoteOfDay() {
    var d = Math.floor(Date.now() / 86400000);
    return QUOTES[d % QUOTES.length];
  }

  function landing() {
    var q = $('#motd-text'); if (q) q.textContent = quoteOfDay();
    var slot = $('#req-slot');
    var form = requestBlock();
    slot.appendChild(form);
    bindRequest(form);
    enableSkip();
    runLog($('#boot-log'), [
      'handshake accepted',
      'routing dead mirror',
      { t: 'token incomplete', c: 'warn' },
      'read-only fallback enabled',
      { t: 'en attente d\'un mot-clé de canal', c: 'ok' }
    ]).then(function () {
      $('#boot-log').lastChild.insertAdjacentHTML('beforeend', '<i class="caret"></i>');
      form.querySelector('input').focus({ preventScroll: true });
    });
  }

  function thread() {
    var src = $('#thread');
    var data;
    try { data = JSON.parse(src.textContent); } catch (e) { data = null; }
    var app = $('#app');
    if (!data) { app.innerHTML = '<div class="term pad"><div class="log"><div class="ln err">canal corrompu // données illisibles</div></div></div>'; return; }

    var slug = slugify(data.keyword || '');
    var viewer = data.viewer || 'anonymous';
    document.title = (data.keyword || 'Canal') + ' // NIHILISTBBS';

    // session panel
    var sess = el('div', 'term');
    sess.innerHTML =
      '<div class="strip"><span>EREBOS ENGRAMME INTERFACE // NODE TRIOMPHE-7 // BUILD 3178.04</span><button class="ambient" type="button"></button></div>' +
      '<div class="pad">' +
        '<table class="sess"><tr><td>LOGIN</td><td class="c-t0">' + esc(viewer) + '</td></tr>' +
        '<tr><td>PASSWORD</td><td class="dots">••••••••</td></tr>' +
        '<tr><td>CANAL</td><td class="c-t1">' + esc(slug) + '</td></tr>' +
        '<tr><td>STATUS</td><td class="c-amber v" style="font-weight:bold">' + esc(data.status || 'READ-ONLY // TOKEN INCOMPLET') + '</td></tr></table>' +
        '<div class="log" id="sess-log"></div>' +
      '</div>';
    app.appendChild(sess);

    // board
    var board = el('div', 'term hidden');
    var posts = data.posts || [];
    var first = posts[0], last = posts[posts.length - 1];
    board.innerHTML =
      '<div class="board-bar"><a class="brand" href="' + ROOT + '">NIHILIST<span>BBS</span></a>' +
      '<div class="who">USER <b>' + esc(viewer.toUpperCase()) + '</b><span class="ro">READ-ONLY</span></div></div>' +
      '<div class="thread-head">' +
        '<div class="crumb">bbs.nihilist.triomphe/null / <b>' + esc(slug) + '</b></div>' +
        '<h1>' + (data.tag ? '<span class="tag">[' + esc(data.tag) + ']</span>' : '') + '=&gt; ' + esc(data.title || data.keyword) + '</h1>' +
        '<div class="meta">' + posts.length + ' MESSAGE' + (posts.length > 1 ? 'S' : '') +
          (first ? ' // OUVERT ' + esc(first.date) : '') +
          (last && last !== first ? ' // DERNIER ' + esc(last.date) : '') + '</div>' +
      '</div>' +
      '<div class="posts"></div>' +
      '<div class="thread-foot"><div id="foot-req"></div><a class="back" href="' + ROOT + '">&lt;= RETOUR AU NODE</a></div>';
    app.appendChild(board);

    var list = $('.posts', board);
    var lv = viewer.toLowerCase();
    var nodes = posts.map(function (p) {
      var roleCls = p.role ? ' r-' + p.role : '';
      var mine = String(p.author).toLowerCase() === lv ? ' is-viewer' : '';
      var n = el('article', 'post' + roleCls + mine);
      n.innerHTML =
        '<div class="post-h"><span class="au">' + esc(p.author) +
          (p.badge ? '<span class="badge">[' + esc(p.badge) + ']</span>' : '') + '</span>' +
          '<span class="ts">' + esc(p.date || '') + '</span></div>' +
        '<div class="post-b">' + fmt(p.body || '') + '</div>';
      return n;
    });

    var fr = requestBlock('=> NOUVELLE REQUÊTE');
    $('#foot-req', board).appendChild(fr);
    bindRequest(fr);

    Ambient.mount();
    enableSkip();
    runLog($('#sess-log'), [
      'handshake accepted',
      'routing dead mirror',
      { t: 'token incomplete', c: 'warn' },
      'read-only fallback enabled',
      { t: 'canal « ' + slug + ' » ouvert', c: 'ok' }
    ]).then(function () {
      board.classList.remove('hidden');
      var p = Promise.resolve();
      nodes.forEach(function (n) {
        p = p.then(function () { n.classList.add('in'); list.appendChild(n); return wait(60); });
      });
    });
  }

  function notfound() {
    var parts = location.pathname.split('/').filter(Boolean);
    var i = parts.indexOf('nihilistbbs');
    var slug = parts[i + 1] ? decodeURIComponent(parts[i + 1]) : '';
    var app = $('#app');
    var t = el('div', 'term');
    t.innerHTML =
      '<div class="strip"><span>EREBOS ENGRAMME INTERFACE // NODE TRIOMPHE-7 // BUILD 3178.04</span><button class="ambient" type="button"></button></div>' +
      '<div class="pad"><div class="log" id="nf-log"></div><div id="nf-req"></div>' +
      '<a class="back" href="' + ROOT + '">&lt;= RETOUR AU NODE</a></div>';
    app.appendChild(t);
    var f = requestBlock('=> NOUVELLE REQUÊTE');
    $('#nf-req').appendChild(f);
    bindRequest(f);
    Ambient.mount();
    enableSkip();
    runLog($('#nf-log'), [
      'handshake accepted',
      'résolution du canal « ' + slug + ' »',
      { t: 'aucun canal à ce mot-clé', c: 'err' },
      { t: 'requête journalisée', c: 'warn' }
    ]).then(function () { f.querySelector('input').focus({ preventScroll: true }); });
  }

  // ---------- boot ----------
  function boot() {
    var page = document.body.getAttribute('data-page');
    if (page === 'landing') { Ambient.mount(); landing(); }
    else if (page === 'thread') thread();
    else if (page === 'notfound') notfound();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.NihilistBBS = { slugify: slugify };
})();
