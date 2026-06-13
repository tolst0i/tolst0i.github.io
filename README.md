<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PLUME · LIGHT</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg0:#0a0c10; --bg1:#0e1117; --bg2:#141821; --bg3:#1b2029;
    --line:#222a36; --line2:#2e3744;
    --text:#e7eaf0; --muted:#79828f;
    --accent:#f5e003; --accent-dim:rgba(245,224,3,.10); --accent-ink:#1a1800;
    --steel:#56b0c2; --steel-dim:rgba(86,176,194,.10);
    --red:#ff5c5c;
    --disp:"Chakra Petch", "Segoe UI", system-ui, sans-serif;
    --ui:"Inter", -apple-system, system-ui, sans-serif;
    --mono:"JetBrains Mono", "Courier New", monospace;
    --shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px -12px rgba(0,0,0,.8);
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body {
    font-family:var(--ui); background:var(--bg0); color:var(--text);
    display:flex; flex-direction:column; overflow:hidden;
    background-image:
      radial-gradient(900px 500px at 88% -8%, rgba(245,224,3,.05), transparent 55%),
      radial-gradient(900px 600px at -6% 108%, rgba(86,176,194,.05), transparent 55%);
  }
  ::selection { background:var(--accent); color:var(--accent-ink); }

  /* corner-bracket signature */
  .brk { position:relative; }
  .brk::before, .brk::after {
    content:""; position:absolute; width:7px; height:7px; pointer-events:none;
    border-color:var(--accent); opacity:.85;
  }
  .brk::before { top:-1px; left:-1px; border-top:1.5px solid; border-left:1.5px solid; }
  .brk::after  { bottom:-1px; right:-1px; border-bottom:1.5px solid; border-right:1.5px solid; }

  button {
    background:var(--bg2); color:var(--text);
    border:1px solid var(--line); border-radius:6px;
    padding:7px 12px; cursor:pointer; font-size:12px; font-family:var(--ui);
    transition:border-color .15s, background .15s, color .15s;
  }
  button:hover { border-color:var(--line2); background:var(--bg3); }
  button.primary {
    background:var(--accent); border-color:var(--accent); color:var(--accent-ink);
    font-weight:600; font-family:var(--disp); letter-spacing:.5px;
  }
  button.primary:hover { filter:brightness(1.06); }
  button:disabled { opacity:.4; cursor:default; }
  input,select,textarea { font-family:inherit; }

  .lab { font-family:var(--disp); text-transform:uppercase; letter-spacing:2px; }

  /* ---------- Toolbar ---------- */
  .toolbar { background:var(--bg1); padding:9px 14px; display:flex; gap:10px; align-items:center; flex-shrink:0; position:relative; z-index:5; }
  .toolbar::after { content:""; position:absolute; left:0; right:0; bottom:0; height:1px; background:linear-gradient(90deg, transparent, var(--line2) 12%, var(--line2) 88%, transparent); }
  .wordmark { font-family:var(--disp); font-weight:700; font-size:17px; letter-spacing:2px; color:var(--text); user-select:none; cursor:default; line-height:1; }
  .wordmark b { color:var(--accent); }
  .wordmark small { color:var(--muted); letter-spacing:2px; font-weight:500; font-size:8px; display:block; margin-top:3px; font-family:var(--mono); }
  .mode-switch { display:flex; border:1px solid var(--line); border-radius:7px; overflow:hidden; }
  .mode-switch button { border:none; border-radius:0; padding:7px 14px; background:transparent; color:var(--muted); font-family:var(--disp); text-transform:uppercase; letter-spacing:1.5px; font-size:11px; }
  .mode-switch button.active { background:var(--accent-dim); color:var(--accent); }
  .mode-switch button:hover { background:var(--bg3); }
  .icon-btn { width:34px; padding:7px 0; text-align:center; }
  .title-block { display:flex; flex-direction:column; margin-right:auto; gap:1px; }
  .doc-title { font-size:14px; font-weight:600; background:transparent; border:none; color:var(--text); outline:none; width:240px; caret-color:var(--accent); }
  .doc-author { font-size:11px; color:var(--muted); background:transparent; border:none; outline:none; width:240px; caret-color:var(--accent); }
  .savedot { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--muted); margin-right:4px; font-family:var(--mono); text-transform:uppercase; letter-spacing:1px; }
  .savedot i { width:7px; height:7px; border-radius:50%; background:var(--muted); display:inline-block; transition:all .3s; }
  .savedot.ok i { background:#4ad07a; box-shadow:0 0 7px #4ad07a; }
  .savedot.dirty i { background:var(--accent); box-shadow:0 0 7px var(--accent); }
  #sprintBadge { display:none; align-items:center; gap:7px; font-family:var(--mono); font-size:13px; color:var(--accent); margin-right:4px; }
  #sprintBadge .lab { font-size:9px; letter-spacing:2px; }
  #sprintBadge button { padding:2px 8px; font-size:10px; color:var(--accent); border-color:var(--line2); }

  /* ---------- Layout ---------- */
  .main { flex:1; display:flex; min-height:0; }

  /* ---------- Sidebar ---------- */
  .sidebar { width:236px; flex-shrink:0; background:var(--bg1); border-right:1px solid var(--line); overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:18px; transition:margin .2s; }
  body.no-left .sidebar { margin-left:-236px; }
  .side-h { font-family:var(--disp); font-size:10px; letter-spacing:2.5px; color:var(--muted); text-transform:uppercase; border-bottom:1px solid var(--line); padding-bottom:5px; margin-bottom:8px; display:flex; align-items:center; gap:7px; }
  .side-h::before { content:""; width:5px; height:5px; background:var(--accent); display:inline-block; }
  .scene-rail { display:flex; flex-direction:column; gap:1px; }
  .scene-item { display:flex; gap:9px; align-items:baseline; padding:6px 7px; cursor:pointer; font-size:12px; color:var(--text); border-radius:5px; border-left:2px solid transparent; }
  .scene-item:hover { background:var(--bg2); border-left-color:var(--accent); }
  .scene-item .num { font-family:var(--mono); color:var(--accent); font-size:11px; min-width:18px; }
  .scene-item .slug { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .char-item { display:flex; justify-content:space-between; font-size:12px; padding:4px 7px; }
  .char-item span:last-child { color:var(--muted); font-size:11px; font-family:var(--mono); }
  body[data-mode="forum"] #charBlock, body[data-mode="forum"] #railBlock { display:none; }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
  .stat { background:var(--bg2); border:1px solid var(--line); border-radius:7px; padding:9px 10px; box-shadow:var(--shadow); }
  .stat .v { font-size:18px; font-weight:600; font-family:var(--mono); color:var(--text); }
  .stat .l { font-size:9px; color:var(--muted); margin-top:3px; text-transform:uppercase; letter-spacing:1.2px; font-family:var(--disp); }
  .sprint-row { display:flex; gap:7px; align-items:center; }
  #sprintClock { font-family:var(--mono); font-size:15px; color:var(--accent); }
  .sprint-done { font-size:12px; color:var(--accent); margin-top:7px; font-family:var(--mono); }
  .side-note { font-size:11px; color:var(--muted); line-height:1.5; margin-bottom:9px; }

  /* ---------- Center ---------- */
  .center { flex:1; display:flex; flex-direction:column; min-width:0; }
  .typebar { background:var(--bg1); border-bottom:1px solid var(--line); padding:7px 14px; display:flex; gap:6px; font-size:12px; align-items:center; flex-wrap:wrap; flex-shrink:0; }
  .typebar button { padding:6px 11px; font-family:var(--disp); text-transform:uppercase; letter-spacing:1px; font-size:11px; }
  .typebar button.active { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
  .typebar .spacer { margin-left:auto; color:var(--muted); font-size:10px; font-family:var(--mono); letter-spacing:1px; }
  #scriptBar { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  body[data-mode="forum"] #scriptBar { display:none; }
  body[data-mode="script"] #bbBar { display:none; }

  /* bbcode toolbar */
  #bbBar { display:flex; gap:4px; flex-wrap:wrap; align-items:center; }
  #bbBar button { padding:6px 9px; min-width:32px; font-size:13px; }
  #bbBar .sep { width:1px; height:20px; background:var(--line); margin:0 4px; }
  #bbBar .bbcolor { width:30px; height:30px; padding:0; border:1px solid var(--line); border-radius:6px; background:transparent; cursor:pointer; }
  #bbBar button b { font-weight:700; }
  #bbBar button i { font-style:italic; }
  #bbBar button u { text-decoration:underline; }
  #bbBar button s { text-decoration:line-through; }
  #previewToggle.active { background:var(--steel-dim); border-color:var(--steel); color:var(--steel); }

  .editor-wrap { flex:1; overflow:auto; display:flex; justify-content:center; align-items:flex-start; padding:30px 18px 140px; }

  /* script page */
  body[data-mode="script"] #editor {
    background:#f5f6f2; color:#14150f; width:8.5in; min-height:11in; height:auto; flex-shrink:0;
    padding:1in 1in 1in 1.5in; font-family:"Courier New", Courier, monospace; font-size:12pt; line-height:1.05;
    box-shadow:0 10px 50px -16px rgba(0,0,0,.8), 0 0 0 1px var(--line); outline:none; border-radius:2px;
  }
  body[data-mode="script"] .scene { text-transform:uppercase; font-weight:bold; margin:24px 0 12px; }
  body[data-mode="script"] .action { margin:0 0 12px; }
  body[data-mode="script"] .character { text-transform:uppercase; margin:12px 0 0; margin-left:2.2in; }
  body[data-mode="script"] .paren { margin:0; margin-left:2in; margin-right:1.5in; }
  body[data-mode="script"] .paren:not(:empty)::before { content:"("; }
  body[data-mode="script"] .paren:not(:empty)::after { content:")"; }
  body[data-mode="script"] .dialogue { margin:0 0 12px; margin-left:1.5in; margin-right:1in; }
  body[data-mode="script"] .transition { text-transform:uppercase; text-align:right; margin:12px 0; }
  body[data-mode="script"] #editor > div:empty::before { content:attr(data-placeholder); color:#b8b9b0; }
  body[data-mode="script"] #editor > div.flash { background:#fbf4cf; transition:background 1.2s; }
  body[data-mode="forum"] #editor { display:none; }

  /* forum phpbb editor */
  #forumWrap { display:none; width:880px; max-width:100%; flex-shrink:0; flex-direction:column; gap:0; }
  body[data-mode="forum"] #forumWrap { display:flex; }
  .forum-split { display:flex; gap:16px; align-items:stretch; }
  .forum-split.no-preview #bbPreview { display:none; }
  .forum-pane { flex:1; min-width:0; display:flex; flex-direction:column; }
  .pane-tag { font-family:var(--disp); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; display:flex; align-items:center; gap:6px; }
  .pane-tag::before { content:""; width:4px; height:4px; background:var(--steel); }
  #bbSource {
    flex:1; min-height:520px; background:var(--bg1); color:#cfd6e4; border:1px solid var(--line); border-radius:8px;
    padding:18px 20px; font-family:var(--mono); font-size:13px; line-height:1.7; resize:none; outline:none; box-shadow:var(--shadow);
  }
  #bbSource:focus { border-color:var(--line2); }
  #bbPreview {
    flex:1; min-height:520px; overflow:auto; background:linear-gradient(180deg,#0f131c,#0c0f16); color:#d9deea;
    border:1px solid var(--steel-dim); border-radius:8px; padding:24px 26px;
    font-family:Georgia, "Times New Roman", serif; font-size:15px; line-height:1.8; box-shadow:var(--shadow);
  }
  #bbPreview p { margin:0 0 14px; }
  #bbPreview blockquote { border-left:2px solid var(--steel); padding:6px 14px; margin:0 0 14px; color:#aeb6c6; background:rgba(86,176,194,.05); border-radius:0 6px 6px 0; }
  #bbPreview pre { background:var(--bg0); border:1px solid var(--line); border-radius:6px; padding:10px 12px; font-family:var(--mono); font-size:12px; overflow:auto; margin:0 0 14px; color:#cfd6e4; }
  #bbPreview .spoiler { background:var(--bg2); border:1px dashed var(--line2); border-radius:6px; padding:8px 12px; color:var(--muted); margin:0 0 14px; }
  #bbPreview img { max-width:100%; border-radius:6px; }
  #bbPreview ul { margin:0 0 14px 18px; }
  #bbPreview a { color:var(--steel); }

  #suggest { position:fixed; z-index:60; display:none; background:var(--bg1); border:1px solid var(--line2); border-radius:7px; box-shadow:var(--shadow); padding:4px; gap:4px; flex-wrap:wrap; max-width:380px; }
  #suggest button { padding:4px 9px; font-size:12px; font-family:var(--mono); }

  /* ---------- AI panel ---------- */

  /* ---------- Modals ---------- */
  .modal { display:none; position:fixed; inset:0; background:rgba(4,5,8,.78); backdrop-filter:blur(2px); z-index:100; align-items:center; justify-content:center; }
  .modal.open { display:flex; }
  .modal-box { background:var(--bg1); border:1px solid var(--line2); border-radius:10px; width:700px; max-width:92vw; max-height:84vh; display:flex; flex-direction:column; padding:18px; box-shadow:0 30px 80px -20px rgba(0,0,0,.9); }
  .modal-box h3 { font-size:12px; margin-bottom:12px; display:flex; align-items:center; font-family:var(--disp); letter-spacing:2px; text-transform:uppercase; color:var(--text); }
  .modal-box h3 button { margin-left:auto; }
  .io-tabs { display:flex; gap:7px; margin-bottom:12px; }
  .io-tabs button { font-family:var(--disp); text-transform:uppercase; letter-spacing:1px; font-size:11px; }
  .io-tabs button.active { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
  #ioArea { flex:1; min-height:300px; background:var(--bg0); color:var(--text); border:1px solid var(--line); border-radius:7px; padding:12px; font-family:var(--mono); font-size:12px; resize:vertical; outline:none; white-space:pre; overflow:auto; }
  .io-actions { display:flex; gap:8px; margin-top:12px; justify-content:flex-end; flex-wrap:wrap; }
  .help-body { overflow-y:auto; font-size:13px; line-height:1.7; }
  .help-body h4 { margin:14px 0 4px; font-size:10px; color:var(--accent); letter-spacing:2px; font-family:var(--disp); text-transform:uppercase; }
  .help-body kbd { background:var(--bg2); border:1px solid var(--line); border-radius:4px; padding:1px 6px; font-size:11px; font-family:var(--mono); }
  .help-body p { margin-bottom:5px; color:var(--text); }
  .help-body p b { color:var(--accent); font-weight:600; }

  #titlePage { display:none; }

  /* ---------- Print ---------- */
  @media print {
    @page { size:letter; margin:1in 1in 1in 1.5in; }
    body { display:block; height:auto; overflow:visible; background:#fff; background-image:none; }
    .toolbar, .typebar, .sidebar, .modal, #suggest, #bbSource, .pane-tag { display:none !important; }
    .main, .center { display:block; height:auto; overflow:visible; }
    .editor-wrap { display:block; overflow:visible; padding:0; }
    body[data-mode="script"] #editor { box-shadow:none !important; width:auto !important; min-height:0 !important; padding:0 !important; margin:0 !important; background:#fff !important; }
    body[data-mode="script"] #titlePage { display:flex !important; flex-direction:column; align-items:center; justify-content:center; height:8.5in; font-family:"Courier New", monospace; color:#111; page-break-after:always; text-align:center; }
    #titlePage .tp-title { font-size:18pt; font-weight:bold; text-transform:uppercase; letter-spacing:2px; }
    #titlePage .tp-by { margin-top:24pt; font-size:12pt; }
    .scene, .character { page-break-after:avoid; }
    body[data-mode="forum"] #forumWrap { display:block !important; width:auto !important; }
    body[data-mode="forum"] .forum-split { display:block !important; }
    body[data-mode="forum"] #bbPreview { display:block !important; min-height:0 !important; border:none !important; box-shadow:none !important; background:#fff !important; color:#111 !important; padding:0 !important; }
    body[data-mode="forum"] #bbPreview blockquote { color:#444 !important; background:#f4f4f4 !important; }
  }

  @media (max-width:1240px) { #forumWrap { width:100%; } .forum-split { flex-direction:column; } #bbSource,#bbPreview { min-height:300px; } }
  @media (max-width:1150px) {
    .sidebar { position:absolute; z-index:40; height:calc(100% - 92px); bottom:0; }
  }
</style>
</head>
<body data-mode="script">

<div class="toolbar">
  <div class="wordmark">PLUME<b>·</b>LIGHT<small>LOCAL BUILD</small></div>
  <div class="mode-switch hide-focus">
    <button id="msScript" class="active" onclick="switchMode('script')" data-snd="select">Script</button>
    <button id="msForum" onclick="switchMode('forum')" data-snd="select">Forum</button>
  </div>
  <button class="hide-focus icon-btn" onclick="toggle('no-left')" title="Stats & sprint">☰</button>
  <div class="title-block">
    <input class="doc-title" id="docTitle" value="SANS TITRE" />
    <input class="doc-author" id="docAuthor" value="par Anonyme" />
  </div>
  <span class="savedot" id="saveDot"><i></i><span id="saveTxt">—</span></span>
  <span id="sprintBadge"><span class="lab">Sprint</span><span id="sprintClockTop">0:00</span><button onclick="stopSprint()" data-snd="boing">stop</button></span>
  <button class="hide-focus" onclick="openHelp()" data-snd="oops">Aide</button>
  <button class="hide-focus icon-btn" id="muteBtn" onclick="toggleMute()" title="Son">🔊</button>
  <button class="hide-focus" onclick="openIO('export')" id="ioBtn" data-snd="oops">Import / Export</button>
  <button class="primary brk" onclick="printScript()">PDF</button>
</div>

<div class="main">

  <div class="sidebar">
    <div id="railBlock">
      <div class="side-h" id="railTitle">Scènes</div>
      <div class="scene-rail" id="sceneRail"></div>
    </div>
    <div id="charBlock">
      <div class="side-h">Personnages</div>
      <div id="charList" style="display:flex;flex-direction:column;"></div>
    </div>
    <div>
      <div class="side-h">Stats</div>
      <div class="stats-grid">
        <div class="stat"><div class="v" id="stA">0</div><div class="l" id="stAL">pages</div></div>
        <div class="stat"><div class="v" id="stB">0</div><div class="l" id="stBL">durée</div></div>
        <div class="stat"><div class="v" id="stC">0</div><div class="l" id="stCL">mots</div></div>
        <div class="stat"><div class="v" id="stD">+0</div><div class="l" id="stDL">session <span onclick="resetSession()" style="cursor:pointer;color:var(--muted);font-size:9px;letter-spacing:1px;border:1px solid var(--line);padding:1px 4px;border-radius:3px;margin-left:4px;" title="Reset">↺</span></div></div>
      </div>
    </div>
    <div>
      <div class="side-h">Sprint</div>
      <div class="side-note">Tu écris sans t'arrêter jusqu'au bzzz. À la fin : combien de mots pondus.</div>
      <div class="sprint-row">
        <button onclick="startSprint(15)">15'</button>
        <button onclick="startSprint(25)">25'</button>
        <span id="sprintClock"></span>
      </div>
      <div class="sprint-done" id="sprintDone"></div>
    </div>
  </div>

  <div class="center">
    <div class="typebar">
      <span id="scriptBar">
        <span id="typeButtons" style="display:flex;gap:6px;flex-wrap:wrap;"></span>
        <span class="spacer">TAB = TYPE SUIVANT</span>
      </span>
      <span id="bbBar"></span>
    </div>
    <div class="editor-wrap">
      <div id="editor" contenteditable="true" spellcheck="true"></div>
      <div id="forumWrap">
        <div class="forum-split" id="forumSplit">
          <div class="forum-pane">
            <div class="pane-tag">Source BBCode</div>
            <textarea id="bbSource" spellcheck="true" placeholder="Écris ton post… Sélectionne du texte et clique un bouton pour la mise en forme."></textarea>
          </div>
          <div class="forum-pane">
            <div class="pane-tag">Aperçu</div>
            <div id="bbPreview"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<div id="suggest"></div>

<div class="modal" id="ioModal">
  <div class="modal-box">
    <h3 id="ioTitle">Import / Export <button onclick="closeModal('ioModal')">Fermer</button></h3>
    <div class="io-tabs">
      <button id="tabExp" class="active" onclick="ioTab('export')">Export</button>
      <button id="tabImp" onclick="ioTab('import')">Import</button>
    </div>
    <textarea id="ioArea" spellcheck="false"></textarea>
    <div class="io-actions" id="ioActions"></div>
    <input type="file" id="ioFile" accept=".fountain,.txt,.json,.bbcode" style="display:none" onchange="ioOpenFile(event)">
  </div>
</div>

<div class="modal" id="helpModal">
  <div class="modal-box">
    <h3>Aide <button onclick="closeModal('helpModal')">Fermer</button></h3>
    <div class="help-body">
      <h4>Raccourcis</h4>
      <p><kbd>Entrée</kbd> ligne suivante · <kbd>Tab</kbd> changer le type (script) · <kbd id="modS">Ctrl+S</kbd> sauvegarder</p>
      <h4>Mode Script</h4>
      <p><b>Scène</b> INT./EXT. LIEU - MOMENT · <b>Action</b> visible et audible, le comportement plutôt que l'émotion · <b>Personnage</b> capitales, (V.O.) (O.S.) (CONT'D) · <b>Parenthétique</b> rare · <b>Dialogue</b> évite le frontal · <b>Transition</b> CUT TO:.</p>
      <p>Export Fountain (standard ouvert, lisible par Final Draft, Highland…). PDF avec page de titre.</p>
      <h4>Mode Forum (phpBB)</h4>
      <p>Vrai éditeur BBCode : sélectionne du texte, clique un bouton (gras, italique, couleur, citation…), la balise s'applique. Aperçu live à droite. Le bouton <b>« »</b> habille une réplique de dialogue avec la couleur choisie.</p>
      <p>Export = le BBCode brut, prêt à coller sur Forumactif. Import : colle du BBCode ou du texte.</p>
      <h4>Sauvegarde</h4>
      <p>Autosauvegarde quelques secondes après chaque modif (pastille verte). Deux documents séparés, un par mode. Garde des exports : c'est ta copie à toi.</p>
    </div>
  </div>
</div>

<div id="titlePage"><div class="tp-title" id="tpTitle"></div><div class="tp-by" id="tpBy"></div></div>

<script>
const SND = {"touch": "data:audio/mpeg;base64,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AANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DEcAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NixG8AAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DEcAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=", "select": "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAAEgAAC7sAHBwcHBwqKioqKio3Nzc3N0RERERERFJSUlJSX19fX19fbW1tbW16enp6enqHh4eHh5WVlZWVlaKioqKioq+vr6+vvb29vb29ysrKysrX19fX19fl5eXl5fLy8vLy8v//////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQEUQAAAAAAAAu71vaLHAAAAAAAAAAAAAAAAAD/82DEAB04+dABXNgAjEYfxyHIdx/H8qzqt6/wQGDGxSM3II0cgjJAvNnx0+RtjwEKMwGc3rTzvuFO30E3+sQEqjMyKPl5T4ck6FzNFGR0GMYIjKCYyIcMSBgMHlpy05eNMNibvz9SG4fjcbjcbjcbjcORiMRiWUlJSAmD4Pv8uBAwrTP/MxJwSwAt4iBda4YFoYhgRhLmLqNuYID/82LEGiUo+gABnvgANwagSnRgOGInmLbCYyqJjmD3AH5isoYWZXcgDGKOGkhuWhl0YSM8hmj9ubZ1d9aWYQkDvGBQAIwJAEzItxO8wLMB/BAAkYv2JzmFxg5xgXACiypnTlSnDn9ZJDduX0vP/H///qWLGY4GvpZf///2fLj7///84c////x1C0GqZ0XgbZTFmCSQgABUzCACQCAs//NixBUk0TI4Md7oARwD5gRAWgYBgRgjmHoH2YgxGxlrHInBK3oYSII5gJCBmMkpOY+BHRpgJ3ntS8MZTYb5/6nhoUvJmYHhi+FRgkGYKCwwZAoQAaJAQAgFSmTyQkqGJnImsoXsuZ32WtygdrsFSN/Y7IYam4FhqVxWJWJdM2Ka7epq9qrhaBCqGVWIyiex5XbEjKCQAYRAxiQCmP/zYsQRIMip6ADn/Ij8DGYgyajKByB0mEVhrhglA7yZcYTMmMUNY53TTi+Z74DymYRkXRlDDe6ckoYcmIMq6piuoNCaIEVangm64b72PZyrDSmSyIwYVwNZgfgXGAoAeWifl2mcw1dsdAQKiMj8l//Z//h1ln//5b//2///9EkqgeGKWeij/0y6Ex24kQeZQCGolJwi0e7PmOgCcaL/82DEHSR5BcgA376E2u0Z3JVxpeNZmZ0fUapZqRgeH4mO4EO5iFAPgY8IpIm22LhZlTgW0YQ4GPGEAhwpiUgWKYBeCJGAYgM5gBQBUCQAdHxGtFtJhPtdjd32gV13YgyUyKKRuYpaOWUl2mvW6l3K9YriECBYwFiYDFTIRQ+ht3/VAfAHRgWmpYlDb2LqSpWyuhXyPKTiJZkEhVj/82LEGhvA/agUztLIEY6YoGuPR0+eDLksyNYMcbTG44wytAlWaA+GumI1OAZeARKgtLGitFeCG4oDQIiIugYaQqNsolUlHsrTyUViILCQChQ0FWDGGQl+tgC1XrQtKmp1kkxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NixDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DEcAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NixG8AAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DEcAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NixG8AAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82DEcAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV", "boing": "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAADQAACKsAJiYmJiYmJjk5OTk5OTk5S0tLS0tLS0tdXV1dXV1db29vb29vb2+BgYGBgYGBgZOTk5OTk5OlpaWlpaWlpbe3t7e3t7e3ycnJycnJydvb29vb29vb7u7u7u7u7u7/////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQEIgAAAAAAAAirOGwl6gAAAAAAAAAAAAAAAAD/82DEABmArjivWXgAgESVM+/rCkjEOTb8MzLZobpKGY0cUhvFEgZxUHEoJCMjV22Qs4Wgc0GwDcLA4Zfx8Kw0zrZ9wIlNQIAgUdKOBBZ+JAQ74nP/8uf8EAx//8ufwQBD5Twx/LggGMufWD7/+H/ggCAYtmuJAAaNk/22//+2wA+Oa5+TVlYn0S2GABwE0HdWkStiKRgCkDVMDgH/82LEKSorAr5fmJgDIsRwDxFhEWETuUBnh2jsIEdPkkOMnC4Q0pjJFgiQzpdJ8jCdHaUiHlgbRClQcslhji+XTwx5WRPXOD+QYrm+4/EWJ96DHjaeYyZJIvpUF1UbIMmhNnWp003dVNme2gmmipdJv0Gt7JzROibIJqXVepI0SOIonEHpL7o2M0TzpNo4AibZsD/3Yh5xa9HL2Gz1//NixBAj8sZxX9yQARsRIQQIwuYFDoURxhsoGnzsYBjJooLmFAOiKQgwHBpB0eBoYJB4A3MDAgDSh8ZOhx4mpFUkiwSqZBBli2V0kXTZ3N01H11JJrNlukbIsaOb0fs6dLPKSUkpJJJJJJSCKCknT2orWvrXWvrtvq0nrb//3rdSlJutGkgZJOa2SKqWAUsKA/7VVP2itUcpW9VUMf/zYsQQIvLSWB7mSsw3V4mMSoGG80+yjbqpMmmY+qezLA3EgJghOB94kSYn4CmM1gQphBJASBgTEBEkneXK6t6SP2tyV0kBwG4lsYVRg8JCkWczEYSFAUEIAxzAOoeo3mq8ffVvmsylldXR0duU2tWoahZfKzb/6fve8dqRSirnKIgiCTjE4syqAggKf871SmF3cKAoBJ4qjxWOkKP/82DEFCGRIkQW37SEnp3xgRADmLkOgZl4QxgijgmiAIyYIIEbgOyIYomAFCBuCphABjhAO/gUWZIIqYLBwUCdYvtH71uAHHfdskcp2K5ZVN/aiN/druONamtRmw7WdNLsaTI95EYJfqvZ/7WfT/0yw54dJFREMcLyv93/+//6qgm5AN//unwkW7FCsasocHB4EDsyIXzHQoOBqI7/82LEHB0hHkge5hjEeoIyVGTV4KMxhRAK6xdw0VT2KiBaBcNYJW0tEl8AG6IoCXtZPROMiVy5+OGdrSCuz/2xtlcetqG2LPHDfLXP+1Nzv9CP3f/OqryS/+xn++5PS8re8lLN0LqAESMiX/18S7/3J2TNjiAoBTGwVEYHMVHk2KCzDBpOeHIiCcvgUkMfwR5BNYU1HqOyShf2LK5l//NixDcX2RZAvuYMyI4VrmkgCSwMx258+XT//GfVWCv0Rt/7PtQm7/3//9n51H//71ff1+L1hABdsatz1IU3ZlLTZYAi5eBhRUcOOBUhIj5ByG5Q/asDxIBhcZCCdUugKbIffNGvZcAKr5KqbaRX/fQnZ9K9n3f/+1PsR/7kf911D/1b1YAEfcTeLVZTnjArPQYIoYGRkIEBjBkc9P/zYsRnE5C2QV4O2FAOUwbFeIt1qvG5z+ttcXNTEh5sb/UuaimixHdUr9PsZ+v+/2ZpjticUSRT919v6OrjXo+/2XVKAO7jM4N0pPUo2ZmDBwcJmXVZ4BGYOJHMsBhYgsDBTIVZGjgwNUlDanrEPvk+y9s41rWyxTgo3oZt38j/rLI8cgEzV7datj35O7vo6phXvDvndxb7Ue4wj0D/82DEqBOYtjFWDsxUuHMUsDNaAKYqxsDuRRi6/7t4n9WHe+Axz1hn8xMt7E7I61vPVDKb3TAdazFcbuGN7va2WWVVQ4aBGKTmqPgkqcySCoL/Uspd3sMxal58pvMSiVKqqLexcvEmisdGKrrDqzYE8Yt0nDP/WGpibtVjVZm1sq5N35ulNiMqR9Lbh607L41tTTVPFz5p8nLy3Rf/82LE6CCovggAHsxZoq8tje1Uc7JfXjfieG8tU1F3Tyx0zm3/R0riWwuofL1bbUG3g2GJy2U+mt+arDbVUzNbL3Vt1//xOrWJ6SkjRjnDuZ9nVf8WrFoxUtbepBhUP7KsWMepMf/5bLGqxlJVhqX+UNY1XUp5T5Vh3OGqxqq5f8NT9SZlX9SAnExBVUoxhWq+3/9WRiq02pn41bNb//NixPUlFBX8ANDNHDjwSsjsz9kpI3WsjlVpu5zYJFqJYDJgFVElgE9WkTAoSGASACTBVVWkdIxrycHDKkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/zYsTwI8wV0AB4zTyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/82DEcAAAA0gAAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=", "oops": "data:audio/mpeg;base64,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1u613r/WpW+VXWPheai4aI4O2+dr7mtY/r9J5rn/Jrrtor4K498v4sHfewynrvxdeWoFrkeL+z++d2JJdjnbEq04KfNecmStI42z9/eaJbLHbh3bTclH/41y4KpJq2q/lpybOqPiIr1zOVB8SO/pMLalq//zYsRBHcwCZYgxRal3mfXMqAY7GqzUdamluXUMa/QyGVFEo+3CidHp6y96TBRMuXqysZ1dUfMKMX7GdRIZ2qvQUU5VgTPBp52hXCGFbHeqv/szM1aM3f6pa/rV1AV9igEKYVQolmOl8DL5M1gZVCic9jDMzGFARKtqXsx/GPjHV5/VP6FEl9X9m/jezc439X6oCvxi/bUtm4x/xv3/82LEWRwT0jQwMEYtSjKFEl7N/9Uqp8b+qf67MwUkFBX/ibFVM2H3OXmvMTWUNSQFM1BrMUxgEW5nDETSA5FULhDoZdgmDL8lykEKd6li4mSs6bjBENyiUUcZj0rkEWf10oMjcgkQSDFmXaJxZi0SQkDIJqSln/2WeNmmvNmnZ3zXbZo0SGjXFUgIVMu3C0e3FRTizExBTUUzLjEw//NixHgcAWlwAO5MPDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTlsTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYMRyAIAEAADIAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NgxHAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NixG8AAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/82LEbwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NgxHAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV", "alert": "data:audio/mpeg;base64,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DKHELMFbB5pRNmUZ3Zg1ZKBMVXyWSh4iGJVUWgqnNK5P0l8i0ZLpLEULcUN1f2k1V2R+6Gr+QW84MqxiyORi3NVBtn1Di1D7GwSi//NixNczFBX0oHsTjvGxXOWS42tJBOcijLR60FiVLirYzEzGiywBbWtSotUWozu3JvRrgdhJ546dhYXBfbbB5rwmHT43nTiJA7SNsSBU7iRsnXXhPyK2J5QWcjrCeIEuD20fLoImC2piMFdiW6queJ1pXL1iQNTnE1DsUlsaw5+HiIwjYgjvE6clZcdPTaGNasuuiYNvWiStujtGff/zYMSaN5QV5KBj2NAUCW3QNoEDUtrT0ybODfmmTllpdfjh9tl11OeMQPu/BSkJzKZ9SelmPkKpsyr2zamNDVuScEPaO0XGRTPYWbYlRNLi9VWYVIQ/C8LIdtFyxvsGjUU9IoLkXFpKEisEeLqlqsBrwQwzkc9Jz3SE2RIoxXRQhOtsc9j+QqtbPQon7k/11JUMushxZuo1eN4ixf/zYsRKLXQN7YoyUt1VcilicUiK0zKeFvPzZsZi0IqVkbqjt+Ri7ezNV/kSodcyibtlTIwxZ93BES5Iys+cYNTc2gNMLxlk1EcJoIyyPLL2VGqVQS2RL5iZ7TSFVCQSkKHzbZ/SZIhplc61iUmpQYkaNqRRwix2l6mA+08g3WKvsOzAVmKH/hWcSgxQ3bFfnqzkd0p31XY02gOx0iv/82LEJCMEFeiqMM1cQEHXcaPNBYp2EwWmok3i4qLO5Ls0kPwuwMm2OAxK0THjFQ1KoPYujrMU5Ma1UMUZhmtIsVaCMzLt6IPDFgn8SeC9B/XkZn2MN0pyt20HmrNMXWjdcunUv0RrLKqbyHyXitvJqXmNpJEKAwCokEKCsFEhhwowY2MKgE4CgFBVEwUFIMQYwpBjVFRqJjUTRMCU//NixCgd0OXEABjGcUlSokqKNFhRYUsw0Uccacb73PNd7v////53LLHLH8sYUWLLMNFihppUqSKkihVElRIg2FFkhTDZhQ0UFkyRUklSokqLLGFFhQphoo44kVYVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYMRAAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zYsRvAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="};
let MUTED = false;
function playSound(name){
  if (MUTED || !name || !SND[name]) return;
  try { const a = new Audio(SND[name]); a.volume = 0.45; a.play().catch(()=>{}); } catch(e){}
}
function toggleMute(){
  MUTED = !MUTED;
  const b = document.getElementById("muteBtn");
  if (b) b.textContent = MUTED ? "🔇" : "🔊";
  try { if (window.storage) window.storage.set("plume:muted", MUTED?"1":"0"); else localStorage.setItem("plume:muted", MUTED?"1":"0"); } catch(e){}
  if (!MUTED) playSound("touch");
}
document.addEventListener("click", (e)=>{
  const btn = e.target.closest && e.target.closest("button");
  if (!btn || btn.id === "muteBtn") return;
  playSound(btn.dataset.snd || "touch");
}, true);


/* ============ CONFIG ============ */
const CFG = {
  script: {
    types:["scene","action","character","paren","dialogue","transition","blank"],
    labels:{scene:"Scène",action:"Action",character:"Personnage",paren:"Paren",dialogue:"Dialogue",transition:"Transition",blank:"Espace"},
    ph:{scene:"INT. LIEU - MOMENT",action:"Action / description…",character:"NOM DU PERSONNAGE",paren:"indication",dialogue:"Réplique…",transition:"CUT TO:",blank:""},
    next:{scene:"action",action:"action",character:"dialogue",paren:"dialogue",dialogue:"character",transition:"scene",blank:"action"},
    seed:"scene", railTitle:"Scènes", railType:"scene", storeKey:"plume:doc", ioLabel:"Fountain"
  },
  forum:{ storeKey:"plume:rp", ioLabel:"BBCode" }
};
let MODE = "script";
const cfg = () => CFG[MODE];
const editor = document.getElementById("editor");
const bbSource = document.getElementById("bbSource");
const bbPreview = document.getElementById("bbPreview");
let lastLine = null;
const sessionBases = { script: null, forum: null };

/* ============ SCRIPT LINE EDITOR ============ */
function newLine(type, text) {
  const div = document.createElement("div");
  div.className = type; div.setAttribute("data-type", type);
  div.setAttribute("data-placeholder", CFG.script.ph[type] || "");
  if (text) div.textContent = text;
  return div;
}
function currentLine() {
  let node = window.getSelection().anchorNode;
  if (!node) return lastLine;
  while (node && node !== editor && node.parentNode !== editor) node = node.parentNode;
  return (node && node.parentNode === editor) ? node : lastLine;
}
function placeCursor(el, atEnd) {
  const range = document.createRange();
  range.selectNodeContents(el); range.collapse(!atEnd);
  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
}
function setType(type) {
  const line = currentLine();
  if (!line || !CFG.script.types.includes(type)) return;
  if (type === "paren") { const m = line.textContent.match(/^\((.*)\)$/s); if (m) line.textContent = m[1]; }
  line.className = type; line.setAttribute("data-type", type);
  line.setAttribute("data-placeholder", CFG.script.ph[type] || "");
  updateTypebar(); scheduleUpdate();
}
function buildTypebar() {
  const wrap = document.getElementById("typeButtons");
  wrap.innerHTML = "";
  CFG.script.types.forEach(t => {
    const b = document.createElement("button");
    b.setAttribute("data-type", t); b.textContent = CFG.script.labels[t];
    b.onclick = () => setType(t); wrap.appendChild(b);
  });
}
function updateTypebar() {
  if (MODE !== "script") return;
  const line = currentLine();
  const t = line ? line.getAttribute("data-type") : null;
  document.querySelectorAll("#typeButtons button").forEach(b => b.classList.toggle("active", b.getAttribute("data-type") === t));
}

editor.addEventListener("keydown", (e) => {
  const line = currentLine();
  if (!line) return;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); persist(true); return; }
  if (e.key === "Enter") {
    e.preventDefault();
    const curType = line.getAttribute("data-type");
    const sel = window.getSelection();
    let before = line.textContent, after = "";
    if (sel.rangeCount) {
      const r = sel.getRangeAt(0);
      const pre = r.cloneRange(); pre.selectNodeContents(line); pre.setEnd(r.endContainer, r.endOffset);
      before = pre.toString(); after = line.textContent.slice(before.length);
    }
    line.textContent = before;
    const next = newLine(CFG.script.next[curType] || "action", after);
    line.after(next); placeCursor(next);
    updateTypebar(); scheduleUpdate(); hideSuggest();
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const types = CFG.script.types, cur = line.getAttribute("data-type");
    let i = types.indexOf(cur); if (i < 0) i = 0;
    i = e.shiftKey ? (i - 1 + types.length) % types.length : (i + 1) % types.length;
    setType(types[i]);
  }
});
document.addEventListener("selectionchange", () => {
  if (MODE !== "script") return;
  const sel = window.getSelection();
  if (sel.anchorNode && editor.contains(sel.anchorNode)) {
    let node = sel.anchorNode;
    while (node && node.parentNode !== editor) node = node.parentNode;
    if (node && node.parentNode === editor) lastLine = node;
    updateTypebar(); maybeSuggest();
  }
});
editor.addEventListener("input", () => {
  [...editor.childNodes].forEach(n => {
    if (n.nodeType === 3 && n.textContent.trim()) { editor.replaceChild(newLine("action", n.textContent), n); }
    else if (n.nodeType === 1 && !n.getAttribute("data-type")) {
      n.className = "action"; n.setAttribute("data-type", "action"); n.setAttribute("data-placeholder", CFG.script.ph.action);
    }
  });
  if (!editor.children.length) { const d = newLine("scene",""); editor.appendChild(d); placeCursor(d); }
  scheduleUpdate();
});

/* ============ CLASSIFIERS (script) ============ */
const SCENE_RE = /^(INT|EXT|EST|I\/E|INT\.\/EXT)[.\s\/]/i;
function isAllCaps(s){ return s === s.toUpperCase() && /[A-ZÀ-Ý]/.test(s); }
function classifyScript(rawLines) {
  const out = []; let inBone = false, blanks = 0, inDlg = false;
  const push = (type, text) => {
    const prev = out[out.length - 1];
    if (text && prev && prev.type === type && (type==="action"||type==="dialogue") && !prev.closed) { prev.text += " " + text; return; }
    out.push({ type, text });
  };
  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].replace(/\s+$/,"");
    if (inBone) { if (line.includes("*/")) inBone = false; continue; }
    if (line.includes("/*")) { inBone = !line.includes("*/"); continue; }
    line = line.replace(/\[\[.*?\]\]/g, "").replace(/\s+$/,"");
    const t = line.trim();
    if (!t) { blanks++; if (out.length){const p=out[out.length-1]; if(p)p.closed=true;} if (blanks>=2){out.push({type:"blank",text:""}); blanks=1;} inDlg=false; continue; }
    blanks = 0;
    if (/^={3,}$/.test(t) || /^#/.test(t) || /^=/.test(t)) { inDlg=false; continue; }
    if (t.startsWith(".") && !t.startsWith("..")) { out.push({type:"scene",text:t.slice(1).trim(),closed:true}); inDlg=false; continue; }
    if (SCENE_RE.test(t)) { out.push({type:"scene",text:t,closed:true}); inDlg=false; continue; }
    if (t.startsWith(">") && t.endsWith("<")) { push("action", t.slice(1,-1).trim()); continue; }
    if (t.startsWith(">")) { out.push({type:"transition",text:t.slice(1).trim(),closed:true}); inDlg=false; continue; }
    if (t.startsWith("!")) { push("action", t.slice(1)); inDlg=false; continue; }
    if (t.startsWith("@")) { out.push({type:"character",text:t.slice(1).replace(/\^$/,"").trim(),closed:true}); inDlg=true; continue; }
    if (t.startsWith("~")) { push("dialogue", t.slice(1).trim()); continue; }
    if (/^\(.*\)$/s.test(t) && inDlg) { out.push({type:"paren",text:t.slice(1,-1).trim(),closed:true}); continue; }
    if (isAllCaps(t) && /TO:$/.test(t)) { out.push({type:"transition",text:t,closed:true}); inDlg=false; continue; }
    const nextT = (rawLines[i+1]||"").trim();
    if (isAllCaps(t) && t.length<=40 && nextT && !inDlg) { out.push({type:"character",text:t.replace(/\^$/,"").trim(),closed:true}); inDlg=true; continue; }
    if (inDlg) { push("dialogue", t); continue; }
    push("action", t);
  }
  return out;
}
function parseFountainDoc(text) {
  let lines = text.split(/\r?\n/); let i = 0;
  if (/^[A-Za-z][A-Za-z ]*:\s*\S/.test(lines[0]||"")) {
    for (; i < lines.length && lines[i].trim(); i++) {
      const m = lines[i].match(/^(Title|Titre):\s*(.+)/i), a = lines[i].match(/^(Author|Authors|Auteur|Credit):\s*(.+)/i);
      if (m) document.getElementById("docTitle").value = m[2].trim();
      if (a) document.getElementById("docAuthor").value = a[2].trim();
    }
  }
  return classifyScript(lines.slice(i));
}
editor.addEventListener("paste", (e) => {
  if (MODE !== "script") return;
  e.preventDefault();
  const text = (e.clipboardData||window.clipboardData).getData("text/plain");
  const parsed = classifyScript(text.split(/\r?\n/));
  if (!parsed.length) return;
  const line = currentLine(); let anchor = line;
  parsed.forEach((p, idx) => {
    if (idx===0 && line && !line.textContent.trim() && p.type!=="blank") {
      line.className=p.type; line.setAttribute("data-type",p.type);
      line.setAttribute("data-placeholder",CFG.script.ph[p.type]||""); line.textContent=p.text; anchor=line;
    } else { const nl=newLine(p.type,p.text); anchor.after(nl); anchor=nl; }
  });
  placeCursor(anchor, true); updateTypebar(); scheduleUpdate();
});

