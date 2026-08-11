/* ============================================================
   SCHEMA — every section, every field.
   kind: 'custom' | 'collection' | 'doc' | 'static'
   field: {k:key, l:label, t:type, o:options, w:width, g:group,
           ph:placeholder, help:, rows:, maxWords:, maxChars:}
   types: text textarea select multi tags number date check score
          person url
   ============================================================ */

const GENERATIONS = ["Gen Z (18–27)","Millennial (28–43)","Gen X (44–59)","Boomer (60+)"];
const TIERS = ["Metro","Tier 1","Tier 2","Tier 3","Rural"];
const CHANNELS = ["Kirana / general trade","Supermarket / modern trade","Blinkit","Zepto","Swiggy Instamart","BigBasket","Amazon / Flipkart","Brand D2C site","Local mandi / fresh market","Restaurant / QSR"];
const THEMES = ["Experimentation","Ritual","Convenience","Missing flavour","Discovery","Brand cues","Health","Value / price","Kids","Regional pride","Snacking","Cooking base","Guest / hosting","Solo eating"];

const SCHEMA = {

/* ============================================================
   COMMAND
   ============================================================ */

dashboard: {
  id:"dashboard", label:"Dashboard", icon:"◈", group:"Command", kind:"custom"
},

brief: {
  id:"brief", label:"The Case, Decoded", icon:"❖", group:"Command", kind:"static",
  title:"The case, decoded",
  eyebrow:"L.I.M.E. Season 18 · The Next Shelf",
  intro:"Everything the deck asks for, stripped of packaging. Read this before you touch anything else. If a decision you make later does not ladder back to something on this page, it will not score."
},

requirements: {
  id:"requirements", label:"Deliverable Checklist", icon:"☑", group:"Command", kind:"collection",
  title:"Deliverable checklist",
  eyebrow:"Non-negotiables",
  intro:"Every explicit instruction in the deck, turned into a pass/fail line. A jury does not give marks for effort on things they did not ask for. Tick each one only when you can point at the evidence.",
  titleField:"req", statusField:"state",
  subFields:["source","owner"],
  statusOptions:["Not started","In progress","Met","At risk"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"req", l:"Requirement", t:"text", w:12},
    {k:"source", l:"Where it comes from", t:"text", w:6, ph:"e.g. Task 1, Part 3"},
    {k:"state", l:"Status", t:"select", o:["Not started","In progress","Met","At risk"], w:3},
    {k:"owner", l:"Owner", t:"person", w:3},
    {k:"evidence", l:"Evidence it is met", t:"textarea", w:12, rows:2, ph:"Link, file name, or the section of this site where it lives."}
  ]
},

team: {
  id:"team", label:"Team & Roles", icon:"◎", group:"Command", kind:"collection",
  title:"Team & roles",
  eyebrow:"Who owns what",
  intro:"Case teams lose on coordination, not intelligence. One named owner per workstream. Fieldwork quotas split here so nobody discovers on the last weekend that they did four interviews and someone else did none.",
  titleField:"name", statusField:"role",
  subFields:["baseCity","quota"],
  statusOptions:["Team lead","Consumer research","Insight & strategy","Product & pricing","Design & deck","Video & pitch"],
  confirmable:false, votable:false, commentable:false,
  fields:[
    {k:"name", l:"Name", t:"text", w:6},
    {k:"role", l:"Primary role", t:"select", o:["Team lead","Consumer research","Insight & strategy","Product & pricing","Design & deck","Video & pitch"], w:6},
    {k:"secondary", l:"Second hat", t:"text", w:6, ph:"What else they cover when it gets tight"},
    {k:"contact", l:"Phone / email", t:"text", w:6},
    {k:"baseCity", l:"Fieldwork base city", t:"text", w:6, ph:"Where they will actually meet consumers"},
    {k:"tierAccess", l:"City tiers they can reach", t:"multi", o:TIERS, w:6},
    {k:"quota", l:"Interview quota", t:"number", w:3, ph:"e.g. 5"},
    {k:"languages", l:"Languages", t:"text", w:3},
    {k:"strength", l:"What they are genuinely good at", t:"textarea", w:6, rows:2},
    {k:"availability", l:"Hard constraints / unavailable dates", t:"textarea", w:6, rows:2}
  ]
},

timeline: {
  id:"timeline", label:"Timeline", icon:"◷", group:"Command", kind:"collection",
  title:"Timeline",
  eyebrow:"Working backwards from submission",
  intro:"Set your submission date in Settings and every milestone below gets a suggested date automatically. The plan assumes fieldwork is the long pole — because it is. Protect it.",
  titleField:"milestone", statusField:"state",
  subFields:["owner"], showSuggestedDate:true,
  statusOptions:["Not started","In progress","Done","Slipped"],
  sortKey:"daysBefore", sortDir:"desc",
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"milestone", l:"Milestone", t:"text", w:12},
    {k:"daysBefore", l:"Days before submission", t:"number", w:3},
    {k:"date", l:"Actual date (overrides)", t:"date", w:3},
    {k:"owner", l:"Owner", t:"person", w:3},
    {k:"state", l:"Status", t:"select", o:["Not started","In progress","Done","Slipped"], w:3},
    {k:"definition", l:"Definition of done", t:"textarea", w:12, rows:2, ph:"What has to exist for this to be finished. Be specific enough that nobody can argue."}
  ]
},

tasks: {
  id:"tasks", label:"Task Board", icon:"▤", group:"Command", kind:"collection", view:"kanban",
  title:"Task board",
  eyebrow:"60 things that have to happen",
  intro:"Pre-loaded with the full build plan. Assign an owner to every card in the first sitting. Anything without an owner will not get done.",
  titleField:"task", statusField:"state",
  subFields:["stream","owner","due"],
  statusOptions:["To do","Doing","Blocked","Done"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"task", l:"Task", t:"text", w:12},
    {k:"stream", l:"Workstream", t:"select", o:["Setup","Research","Secondary data","Synthesis","Ideation","Build","Validate","GTM","Deliverables","Submission"], w:4},
    {k:"owner", l:"Owner", t:"person", w:4},
    {k:"state", l:"Status", t:"select", o:["To do","Doing","Blocked","Done"], w:4},
    {k:"due", l:"Due", t:"date", w:4},
    {k:"effort", l:"Effort", t:"select", o:["30 min","2 hours","Half day","Full day","Multi-day"], w:4},
    {k:"priority", l:"Priority", t:"select", o:["P0 — case fails without it","P1 — materially better","P2 — nice to have"], w:4},
    {k:"notes", l:"Notes / blockers", t:"textarea", w:12, rows:2}
  ]
},

/* ============================================================
   TASK 1 — DISCOVER
   ============================================================ */

researchPlan: {
  id:"researchPlan", label:"Research Plan", icon:"◑", group:"Task 1 · Discover", kind:"doc",
  title:"Research plan",
  eyebrow:"Task 1 · Design before you go out",
  intro:"The deck is unusually explicit: no Google Forms, twenty people, at least two generations, ideally more than one city tier, in real contexts. This page is the design. Fill it before the first interview — the second interview is always better than the first, and a written plan is why.",
  confirmable:true,
  sections:[
    {title:"Objectives", fields:[
      {k:"objective", l:"What we are trying to learn", t:"textarea", w:12, rows:3, ph:"Three or four learning objectives, written as questions we cannot currently answer."},
      {k:"hypotheses", l:"Starting hypotheses (to be killed, not confirmed)", t:"textarea", w:12, rows:4, ph:"Write them down now so you can be honest later about which ones the field destroyed. A hypothesis you never wrote down is one you will quietly claim you had all along."},
      {k:"killCriteria", l:"What evidence would prove us wrong", t:"textarea", w:12, rows:3}
    ]},
    {title:"Sample design", fields:[
      {k:"sampleTotal", l:"Total respondents", t:"number", w:3, ph:"20 minimum"},
      {k:"buffer", l:"Buffer recruits", t:"number", w:3, ph:"Recruit 24 to land 20"},
      {k:"genSplit", l:"Generational split", t:"textarea", w:6, rows:2, ph:"e.g. 10 Gen Z, 6 Millennial, 4 Gen X+ — and why that shape"},
      {k:"citySplit", l:"City and tier split", t:"textarea", w:6, rows:2, ph:"Which cities, which tiers, who covers each"},
      {k:"cohorts", l:"Cohorts we deliberately want", t:"textarea", w:6, rows:3, ph:"e.g. hostel cook, working mother, single professional cooking for one, joint-family kitchen decision maker, home chef who posts food"},
      {k:"exclusions", l:"Who we are deliberately NOT talking to, and why", t:"textarea", w:12, rows:2, ph:"A sample of only your own classmates is the fastest way to lose this case."}
    ]},
    {title:"Methods", fields:[
      {k:"methods", l:"Methods in play", t:"multi", o:["In-home cook-along","Fridge / pantry audit","Shop-along (kirana)","Shop-along (modern trade)","Quick-commerce basket walkthrough","Café / campus intercept","WhatsApp photo diary","Group kitchen observation","Repeat / follow-up interview"], w:12},
      {k:"methodPlan", l:"How many of each, run by whom", t:"textarea", w:12, rows:3},
      {k:"stimulus", l:"Stimulus we will carry", t:"textarea", w:6, rows:3, ph:"Pack shots, competitor products, flavour cards, price cards, a blank pack to project onto"},
      {k:"kit", l:"Field kit checklist", t:"textarea", w:6, rows:3, ph:"Phone + charger, notebook, consent script, stimulus cards, small thank-you gift, offline note template"}
    ]},
    {title:"Ethics & quality", fields:[
      {k:"consent", l:"Consent script (read aloud, every time)", t:"textarea", w:12, rows:3, ph:"Who we are, what this is for, that it is a student competition, that we will record/photograph only with permission, that they can stop at any point, that we will not use their full name."},
      {k:"incentive", l:"Thank-you / incentive approach", t:"textarea", w:6, rows:2},
      {k:"bias", l:"Bias controls", t:"textarea", w:6, rows:3, ph:"No leading questions. Ask about last time, not usually. Ask to be shown, not told. Two people per interview — one talks, one writes. Write up within 24 hours."},
      {k:"debrief", l:"Debrief routine after each interview", t:"textarea", w:12, rows:2, ph:"Ten minutes, immediately: what surprised us, what contradicted itself, one quote worth keeping."}
    ]}
  ]
},

