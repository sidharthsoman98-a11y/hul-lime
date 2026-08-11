/* ============================================================
   SEED — what the board contains the first time it opens.
   Written from the L.I.M.E. Season 18 case deck. Everything
   here is editable and deletable.
   ============================================================ */

const SEED_VERSION = 1;

const SEED = {

/* ---------------- Deliverable checklist ---------------- */
requirements: [
  ["A genuine new product idea for Kissan","Part 3 · Mandate"],
  ["Idea is backed by real consumer insighting","Part 3 · Mandate"],
  ["Approached like a HUL Brand Manager: opportunity → proposition → go-to-market","Part 3 · Mandate"],
  ["The go-to-market plan covers discovery before advertising","Part 3 · Mandate"],
  ["Spoken to 20 people","Task 1"],
  ["Covered at least two generations","Task 1"],
  ["Covered more than one city tier","Task 1"],
  ["Research was immersive, not a Google Form","Task 1"],
  ["Sat with people while they cooked","Task 1"],
  ["Opened a fridge with permission and asked what is inside and why","Task 1"],
  ["Moved beyond stated behaviour to underlying motivation","Task 1"],
  ["Answered: what drives experimentation","Task 1 · Explore 1"],
  ["Answered: which food rituals are non-negotiable","Task 1 · Explore 2"],
  ["Answered: where consumers seek convenience","Task 1 · Explore 3"],
  ["Answered: which flavours or experiences are missing today","Task 1 · Explore 4"],
  ["Answered: how consumers discover brands and what triggers first trial","Task 1 · Explore 5"],
  ["Answered: what makes a brand feel new versus old","Task 1 · Explore 6"],
  ["White space identified, with why it exists right now","Task 2"],
  ["Explained why Kissan is uniquely positioned to win it","Task 2"],
  ["Explained how it differs from improving the ketchup or jam business","Task 2"],
  ["Big Idea stated in one line","Task 2"],
  ["Consumer insight framed as something they already believe or feel","Task 2"],
  ["Opportunity addresses a genuine consumer need","Task 2 · Criteria"],
  ["Opportunity is relevant today","Task 2 · Criteria"],
  ["Opportunity is difficult for competitors to replicate","Task 2 · Criteria"],
  ["Opportunity leverages Kissan's strengths","Task 2 · Criteria"],
  ["Opportunity extends beyond line extensions and incremental variants","Task 2 · Criteria"],
  ["PRODUCT: format, flavour, core ingredients and the real difference","Task 3"],
  ["PACKAGING: look and feel, plus the one visual cue that says new Kissan","Task 3"],
  ["PROPOSITION: how Kissan should look, sound and behave differently","Task 3"],
  ["PROPOSITION: price, for this consumer, at this occasion, with reasoning","Task 3"],
  ["PRICE: the pricing logic is stated","Task 3"],
  ["60-second elevator pitch video produced","Submission"],
  ["Slide 1 — Consumer Job, using the deck template","Submission"],
  ["Slide 2 — Concept Card, using the deck template","Submission"],
  ["Concept card copy is 80 words or fewer","Submission · Slide 2"],
  ["Concept card carries an insight inside without stating it","Submission · Slide 2"],
  ["Concept card is simple and clean enough to be shown to consumers","Submission · Slide 2"],
  ["Concept card uses one impactful, bold image","Submission · Slide 2"],
  ["Submitted in the required format, before the deadline","Submission"]
].map(([req,source])=>({req,source,state:"Not started"})),

/* ---------------- Timeline ---------------- */
timeline: [
  [28,"Team locked, roles assigned, cadence agreed","Everyone knows their workstream and their interview quota. Cadence in calendars."],
  [26,"Case decoded — every member has read the deck twice","Each person has written three notes on what the jury is really asking for."],
  [25,"Research plan and discussion guide v1 done","Sample matrix filled, guide written, consent script drafted."],
  [23,"Two pilot interviews done, guide revised to v2","Questions that produced nothing have been cut."],
  [18,"Fieldwork halfway — 10 interviews written up","Ten complete records in the Interview Log, not ten sets of scribbles."],
  [16,"Shelf and quick-commerce audits complete","At least four physical stores and three apps, with a price ladder and photos."],
  [14,"Fieldwork complete — 20 interviews written up","All twenty records at 'Written up' or better. Two generations, two tiers."],
  [12,"Synthesis workshop — patterns, tensions, insights","Half a day, everyone in one room, phones away. Three insight cards survive."],
  [11,"Insight selected and pressure-tested on consumers","Read aloud to four people who were not part of the research. They nodded."],
  [10,"White space and Big Idea locked","Opportunity Lock confirmed. Anti-generic gate answered in full."],
  [8,"Product, packaging and pricing v1","All three Task 3 pages filled. Prototype plan agreed."],
  [7,"Prototype made and photographed","Something physical exists that a consumer can hold."],
  [6,"Concept card v1 tested with 10 consumers","Scores logged in Concept Testing. Changes identified."],
  [5,"Slides v1 complete","Both slides built. Word count on Slide 2 verified."],
  [4,"Pitch script locked and timed at 60 seconds","Read aloud with a stopwatch. Not 63 seconds."],
  [3,"Video shot — at least three takes","Footage in hand, audio checked on headphones."],
  [2,"Edit complete, internal review done","Full team has watched it twice and signed off."],
  [1,"Final QC and submission","Names, spellings, file formats, portal fields. Then submit."],
  [0,"Deadline","Aim to submit at D-2. Portals fail on deadline day."]
].map(([daysBefore,milestone,definition])=>({daysBefore,milestone,definition,state:"Not started"})),

/* ---------------- Tasks ---------------- */
tasks: [
  ["Lock team roles and one owner per workstream","Setup","P0 — case fails without it","30 min"],
  ["Set submission deadline and internal buffer in Settings","Setup","P0 — case fails without it","30 min"],
  ["Everyone reads the deck twice, logs 3 notes on what the jury wants","Setup","P0 — case fails without it","2 hours"],
  ["Agree cadence: 20-min daily standup, two long syncs a week","Setup","P1 — materially better","30 min"],
  ["Create shared Drive folder, add link to Library","Setup","P1 — materially better","30 min"],
  ["Write the 'what we will not do' guardrail list","Setup","P1 — materially better","30 min"],
  ["Confirm submission portal rules: format, length, file names","Setup","P0 — case fails without it","30 min"],

  ["Build the respondent quota matrix — 20 people, 2 generations, 2+ tiers","Research","P0 — case fails without it","2 hours"],
  ["Write discussion guide v1 with laddering and projective questions","Research","P0 — case fails without it","Half day"],
  ["Write and rehearse the consent script","Research","P0 — case fails without it","30 min"],
  ["Run 2 pilot interviews and revise the guide to v2","Research","P0 — case fails without it","Half day"],
  ["Assemble the field kit and stimulus cards","Research","P1 — materially better","2 hours"],
  ["Recruit 24 respondents to land 20; log all as Scheduled","Research","P0 — case fails without it","Full day"],
  ["Book 4 in-home cook-alongs","Research","P0 — case fails without it","2 hours"],
  ["Book 3 fridge and pantry audits","Research","P0 — case fails without it","2 hours"],
  ["Run 2 shop-alongs — one kirana, one modern trade","Research","P1 — materially better","Half day"],
  ["Run 3 quick-commerce basket walkthroughs on consumers' own phones","Research","P1 — materially better","2 hours"],
  ["Audit 2 modern trade stores, 2 kiranas, 3 quick-commerce apps","Research","P0 — case fails without it","Full day"],
  ["Run all 20 interviews, writing up within 24 hours of each","Research","P0 — case fails without it","Multi-day"],
  ["Capture 30+ verbatims into the Verbatim Bank","Research","P1 — materially better","Multi-day"],
  ["Log 25+ field observations where behaviour contradicted claims","Research","P1 — materially better","Multi-day"],
  ["Second-generation coverage check: are 6+ respondents over 40?","Research","P0 — case fails without it","30 min"],
  ["Design the supplementary survey — only after 10 interviews","Research","P2 — nice to have","2 hours"],
  ["Field the survey and log every finding with its base size","Research","P2 — nice to have","Half day"],

  ["Pull HUL and Unilever investor material on the Foods business","Secondary data","P1 — materially better","2 hours"],
  ["Find India sauces, condiments and chutney category size and growth","Secondary data","P1 — materially better","2 hours"],
  ["Find quick-commerce grocery and food discovery data","Secondary data","P1 — materially better","2 hours"],
  ["Deep dive Veeba, Ching's, Wingreens, FunFoods, Maggi","Secondary data","P0 — case fails without it","Half day"],
  ["Build the cross-channel price ladder from your own audits","Secondary data","P1 — materially better","2 hours"],
  ["Verify every number that will be spoken aloud","Secondary data","P0 — case fails without it","2 hours"],

  ["Affinity-map all interview notes into Patterns","Synthesis","P0 — case fails without it","Half day"],
  ["Write 8+ tension statements","Synthesis","P0 — case fails without it","2 hours"],
  ["Draft 6 insight cards, then vote to a top three","Synthesis","P0 — case fails without it","Half day"],
  ["Nod-test the top insights on 4 fresh consumers","Synthesis","P0 — case fails without it","2 hours"],
  ["Map 5 candidate white spaces and score them","Synthesis","P0 — case fails without it","Half day"],
  ["Publicly kill 3 white spaces with written reasons","Synthesis","P1 — materially better","2 hours"],

  ["Divergent session 1 — 20 raw ideas, no judgement","Ideation","P0 — case fails without it","2 hours"],
  ["Divergent session 2 — 10 more, built from tensions only","Ideation","P1 — materially better","2 hours"],
  ["Score all ideas and shortlist five","Ideation","P0 — case fails without it","2 hours"],
  ["Stress test: could Veeba launch each of these in six months?","Ideation","P0 — case fails without it","2 hours"],
  ["Select one idea plus one backup; record in the Decision Log","Ideation","P0 — case fails without it","2 hours"],

  ["Write the product spec: format, flavour, ingredients, RTB","Build","P0 — case fails without it","Half day"],
  ["Sanity-check the cost stack and write the pricing logic","Build","P0 — case fails without it","Half day"],
  ["Decide the one visual cue that says new Kissan","Build","P0 — case fails without it","2 hours"],
  ["Design the pack and produce a mock-up","Build","P0 — case fails without it","Full day"],
  ["Make a physical prototype consumers can hold and taste","Build","P1 — materially better","Full day"],
  ["Write the proposition: how Kissan looks, sounds and behaves differently","Build","P0 — case fails without it","Half day"],
  ["Define target consumer and occasion precisely","Build","P0 — case fails without it","2 hours"],
  ["Draw the masterbrand architecture and the next three products","Build","P1 — materially better","2 hours"],

  ["Test the concept card with 10 consumers","Validate","P0 — case fails without it","Full day"],
  ["Rewrite the concept card from the feedback","Validate","P0 — case fails without it","2 hours"],
  ["Run the price sensitivity check: too cheap, too expensive","Validate","P1 — materially better","2 hours"],
  ["Build the risk register with mitigations","Validate","P1 — materially better","2 hours"],
  ["Draft and rehearse answers to 15 jury questions","Validate","P1 — materially better","Half day"],

  ["Design the discovery mechanic that works without advertising","GTM","P0 — case fails without it","Half day"],
  ["Decide channel sequence and write the argument for it","GTM","P0 — case fails without it","2 hours"],
  ["Define the first-trial mechanic and sampling plan","GTM","P1 — materially better","2 hours"],
  ["Set three launch KPIs with numbers and timeframes","GTM","P1 — materially better","30 min"],

  ["Build Slide 1 — Consumer Job","Deliverables","P0 — case fails without it","Half day"],
  ["Build Slide 2 — Concept Card, under 80 words","Deliverables","P0 — case fails without it","Half day"],
  ["Design review: does Slide 2 actually look like new Kissan?","Deliverables","P1 — materially better","2 hours"],
  ["Write the 60-second script and time it out loud","Deliverables","P0 — case fails without it","2 hours"],
  ["Storyboard the shots and assign the presenter","Deliverables","P0 — case fails without it","2 hours"],
  ["Shoot the pitch video, minimum three takes","Deliverables","P0 — case fails without it","Full day"],
  ["Edit, caption, export to the required spec","Deliverables","P0 — case fails without it","Full day"],

  ["Final QC: names, spellings, logos, file names, formats","Submission","P0 — case fails without it","2 hours"],
  ["Submit at least 48 hours before the deadline","Submission","P0 — case fails without it","30 min"],
  ["Park business case assumptions for the Top 5 round","Submission","P2 — nice to have","2 hours"]
].map(([task,stream,priority,effort])=>({task,stream,priority,effort,state:"To do"})),

/* ---------------- Discussion guide ---------------- */
guide: [
  ["Warm-up & context","Context / rapport","Walk me through what you ate yesterday, from morning to night.","Who made it? Was that a normal day? What would have been different on a Sunday?"],
  ["Warm-up & context","Context / rapport","Who decides what gets cooked in this house?","Does that change on weekends? Who else has a vote? Who gets vetoed?"],
  ["Warm-up & context","Context / rapport","When did you last cook something you were proud of? Tell me about it.","Who did you tell? Did you photograph it?"],

  ["Kitchen tour & audit","Context / rapport","Can you show me your fridge and your masala shelf?","Ask permission first. Then ask about each jar: when did this come in, who bought it, when was it last opened?"],
  ["Kitchen tour & audit","4 · Missing flavours or experiences","Which of these do you actually use, and which have been sitting there for months?","Why is the unused one still there? What would have made you finish it?"],
  ["Kitchen tour & audit","Context / rapport","Is anything in here homemade? Who made it?","Trace the supply chain — mother, in-laws, a neighbour, a local shop."],
  ["Kitchen tour & audit","6 · New/exciting vs old/safe brand cues","Which jar or bottle here feels the newest to you? Which feels the oldest?","Do not accept 'because it is new' — ask what about it looks new."],

  ["Rituals","2 · Non-negotiable food rituals","What is the one thing about food in this house that never changes?","Who enforces it? What happened the last time it was broken?"],
  ["Rituals","2 · Non-negotiable food rituals","Is there a dish where you would never accept a shortcut?","What exactly is the line? A packet masala is fine but a packet gravy is not — where is your line and why?"],
  ["Rituals","2 · Non-negotiable food rituals","What did your mother or grandmother make that you cannot make?","Have you tried? What went wrong? Would you buy it if it were good enough?"],
  ["Rituals","2 · Non-negotiable food rituals","When guests come, what changes?","What comes out of the cupboard that normally stays in it?"],

  ["Experimentation","1 · What drives experimentation","What is the last new dish or ingredient you tried at home?","Where did you first see it? How long between seeing it and trying it? Who was it for?"],
  ["Experimentation","1 · What drives experimentation","What made you decide it was worth trying?","Push past 'it looked nice'. Was someone watching? Was it a bad week? Was it cheap enough not to matter?"],
  ["Experimentation","1 · What drives experimentation","What is something you saw and wanted to try but never did?","What stopped you? Ingredients, time, confidence, or nobody else in the house would eat it?"],
  ["Experimentation","1 · What drives experimentation","When you experiment, who is it for — you or someone else?","Watch for the performance angle: cooking for a partner, for a reel, for in-laws."],
  ["Experimentation","1 · What drives experimentation","Has anyone in the house ever refused something you tried to make?","What did you do with the rest of it? How long before you tried again?"],

  ["Convenience","3 · Where they seek convenience","Which part of cooking do you dislike most?","Prep, grinding, timing, cleanup? Would you pay to skip it?"],
  ["Convenience","3 · Where they seek convenience","What do you buy ready-made now that you used to make at home?","When did that switch happen and what triggered it? Did anyone comment on it?"],
  ["Convenience","3 · Where they seek convenience","What would you never buy ready-made, no matter how good it was?","This boundary is the most useful answer in the interview. Push on why."],
  ["Convenience","3 · Where they seek convenience","Show me your last five food orders on your delivery apps.","Ask them to open it. The reorder list is more honest than any answer they will give you."],
  ["Convenience","3 · Where they seek convenience","What is in the house right now purely so you do not have to cook?","When is it used? Does anyone feel bad about it?"],

  ["Missing flavours","4 · Missing flavours or experiences","What do you only ever eat outside the house?","Why has it never come home? Have you tried to recreate it?"],
  ["Missing flavours","4 · Missing flavours or experiences","If you could buy one thing in a jar that does not exist today, what would it be?","Let the silence sit. The first answer is usually a brand; the second is usually the real one."],
  ["Missing flavours","4 · Missing flavours or experiences","What did you love as a child that you cannot get anymore?","Regional, seasonal, or made by someone who has passed away — all three are rich."],
  ["Missing flavours","4 · Missing flavours or experiences","When you eat something amazing outside, what do you wish you could take home?","The sauce, the crunch, the heat, the tang?"],
  ["Missing flavours","4 · Missing flavours or experiences","Is there anything you eat that you would be slightly embarrassed to admit?","Ketchup on unexpected things, instant noodles at 2am, chutney on pizza. The deck's own imagery lives here."],

  ["Discovery & first trial","5 · Discovery & first trial","How did you first hear about the last new food brand you bought?","Trace it end to end. Screen, shop, friend, or a delivery app suggestion?"],
  ["Discovery & first trial","5 · Discovery & first trial","What made you actually pay the first time, rather than just noting it down?","Price, curiosity, a specific need, an offer, or seeing someone else eat it?"],
  ["Discovery & first trial","5 · Discovery & first trial","When you are on a delivery app, how do you decide between two brands you do not know?","Watch what they look at: photo, price, ratings, size, delivery time."],
  ["Discovery & first trial","5 · Discovery & first trial","Whose food recommendations do you actually act on?","A specific friend, a specific creator, family, the shopkeeper?"],
  ["Discovery & first trial","5 · Discovery & first trial","What made you buy something once and never again?","Repeat failure is more instructive than trial failure."],

  ["Brand cues: new vs old","6 · New/exciting vs old/safe brand cues","Sort these packs into two piles: brands that feel new and brands that feel old.","Bring five real packs. Ask them to talk while sorting, not after."],
  ["Brand cues: new vs old","6 · New/exciting vs old/safe brand cues","What is it about this one that made you put it in the 'new' pile?","Get concrete: colour, typeface, photography, shape, language, where they see it."],
  ["Brand cues: new vs old","6 · New/exciting vs old/safe brand cues","Is old a bad thing here?","For food, old often means safe and trustworthy. Find out where trust turns into boring."],
  ["Brand cues: new vs old","6 · New/exciting vs old/safe brand cues","What comes to mind when I say Kissan?","Unprompted first. Then ask when they last bought it. Then ask what they would expect Kissan to never make."],
  ["Brand cues: new vs old","6 · New/exciting vs old/safe brand cues","If Kissan made something new tomorrow, what would you expect it to be?","And what would feel wrong coming from them? The second answer draws the permission boundary."],

  ["Projective & laddering","Context / rapport","Why does that matter to you? (ask up to five times)","Classic laddering. Attribute → benefit → value. Stop when they get uncomfortable — that is usually the value."],
  ["Projective & laddering","Context / rapport","If your kitchen were a person, how would you describe them?","Projective. Reveals the identity attached to how they cook."],
  ["Projective & laddering","Context / rapport","Imagine a friend says they never cook at home. What do you think about them?","Surfaces judgement and social pressure without asking them to admit it."],
  ["Projective & laddering","6 · New/exciting vs old/safe brand cues","If Kissan and Veeba were both people at a party, describe each of them.","Fast route to brand personality in their own vocabulary."],

  ["Close","Context / rapport","What is the one thing about how you eat that you think nobody understands?","Often the best quote of the entire session."],
  ["Close","Context / rapport","Who else should we talk to?","Snowball recruitment. Ask for a specific person, not a type."]
].map(([section,explore,q,probe])=>({section,explore,q,probe,state:"Draft",mins:3})),

/* ---------------- Competitors ---------------- */
competitors: [
  ["Veeba","Veeba Food Services","Direct competitor","Sauces, mayonnaise, dressings, dips, spreads, cooking sauces","Named in the case as a Masterbrand challenger. Built breadth first, category leadership second."],
  ["Ching's Secret","Capital Foods / Tata Consumer","Direct competitor","Desi Chinese sauces, schezwan chutney, instant noodles, masala","Named in the case. Invented a cuisine occasion and then owned every product inside it."],
  ["Wingreens Farms","Wingreens World","Real threat","Dips, spreads, sauces, beverages, snacks","Started in dips and expanded outward; strong in modern trade and quick commerce."],
  ["Dr. Oetker FunFoods","Dr. Oetker","Real threat","Mayonnaise, sandwich spreads, dressings, dips","Owns the sandwich-spread occasion in many households."],
  ["Maggi","Nestlé India","Real threat","Sauces, ketchup, masala-e-magic, noodles","Enormous distribution and a permission slip to enter almost any kitchen occasion."],
  ["Mother's Recipe","Desai Brothers","Real threat","Pickles, chutneys, pastes, ready mixes","The incumbent in packaged Indian condiments — the closest thing to a chutney shelf that already exists."],
  ["Priya / Aachi / Nilon's","Various regional","Watch","Pickles, pastes, chutney powders","Regional strength and price aggression; often invisible in metro thinking and dominant elsewhere."],
  ["Del Monte","Del Monte / Bharti","Watch","Ketchup, mayonnaise, olive oils, fruit","International cues at accessible pricing."],
  ["Cremica","Cremica Food Industries","Watch","Sauces, mayo, dressings; large food-service business","Food service is where taste habits get formed before they reach homes."],
  ["Sprig / Naturally Yours / D2C spice brands","Various","Watch","Premium condiments, artisanal sauces","Small volume but they set the vocabulary for what premium looks like online."],
  ["Home-made chutney","The mother-in-law","Direct competitor","Fresh chutneys, pickles, podis, achaar","The real competitor in this white space. Free, better, and carries emotional weight no brand can buy."]
].map(([brand,parent,threat,cats,positioning])=>({brand,parent,threat,cats,positioning})),

/* ---------------- Market data ---------------- */
marketData: [
  ["Hot and spicy sauces are the fastest-growing sauce category globally","Over 8% a year","L.I.M.E. S18 case deck, citing Mintel / Innova / Tastewise / Datassential","2026 findings","Verified"],
  ["Kissan is India's No. 1 ketchup brand by retail value","No. 1","L.I.M.E. S18 case deck","2026","Verified"],
  ["Kissan is India's No. 1 jams and preserves brand by retail value","No. 1","L.I.M.E. S18 case deck","2026","Verified"],
  ["Kissan has been part of Indian kitchens for over ninety years","Since 1934","L.I.M.E. S18 case deck","2026","Verified"],
  ["India packaged sauces and condiments market size and growth rate","","FIND IT — Euromonitor, IMARC, Nielsen or a broker report","","To find"],
  ["India packaged chutney and pickle market size","","FIND IT — this number decides whether your white space sounds big enough","","To find"],
  ["Quick-commerce share of packaged grocery, and growth","","FIND IT — company disclosures from Blinkit, Zepto, Instamart parent reports","","To find"],
  ["HUL Foods segment revenue and growth","","FIND IT — HUL annual report and quarterly investor presentations","","To find"],
  ["Household penetration of ketchup versus chutney in India","","FIND IT — this contrast may be the whole argument","","To find"],
  ["Veeba revenue and category spread","","FIND IT — filings, press coverage, funding announcements","","To find"],
  ["Share of food discovery that begins on a screen","","FIND IT — needed to justify the go-to-market plan","","To find"],
  ["Average number of condiment SKUs in an urban Indian kitchen","","FIND IT — or generate it yourself from your own twenty fridge audits, which is stronger","","To find"]
].map(([claim,value,source,asOf,state])=>({claim,value,source,asOf,state})),

/* ---------------- Ideas (provocations to kill) ---------------- */
ideas: [
  ["Kissan Chutney Co.","A squeezable fresh-chutney range — green, coconut, tamarind — in a format that survives a fridge door.","Obvious first move. The deck itself points at chutneys, which means every team on every campus will arrive here. Beating home-made on taste and beating Mother's Recipe on distribution are two different fights. Kill it or find the angle nobody else will."],
  ["Kissan Chatpata","A sweet-heat sauce range built on the Indian palate rather than an imported hot-sauce idea.","Rides the fastest-growing global sauce trend named in the deck. Ask whether it is genuinely different from every sriracha-adjacent launch of the last three years."],
  ["Kissan Achaar Sauce","Pickle flavour in a pourable, non-oily, everyday format.","Emotionally rich and technically hard. Does it solve a real problem or just sound clever in a pitch?"],
  ["Kissan Dip Shelf","A dips range aimed squarely at the snacking occasion that quick commerce created.","This is exactly the territory Veeba and Wingreens already hold. What would Kissan bring that they cannot?"],
  ["Kissan Cooking Bases","Regional gravy and curry bases positioned as a head start, not a shortcut.","Big commercial prize, crowded field, and it moves Kissan away from the condiment shelf it is trying to own."],
  ["Kissan Kitchen Kits","Quick-commerce-native bundles built around one dish and one moment.","A merchandising idea wearing a product costume. Test whether there is a product underneath it."],
  ["Kissan for One","Small formats built for people cooking for themselves, priced for a single kitchen.","Demographically real. Ask whether a format alone is an idea, or just a pack size."],
  ["Kissan Table","A range designed for what happens at the table rather than at the stove.","Interesting reframe of the category. Needs a genuine product, not just a name for a shelf."]
].map(([name,oneLine,killReason])=>({name,oneLine,killReason,state:"Raw",what:"",risk:""})),

/* ---------------- Jury Q&A ---------------- */
juryQA: [
  ["Why is this not just a line extension?","Idea strength"],
  ["Why now? What changed that makes this possible in 2026 and not in 2024?","Insight"],
  ["What stops Veeba or Ching's from launching this in six months?","Competitive"],
  ["What is your insight, and how do you know it is real rather than something people said to be polite?","Research rigour"],
  ["How many people did you actually speak to, where, and what did you see that you did not expect?","Research rigour"],
  ["What did your research disprove?","Research rigour"],
  ["Which existing Kissan SKU does this cannibalise, and is that acceptable?","Commercial"],
  ["Why should HUL invest here instead of fixing the ketchup business?","Commercial"],
  ["What is the size of the prize? Walk me through the arithmetic.","Commercial"],
  ["What gross margin does this deliver relative to the core portfolio?","Commercial"],
  ["Can this be made on existing lines or does it need new capex?","Operational"],
  ["What is the shelf life, and does it need cold chain?","Operational"],
  ["What are the FSSAI and labelling constraints on the claims you are making?","Operational"],
  ["Which channel do you launch in first, and why that one?","Commercial"],
  ["How does anyone discover this without advertising spend?","Commercial"],
  ["What is the one metric you would watch in month one?","Commercial"],
  ["What would make you kill this idea?","Idea strength"],
  ["Does this strengthen the Kissan masterbrand or fragment it?","Brand"],
  ["You designed this for a young consumer — why would a forty-five-year-old buy it?","Brand"],
  ["Kissan is trusted because it is familiar. Does this put that trust at risk?","Brand"],
  ["Why will people pay a premium when a homemade version is free?","Idea strength"],
  ["If we gave you a tenth of the budget, what would you still do?","Commercial"]
].map(([q,type])=>({q,type,confidence:"No answer yet"})),

/* ---------------- Risks ---------------- */
risks: [
  ["The idea reads as a line extension to the jury","Idea strength placeholder"],
  ["Research sample skews to people like us — young, metro, English-speaking","Sample design"],
  ["The insight is an observation, not something the consumer already feels","Insight quality"],
  ["Home-made alternative is free, better, and emotionally loaded","Competitive"],
  ["Veeba or Wingreens can copy the product within one season","Competitive"],
  ["Price cannot cover the cost of the ingredient story we are telling","Commercial"],
  ["Format needs cold chain, which breaks the general trade model","Operational"],
  ["Concept card exceeds eighty words or states the insight outright","Execution"],
  ["Video runs over sixty seconds or misses the submission spec","Execution"],
  ["Fieldwork slips and synthesis gets compressed into one rushed evening","Execution"]
].map(([risk,note])=>({risk,mitigation:"",type:"Execution",sev:"Medium",tell:note})),

/* ---------------- Standup starter ---------------- */
library: [
  ["L.I.M.E. Season 18 case deck","Case deck",""],
  ["Team shared drive folder","Reference",""],
  ["Fieldwork photo folder","Photos",""],
  ["Interview recordings","Recordings",""],
  ["Slide working file","Slides",""],
  ["Pitch video raw footage","Video",""],
  ["Final submission files","Submission",""]
].map(([name,type,link])=>({name,type,link}))

};