function serializeLines() {
  return [...editor.children].map(d => {
    let text = d.textContent; const type = d.getAttribute("data-type") || "action";
    if (type==="paren") { const m=text.match(/^\((.*)\)$/s); if (m) text=m[1]; }
    return { type, text };
  });
}
function loadLines(lines) {
  editor.innerHTML = "";
  (lines||[]).forEach(l => { const type = CFG.script.types.includes(l.type) ? l.type : "action"; editor.appendChild(newLine(type, l.text)); });
  if (!editor.children.length) editor.appendChild(newLine("scene",""));
  placeCursor(editor.firstChild); scheduleUpdate();
}
function toFountain() {
  const title=document.getElementById("docTitle").value||"", author=document.getElementById("docAuthor").value||"";
  let out = "Title: "+title+"\nAuthor: "+author+"\n\n";
  const lines = serializeLines(); let prevInDlg=false;
  lines.forEach((l,i)=>{
    const t=(l.text||"").trim(); const dlgPart=(l.type==="paren"||l.type==="dialogue");
    if (l.type==="blank"){ out+="\n"; prevInDlg=false; return; }
    if (i>0 && !(dlgPart && prevInDlg)) out+="\n";
    switch(l.type){
      case "scene": out+=SCENE_RE.test(t)?t.toUpperCase():"."+t.toUpperCase(); prevInDlg=false; break;
      case "transition": out+=/TO:$/.test(t.toUpperCase())?t.toUpperCase():"> "+t.toUpperCase(); prevInDlg=false; break;
      case "character": out+=isAllCaps(t)?t:"@"+t; prevInDlg=true; break;
      case "paren": out+="("+t+")"; prevInDlg=true; break;
      case "dialogue": out+=t; prevInDlg=true; break;
      default: out+=(isAllCaps(t)&&t.length<=40?"!":"")+t; prevInDlg=false;
    }
    out+="\n";
  });
  return out;
}