guide: {
  id:"guide", label:"Discussion Guide", icon:"❓", group:"Task 1 · Discover", kind:"collection",
  title:"Discussion guide",
  eyebrow:"Task 1 · The questions",
  intro:"Pre-loaded with a working guide built around the six things the deck asks you to explore, plus laddering and projective questions that get past the polite answer. Pilot it on two people, then cut the questions that produced nothing.",
  titleField:"q", statusField:"state",
  statusOptions:["Draft","Piloted","Keep","Cut"],
  groupField:"section",
  confirmable:false, votable:true, commentable:true,
  fields:[
    {k:"q", l:"Question", t:"textarea", w:12, rows:2},
    {k:"section", l:"Section", t:"select", o:["Warm-up & context","Kitchen tour & audit","Rituals","Experimentation","Convenience","Missing flavours","Discovery & first trial","Brand cues: new vs old","Projective & laddering","Close"], w:6},
    {k:"explore", l:"Deck question it answers", t:"select", o:["1 · What drives experimentation","2 · Non-negotiable food rituals","3 · Where they seek convenience","4 · Missing flavours or experiences","5 · Discovery & first trial","6 · New/exciting vs old/safe brand cues","Context / rapport"], w:6},
    {k:"probe", l:"Probes", t:"textarea", w:12, rows:2, ph:"Follow-ups that get past the first, polite answer."},
    {k:"state", l:"Status", t:"select", o:["Draft","Piloted","Keep","Cut"], w:4},
    {k:"mins", l:"Minutes", t:"number", w:4},
    {k:"learning", l:"What it actually produced in the field", t:"textarea", w:12, rows:2}
  ]
},

interviews: {
  id:"interviews", label:"Interview Log", icon:"🗣", group:"Task 1 · Discover", kind:"collection",
  title:"Interview log",
  eyebrow:"Task 1 · Twenty conversations",
  intro:"One record per person. Write it up within 24 hours or you will lose the detail that makes it useful. The fields that win cases are near the bottom: what they did that contradicted what they said, and what surprised you.",
  titleField:"name", statusField:"state",
  statusOptions:["Scheduled","Done — not written up","Written up","Synthesised"],
  target:20, targetLabel:"of 20 required",
  subFields:["age","gen","city","tier","interviewer"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"name", l:"Name or code", t:"text", w:4, g:"Who", ph:"First name is fine — do not publish full names"},
    {k:"age", l:"Age", t:"number", w:2, g:"Who"},
    {k:"gen", l:"Generation", t:"select", o:GENERATIONS, w:6, g:"Who"},
    {k:"gender", l:"Gender", t:"select", o:["Female","Male","Other / not stated"], w:3, g:"Who"},
    {k:"city", l:"City", t:"text", w:3, g:"Who"},
    {k:"tier", l:"City tier", t:"select", o:TIERS, w:3, g:"Who"},
    {k:"occupation", l:"Occupation", t:"text", w:3, g:"Who"},
    {k:"household", l:"Household", t:"text", w:6, g:"Who", ph:"e.g. 4 — self, spouse, one child, mother-in-law"},
    {k:"cooksWho", l:"Who actually cooks", t:"text", w:3, g:"Who", ph:"Self / mother / help / mix"},
    {k:"incomeProxy", l:"Income proxy or LSM", t:"text", w:3, g:"Who", ph:"Rough is fine — rent, car, phone"},

    {k:"interviewer", l:"Interviewed by", t:"person", w:4, g:"Logistics"},
    {k:"date", l:"Date", t:"date", w:4, g:"Logistics"},
    {k:"mins", l:"Duration (mins)", t:"number", w:4, g:"Logistics"},
    {k:"method", l:"Method", t:"multi", o:["In-home cook-along","Fridge / pantry audit","Shop-along (kirana)","Shop-along (modern trade)","Quick-commerce basket walkthrough","Café / campus intercept","WhatsApp photo diary","Phone follow-up"], w:12, g:"Logistics"},
    {k:"consent", l:"Consent taken and recorded", t:"check", w:6, g:"Logistics"},
    {k:"media", l:"Photos / recording link", t:"url", w:6, g:"Logistics"},

    {k:"e1", l:"1 · What drives their experimentation", t:"textarea", w:12, rows:3, g:"The six questions", ph:"Last new thing they cooked or bought. What set it off. Who was watching. What would have stopped them."},
    {k:"e2", l:"2 · Food rituals that are non-negotiable", t:"textarea", w:12, rows:3, g:"The six questions", ph:"What never changes, and what happens if it does. Weekday vs Sunday. Who enforces it."},
    {k:"e3", l:"3 · Where they seek convenience", t:"textarea", w:12, rows:3, g:"The six questions", ph:"Which step of cooking they would happily outsource, and which one they never would."},
    {k:"e4", l:"4 · Flavours or experiences missing today", t:"textarea", w:12, rows:3, g:"The six questions", ph:"What they wish existed in a jar. What they only get outside the home. What they gave up on making."},
    {k:"e5", l:"5 · How they discover, and what triggers first trial", t:"textarea", w:12, rows:3, g:"The six questions", ph:"Trace the last one end to end: saw it where, what made them click, what made them actually pay."},
    {k:"e6", l:"6 · What makes a brand feel new vs old", t:"textarea", w:12, rows:3, g:"The six questions", ph:"Ask them to point at packs and sort them. Get the vocabulary, not the verdict."},

    {k:"fridge", l:"Fridge / pantry audit — condiments and sauces present", t:"textarea", w:12, rows:3, g:"What we saw", ph:"Every jar and bottle. Which are open, which are dusty, which are homemade, which are decanted into other containers."},
    {k:"brandsWhy", l:"Brands in the home, and why each one is there", t:"textarea", w:12, rows:3, g:"What we saw", ph:"Inherited from mother / cheapest / kid demanded it / saw a reel / it was the only one in stock"},
    {k:"kissan", l:"Kissan: use, memory and perception", t:"textarea", w:12, rows:3, g:"What we saw", ph:"Unprompted first. Then prompted. Childhood associations. Where they would place it on a shelf next to Veeba."},
    {k:"lastNew", l:"Last new food product they tried, start to finish", t:"textarea", w:12, rows:2, g:"What we saw"},
    {k:"buyWhere", l:"Where they buy", t:"multi", o:CHANNELS, w:12, g:"What we saw"},
    {k:"qcomm", l:"Quick-commerce behaviour", t:"textarea", w:12, rows:2, g:"What we saw", ph:"Open their app with permission. Look at reorder list and last five food orders. That list is more honest than any answer."},

    {k:"contradiction", l:"Said one thing, did another", t:"textarea", w:12, rows:3, g:"The gold", ph:"The single most valuable field on this page. What they claimed vs what the kitchen showed."},
    {k:"surprise", l:"What surprised us", t:"textarea", w:12, rows:2, g:"The gold"},
    {k:"quote", l:"Best quote, verbatim", t:"textarea", w:12, rows:2, g:"The gold", ph:"Exact words. Do not tidy the grammar — the texture is the point."},
    {k:"themes", l:"Themes", t:"multi", o:THEMES, w:8, g:"The gold"},
    {k:"potential", l:"Insight potential", t:"score", w:4, g:"The gold"},
    {k:"state", l:"Status", t:"select", o:["Scheduled","Done — not written up","Written up","Synthesised"], w:6, g:"The gold"}
  ]
},

