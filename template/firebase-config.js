/* ============================================================
   Firebase 設定檔
   ------------------------------------------------------------
   多個對決網頁「共用同一個 Firebase 專案」即可——靠 config.js 的 topic
   命名空間區隔資料，統計不會混在一起。所以最簡單的做法是：
   直接把你「其他對決網頁」的 firebase-config.js 內容整段複製過來。

   若要新建：到 https://console.firebase.google.com/ 建專案 →
   啟用 Realtime Database（測試模式）→ 專案設定 → 你的應用程式，
   把那段 firebaseConfig 貼到下面（務必含 databaseURL 那一行）。
   ============================================================ */
const firebaseConfig = {
  apiKey: "請貼上你的_apiKey",
  authDomain: "你的專案.firebaseapp.com",
  databaseURL: "https://你的專案-default-rtdb.firebaseio.com",
  projectId: "你的專案ID",
  storageBucket: "你的專案.appspot.com",
  messagingSenderId: "請貼上你的_messagingSenderId",
  appId: "請貼上你的_appId"
};

window.firebaseConfig = firebaseConfig;