/* ============ FORUM BBCODE EDITOR ============ */
const BB_BTNS = [
  {l:"<b>G</b>", t:"Gras", tag:"b"},
  {l:"<i>I</i>", t:"Italique", tag:"i"},
  {l:"<u>S</u>", t:"Souligné", tag:"u"},
  {l:"<s>B</s>", t:"Barré", tag:"s"},
  {sep:true},
  {l:"«»", t:"Réplique (couleur dialogue)", fn:"wrapDialogue"},
  {l:"color", t:"Couleur", fn:"wrapColor"},
  {l:"A±", t:"Taille", fn:"wrapSize"},
  {sep:true},
  {l:"❝", t:"Citation", tag:"quote"},
  {l:"≡", t:"Centrer", tag:"center"},
  {l:"•", t:"Liste", fn:"wrapList"},
  {l:"</>", t:"Code", tag:"code"},
  {sep:true},
  {l:"🔗", t:"Lien", fn:"wrapUrl"},
  {l:"🖼", t:"Image", fn:"wrapImg"},
  {l:"▢", t:"Spoiler", tag:"spoiler"},
];
function buildBBBar() {
  const bar = document.getElementById("bbBar");
  bar.innerHTML = "";
  BB_BTNS.forEach(spec => {
    if (spec.sep) { const s=document.createElement("span"); s.className="sep"; bar.appendChild(s); return; }
    const b = document.createElement("button");
    b.innerHTML = spec.l; b.title = spec.t;
    if (spec.tag) b.onclick = () => wrapTag(spec.tag);
    else b.onclick = () => window[spec.fn]();
    bar.appendChild(b);
  });
  const sep=document.createElement("span"); sep.className="sep"; bar.appendChild(sep);
  const col=document.createElement("input"); col.type="color"; col.id="dlgColor"; col.className="bbcolor"; col.value="#56b0c2"; col.title="Couleur de dialogue par défaut";
  bar.appendChild(col);
  const pv=document.createElement("button"); pv.id="previewToggle"; pv.className="active"; pv.textContent="Aperçu"; pv.title="Afficher / masquer l'aperçu";
  pv.onclick = () => { pv.classList.toggle("active"); document.getElementById("forumSplit").classList.toggle("no-preview", !pv.classList.contains("active")); };
  bar.appendChild(pv);
}
function bbSel() {
  const s = bbSource.selectionStart, e = bbSource.selectionEnd, v = bbSource.value;
  return { s, e, sel: v.slice(s,e), before: v.slice(0,s), after: v.slice(e) };
}
function bbApply(newText, selStart, selEnd) {
  bbSource.value = newText;
  bbSource.focus();
  bbSource.setSelectionRange(selStart, selEnd);
  renderPreview(); scheduleUpdate();
}
function wrapTag(tag) {
  const {s,e,sel,before,after} = bbSel();
  const open = "["+tag+"]", close = "[/"+tag+"]";
  const inner = sel || (tag==="quote"?"citation":tag==="code"?"code":tag==="center"?"texte centré":tag==="spoiler"?"contenu caché":"texte");
  bbApply(before+open+inner+close+after, s+open.length, s+open.length+inner.length);
}
function wrapColor() {
  const c = document.getElementById("dlgColor").value;
  const {s,sel,before,after} = bbSel();
  const open="[color="+c+"]", close="[/color]", inner = sel || "texte";
  bbApply(before+open+inner+close+after, s+open.length, s+open.length+inner.length);
}
function wrapDialogue() {
  const c = document.getElementById("dlgColor").value;
  const {s,sel,before,after} = bbSel();
  const open="[color="+c+"]« ", close=" »[/color]", inner = sel || "réplique";
  bbApply(before+open+inner+close+after, s+open.length, s+open.length+inner.length);
}
function wrapSize() {
  const sz = prompt("Taille (ex: 85, 150 — en %) :", "120");
  if (!sz) return;
  const {s,sel,before,after} = bbSel();
  const open="[size="+sz+"]", close="[/size]", inner = sel || "texte";
  bbApply(before+open+inner+close+after, s+open.length, s+open.length+inner.length);
}
function wrapList() {
  const {s,sel,before,after} = bbSel();
  const items = (sel || "élément").split(/\n/).filter(x=>x.trim());
  const body = items.map(x=>"[*]"+x.trim()).join("\n");
  const block = "[list]\n"+body+"\n[/list]";
  bbApply(before+block+after, s+block.length, s+block.length);
}
function wrapUrl() {
  const url = prompt("URL :", "https://");
  if (!url) return;
  const {s,sel,before,after} = bbSel();
  const open="[url="+url+"]", close="[/url]", inner = sel || url;
  bbApply(before+open+inner+close+after, s+open.length, s+open.length+inner.length);
}
function wrapImg() {
  const url = prompt("URL de l'image :", "https://");
  if (!url) return;
  const {s,before,after,e} = bbSel();
  const block="[img]"+url+"[/img]";
  bbApply(before+block+after, s+block.length, s+block.length);
}
function escHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function bbToHtml(src) {
  let h = escHtml(src);
  h = h.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>");
  h = h.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>");
  h = h.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<span style='text-decoration:underline'>$1</span>");
  h = h.replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<span style='text-decoration:line-through'>$1</span>");
  h = h.replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, "<span style='color:$1'>$2</span>");
  h = h.replace(/\[size=([0-9]+)\]([\s\S]*?)\[\/size\]/gi, (m,sz,txt)=>"<span style='font-size:"+Math.max(60,Math.min(220,+sz))+"%'>"+txt+"</span>");
  h = h.replace(/\[center\]([\s\S]*?)\[\/center\]/gi, "<div style='text-align:center'>$1</div>");
  h = h.replace(/\[quote(?:=[^\]]+)?\]([\s\S]*?)\[\/quote\]/gi, "<blockquote>$1</blockquote>");
  h = h.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, "<pre>$1</pre>");
  h = h.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, "<div class='spoiler'>$1</div>");
  h = h.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, "<a href='$1' target='_blank' rel='noopener'>$2</a>");
  h = h.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, "<a href='$1' target='_blank' rel='noopener'>$1</a>");
  h = h.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, "<img src='$1' alt=''>");
  h = h.replace(/\[list\]([\s\S]*?)\[\/list\]/gi, (m,inner)=>{
    const items = inner.split(/\[\*\]/).map(x=>x.trim()).filter(Boolean);
    return "<ul>"+items.map(x=>"<li>"+x+"</li>").join("")+"</ul>";
  });
  h = h.split(/\n{2,}/).map(b => b.trim() ? (/^<(div|blockquote|pre|ul|img)/.test(b.trim()) ? b : "<p>"+b.replace(/\n/g,"<br>")+"</p>") : "").join("");
  return h;
}
function renderPreview() { bbPreview.innerHTML = bbToHtml(bbSource.value); }
bbSource.addEventListener("input", () => { renderPreview(); scheduleUpdate(); });
bbSource.addEventListener("keydown", (e) => {
  if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="s") { e.preventDefault(); persist(true); }
  if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="b") { e.preventDefault(); wrapTag("b"); }
  if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="i") { e.preventDefault(); wrapTag("i"); }
});