audits: {
  id:"audits", label:"Shelf & App Audits", icon:"▦", group:"Task 1 · Discover", kind:"collection",
  title:"Shelf & app audits",
  eyebrow:"Task 1 · Where the category actually lives",
  intro:"The deck says the game is about who owns the shelf. Go and look at the shelf — physical and digital. Count facings. Screenshot the quick-commerce category page. This is the cheapest credibility you will ever buy in front of a jury.",
  titleField:"place", statusField:"type",
  subFields:["cityTier","by"],
  statusOptions:["Kirana","Supermarket","Hypermarket","Blinkit","Zepto","Swiggy Instamart","BigBasket","Amazon","D2C site"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"place", l:"Store or app", t:"text", w:6},
    {k:"type", l:"Type", t:"select", o:["Kirana","Supermarket","Hypermarket","Blinkit","Zepto","Swiggy Instamart","BigBasket","Amazon","D2C site"], w:3},
    {k:"cityTier", l:"City / tier", t:"text", w:3},
    {k:"by", l:"Audited by", t:"person", w:3},
    {k:"date", l:"Date", t:"date", w:3},
    {k:"brandsPresent", l:"Brands present, in shelf order", t:"textarea", w:12, rows:3, ph:"Left to right, top to bottom. Order is information."},
    {k:"facings", l:"Facings by brand", t:"textarea", w:6, rows:3, ph:"Kissan 6, Veeba 9, Maggi 5, Ching's 4…"},
    {k:"priceLadder", l:"Price ladder captured", t:"textarea", w:6, rows:3, ph:"Brand · SKU · grams · MRP · price per 100g. Per-100g is the number that matters."},
    {k:"adjacency", l:"What it sits next to", t:"textarea", w:6, rows:2, ph:"Adjacency tells you the occasion the retailer thinks it belongs to."},
    {k:"newLaunches", l:"New launches and shelf-talkers spotted", t:"textarea", w:6, rows:2},
    {k:"chutneyShelf", l:"Chutney / pickle / dip section — what exists today", t:"textarea", w:12, rows:3, ph:"Is there even a section? Packaged or loose? Which brands? What does it cost? What is missing?"},
    {k:"digitalNotes", l:"Digital shelf notes", t:"textarea", w:12, rows:3, ph:"Search terms tried, what ranks, thumbnail legibility at phone size, ratings, review complaints, delivery time, out-of-stock rate."},
    {k:"gap", l:"The gap this audit reveals", t:"textarea", w:12, rows:2},
    {k:"photos", l:"Photo folder link", t:"url", w:12}
  ]
},

survey: {
  id:"survey", label:"Survey Design", icon:"⊞", group:"Task 1 · Discover", kind:"doc",
  title:"Survey design",
  eyebrow:"Task 1 · Only as a supplement",
  intro:"The deck explicitly says do not run a Google Form. Read that as: a form cannot be your research. It can still be useful afterwards — once the twenty conversations have told you what to ask, a survey can size whether a pattern holds beyond your sample. Design it last, keep it short, and never let it become the story.",
  confirmable:true,
  sections:[
    {title:"Should this exist at all", fields:[
      {k:"justify", l:"What the survey adds that the interviews cannot", t:"textarea", w:12, rows:3, ph:"If the honest answer is 'a bigger number for the slide', do not run it."},
      {k:"whenReady", l:"Interviews completed before writing this", t:"number", w:4, ph:"Should be at least 10"},
      {k:"hypotheses", l:"Specific hypotheses being tested", t:"textarea", w:8, rows:3, ph:"Each one should be answerable with a percentage."}
    ]},
    {title:"The instrument", fields:[
      {k:"screener", l:"Screener questions", t:"textarea", w:12, rows:3, ph:"Who gets in and who gets screened out. Age, city, who cooks, category use."},
      {k:"questions", l:"Question list", t:"textarea", w:12, rows:8, ph:"Ten questions maximum. Behaviour before attitude. No leading options. Include one open text field — it will be the most useful column."},
      {k:"length", l:"Expected completion time", t:"text", w:4, ph:"Under four minutes or drop-off ruins your data"},
      {k:"targetN", l:"Target responses", t:"number", w:4},
      {k:"quotas", l:"Quotas", t:"text", w:4, ph:"e.g. min 30% over 40, min 30% outside metros"}
    ]},
    {title:"Fielding", fields:[
      {k:"link", l:"Survey link", t:"url", w:8},
      {k:"actualN", l:"Responses received", t:"number", w:4},
      {k:"distribution", l:"How it was distributed", t:"textarea", w:12, rows:2, ph:"Be honest about this. A survey circulated only inside your own network is a survey about your own network, and a jury will ask."},
      {k:"bias", l:"Known bias in the sample", t:"textarea", w:12, rows:2},
      {k:"resultsLink", l:"Raw results link", t:"url", w:12}
    ]}
  ]
},

surveyFindings: {
  id:"surveyFindings", label:"Survey Findings", icon:"◔", group:"Task 1 · Discover", kind:"collection",
  title:"Survey findings",
  eyebrow:"Task 1 · One card per number",
  intro:"One finding per card, each with the base size attached. A percentage without an n is a claim a jury can dismantle in one question. Confirm only the findings that genuinely change what you would do.",
  titleField:"finding", statusField:"strength",
  subFields:["stat","base"],
  statusOptions:["Directional only","Solid","Strong","Contradicts our interviews"],
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"finding", l:"Finding, in one sentence", t:"text", w:12},
    {k:"question", l:"Question it came from", t:"textarea", w:12, rows:2},
    {k:"stat", l:"The number", t:"text", w:4, ph:"e.g. 62%"},
    {k:"base", l:"Base size (n)", t:"number", w:4},
    {k:"strength", l:"Strength", t:"select", o:["Directional only","Solid","Strong","Contradicts our interviews"], w:4},
    {k:"cut", l:"Interesting cut", t:"textarea", w:12, rows:2, ph:"Where it splits — by age, tier, who cooks. The split is usually more useful than the headline."},
    {k:"vsField", l:"Does it agree with what you saw in homes?", t:"textarea", w:12, rows:2, ph:"When the survey and the fieldwork disagree, trust the fieldwork and say why in your answer."},
    {k:"soWhat", l:"So what", t:"textarea", w:12, rows:2}
  ]
},

verbatims: {
  id:"verbatims", label:"Verbatim Bank", icon:"❝", group:"Task 1 · Discover", kind:"collection",
  title:"Verbatim bank",
  eyebrow:"Task 1 · Their words, not yours",
  intro:"One quote per card. Juries remember quotes and forget frameworks. Confirm the two or three that are strong enough to go on a slide — a confirmed quote flows straight into the Final Output Hub.",
  titleField:"quote", statusField:"theme",
  subFields:["who"],
  statusOptions:THEMES,
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"quote", l:"Quote, exactly as said", t:"textarea", w:12, rows:3},
    {k:"who", l:"Who said it", t:"text", w:4, ph:"e.g. Ritika, 24, Pune"},
    {k:"lang", l:"Original language", t:"text", w:4, ph:"If translated, note the original phrase too"},
    {k:"theme", l:"Theme", t:"select", o:THEMES, w:4},
    {k:"why", l:"Why this matters", t:"textarea", w:12, rows:2, ph:"What it proves that a statistic could not."},
    {k:"useIn", l:"Where it could be used", t:"multi", o:["Slide 1 — Consumer Job","Slide 2 — Concept Card","Pitch video","Insight support","Jury Q&A backup"], w:12}
  ]
},

observations: {
  id:"observations", label:"Field Observations", icon:"◉", group:"Task 1 · Discover", kind:"collection",
  title:"Field observations",
  eyebrow:"Task 1 · Behaviour, not opinion",
  intro:"Things you saw, not things you were told. A decanted ketchup bottle, a chutney in a reused jam jar, a phone propped against the atta dabba playing a reel. These are the details that make a jury believe you actually left the campus.",
  titleField:"what", statusField:"theme",
  statusOptions:THEMES,
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"what", l:"What we saw", t:"textarea", w:12, rows:3},
    {k:"where", l:"Where / whose home", t:"text", w:6},
    {k:"by", l:"Observed by", t:"person", w:3},
    {k:"theme", l:"Theme", t:"select", o:THEMES, w:3},
    {k:"contradicts", l:"What claim it contradicts", t:"textarea", w:12, rows:2},
    {k:"soWhat", l:"So what", t:"textarea", w:12, rows:2, ph:"If you cannot finish this sentence, it is a nice anecdote, not an observation."}
  ]
},

/* ============================================================
   TASK 2 — DEFINE
   ============================================================ */

patterns: {
  id:"patterns", label:"Patterns", icon:"◈", group:"Task 2 · Define", kind:"collection",
  title:"Patterns",
  eyebrow:"Task 2 · Step one of synthesis",
  intro:"A pattern is something that showed up in at least three unconnected conversations. Fewer than three and it is an anecdote. Count honestly — inflating evidence is the fastest way to get caught in Q&A.",
  titleField:"pattern", statusField:"strength",
  statusOptions:["Weak (2–3 mentions)","Solid (4–7)","Strong (8+)","Contested"],
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"pattern", l:"Pattern, in one sentence", t:"text", w:12},
    {k:"detail", l:"What it looks like", t:"textarea", w:12, rows:3},
    {k:"count", l:"Respondents showing it", t:"number", w:3},
    {k:"strength", l:"Strength", t:"select", o:["Weak (2–3 mentions)","Solid (4–7)","Strong (8+)","Contested"], w:5},
    {k:"segments", l:"Which cohorts", t:"text", w:4, ph:"Is this everyone, or only Gen Z metro?"},
    {k:"evidence", l:"Supporting respondents and quotes", t:"textarea", w:12, rows:3},
    {k:"counter", l:"Counter-evidence", t:"textarea", w:12, rows:2, ph:"Who did not show this pattern, and what that means."}
  ]
},

