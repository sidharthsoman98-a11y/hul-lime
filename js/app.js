/* ============================================================
   APP — nav, routing, search, presence.
   ============================================================ */

const App = (function(){
  const {el} = UI;
  let current = null;      // module id
  let view = null;         // {refresh}
  let renderQueued = false;

  /* ---------- routing ---------- */
  function go(id){
    if(!SCHEMA[id]) id = "dashboard";
    current = id;
    if(location.hash !== "#"+id) history.replaceState(null,"","#"+id);
    render();
    document.getElementById("rail").classList.remove("open");
    document.getElementById("scrim").hidden = true;
    document.getElementById("stage").scrollTo?.(0,0);
    window.scrollTo(0,0);
  }

  function render(){
    const mod = SCHEMA[current] || SCHEMA.dashboard;
    const stage = document.getElementById("stage");
    stage.innerHTML = "";
    document.getElementById("crumb").textContent = (mod.group ? mod.group + "  ·  " : "") + mod.label;
    document.title = mod.label + " · The Next Shelf";

    if(mod.kind === "custom"){
      if(mod.id === "dashboard") view = Views.renderDashboard(stage);
      else if(mod.id === "final") view = Views.renderFinal(stage);
      else if(mod.id === "settings") view = Views.renderSettings(stage);
    }
    else if(mod.kind === "static") view = Views.renderStatic(mod.id, stage);
    else if(mod.kind === "doc") view = Views.renderDoc(mod.id, stage);
    else if(mod.view === "kanban") view = Views.renderKanban(mod.id, stage);
    else view = Views.renderCollection(mod.id, stage);

    paintNav();
  }

  /* ---------- nav ---------- */
  function buildNav(){
    const nav = document.getElementById("nav");
    nav.innerHTML = "";
    GROUP_ORDER.forEach(group => {
      const ids = NAV_ORDER.filter(id => SCHEMA[id] && SCHEMA[id].group === group);
      if(!ids.length) return;
      nav.appendChild(el("div","nav-group", group));
      ids.forEach(id => {
        const mod = SCHEMA[id];
        const b = el("button","nav-item");
        b.dataset.id = id;
        b.appendChild(el("span","nav-ic", mod.icon || "·"));
        b.appendChild(el("span","nav-lbl", mod.label));
        const c = el("span","nav-count",""); c.dataset.count = "1";
        b.appendChild(c);
        b.addEventListener("click", ()=>go(id));
        nav.appendChild(b);
      });
    });
  }

  function paintNav(){
    document.querySelectorAll(".nav-item").forEach(b=>{
      const id = b.dataset.id;
      b.classList.toggle("on", id === current);
      const mod = SCHEMA[id];
      const c = b.querySelector(".nav-count");
      let txt = "", hot = false;
      if(mod.kind === "collection"){
        const n = Store.byType(id).length;
        txt = n ? String(n) : "";
        if(mod.target){ 
          const done = Store.byType(id).filter(i=>/Written up|Synthesised/.test(i.state||"")).length;
          txt = done + "/" + mod.target;
          hot = done < mod.target;
        }
      } else if(mod.kind === "doc"){
        const p = Math.round(Views.docCompleteness(id)*100);
        txt = p ? p+"%" : "";
        if(Store.getDoc(id).confirmed) { txt = "✓"; hot = false; }
      } else if(id === "final"){
        const n = Store.allItems().filter(i=>i.confirmed).length;
        txt = n ? String(n) : "";
      }
      c.textContent = txt;
      c.classList.toggle("hot", hot && txt !== "");
      c.style.display = txt ? "" : "none";
    });
  }

  /* ---------- presence ---------- */
  function paintPresence(){
    const wrap = document.getElementById("presence");
    wrap.innerHTML = "";
    const p = Store.presence();
    const list = Object.entries(p).filter(([id])=>id !== Store.me().id).slice(0,5);
    list.forEach(([id,v])=>{
      const pip = el("div","pip", UI.initials(v.name));
      pip.style.background = v.color || UI.colorFor(v.name);
      pip.title = v.name + " is here";
      wrap.appendChild(pip);
    });
    const me = document.getElementById("whoBtn");
    me.textContent = UI.initials(Store.me().name);
    me.style.background = Store.me().color;
    me.title = Store.me().name ? (Store.me().name + " — click to change") : "Set your name";

    const chip = document.getElementById("modeChip");
    chip.className = "mode-chip " + (Store.state.mode === "team" ? "live" : "local");
    chip.innerHTML = "";
    chip.appendChild(el("span","dot"));
    const n = Object.keys(p).length;
    chip.appendChild(el("span",null, Store.state.mode === "team"
      ? ("Live · " + n + " here now")
      : "Local mode · not shared"));
    chip.onclick = ()=>go("settings");
  }

  /* ---------- name prompt ---------- */
  function askName(force){
    const cur = Store.me().name;
    if(cur && !force) return;
    const n = prompt("What is your name? Your teammates will see it on your edits and comments.", cur || "");
    if(n !== null) Store.setName(n);
    paintPresence();
    if(view && view.refresh) view.refresh();
  }

  /* ---------- search palette ---------- */
  function openPalette(){
    const p = document.getElementById("palette");
    p.hidden = false;
    const i = document.getElementById("paletteInput");
    i.value = ""; i.focus();
    searchResults("");
  }
  function closePalette(){ document.getElementById("palette").hidden = true; }

  let selIdx = 0, results = [];
  function searchResults(q){
    const box = document.getElementById("paletteResults");
    box.innerHTML = ""; results = []; selIdx = 0;
    const query = q.trim().toLowerCase();

    NAV_ORDER.forEach(id=>{
      const m = SCHEMA[id];
      if(!query || m.label.toLowerCase().includes(query))
        results.push({title:m.label, meta:"Go to " + (m.group||"section"), go:()=>go(id)});
    });

    if(query.length >= 2){
      Store.allItems().forEach(it=>{
        const mod = SCHEMA[it._type]; if(!mod || !mod.fields) return;
        const blob = mod.fields.map(f=>it[f.k]).filter(Boolean).join(" ").toLowerCase();
        if(blob.includes(query)){
          results.push({
            title: it[mod.titleField] || "Untitled",
            meta: mod.label,
            go: ()=>{ go(it._type); setTimeout(()=>{
              const c = document.querySelector('[data-id="'+it.id+'"]');
              if(c){ c._open && c._open(); c.scrollIntoView({behavior:"smooth",block:"center"}); }
            }, 120); }
          });
        }
      });
      Object.values(SCHEMA).filter(m=>m.kind==="doc").forEach(m=>{
        const d = Store.getDoc(m.id);
        const blob = Object.values(d).filter(v=>typeof v==="string").join(" ").toLowerCase();
        if(blob.includes(query)) results.push({title:m.label, meta:"Page content match", go:()=>go(m.id)});
      });
    }

    results = results.slice(0,40);
    results.forEach((r,ix)=>{
      const b = el("button","pres"+(ix===0?" sel":""));
      b.appendChild(el("div","pres-t", r.title));
      b.appendChild(el("div","pres-m", r.meta));
      b.addEventListener("click", ()=>{ closePalette(); r.go(); });
      box.appendChild(b);
    });
    if(!results.length) box.appendChild(el("div","empty","Nothing matches that."));
  }

  function moveSel(d){
    const box = document.getElementById("paletteResults");
    const items = [...box.querySelectorAll(".pres")];
    if(!items.length) return;
    items[selIdx] && items[selIdx].classList.remove("sel");
    selIdx = (selIdx + d + items.length) % items.length;
    items[selIdx].classList.add("sel");
    items[selIdx].scrollIntoView({block:"nearest"});
  }

  /* ---------- theme ---------- */
  function applyTheme(t){
    document.documentElement.dataset.theme = t;
    try{ localStorage.setItem("lime-theme", t); }catch(e){}
  }

  /* ---------- boot ---------- */
  function boot(){
    try{ applyTheme(localStorage.getItem("lime-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light")); }catch(e){}

    Store.init(()=>{
      document.getElementById("boot").classList.add("gone");
      setTimeout(()=>{ document.getElementById("boot").remove(); }, 400);
      document.getElementById("app").hidden = false;
      buildNav();
      const hash = location.hash.replace("#","");
      go(SCHEMA[hash] ? hash : "dashboard");
      paintPresence();
      if(!Store.me().name) setTimeout(()=>askName(true), 600);
    });

    Store.subscribe(scope=>{
      if(scope === "presence" || scope === "me"){ paintPresence(); return; }
      if(scope === "error"){ UI.setSaveState("error"); return; }
      if(renderQueued) return;
      renderQueued = true;
      requestAnimationFrame(()=>{
        renderQueued = false;
        paintNav();
        if(view && view.refresh) view.refresh();
      });
    });

    /* chrome */
    document.getElementById("railOpen").addEventListener("click", ()=>{
      document.getElementById("rail").classList.add("open");
      document.getElementById("scrim").hidden = false;
    });
    const closeRail = ()=>{ document.getElementById("rail").classList.remove("open"); document.getElementById("scrim").hidden = true; };
    document.getElementById("railClose").addEventListener("click", closeRail);
    document.getElementById("scrim").addEventListener("click", closeRail);

    document.getElementById("themeBtn").addEventListener("click", ()=>{
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
    document.getElementById("whoBtn").addEventListener("click", ()=>askName(true));
    document.getElementById("searchBtn").addEventListener("click", openPalette);

    const pi = document.getElementById("paletteInput");
    pi.addEventListener("input", ()=>searchResults(pi.value));
    pi.addEventListener("keydown", e=>{
      if(e.key === "ArrowDown"){ e.preventDefault(); moveSel(1); }
      else if(e.key === "ArrowUp"){ e.preventDefault(); moveSel(-1); }
      else if(e.key === "Enter"){ e.preventDefault(); const r = results[selIdx]; if(r){ closePalette(); r.go(); } }
      else if(e.key === "Escape") closePalette();
    });
    document.getElementById("palette").addEventListener("click", e=>{ if(e.target.id === "palette") closePalette(); });

    window.addEventListener("keydown", e=>{
      if((e.metaKey||e.ctrlKey) && e.key.toLowerCase() === "k"){ e.preventDefault(); openPalette(); }
      if(e.key === "Escape") closePalette();
    });

    window.addEventListener("hashchange", ()=>{
      const h = location.hash.replace("#","");
      if(SCHEMA[h] && h !== current) go(h);
    });
  }

  return {boot, go, render, paintNav};
})();

document.addEventListener("DOMContentLoaded", App.boot);