function stripBB(s){ return s.replace(/\[\/?[a-z*]+(=[^\]]+)?\]/gi,"").replace(/[«»]/g,"").trim(); }

/* ============ STORAGE ============ */
function withTimeout(p, ms){ return Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms))]); }
const store = {
  async set(k,v){ try{ if(window.storage){ await withTimeout(window.storage.set(k,v),2000); return true; } }catch(e){} try{ localStorage.setItem(k,v); return true; }catch(e){} return false; },
  async get(k){ try{ if(window.storage){ const r=await withTimeout(window.storage.get(k),2000); return r?r.value:null; } }catch(e){} try{ return localStorage.getItem(k); }catch(e){} return null; }
};
let saveTimer=null, refreshTimer=null;
function setDot(state,txt){ document.getElementById("saveDot").className="savedot "+state; document.getElementById("saveTxt").textContent=txt; }
function scheduleUpdate() {
  setDot("dirty","modifié…");
  clearTimeout(saveTimer); saveTimer=setTimeout(()=>{ persist(); refreshSide(); },900);
  clearTimeout(refreshTimer); refreshTimer=setTimeout(refreshSide,350);
}
async function persist(manual) {
  let data;
  if (MODE === "script") {
    data = { title:document.getElementById("docTitle").value, author:document.getElementById("docAuthor").value, lines:serializeLines() };
  } else {
    data = { title:document.getElementById("docTitle").value, author:document.getElementById("docAuthor").value, dlgColor:document.getElementById("dlgColor").value, bbcode:bbSource.value };
  }
  const ok = await store.set(cfg().storeKey, JSON.stringify(data));
  setDot(ok?"ok":"", ok?(manual?"sauvegardé ✓":"sauvegardé"):"stockage indisponible");
  if (manual && ok) playSound("select");
}
document.getElementById("docTitle").addEventListener("input", scheduleUpdate);
document.getElementById("docAuthor").addEventListener("input", scheduleUpdate);