tensions: {
  id:"tensions", label:"Tensions", icon:"⚡", group:"Task 2 · Define", kind:"collection",
  title:"Tensions",
  eyebrow:"Task 2 · Where the idea will come from",
  intro:"A tension is a contradiction the consumer is living with and has stopped noticing. Format: they want X, but Y, so they settle for Z. Every strong insight in this case will be sitting on top of one of these.",
  titleField:"tension", statusField:"strength",
  statusOptions:["Interesting","Strong","This is the one"],
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"tension", l:"The tension", t:"textarea", w:12, rows:2, ph:"They want ___, but ___, so they settle for ___."},
    {k:"whoFeels", l:"Who feels it most sharply", t:"text", w:6},
    {k:"strength", l:"Strength", t:"select", o:["Interesting","Strong","This is the one"], w:6},
    {k:"evidence", l:"Evidence from the field", t:"textarea", w:12, rows:3},
    {k:"currentFix", l:"What they do about it today", t:"textarea", w:12, rows:2, ph:"The workaround. The workaround is the brief."},
    {k:"whyUnsolved", l:"Why nobody has solved it yet", t:"textarea", w:12, rows:2}
  ]
},

insights: {
  id:"insights", label:"Insight Cards", icon:"✦", group:"Task 2 · Define", kind:"collection",
  title:"Insight cards",
  eyebrow:"Task 2 · The thing the consumer already believes",
  intro:"The deck asks for an insight framed as something the consumer already believes or feels. Test: read it aloud to a consumer with no explanation. If they nod, it is an insight. If they need it explained, it is an observation wearing a suit. Vote, then confirm the one you are building on.",
  titleField:"headline", statusField:"state",
  statusOptions:["Draft","Tested on consumers","Shortlist","Selected","Killed"],
  confirmable:true, votable:true, commentable:true,
  fields:[
    {k:"headline", l:"Insight headline", t:"text", w:12, ph:"Short and human. No brand words, no category words."},
    {k:"statement", l:"The insight, in the consumer's voice", t:"textarea", w:12, rows:3, ph:"Written as 'I…' — something they already feel. Not something you discovered about them."},
    {k:"tension", l:"The tension underneath it", t:"textarea", w:12, rows:2},
    {k:"evidence", l:"Evidence: who said or did what", t:"textarea", w:12, rows:3},
    {k:"nodTest", l:"Consumer nod test — who did you read it to, what happened", t:"textarea", w:12, rows:2},
    {k:"soWhatKissan", l:"So what for Kissan specifically", t:"textarea", w:12, rows:3, ph:"Why this insight is more useful to Kissan than to Veeba. If it is equally useful to both, it will not win."},
    {k:"freshness", l:"Why this is true now and was not two years ago", t:"textarea", w:12, rows:2},
    {k:"state", l:"Status", t:"select", o:["Draft","Tested on consumers","Shortlist","Selected","Killed"], w:6},
    {k:"strength", l:"Team confidence", t:"score", w:6}
  ]
},

