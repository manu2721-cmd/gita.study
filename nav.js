/* Gita — shared side-navigation drawer (v2, manifest-driven)
   Include with: <script src="nav.js"></script> right before </body>
   Works from repo root (index.html) AND from inside any ch{N}/ subfolder.
   To add a new verse: just bump "published" in manifest.json — no edits needed here.
   To add a new chapter: it's already listed in manifest.json with published:0 — nothing to do here either. */
(function(){

  var navScriptEl = document.currentScript;
  var baseUrl = navScriptEl.src.replace(/nav\.js(\?.*)?$/, '');

  function currentChapterFromPath(){
    var path = location.pathname;
    var m = path.match(/\/ch(\d+)\//);
    if(m) return parseInt(m[1], 10);
    m = path.match(/gita_(\d+)_(\d+)\.html/);
    return m ? parseInt(m[1], 10) : null;
  }
  function currentVerseFromPath(){
    var m = location.pathname.match(/gita_(\d+)_(\d+)\.html/);
    return m ? parseInt(m[2], 10) : null;
  }

  // 1. Inject CSS
  var style = document.createElement('style');
  style.textContent = [
    '.navtoggle{position:fixed;top:18px;left:18px;z-index:60;width:44px;height:44px;border-radius:50%;background:var(--bg-deep-alt,#241a42);border:1px solid var(--gold,#c9a227);color:var(--gold-light,#e6c863);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow,0 18px 50px rgba(0,0,0,0.45));font-size:18px;}',
    '.navtoggle:hover{background:rgba(201,162,39,0.18);}',
    '.navoverlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);opacity:0;pointer-events:none;transition:opacity 0.25s ease;z-index:58;}',
    '.navoverlay.open{opacity:1;pointer-events:auto;}',
    '.navdrawer{position:fixed;top:0;left:0;height:100vh;width:300px;max-width:85vw;background:var(--bg-deep-alt,#241a42);border-right:1px solid var(--line,rgba(201,162,39,0.25));box-shadow:var(--shadow,0 18px 50px rgba(0,0,0,0.45));z-index:59;transform:translateX(-100%);transition:transform 0.3s ease;overflow-y:auto;padding:20px 16px 30px;font-family:"Mukta",sans-serif;}',
    '.navdrawer.open{transform:translateX(0);}',
    '.navdrawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line,rgba(201,162,39,0.25));}',
    '.navdrawer-title{font-family:"Tiro Devanagari Hindi",serif;font-size:16px;color:var(--gold-light,#e6c863);}',
    '.navdrawer-close{background:transparent;border:none;color:var(--cream-dim,#cfc3a8);font-size:20px;cursor:pointer;line-height:1;}',
    '.navdrawer-close:hover{color:var(--cream,#f3e9d2);}',
    '.navchapwrap{border-bottom:1px solid var(--line,rgba(201,162,39,0.25));}',
    '.navchapwrap:last-child{border-bottom:none;}',
    '.navchaphead{width:100%;display:flex;align-items:center;gap:8px;background:transparent;border:none;padding:10px 4px;cursor:pointer;text-align:right;font-family:"Mukta",sans-serif;}',
    '.navchaphead:hover{background:rgba(255,255,255,0.03);}',
    '.navchap-num{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:rgba(201,162,39,0.1);border:1px solid var(--line,rgba(201,162,39,0.25));display:flex;align-items:center;justify-content:center;font-size:11.5px;color:var(--cream-dim,#cfc3a8);font-family:"Tiro Devanagari Hindi",serif;}',
    '.navchaphead.navchap-current .navchap-num{border-color:var(--gold,#c9a227);color:var(--gold-light,#e6c863);}',
    '.navchap-title{flex:1;font-size:13.5px;color:var(--cream,#f3e9d2);font-family:"Tiro Devanagari Hindi",serif;text-align:left;}',
    '.navchaphead.navchap-empty .navchap-title{color:var(--cream-dim,#cfc3a8);}',
    '.navchap-count{font-size:11px;color:var(--cream-dim,#cfc3a8);flex-shrink:0;}',
    '.navchapbody{max-height:0;overflow:hidden;transition:max-height 0.25s ease;padding:0 4px;}',
    '.navchapbody.open{max-height:400px;padding:4px 4px 12px;}',
    '.navverse-row{display:flex;flex-wrap:wrap;gap:6px;}',
    '.navverse{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;text-decoration:none;color:var(--cream-dim,#cfc3a8);border:1px solid var(--line,rgba(201,162,39,0.25));background:rgba(255,255,255,0.02);}',
    '.navverse:hover{border-color:var(--gold,#c9a227);color:var(--cream,#f3e9d2);}',
    '.navverse.active{background:rgba(201,162,39,0.18);border-color:var(--gold,#c9a227);color:var(--gold-light,#e6c863);}',
    '.navchap-soon{font-size:12px;color:var(--cream-dim,#cfc3a8);font-style:italic;padding:6px 2px;}',
    '.navdrawer-footer{margin-top:10px;padding-top:12px;border-top:1px solid var(--line,rgba(201,162,39,0.25));text-align:center;}',
    '.navdrawer-footer a{color:var(--cream-dim,#cfc3a8);font-size:12.5px;text-decoration:none;}',
    '.navdrawer-footer a:hover{color:var(--gold-light,#e6c863);}',
    '@media (max-width:560px){.navtoggle{top:12px;left:12px;width:40px;height:40px;}}'
  ].join('\n');
  document.head.appendChild(style);

  // 2. Inject HTML skeleton
  var wrapper = document.createElement('div');
  wrapper.innerHTML =
    '<button class="navtoggle" id="navToggleBtn" aria-label="अध्याय व श्लोक सूची खोलें">☰</button>' +
    '<div class="navoverlay" id="navOverlay"></div>' +
    '<nav class="navdrawer" id="navDrawer">' +
      '<div class="navdrawer-head">' +
        '<span class="navdrawer-title">अध्याय व श्लोक सूची</span>' +
        '<button class="navdrawer-close" id="navCloseBtn" aria-label="बंद करें">×</button>' +
      '</div>' +
      '<div id="navChapterList"></div>' +
      '<div class="navdrawer-footer"><a id="navRootLink" href="#">← मुख्य पुस्तक सूची</a></div>' +
    '</nav>';
  while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

  var toggleBtn = document.getElementById('navToggleBtn');
  var closeBtn = document.getElementById('navCloseBtn');
  var overlay = document.getElementById('navOverlay');
  var drawer = document.getElementById('navDrawer');
  function openNav(){ drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeNav(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }
  toggleBtn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);
  document.getElementById('navRootLink').href = baseUrl + 'index.html';

  // 3. Fetch manifest and build the chapter accordion
  fetch(baseUrl + 'manifest.json')
    .then(function(r){ return r.json(); })
    .then(function(manifest){
      var curCh = currentChapterFromPath();
      var curVerse = currentVerseFromPath();
      var listEl = document.getElementById('navChapterList');

      manifest.chapters.forEach(function(ch){
        var chWrap = document.createElement('div');
        chWrap.className = 'navchapwrap';

        var header = document.createElement('button');
        header.className = 'navchaphead' + (ch.published === 0 ? ' navchap-empty' : '') + (ch.num === curCh ? ' navchap-current' : '');
        header.innerHTML = '<span class="navchap-num">' + ch.num + '</span><span class="navchap-title">' + ch.title + '</span><span class="navchap-count">' + ch.published + '/' + ch.totalVerses + '</span>';

        var body = document.createElement('div');
        body.className = 'navchapbody' + (ch.num === curCh ? ' open' : '');

        if (ch.published > 0) {
          var row = document.createElement('div');
          row.className = 'navverse-row';
          for (var v = 1; v <= ch.published; v++) {
            var a = document.createElement('a');
            var fname = 'gita_' + ch.num + '_' + v + '.html';
            a.href = baseUrl + (ch.folder ? ch.folder + '/' : '') + fname;
            a.className = 'navverse' + (ch.num === curCh && v === curVerse ? ' active' : '');
            a.textContent = v;
            row.appendChild(a);
          }
          body.appendChild(row);
        } else {
          var note = document.createElement('div');
          note.className = 'navchap-soon';
          note.textContent = 'जल्द आरंभ होगा';
          body.appendChild(note);
        }

        header.addEventListener('click', (function(bodyEl){
          return function(){ bodyEl.classList.toggle('open'); };
        })(body));

        chWrap.appendChild(header);
        chWrap.appendChild(body);
        listEl.appendChild(chWrap);
      });
    })
    .catch(function(err){ console.error('nav.js: manifest.json load failed', err); });

})();
