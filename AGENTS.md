# Duel Quiz Kit — 雙人即時對決問答網頁產生器（通用版）

> 這份檔案是給 **AI 編碼代理（OpenAI Codex、Google Antigravity 等）與人類** 共用的操作手冊。
> OpenAI Codex 會自動讀取 repo 內的 `AGENTS.md`；其他工具/人類直接照本文件步驟做即可。
> 內容自足，不依賴任何外部對話脈絡。

## 這是什麼

一套現成的純前端引擎，用來快速產出「雙人對決」互動網頁。玩法是 **是非判斷**：
每題顯示一句說法，兩位玩家各自用手機判斷「正確」或「謠言/錯誤」，答對且越快分數越高；
結束顯示勝負與逐題解析，後台累計**所有場次的答錯率**，找出大家最容易答錯的題目。
玩家透過掃 **QR Code** 配對，免安裝任何 App。

技術：靜態 HTML/CSS/JS + Firebase Realtime Database + GitHub Pages。

## 核心原則

- **引擎檔不要改**：`template/index.html`、`template/app.js`、`template/styles.css` 是共用引擎。
- **每個新主題只改兩個檔**：`config.js`（品牌與命名空間）和 `questions.js`（題庫）。
- 另外要填一次 `firebase-config.js`（多個主題可共用同一個 Firebase 專案）。

## 兩種版本：雙人對戰 vs 多人擂台

本 kit 提供兩套引擎，**用法、題庫格式、設定欄位完全相同**，只差玩法：

| 範本資料夾 | 玩法 | 適用 |
|---|---|---|
| `template/` | **雙人對戰**：一房 2 人（房主 vs 對手）1v1 比分 | 兩兩配對、闖關、分組 PK |
| `template-multiplayer/` | **多人擂台（Kahoot 式）**：一房多人，全場掃同一 QR 同步搶答，即時排行榜，決出冠軍 | 講台帶全場、營隊團康、課堂搶答 |

要做哪種就複製對應的範本資料夾。以下步驟兩者通用（差異會標註）。

## 資料夾內容（兩個範本各自都有這些檔）

```
template/ 或 template-multiplayer/
├── index.html        引擎（勿改）
├── app.js            引擎（勿改；雙人版與多人版內容不同）
├── styles.css        引擎（勿改）
├── config.js         主題品牌 + 命名空間（每個主題替換）
├── firebase-config.js Firebase 設定（填一次，可跨主題共用）
└── questions.js      題庫（每個主題替換）
```

---

## 產生一個新主題網站：步驟

### 步驟 1 — 複製範本
- 雙人版：複製 `template/` → 新資料夾，命名建議 `<主題英文>-duel`（例：`fraud-duel`）。
- 多人版：複製 `template-multiplayer/` → 新資料夾，命名建議 `<主題英文>-mp`（例：`fraud-mp`）。

> 同一主題若雙人版、多人版都要做，請給它們**不同的 `topic`**（例如 `fraud` 與 `fraud-mp`），統計才會分開。

### 步驟 2 — 產生題庫 `questions.js`
覆寫題庫，格式如下（務必照欄位）：

```js
const QUESTIONS = [
  {
    id: "q01",                 // 唯一代號 q01、q02…，不可重複（統計靠它累計）
    category: "分類名稱",
    claim: "要判斷的說法……",
    answer: false,             // true = 此說法正確 / false = 此說法是錯的(謠言)
    explain: "正解說明……"
  }
  // …
];
window.QUESTIONS = QUESTIONS;
```

出題原則：
- **18～20 題**：因為「挑戰模式」會隨機抽 15 題，題庫要夠多才有變化。
- **真假大致平衡**：別讓答案全是 `false`。常見迷思設 `false`（破除謠言），正確觀念設 `true`。
- **每題都要 `explain`**：簡短說明正解與原因，這是玩家學到東西的關鍵。
- **在地化、口語**：用目標族群真的會聽到的說法。內容要正確可靠；涉及健康/法律/安全時用穩健、與官方一致的說法。

### 步驟 3 — 設定 `config.js`
逐欄替換：

```js
window.APP_CONFIG = {
  topic: "TOPIC_SLUG",   // ★ 改成這個主題專屬的英文小寫代號，每個主題務必不同
  title: "OOO 大對決",
  subtitle: "副標語・即時對戰",
  logo: "🧠",            // 一個 emoji
  intro: "首頁說明（可含 <strong> 等 HTML）…",
  trueLabel: "說法正確",  // 左邊選項文字
  falseLabel: "這是謠言",  // 右邊選項文字
  footer: "頁尾說明…",
  adminPass: "CHANGE_ME"  // 統計頁「重置統計」按鈕的管理密碼，務必改掉
};
```