whitespaces: {
  id:"whitespaces", label:"White Space Canvas", icon:"▢", group:"Task 2 · Define", kind:"collection",
  title:"White space canvas",
  eyebrow:"Task 2 · Candidate spaces, scored",
  intro:"Score each candidate against the five criteria the deck sets out. Scores are 1–5 and the total is calculated live. Do not fall in love with the first space — the discipline is in publicly killing three of these with written reasons.",
  titleField:"space", statusField:"state",
  statusOptions:["Candidate","Shortlist","Selected","Killed"],
  confirmable:true, votable:true, commentable:true,
  scorecard:{ keys:["scNeed","scNow","scMoat","scKissan","scBeyond"], max:25 },
  fields:[
    {k:"space", l:"White space", t:"text", w:12, ph:"Name it in the consumer's language, not the category's."},
    {k:"describe", l:"What it is", t:"textarea", w:12, rows:3},
    {k:"whyNow", l:"Why it exists NOW — not two years ago, not two years from now", t:"textarea", w:12, rows:3, ph:"The deck asks this explicitly. Name the specific change: quick commerce density, a cohort ageing into kitchens, a supply shift, a cultural moment."},
    {k:"whoFor", l:"Who it is for", t:"textarea", w:6, rows:2},
    {k:"occasion", l:"Occasion it serves", t:"textarea", w:6, rows:2},
    {k:"competition", l:"Who is already in it", t:"textarea", w:12, rows:2},
    {k:"kissanRight", l:"Kissan's right to win here", t:"textarea", w:12, rows:3, ph:"Scale, trust, credibility — but be specific about which one does the work, and how."},
    {k:"notLineExt", l:"Why this is not a line extension", t:"textarea", w:12, rows:2},
    {k:"scNeed", l:"Genuine consumer need", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scNow", l:"Relevant today", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scMoat", l:"Hard for competitors to copy", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scKissan", l:"Leverages Kissan's strengths", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scBeyond", l:"Beyond a line extension", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"state", l:"Status", t:"select", o:["Candidate","Shortlist","Selected","Killed"], w:4, g:"Scorecard (1–5)"},
    {k:"killReason", l:"If killed — why", t:"textarea", w:12, rows:2}
  ]
},

opportunity: {
  id:"opportunity", label:"Opportunity Lock", icon:"🔒", group:"Task 2 · Define", kind:"doc",
  title:"Opportunity lock",
  eyebrow:"Task 2 · This is the answer slide",
  intro:"The deck asks for one slide covering four things: the white space and why it exists now, why Kissan uniquely wins, the Big Idea in one line, and the insight underneath it. Write them here. Everything downstream — product, packaging, price, film — is a consequence of what you type on this page. Mark it confirmed only when the whole team agrees.",
  confirmable:true,
  sections:[
    {title:"The four answers", fields:[
      {k:"whiteSpace", l:"The white space we have identified", t:"textarea", w:12, rows:3},
      {k:"whyNow", l:"Why it exists in Indian kitchens right now", t:"textarea", w:12, rows:4, ph:"Not two years ago. Not two years from now. Name the change."},
      {k:"whyKissan", l:"Why Kissan is uniquely positioned to win it", t:"textarea", w:12, rows:4},
      {k:"notCore", l:"How this is different from just making ketchup or jam better", t:"textarea", w:12, rows:3},
      {k:"bigIdea", l:"The Big Idea, in one line", t:"text", w:12, maxChars:120, ph:"One line. If it needs a second line, it is not the idea yet."},
      {k:"insight", l:"The consumer insight underneath it", t:"textarea", w:12, rows:3, ph:"Framed as something the consumer already believes or feels."}
    ]},
    {title:"Target consumer", fields:[
      {k:"tg", l:"Target consumer, precisely", t:"textarea", w:12, rows:3, ph:"'Young Indians' is not a target. Name the life stage, the kitchen situation, the occasion, the mindset."},
      {k:"tgSize", l:"Rough size of this group and how you got there", t:"textarea", w:12, rows:2},
      {k:"notFor", l:"Who this is explicitly not for", t:"textarea", w:12, rows:2}
    ]},
    {title:"The anti-generic gate", help:"Answer all six honestly before you confirm. Vague answers here are exactly what a jury probes first.", fields:[
      {k:"g1", l:"Could Veeba launch this in six months? What stops them?", t:"textarea", w:12, rows:2},
      {k:"g2", l:"What would make a jury call this a line extension, and what is our rebuttal?", t:"textarea", w:12, rows:2},
      {k:"g3", l:"Which existing Kissan SKU does this cannibalise, and is that acceptable?", t:"textarea", w:12, rows:2},
      {k:"g4", l:"If we are wrong, which assumption breaks first?", t:"textarea", w:12, rows:2},
      {k:"g5", l:"Name the specific 2026 change that makes this possible now.", t:"textarea", w:12, rows:2},
      {k:"g6", l:"What are we deliberately giving up by choosing this?", t:"textarea", w:12, rows:2},
      {k:"c1", l:"Addresses a genuine consumer need", t:"check", w:6},
      {k:"c2", l:"Relevant today", t:"check", w:6},
      {k:"c3", l:"Difficult for competitors to replicate", t:"check", w:6},
      {k:"c4", l:"Leverages Kissan's strengths", t:"check", w:6},
      {k:"c5", l:"Extends beyond line extensions and incremental variants", t:"check", w:6}
    ]}
  ]
},

/* ============================================================
   IDEATE
   ============================================================ */

ideas: {
  id:"ideas", label:"Idea Pipeline", icon:"◆", group:"Ideate", kind:"collection",
  title:"Idea pipeline",
  eyebrow:"Diverge hard, then cut hard",
  intro:"Target thirty raw ideas before you judge any of them. The eight loaded below are provocations, deliberately obvious, and they are there to be killed — write the kill reason, because the reasoning is what teaches you where the real idea is. Scores are 1–5 across the deck's five criteria and rank automatically.",
  titleField:"name", statusField:"state",
  statusOptions:["Raw","Shortlist","Finalist","Selected","Killed"],
  confirmable:true, votable:true, commentable:true,
  scorecard:{ keys:["scNeed","scNow","scMoat","scKissan","scBeyond"], max:25 },
  fields:[
    {k:"name", l:"Idea name", t:"text", w:8},
    {k:"state", l:"Status", t:"select", o:["Raw","Shortlist","Finalist","Selected","Killed"], w:4},
    {k:"oneLine", l:"In one line", t:"text", w:12, maxChars:140},
    {k:"what", l:"What it actually is", t:"textarea", w:12, rows:3, ph:"Format, flavour, where it lives in the kitchen."},
    {k:"job", l:"The job it does for the consumer", t:"textarea", w:6, rows:3},
    {k:"occasion", l:"Occasion", t:"textarea", w:6, rows:3},
    {k:"insightLink", l:"Which insight it is built on", t:"textarea", w:12, rows:2},
    {k:"whyKissan", l:"Why Kissan and not anyone else", t:"textarea", w:12, rows:3},
    {k:"moat", l:"What makes it hard to copy", t:"textarea", w:12, rows:2},
    {k:"risk", l:"Biggest reason it could fail", t:"textarea", w:12, rows:2},
    {k:"scNeed", l:"Genuine need", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scNow", l:"Relevant today", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scMoat", l:"Hard to copy", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scKissan", l:"Uses Kissan's strengths", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"scBeyond", l:"Beyond a line extension", t:"score", w:4, g:"Scorecard (1–5)"},
    {k:"killReason", l:"If killed — why (write this properly)", t:"textarea", w:12, rows:2}
  ]
},

stimulus: {
  id:"stimulus", label:"Stimulus Bank", icon:"⌘", group:"Ideate", kind:"collection",
  title:"Stimulus bank",
  eyebrow:"Things worth stealing from",
  intro:"Launches, packs, campaigns and cultural moments worth looking at. Include what you would take and what you would refuse to take — the second half is where the judgement shows.",
  titleField:"what", statusField:"cat",
  statusOptions:["Global launch","India launch","Competitor move","Packaging","Quick commerce","Cultural moment","Adjacent category","Failure worth studying"],
  confirmable:false, votable:true, commentable:true,
  fields:[
    {k:"what", l:"What it is", t:"text", w:8},
    {k:"cat", l:"Category", t:"select", o:["Global launch","India launch","Competitor move","Packaging","Quick commerce","Cultural moment","Adjacent category","Failure worth studying"], w:4},
    {k:"link", l:"Link", t:"url", w:12},
    {k:"takeaway", l:"What we would take", t:"textarea", w:6, rows:3},
    {k:"reject", l:"What we would refuse to take", t:"textarea", w:6, rows:3}
  ]
},

/* ============================================================
   TASK 3 — BUILD
   ============================================================ */

product: {
  id:"product", label:"Product Spec", icon:"◐", group:"Task 3 · Build", kind:"doc",
  title:"Product spec",
  eyebrow:"Task 3 · What exactly is it",
  intro:"The deck warns that vague answers are the easiest thing for a jury to spot. Every field here should be specific enough that a factory could ask you a follow-up question and you would have an answer.",
  confirmable:true,
  sections:[
    {title:"The product", fields:[
      {k:"name", l:"Product name", t:"text", w:6, ph:"Say it out loud. Then ask someone to spell it back."},
      {k:"descriptor", l:"Pack descriptor", t:"text", w:6, ph:"The three or four words under the name that tell you what it is"},
      {k:"format", l:"Format", t:"textarea", w:6, rows:3, ph:"Squeeze bottle, glass jar, sachet, pouch, tube, refill. Say why this format and not the obvious one."},
      {k:"variants", l:"Variants at launch", t:"textarea", w:6, rows:3, ph:"Start narrow. Three SKUs you can defend beats seven you cannot."},
      {k:"flavour", l:"Flavour profile", t:"textarea", w:12, rows:3, ph:"Describe what it tastes like to someone who has never had it. Heat level, sweetness, acidity, aroma, the moment it hits."},
      {k:"ingredients", l:"Core ingredients", t:"textarea", w:12, rows:3, ph:"Real ingredients. If you claim 'no preservatives' or 'no added colour', say what makes that possible."},
      {k:"texture", l:"Texture and mouthfeel", t:"textarea", w:6, rows:3, ph:"The deck flags experience and texture as a growth driver — use it."},
      {k:"usage", l:"How it is used, step by step", t:"textarea", w:6, rows:3, ph:"Squeeze, spoon, dunk, cook with, mix in. Watch someone do it before you write this."}
    ]},
    {title:"Difference", fields:[
      {k:"different", l:"What makes it genuinely different from what is on the shelf", t:"textarea", w:12, rows:4},
      {k:"rtb", l:"Reasons to believe", t:"textarea", w:12, rows:3, ph:"Ingredient, sourcing, process, heritage, a partnership. Something checkable."},
      {k:"vsHome", l:"Why buy it instead of making it at home", t:"textarea", w:6, rows:3, ph:"For chutney-type spaces this is the whole battle. Convenience alone rarely wins against a grandmother."},
      {k:"vsShelf", l:"Why buy it instead of the nearest thing on the shelf", t:"textarea", w:6, rows:3}
    ]},
    {title:"Reality check", fields:[
      {k:"make", l:"How it gets made", t:"textarea", w:6, rows:3, ph:"Existing HUL lines, contract manufacturing, new capex? Guess sensibly and say it is a guess."},
      {k:"shelfLife", l:"Shelf life and storage", t:"textarea", w:6, rows:2, ph:"Ambient or chilled? Refrigerate after opening? This changes the whole distribution model."},
      {k:"regs", l:"Regulatory and labelling notes", t:"textarea", w:6, rows:2, ph:"FSSAI category, claims you can and cannot make, veg mark, allergens."},
      {k:"proto", l:"Prototype plan", t:"textarea", w:6, rows:3, ph:"You will need something physical to put in front of consumers. Kitchen-made is fine. Photograph it well."}
    ]}
  ]
},

packaging: {
  id:"packaging", label:"Packaging", icon:"▣", group:"Task 3 · Build", kind:"doc",
  title:"Packaging",
  eyebrow:"Task 3 · New Kissan, not old Kissan",
  intro:"The deck asks one very specific question: what is the single visual cue that says new Kissan rather than old Kissan? One cue. Not a mood board. If you cannot name it in a sentence, the design is not finished.",
  confirmable:true,
  sections:[
    {title:"The one cue", fields:[
      {k:"theCue", l:"The one visual cue that says new Kissan", t:"textarea", w:12, rows:3, ph:"One thing. A colour, a crop, a typographic move, a material, a shape. Name it and defend it."},
      {k:"cueWhy", l:"Why that cue reads as new to this consumer", t:"textarea", w:12, rows:3, ph:"Tie it back to what respondents said in question 6. Their vocabulary, not yours."},
      {k:"keep", l:"Kissan codes we deliberately keep", t:"textarea", w:6, rows:3, ph:"The red. The wordmark. 'From the farmer. Since 1934.' Ninety years of trust is an asset, not a liability."},
      {k:"drop", l:"Kissan codes we deliberately drop", t:"textarea", w:6, rows:3}
    ]},
    {title:"The pack", fields:[
      {k:"structure", l:"Pack structure and material", t:"textarea", w:6, rows:3},
      {k:"sizes", l:"Sizes at launch", t:"textarea", w:6, rows:3, ph:"Trial size matters more than you think for a new format."},
      {k:"colour", l:"Colour direction", t:"textarea", w:6, rows:3},
      {k:"type", l:"Typography and language", t:"textarea", w:6, rows:3, ph:"Hindi/English mix? Regional scripts? What the pack sounds like when read aloud."},
      {k:"fop", l:"Front of pack hierarchy, top to bottom", t:"textarea", w:12, rows:3, ph:"What the eye hits first, second, third. Most packs fail because everything is first."},
      {k:"bop", l:"Back of pack", t:"textarea", w:12, rows:2, ph:"Usage ideas, recipe, sourcing story, QR. The back is free media."}
    ]},
    {title:"Where it has to survive", fields:[
      {k:"shelfTest", l:"Shelf standout at two metres", t:"textarea", w:6, rows:2},
      {k:"thumbTest", l:"Thumbnail test on a quick-commerce app", t:"textarea", w:6, rows:3, ph:"Look at it at 120 pixels wide on a phone. If you cannot tell what it is, it fails — and that is now where discovery happens."},
      {k:"sustain", l:"Sustainability position", t:"textarea", w:6, rows:2},
      {k:"mockPlan", l:"How we will produce the pack mock-up", t:"textarea", w:6, rows:2}
    ]}
  ]
},

proposition: {
  id:"proposition", label:"Brand Proposition", icon:"◍", group:"Task 3 · Build", kind:"doc",
  title:"Brand proposition",
  eyebrow:"Task 3 · Beyond this one product",
  intro:"The deck asks what this says about how Kissan should look, sound and behave differently from how it does today. This is the part most teams skip and it is where the masterbrand argument is won — the case is explicitly about Kissan competing with challengers who own a whole shelf, not one product.",
  confirmable:true,
  sections:[
    {title:"Positioning", fields:[
      {k:"positioning", l:"Positioning statement", t:"textarea", w:12, rows:3, ph:"For [consumer] who [need], Kissan [X] is the [frame] that [benefit], because [RTB]."},
      {k:"functional", l:"Functional benefits", t:"textarea", w:6, rows:3},
      {k:"emotional", l:"Emotional benefits", t:"textarea", w:6, rows:3},
      {k:"occasionOwn", l:"The occasion we intend to own", t:"textarea", w:12, rows:2}
    ]},
    {title:"How Kissan behaves differently", fields:[
      {k:"looks", l:"How it LOOKS different", t:"textarea", w:4, rows:4},
      {k:"sounds", l:"How it SOUNDS different", t:"textarea", w:4, rows:4, ph:"Tone of voice. Write two example lines in the new voice and two in the old, side by side."},
      {k:"behaves", l:"How it BEHAVES different", t:"textarea", w:4, rows:4, ph:"Where it shows up, how fast it responds, what it does that a ninety-year-old brand currently would not."},
      {k:"masterbrand", l:"Masterbrand architecture", t:"textarea", w:12, rows:4, ph:"How does this sit with ketchup, jam, squash and peanut butter? Sub-brand, range name, or straight Kissan? Draw the ladder in words."},
      {k:"nextThree", l:"The next three products this unlocks", t:"textarea", w:12, rows:3, ph:"Proof that you are building a shelf, not a SKU."},
      {k:"wontDo", l:"What Kissan still refuses to do", t:"textarea", w:12, rows:2, ph:"A brand with no refusals has no character."}
    ]}
  ]
},

pricing: {
  id:"pricing", label:"Pricing", icon:"₹", group:"Task 3 · Build", kind:"doc",
  title:"Pricing",
  eyebrow:"Task 3 · What is your pricing logic",
  intro:"The deck asks for logic, not a number. A number with reasoning behind it survives Q&A; a number alone does not. Build the ladder from your shelf audits — per 100g is the comparison that matters.",
  confirmable:true,
  sections:[
    {title:"The price", fields:[
      {k:"price", l:"Price and pack size at launch", t:"textarea", w:6, rows:3, ph:"e.g. ₹__ for __g. List every SKU."},
      {k:"per100", l:"Price per 100g vs the ladder", t:"textarea", w:6, rows:3},
      {k:"logic", l:"Pricing logic", t:"textarea", w:12, rows:4, ph:"Are you priced against the category, against the workaround, against the occasion, or against the emotional alternative? Say which and why."},
      {k:"anchor", l:"What the consumer compares it to in their head", t:"textarea", w:12, rows:2, ph:"Rarely the category. Often the outside-food version, or what their mother's version cost in effort."}
    ]},
    {title:"Architecture", fields:[
      {k:"ladder", l:"Competitive price ladder", t:"textarea", w:12, rows:4, ph:"Brand · SKU · size · MRP · per 100g. Fill from your own shelf audits, not from memory."},
      {k:"packPrice", l:"Pack–price architecture", t:"textarea", w:6, rows:3, ph:"Trial size, regular, refill or value pack. Which one does what job."},
      {k:"channelPrice", l:"Channel pricing", t:"textarea", w:6, rows:3, ph:"Quick commerce vs modern trade vs kirana. Different economics, different jobs."},
      {k:"margin", l:"Margin assumptions", t:"textarea", w:6, rows:3, ph:"Rough cost stack: input, pack, conversion, trade margin, gross margin. State assumptions openly."},
      {k:"promo", l:"Introductory offer and why it will not devalue the brand", t:"textarea", w:6, rows:3}
    ]},
    {title:"Testing", fields:[
      {k:"tooCheap", l:"Price at which consumers doubt the quality", t:"text", w:4},
      {k:"tooDear", l:"Price at which they walk away", t:"text", w:4},
      {k:"sweet", l:"Sweet spot from testing", t:"text", w:4},
      {k:"testNotes", l:"Price test notes from the field", t:"textarea", w:12, rows:3}
    ]}
  ]
},

competitors: {
  id:"competitors", label:"Competitor Tracker", icon:"⚔", group:"Task 3 · Build", kind:"collection",
  title:"Competitor tracker",
  eyebrow:"Who else wants this shelf",
  intro:"Loaded with the players the case names and their obvious neighbours. Prices are deliberately blank — fill them from your own audits so every number you quote to the jury is one you personally saw.",
  titleField:"brand", statusField:"threat",
  subFields:["parent","hero"],
  statusOptions:["Watch","Real threat","Direct competitor","Not a factor"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"brand", l:"Brand", t:"text", w:6},
    {k:"parent", l:"Parent company", t:"text", w:3},
    {k:"threat", l:"Threat level", t:"select", o:["Watch","Real threat","Direct competitor","Not a factor"], w:3},
    {k:"cats", l:"Categories they play in", t:"textarea", w:6, rows:2},
    {k:"positioning", l:"How they position themselves", t:"textarea", w:6, rows:2},
    {k:"hero", l:"Hero SKU", t:"text", w:6},
    {k:"priceObserved", l:"Price observed (fill from audit)", t:"text", w:6, ph:"SKU · size · MRP · per 100g · where you saw it"},
    {k:"distribution", l:"Where they are strong", t:"textarea", w:6, rows:2},
    {k:"comms", l:"How they show up", t:"textarea", w:6, rows:2, ph:"Tone, channels, creators, packaging attitude."},
    {k:"strength", l:"Their real strength", t:"textarea", w:6, rows:2},
    {k:"weak", l:"Where they are beatable", t:"textarea", w:6, rows:2},
    {k:"vsUs", l:"What they would do the day after our launch", t:"textarea", w:12, rows:2}
  ]
},

marketData: {
  id:"marketData", label:"Market Data & Sources", icon:"∑", group:"Task 3 · Build", kind:"collection",
  title:"Market data & sources",
  eyebrow:"Every number you say out loud",
  intro:"One card per number. If a number is going on a slide or into the video, it needs a source, a date and a named owner who checked it. Unsourced numbers are the fastest way to lose a jury's trust in everything else you said.",
  titleField:"claim", statusField:"state",
  subFields:["value","source"],
  statusOptions:["To find","Found — unverified","Verified","Rejected"],
  confirmable:true, votable:false, commentable:true,
  fields:[
    {k:"claim", l:"The claim or number", t:"textarea", w:12, rows:2},
    {k:"value", l:"Figure", t:"text", w:4},
    {k:"source", l:"Source", t:"text", w:4},
    {k:"asOf", l:"As of (date or period)", t:"text", w:4},
    {k:"link", l:"Link", t:"url", w:8},
    {k:"state", l:"Status", t:"select", o:["To find","Found — unverified","Verified","Rejected"], w:4},
    {k:"checkedBy", l:"Verified by", t:"person", w:4},
    {k:"useWhere", l:"Where we will use it", t:"multi", o:["Slide 1","Slide 2","Pitch video","Business case","Jury Q&A only","Internal only"], w:8},
    {k:"caveat", l:"Caveats a jury might raise", t:"textarea", w:12, rows:2}
  ]
},

/* ============================================================
   VALIDATE
   ============================================================ */

conceptTests: {
  id:"conceptTests", label:"Concept Testing", icon:"◑", group:"Validate", kind:"collection",
  title:"Concept testing",
  eyebrow:"The deck says consumers will see your card",
  intro:"Slide 2 goes in front of real consumers for feedback, so test it yourself first. Ten people, five minutes each, the card and nothing else. Do not explain it — if it needs explaining, it is not ready. Log the scores and let the averages tell you whether to rewrite.",
  titleField:"who", statusField:"buy",
  subFields:["gen","version"],
  statusOptions:["Definitely would buy","Probably would buy","Might or might not","Probably not","Definitely not"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"who", l:"Who", t:"text", w:4, ph:"Name, age, city"},
    {k:"gen", l:"Generation", t:"select", o:GENERATIONS, w:4},
    {k:"version", l:"Concept version tested", t:"text", w:4, ph:"v1, v2…"},
    {k:"buy", l:"Purchase intent", t:"select", o:["Definitely would buy","Probably would buy","Might or might not","Probably not","Definitely not"], w:6},
    {k:"scUnique", l:"How different does it feel (1–5)", t:"score", w:3},
    {k:"scBelieve", l:"How believable from Kissan (1–5)", t:"score", w:3},
    {k:"firstWords", l:"First words out of their mouth", t:"textarea", w:12, rows:2, ph:"Before any prompting. This is the most useful line on the card."},
    {k:"like", l:"What they liked most", t:"textarea", w:6, rows:2},
    {k:"dislike", l:"What put them off", t:"textarea", w:6, rows:2},
    {k:"confused", l:"What they did not understand", t:"textarea", w:12, rows:2},
    {k:"priceReaction", l:"Reaction to the price", t:"textarea", w:6, rows:2},
    {k:"occasionSaid", l:"When they said they would use it", t:"textarea", w:6, rows:2, ph:"If this is not the occasion you designed for, that is a finding."},
    {k:"change", l:"What we changed because of them", t:"textarea", w:12, rows:2}
  ]
},

