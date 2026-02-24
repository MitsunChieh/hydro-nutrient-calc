# FertiMath — 開發指引

## 專案定位

Hydroponic Nutrient Calculator：水耕養液離子濃度計算工具。
靜態 Web App，純前端，無後端。

## 技術棧

| 項目 | 選擇 |
|------|------|
| 框架 | Astro |
| 語言 | TypeScript |
| 部署 | Cloudflare Pages |
| 測試 | Vitest + Testing Library |
| Lint | Biome |
| 資料庫 | 無（資料 bake 進程式碼） |
| 使用者儲存 | localStorage |

## Git 慣例

- commit 前讓使用者確認內容
- 不同意圖的變更分開 commit
- Commit 前綴：`feat:` `fix:` `refactor:` `style:` `chore:` `wip:`
- **session 結束前必須 commit 目前進度**，未完成的用 `wip:` 前綴
- Session 最後一個 commit message 須包含 `WIP:` 區塊，摘要目前進度與下次接續點
- 新增使用者可見功能時，同步更新 README 的功能描述

## Project Commands（`.claude/commands/`）

- `/test` — 跑測試 + 覆蓋率報告，標記 < 80% 的檔案
- `/quality` — tsc + 測試 + 覆蓋率 + build 全套檢查

## Session 結束慣例

每次 session 結束前，依序做：

1. **跑 `/test`**：確保沒有破壞既有測試
2. **自評是否需要寫 session log**：根據本次變更規模和複雜度自行判斷，給出理由後再問使用者確認。不要跳過判斷直接問「要寫嗎？」
3. **Commit 進度**：未完成的工作用 `wip:` 前綴 commit，不要留 uncommitted changes
4. **更新 sprint-log 勾選**：完成的 Phase checklist 項目打勾（路徑見 `CLAUDE.local.md`）。勾選前必須先驗證目標檔案存在（多 session 環境有 TOCTOU 風險）
5. **最後一個 commit message 加 WIP 摘要**，格式：
   ```
   chore: session wrap-up

   WIP: [目前進度摘要]
   下次從 [接續點] 開始。
   [待決定事項（如有）]
   ```

## 接續上次的方式

開新 session 時：
1. 執行 `git log --grep="WIP:" -1` 查看上次 session 結束摘要
2. 讀 sprint-log 確認當前 Phase 和待辦項目（路徑見 `CLAUDE.local.md`）
3. 需要了解產品全貌時，讀 README

---

## WIP

歷史 WIP 摘要可用 `git log --grep="WIP:"` 查詢。
