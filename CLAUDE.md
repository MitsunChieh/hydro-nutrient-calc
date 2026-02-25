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

- 不同意圖的變更分開 commit
- Commit 前綴：`feat:` `fix:` `refactor:` `style:` `chore:` `wip:`
- 新增使用者可見功能時，同步更新 README 的功能描述

## Project Commands（`.claude/commands/`）

- `/test` — 跑測試 + 覆蓋率報告，標記 < 80% 的檔案
- `/quality` — tsc + 測試 + 覆蓋率 + build 全套檢查