risks: {
  id:"risks", label:"Risk Register", icon:"⚠", group:"Validate", kind:"collection",
  title:"Risk register",
  eyebrow:"Name it before the jury does",
  intro:"Every idea has three or four soft spots. Writing them down and having a mitigation ready converts your weakest moment in Q&A into a display of rigour.",
  titleField:"risk", statusField:"sev",
  statusOptions:["Low","Medium","High","Critical"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"risk", l:"Risk", t:"textarea", w:12, rows:2},
    {k:"type", l:"Type", t:"select", o:["Consumer","Competitive","Commercial","Operational","Regulatory","Brand","Execution"], w:4},
    {k:"sev", l:"Severity", t:"select", o:["Low","Medium","High","Critical"], w:4},
    {k:"likelihood", l:"Likelihood", t:"select", o:["Unlikely","Possible","Likely","Near certain"], w:4},
    {k:"mitigation", l:"Mitigation", t:"textarea", w:12, rows:3},
    {k:"tell", l:"Early warning sign we would watch for", t:"textarea", w:12, rows:2}
  ]
},

juryQA: {
  id:"juryQA", label:"Jury Q&A Prep", icon:"⚖", group:"Validate", kind:"collection",
  title:"Jury Q&A prep",
  eyebrow:"The questions that will actually come",
  intro:"Loaded with the questions a brand jury reliably asks. Every answer needs a named owner who can deliver it in under forty seconds. Rehearse out loud — reading an answer and saying it are different skills.",
  titleField:"q", statusField:"confidence",
  subFields:["owner","type"],
  statusOptions:["No answer yet","Rough answer","Rehearsed","Bulletproof"],
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"q", l:"Question", t:"textarea", w:12, rows:2},
    {k:"type", l:"Type", t:"select", o:["Insight","Idea strength","Commercial","Operational","Brand","Research rigour","Competitive"], w:4},
    {k:"owner", l:"Who answers", t:"person", w:4},
    {k:"confidence", l:"Readiness", t:"select", o:["No answer yet","Rough answer","Rehearsed","Bulletproof"], w:4},
    {k:"answer", l:"Answer, in under forty seconds", t:"textarea", w:12, rows:4},
    {k:"proof", l:"Proof point we would reach for", t:"textarea", w:12, rows:2}
  ]
},