/* ---------------- Static page: the case, decoded ---------------- */
const BRIEF_HTML = `
<div class="prose">

<div class="callout">
  <h5>The one sentence version</h5>
  <p style="margin:0">Kissan leads ketchup and jam, and is still losing, because the fight moved from winning a category to owning a shelf. Find the next thing Kissan should sell, prove a real consumer wants it, and show how anyone would ever find out it exists — without advertising.</p>
</div>

<h3>What you are being asked to produce</h3>
<p>Identify Kissan's next growth opportunity and build a product mix around it: a genuine new product idea, backed by real consumer insighting, approached the way an HUL Brand Manager would — define the opportunity, shape the proposition, and build a go-to-market plan for how people discover it, all before anyone gets to advertising.</p>

<h3>Three tasks</h3>
<h4>Task 1 · Discover the consumer</h4>
<p>The deck calls this the part that will make or break the idea. Explicit instructions: no Google Form. Immerse yourself in real consumer contexts. Observe how people cook, eat, shop and choose. Twenty people, at least two generations, ideally more than one city tier. Sit with them while they cook. Open a fridge with permission and ask what is inside and why. Move past stated behaviour to underlying motivation.</p>
<p>Six things to explore:</p>
<ol>
  <li>What drives experimentation</li>
  <li>Which food rituals are non-negotiable</li>
  <li>Where consumers seek convenience</li>
  <li>Which flavours or experiences are missing today</li>
  <li>How consumers discover new food brands, and what actually gets them to try one for the first time</li>
  <li>When a brand feels new or exciting versus old or safe — what about how it looks, sounds or shows up creates that feeling</li>
</ol>

<h4>Task 2 · Define the opportunity</h4>
<p>One slide, four things: the white space and why it exists in Indian kitchens right now — not two years ago, not two years from now; why Kissan is uniquely positioned to win it and how that differs from simply making the ketchup or jam business better; the Big Idea in one line; and the consumer insight underneath, framed as something the consumer already believes or feels.</p>
<p>The opportunity must address a genuine consumer need, be relevant today, be difficult for competitors to replicate, leverage Kissan's strengths, and extend beyond line extensions or incremental variants.</p>

<h4>Task 3 · Build it out</h4>
<p>Translate the idea into a real business proposition. The deck warns that vague answers are the easiest thing for a jury to spot.</p>
<ul>
  <li><b>Product</b> — format, flavour, core ingredients, and what makes it genuinely different from what is already on the shelf.</li>
  <li><b>Packaging</b> — what the pack should look and feel like, and the one visual cue that says new Kissan rather than old Kissan.</li>
  <li><b>Proposition</b> — beyond this one product, what it says about how Kissan should look, sound and behave differently; at what price, why, for this consumer, at this occasion.</li>
  <li><b>Price</b> — the pricing logic.</li>
</ul>

<h3>What you submit</h3>
<ul>
  <li>A 60-second elevator pitch video.</li>
  <li>Two supporting slides covering the three tasks — Slide 1: Consumer Job (who is your TG, what are you solving). Slide 2: Concept Card (your Big Idea).</li>
</ul>
<p>The concept card has its own rules: compelling functional and emotional benefits, built on an insight inside with no insight statement written out, bold creative language, crisp copy of no more than eighty words, and one impactful bold image. It will be shared with consumers for feedback, so it has to be simple and clean.</p>

<h3>Context the deck hands you</h3>
<h4>The global shift</h4>
<ul>
  <li><b>Variety is the new health.</b> Consumers are moving past single-nutrient obsession towards diversity of ingredients, flavours and experiences.</li>
  <li><b>Heritage is relevant again.</b> Traditional formats and local food cultures are being rediscovered by younger consumers, which advantages brands with authentic roots.</li>
  <li><b>Flavours have no borders.</b> Global influences blend with local tastes through experimentation and cultural exchange.</li>
  <li><b>Experience matters as much as taste.</b> Texture, mouthfeel and sensory experience are becoming primary drivers of choice, especially for younger consumers.</li>
</ul>
<p>Hot and spicy sauces are the fastest-growing sauce category globally, projected above eight percent a year, driven by younger consumers chasing bold flavours.</p>

<h4>The Indian kitchen today</h4>
<p>India's own condiment culture is not disappearing — it is being rediscovered by the same generation experimenting with global flavours. Consumers are not choosing between tradition and discovery; they want both. Quick commerce has become the engine of that discovery: a trend seen at 8pm can be in the kitchen by 8.15pm. Multiple generations influence food choices, digital content inspires cooking, regional cuisines are a source of pride, and product discovery now begins online before it happens in store.</p>

<h4>Why this case exists</h4>
<p>Legacy brands are trusted and widely available but slower to innovate, and usually built around one hero category. Challenger brands are fast, culturally fluent and increasingly show up as Masterbrands across an entire shelf of sauces, dips and dressings. Veeba and Ching's did not try to out-ketchup Kissan; they built one name across ten products so that trust earned once gets spent ten times. Kissan is known for two things — ketchup and jam. Strong to defend, narrow to grow from, and its brand power has begun to soften even inside those categories.</p>
<p>The deck asks you to sit with one question before designing anything: <b>why doesn't Kissan simply reinvent its existing categories?</b> Have an answer.</p>

<h4>What Kissan brings</h4>
<ul>
  <li><b>Scale</b> — distribution reaching millions across modern trade, general trade and emerging channels.</li>
  <li><b>Trust</b> — deep household penetration built over decades.</li>
  <li><b>Credibility</b> — equity rooted in quality ingredients and relationships with Indian agriculture.</li>
</ul>
<p>The deck names chutneys and other untapped white spaces as an example of where its authority could extend. Read that as a hint about direction, not as the answer — every team on your campus will read the same line.</p>

<h3>The question the whole case turns on</h3>
<blockquote>How can Kissan create relevance for a new generation, and credibly compete with Masterbrand challengers, while strengthening the trust that has made it successful?</blockquote>

<h3>If you make the Top 5</h3>
<p>You build the full business case and pitch it live to the HUL jury, the way a brand team pitches a launch to leadership for sign-off. The deck is explicit that you do not need to prepare that yet. Get the idea right first — there is a parking page for business case assumptions under Go-To-Market.</p>

<div class="callout">
  <h5>Four traps in this brief</h5>
  <ol style="margin:0">
    <li><b>The chutney trap.</b> The deck names chutneys. Landing there without doing the work looks like reading comprehension, not insight. If you go there, get there from your own fieldwork and bring something nobody else brought.</li>
    <li><b>The research trap.</b> A jury can tell within ninety seconds whether you actually opened a fridge. Specific, physical detail is the only proof.</li>
    <li><b>The insight trap.</b> "Consumers want convenience and authenticity" is a category truth, not an insight. If Veeba could use your insight word for word, it is not doing any work for Kissan.</li>
    <li><b>The advertising trap.</b> The mandate says build the discovery plan before anyone gets to the advertising. A campaign idea in your GTM slot is answering a question you were not asked.</li>
  </ol>
</div>

</div>`;
