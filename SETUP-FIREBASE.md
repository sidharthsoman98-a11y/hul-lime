# Turning on team mode

Eight minutes. No credit card. The free tier is far beyond anything this site will use.

Until you do this, the site works fully but saves only in your own browser — a banner in the sidebar says **Local mode · not shared**.

---

## 1. Create the project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with any Google account.
2. **Create a project.** Name it anything — `lime-warroom` works.
3. Google Analytics: **off**. You do not need it.
4. Wait for it to finish, then **Continue**.

## 2. Create the database

1. Left sidebar → **Build → Firestore Database**.
2. **Create database**.
3. Location: pick something close, `asia-south1` (Mumbai) is the obvious one.
4. Start in **production mode** — you will paste proper rules in step 4.
5. **Enable.**

## 3. Turn on anonymous sign-in

1. Left sidebar → **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Anonymous** → toggle **Enable** → **Save**.

This is what lets teammates use the board without making accounts. It also lets you lock the database to your app rather than leaving it open to the internet.

## 4. Paste the security rules

1. **Firestore Database → Rules** tab.
2. Replace everything there with the contents of `firestore.rules` from this repository:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /boards/{boardId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. **Publish.**

**What this means.** Anyone signed in anonymously through your app can read and write board data. Anyone who has your site URL can do that. For a case competition working document among six people, that is the right trade-off. Do not put anything genuinely confidential in here, and do not post the URL publicly.

If you want tighter control, change `boards/{boardId}` to a specific board id and use an obscure one, or add Google sign-in and restrict by email domain.

## 5. Get your keys

1. **Project settings** — the gear icon, top left.
2. Scroll to **Your apps** → click the web icon **`</>`**.
3. App nickname: anything. Do **not** tick Firebase Hosting — Vercel is doing that.
4. **Register app.**
5. You get a config block that looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "lime-warroom.firebaseapp.com",
  projectId: "lime-warroom",
  storageBucket: "lime-warroom.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

## 6. Paste them into the site

Open `js/config.js` and replace the six `PASTE_` values with yours. Set your team name while you are there.

```js
window.CONFIG = {
  boardId: "lime-s18-kissan",
  teamName: "Your team name",
  firebase: {
    apiKey: "AIzaSyD...",
    authDomain: "lime-warroom.firebaseapp.com",
    projectId: "lime-warroom",
    storageBucket: "lime-warroom.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
  }
};
```

Commit and push. Vercel redeploys in about thirty seconds.

## 7. Check it worked

Open the site. The sidebar should now read **Live · 1 here now**. Open it on your phone as well and you should see two.

Type something on any page, and watch it appear on the other device.

---

## If it does not work

**Sidebar still says Local mode.** The `apiKey` still starts with `PASTE_`, or the push has not deployed yet. Hard-refresh with `Ctrl/⌘ + Shift + R`.

**"Firebase rejected the sign-in."** Anonymous sign-in is not enabled. Step 3.

**"Cannot read the board: Missing or insufficient permissions."** The rules were not published, or they were pasted into the Storage rules tab by mistake. Step 4.

**Everyone sees a different board.** Different `boardId` values, or someone is using a URL with `?board=` on the end. Everyone should use the same plain URL.

**Nothing appears for a new teammate.** They are on a stale cached copy. Hard-refresh.

---

## Cost

Firestore's free tier gives 50,000 document reads and 20,000 writes a day. A six-person team working hard on a case for a month uses a fraction of that. You will not be charged, and there is no card on file to charge.