/* ============================================================
   GO-TO-MARKET
   ============================================================ */

gtm: {
  id:"gtm", label:"Go-To-Market", icon:"➤", group:"Go-To-Market", kind:"doc",
  title:"Go-to-market",
  eyebrow:"How people discover it, before advertising",
  intro:"The deck is precise about this: build a winning plan for how people will discover it, all before anyone even gets to the advertising. So no TVC, no celebrity, no media plan. Distribution, pack, price, channel, retail, search, community and packaging-as-media. This is the section most teams underbuild and it is a cheap place to differentiate.",
  confirmable:true,
  sections:[
    {title:"Discovery without advertising", fields:[
      {k:"discovery", l:"The discovery mechanic", t:"textarea", w:12, rows:4, ph:"How does a consumer who has never heard of this end up holding it? Be mechanical, not aspirational."},
      {k:"firstTrial", l:"The first-trial mechanic", t:"textarea", w:12, rows:3, ph:"Discovery and trial are different problems. What converts a look into a purchase?"},
      {k:"secondBuy", l:"What brings them back for the second purchase", t:"textarea", w:12, rows:3, ph:"Repeat rate is the only thing that makes this a business rather than a launch."},
      {k:"packAsMedia", l:"Packaging as media", t:"textarea", w:12, rows:2, ph:"The pack is the one piece of media you have already paid for."}
    ]},
    {title:"Channel", fields:[
      {k:"channelFirst", l:"Which channel first, and why", t:"textarea", w:12, rows:3, ph:"Quick commerce first or general trade first is a real strategic choice with real consequences. Argue it."},
      {k:"qcomm", l:"Quick-commerce plan", t:"textarea", w:6, rows:4, ph:"Search terms to own, listing title, thumbnail, ratings strategy, basket adjacency, city clusters, dark-store selection."},
      {k:"mtGt", l:"Modern trade and general trade plan", t:"textarea", w:6, rows:4, ph:"Where does it sit on the shelf, and next to what? Who has to be convinced to stock it?"},
      {k:"markets", l:"Launch markets", t:"textarea", w:6, rows:3, ph:"Name the cities and say why those. National-from-day-one is rarely a real answer."},
      {k:"phasing", l:"Phasing", t:"textarea", w:6, rows:3, ph:"Months 0–3, 3–6, 6–12."}
    ]},
    {title:"Demand", fields:[
      {k:"sampling", l:"Sampling and seeding", t:"textarea", w:6, rows:3},
      {k:"community", l:"Community and creators", t:"textarea", w:6, rows:3, ph:"Not an influencer budget. Who already talks about this and why would they care?"},
      {k:"partnerships", l:"Partnerships", t:"textarea", w:6, rows:3, ph:"Cloud kitchens, QSR, meal kits, ingredient brands, regional food festivals."},
      {k:"foodService", l:"Food service and out-of-home", t:"textarea", w:6, rows:2, ph:"Often where taste habits are actually formed."},
      {k:"kpi", l:"Three launch KPIs", t:"textarea", w:12, rows:3, ph:"One for trial, one for repeat, one for the shelf. With numbers and a time frame."},
      {k:"kill", l:"What would make us pull the launch", t:"textarea", w:12, rows:2}
    ]}
  ]
},

businessCase: {
  id:"businessCase", label:"Business Case (Top 5)", icon:"◫", group:"Go-To-Market", kind:"doc",
  title:"Business case",
  eyebrow:"Only if you make the Top 5",
  intro:"The deck says you do not need this yet — get the idea right first. Use this page as a parking lot: whenever a number or an assumption surfaces during the main build, drop it here so that if you are shortlisted you start the round with a head start instead of a blank page.",
  confirmable:true,
  sections:[
    {title:"Size of the prize", fields:[
      {k:"tam", l:"Category size and growth", t:"textarea", w:12, rows:3, ph:"With sources. Show the arithmetic, not just the conclusion."},
      {k:"sam", l:"Addressable slice we are going after", t:"textarea", w:12, rows:3},
      {k:"som", l:"Realistic share in year 3, and why", t:"textarea", w:12, rows:3},
      {k:"assumptions", l:"Assumptions stack", t:"textarea", w:12, rows:4, ph:"Households × penetration × frequency × price. Every multiplier needs a defensible source or a stated guess."}
    ]},
    {title:"Numbers", fields:[
      {k:"y1", l:"Year 1", t:"textarea", w:4, rows:4, ph:"Volume, ASP, revenue, GM%"},
      {k:"y2", l:"Year 2", t:"textarea", w:4, rows:4},
      {k:"y3", l:"Year 3", t:"textarea", w:4, rows:4},
      {k:"invest", l:"Investment required", t:"textarea", w:6, rows:3, ph:"Capex, A&P, trade, working capital."},
      {k:"payback", l:"Payback and break-even", t:"textarea", w:6, rows:3},
      {k:"cannibal", l:"Cannibalisation of the existing portfolio", t:"textarea", w:6, rows:3},
      {k:"sensitivity", l:"Sensitivity: what if trial is half of plan", t:"textarea", w:6, rows:3}
    ]},
    {title:"The ask", fields:[
      {k:"ask", l:"What we are asking leadership to approve", t:"textarea", w:12, rows:3},
      {k:"stagegate", l:"Stage gates before full national rollout", t:"textarea", w:12, rows:3}
    ]}
  ]
},

/* ============================================================
   DELIVER
   ============================================================ */

slide1: {
  id:"slide1", label:"Slide 1 · Consumer Job", icon:"❶", group:"Deliver", kind:"doc", view:"slide1",
  title:"Slide 1 · Consumer job",
  eyebrow:"Submission · Who is your TG, what are you solving",
  intro:"Follows the template in the deck: a persona block, the opportunity, and the When I / I want to / So that job statement. The live preview updates as you type. Keep the persona a real person from your fieldwork, not a composite invention — composites read as invented, because they are.",
  confirmable:true,
  sections:[
    {title:"Persona", fields:[
      {k:"archetype", l:"Archetype name", t:"text", w:6, ph:"The deck's own sample used 'Solo Levellers'. Make yours as memorable and as earned."},
      {k:"archetypeLine", l:"One line that defines them", t:"text", w:6, maxChars:90, ph:"The deck's sample: 'Food excitement outside is on fire but not inside the kitchen'"},
      {k:"pName", l:"Name", t:"text", w:4},
      {k:"pAge", l:"Age", t:"text", w:2},
      {k:"pLsm", l:"LSM / city", t:"text", w:6, ph:"e.g. LSM 9, Pune"},
      {k:"pQuote", l:"Their defining quote", t:"textarea", w:12, rows:3, ph:"Verbatim from the Verbatim Bank. Real words."},
      {k:"pContext", l:"Kitchen and life context", t:"textarea", w:12, rows:3, ph:"For your own reference — keeps the slide honest even though not all of it fits."}
    ]},
    {title:"Opportunity & job", fields:[
      {k:"opportunity", l:"Identify the opportunity", t:"textarea", w:12, rows:3, ph:"The middle block of the template. Short, declarative, in their language."},
      {k:"whenI", l:"When I…", t:"textarea", w:12, rows:2, ph:"The situation. Specific moment, specific day of the week if you can."},
      {k:"iWantTo", l:"I want to…", t:"textarea", w:12, rows:2, ph:"The functional job."},
      {k:"soThat", l:"So that…", t:"textarea", w:12, rows:2, ph:"The emotional payoff. This is the line that decides whether the slide lands."},
      {k:"photoUrl", l:"Persona image URL (optional)", t:"url", w:12}
    ]}
  ]
},