/* ============ SIDEBAR / STATS ============ */
function baseName(n){ return n.replace(/\(.*?\)/g,"").replace(/\^$/,"").trim(); }
function wordCount(str){ str=str.trim(); return str?str.split(/\s+/).length:0; }
function refreshSide() {
  let words = 0;
  if (MODE === "script") {
    const kids=[...editor.children];
    const rail=document.getElementById("sceneRail"); rail.innerHTML=""; let n=0;
    kids.forEach(d=>{
      if (d.getAttribute("data-type")==="scene" && d.textContent.trim()) {
        n++; const item=document.createElement("div"); item.className="scene-item";
        item.innerHTML='<span class="num">'+n+'</span><span class="slug"></span>';
        item.querySelector(".slug").textContent=d.textContent;
        item.onclick=()=>{ d.scrollIntoView({behavior:"smooth",block:"center"}); d.classList.add("flash"); setTimeout(()=>d.classList.remove("flash"),1200); };
        rail.appendChild(item);
      }
    });
    if (!n) rail.innerHTML='<div style="font-size:12px;color:var(--muted);padding:4px 7px;">Aucune scène.</div>';
    const counts={}; let onChar=null;
    kids.forEach(d=>{ const t=d.getAttribute("data-type");
      if (t==="character" && d.textContent.trim()){ onChar=baseName(d.textContent); counts[onChar]=counts[onChar]||0; }
      else if (t==="dialogue" && onChar){ counts[onChar]++; }
      else if (t!=="paren" && t!=="dialogue"){ onChar=null; }
    });
    const cl=document.getElementById("charList"); cl.innerHTML="";
    const names=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
    names.forEach(name=>{ const row=document.createElement("div"); row.className="char-item";
      const s1=document.createElement("span"); s1.textContent=name; const s2=document.createElement("span"); s2.textContent=counts[name]+" répl.";
      row.append(s1,s2); cl.appendChild(row); });
    if (!names.length) cl.innerHTML='<div style="font-size:12px;color:var(--muted);padding:4px 7px;">Aucun.</div>';
    let vLines=0; const CPL={scene:60,action:60,character:60,paren:32,dialogue:35,transition:60,blank:1};
    kids.forEach(d=>{ const t=d.getAttribute("data-type")||"action"; const txt=d.textContent.trim();
      words+=wordCount(txt); vLines+=txt?Math.max(1,Math.ceil(txt.length/(CPL[t]||60))):1;
      if (t==="scene"||t==="character"||t==="transition") vLines+=1; });
    const pages=Math.max(0,Math.round((vLines/55)*10)/10);
    setStat("stA","pages",pages); setStat("stB","durée",Math.round(pages)+" min"); setStat("stC","mots",words);
  } else {
    const txt = stripBB(bbSource.value);
    words = wordCount(txt);
    const dlg = (bbSource.value.match(/\[color=[^\]]+\]\s*«/gi)||[]).length || (bbSource.value.match(/«/g)||[]).length;
    setStat("stA","mots",words); setStat("stB","lecture",Math.max(1,Math.round(words/200))+" min"); setStat("stC","répliques",dlg);
  }
  if (sessionBases[MODE]===null) sessionBases[MODE]=words;
  setStat("stD","session","+"+Math.max(0,words-sessionBases[MODE]));
  return { words };
}
function setStat(id,label,val){ document.getElementById(id).textContent=val; document.getElementById(id+"L").innerHTML = label === "session" ? document.getElementById(id+"L").innerHTML : label; }
function resetSession() { sessionBases[MODE] = null; refreshSide(); }

