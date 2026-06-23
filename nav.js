/**
 * nav.js — Bhagavad Gita Study Platform
 * Features: hamburger menu · swipe/keyboard navigation · light/dark theme
 * v3 — theme button inside drawer only · hero light-fix · progress-row overlap fix
 */

(function () {

  const pathMatch = window.location.pathname.match(/gita_(\d+)_(\d+)\.html/);
  const currentChapter = pathMatch ? parseInt(pathMatch[1]) : 18;
  const currentVerse   = pathMatch ? parseInt(pathMatch[2]) : 1;

  /* ── Theme: apply before paint to avoid flash ── */
  const THEME_KEY  = 'gita_theme';
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  /* ════════════════════════════════════════════════
     ALL CSS
     ════════════════════════════════════════════════ */
  const css = `

  /* ── Light theme CSS variable overrides ── */
  html[data-theme="light"] {
    --bg-deep:     #faf4e6;
    --bg-deep-alt: #f0e4c4;
    --gold:        #9a6f00;
    --gold-light:  #7a5200;
    --maroon:      #8c2c3b;
    --cream:       #1a0f04;
    --cream-dim:   #5a3a10;
    --sage:        #1a5040;
    --line:        rgba(120,80,0,0.18);
    --shadow:      0 18px 50px rgba(0,0,0,0.10);
  }
  html[data-theme="light"] body {
    background: linear-gradient(160deg,#f5edd8 0%,#faf4e6 50%,#f0e8d0 100%) !important;
  }

  /* ── Fix hardcoded dark colors in hero (strong overrides) ── */
  html[data-theme="light"] .hero,
  html[data-theme="light"] body .hero,
  html[data-theme="light"] .wrap .hero {
    background: linear-gradient(160deg,#f0e4c4,#ede0c0) !important;
    background-color: #f0e4c4 !important;
    border-color: rgba(120,80,0,0.2) !important;
    box-shadow: 0 18px 50px rgba(0,0,0,0.08) !important;
  }
  html[data-theme="light"] .hero::before {
    background: radial-gradient(circle at 50% 0%,rgba(154,111,0,0.07),transparent 60%) !important;
  }
  html[data-theme="light"] .hero::after {
    display: none !important;
  }
  html[data-theme="light"] .eyebrow       { color:#9a6f00 !important; }
  html[data-theme="light"] .chapter-title { color:#5a3a10 !important; }
  html[data-theme="light"] .verse-tag     { color:#7a5200 !important; border-color:rgba(120,80,0,0.3) !important; background:rgba(154,111,0,0.08) !important; }
  html[data-theme="light"] .shloka        { color:#1a0f04 !important; }
  html[data-theme="light"] .translit      { color:#7a5200 !important; }
  html[data-theme="light"] .gist          { color:#5a3a10 !important; border-top-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .gist b        { color:#1a0f04 !important; }

  /* ── Fix tabs ── */
  html[data-theme="light"] .tab-btn       { border-color:rgba(120,80,0,0.2) !important; color:#5a3a10 !important; background:transparent !important; }
  html[data-theme="light"] .tab-btn:hover { color:#1a0f04 !important; border-color:#9a6f00 !important; }
  html[data-theme="light"] .tab-btn.active{ background:#f0e4c4 !important; color:#7a5200 !important; border-color:#9a6f00 !important; border-bottom-color:#f0e4c4 !important; }

  /* ── Fix panel shell & cards ── */
  html[data-theme="light"] .panel-shell   { background:#f0e4c4 !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .panel h3      { color:#7a5200 !important; }
  html[data-theme="light"] .panel p       { color:#1a0f04 !important; }
  html[data-theme="light"] .callout       { background:rgba(154,111,0,0.07) !important; border-left-color:#9a6f00 !important; color:#5a3a10 !important; }
  html[data-theme="light"] .callout b     { color:#7a5200 !important; }
  html[data-theme="light"] .callout-red   { background:rgba(140,44,59,0.06) !important; }
  html[data-theme="light"] .callout-sage  { background:rgba(26,80,64,0.06) !important; }
  html[data-theme="light"] .word-card     { background:rgba(0,0,0,0.02) !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .word-sa       { color:#7a5200 !important; }
  html[data-theme="light"] .word-meaning  { color:#1a0f04 !important; }
  html[data-theme="light"] .word-deep     { color:#5a3a10 !important; border-top-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .word-tr       { color:#1a5040 !important; }
  html[data-theme="light"] .word-eng      { color:#1a5040 !important; }
  html[data-theme="light"] .eng-box       { background:rgba(0,0,0,0.04) !important; border-color:rgba(120,80,0,0.15) !important; color:#5a3a10 !important; }
  html[data-theme="light"] .eng-box span  { color:#9a6f00 !important; }
  html[data-theme="light"] .faq .q        { color:#7a5200 !important; }
  html[data-theme="light"] .faq .a        { color:#1a0f04 !important; }
  html[data-theme="light"] .faq           { border-bottom-color:rgba(120,80,0,0.12) !important; }
  html[data-theme="light"] .example       { border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .example b     { color:#7a5200 !important; }
  html[data-theme="light"] .subnote       { color:#7a5200 !important; }

  /* ── Fix mode pills ── */
  html[data-theme="light"] .mode-pill     { background:rgba(0,0,0,0.03) !important; border-color:rgba(120,80,0,0.18) !important; color:#5a3a10 !important; }
  html[data-theme="light"] .mode-pill:hover { color:#1a0f04 !important; border-color:#9a6f00 !important; }
  html[data-theme="light"] .mode-pill.active { background:linear-gradient(120deg,#9a6f00,#c9a227) !important; color:#fff8e8 !important; border-color:transparent !important; }

  /* ── Fix tables ── */
  html[data-theme="light"] .cmp-table th  { background:rgba(154,111,0,0.06) !important; color:#7a5200 !important; }
  html[data-theme="light"] .cmp-table td  { color:#1a0f04 !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .cmp-table th  { border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .gram-table th { background:rgba(154,111,0,0.06) !important; color:#7a5200 !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .gram-table td { color:#5a3a10 !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .gram-table td.sa { color:#7a5200 !important; }

  /* ── Fix flashcards ── */
  html[data-theme="light"] .flashcard-front { background:rgba(0,0,0,0.03) !important; }
  html[data-theme="light"] .flashcard-back  { background:rgba(154,111,0,0.12) !important; }
  html[data-theme="light"] .flashcard-back b { color:#7a5200 !important; }
  html[data-theme="light"] .flashcard-face  { border-color:rgba(120,80,0,0.18) !important; }

  /* ── Fix quiz ── */
  html[data-theme="light"] .quiz-question  { color:#1a0f04 !important; }
  html[data-theme="light"] .quiz-opt       { border-color:rgba(120,80,0,0.18) !important; color:#1a0f04 !important; background:rgba(0,0,0,0.02) !important; }
  html[data-theme="light"] .quiz-opt:hover { border-color:#9a6f00 !important; }
  html[data-theme="light"] .quiz-btn       { background:#9a6f00 !important; color:#fff8e8 !important; }
  html[data-theme="light"] .quiz-score     { color:#7a5200 !important; }
  html[data-theme="light"] .quiz-progress  { color:#5a3a10 !important; }

  /* ── Fix cheatsheet & misc ── */
  html[data-theme="light"] .cheat-card     { background:rgba(0,0,0,0.02) !important; border-color:rgba(154,111,0,0.4) !important; }
  html[data-theme="light"] .cheat-shloka   { color:#1a0f04 !important; }
  html[data-theme="light"] .cheat-translit { color:#7a5200 !important; }
  html[data-theme="light"] .cheat-line     { color:#1a0f04 !important; }
  html[data-theme="light"] .cheat-chip     { border-color:rgba(120,80,0,0.18) !important; color:#5a3a10 !important; }
  html[data-theme="light"] .cheat-chip b   { color:#7a5200 !important; }
  html[data-theme="light"] .cheat-takeaway { color:#5a3a10 !important; border-top-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .walk-stage     { background:rgba(0,0,0,0.02) !important; border-color:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .walk-stage p   { color:#1a0f04 !important; }
  html[data-theme="light"] .walk-dot       { background:rgba(120,80,0,0.15) !important; }
  html[data-theme="light"] .walk-dot.active{ background:#9a6f00 !important; }
  html[data-theme="light"] .walk-controls button { border-color:rgba(120,80,0,0.18) !important; color:#5a3a10 !important; }
  html[data-theme="light"] .syll           { border-color:rgba(120,80,0,0.18) !important; color:#1a0f04 !important; background:rgba(0,0,0,0.02) !important; }
  html[data-theme="light"] .pada-label     { color:#9a6f00 !important; }
  html[data-theme="light"] .tts-btn        { background:rgba(154,111,0,0.08) !important; border-color:#9a6f00 !important; color:#7a5200 !important; }
  html[data-theme="light"] .footer-hint    { color:#7a5200 !important; }
  html[data-theme="light"] .progress-label { color:#5a3a10 !important; }
  html[data-theme="light"] .progress-track { background:rgba(0,0,0,0.08) !important; }

  /* ── Smooth transitions ── */
  body,.hero,.panel-shell,.word-card,.example,.flashcard-face,
  .cmp-table th,.cmp-table td,.gram-table th,.gram-table td,
  .cheat-card,.walk-stage,.syll,.tts-btn,.mode-pill,.tab-btn {
    transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }

  /* ══════════════════════════════════════
     PROGRESS ROW — push right to avoid ☰
     ══════════════════════════════════════ */
  .progress-row {
    padding-left: 56px !important;
  }

  /* ══════════════════════════════════════
     HAMBURGER BUTTON
     ══════════════════════════════════════ */
  #gita-nav-btn {
    position:fixed; top:14px; left:14px; z-index:9000;
    width:42px; height:42px; border-radius:50%;
    background:rgba(24,15,46,0.92); border:1px solid rgba(201,162,39,0.35);
    cursor:pointer; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:5px;
    backdrop-filter:blur(8px); transition:border-color 0.2s, background 0.35s;
  }
  html[data-theme="light"] #gita-nav-btn {
    background:rgba(240,228,196,0.95); border-color:rgba(154,111,0,0.4);
  }
  #gita-nav-btn:hover { border-color:#c9a227; }
  #gita-nav-btn span {
    display:block; width:18px; height:2px; background:#e6c863;
    border-radius:1px; transition:transform 0.25s, opacity 0.25s, background 0.35s;
  }
  html[data-theme="light"] #gita-nav-btn span { background:#7a5200; }
  #gita-nav-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
  #gita-nav-btn.open span:nth-child(2){opacity:0;}
  #gita-nav-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

  /* ══════════════════════════════════════
     DRAWER
     ══════════════════════════════════════ */
  #gita-drawer {
    position:fixed; top:0; left:0; width:285px; height:100vh;
    background:#1a1035; border-right:1px solid rgba(201,162,39,0.2);
    z-index:8999; transform:translateX(-100%);
    transition:transform 0.3s cubic-bezier(.4,0,.2,1), background 0.35s;
    overflow-y:auto; padding:0 0 30px;
    box-shadow:4px 0 32px rgba(0,0,0,0.5);
  }
  html[data-theme="light"] #gita-drawer {
    background:#f5edd8; border-right-color:rgba(120,80,0,0.15);
    box-shadow:4px 0 32px rgba(0,0,0,0.12);
  }
  #gita-drawer.open { transform:translateX(0); }
  #gita-drawer-overlay {
    display:none; position:fixed; inset:0; z-index:8998;
    background:rgba(0,0,0,0.45); backdrop-filter:blur(2px);
  }
  #gita-drawer-overlay.open { display:block; }

  /* ── Drawer header (with home + close btn) ── */
  .nav-header {
    display:flex; align-items:center; justify-content:space-between;
    gap:10px; padding:14px 16px 14px 58px;
    border-bottom:1px solid rgba(201,162,39,0.15);
    background:rgba(0,0,0,0.15);
  }
  html[data-theme="light"] .nav-header {
    background:rgba(0,0,0,0.04); border-bottom-color:rgba(120,80,0,0.12);
  }
  .nav-home-link {
    font-family:'Mukta',sans-serif; font-size:13px; font-weight:600;
    color:rgba(201,162,39,0.8); text-decoration:none;
    background:rgba(201,162,39,0.12); border:1px solid rgba(201,162,39,0.28);
    padding:6px 12px; border-radius:20px;
    transition:all 0.2s; white-space:nowrap;
  }
  html[data-theme="light"] .nav-home-link {
    color:rgba(120,80,0,0.85); background:rgba(120,80,0,0.1);
    border-color:rgba(120,80,0,0.25);
  }
  .nav-home-link:hover { color:#e6c863; background:rgba(201,162,39,0.22); border-color:#c9a227; }
  html[data-theme="light"] .nav-home-link:hover { color:#7a5200; background:rgba(120,80,0,0.18); }
  .nav-header-title {
    font-family:'Tiro Devanagari Hindi',serif; color:#e6c863;
    font-size:13px; letter-spacing:0.04em; flex:1; text-align:right;
  }
  html[data-theme="light"] .nav-header-title { color:#7a5200; }

  /* ── Theme switcher row (inside drawer) ── */
  .nav-theme-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 18px; border-bottom:1px solid rgba(201,162,39,0.1);
  }
  html[data-theme="light"] .nav-theme-row { border-bottom-color:rgba(120,80,0,0.08); }
  .nav-theme-label {
    font-family:'Mukta',sans-serif; font-size:13px; color:rgba(201,162,39,0.7);
  }
  html[data-theme="light"] .nav-theme-label { color:rgba(120,80,0,0.65); }
  .nav-theme-pills {
    display:flex; gap:4px; padding:3px;
    background:rgba(0,0,0,0.2); border-radius:20px;
  }
  html[data-theme="light"] .nav-theme-pills { background:rgba(0,0,0,0.07); }
  .nav-theme-opt {
    padding:5px 14px; border-radius:16px; cursor:pointer;
    font-family:'Mukta',sans-serif; font-size:13px; font-weight:500;
    border:none; background:transparent; color:rgba(201,162,39,0.45); transition:all 0.2s;
  }
  html[data-theme="light"] .nav-theme-opt { color:rgba(120,80,0,0.45); }
  .nav-theme-opt.active { background:rgba(201,162,39,0.18); color:#e6c863; font-weight:600; }
  html[data-theme="light"] .nav-theme-opt.active { background:rgba(120,80,0,0.15); color:#7a5200; }

  /* ── Prev / Next quick links ── */
  .nav-prev-next {
    display:flex; gap:8px; padding:12px 18px;
    border-bottom:1px solid rgba(201,162,39,0.1);
  }
  html[data-theme="light"] .nav-prev-next { border-bottom-color:rgba(120,80,0,0.08); }
  .nav-prev-next a {
    flex:1; text-align:center; padding:9px 6px;
    background:rgba(255,255,255,0.04); border-radius:8px;
    border:1px solid rgba(201,162,39,0.18);
    font-family:'Tiro Devanagari Hindi',serif; font-size:13.5px;
    color:#cfc3a8; text-decoration:none; transition:all 0.2s;
  }
  html[data-theme="light"] .nav-prev-next a {
    background:rgba(0,0,0,0.03); border-color:rgba(120,80,0,0.15); color:#5a3a10;
  }
  .nav-prev-next a:hover { border-color:#c9a227; color:#e6c863; }
  html[data-theme="light"] .nav-prev-next a:hover { border-color:#9a6f00; color:#1a0f04; }

  /* ── Verse list ── */
  .nav-section-label {
    font-size:10.5px; color:rgba(201,162,39,0.45); letter-spacing:0.12em;
    text-transform:uppercase; padding:12px 18px 4px; font-weight:600;
  }
  html[data-theme="light"] .nav-section-label { color:rgba(120,80,0,0.4); }
  .nav-drawer a {
    display:flex; align-items:center; gap:10px;
    padding:10px 18px; font-family:'Tiro Devanagari Hindi',serif;
    font-size:15px; color:#cfc3a8; text-decoration:none;
    transition:background 0.15s, color 0.15s;
  }
  html[data-theme="light"] .nav-drawer a { color:#5a3a10; }
  .nav-drawer a:hover { background:rgba(201,162,39,0.07); color:#f3e9d2; }
  html[data-theme="light"] .nav-drawer a:hover { background:rgba(120,80,0,0.07); color:#1a0f04; }
  .nav-drawer a.active { background:rgba(201,162,39,0.11); color:#e6c863; border-left:3px solid #c9a227; }
  html[data-theme="light"] .nav-drawer a.active { background:rgba(120,80,0,0.09); color:#7a5200; border-left-color:#9a6f00; }
  .nav-num { font-size:11px; color:rgba(201,162,39,0.4); min-width:28px; font-family:'Mukta',sans-serif; }
  html[data-theme="light"] .nav-num { color:rgba(120,80,0,0.38); }

  /* ── Side swipe arrows ── */
  .gita-swipe-arrow {
    position:fixed; top:50%; transform:translateY(-50%);
    z-index:8990; width:34px; height:66px;
    display:flex; align-items:center; justify-content:center;
    color:rgba(201,162,39,0.25); font-size:20px;
    cursor:pointer; user-select:none;
    transition:color 0.2s, background 0.2s;
    background:rgba(24,15,46,0.35);
  }
  html[data-theme="light"] .gita-swipe-arrow {
    background:rgba(240,228,196,0.55); color:rgba(120,80,0,0.28);
  }
  .gita-swipe-arrow:hover { color:rgba(201,162,39,0.9); background:rgba(24,15,46,0.65); }
  html[data-theme="light"] .gita-swipe-arrow:hover { color:rgba(120,80,0,0.9); background:rgba(240,228,196,0.9); }
  #gita-arrow-prev { left:0; border-radius:0 8px 8px 0; }
  #gita-arrow-next { right:0; border-radius:8px 0 0 8px; }
  #gita-arrow-prev.hidden, #gita-arrow-next.hidden { display:none; }

  /* ── Swipe hint ── */
  #gita-swipe-hint {
    position:fixed; bottom:26px; left:50%; transform:translateX(-50%);
    background:rgba(24,15,46,0.9); border:1px solid rgba(201,162,39,0.3);
    border-radius:30px; padding:9px 20px; z-index:9001;
    font-family:'Mukta',sans-serif; font-size:13px; color:#cfc3a8;
    backdrop-filter:blur(8px); white-space:nowrap; pointer-events:none;
    animation:hintIn 0.4s ease, hintOut 0.4s ease 2.8s forwards;
  }
  html[data-theme="light"] #gita-swipe-hint {
    background:rgba(240,228,196,0.95); color:#5a3a10; border-color:rgba(120,80,0,0.3);
  }
  @keyframes hintIn  { from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }
  @keyframes hintOut { from{opacity:1;}to{opacity:0;} }

  /* ── Page flip animation ── */
  .gita-flip-left  { animation:flipL 0.22s ease forwards; }
  .gita-flip-right { animation:flipR 0.22s ease forwards; }
  @keyframes flipL  { to{opacity:0;transform:translateX(-40px);} }
  @keyframes flipR  { to{opacity:0;transform:translateX( 40px);} }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ════ Published verses from manifest ════ */
  let publishedVerses = [];
  fetch('../manifest.json')
    .then(r => r.json())
    .then(manifest => {
      const ch = manifest.chapters.find(c => c.num === currentChapter);
      if (ch) for (let i = 1; i <= ch.published; i++) publishedVerses.push(i);
      buildDrawer(); buildArrows();
    })
    .catch(() => {
      for (let i = 1; i <= 19; i++) publishedVerses.push(i);
      buildDrawer(); buildArrows();
    });

  /* ════ Hamburger button ════ */
  const navBtn = document.createElement('button');
  navBtn.id = 'gita-nav-btn';
  navBtn.setAttribute('aria-label', 'नेविगेशन');
  navBtn.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(navBtn);

  /* ════ Overlay + Drawer ════ */
  const overlay = document.createElement('div');
  overlay.id = 'gita-drawer-overlay';
  document.body.appendChild(overlay);

  const drawer = document.createElement('nav');
  drawer.id = 'gita-drawer';
  drawer.className = 'nav-drawer';
  document.body.appendChild(drawer);

  /* ════ Build drawer content ════ */
  function buildDrawer() {
    const prev = currentVerse - 1, next = currentVerse + 1;
    const hasPrev = publishedVerses.includes(prev);
    const hasNext = publishedVerses.includes(next);
    const isDark  = document.documentElement.getAttribute('data-theme') === 'dark';

    let h = '';

    /* ── Header: home link + title (no ✕ — hamburger already closes) ── */
    h += `<div class="nav-header">
      <a href="../index.html" class="nav-home-link">⌂ मुख्य पृष्ठ</a>
      <span class="nav-header-title">🪔 अध्याय ${currentChapter}</span>
    </div>`;

    /* Theme switcher — INSIDE drawer */
    h += `<div class="nav-theme-row">
      <span class="nav-theme-label">Theme चुनें:</span>
      <div class="nav-theme-pills">
        <button class="nav-theme-opt${isDark ? ' active' : ''}" onclick="gitaSetTheme('dark')">🌙 Dark</button>
        <button class="nav-theme-opt${!isDark ? ' active' : ''}" onclick="gitaSetTheme('light')">☀️ Light</button>
      </div>
    </div>`;

    /* Prev / Next */
    h += `<div class="nav-prev-next">`;
    h += hasPrev ? `<a href="../ch${currentChapter}/gita_${currentChapter}_${prev}.html">◄ श्लोक ${prev}</a>` : `<span style="flex:1"></span>`;
    h += hasNext ? `<a href="../ch${currentChapter}/gita_${currentChapter}_${next}.html">श्लोक ${next} ►</a>` : `<span style="flex:1"></span>`;
    h += `</div>`;

    /* Verse list */
    h += `<div class="nav-section-label">प्रकाशित श्लोक</div>`;
    publishedVerses.forEach(v => {
      const active = v === currentVerse ? ' active' : '';
      h += `<a href="../ch${currentChapter}/gita_${currentChapter}_${v}.html" class="${active}">
        <span class="nav-num">${currentChapter}.${v}</span> श्लोक ${v}
      </a>`;
    });

    /* Home link is in nav-home-row above */

    drawer.innerHTML = h;
  }

  /* ════ Side arrows ════ */
  function buildArrows() {
    const hasPrev = publishedVerses.includes(currentVerse - 1);
    const hasNext = publishedVerses.includes(currentVerse + 1);

    const pa = document.createElement('div');
    pa.id = 'gita-arrow-prev';
    pa.className = 'gita-swipe-arrow' + (hasPrev ? '' : ' hidden');
    pa.innerHTML = '‹';
    pa.addEventListener('click', () => goTo(currentVerse - 1, 'right'));
    document.body.appendChild(pa);

    const na = document.createElement('div');
    na.id = 'gita-arrow-next';
    na.className = 'gita-swipe-arrow' + (hasNext ? '' : ' hidden');
    na.innerHTML = '›';
    na.addEventListener('click', () => goTo(currentVerse + 1, 'left'));
    document.body.appendChild(na);
  }

  /* ════ Theme switch function (global) ════ */
  window.gitaSetTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    buildDrawer(); /* refresh active state in drawer */
  };

  /* ════ Drawer open / close ════ */
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    navBtn.classList.add('open');
    navBtn.style.display = 'none'; /* hide ☰ while drawer is open */
    setTimeout(() => {
      const a = drawer.querySelector('a.active');
      if (a) a.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 320);
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    navBtn.classList.remove('open');
    navBtn.style.display = ''; /* show ☰ again */
  }

  window.closeDrawer = closeDrawer; /* expose for onclick in HTML */
  navBtn.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ════ Navigate with animation ════ */
  function goTo(verse, dir) {
    if (!publishedVerses.includes(verse)) return;
    document.body.classList.add(dir === 'left' ? 'gita-flip-left' : 'gita-flip-right');
    setTimeout(() => {
      window.location.href = `../ch${currentChapter}/gita_${currentChapter}_${verse}.html`;
    }, 200);
  }

  /* ════ Touch swipe ════ */
  let tx = 0, ty = 0, tt = 0;
  document.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (drawer.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Date.now() - tt > 400 || Math.abs(dx) < 50) return;
    const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
    if (angle > 35 && angle < 145) return;
    dx < 0 ? goTo(currentVerse + 1, 'left') : goTo(currentVerse - 1, 'right');
  }, { passive: true });

  /* ════ Keyboard ════ */
  document.addEventListener('keydown', e => {
    if (drawer.classList.contains('open')) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') goTo(currentVerse + 1, 'left');
    if (e.key === 'ArrowLeft')  goTo(currentVerse - 1, 'right');
  });

  /* ════ First-visit hint ════ */
  const hk = `gita_hint_v3_ch${currentChapter}`;
  if (!sessionStorage.getItem(hk)) {
    sessionStorage.setItem(hk, '1');
    setTimeout(() => {
      const h = document.createElement('div');
      h.id = 'gita-swipe-hint';
      h.textContent = '← स्वाइप करें · ‹ › बटन · या ← → keys';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3500);
    }, 1800);
  }

})();
