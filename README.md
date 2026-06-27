# Duel Quiz Kit 🎮

一套可重用的「**雙人即時對決問答網頁**」產生器：掃 QR Code 配對、判斷說法真假、
比快比準、匿名記錄並分析大家最常答錯的題目。純前端 + Firebase + GitHub Pages。

## 給 AI 編碼代理使用

**完整操作手冊在 [`AGENTS.md`](AGENTS.md)。**

- **OpenAI Codex**：會自動讀取 `AGENTS.md`，直接說「用這個 kit 做一個 XX 主題的對決網站」即可。
- **Google Antigravity / 其他 agent / 人類**：請先讀 `AGENTS.md`，照步驟操作。
- **Claude Code**：本 kit 另有對應的 Claude Skill（`duel-quiz`），可自動觸發。

## 怎麼用（摘要）

1. 複製 `template/` 成新資料夾
2. 改 `config.js`（品牌 + 獨一無二的 `topic` 命名空間）與 `questions.js`（18～20 題是非題）
3. 填 `firebase-config.js`（多主題可共用同一個 Firebase）
4. 用 `python -m http.server` 在 http 上測試（**不能用 `file://`**）
5. 部署到 GitHub Pages 或任何 https 靜態主機

詳細步驟、出題原則、常見雷請見 [`AGENTS.md`](AGENTS.md)。

> 安全性：建議用本 kit 附的 [`firebase-database-rules.json`](firebase-database-rules.json) 取代 Firebase 測試模式，
> 靠 `config/open` 開關一鍵開關所有網站（說明見 `AGENTS.md`）。

## 範例（用本 kit 做出來的網站）

- 食安謠言大對決：<https://shen0524.github.io/food-safety-duel/>
- 營養謠言大破解：<https://shen0524.github.io/nutrition-duel/>

## 授權

可自由使用、修改、散布。題庫內容請自行確認正確性，健康/法律/安全相關以官方資訊為準。
