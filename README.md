# The Next Shelf — L.I.M.E. Season 18 War Room

A single working site for a team building the HUL L.I.M.E. Season 18 Kissan case. Forty pages covering the full arc: decode the brief → run the fieldwork → synthesise the insight → pick the idea → build the product, pack and price → validate it → plan the go-to-market → assemble the two slides and the sixty-second pitch.

Everything the team types saves instantly. In team mode, everyone sees every keystroke.

---

## Get it online in ten minutes

### 1. Put it on GitHub

```bash
cd kissan-lime-hq
git init
git add .
git commit -m "War room"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kissan-lime-hq.git
git push -u origin main
```

Or use github.com → **New repository** → **uploading an existing file** and drag the whole folder in.

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. **Import** the repository.
3. Framework preset: **Other**. Leave build command and output directory blank — this is a static site with no build step.
4. **Deploy.**

You get a URL like `kissan-lime-hq.vercel.app`. Every `git push` redeploys automatically.

### 3. Turn on team mode

Out of the box the site runs in **local mode**: it works completely, but everything saves in your own browser and nobody else can see it. Fine for a solo test drive, useless for a team.

To make it live for everyone, follow **[SETUP-FIREBASE.md](SETUP-FIREBASE.md)** — about eight minutes, no card required, free tier is far more than this needs. You paste six values into `js/config.js`, push, and the whole team is editing the same board in real time.

### 4. Get everyone in

Send them the URL. On first open each person types their name. That name appears on their edits, comments and confirmations.

---

## What is in it

**Command** — Dashboard, The case decoded, Deliverable checklist (40 pre-loaded requirements pulled from the deck), Team & roles, Timeline (19 milestones that date themselves once you set the deadline), Task board (68 pre-loaded tasks as a kanban).

**Task 1 · Discover** — Research plan, Discussion guide (42 pre-written questions across the deck's six explore areas, with probes), Interview log (31 fields per respondent, target of 20), Shelf & app audits, Survey design, Survey findings, Verbatim bank, Field observations.

**Task 2 · Define** — Patterns, Tensions, Insight cards, White space canvas (scored live against the deck's five criteria), Opportunity lock (the Task 2 answer slide, with an anti-generic gate).

**Ideate** — Idea pipeline (auto-scoring and ranking; eight provocations pre-loaded to be killed), Stimulus bank.

**Task 3 · Build** — Product spec, Packaging, Brand proposition, Pricing, Competitor tracker (11 players pre-loaded), Market data & sources.

**Validate** — Concept testing, Risk register, Jury Q&A prep (22 questions a brand jury reliably asks).

**Go-to-market** — GTM plan, Business case (parking page for the Top 5 round).

**Deliver** — Slide 1 builder and Slide 2 builder with live previews and hard word counters, 60-second pitch, Decision log, Library, Standup feed, **Final output hub**, Settings.

Around 400 editable fields and 239 pre-loaded rows.

---

## How the team is meant to use it

**Confirm for final output.** Most cards have an **Add to final** button, and every long-form page has **Lock this for the final deck**. Anything confirmed collects in the **Final output hub**, which is what you actually build the submission from. Nothing else should make it in.

**The shelf.** The dashboard's signature strip shows eight jars, one per phase, filling as work lands. Click any jar to jump there.

**Voting.** Insight cards, ideas, tensions, verbatims and white spaces all take votes. Sort by votes to see where the team actually is rather than where the loudest person is.

**Scorecards.** Ideas and white spaces score 1–5 against the deck's five criteria — genuine need, relevant today, hard to copy, uses Kissan's strengths, beyond a line extension. Totals compute live and the list sorts by them.

**Word limits are enforced.** The concept card counter goes red past 80 words. The pitch script counter goes red past 155 words, which is roughly sixty seconds spoken. Both are the deck's own constraints.

**Language check.** The final output hub scans locked copy for the phrases that appear in every case deck ever submitted and flags them, so you can replace them with something specific.

**Search.** `Ctrl / ⌘ + K` searches every note, quote, idea and task on the board.

---

## Notes

- Two people editing the same field at the same time: last keystroke wins. Different fields, different cards and different pages are all safe. In practice, split by workstream.
- **Settings → Download backup** exports the whole board as JSON. Do this before any clean-up and once at the end.
- Works on phones. The interview log is genuinely usable in someone's kitchen, which is the point.
- No tracking, no analytics, no third-party services beyond Google Fonts and your own Firebase project.

## Files

```
index.html            the shell
css/style.css         design system
js/config.js          ← the only file you edit
js/schema.js          every page and every field
js/seed.js            the pre-loaded content
js/store.js           data layer (Firestore or localStorage)
js/ui.js              field and card components
js/views.js           page renderers
js/app.js             nav, routing, search
firestore.rules       paste into Firebase console
```