/* ============ AUTOCOMPLETE ============ */
const suggest=document.getElementById("suggest");
function knownNames(){ const s=new Set(); [...editor.children].forEach(d=>{ if (d.getAttribute("data-type")==="character" && d.textContent.trim()) s.add(baseName(d.textContent).toUpperCase()); }); return [...s]; }
function maybeSuggest() {
  const line=currentLine();
  if (MODE!=="script" || !line || line.getAttribute("data-type")!=="character"){ hideSuggest(); return; }
  const typed=line.textContent.trim().toUpperCase(); if (!typed){ hideSuggest(); return; }
  const matches=knownNames().filter(n=>n.startsWith(typed)&&n!==typed).slice(0,5);
  if (!matches.length){ hideSuggest(); return; }
  suggest.innerHTML="";
  matches.forEach(m=>{ const b=document.createElement("button"); b.textContent=m;
    b.onmousedown=(ev)=>{ ev.preventDefault(); line.textContent=m; placeCursor(line,true); hideSuggest(); scheduleUpdate(); }; suggest.appendChild(b); });
  const r=line.getBoundingClientRect();
  suggest.style.left=Math.min(r.left+180,window.innerWidth-240)+"px"; suggest.style.top=(r.bottom+4)+"px"; suggest.style.display="flex";
}
function hideSuggest(){ suggest.style.display="none"; }
document.addEventListener("click",(e)=>{ if (!suggest.contains(e.target)) hideSuggest(); });

