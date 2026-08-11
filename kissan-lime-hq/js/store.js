/* ============================================================
   STORE — one API, two engines.
   Team mode  : Firebase Firestore, live for everyone.
   Local mode : localStorage, live across tabs in one browser.
   ============================================================ */

const Store = (function(){

  const state = {
    mode: "local",          // "team" | "local"
    boardId: (new URLSearchParams(location.search).get("board")) || CONFIG.boardId,
    items: {},              // id -> item (has _type)
    docs: {},               // docId -> object
    presence: {},           // clientId -> {name,color,at}
    me: null,               // {id,name,color}
    ready: false,
    error: null
  };

  const subs = [];
  const notify = (scope) => subs.forEach(fn => { try{ fn(scope); }catch(e){ console.error(e); } });

  let db = null, chan = null;

  /* ---------- identity ---------- */
  const COLORS = ["#E31B23","#1F6F4A","#E8A21C","#6C2C6B","#1D6FA5","#B0141B","#3F7D3A","#C25E00"];
  function loadMe(){
    let raw = null;
    try{ raw = JSON.parse(localStorage.getItem("lime-me")||"null"); }catch(e){}
    if(!raw || !raw.id){
      raw = { id: "u"+Math.random().toString(36).slice(2,9), name:"", color: COLORS[Math.floor(Math.random()*COLORS.length)] };
    }
    state.me = raw;
    saveMe();
  }
  function saveMe(){ try{ localStorage.setItem("lime-me", JSON.stringify(state.me)); }catch(e){} }
  function setName(n){ state.me.name = (n||"").trim().slice(0,28); saveMe(); pushPresence(); notify("me"); }

  /* ---------- local engine ---------- */
  const LK = () => "lime-board-" + state.boardId;
  function localRead(){
    try{
      const raw = JSON.parse(localStorage.getItem(LK()) || "null");
      if(raw){ state.items = raw.items||{}; state.docs = raw.docs||{}; }
    }catch(e){ console.warn("local read failed", e); }
  }
  function localWrite(){
    try{
      localStorage.setItem(LK(), JSON.stringify({items:state.items, docs:state.docs, v:SEED_VERSION}));
      if(chan) chan.postMessage({t:"sync"});
    }catch(e){
      state.error = "Your browser storage is full. Export a backup from Settings and clear old boards.";
      notify("error");
    }
  }

  /* ---------- boot ---------- */
  function init(done){
    loadMe();

    if(CONFIG.isConfigured && window.firebase){
      try{
        firebase.initializeApp(CONFIG.firebase);
        db = firebase.firestore();
        firebase.auth().signInAnonymously().catch(err => {
          console.error("Anonymous sign-in failed", err);
          state.error = "Firebase rejected the sign-in. Turn on Anonymous sign-in in Authentication → Sign-in method.";
          notify("error");
        });
        firebase.auth().onAuthStateChanged(user => {
          if(!user) return;
          state.mode = "team";
          attachTeam(done);
        });
        return;
      }catch(e){
        console.error("Firebase init failed, falling back to local", e);
      }
    }

    state.mode = "local";
    localRead();
    try{
      chan = new BroadcastChannel("lime-"+state.boardId);
      chan.onmessage = () => { localRead(); notify("all"); };
    }catch(e){}
    window.addEventListener("storage", e => { if(e.key===LK()){ localRead(); notify("all"); } });
    maybeSeed().then(()=>{ state.ready = true; done && done(); notify("all"); });
  }

  function boardRef(){ return db.collection("boards").doc(state.boardId); }

  function attachTeam(done){
    let gotItems=false, gotDocs=false;
    const maybeReady = () => {
      if(gotItems && gotDocs && !state.ready){
        maybeSeed().then(()=>{ state.ready=true; done && done(); notify("all"); });
      } else notify("all");
    };

    boardRef().collection("items").onSnapshot(snap => {
      snap.docChanges().forEach(ch => {
        if(ch.type === "removed") delete state.items[ch.doc.id];
        else state.items[ch.doc.id] = Object.assign({id:ch.doc.id}, ch.doc.data());
      });
      gotItems = true; maybeReady();
    }, err => { state.error = "Cannot read the board: " + err.message; notify("error"); });

    boardRef().collection("docs").onSnapshot(snap => {
      snap.docChanges().forEach(ch => {
        if(ch.type === "removed") delete state.docs[ch.doc.id];
        else state.docs[ch.doc.id] = Object.assign({}, ch.doc.data());
      });
      gotDocs = true; maybeReady();
    }, err => { state.error = "Cannot read the board: " + err.message; notify("error"); });

    boardRef().collection("presence").onSnapshot(snap => {
      const now = Date.now(); const p = {};
      snap.forEach(d => {
        const v = d.data();
        const t = v.at && v.at.toMillis ? v.at.toMillis() : (v.ms||0);
        if(now - t < 100000) p[d.id] = {name:v.name, color:v.color};
      });
      state.presence = p; notify("presence");
    });

    pushPresence();
    setInterval(pushPresence, 25000);
  }

  function pushPresence(){
    if(state.mode !== "team" || !db) return;
    boardRef().collection("presence").doc(state.me.id).set({
      name: state.me.name || "Anonymous",
      color: state.me.color,
      ms: Date.now(),
      at: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(()=>{});
  }

  /* ---------- seeding ---------- */
  async function maybeSeed(){
    const meta = state.docs.__meta || {};
    if(meta.seeded >= SEED_VERSION) return;

    const batchItems = [];
    Object.keys(SEED).forEach(type => {
      const already = Object.values(state.items).some(i => i._type === type);
      if(already) return;
      SEED[type].forEach((row, i) => {
        batchItems.push(Object.assign({}, row, {
          _type: type, order: i, createdAt: Date.now(), createdBy: "Seed", seeded: true
        }));
      });
    });

    if(state.mode === "team"){
      try{
        await boardRef().set({ createdAt: Date.now(), teamName: CONFIG.teamName }, {merge:true});
        await boardRef().collection("docs").doc("__meta").set({ seeded: SEED_VERSION, seededAt: Date.now() }, {merge:true});
        let batch = db.batch(), n = 0;
        for(const it of batchItems){
          batch.set(boardRef().collection("items").doc(), it); n++;
          if(n % 400 === 0){ await batch.commit(); batch = db.batch(); }
        }
        await batch.commit();
      }catch(e){ console.error("Seeding failed", e); }
    } else {
      batchItems.forEach(it => {
        const id = "i"+Math.random().toString(36).slice(2,11);
        state.items[id] = Object.assign({id}, it);
      });
      state.docs.__meta = { seeded: SEED_VERSION, seededAt: Date.now() };
      localWrite();
    }
  }

  /* ---------- writes ---------- */
  const saveFlag = (s) => { try { UI.setSaveState(s); } catch(e){ /* UI not loaded yet */ } };

  function add(type, data){
    const base = Object.assign({
      _type: type, createdAt: Date.now(),
      createdBy: state.me.name || "Anonymous",
      order: Object.values(state.items).filter(i=>i._type===type).length
    }, data||{});
    if(state.mode === "team"){
      saveFlag("saving");
      const ref = boardRef().collection("items").doc();
      state.items[ref.id] = Object.assign({id:ref.id}, base);
      ref.set(base).then(()=>saveFlag("saved")).catch(e=>{saveFlag("error");console.error(e);});
      notify("items");
      return ref.id;
    }
    const id = "i"+Math.random().toString(36).slice(2,11);
    state.items[id] = Object.assign({id}, base);
    localWrite(); saveFlag("saved"); notify("items");
    return id;
  }

  function update(id, patch){
    if(!state.items[id]) return;
    Object.assign(state.items[id], patch);
    patch = Object.assign({}, patch, { updatedAt: Date.now(), updatedBy: state.me.name || "Anonymous" });
    if(state.mode === "team"){
      saveFlag("saving");
      boardRef().collection("items").doc(id).set(patch, {merge:true})
        .then(()=>saveFlag("saved")).catch(e=>{saveFlag("error");console.error(e);});
    } else { localWrite(); saveFlag("saved"); }
    notify("items:"+id);
  }

  function remove(id){
    delete state.items[id];
    if(state.mode === "team"){
      boardRef().collection("items").doc(id).delete().catch(console.error);
    } else localWrite();
    notify("items");
  }

  function getDoc(id){ return state.docs[id] || {}; }

  function updateDoc(id, patch){
    state.docs[id] = Object.assign({}, state.docs[id]||{}, patch);
    const payload = Object.assign({}, patch, { updatedAt: Date.now(), updatedBy: state.me.name || "Anonymous" });
    if(state.mode === "team"){
      saveFlag("saving");
      boardRef().collection("docs").doc(id).set(payload, {merge:true})
        .then(()=>saveFlag("saved")).catch(e=>{saveFlag("error");console.error(e);});
    } else { localWrite(); saveFlag("saved"); }
    notify("doc:"+id);
  }

  function byType(type){
    const m = SCHEMA[type] || {};
    const arr = Object.values(state.items).filter(i => i._type === type);
    const key = m.sortKey, dir = m.sortDir === "desc" ? -1 : 1;
    arr.sort((a,b) => {
      if(key){
        const av = a[key], bv = b[key];
        if(av !== bv){
          if(av === undefined || av === "" || av === null) return 1;
          if(bv === undefined || bv === "" || bv === null) return -1;
          return (av > bv ? 1 : -1) * dir;
        }
      }
      return (a.order ?? 0) - (b.order ?? 0) || (a.createdAt||0) - (b.createdAt||0);
    });
    return arr;
  }

  function allItems(){ return Object.values(state.items); }

  function toggleVote(id){
    const it = state.items[id]; if(!it) return;
    const votes = Object.assign({}, it.votes || {});
    if(votes[state.me.id]) delete votes[state.me.id];
    else votes[state.me.id] = state.me.name || "Anonymous";
    update(id, {votes});
  }

  function toggleConfirm(id){
    const it = state.items[id]; if(!it) return;
    update(id, it.confirmed
      ? {confirmed:false, confirmedBy:"", confirmedAt:0}
      : {confirmed:true, confirmedBy: state.me.name||"Anonymous", confirmedAt: Date.now()});
  }

  function addComment(id, text){
    const it = state.items[id]; if(!it || !text.trim()) return;
    const comments = (it.comments||[]).concat([{
      by: state.me.name||"Anonymous", color: state.me.color, at: Date.now(), text: text.trim()
    }]);
    update(id, {comments});
  }

  function exportJSON(){
    return JSON.stringify({
      board: state.boardId, exportedAt: new Date().toISOString(),
      items: state.items, docs: state.docs
    }, null, 2);
  }

  async function importJSON(json){
    const data = JSON.parse(json);
    if(!data.items) throw new Error("That file does not look like a war-room backup.");
    if(state.mode === "team"){
      let batch = db.batch(), n = 0;
      for(const [, v] of Object.entries(data.items)){
        const copy = Object.assign({}, v); delete copy.id;
        batch.set(boardRef().collection("items").doc(), copy); n++;
        if(n % 400 === 0){ await batch.commit(); batch = db.batch(); }
      }
      await batch.commit();
      for(const [k, v] of Object.entries(data.docs||{})){
        await boardRef().collection("docs").doc(k).set(v, {merge:true});
      }
    } else {
      Object.entries(data.items).forEach(([k,v]) => { state.items[k] = Object.assign({}, v, {id:k}); });
      Object.entries(data.docs||{}).forEach(([k,v]) => { state.docs[k] = v; });
      localWrite();
    }
    notify("all");
  }

  async function wipe(){
    if(state.mode === "team"){
      const snap = await boardRef().collection("items").get();
      let batch = db.batch(), n = 0;
      for(const d of snap.docs){ batch.delete(d.ref); n++; if(n%400===0){ await batch.commit(); batch = db.batch(); } }
      await batch.commit();
      const dsnap = await boardRef().collection("docs").get();
      for(const d of dsnap.docs) await d.ref.delete();
    } else {
      state.items = {}; state.docs = {}; localWrite();
    }
    notify("all");
  }

  return {
    state, init, subscribe:(fn)=>subs.push(fn),
    add, update, remove, byType, allItems,
    getDoc, updateDoc,
    toggleVote, toggleConfirm, addComment,
    setName, me:()=>state.me, presence:()=>state.presence,
    exportJSON, importJSON, wipe, reseed: maybeSeed
  };
})();