> **重置統計按鈕**：統計頁有一顆「🗑 重置統計（管理員）」按鈕，輸入 `adminPass` 後可一鍵清空
> 本主題的 `stats`/`matches`/`rooms`（換班、重辦活動時用）。密碼是前端檢查，僅防誤觸，非高強度保護。

> `topic` 是資料庫命名空間。多個對決網頁可共用同一個 Firebase，靠不同的 `topic`
> 把資料放在 `topics/<topic>/` 底下，統計互不混淆。**所以每個主題的 `topic` 一定要不一樣。**

### 步驟 4 — 設定 `firebase-config.js`
- 若已有可重用的 Firebase 設定（之前做過其他主題），直接整段複製過來即可。
- 若要新建：到 <https://console.firebase.google.com/> 建專案 → 啟用 **Realtime Database**（測試模式）
  → 專案設定 → 你的應用程式 → 複製 `firebaseConfig` 貼上。**務必包含 `databaseURL` 那一行。**
- 這些是前端公開設定值，並非密碼。

### 步驟 5 — 本機測試
**不要用 `file://` 直接開檔**：瀏覽器會把它當成不安全來源，Firebase 連不上（會「卡頓」）。
一定要用 http：

```bash
cd <新專案資料夾>
python -m http.server 8000
```

開 `http://localhost:8000/`，用一般視窗 + 無痕視窗各開一個，一邊建立房間、一邊用房號加入，
測完整流程：兩人答完要馬上換題、分數正確、結束有解析、統計頁有數字、頂端沒有「尚未設定 Firebase」警告。

### 步驟 6 — 部署到 GitHub Pages
需要 `git` 與已登入的 GitHub CLI（`gh auth status` 確認；`<owner>` 為帳號名，小寫）。
GitHub Pages 免費版需 **公開 repo**（`firebase-config.js` 會公開——前端設定本就公開，無妨）。

```bash
cd <新專案資料夾>
git init -b main
git add -A && git commit -m "feat: <主題> 對決網頁"
gh repo create <repo名稱> --public --source=. --remote=origin --push
gh api -X POST repos/<owner>/<repo名稱>/pages -f "source[branch]=main" -f "source[path]=/"
```

網址：`https://<owner>.github.io/<repo名稱>/`（第一次建置約 1～2 分鐘）。
之後更新內容：改檔後 `git add -A && git commit -m "更新" && git push`。

> 不用 GitHub Pages 也行：Netlify Drop（拖資料夾）或任何提供 https 的靜態主機都可以。
> 重點是必須用 **https/http** 提供，不能用 `file://`。

---

## 技術細節與常見雷

- **資料結構**：所有資料在 `topics/<topic>/` 下（`rooms` 對戰房間、`stats` 統計、`matches` 對戰記錄）。
  分數由各題 `answers.points` 加總，不另存 score。
- **題庫至少 18 題**，否則 15 題挑戰模式會被題庫上限截短。
- **務必用 http 測**，`file://` 會讓 Firebase 連不上。
- 部署是**公開 repo**：不要放任何真正的密碼或私密資料。

## Firebase 安全規則（建議套用，取代測試模式）

預設的「測試模式」任何人可讀寫、且約 30 天後會自動到期鎖死。建議改用本 kit 附的
[`firebase-database-rules.json`](firebase-database-rules.json)，它用一個 **`config/open` 開關**手動控制，
且只開放 `topics/` 子樹（其他路徑一律拒絕），較安全：

```json
{
  "rules": {
    "topics": {
      ".read": "root.child('config/open').val() === true",
      ".write": "root.child('config/open').val() === true"
    }
  }
}
```

套用方式（Firebase 主控台）：
1. **Realtime Database → 規則 Rules** 分頁，貼上上面內容 → 發布。
2. **資料 Data** 分頁，在根節點建立 `config/open = true`（布林值）。網站這時才會通。

開關控制：
- **關閉**（活動結束）：把 `config/open` 改成 `false` → 所有對戰與讀寫立即停止。
- **重新開放**：改回 `true`。

> 若想「關閉對戰但仍能看統計」，把 `.read` 改成 `true`（永遠可讀）、只用 `.write` 那行控制開關即可。
> 多個主題共用同一個 Firebase 時，這組規則會同時管控所有 `topics/<topic>/`，一次開關全部。

## 玩法限定

引擎是「**是非對決**」型（每題判斷真/假）。若主題比較像四選一的選擇題，需另行調整引擎，
本套件不直接支援。多數「迷思/謠言破解」「安全宣導」題都能轉成是非題。
