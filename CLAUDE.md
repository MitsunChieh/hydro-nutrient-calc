# hydro-nutrient-calc — 開發指引

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

## 語言與溝通

- **對話**：與使用者對話使用**正體中文**
- **思考**：內部推理與分析以**英文**為主
- **搜尋**：各國語言都應納入考量，不限於中英文。特別重視資訊與開發能量高的語言（英文、日文、韓文、德文、西班牙文、葡萄牙文、俄文等），以獲取最完整的資訊
- **文件**：框架/紀錄用正體中文，面向產品的技術文件用英文
- **Commit message**：中英混合皆可，以清楚為原則

## 互動偏好

1. **先說明計畫再執行**：涉及檔案變更時，先說明意圖和影響，確認後再動手
2. **不臆測，要驗證**：不確定的資訊必須標註或查證，不要當作事實輸出
3. **遵守規則但不盲從**：遵守已建立的慣例，但當規則不適用或使用者的要求可能產生反效果時，應主動提出質疑，不照單全收
4. **先給觀點再問意見**：提問前先自行分析並表達立場，不當被動的選項機器

## Git 慣例

- commit 前讓使用者確認內容
- 不同意圖的變更分開 commit
- Commit 前綴：`feat:` `fix:` `refactor:` `style:` `chore:` `wip:`
- **session 結束前必須 commit 目前進度**，未完成的用 `wip:` 前綴
- Session 最後一個 commit message 須包含 `WIP:` 區塊，摘要目前進度與下次接續點

## 檔案變更原則

修改既有檔案時，一律以原始檔案為基礎做增量編輯。不重新生成，不憑記憶重寫。

來源優先順序：**git history > 磁碟上的檔案 > 備份 > LLM 生成**（最後手段）。

## Session 結束慣例

每次 session 結束前，依序做：

1. **跑 `/test`**：確保沒有破壞既有測試
2. **Commit 進度**：未完成的工作用 `wip:` 前綴 commit，不要留 uncommitted changes
3. **更新 sprint-log 勾選**：完成的 Phase checklist 項目打勾（路徑見 `CLAUDE.local.md`）
4. **更新 `CLAUDE.local.md` 的 WIP 區塊**
5. **最後一個 commit message 加 WIP 摘要**，格式：
   ```
   chore: session wrap-up

   WIP: [目前進度摘要]
   下次從 [接續點] 開始。
   [待決定事項（如有）]
   ```

## 接續上次的方式

開新 session 時：
1. 讀 `CLAUDE.local.md` 的 WIP 區塊
2. 執行 `git log --grep="WIP:" -1` 查看上次 session 結束摘要
3. 讀 sprint-log 確認當前 Phase 和待辦項目（路徑見 `CLAUDE.local.md`）

## Project Skills（`.claude/commands/`）

- `/test` — 跑測試 + 覆蓋率報告，標記 < 80% 的檔案
- `/quality` — tsc + 測試 + 覆蓋率 + build 全套檢查

## 品質檢查指令

```bash
npx tsc --noEmit   # Type check
npm run lint        # Biome lint
npm test            # 289 tests
npm run build       # Production build + sitemap
```

---

## WIP

詳細 WIP 狀態見 `CLAUDE.local.md`。歷史 WIP 摘要可用 `git log --grep="WIP:"` 查詢。
