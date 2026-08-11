/* ============================================================
   VIEWS — one renderer per page kind.
   ============================================================ */

const Views = (function(){
  const {el, esc, colorFor, initials, fmtDate, words} = UI;

  /* ---------- shared header ---------- */
  function head(mod){
    const h = el("div","page-head");
    if(mod.eyebrow) h.appendChild(el("div","eyebrow", mod.eyebrow));
    h.appendChild(el("h1","page-title", mod.title || mod.label));
    if(mod.intro){ const p = el("div","page-intro"); p.textContent = mod.intro; h.appendChild(p); }
    return h;
  }

  /* ---------- settings helpers ---------- */
  const settings = () => Store.getDoc("__settings");
  function deadline(){
    const d = settings().deadline;
    return d ? new Date(d + "T23:59:00") : null;
  }
  function suggestedDate(daysBefore){
    const d = deadline(); if(!d || daysBefore==null || daysBefore==="") return null;
    const x = new Date(d.getTime() - daysBefore*86400000);
    return x;
  }
  const shortDate = d => d ? d.toLocaleDateString(undefined,{day:"numeric",month:"short"}) : "";

  /* ---------- doc completeness ---------- */
  function docFields(mod){
    return (mod.sections||[]).flatMap(s => s.fields);
  }
  function docCompleteness(modId){
    const mod = SCHEMA[modId]; if(!mod || mod.kind!=="doc") return 0;
    const d = Store.getDoc(modId);
    const fs = docFields(mod).filter(f => f.t !== "check");
    if(!fs.length) return 0;
    const filled = fs.filter(f => { const v = d[f.k]; return v!=null && String(v).trim()!==""; }).length;
    return filled / fs.length;
  }

  /* ============================================================
     COLLECTION
     ============================================================ */
  function renderCollection(modId, stage){
    const mod = SCHEMA[modId];
    stage.appendChild(head(mod));

    const statStrip = el("div","stat-strip");
    stage.appendChild(statStrip);

    /* toolbar */
    const bar = el("div","toolbar");
    const addBtn = el("button","btn","+ New");
    addBtn.addEventListener("click", () => {
      const id = Store.add(modId, {});
      setTimeout(()=>{
        const card = list.querySelector('[data-id="'+id+'"]');
        if(card){ card._open(); card.scrollIntoView({behavior:"smooth",block:"center"});
          const first = card.querySelector("input,textarea,select"); if(first) first.focus(); }
      }, 60);
    });
    bar.appendChild(addBtn);

    const search = el("input"); search.type="search"; search.placeholder="Search these…";
    bar.appendChild(search);

    let statusSel = null;
    if(mod.statusField && mod.statusOptions){
      statusSel = el("select");
      statusSel.appendChild(new Option("All statuses",""));
      mod.statusOptions.forEach(o=>statusSel.appendChild(new Option(o,o)));
      bar.appendChild(statusSel);
    }

    let ownerSel = null;
    const hasOwner = mod.fields.some(f=>f.t==="person");
    if(hasOwner){
      ownerSel = el("select");
      bar.appendChild(ownerSel);
    }

    const sortSel = el("select");
    ["Default order","Most votes","Highest score","Newest first","A–Z"].forEach(o=>sortSel.appendChild(new Option(o,o)));
    bar.appendChild(sortSel);

    const onlyConf = el("label","chk");
    if(mod.confirmable){
      const cb = el("input"); cb.type="checkbox";
      onlyConf.appendChild(cb); onlyConf.appendChild(el("span",null,"In final only"));
      onlyConf._cb = cb;
      bar.appendChild(onlyConf);
      cb.addEventListener("change", renderList);
    }

    stage.appendChild(bar);

    const list = el("div","list");
    stage.appendChild(list);

    search.addEventListener("input", UI.debounce(renderList, 180));
    if(statusSel) statusSel.addEventListener("change", renderList);
    if(ownerSel) ownerSel.addEventListener("change", renderList);
    sortSel.addEventListener("change", renderList);

    const cards = new Map();

    function refreshOwnerOptions(){
      if(!ownerSel) return;
      const cur = ownerSel.value;
      ownerSel.innerHTML = "";
      ownerSel.appendChild(new Option("Everyone",""));
      UI.people().forEach(p=>ownerSel.appendChild(new Option(p,p)));
      ownerSel.appendChild(new Option("Unassigned","__none"));
      ownerSel.value = cur;
    }

    function matches(item){
      const q = search.value.trim().toLowerCase();
      if(q){
        const blob = JSON.stringify(item).toLowerCase();
        if(!blob.includes(q)) return false;
      }
      if(statusSel && statusSel.value && item[mod.statusField] !== statusSel.value) return false;
      if(mod.confirmable && onlyConf._cb.checked && !item.confirmed) return false;
      if(ownerSel && ownerSel.value){
        const pf = mod.fields.find(f=>f.t==="person");
        const v = item[pf.k];
        if(ownerSel.value === "__none"){ if(v) return false; }
        else if(v !== ownerSel.value) return false;
      }
      return true;
    }

    function sortItems(arr){
      const s = sortSel.value;
      if(s === "Most votes") return arr.slice().sort((a,b)=>Object.keys(b.votes||{}).length - Object.keys(a.votes||{}).length);
      if(s === "Highest score" && mod.scorecard) return arr.slice().sort((a,b)=>(UI.scoreOf(mod,b).sum)-(UI.scoreOf(mod,a).sum));
      if(s === "Newest first") return arr.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      if(s === "A–Z") return arr.slice().sort((a,b)=>String(a[mod.titleField]||"").localeCompare(String(b[mod.titleField]||"")));
      return arr;
    }

    function renderStats(all){
      statStrip.innerHTML = "";
      const add = (n,l) => { const s=el("div","stat"); s.appendChild(el("div","stat-n",String(n))); s.appendChild(el("div","stat-l",l)); statStrip.appendChild(s); };
      add(all.length, mod.target ? (mod.targetLabel||("of "+mod.target)) : "total");
      if(mod.target){
        const done = all.filter(i => /Written up|Synthesised|Done/i.test(i[mod.statusField]||"")).length;
        add(done, "complete");
      }
      if(mod.confirmable) add(all.filter(i=>i.confirmed).length, "in final");
      if(mod.statusField && mod.statusOptions){
        const key = mod.statusOptions.find(o=>/Done|Met|Verified|Selected|Bulletproof/i.test(o));
        if(key) add(all.filter(i=>i[mod.statusField]===key).length, key.toLowerCase());
        const bad = mod.statusOptions.find(o=>/Blocked|At risk|No answer|To find/i.test(o));
        if(bad) add(all.filter(i=>i[mod.statusField]===bad).length, bad.toLowerCase());
      }
      if(mod.target){
        const bar = el("div"); bar.style.flex="1"; bar.style.minWidth="150px";
        const done = all.filter(i => /Written up|Synthesised|Done/i.test(i[mod.statusField]||"")).length;
        const pct = Math.min(100, Math.round(done/mod.target*100));
        bar.appendChild(el("div","stat-l","Progress to target · "+pct+"%"));
        const q = el("div","quota-bar"); const f = el("div","quota-fill"+(pct<40?" low":pct<80?" mid":""));
        f.style.width = pct+"%"; q.appendChild(f); bar.appendChild(q);
        statStrip.appendChild(bar);
      }
    }

    function renderList(){
      refreshOwnerOptions();
      const all = Store.byType(modId);
      renderStats(all);
      const shown = sortItems(all.filter(matches));

      const seen = new Set();
      shown.forEach((item, idx) => {
        seen.add(item.id);
        let card = cards.get(item.id);
        if(!card){ card = UI.itemCard(mod, item); cards.set(item.id, card); }
        else card._refresh();
        if(list.children[idx] !== card) list.insertBefore(card, list.children[idx] || null);
      });
      [...cards.keys()].forEach(id => {
        if(!seen.has(id)){ const c = cards.get(id); c.remove(); cards.delete(id); }
      });

      if(!shown.length){
        if(!list.querySelector(".empty")){
          const e = el("div","empty");
          e.appendChild(el("h4", null, all.length ? "Nothing matches those filters" : "Nothing here yet"));
          e.appendChild(el("p","small", all.length ? "Clear the search or the status filter to see the rest." : "Press New to add the first one."));
          list.appendChild(e);
        }
      } else {
        const e = list.querySelector(".empty"); if(e) e.remove();
      }
    }

    renderList();
    return {refresh: renderList};
  }

  /* ============================================================
     KANBAN (task board)
     ============================================================ */
  function renderKanban(modId, stage){
    const mod = SCHEMA[modId];
    stage.appendChild(head(mod));

    const bar = el("div","toolbar");
    const addBtn = el("button","btn","+ New task");
    addBtn.addEventListener("click", ()=>{ Store.add(modId,{state:"To do"}); });
    bar.appendChild(addBtn);
    const search = el("input"); search.type="search"; search.placeholder="Search tasks…"; bar.appendChild(search);
    const streamSel = el("select"); streamSel.appendChild(new Option("All workstreams",""));
    (mod.fields.find(f=>f.k==="stream").o).forEach(o=>streamSel.appendChild(new Option(o,o)));
    bar.appendChild(streamSel);
    const ownerSel = el("select"); bar.appendChild(ownerSel);
    const viewToggle = el("button","btn sec","List view");
    bar.appendChild(viewToggle);
    stage.appendChild(bar);

    const stats = el("div","stat-strip"); stage.appendChild(stats);
    const board = el("div","kan"); stage.appendChild(board);
    const listWrap = el("div"); listWrap.hidden = true; stage.appendChild(listWrap);
    let listView = null, isList = false;

    viewToggle.addEventListener("click", ()=>{
      isList = !isList;
      viewToggle.textContent = isList ? "Board view" : "List view";
      board.hidden = isList; listWrap.hidden = !isList;
      if(isList && !listView){ listView = renderCollection(modId, listWrap); listWrap.querySelector(".page-head").remove(); }
      else if(isList) listView.refresh();
    });

    search.addEventListener("input", UI.debounce(draw,180));
    streamSel.addEventListener("change", draw);
    ownerSel.addEventListener("change", draw);

    function draw(){
      const cur = ownerSel.value;
      ownerSel.innerHTML = ""; ownerSel.appendChild(new Option("Everyone",""));
      UI.people().forEach(p=>ownerSel.appendChild(new Option(p,p)));
      ownerSel.appendChild(new Option("Unassigned","__none"));
      ownerSel.value = cur;

      const all = Store.byType(modId);
      const q = search.value.trim().toLowerCase();
      const items = all.filter(t => {
        if(q && !JSON.stringify(t).toLowerCase().includes(q)) return false;
        if(streamSel.value && t.stream !== streamSel.value) return false;
        if(ownerSel.value === "__none" && t.owner) return false;
        if(ownerSel.value && ownerSel.value !== "__none" && t.owner !== ownerSel.value) return false;
        return true;
      });

      stats.innerHTML = "";
      const add = (n,l)=>{ const s=el("div","stat"); s.appendChild(el("div","stat-n",String(n))); s.appendChild(el("div","stat-l",l)); stats.appendChild(s); };
      add(all.length,"tasks");
      add(all.filter(t=>t.state==="Done").length,"done");
      add(all.filter(t=>t.state==="Blocked").length,"blocked");
      add(all.filter(t=>!t.owner).length,"unassigned");
      add(all.filter(t=>t.priority && t.priority.startsWith("P0") && t.state!=="Done").length,"P0 open");

      board.innerHTML = "";
      ["To do","Doing","Blocked","Done"].forEach(col => {
        const c = el("div","kan-col");
        const inCol = items.filter(t => (t.state||"To do") === col);
        const h = el("div","kan-h");
        h.appendChild(el("span",null,col));
        h.appendChild(el("span",null,String(inCol.length)));
        c.appendChild(h);
        inCol.forEach(t => {
          const card = el("div","kan-card");
          card.appendChild(el("div",null,t.task || "Untitled task"));
          const m = el("div","kan-meta");
          if(t.stream) m.appendChild(el("span",null,t.stream));
          if(t.owner) m.appendChild(el("span",null,"· "+t.owner));
          if(t.priority && t.priority.startsWith("P0")) m.appendChild(el("span",null,"· P0"));
          if(t.due) m.appendChild(el("span",null,"· "+t.due));
          card.appendChild(m);
          card.addEventListener("click", ()=>openTask(t.id));
          c.appendChild(card);
        });
        board.appendChild(c);
      });
    }

    function openTask(id){
      const item = Store.state.items[id];
      const modal = el("div","palette");
      const box = el("div","palette-box"); box.style.padding="18px"; box.style.maxHeight="86vh"; box.style.overflowY="auto";
      const card = UI.itemCard(mod, item, {startOpen:true});
      card.querySelector(".item-head").style.display = "none";
      box.appendChild(card);
      const close = el("button","btn sec","Close");
      close.style.marginTop="10px";
      close.addEventListener("click", ()=>{ modal.remove(); draw(); });
      box.appendChild(close);
      modal.appendChild(box);
      modal.addEventListener("click", e=>{ if(e.target===modal){ modal.remove(); draw(); } });
      document.body.appendChild(modal);
    }

    draw();
    return {refresh(){ draw(); if(isList && listView) listView.refresh(); }};
  }

  /* ============================================================
     DOC
     ============================================================ */
  function renderDoc(modId, stage){
    const mod = SCHEMA[modId];
    stage.appendChild(head(mod));

    const d = () => Store.getDoc(modId);

    /* confirm bar */
    const bar = el("div","toolbar");
    const pct = el("span","pill plain","");
    bar.appendChild(pct);
    if(mod.confirmable){
      const cb = el("button","confirm-btn","");
      const paint = () => {
        const on = !!d().confirmed;
        cb.className = "confirm-btn"+(on?" on":"");
        cb.textContent = on ? ("✓ Locked for the final deck" + (d().confirmedBy? " · "+d().confirmedBy : "")) : "Lock this for the final deck";
      };
      cb.addEventListener("click", ()=>{
        const on = !!d().confirmed;
        Store.updateDoc(modId, on ? {confirmed:false, confirmedBy:"", confirmedAt:0}
                                  : {confirmed:true, confirmedBy: Store.me().name||"Anonymous", confirmedAt: Date.now()});
        paint();
      });
      paint();
      bar.appendChild(cb);
      mod._paintConfirm = paint;
    }
    const copyBtn = el("button","btn sec tiny-btn","Copy as text");
    copyBtn.addEventListener("click", ()=>{
      navigator.clipboard.writeText(docToText(modId)).then(()=>UI.toast("Copied to clipboard"));
    });
    bar.appendChild(copyBtn);
    stage.appendChild(bar);

    const wrap = el("div");
    stage.appendChild(wrap);

    /* preview column for slides */
    let preview = null;
    if(mod.view === "slide1" || mod.view === "slide2"){
      preview = el("div","card pad");
      preview.style.marginBottom = "20px";
      preview.style.position = "sticky"; preview.style.top = "62px"; preview.style.zIndex = "5";
      wrap.appendChild(preview);
    }

    const allNodes = {};
    (mod.sections||[]).forEach(sec => {
      const fs = el("fieldset","fgroup");
      fs.appendChild(el("legend",null,sec.title));
      if(sec.help) fs.appendChild(el("div","help",sec.help));
      const built = UI.buildFieldSet(sec.fields, d(), (k,v)=>{
        const p={}; p[k]=v; Store.updateDoc(modId,p);
        if(preview) drawPreview();
        paintPct();
      });
      Object.assign(allNodes, built.nodes);
      fs.appendChild(built.frag);
      wrap.appendChild(fs);
    });

    function paintPct(){
      const p = Math.round(docCompleteness(modId)*100);
      pct.textContent = p+"% filled in";
      pct.className = "pill"+(p>85?" ok":p>40?" warn":" plain");
    }
    paintPct();

    function drawPreview(){
      if(!preview) return;
      preview.innerHTML = "";
      const ttl = el("div","panel-h");
      ttl.appendChild(el("h3",null,"Live preview"));
      ttl.appendChild(el("span","tiny muted","Updates as you type · this is the layout, not the final design"));
      preview.appendChild(ttl);
      preview.appendChild(mod.view === "slide1" ? slide1Preview() : slide2Preview());
    }
    drawPreview();

    return {refresh(){
      const cur = d();
      Object.entries(allNodes).forEach(([k,node])=>{
        if(node._input === document.activeElement) return;
        if(node._input && node._input.contains && node._input.contains(document.activeElement)) return;
        const nv = cur[k];
        const same = JSON.stringify(node._get()) === JSON.stringify(nv===undefined?(Array.isArray(node._get())?[]:""):nv);
        if(!same) node._set(nv);
      });
      if(mod._paintConfirm) mod._paintConfirm();
      paintPct();
      drawPreview();
    }};
  }

  /* ---------- slide previews ---------- */
  function slide1Preview(){
    const d = Store.getDoc("slide1");
    const s = el("div","slide-preview sp1");
    const t = el("div","sp1-title", "Slide 1 : Consumer Job");
    s.appendChild(t);
    const body = el("div","sp1-body");

    const left = el("div"); left.style.display="flex"; left.style.flexDirection="column"; left.style.gap="4%";
    const arche = el("div"); arche.style.fontWeight="800"; arche.style.fontSize="clamp(8px,1.2vw,15px)";
    arche.textContent = d.archetype || "Archetype name";
    left.appendChild(arche);
    if(d.archetypeLine){
      const al = el("div"); al.style.fontSize="clamp(6px,.85vw,10px)"; al.style.background="#0E6B3D"; al.style.color="#fff";
      al.style.padding="2px 5px"; al.style.borderRadius="2px"; al.style.alignSelf="flex-start";
      al.textContent = d.archetypeLine; left.appendChild(al);
    }
    const q = el("div","sp-quote"); q.textContent = d.pQuote ? "“"+d.pQuote+"”" : "Their defining quote, verbatim";
    left.appendChild(q);
    const who = el("div"); who.style.fontSize="clamp(6px,.9vw,11px)"; who.style.border="1px solid #0E6B3D"; who.style.padding="2px 5px";
    who.style.alignSelf="flex-start"; who.style.borderRadius="2px";
    who.textContent = [d.pName||"Name", d.pAge?d.pAge+" yrs":"", d.pLsm||""].filter(Boolean).join(", ");
    left.appendChild(who);
    body.appendChild(left);

    const mid = el("div","sp-block");
    mid.textContent = d.opportunity || "Identify the opportunity";
    body.appendChild(mid);

    const jobs = el("div","sp-jobs");
    [["When I",d.whenI],["I want to",d.iWantTo],["So that",d.soThat]].forEach(([k,v])=>{
      const j = el("div","sp-job");
      const inner = el("div");
      inner.appendChild(el("b",null,k));
      inner.appendChild(document.createTextNode(v || "…"));
      j.appendChild(inner);
      jobs.appendChild(j);
    });
    body.appendChild(jobs);
    s.appendChild(body);
    return s;
  }

  function slide2Preview(){
    const d = Store.getDoc("slide2");
    const s = el("div","slide-preview sp2"); s.style.position="relative";
    const logo = el("div","sp2-logo","kissan"); s.appendChild(logo);
    if(d.newFlag) { const nf = el("div","sp2-new", d.newFlag); s.appendChild(nf); }

    const left = el("div","sp2-left");
    const h = el("div","sp2-head"); h.textContent = d.headline || "Your headline"; left.appendChild(h);
    const sub = el("div","sp2-sub"); sub.textContent = d.subhead || "The plain-words line that says what it is"; left.appendChild(sub);
    if(d.body){ const b = el("div","sp2-sub"); b.textContent = d.body; left.appendChild(b); }
    const ben = el("div","sp2-benefits");
    if(d.functional) ben.appendChild(el("div",null,"→ "+d.functional));
    if(d.emotional) ben.appendChild(el("div",null,"→ "+d.emotional));
    left.appendChild(ben);
    const pr = el("div","sp2-price");
    pr.textContent = [d.priceLine, d.variantLine].filter(Boolean).join("   ·   ");
    left.appendChild(pr);
    s.appendChild(left);

    const right = el("div","sp2-right");
    const img = el("div","sp2-img");
    if(d.imageUrl){ img.style.backgroundImage = "url('"+d.imageUrl.replace(/'/g,"")+"')"; img.style.border="0"; }
    else img.textContent = d.imageDirection || "One impactful, bold image — pack or talent";
    right.appendChild(img);
    s.appendChild(right);

    /* word count warning */
    const total = words([d.headline,d.subhead,d.body,d.functional,d.emotional,d.priceLine,d.variantLine].filter(Boolean).join(" "));
    const warn = el("div");
    warn.style.cssText = "position:absolute;bottom:2%;left:3.4%;font-family:var(--font-mono);font-size:9px;letter-spacing:.1em;";
    warn.style.color = total > 80 ? "#FF6A62" : "#7C9A88";
    warn.textContent = total + " / 80 words on card";
    s.appendChild(warn);
    return s;
  }

  /* ---------- doc → text ---------- */
  function docToText(modId){
    const mod = SCHEMA[modId], d = Store.getDoc(modId);
    let out = "## " + (mod.title||mod.label) + "\n\n";
    (mod.sections||[]).forEach(sec=>{
      out += "### " + sec.title + "\n";
      sec.fields.forEach(f=>{
        const v = d[f.k];
        if(v===undefined || v==="" || v===false || (Array.isArray(v)&&!v.length)) return;
        out += "**" + f.l + "**\n" + (Array.isArray(v)?v.join(", "):(v===true?"Yes":v)) + "\n\n";
      });
    });
    return out;
  }

  /* ============================================================
     STATIC
     ============================================================ */
  function renderStatic(modId, stage){
    const mod = SCHEMA[modId];
    stage.appendChild(head(mod));
    const c = el("div");
    c.innerHTML = BRIEF_HTML;
    stage.appendChild(c);
    return {refresh(){}};
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */
  const SHELF = [
    {key:"Command",     label:"Set up",     fn: () => pctTasks()},
    {key:"Discover",    label:"Fieldwork",  fn: () => pctDiscover()},
    {key:"Define",      label:"Insight",    fn: () => pctDefine()},
    {key:"Ideate",      label:"Ideas",      fn: () => pctIdeate()},
    {key:"Build",       label:"Product",    fn: () => pctBuild()},
    {key:"Validate",    label:"Testing",    fn: () => pctValidate()},
    {key:"GTM",         label:"Go to market",fn: () => docCompleteness("gtm")},
    {key:"Deliver",     label:"Submission", fn: () => pctDeliver()}
  ];

  const clamp = n => Math.max(0, Math.min(1, n||0));
  function pctTasks(){
    const t = Store.byType("tasks").filter(x=>x.stream==="Setup");
    if(!t.length) return 0;
    return t.filter(x=>x.state==="Done").length / t.length;
  }
  function pctDiscover(){
    const iv = Store.byType("interviews");
    const done = iv.filter(i=>/Written up|Synthesised/.test(i.state||"")).length;
    const a = Store.byType("audits").length, v = Store.byType("verbatims").length, o = Store.byType("observations").length;
    return clamp(0.55*(done/20) + 0.15*clamp(a/5) + 0.15*clamp(v/25) + 0.15*clamp(o/20));
  }
  function pctDefine(){
    const ins = Store.byType("insights").filter(i=>i.confirmed).length;
    const ws = Store.byType("whitespaces").filter(i=>i.confirmed).length;
    return clamp(0.25*clamp(ins) + 0.15*clamp(ws) + 0.6*docCompleteness("opportunity"));
  }
  function pctIdeate(){
    const all = Store.byType("ideas").filter(i=>!i.seeded).length;
    const sel = Store.byType("ideas").filter(i=>i.state==="Selected").length;
    return clamp(0.5*clamp(all/25) + 0.5*clamp(sel));
  }
  function pctBuild(){
    return (docCompleteness("product")+docCompleteness("packaging")+docCompleteness("proposition")+docCompleteness("pricing"))/4;
  }
  function pctValidate(){
    const ct = Store.byType("conceptTests").length;
    const qa = Store.byType("juryQA");
    const answered = qa.filter(q=>q.answer && q.answer.trim()).length;
    return clamp(0.5*clamp(ct/10) + 0.5*(qa.length? answered/qa.length : 0));
  }
  function pctDeliver(){
    return (docCompleteness("slide1")+docCompleteness("slide2")+docCompleteness("pitch"))/3;
  }

  function renderDashboard(stage){
    const s = settings();

    /* hero */
    const hero = el("div","hero");
    hero.appendChild(el("div","hero-eyebrow","L.I.M.E. Season 18 · Hindustan Unilever"));
    const h1 = el("h1",null,"The Next Shelf");
    hero.appendChild(h1);
    hero.appendChild(el("p",null, (s.teamName || CONFIG.teamName) + (s.campus ? " · "+s.campus : "") +
      " — one working room for the whole case. Everything typed here saves for the whole team, immediately."));

    const cd = el("div","countdown");
    const dl = deadline();
    const mk = (n,l)=>{ const b=el("div"); b.appendChild(el("div","cd-n",String(n))); b.appendChild(el("div","cd-l",l)); return b; };
    if(dl){
      const days = Math.ceil((dl - Date.now())/86400000);
      cd.appendChild(mk(days >= 0 ? days : "—", days >= 0 ? "days to submission" : "deadline passed"));
    } else {
      const w = el("div");
      w.appendChild(el("div","cd-n","—"));
      w.appendChild(el("div","cd-l","set your deadline in settings"));
      cd.appendChild(w);
    }
    const iv = Store.byType("interviews");
    cd.appendChild(mk(iv.filter(i=>/Written up|Synthesised/.test(i.state||"")).length + "/20","interviews written up"));
    const tk = Store.byType("tasks");
    cd.appendChild(mk(tk.filter(t=>t.state!=="Done").length,"tasks open"));
    cd.appendChild(mk(countConfirmed(),"decisions locked"));
    hero.appendChild(cd);
    stage.appendChild(hero);

    /* THE SHELF */
    const sw = el("div","shelf-wrap");
    const st = el("div","shelf-title");
    st.appendChild(el("h3",null,"The shelf"));
    st.appendChild(el("span","tiny muted","Each jar fills as that part of the case gets built. Click one to jump there."));
    sw.appendChild(st);
    const shelf = el("div","shelf");
    const jump = {Command:"tasks",Discover:"interviews",Define:"opportunity",Ideate:"ideas",Build:"product",Validate:"conceptTests",GTM:"gtm",Deliver:"slide2"};
    SHELF.forEach(j => {
      const p = Math.round(clamp(j.fn())*100);
      const b = el("button","jar"); b.type="button";
      const glass = el("div","jar-glass");
      const fill = el("div","jar-fill"); fill.style.height = Math.max(3,p)+"%";
      if(p >= 80) fill.style.background = "var(--basil)";
      else if(p >= 40) fill.style.background = "var(--turmeric)";
      glass.appendChild(fill); b.appendChild(glass);
      b.appendChild(el("div","jar-pct", p+"%"));
      b.appendChild(el("div","jar-lbl", j.label));
      b.addEventListener("click", ()=>App.go(jump[j.key]));
      shelf.appendChild(b);
    });
    sw.appendChild(shelf);
    sw.appendChild(el("div","shelf-board"));
    stage.appendChild(sw);

    /* three panels */
    const g = el("div","grid3");

    /* next milestones */
    const p1 = el("div","card pad");
    const ph1 = el("div","panel-h"); ph1.appendChild(el("h3",null,"Next up"));
    const gt = el("button","link-btn","Timeline"); gt.addEventListener("click",()=>App.go("timeline")); ph1.appendChild(gt);
    p1.appendChild(ph1);
    const ms = Store.byType("timeline").filter(m=>m.state!=="Done").slice(0,5);
    if(!ms.length) p1.appendChild(el("div","small muted","No milestones left. Either you are done or someone has been over-optimistic with the checkboxes."));
    ms.forEach(m=>{
      const row = el("div","mini");
      const b = el("div","mini-b");
      b.appendChild(el("div",null,m.milestone));
      const sd = m.date ? new Date(m.date) : suggestedDate(m.daysBefore);
      b.appendChild(el("div","mini-meta",[sd?shortDate(sd):"", m.daysBefore!=null?("D-"+m.daysBefore):"", m.owner||"unassigned"].filter(Boolean).join(" · ")));
      row.appendChild(b);
      p1.appendChild(row);
    });
    g.appendChild(p1);

    /* my work */
    const p2 = el("div","card pad");
    const ph2 = el("div","panel-h"); ph2.appendChild(el("h3",null,"Your tasks"));
    const gt2 = el("button","link-btn","Task board"); gt2.addEventListener("click",()=>App.go("tasks")); ph2.appendChild(gt2);
    p2.appendChild(ph2);
    const meName = Store.me().name;
    const mine = Store.byType("tasks").filter(t=>t.owner===meName && t.state!=="Done").slice(0,6);
    if(!meName) p2.appendChild(el("div","small muted","Set your name from the round button at the top right, then assign yourself tasks."));
    else if(!mine.length) p2.appendChild(el("div","small muted","Nothing assigned to you. Open the task board and take something — most cards start unassigned."));
    mine.forEach(t=>{
      const row = el("div","mini");
      const b = el("div","mini-b");
      b.appendChild(el("div",null,t.task));
      b.appendChild(el("div","mini-meta",[t.stream,t.state,t.priority&&t.priority.startsWith("P0")?"P0":""].filter(Boolean).join(" · ")));
      row.appendChild(b); p2.appendChild(row);
    });
    g.appendChild(p2);

    /* blocked + gaps */
    const p3 = el("div","card pad");
    p3.appendChild((()=>{const x=el("div","panel-h"); x.appendChild(el("h3",null,"Watch list")); return x;})());
    const warnings = healthChecks();
    if(!warnings.length) p3.appendChild(el("div","small muted","Nothing flagged. Either the work is genuinely in good shape, or nobody has updated anything today."));
    warnings.slice(0,7).forEach(w=>{
      const row = el("div","mini");
      const b = el("div","mini-b");
      b.appendChild(el("div",null,w.msg));
      if(w.go){ const a = el("button","link-btn",w.goLabel||"Open"); a.addEventListener("click",()=>App.go(w.go)); b.appendChild(a); }
      row.appendChild(b); p3.appendChild(row);
    });
    g.appendChild(p3);
    stage.appendChild(g);

    /* quotas */
    const q = el("div","card pad"); q.style.marginTop="16px";
    q.appendChild((()=>{const x=el("div","panel-h"); x.appendChild(el("h3",null,"Fieldwork quotas")); 
      x.appendChild(el("span","tiny muted","The deck's own requirements, counted")); return x;})());
    const qg = el("div","grid3");
    const iAll = Store.byType("interviews");
    const gens = new Set(iAll.map(i=>i.gen).filter(Boolean));
    const tiers = new Set(iAll.map(i=>i.tier).filter(Boolean));
    [
      ["Interviews written up", iAll.filter(i=>/Written up|Synthesised/.test(i.state||"")).length, 20],
      ["Generations covered", gens.size, 2],
      ["City tiers covered", tiers.size, 2],
      ["Cook-alongs", iAll.filter(i=>(i.method||[]).includes("In-home cook-along")).length, 4],
      ["Fridge audits", iAll.filter(i=>(i.method||[]).includes("Fridge / pantry audit")).length, 3],
      ["Shelf & app audits", Store.byType("audits").length, 5],
      ["Verbatims banked", Store.byType("verbatims").length, 25],
      ["Field observations", Store.byType("observations").length, 20],
      ["Concept tests", Store.byType("conceptTests").length, 10]
    ].forEach(([l,n,t])=>{
      const b = el("div");
      const pct = Math.min(100, Math.round(n/t*100));
      b.appendChild(el("div","stat-l", l + " · " + n + "/" + t));
      const bar = el("div","quota-bar"); const f = el("div","quota-fill"+(pct<40?" low":pct<80?" mid":""));
      f.style.width = pct+"%"; bar.appendChild(f); b.appendChild(bar);
      qg.appendChild(b);
    });
    q.appendChild(qg);
    stage.appendChild(q);

    /* recent activity */
    const ra = el("div","card pad"); ra.style.marginTop="16px";
    ra.appendChild((()=>{const x=el("div","panel-h"); x.appendChild(el("h3",null,"Recent activity")); return x;})());
    const recent = Store.allItems().filter(i=>i.updatedAt).sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,8);
    if(!recent.length) ra.appendChild(el("div","small muted","Nothing edited yet."));
    recent.forEach(i=>{
      const mod = SCHEMA[i._type]; if(!mod) return;
      const row = el("div","mini");
      const b = el("div","mini-b");
      b.appendChild(el("div",null, (i[mod.titleField]||"Untitled") ));
      b.appendChild(el("div","mini-meta", mod.label + " · " + (i.updatedBy||"someone") + " · " + fmtDate(i.updatedAt)));
      row.appendChild(b);
      row.style.cursor="pointer";
      row.addEventListener("click",()=>App.go(i._type));
      ra.appendChild(row);
    });
    stage.appendChild(ra);

    return {refresh(){ App.render(); }};
  }

  function countConfirmed(){
    let n = Store.allItems().filter(i=>i.confirmed).length;
    Object.values(SCHEMA).forEach(m=>{ if(m.kind==="doc" && Store.getDoc(m.id).confirmed) n++; });
    return n;
  }

  function healthChecks(){
    const w = [];
    const iAll = Store.byType("interviews");
    const written = iAll.filter(i=>/Written up|Synthesised/.test(i.state||"")).length;
    const pending = iAll.filter(i=>i.state==="Done — not written up").length;
    if(pending) w.push({msg: pending+" interview"+(pending>1?"s":"")+" done but not written up. Detail decays within a day.", go:"interviews", goLabel:"Interview log"});
    const gens = new Set(iAll.map(i=>i.gen).filter(Boolean));
    if(iAll.length >= 6 && gens.size < 2) w.push({msg:"Only one generation in the sample so far. The deck asks for at least two.", go:"interviews"});
    const tiers = new Set(iAll.map(i=>i.tier).filter(Boolean));
    if(iAll.length >= 8 && tiers.size < 2) w.push({msg:"Every respondent is from one city tier. The deck asks for more than one.", go:"interviews"});
    const blocked = Store.byType("tasks").filter(t=>t.state==="Blocked");
    if(blocked.length) w.push({msg: blocked.length+" task"+(blocked.length>1?"s are":" is")+" blocked.", go:"tasks"});
    const unassigned = Store.byType("tasks").filter(t=>!t.owner && t.priority && t.priority.startsWith("P0") && t.state!=="Done");
    if(unassigned.length) w.push({msg: unassigned.length+" P0 tasks have no owner.", go:"tasks"});
    if(!Store.byType("team").filter(t=>t.name).length) w.push({msg:"No team members added yet — owner dropdowns will stay empty until you do.", go:"team"});
    if(!settings().deadline) w.push({msg:"No submission deadline set, so the countdown and suggested dates are dormant.", go:"settings"});
    const s2 = Store.getDoc("slide2");
    const wc = words([s2.headline,s2.subhead,s2.body,s2.functional,s2.emotional,s2.priceLine,s2.variantLine].filter(Boolean).join(" "));
    if(wc > 80) w.push({msg:"Concept card is at "+wc+" words. The deck's limit is 80.", go:"slide2"});
    const pw = words(Store.getDoc("pitch").fullScript||"");
    if(pw > 155) w.push({msg:"Pitch script is "+pw+" words — that will run past sixty seconds.", go:"pitch"});
    const toFind = Store.byType("marketData").filter(m=>m.state==="To find").length;
    if(toFind) w.push({msg: toFind+" market data points still unsourced.", go:"marketData"});
    const noAns = Store.byType("juryQA").filter(q=>!q.answer||!q.answer.trim()).length;
    if(noAns > 12) w.push({msg: noAns+" jury questions have no answer yet.", go:"juryQA"});
    return w;
  }

  /* ============================================================
     FINAL OUTPUT HUB
     ============================================================ */
  const FLUFF = ["innovative","revolutionary","game-changer","game changer","one-stop","seamless","synergy","synergies",
    "leverage","holistic","cutting-edge","state-of-the-art","in today's fast-paced","paradigm","disrupt","disruptive",
    "unlock value","best-in-class","world-class","delight the consumer","elevate the experience","curated","ecosystem",
    "next-generation","unparalleled","robust solution","value proposition that","significantly enhance"];

  function renderFinal(stage){
    const h = el("div","page-head");
    h.appendChild(el("div","eyebrow","Everything the team has locked"));
    h.appendChild(el("h1","page-title","Final output hub"));
    const p = el("div","page-intro");
    p.textContent = "Every card marked 'In final' and every page locked for the deck collects here. This is what you build the two slides and the video from — nothing else should make it in. If a section below is thin, that is the section to work on next.";
    h.appendChild(p);
    stage.appendChild(h);

    const bar = el("div","toolbar");
    const md = el("button","btn","Download as Markdown");
    md.addEventListener("click", ()=>{
      const blob = new Blob([buildMarkdown()], {type:"text/markdown"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "kissan-lime-final-pack.md"; a.click();
      UI.toast("Downloaded");
    });
    const pr = el("button","btn sec","Print / save as PDF");
    pr.addEventListener("click", ()=>window.print());
    const cp = el("button","btn sec","Copy everything");
    cp.addEventListener("click", ()=>navigator.clipboard.writeText(buildMarkdown()).then(()=>UI.toast("Copied")));
    bar.appendChild(md); bar.appendChild(pr); bar.appendChild(cp);
    stage.appendChild(bar);

    /* fluff check */
    const found = fluffCheck();
    if(found.length){
      const f = el("div","fluff");
      f.innerHTML = "<b>Language check.</b> These phrases turned up in your locked copy. They are the ones juries hear in every deck, so each one is a place to say something specific instead: " +
        found.map(x=>"<span class='mono'>"+esc(x.word)+"</span> <span class='muted'>("+esc(x.where)+")</span>").join(", ") + ".";
      stage.appendChild(f);
    }

    /* the answer */
    section(stage, "The answer", [
      ["opportunity", "Opportunity lock"],
      ["product", "Product spec"],
      ["packaging", "Packaging"],
      ["proposition", "Brand proposition"],
      ["pricing", "Pricing"],
      ["gtm", "Go-to-market"]
    ]);

    /* submission */
    section(stage, "Submission assets", [
      ["slide1","Slide 1 · Consumer job"],
      ["slide2","Slide 2 · Concept card"],
      ["pitch","60-second pitch"]
    ], true);

    /* confirmed collections */
    const collGroups = [
      ["Evidence", ["insights","tensions","patterns","verbatims","observations"]],
      ["Choices", ["whitespaces","ideas","decisions"]],
      ["Support", ["marketData"]]
    ];
    collGroups.forEach(([title, mods])=>{
      const sec = el("div","final-sec");
      const hh = el("div","final-h");
      hh.appendChild(el("h3",null,title));
      sec.appendChild(hh);
      const body = el("div","final-body");
      let any = false;
      mods.forEach(mid=>{
        const mod = SCHEMA[mid];
        const items = Store.byType(mid).filter(i=>i.confirmed);
        if(!items.length) return;
        any = true;
        body.appendChild(el("h4", null, mod.label));
        items.forEach(it=>{
          const kv = el("div","kv");
          kv.appendChild(el("div","kv-k", (it[mod.titleField]||"Untitled") + (it.confirmedBy?(" · locked by "+it.confirmedBy):"")));
          const v = el("div","kv-v");
          v.textContent = mod.fields.filter(f=>f.k!==mod.titleField)
            .map(f=>{ const val = it[f.k]; if(val===undefined||val===""||val===false||(Array.isArray(val)&&!val.length)) return null;
                      return f.l+": "+(Array.isArray(val)?val.join(", "):(val===true?"Yes":val)); })
            .filter(Boolean).join("\n");
          kv.appendChild(v);
          body.appendChild(kv);
        });
      });
      if(!any) body.appendChild(el("div","small muted","Nothing locked here yet. Open any card in these sections and press 'Add to final'."));
      sec.appendChild(body);
      stage.appendChild(sec);
    });

    return {refresh(){ App.render(); }};
  }

  function section(stage, title, docs, showSlides){
    const sec = el("div","final-sec");
    const hh = el("div","final-h");
    hh.appendChild(el("h3",null,title));
    sec.appendChild(hh);
    const body = el("div","final-body");

    if(showSlides){
      const g = el("div","grid2");
      const a = el("div"); a.appendChild(el("div","kv-k","Slide 1")); a.appendChild(slide1Preview());
      const b = el("div"); b.appendChild(el("div","kv-k","Slide 2")); b.appendChild(slide2Preview());
      g.appendChild(a); g.appendChild(b);
      body.appendChild(g);
      body.appendChild(el("div","help","These are layout previews from what you typed. Rebuild them in the deck's own template file for submission."));
    }

    docs.forEach(([mid,label])=>{
      const mod = SCHEMA[mid], d = Store.getDoc(mid);
      const filled = docFields(mod).filter(f=>{const v=d[f.k]; return v!=null&&v!==""&&v!==false;});
      const wrap = el("div"); wrap.style.marginTop="18px";
      const hdr = el("div","panel-h");
      hdr.appendChild(el("h3",null,label));
      const st = el("span","pill"+(d.confirmed?" ok":" warn"), d.confirmed?"Locked":(filled.length?"Not locked yet":"Empty"));
      hdr.appendChild(st);
      wrap.appendChild(hdr);
      if(!filled.length){
        wrap.appendChild(el("div","small muted","Nothing written here yet."));
      } else {
        filled.forEach(f=>{
          const kv = el("div","kv");
          kv.appendChild(el("div","kv-k", f.l));
          const v = d[f.k];
          kv.appendChild(el("div","kv-v", Array.isArray(v)?v.join(", "):(v===true?"Yes":String(v))));
          wrap.appendChild(kv);
        });
      }
      body.appendChild(wrap);
    });
    sec.appendChild(body);
    stage.appendChild(sec);
  }

  function fluffCheck(){
    const out = [];
    const check = (text, where) => {
      if(!text) return;
      const low = String(text).toLowerCase();
      FLUFF.forEach(wd => { if(low.includes(wd) && !out.some(o=>o.word===wd&&o.where===where)) out.push({word:wd, where}); });
    };
    ["opportunity","product","packaging","proposition","pricing","gtm","slide1","slide2","pitch"].forEach(mid=>{
      const d = Store.getDoc(mid), mod = SCHEMA[mid];
      docFields(mod).forEach(f=>check(d[f.k], mod.label));
    });
    Store.allItems().filter(i=>i.confirmed).forEach(i=>{
      const mod = SCHEMA[i._type]; if(!mod||!mod.fields) return;
      mod.fields.forEach(f=>check(i[f.k], mod.label));
    });
    return out;
  }

  function buildMarkdown(){
    const s = settings();
    let out = "# The Next Shelf — Kissan · L.I.M.E. Season 18\n";
    out += (s.teamName||CONFIG.teamName) + (s.campus?" · "+s.campus:"") + "\n";
    out += "Exported " + new Date().toLocaleString() + "\n\n---\n\n";

    ["opportunity","product","packaging","proposition","pricing","gtm","slide1","slide2","pitch","businessCase"].forEach(mid=>{
      const d = Store.getDoc(mid);
      const has = docFields(SCHEMA[mid]).some(f=>d[f.k]!=null && d[f.k]!=="" && d[f.k]!==false);
      if(has) out += docToText(mid) + (d.confirmed?"_Locked for the deck by "+(d.confirmedBy||"the team")+"._\n":"_Not locked yet._\n") + "\n---\n\n";
    });

    out += "## Locked evidence and choices\n\n";
    ["insights","tensions","patterns","verbatims","observations","whitespaces","ideas","decisions","marketData"].forEach(mid=>{
      const mod = SCHEMA[mid];
      const items = Store.byType(mid).filter(i=>i.confirmed);
      if(!items.length) return;
      out += "### " + mod.label + "\n\n";
      items.forEach(it=>{
        out += "**" + (it[mod.titleField]||"Untitled") + "**\n\n";
        mod.fields.filter(f=>f.k!==mod.titleField).forEach(f=>{
          const v = it[f.k];
          if(v===undefined||v===""||v===false||(Array.isArray(v)&&!v.length)) return;
          out += "- " + f.l + ": " + (Array.isArray(v)?v.join(", "):(v===true?"Yes":v)) + "\n";
        });
        out += "\n";
      });
    });

    out += "\n---\n\n## Fieldwork summary\n\n";
    const iv = Store.byType("interviews");
    out += "- Interviews logged: " + iv.length + "\n";
    out += "- Written up: " + iv.filter(i=>/Written up|Synthesised/.test(i.state||"")).length + "\n";
    out += "- Generations covered: " + [...new Set(iv.map(i=>i.gen).filter(Boolean))].join(", ") + "\n";
    out += "- City tiers covered: " + [...new Set(iv.map(i=>i.tier).filter(Boolean))].join(", ") + "\n";
    out += "- Cities: " + [...new Set(iv.map(i=>i.city).filter(Boolean))].join(", ") + "\n";
    out += "- Shelf and app audits: " + Store.byType("audits").length + "\n";
    out += "- Concept tests run: " + Store.byType("conceptTests").length + "\n";
    return out;
  }

  /* ============================================================
     SETTINGS
     ============================================================ */
  function renderSettings(stage){
    const h = el("div","page-head");
    h.appendChild(el("div","eyebrow","Board setup"));
    h.appendChild(el("h1","page-title","Settings"));
    stage.appendChild(h);

    const s = () => Store.getDoc("__settings");

    const c1 = el("div","card pad"); c1.style.marginBottom="16px";
    c1.appendChild(el("h3",null,"This board"));
    const grid = el("div","fgrid"); grid.style.marginTop="12px";
    [
      {k:"teamName", l:"Team name", t:"text", w:6},
      {k:"campus", l:"Campus", t:"text", w:6},
      {k:"deadline", l:"Submission deadline", t:"date", w:6, help:"Drives the countdown and every suggested date on the timeline."},
      {k:"internalDeadline", l:"Internal cut-off (aim for D-2)", t:"date", w:6},
      {k:"portalNotes", l:"Submission portal rules", t:"textarea", w:12, rows:3, ph:"File formats, video length and size limits, naming convention, who has the login."}
    ].forEach(f=>{
      grid.appendChild(UI.buildField(f, s()[f.k], v=>{ const p={}; p[f.k]=v; Store.updateDoc("__settings",p); if(f.k==="deadline") UI.toast("Timeline dates updated"); }));
    });
    c1.appendChild(grid);
    stage.appendChild(c1);

    /* you */
    const c2 = el("div","card pad"); c2.style.marginBottom="16px";
    c2.appendChild(el("h3",null,"You"));
    const g2 = el("div","fgrid"); g2.style.marginTop="12px";
    g2.appendChild(UI.buildField({k:"name",l:"Your name",t:"text",w:6,help:"Shown on your edits, comments and confirmations."}, Store.me().name, v=>Store.setName(v)));
    c2.appendChild(g2);
    stage.appendChild(c2);

    /* sharing */
    const c3 = el("div","card pad"); c3.style.marginBottom="16px";
    c3.appendChild(el("h3",null,"Sharing"));
    const mode = Store.state.mode;
    const p = el("div","page-intro"); p.style.marginTop="8px";
    if(mode === "team"){
      p.innerHTML = "This board is <b>live</b>. Everyone who opens the link below and uses board id <span class='mono'>"+esc(Store.state.boardId)+"</span> edits the same data in real time.";
    } else {
      p.innerHTML = "This board is in <b>local mode</b> — everything saves in this browser only, and nobody else can see it. To switch the whole team onto one live board, follow <span class='mono'>SETUP-FIREBASE.md</span> in the repository and paste your keys into <span class='mono'>js/config.js</span>. It takes about eight minutes and costs nothing.";
    }
    c3.appendChild(p);
    const linkRow = el("div","row"); linkRow.style.marginTop="12px";
    const url = location.origin + location.pathname + "?board=" + encodeURIComponent(Store.state.boardId);
    const inp = el("input"); inp.type="text"; inp.value = url; inp.readOnly = true; inp.style.maxWidth="440px";
    const cp = el("button","btn sec","Copy link");
    cp.addEventListener("click", ()=>navigator.clipboard.writeText(url).then(()=>UI.toast("Link copied")));
    linkRow.appendChild(inp); linkRow.appendChild(cp);
    c3.appendChild(linkRow);
    if(Store.state.error){
      const e = el("div","fluff"); e.style.marginTop="12px";
      e.innerHTML = "<b>Sync problem.</b> " + esc(Store.state.error);
      c3.appendChild(e);
    }
    stage.appendChild(c3);

    /* data */
    const c4 = el("div","card pad");
    c4.appendChild(el("h3",null,"Your data"));
    const row = el("div","row"); row.style.marginTop="12px";
    const exp = el("button","btn sec","Download backup");
    exp.addEventListener("click", ()=>{
      const blob = new Blob([Store.exportJSON()],{type:"application/json"});
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "kissan-lime-backup-"+new Date().toISOString().slice(0,10)+".json"; a.click();
    });
    const impLabel = el("label","btn sec","Restore from backup");
    const imp = el("input"); imp.type="file"; imp.accept="application/json"; imp.style.display="none";
    imp.addEventListener("change", async e=>{
      const f = e.target.files[0]; if(!f) return;
      try{ await Store.importJSON(await f.text()); UI.toast("Backup restored"); App.render(); }
      catch(err){ alert("That file could not be read: "+err.message); }
    });
    impLabel.appendChild(imp);
    const wipe = el("button","btn sec","Clear this board");
    wipe.style.color = "var(--danger)";
    wipe.addEventListener("click", async ()=>{
      if(!confirm("This deletes every card and every page on this board, for everyone. Download a backup first. Continue?")) return;
      if(!confirm("Last check — this cannot be undone.")) return;
      await Store.wipe(); await Store.reseed(); App.render(); UI.toast("Board cleared and re-seeded");
    });
    row.appendChild(exp); row.appendChild(impLabel); row.appendChild(wipe);
    c4.appendChild(row);
    c4.appendChild(el("div","help","Backups are plain JSON. Download one before any big clean-up, and once at the end for your own records."));
    stage.appendChild(c4);

    return {refresh(){}};
  }

  return { renderCollection, renderKanban, renderDoc, renderStatic, renderDashboard, renderFinal, renderSettings,
           docCompleteness, suggestedDate, shortDate, buildMarkdown, docToText };
})();
