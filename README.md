# nest_seed

NestJS（Fastify）+ Next.js 種子專案。從 CKS 驗收系統抽出，已移除所有業務 feature、migration、worker，
只保留可直接套用的基礎建設。

## 保留內容

**server/**（NestJS 11 + Fastify + TypeORM 0.3）
- `src/config/` — 環境列舉、API 路徑常數（`config.path.ts`）
- `src/bootstrap/` — app 建立、全域 prefix `/api`、ValidationPipe、CORS、Swagger（非 production）、
  安全標頭（nosniff / X-Frame-Options）、cookie、multipart、keep-alive timeout
- `src/infrastructure/database/mysql/` — MySQL 連線（TLS 選項、連線失敗不阻擋啟動、關機銷毀 pool）、
  repository provider 註冊點、TypeORM CLI data-source
- `src/infrastructure/database/redis/` — Redis 連線（`REDIS_MAIN` token + `RedisService`）
- `src/infrastructure/database/` — `BaseEntity` / `AuditableEntity` + `AuditSubscriber`（自動填 created_by/updated_by）
- `src/framework/` — 全域 ExceptionHandler、統一回應格式 interceptor、CLS middleware（供 AuditSubscriber 取登入者）、OriginGuard（CSRF 縱深防禦，可選掛）
- `src/common/` — AppException / 錯誤碼、驗證錯誤轉換、日期（UTC ↔ 台北）、decimal、query param helper
- `src/features/health/` — `GET /api/health` 範例 feature

**client/**（純 Next.js 16，無 UI／資料抓取套件）
- `src/app/page.tsx` — 只顯示 Hello Nestjs
- `next.config.ts` — `/api/*` rewrite 到後端、standalone output

## 快速開始

```bash
docker compose up -d mysql redis          # 或用本機既有 MySQL / Redis
cp server/.env.example server/.env        # 依本機調整
pnpm install:all
pnpm dev                                  # server :3001、client :3000
```

- API：http://localhost:3001/api/health
- Swagger：http://localhost:3001/swagger
- 前端：http://localhost:3000

## 新增 feature

1. `server/src/features/<name>/` 建 module / controller / service，於 `features/feature.module.ts` 註冊
2. 路徑常數加到 `config/config.path.ts`、錯誤碼加到 `common/errors/app-error-code.ts`
3. Entity 繼承 `AuditableEntity`，登記到 `mysql/mysql.options.ts` 的 `entities` 與 `mysql/mysql.module.ts` 的 `MYSQL_REPOSITORIES`
4. Migration：`pnpm -C server migration:generate`（依 entity 差異產生）或 `migration:create`（空白），`migration:run` 套用

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `pnpm dev` | 同時啟動 server + client |
| `pnpm test` | server 單元測試（jest） |
| `pnpm lint` | server + client lint |
| `pnpm -C server migration:run` / `migration:revert` | 套用 / 回滾 migration |
| `pnpm -C server db:test:create` | 建立測試 DB（需 `.env.test`，DB 名須 `nest_seed_test*` 開頭） |