slide2: {
  id:"slide2", label:"Slide 2 · Concept Card", icon:"❷", group:"Deliver", kind:"doc", view:"slide2",
  title:"Slide 2 · Concept card",
  eyebrow:"Submission · Consumers will read this one",
  intro:"The deck's rules for this slide are strict: compelling functional and emotional benefits, an insight inside but never written out as an insight statement, bold creative language, no more than eighty words of copy, and one impactful image. It goes to real consumers for feedback, so it has to be simple and clean. The word counter below is a hard limit, and the checks flag language that gives away the insight.",
  confirmable:true,
  sections:[
    {title:"The card", fields:[
      {k:"newFlag", l:"Corner flag", t:"text", w:4, ph:"NEW"},
      {k:"headline", l:"Headline", t:"text", w:8, maxChars:60, ph:"Bold, creative language. The product name or the promise — whichever hits harder."},
      {k:"subhead", l:"Sub-line", t:"text", w:12, maxChars:110, ph:"What it is, in plain words. The headline can be clever; this line cannot be."},
      {k:"body", l:"Body copy", t:"textarea", w:12, rows:6, maxWords:80, ph:"Total copy on this card must stay under eighty words. Write it, then cut a third."},
      {k:"functional", l:"Functional benefit line", t:"text", w:6, maxChars:80},
      {k:"emotional", l:"Emotional benefit line", t:"text", w:6, maxChars:80},
      {k:"priceLine", l:"Price / pack line", t:"text", w:6, ph:"e.g. 200g · ₹__"},
      {k:"variantLine", l:"Variants line", t:"text", w:6}
    ]},
    {title:"Image & checks", fields:[
      {k:"imageDirection", l:"Image direction", t:"textarea", w:12, rows:3, ph:"Pack or talent, per the deck. Describe the shot precisely enough that someone else could take it."},
      {k:"imageUrl", l:"Image URL for the preview (optional)", t:"url", w:12},
      {k:"chkInsight", l:"The insight is felt, not stated — no insight sentence appears on the card", t:"check", w:12},
      {k:"chkWords", l:"Copy is under eighty words", t:"check", w:12},
      {k:"chkClean", l:"Simple and clean enough to hand to a consumer with no explanation", t:"check", w:12},
      {k:"chkTested", l:"Tested on at least five consumers and revised", t:"check", w:12}
    ]}
  ]
},

pitch: {
  id:"pitch", label:"60-Second Pitch", icon:"▶", group:"Deliver", kind:"doc",
  title:"60-second pitch",
  eyebrow:"Submission · The elevator video",
  intro:"Sixty seconds is roughly 150 words at a natural pace. That is one idea, one insight, one product and one reason to believe — nothing else fits. Write the last line first: it is the only sentence anyone will quote back to you.",
  confirmable:true,
  sections:[
    {title:"Script", fields:[
      {k:"hook", l:"0–8s · Hook", t:"textarea", w:12, rows:2, ph:"A moment, a number or a line of verbatim. Never 'Hello, we are Team X from ISB.'"},
      {k:"insightBeat", l:"8–20s · The insight", t:"textarea", w:12, rows:2},
      {k:"idea", l:"20–35s · The idea and the product", t:"textarea", w:12, rows:3},
      {k:"why", l:"35–50s · Why Kissan wins it", t:"textarea", w:12, rows:2},
      {k:"close", l:"50–60s · The close", t:"textarea", w:12, rows:2, ph:"Write this first."},
      {k:"fullScript", l:"Full script as one block", t:"textarea", w:12, rows:8, maxWords:155, ph:"Paste the assembled script here. Read it aloud with a timer before you accept the word count."}
    ]},
    {title:"Production", fields:[
      {k:"presenter", l:"Who presents", t:"person", w:4},
      {k:"style", l:"Visual approach", t:"textarea", w:8, rows:2, ph:"Piece to camera, kitchen footage, pack reveal, screen recording of a quick-commerce app. Pick one and commit."},
      {k:"shotList", l:"Shot list with timings", t:"textarea", w:12, rows:6, ph:"00:00–00:08 — shot, location, what is said, who holds the camera. One line per shot."},
      {k:"props", l:"Props and prototype needed", t:"textarea", w:6, rows:3},
      {k:"locations", l:"Locations and permissions", t:"textarea", w:6, rows:3},
      {k:"shootDate", l:"Shoot date", t:"date", w:4},
      {k:"editor", l:"Editor", t:"person", w:4},
      {k:"specs", l:"Format specs required by the submission", t:"text", w:4, ph:"Check the portal: length, resolution, file size, file name"},
      {k:"qc", l:"Final QC checklist", t:"textarea", w:12, rows:3, ph:"Audio levels, subtitles, no copyrighted music, pack legible, under time limit, correct file name, uploaded and link tested from another account."}
    ]}
  ]
},

decisions: {
  id:"decisions", label:"Decision Log", icon:"✓", group:"Deliver", kind:"collection",
  title:"Decision log",
  eyebrow:"So you never argue the same argument twice",
  intro:"Every fork in the road, written down with what you chose and what you rejected. Two weeks in, somebody will ask why you did not do the other thing. This page is the answer — and half of it is reusable in Q&A.",
  titleField:"decision", statusField:"state",
  statusOptions:["Proposed","Decided","Reversed"],
  confirmable:true, votable:false, commentable:true,
  fields:[
    {k:"decision", l:"Decision", t:"text", w:12},
    {k:"date", l:"Date", t:"date", w:4},
    {k:"by", l:"Decided by", t:"text", w:4},
    {k:"state", l:"Status", t:"select", o:["Proposed","Decided","Reversed"], w:4},
    {k:"rationale", l:"Why", t:"textarea", w:12, rows:3},
    {k:"rejected", l:"What we rejected, and why", t:"textarea", w:12, rows:3},
    {k:"revisit", l:"What would make us revisit this", t:"textarea", w:12, rows:2}
  ]
},

library: {
  id:"library", label:"Library", icon:"⌸", group:"Deliver", kind:"collection",
  title:"Library",
  eyebrow:"Files, links, drives",
  intro:"One place for every file the team creates so nobody hunts through WhatsApp at midnight.",
  titleField:"name", statusField:"type",
  statusOptions:["Case deck","Photos","Recordings","Slides","Video","Data","Reference","Submission"],
  confirmable:false, votable:false, commentable:false,
  fields:[
    {k:"name", l:"Name", t:"text", w:8},
    {k:"type", l:"Type", t:"select", o:["Case deck","Photos","Recordings","Slides","Video","Data","Reference","Submission"], w:4},
    {k:"link", l:"Link", t:"url", w:12},
    {k:"owner", l:"Owner", t:"person", w:4},
    {k:"notes", l:"Notes", t:"textarea", w:8, rows:2}
  ]
},

standup: {
  id:"standup", label:"Standup Feed", icon:"◌", group:"Deliver", kind:"collection",
  title:"Standup feed",
  eyebrow:"Twenty minutes a day",
  intro:"Yesterday, today, blocked. Keep it to three lines each. The blocked line is the only one that matters — everything else is throat-clearing.",
  titleField:"who", statusField:"mood",
  statusOptions:["On track","Slipping","Blocked"],
  sortKey:"date", sortDir:"desc",
  confirmable:false, votable:false, commentable:true,
  fields:[
    {k:"who", l:"Who", t:"person", w:4},
    {k:"date", l:"Date", t:"date", w:4},
    {k:"mood", l:"Status", t:"select", o:["On track","Slipping","Blocked"], w:4},
    {k:"did", l:"Done since last time", t:"textarea", w:12, rows:2},
    {k:"next", l:"Doing next", t:"textarea", w:12, rows:2},
    {k:"blocked", l:"Blocked by", t:"textarea", w:12, rows:2}
  ]
},

final: {
  id:"final", label:"Final Output Hub", icon:"★", group:"Deliver", kind:"custom"
},

settings: {
  id:"settings", label:"Settings", icon:"⚙", group:"Deliver", kind:"custom"
}

};

const NAV_ORDER = [
  "dashboard","brief","requirements","team","timeline","tasks",
  "researchPlan","guide","interviews","audits","survey","surveyFindings","verbatims","observations",
  "patterns","tensions","insights","whitespaces","opportunity",
  "ideas","stimulus",
  "product","packaging","proposition","pricing","competitors","marketData",
  "conceptTests","risks","juryQA",
  "gtm","businessCase",
  "slide1","slide2","pitch","decisions","library","standup","final","settings"
];

const GROUP_ORDER = ["Command","Task 1 · Discover","Task 2 · Define","Ideate","Task 3 · Build","Validate","Go-To-Market","Deliver"];
