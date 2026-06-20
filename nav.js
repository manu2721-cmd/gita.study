/* Gita Chapter 18 — shared side-navigation drawer
   Include with: <script src="nav.js"></script> right before </body>
   Works on any page that uses the existing --gold / --cream / --bg-deep-alt CSS variables. */
(function(){

  var verses = [
    {n:1, label:'श्लो.१', file:'gita_18_1.html'},
    {n:2, label:'श्लो.२', file:'gita_18_2.html'},
    {n:3, label:'श्लो.३', file:'gita_18_3.html'},
    {n:4, label:'श्लो.४', file:'gita_18_4.html'},
    {n:5, label:'श्लो.५', file:'gita_18_5.html'},
    {n:6, label:'श्लो.६', file:'gita_18_6.html'},
    {n:7, label:'श्लो.७', file:'gita_18_7.html'},
    {n:8, label:'श्लो.८', file:'gita_18_8.html'},
    {n:9, label:'श्लो.९', file:'gita_18_9.html'},
    {n:10, label:'श्लो.१०', file:'gita_18_10.html'},
    {n:11, label:'श्लो.११', file:'gita_18_11.html'}
    /* Add new verses here as they are published — that's the only edit needed. */
  ];

  // 1. Inject CSS
  var style = document.createElement('style');
  style.textContent = [
    '.navtoggle{position:fixed;top:18px;left:18px;z-index:60;width:44px;height:44px;border-radius:50%;background:var(--bg-deep-alt,#241a42);border:1px solid var(--gold,#c9a227);color:var(--gold-light,#e6c863);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow,0 18px 50px rgba(0,0,0,0.45));font-size:18px;}',
    '.navtoggle:hover{background:rgba(201,162,39,0.18);}',
    '.navoverlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);opacity:0;pointer-events:none;transition:opacity 0.25s ease;z-index:58;}',
    '.navoverlay.open{opacity:1;pointer-events:auto;}',
    '.navdrawer{position:fixed;top:0;left:0;height:100vh;width:280px;max-width:82vw;background:var(--bg-deep-alt,#241a42);border-right:1px solid var(--line,rgba(201,162,39,0.25));box-shadow:var(--shadow,0 18px 50px rgba(0,0,0,0.45));z-index:59;transform:translateX(-100%);transition:transform 0.3s ease;overflow-y:auto;padding:20px 16px 30px;font-family:"Mukta",sans-serif;}',
    '.navdrawer.open{transform:translateX(0);}',
    '.navdrawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--line,rgba(201,162,39,0.25));}',
    '.navdrawer-title{font-family:"Tiro Devanagari Hindi",serif;font-size:16px;color:var(--gold-light,#e6c863);}',
    '.navdrawer-close{background:transparent;border:none;color:var(--cream-dim,#cfc3a8);font-size:20px;cursor:pointer;line-height:1;}',
    '.navdrawer-close:hover{color:var(--cream,#f3e9d2);}',
    '.navlist{display:flex;flex-direction:column;gap:8px;}',
    '.navitem{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;text-decoration:none;color:var(--cream-dim,#cfc3a8);font-size:13.5px;border:1px solid transparent;transition:all 0.15s ease;}',
    '.navitem:hover{background:rgba(255,255,255,0.04);color:var(--cream,#f3e9d2);}',
    '.navitem.active{background:rgba(201,162,39,0.12);border-color:var(--gold,#c9a227);color:var(--gold-light,#e6c863);}',
    '.navitem .navnum{font-family:"Tiro Devanagari Hindi",serif;flex-shrink:0;width:30px;height:30px;border-radius:50%;background:rgba(201,162,39,0.1);border:1px solid var(--line,rgba(201,162,39,0.25));display:flex;align-items:center;justify-content:center;font-size:12.5px;}',
    '.navitem.active .navnum{border-color:var(--gold,#c9a227);}',
    '.navdrawer-footer{margin-top:16px;padding-top:14px;border-top:1px solid var(--line,rgba(201,162,39,0.25));text-align:center;}',
    '.navdrawer-footer a{color:var(--cream-dim,#cfc3a8);font-size:12.5px;text-decoration:none;}',
    '.navdrawer-footer a:hover{color:var(--gold-light,#e6c863);}',
    '@media (max-width:560px){.navtoggle{top:12px;left:12px;width:40px;height:40px;}}'
  ].join('\n');
  document.head.appendChild(style);

  // 2. Inject HTML
  var wrapper = document.createElement('div');
  wrapper.innerHTML =
    '<button class="navtoggle" id="navToggleBtn" aria-label="श्लोक सूची खोलें">☰</button>' +
    '<div class="navoverlay" id="navOverlay"></div>' +
    '<nav class="navdrawer" id="navDrawer">' +
      '<div class="navdrawer-head">' +
        '<span class="navdrawer-title">श्लोक सूची</span>' +
        '<button class="navdrawer-close" id="navCloseBtn" aria-label="बंद करें">×</button>' +
      '</div>' +
      '<div class="navlist" id="navList"></div>' +
      '<div class="navdrawer-footer"><a href="index.html">← मुख्य सूची पृष्ठ</a></div>' +
    '</nav>';
  while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

  // 3. Populate list + behavior
  var listEl = document.getElementById('navList');
  var currentFile = location.pathname.split('/').pop();
  verses.forEach(function(v){
    var a = document.createElement('a');
    a.className = 'navitem' + (v.file === currentFile ? ' active' : '');
    a.href = v.file;
    a.innerHTML = '<span class="navnum">' + v.n + '</span><span>' + v.label + '</span>';
    listEl.appendChild(a);
  });

  var toggleBtn = document.getElementById('navToggleBtn');
  var closeBtn = document.getElementById('navCloseBtn');
  var overlay = document.getElementById('navOverlay');
  var drawer = document.getElementById('navDrawer');
  function openNav(){ drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeNav(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }
  toggleBtn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

})();
