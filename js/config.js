/* ============================================================
   CONFIG — the only file you need to edit.
   ------------------------------------------------------------
   LOCAL MODE (default): everything saves in your own browser.
   Good for a solo test drive. Nothing is shared.

   TEAM MODE: paste your Firebase web-app keys below and every
   keystroke syncs live to everyone on the same board.
   Step-by-step: see SETUP-FIREBASE.md (takes about 8 minutes).
   ============================================================ */

window.CONFIG = {

  // Everyone on your team must use the same boardId.
  // Change it if you want a fresh, empty copy of the war room.
  boardId: "lime-s18-kissan",

  teamName: "Team name goes here",

  // ---- Paste your Firebase config object here ----
  // Leave the "PASTE_" values untouched to stay in local mode.
  firebase: {
    apiKey: "PASTE_YOUR_API_KEY",
    authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
    projectId: "PASTE_YOUR_PROJECT_ID",
    storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  }
};

window.CONFIG.isConfigured = !String(window.CONFIG.firebase.apiKey).startsWith("PASTE_");
