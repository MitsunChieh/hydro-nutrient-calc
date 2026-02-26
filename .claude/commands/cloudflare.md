Cloudflare Pages CLI 操作。根據 `$ARGUMENTS` 執行對應操作。

## 專案資訊

- Account ID: `fe2df52e93b83a702634c8cdcd676de0`
- Project name: `fertimath`
- Production domain: `fertimath.com`

## 認證

- Wrangler 操作（deploy）：使用 wrangler 已登入的 OAuth token
- API 操作（domain、env）：需要 `CLOUDFLARE_API_TOKEN` 環境變數。如果未設定，提醒使用者先設定

API base URL: `https://api.cloudflare.com/client/v4/accounts/fe2df52e93b83a702634c8cdcd676de0/pages/projects/fertimath`

Zone ID（DNS 操作用）: `f2b17664ecc8bfc064cfe56a2579a5c2`

## 子指令

根據 `$ARGUMENTS` 判斷操作。如果沒有參數，顯示可用子指令清單。

### `deploy`

1. 用 `PUBLIC_GA_ID=G-JEGVJNY4WC npm run build` 建置
2. 用 `wrangler pages deploy dist/ --project-name fertimath --branch main` 部署
3. 部署後用 `curl -sI` 驗證正式網址回應 200

### `domain add <domain>`

```bash
curl -s -X POST "$API_BASE/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"<domain>\"}"
```

成功後查詢 status 確認進度。如果 DNS 記錄不存在，自動建立 CNAME 指向 `fertimath.pages.dev`。

### `domain list`

```bash
curl -s "$API_BASE/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

以表格格式顯示每個 domain 的 name 和 status。

### `domain status <domain>`

```bash
curl -s "$API_BASE/domains/<domain>" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### `domain remove <domain>`

先向使用者確認，因為這是破壞性操作。

```bash
curl -s -X DELETE "$API_BASE/domains/<domain>" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### `dns list`

```bash
curl -s "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

以表格顯示 type、name、content。

### `dns add <type> <name> <content>`

建立 DNS 記錄（預設 proxied=true）。

### `status`

綜合顯示專案狀態：

1. `wrangler pages deployment list --project-name fertimath` — 最近部署
2. API 查 domains — custom domain 狀態
3. `curl -sI https://fertimath.com` 和 `curl -sI https://fertimath.pages.dev` — 驗證可達性

以簡潔表格呈現結果。

## 注意事項

- 所有 API 呼叫失敗時，顯示完整錯誤訊息供 debug
- 破壞性操作（remove）一律先確認
- 部署後一律驗證網站可達性
- 目前自動部署已透過 GitHub Actions 設定，手動 deploy 通常不需要
