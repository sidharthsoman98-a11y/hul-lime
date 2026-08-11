/* ============================================================
   UI — field builders and item cards.
   Fields are real DOM nodes so a live update from a teammate
   never steals focus from the box you are typing in.
   ============================================================ */

const UI = (function(){

  /* ---------- helpers ---------- */
  const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const el = (tag, cls, txt) => { const n=document.createElement(tag); if(cls)n.className=cls; if(txt!=null)n.textContent=txt; return n; };
  const html = (s) => { const t=document.createElement("template"); t.innerHTML=s.trim(); return t.content.firstElementChild; };

  const PALETTE = ["#E31B23","#1F6F4A","#E8A21C","#6C2C6B","#1D6FA5","#B0141B","#3F7D3A","#C25E00","#0F766E","#9333EA"];
  function colorFor(name){
    if(!name) return "#7C736C";
    let h=0; for(let i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))>>>0;
    return PALETTE[h % PALETTE.length];
  }
  function initials(name){
    if(!name) return "·";
    return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  }
  const words = s => (String(s||"").trim().match(/\S+/g)||[]).length;
  const debounce = (fn, ms=550) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };
  const fmtDate = ts => { if(!ts) return ""; const d=new Date(ts); return d.toLocaleDateString(undefined,{day:"numeric",month:"short"})+" "+d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"}); };
  const daysBetween = (a,b) => Math.round((b-a)/86400000);

  /* ---------- save indicator ---------- */
  let saveTimer;
  function setSaveState(s){
    const n = document.getElementById("saveState"); if(!n) return;
    n.dataset.state = s;
    n.textContent = s==="saving" ? "Saving…" : s==="error" ? "Not saved" : "Saved";
    if(s==="saved"){ clearTimeout(saveTimer); saveTimer=setTimeout(()=>{ n.dataset.state="idle"; }, 1600); }
  }

  function toast(msg){
    const w = document.getElementById("toasts");
    const t = el("div","toast",msg); w.appendChild(t);
    setTimeout(()=>{ t.style.opacity="0"; t.style.transition="opacity .3s"; setTimeout(()=>t.remove(),320); }, 2400);
  }

  /* ---------- people list ---------- */
  function people(){
    return Store.byType("team").map(t=>t.name).filter(Boolean);
  }

  /* ============================================================
     FIELD FACTORY
     ============================================================ */
  function buildField(field, value, onChange){
    const wrap = el("div", "f w"+(field.w||12));
    if(field.t !== "check"){
      const lab = el("label","label", field.l);
      wrap.appendChild(lab);
    }
    let input, get, set;

    const fire = () => onChange(get());
    const fireDebounced = debounce(fire, 600);

    switch(field.t){

      case "textarea":{
        input = el("textarea");
        input.rows = field.rows || 3;
        if(field.ph) input.placeholder = field.ph;
        input.value = value || "";
        get = ()=>input.value; set = v=>{ input.value = v||""; };
        input.addEventListener("input", ()=>{ updateCounter(); fireDebounced(); });
        input.addEventListener("blur", fire);
        break;
      }
      case "select":{
        input = el("select");
        input.appendChild(new Option("—",""));
        (field.o||[]).forEach(o => input.appendChild(new Option(o,o)));
        input.value = value || "";
        get = ()=>input.value; set = v=>{ input.value = v||""; };
        input.addEventListener("change", fire);
        break;
      }
      case "person":{
        input = el("select");
        const rebuild = (keep) => {
          const opts = people();
          input.innerHTML = "";
          input.appendChild(new Option("—",""));
          opts.forEach(o => input.appendChild(new Option(o,o)));
          if(keep && !opts.includes(keep)) input.appendChild(new Option(keep,keep));
          input.value = keep || "";
        };
        rebuild(value);
        get = ()=>input.value;
        set = v=>{ rebuild(v); };
        input.addEventListener("focus", ()=>rebuild(input.value));
        input.addEventListener("change", fire);
        if(!people().length){
          const h = el("div","help","Add people on the Team & Roles page and they will appear here.");
          wrap.appendChild(input); wrap.appendChild(h);
          return finish();
        }
        break;
      }
      case "multi":{
        input = el("div","tagrow");
        const sel = new Set(Array.isArray(value)?value:[]);
        (field.o||[]).forEach(o=>{
          const b = el("button","tag", o);
          b.type="button";
          const paint = ()=>{ b.style.background = sel.has(o) ? "var(--ink)" : "var(--wash)";
                              b.style.color = sel.has(o) ? "var(--paper)" : "var(--ink-2)";
                              b.style.borderColor = sel.has(o) ? "var(--ink)" : "var(--line)"; };
          b.style.cursor="pointer"; paint();
          b.addEventListener("click", ()=>{ sel.has(o)?sel.delete(o):sel.add(o); paint(); fire(); });
          b._paint = paint; b._val = o;
          input.appendChild(b);
        });
        get = ()=>[...sel];
        set = v=>{ sel.clear(); (Array.isArray(v)?v:[]).forEach(x=>sel.add(x)); [...input.children].forEach(c=>c._paint&&c._paint()); };
        break;
      }
      case "check":{
        input = el("label","chk");
        const box = el("input"); box.type="checkbox"; box.checked = !!value;
        const span = el("span", null, field.l);
        input.appendChild(box); input.appendChild(span);
        get = ()=>box.checked; set = v=>{ box.checked = !!v; };
        box.addEventListener("change", fire);
        break;
      }
      case "score":{
        input = el("div","row");
        input.style.gap="5px";
        let cur = Number(value)||0;
        const btns = [];
        for(let i=1;i<=5;i++){
          const b = el("button", "tag", String(i)); b.type="button";
          b.style.cursor="pointer"; b.style.minWidth="30px"; b.style.textAlign="center"; b.style.padding="3px 0"; b.style.flex="1";
          b.addEventListener("click", ()=>{ cur = (cur===i?0:i); paint(); fire(); });
          btns.push(b); input.appendChild(b);
        }
        function paint(){ btns.forEach((b,ix)=>{
          const on = ix+1 <= cur;
          b.style.background = on ? "var(--tomato)" : "var(--wash)";
          b.style.color = on ? "#fff" : "var(--muted)";
          b.style.borderColor = on ? "var(--tomato)" : "var(--line)";
        }); }
        paint();
        get = ()=>cur; set = v=>{ cur = Number(v)||0; paint(); };
        break;
      }
      case "number":{
        input = el("input"); input.type="number";
        if(field.ph) input.placeholder = field.ph;
        input.value = (value===0||value) ? value : "";
        get = ()=>input.value===""?"":Number(input.value); set = v=>{ input.value = (v===0||v)?v:""; };
        input.addEventListener("input", fireDebounced);
        input.addEventListener("change", fire);
        break;
      }
      case "date":{
        input = el("input"); input.type="date";
        input.value = value || "";
        get = ()=>input.value; set = v=>{ input.value = v||""; };
        input.addEventListener("change", fire);
        break;
      }
      case "url":{
        input = el("input"); input.type="url";
        input.placeholder = field.ph || "https://";
        input.value = value || "";
        get = ()=>input.value; set = v=>{ input.value = v||""; };
        input.addEventListener("input", fireDebounced);
        input.addEventListener("blur", fire);
        break;
      }
      default:{
        input = el("input"); input.type="text";
        if(field.ph) input.placeholder = field.ph;
        input.value = value || "";
        get = ()=>input.value; set = v=>{ input.value = v||""; };
        input.addEventListener("input", ()=>{ updateCounter(); fireDebounced(); });
        input.addEventListener("blur", fire);
      }
    }

    wrap.appendChild(input);

    /* counter */
    let counter = null;
    if(field.maxWords || field.maxChars){
      counter = el("div","counter");
      wrap.appendChild(counter);
    }
    function updateCounter(){
      if(!counter) return;
      const v = get() || "";
      if(field.maxWords){
        const n = words(v);
        counter.textContent = n + " / " + field.maxWords + " words";
        counter.className = "counter" + (n > field.maxWords ? " over" : n > field.maxWords*0.85 ? " near" : "");
      } else {
        const n = String(v).length;
        counter.textContent = n + " / " + field.maxChars + " characters";
        counter.className = "counter" + (n > field.maxChars ? " over" : n > field.maxChars*0.85 ? " near" : "");
      }
    }
    updateCounter();

    if(field.help) wrap.appendChild(el("div","help", field.help));

    function finish(){
      wrap._set = v => { set(v); updateCounter(); };
      wrap._get = get;
      wrap._input = input;
      wrap._key = field.k;
      return wrap;
    }
    return finish();
  }

  /* ============================================================
     FIELD SET  (renders a whole schema field list into a grid)
     ============================================================ */
  function buildFieldSet(fields, values, onChange){
    const frag = document.createDocumentFragment();
    const nodes = {};
    const groups = [];
    fields.forEach(f => {
      const g = f.g || "";
      let bucket = groups.find(x=>x.name===g);
      if(!bucket){ bucket = {name:g, fields:[]}; groups.push(bucket); }
      bucket.fields.push(f);
    });

    groups.forEach(g => {
      let holder;
      if(g.name){
        const fs = el("fieldset","fgroup");
        const lg = el("legend", null, g.name);
        fs.appendChild(lg);
        holder = el("div","fgrid");
        fs.appendChild(holder);
        frag.appendChild(fs);
      } else {
        holder = el("div","fgrid");
        holder.style.marginBottom = "18px";
        frag.appendChild(holder);
      }
      g.fields.forEach(f => {
        const node = buildField(f, values[f.k], v => onChange(f.k, v));
        nodes[f.k] = node;
        holder.appendChild(node);
      });
    });

    return {frag, nodes};
  }

  /* ============================================================
     ITEM CARD
     ============================================================ */
  function scoreOf(mod, item){
    if(!mod.scorecard) return null;
    let sum = 0, filled = 0;
    mod.scorecard.keys.forEach(k => { const v = Number(item[k])||0; sum += v; if(v) filled++; });
    return {sum, filled, max: mod.scorecard.max, complete: filled === mod.scorecard.keys.length};
  }

  function itemCard(mod, item, opts){
    opts = opts || {};
    const card = el("div", "item" + (item.confirmed ? " confirmed" : ""));
    card.dataset.id = item.id;

    /* head */
    const head = el("div","item-head");
    const caret = el("div","caret","▶");
    const main = el("div","item-main");
    const titleVal = item[mod.titleField];
    const title = el("div","item-title" + (titleVal ? "" : " empty"), titleVal || "Untitled — click to fill in");
    main.appendChild(title);

    const sub = el("div","item-sub");
    function paintSub(){
      sub.innerHTML = "";
      const cur = Store.state.items[item.id] || item;
      (mod.subFields||[]).forEach(k=>{
        const v = cur[k];
        if(v===undefined || v==="" || v===null) return;
        sub.appendChild(el("span",null, Array.isArray(v)?v.join(", "):String(v)));
      });
      if(mod.showSuggestedDate){
        const d = cur.date ? new Date(cur.date) : Views.suggestedDate(cur.daysBefore);
        if(d) sub.appendChild(el("span","pill plain", Views.shortDate(d) + (cur.daysBefore!=null&&cur.daysBefore!==""?" · D-"+cur.daysBefore:"")));
      }
      if(cur.seeded) sub.appendChild(el("span","tiny muted","pre-loaded"));
      else if(cur.createdBy && cur.createdBy !== "Seed") sub.appendChild(el("span","tiny muted","by "+cur.createdBy));
      if(cur.updatedAt) sub.appendChild(el("span","tiny muted","edited "+fmtDate(cur.updatedAt)));
      if((cur.comments||[]).length) sub.appendChild(el("span","tiny muted","💬 "+cur.comments.length));
      sub.style.display = sub.children.length ? "" : "none";
    }
    paintSub();
    main.appendChild(sub);

    const side = el("div","item-side");
    function paintSide(){
      side.innerHTML = "";
      const cur = Store.state.items[item.id] || item;

      const sc = scoreOf(mod, cur);
      if(sc && sc.filled){
        const p = el("span","pill" + (sc.sum >= 20 ? " ok" : sc.sum >= 15 ? " warn" : ""), sc.sum+"/"+sc.max);
        p.title = "Scorecard total";
        side.appendChild(p);
      }

      if(mod.statusField && cur[mod.statusField]){
        const v = cur[mod.statusField];
        const good = /Done|Met|Verified|Selected|Bulletproof|Strong|This is the one|Keep|Confirmed/i.test(v);
        const bad = /Blocked|At risk|Slipped|Killed|Rejected|No answer|Not a factor|Cut|Critical|To find/i.test(v);
        side.appendChild(el("span","pill"+(good?" ok":bad?" hot":""), v));
      }

      if(mod.votable){
        const n = Object.keys(cur.votes||{}).length;
        const vb = el("button","vote"+(cur.votes && cur.votes[Store.me().id] ? " on":""), "▲ "+n);
        vb.type="button";
        vb.title = Object.values(cur.votes||{}).join(", ") || "No votes yet";
        vb.addEventListener("click", e => { e.stopPropagation(); Store.toggleVote(item.id); });
        side.appendChild(vb);
      }

      if(mod.confirmable){
        const cb = el("button","confirm-btn"+(cur.confirmed?" on":""), cur.confirmed ? "✓ In final" : "Add to final");
        cb.type="button";
        cb.title = cur.confirmed ? ("Confirmed by "+(cur.confirmedBy||"someone")) : "Send this to the Final Output Hub";
        cb.addEventListener("click", e => { e.stopPropagation(); Store.toggleConfirm(item.id); });
        side.appendChild(cb);
      }
    }
    paintSide();

    head.appendChild(caret); head.appendChild(main); head.appendChild(side);
    card.appendChild(head);

    /* body (lazy) */
    let body = null;
    let fieldNodes = null;

    function openCard(){
      if(body) { body.hidden = false; card.classList.add("open"); return; }
      body = el("div","item-body");
      const values = Store.state.items[item.id] || item;
      const built = buildFieldSet(mod.fields, values, (k,v) => {
        const patch = {}; patch[k] = v;
        Store.update(item.id, patch);
        if(k === mod.titleField){
          title.textContent = v || "Untitled — click to fill in";
          title.className = "item-title" + (v ? "" : " empty");
        }
      });
      fieldNodes = built.nodes;
      body.appendChild(built.frag);

      /* scorecard summary */
      if(mod.scorecard){
        const box = el("div","callout");
        const upd = () => {
          const s = scoreOf(mod, Store.state.items[item.id]||item);
          box.innerHTML = "<h5>Scorecard</h5><div class='small'>Total <b>"+s.sum+" / "+s.max+"</b>" +
            (s.complete ? "" : " — "+(mod.scorecard.keys.length - s.filled)+" criteria still unscored") + "</div>";
        };
        upd();
        card._updScore = upd;
        body.appendChild(box);
      }

      /* comments */
      if(mod.commentable){
        const cw = el("div","comments");
        const list = el("div");
        const renderComments = () => {
          list.innerHTML = "";
          const cur = Store.state.items[item.id] || item;
          (cur.comments||[]).forEach(c => {
            const row = el("div","cmt");
            const av = el("div","cmt-av", initials(c.by));
            av.style.background = c.color || colorFor(c.by);
            const b = el("div","cmt-b");
            b.appendChild(el("div","cmt-meta", c.by + " · " + fmtDate(c.at)));
            b.appendChild(el("div","cmt-txt", c.text));
            row.appendChild(av); row.appendChild(b); list.appendChild(row);
          });
        };
        renderComments();
        card._renderComments = renderComments;
        cw.appendChild(list);
        const form = el("div","cmt-form");
        const inp = el("input"); inp.type="text"; inp.placeholder="Add a note for the team…";
        const btn = el("button","btn sec tiny-btn","Post");
        const post = () => { if(inp.value.trim()){ Store.addComment(item.id, inp.value); inp.value=""; renderComments(); } };
        btn.addEventListener("click", post);
        inp.addEventListener("keydown", e => { if(e.key==="Enter") post(); });
        form.appendChild(inp); form.appendChild(btn);
        cw.appendChild(form);
        body.appendChild(cw);
      }

      /* actions */
      const acts = el("div","item-actions");
      if(item.confirmedBy && item.confirmed) acts.appendChild(el("span","tiny muted","Confirmed by "+item.confirmedBy));
      const dup = el("button","link-btn","Duplicate");
      dup.addEventListener("click", ()=>{
        const cur = Object.assign({}, Store.state.items[item.id]);
        delete cur.id; delete cur.seeded; delete cur.confirmed; delete cur.votes; delete cur.comments;
        cur[mod.titleField] = (cur[mod.titleField]||"") + " (copy)";
        Store.add(mod.id, cur); toast("Duplicated");
      });
      const del = el("button","link-btn danger","Delete");
      del.addEventListener("click", ()=>{
        if(confirm("Delete this permanently? Everyone on the board loses it.")){ Store.remove(item.id); card.remove(); }
      });
      acts.appendChild(dup); acts.appendChild(del);
      body.appendChild(acts);

      card.appendChild(body);
      card.classList.add("open");
    }

    function closeCard(){ if(body) body.hidden = true; card.classList.remove("open"); }

    head.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      if(isOpen) closeCard(); else openCard();
    });

    if(opts.startOpen) openCard();

    /* remote refresh without stealing focus */
    card._refresh = () => {
      const cur = Store.state.items[item.id];
      if(!cur){ card.remove(); return; }
      const tv = cur[mod.titleField];
      title.textContent = tv || "Untitled — click to fill in";
      title.className = "item-title" + (tv ? "" : " empty");
      card.classList.toggle("confirmed", !!cur.confirmed);
      paintSub();
      paintSide();
      if(fieldNodes){
        Object.entries(fieldNodes).forEach(([k,node]) => {
          if(node._input && document.activeElement && node._input.contains(document.activeElement)) return;
          if(node._input === document.activeElement) return;
          const nv = cur[k];
          const same = JSON.stringify(node._get()) === JSON.stringify(nv===undefined?(Array.isArray(node._get())?[]:""):nv);
          if(!same) node._set(nv);
        });
      }
      if(card._updScore) card._updScore();
      if(card._renderComments) card._renderComments();
    };

    card._open = openCard;
    return card;
  }

  return { esc, el, html, colorFor, initials, words, debounce, fmtDate, daysBetween,
           setSaveState, toast, buildField, buildFieldSet, itemCard, scoreOf, people };
})();
