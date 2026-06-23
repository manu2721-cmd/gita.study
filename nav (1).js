/**
 * nav.js — Bhagavad Gita Study Platform
 * Features: hamburger menu · swipe/keyboard navigation · light/dark theme toggle
 * Place at repo root. Verse files include: <script src="../nav.js"></script>
 */

(function () {

  /* ─── 1. Parse chapter & verse from URL ─── */
  const pathMatch = window.location.pathname.match(/gita_(\d+)_(\d+)\.html/);
  const currentChapter = pathMatch ? parseInt(pathMatch[1]) : 18;
  const currentVerse   = pathMatch ? parseInt(pathMatch[2]) : 1;

  /* ─── 2. Theme init (before paint to avoid flash) ─── */
  const THEME_KEY = 'gita_theme';
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  /* ─── 3. Inject all CSS ─── */
  const css = `

    /* ════════════════════════════════════
       LIGHT THEME — पांडुलिपि (manuscript)
       Override :root vars when html[data-theme=light]
       ════════════════════════════════════ */
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
      background: linear-gradient(160deg,#f5edd8 0%,#faf4e6 50%,#f0e8d0 100%);
    }

    /* smooth transition when switching */
    body, .hero, .panel-shell, .word-card, .example,
    .flashcard-face, .cmp-table th, .cmp-table td,
    .gram-table th, .gram-table td, .cheat-card,
    .contrast-card, .triputi-box, .guna-card, .cond-card,
    .walk-stage, .result-box, .three-card, .flow-box {
      transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
    }

    /* ── hamburger button ── */
    #gita-nav-btn {
      position:fixed; top:14px; left:14px; z-index:9000;
      width:42px; height:42px; border-radius:50%;
      background:rgba(24,15,46,0.92); border:1px solid rgba(201,162,39,0.35);
      cursor:pointer; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:5px;
      backdrop-filter:blur(8px); transition:border-color 0.2s, background 0.35s;
    }
    html[data-theme="light"] #gita-nav-btn {
      background:rgba(240,228,196,0.95);
      border-color:rgba(154,111,0,0.4);
    }
    #gita-nav-btn:hover { border-color:#c9a227; }
    html[data-theme="light"] #gita-nav-btn:hover { border-color:#9a6f00; }
    #gita-nav-btn span {
      display:block; width:18px; height:2px;
      background:#e6c863; border-radius:1px;
      transition:transform 0.25s, opacity 0.25s, background 0.35s;
    }
    html[data-theme="light"] #gita-nav-btn span { background:#7a5200; }
    #gita-nav-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    #gita-nav-btn.open span:nth-child(2){opacity:0;}
    #gita-nav-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}

    /* ── theme toggle button ── */
    #gita-theme-btn {
      position:fixed; top:14px; right:14px; z-index:9000;
      width:42px; height:42px; border-radius:50%;
      background:rgba(24,15,46,0.92); border:1px solid rgba(201,162,39,0.35);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      font-size:18px; backdrop-filter:blur(8px);
      transition:border-color 0.2s, background 0.35s, transform 0.3s;
      user-select:none;
    }
    html[data-theme="light"] #gita-theme-btn {
      background:rgba(240,228,196,0.95);
      border-color:rgba(154,111,0,0.4);
    }
    #gita-theme-btn:hover {
      border-color:#c9a227;
      transform:rotate(20deg) scale(1.05);
    }
    html[data-theme="light"] #gita-theme-btn:hover { border-color:#9a6f00; }

    /* ── drawer ── */
    #gita-drawer {
      position:fixed; top:0; left:0; width:280px; height:100vh;
      background:#1a1035; border-right:1px solid rgba(201,162,39,0.2);
      z-index:8999; transform:translateX(-100%);
      transition:transform 0.3s cubic-bezier(.4,0,.2,1), background 0.35s;
      overflow-y:auto; padding:70px 0 30px;
      box-shadow:4px 0 32px rgba(0,0,0,0.5);
    }
    html[data-theme="light"] #gita-drawer {
      background:#f5edd8;
      border-right-color:rgba(120,80,0,0.15);
      box-shadow:4px 0 32px rgba(0,0,0,0.12);
    }
    #gita-drawer.open { transform:translateX(0); }

    #gita-drawer-overlay {
      display:none; position:fixed; inset:0; z-index:8998;
      background:rgba(0,0,0,0.45); backdrop-filter:blur(2px);
    }
    #gita-drawer-overlay.open { display:block; }

    .nav-drawer-title {
      font-family:'Tiro Devanagari Hindi',serif;
      color:#e6c863; font-size:13px; letter-spacing:0.1em;
      text-transform:uppercase; padding:0 20px 12px;
      border-bottom:1px solid rgba(201,162,39,0.15); margin-bottom:8px;
      transition:color 0.35s, border-color 0.35s;
    }
    html[data-theme="light"] .nav-drawer-title {
      color:#7a5200;
      border-bottom-color:rgba(120,80,0,0.12);
    }

    .nav-theme-toggle-row {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 20px 14px; border-bottom:1px solid rgba(201,162,39,0.1);
      margin-bottom:6px;
    }
    html[data-theme="light"] .nav-theme-toggle-row {
      border-bottom-color:rgba(120,80,0,0.08);
    }
    .nav-theme-label {
      font-family:'Mukta',sans-serif; font-size:12.5px;
      color:rgba(201,162,39,0.6);
    }
    html[data-theme="light"] .nav-theme-label { color:rgba(120,80,0,0.6); }
    .nav-theme-switch {
      display:flex; gap:4px; background:rgba(255,255,255,0.05);
      border-radius:20px; padding:3px;
      border:1px solid rgba(201,162,39,0.2);
    }
    html[data-theme="light"] .nav-theme-switch {
      background:rgba(0,0,0,0.05);
      border-color:rgba(120,80,0,0.15);
    }
    .nav-theme-opt {
      padding:4px 12px; border-radius:16px; cursor:pointer;
      font-family:'Mukta',sans-serif; font-size:12px; border:none;
      background:transparent; color:rgba(201,162,39,0.5); transition:all 0.2s;
    }
    html[data-theme="light"] .nav-theme-opt { color:rgba(120,80,0,0.5); }
    .nav-theme-opt.active {
      background:rgba(201,162,39,0.2); color:#e6c863; font-weight:600;
    }
    html[data-theme="light"] .nav-theme-opt.active {
      background:rgba(120,80,0,0.15); color:#7a5200;
    }

    .nav-drawer-section-label {
      font-size:10.5px; color:rgba(201,162,39,0.5); letter-spacing:0.12em;
      text-transform:uppercase; padding:8px 20px 4px; font-weight:600;
    }
    html[data-theme="light"] .nav-drawer-section-label { color:rgba(120,80,0,0.45); }

    .nav-drawer a {
      display:flex; align-items:center; gap:10px;
      padding:10px 20px; font-family:'Tiro Devanagari Hindi',serif;
      font-size:15px; color:#cfc3a8; text-decoration:none;
      transition:background 0.15s, color 0.15s;
    }
    html[data-theme="light"] .nav-drawer a { color:#5a3a10; }
    .nav-drawer a:hover { background:rgba(201,162,39,0.08); color:#f3e9d2; }
    html[data-theme="light"] .nav-drawer a:hover {
      background:rgba(120,80,0,0.08); color:#1a0f04;
    }
    .nav-drawer a.active {
      background:rgba(201,162,39,0.12); color:#e6c863;
      border-left:3px solid #c9a227;
    }
    html[data-theme="light"] .nav-drawer a.active {
      background:rgba(120,80,0,0.1); color:#7a5200;
      border-left-color:#9a6f00;
    }
    .nav-drawer a .nav-num {
      font-size:11px; color:rgba(201,162,39,0.45); min-width:26px;
      font-family:'Mukta',sans-serif;
    }
    html[data-theme="light"] .nav-drawer a .nav-num { color:rgba(120,80,0,0.4); }

    .nav-prev-next {
      display:flex; gap:8px; padding:16px 20px 8px;
      border-top:1px solid rgba(201,162,39,0.15); margin-top:10px;
    }
    html[data-theme="light"] .nav-prev-next { border-top-color:rgba(120,80,0,0.1); }
    .nav-prev-next a {
      flex:1; text-align:center; padding:10px 6px !important;
      background:rgba(255,255,255,0.03); border-radius:8px !important;
      border:1px solid rgba(201,162,39,0.2) !important; font-size:13px !important;
    }
    html[data-theme="light"] .nav-prev-next a {
      background:rgba(0,0,0,0.03);
      border-color:rgba(120,80,0,0.15) !important;
    }
    .nav-prev-next a:hover { border-color:#c9a227 !important; }
    html[data-theme="light"] .nav-prev-next a:hover { border-color:#9a6f00 !important; }

    /* ── side arrows ── */
    .gita-swipe-arrow {
      position:fixed; top:50%; transform:translateY(-50%);
      z-index:8990; width:36px; height:70px;
      display:flex; align-items:center; justify-content:center;
      color:rgba(201,162,39,0.28); font-size:22px;
      cursor:pointer; user-select:none;
      transition:color 0.2s, background 0.2s, opacity 0.35s;
      background:rgba(24,15,46,0.4);
    }
    html[data-theme="light"] .gita-swipe-arrow {
      background:rgba(240,228,196,0.6);
      color:rgba(120,80,0,0.3);
    }
    .gita-swipe-arrow:hover {
      color:rgba(201,162,39,0.85); background:rgba(24,15,46,0.7);
    }
    html[data-theme="light"] .gita-swipe-arrow:hover {
      color:rgba(120,80,0,0.9); background:rgba(240,228,196,0.9);
    }
    #gita-arrow-prev { left:0; border-radius:0 8px 8px 0; }
    #gita-arrow-next { right:0; border-radius:8px 0 0 8px; }
    #gita-arrow-prev.hidden, #gita-arrow-next.hidden { display:none; }

    /* ── swipe hint toast ── */
    #gita-swipe-hint {
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
      background:rgba(24,15,46,0.9); border:1px solid rgba(201,162,39,0.3);
      border-radius:30px; padding:9px 20px; z-index:9001;
      font-family:'Mukta',sans-serif; font-size:13px; color:#cfc3a8;
      backdrop-filter:blur(8px); white-space:nowrap; pointer-events:none;
      animation:hintIn 0.4s ease, hintOut 0.4s ease 2.8s forwards;
    }
    html[data-theme="light"] #gita-swipe-hint {
      background:rgba(240,228,196,0.95); color:#5a3a10;
      border-color:rgba(120,80,0,0.3);
    }
    @keyframes hintIn  { from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }
    @keyframes hintOut { from{opacity:1;}to{opacity:0;} }

    /* ── page flip animation ── */
    .gita-flip-left  { animation:flipL 0.22s ease forwards; }
    .gita-flip-right { animation:flipR 0.22s ease forwards; }
    @keyframes flipL  { to{opacity:0;transform:translateX(-40px);} }
    @keyframes flipR  { to{opacity:0;transform:translateX( 40px);} }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ─── 4. Published verses from manifest ─── */
  let publishedVerses = [];

  fetch('../manifest.json')
    .then(r => r.json())
    .then(manifest => {
      const ch = manifest.chapters.find(c => c.num === currentChapter);
      if (ch) for (let i = 1; i <= ch.published; i++) publishedVerses.push(i);
      buildDrawerContent();
      buildArrows();
    })
    .catch(() => {
      for (let i = 1; i <= 19; i++) publishedVerses.push(i);
      buildDrawerContent();
      buildArrows();
    });

  /* ─── 5. Hamburger button ─── */
  const navBtn = document.createElement('button');
  navBtn.id = 'gita-nav-btn';
  navBtn.setAttribute('aria-label', 'नेविगेशन');
  navBtn.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(navBtn);

  /* ─── 6. Theme toggle button (top-right) ─── */
  const themeBtn = document.createElement('button');
  themeBtn.id = 'gita-theme-btn';
  themeBtn.setAttribute('aria-label', 'Theme बदलें');
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeBtn.title = savedTheme === 'dark' ? 'Light theme पर जाएँ' : 'Dark theme पर जाएँ';
  document.body.appendChild(themeBtn);

  /* ─── 7. Overlay + Drawer ─── */
  const overlay = document.createElement('div');
  overlay.id = 'gita-drawer-overlay';
  document.body.appendChild(overlay);

  const drawer = document.createElement('nav');
  drawer.id = 'gita-drawer';
  drawer.className = 'nav-drawer';
  document.body.appendChild(drawer);

  function buildDrawerContent() {
    const prev = currentVerse - 1;
    const next = currentVerse + 1;
    const hasPrev = publishedVerses.includes(prev);
    const hasNext = publishedVerses.includes(next);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    let html = `<div class="nav-drawer-title">🪔 अध्याय ${currentChapter} — नेविगेशन</div>`;

    /* theme switch inside drawer */
    html += `<div class="nav-theme-toggle-row">
      <span class="nav-theme-label">Theme:</span>
      <div class="nav-theme-switch">
        <button class="nav-theme-opt${isDark ? ' active' : ''}" onclick="gitaSetTheme('dark')">🌙 Dark</button>
        <button class="nav-theme-opt${!isDark ? ' active' : ''}" onclick="gitaSetTheme('light')">☀️ Light</button>
      </div>
    </div>`;

    /* prev / next quick links */
    html += `<div class="nav-prev-next">`;
    html += hasPrev
      ? `<a href="../ch${currentChapter}/gita_${currentChapter}_${prev}.html">◄ श्लोक ${prev}</a>`
      : `<span style="flex:1"></span>`;
    html += hasNext
      ? `<a href="../ch${currentChapter}/gita_${currentChapter}_${next}.html">श्लोक ${next} ►</a>`
      : `<span style="flex:1"></span>`;
    html += `</div>`;

    /* verse list */
    html += `<div class="nav-drawer-section">
      <div class="nav-drawer-section-label">प्रकाशित श्लोक</div>`;
    publishedVerses.forEach(v => {
      const active = v === currentVerse ? ' active' : '';
      html += `<a href="../ch${currentChapter}/gita_${currentChapter}_${v}.html" class="${active}">
        <span class="nav-num">${currentChapter}.${v}</span> श्लोक ${v}
      </a>`;
    });
    html += `</div>`;

    html += `<div style="padding:16px 20px 0;border-top:1px solid rgba(201,162,39,0.1);margin-top:8px;">
      <a href="../index.html" style="font-size:13px;">⌂ मुख्य पृष्ठ</a>
    </div>`;

    drawer.innerHTML = html;
  }

  /* ─── 8. Side arrows ─── */
  function buildArrows() {
    const hasPrev = publishedVerses.includes(currentVerse - 1);
    const hasNext = publishedVerses.includes(currentVerse + 1);

    const pa = document.createElement('div');
    pa.id = 'gita-arrow-prev';
    pa.className = 'gita-swipe-arrow' + (hasPrev ? '' : ' hidden');
    pa.innerHTML = '‹';
    pa.title = `श्लोक ${currentVerse - 1}`;
    pa.addEventListener('click', () => goTo(currentVerse - 1, 'right'));
    document.body.appendChild(pa);

    const na = document.createElement('div');
    na.id = 'gita-arrow-next';
    na.className = 'gita-swipe-arrow' + (hasNext ? '' : ' hidden');
    na.innerHTML = '›';
    na.title = `श्लोक ${currentVerse + 1}`;
    na.addEventListener('click', () => goTo(currentVerse + 1, 'left'));
    document.body.appendChild(na);
  }

  /* ─── 9. Theme switch logic ─── */
  window.gitaSetTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeBtn.title = theme === 'dark' ? 'Light theme पर जाएँ' : 'Dark theme पर जाएँ';
    buildDrawerContent(); /* refresh active state */
  };

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    gitaSetTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ─── 10. Drawer open / close ─── */
  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    navBtn.classList.add('open');
    setTimeout(() => {
      const a = drawer.querySelector('a.active');
      if (a) a.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 320);
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    navBtn.classList.remove('open');
  }

  navBtn.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer()
  );
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ─── 11. Navigate with animation ─── */
  function goTo(verse, direction) {
    if (!publishedVerses.includes(verse)) return;
    document.body.classList.add(direction === 'left' ? 'gita-flip-left' : 'gita-flip-right');
    setTimeout(() => {
      window.location.href = `../ch${currentChapter}/gita_${currentChapter}_${verse}.html`;
    }, 200);
  }

  /* ─── 12. Touch swipe ─── */
  let tx = 0, ty = 0, tt = 0;
  document.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    tt = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (drawer.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Date.now() - tt > 400) return;
    if (Math.abs(dx) < 50) return;
    const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
    if (angle > 35 && angle < 145) return;
    dx < 0 ? goTo(currentVerse + 1, 'left') : goTo(currentVerse - 1, 'right');
  }, { passive: true });

  /* ─── 13. Keyboard arrows ─── */
  document.addEventListener('keydown', e => {
    if (drawer.classList.contains('open')) return;
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') goTo(currentVerse + 1, 'left');
    if (e.key === 'ArrowLeft')  goTo(currentVerse - 1, 'right');
  });

  /* ─── 14. First-visit swipe hint ─── */
  const hintKey = `gita_swipe_hint_ch${currentChapter}`;
  if (!sessionStorage.getItem(hintKey)) {
    sessionStorage.setItem(hintKey, '1');
    setTimeout(() => {
      const h = document.createElement('div');
      h.id = 'gita-swipe-hint';
      h.textContent = '← स्वाइप करें · ‹ › बटन · या ← → keys';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3500);
    }, 1800);
  }

})();