/* ============ SPRINT ============ */
let sprintInt=null, sprintEnd=0, sprintStartWords=0;
function startSprint(min) {
  clearInterval(sprintInt); sprintEnd=Date.now()+min*60000; sprintStartWords=refreshSide().words;
  document.getElementById("sprintDone").textContent=""; document.getElementById("sprintBadge").style.display="flex";
  const tick=()=>{ const left=sprintEnd-Date.now();
    if (left<=0){ clearInterval(sprintInt); const delta=refreshSide().words-sprintStartWords;
      document.getElementById("sprintClock").textContent=""; document.getElementById("sprintBadge").style.display="none";
      document.getElementById("sprintDone").textContent="Sprint terminé : +"+Math.max(0,delta)+" mots écrits."; playSound("alert"); return; }
    const m=Math.floor(left/60000), s=Math.floor((left%60000)/1000); const t=m+":"+String(s).padStart(2,"0");
    document.getElementById("sprintClock").textContent=t; document.getElementById("sprintClockTop").textContent=t; };
  tick(); sprintInt=setInterval(tick,500);
}
function stopSprint() {
  clearInterval(sprintInt); const delta=refreshSide().words-sprintStartWords;
  document.getElementById("sprintClock").textContent=""; document.getElementById("sprintBadge").style.display="none";
  document.getElementById("sprintDone").textContent="Sprint arrêté : +"+Math.max(0,delta)+" mots.";
}

/* ============ MODE SWITCH ============ */
function switchMode(m) {
  if (m === MODE) return;
  let snapshot;
  if (MODE === "script") snapshot = JSON.stringify({ title:docTitleEl().value, author:docAuthorEl().value, lines:serializeLines() });
  else snapshot = JSON.stringify({ title:docTitleEl().value, author:docAuthorEl().value, dlgColor:(document.getElementById("dlgColor")||{}).value, bbcode:bbSource.value });
  const oldKey = cfg().storeKey;
  MODE = m; document.body.setAttribute("data-mode", m);
  document.getElementById("msScript").classList.toggle("active", m==="script");
  document.getElementById("msForum").classList.toggle("active", m==="forum");
  store.set(oldKey, snapshot); store.set("plume:mode", m);
  loadDoc();
}
function docTitleEl(){ return document.getElementById("docTitle"); }
function docAuthorEl(){ return document.getElementById("docAuthor"); }
async function loadDoc() {
  const raw = await store.get(cfg().storeKey);
  if (MODE === "script") {
    if (raw) { try { const d=JSON.parse(raw); docTitleEl().value=d.title||"SANS TITRE"; docAuthorEl().value=d.author||"par Anonyme"; loadLines(d.lines); setDot("ok","restauré"); refreshSide(); return; } catch(e){} }
    docTitleEl().value="SANS TITRE"; docAuthorEl().value="par Anonyme"; loadLines([]); setDot("","—");
  } else {
    if (raw) { try { const d=JSON.parse(raw); docTitleEl().value=d.title||"SANS TITRE"; docAuthorEl().value=d.author||"par Anonyme"; if(d.dlgColor && document.getElementById("dlgColor")) document.getElementById("dlgColor").value=d.dlgColor; bbSource.value=d.bbcode||""; renderPreview(); setDot("ok","restauré"); refreshSide(); return; } catch(e){} }
    docTitleEl().value="SANS TITRE"; docAuthorEl().value="par Anonyme"; bbSource.value=""; renderPreview(); setDot("","—");
  }
  refreshSide();
}

/* ============ IMPORT / EXPORT ============ */
let ioMode="export";
function openIO(mode){ document.getElementById("ioModal").classList.add("open"); ioTab(mode); }
function ioTab(mode) {
  ioMode=mode;
  document.getElementById("tabExp").classList.toggle("active",mode==="export");
  document.getElementById("tabImp").classList.toggle("active",mode==="import");
  document.getElementById("tabExp").textContent="Export "+cfg().ioLabel;
  document.getElementById("tabImp").textContent="Import";
  const area=document.getElementById("ioArea"), actions=document.getElementById("ioActions"); actions.innerHTML="";
  if (mode==="export") {
    area.value = MODE==="script" ? toFountain() : bbSource.value;
    area.readOnly=true;
    mkBtn(actions,"Copier",()=>{ navigator.clipboard.writeText(area.value).then(()=>flashBtn(actions,"Copier","Copié !")).catch(()=>area.select()); });
    mkBtn(actions, MODE==="script"?"Télécharger .fountain":"Télécharger .txt", ()=>download(area.value, MODE==="script"?".fountain":".txt","text/plain"));
    mkBtn(actions,"Sauver .json",()=>{
      const data = MODE==="script"
        ? { mode:"script", title:docTitleEl().value, author:docAuthorEl().value, lines:serializeLines() }
        : { mode:"forum", title:docTitleEl().value, author:docAuthorEl().value, dlgColor:document.getElementById("dlgColor").value, bbcode:bbSource.value };
      download(JSON.stringify(data,null,2),".json","application/json");
    });
  } else {
    area.value=""; area.readOnly=false;
    area.placeholder = MODE==="script" ? "Colle ici du Fountain, du texte brut, ou du JSON PLUME…" : "Colle ici du BBCode Forumactif, du texte brut, ou du JSON PLUME…";
    mkBtn(actions,"Ouvrir un fichier…",()=>document.getElementById("ioFile").click());
    mkBtn(actions,"Importer",()=>doImport(area.value),true);
  }
}
function mkBtn(parent,label,fn,primary){ const b=document.createElement("button"); if(primary)b.className="primary"; b.textContent=label; b.onclick=fn; parent.appendChild(b); return b; }
function flashBtn(parent,label,flash){ const b=[...parent.children].find(x=>x.textContent===label||x.textContent===flash); if(b){ b.textContent=flash; setTimeout(()=>b.textContent=label,1200); } }
function download(content,ext,mime){ const blob=new Blob([content],{type:mime}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=(docTitleEl().value||"plume").replace(/\s+/g,"_")+ext; a.click(); }
function doImport(text) {
  text=text.trim(); if (!text) return;
  if (text.startsWith("{")) {
    try {
      const d=JSON.parse(text);
      docTitleEl().value=d.title||"SANS TITRE"; docAuthorEl().value=d.author||"";
      if (d.mode==="forum" || (d.bbcode!==undefined)) {
        if (MODE!=="forum") switchMode("forum");
        if (d.dlgColor && document.getElementById("dlgColor")) document.getElementById("dlgColor").value=d.dlgColor;
        bbSource.value=d.bbcode||""; renderPreview();
      } else {
        if (MODE!=="script") switchMode("script");
        loadLines(d.lines);
      }
      closeModal("ioModal"); scheduleUpdate(); return;
    } catch(e){}
  }
  if (MODE==="script") { const parsed=parseFountainDoc(text); loadLines(parsed.map(p=>({type:p.type,text:p.text}))); }
  else { bbSource.value=text; renderPreview(); scheduleUpdate(); }
  closeModal("ioModal");
}
function ioOpenFile(ev){ const file=ev.target.files[0]; if(!file)return; const r=new FileReader(); r.onload=()=>doImport(r.result); r.readAsText(file); ev.target.value=""; }
function closeModal(id){ document.getElementById(id).classList.remove("open"); }
function openHelp(){ document.getElementById("helpModal").classList.add("open"); }

/* ============ PRINT ============ */
function fillTitlePage(){ document.getElementById("tpTitle").textContent=docTitleEl().value||"SANS TITRE"; document.getElementById("tpBy").textContent=docAuthorEl().value||""; }
window.addEventListener("beforeprint", ()=>{ if (MODE==="forum") renderPreview(); fillTitlePage(); });
function printScript(){ if (MODE==="forum") renderPreview(); fillTitlePage(); document.title=docTitleEl().value||"PLUME"; window.print(); }

/* ============ PANELS / FOCUS ============ */
function toggle(cls){ document.body.classList.toggle(cls); }

/* ============ AI ============ */
/* ============ INIT ============ */
const IS_MAC=/Mac|iPhone|iPad/.test(navigator.platform)||/Mac/.test(navigator.userAgent);
document.getElementById("modS").textContent=(IS_MAC?"⌘":"Ctrl+")+"S";

(function initSync(){
  buildTypebar(); buildBBBar(); loadLines([]); renderPreview();
  if (window.innerWidth<1150){ document.body.classList.add("no-left"); }
})();
(async function initAsync(){
  const m = await store.get("plume:muted");
  if (m === "1") { MUTED = true; const b=document.getElementById("muteBtn"); if(b) b.textContent="🔇"; }
  const savedMode=await store.get("plume:mode");
  if (savedMode==="forum" && MODE!=="forum") {
    MODE="forum"; document.body.setAttribute("data-mode","forum");
    document.getElementById("msScript").classList.remove("active"); document.getElementById("msForum").classList.add("active");
  }
  await loadDoc(); refreshSide();
})();
</script>
</body>
</html>
