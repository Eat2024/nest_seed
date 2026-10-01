# nest_seed

NestJS（Fastify）+ Next.js 種子專案。從 CKS 驗收系統抽出，已移除所有業務 feature、worker，
保留可直接套用的基礎建設，以及登入驗證 + 角色權限（RBAC）前後端功能。

## 保留內容

**server/**（NestJS 11 + Fastify + TypeORM 0.3）
- `src/config/` — 環境列舉、API 路徑常數（`config.path.ts`）
- `src/bootstrap/` — app 建立、全域 prefix `/api`、ValidationPipe、CORS、Swagger（非 production）、
  安全標頭（nosniff / X-Frame-Options）、cookie、multipart、keep-alive timeout
- `src/infrastructure/database/mysql/` — MySQL 連線（TLS 選項、連線失敗不阻擋啟動、關機銷毀 pool）、
  repository provider 註冊點、TypeORM CLI data-source
- `src/infrastructure/database/redis/` — Redis 連線（`REDIS_MAIN` token + `RedisService`）
- `src/infrastructure/database/` — `BaseEntity` / `AuditableEntity` + `AuditSubscriber`（自動填 created_by/updated_by）
- `src/framework/` — 全域 ExceptionHandler、統一回應格式 interceptor、HTTP access log interceptor、
  全域 AuthGuard（登入驗證 + default-deny 權限檢查）、AuthThrottlerGuard（認證端點速率限制）、
  `@Public()` / `@RegisterApi()` decorator、OriginGuard（CSRF 縱深防禦，可選掛）
- `src/infrastructure/logging/` — nestjs-pino 結構化 log、request id（CLS，回寫 `X-Request-Id`）、敏感欄位遮罩
- `src/infrastructure/http-client/feastogether/` — 饗賓 API client（帳號管理「加入同仁」的員工查詢）
- `src/infrastructure/http-client/oauth/` — 饗賓 OAuth／OIDC client（`openid-client`）與連線設定
- `src/common/` — AppException / 錯誤碼、驗證錯誤轉換、日期（UTC ↔ 台北）、decimal、query param helper
- `src/features/auth/` — 統一登入 / 登出 / me、角色管理、帳號管理、權限字典、稽核紀錄
  - 登入只有饗賓 OAuth／OIDC 統一登入一種方式（無本地帳密、忘記密碼、改密碼；密碼由統一登入中心管理）：
    `POST /api/auth/oauth/start`、`/callback`，後端以 `openid-client` 完成 Authorization Code
    （confidential client、不用 PKCE），以員編對照 `auth_users`，首次登入建立無角色帳號；
    token 以 HttpOnly cookie 下發、Redis 存 session，登出時撤銷上游 refresh token（AES-256-GCM 加密存 Redis）。
    start／callback／logout 加掛 OriginGuard（`AUTH_TRUSTED_ORIGINS`，未設時用 `CORS_ORIGIN`）
  - 初始管理員：`SUPER_ADMIN_EMPID` 填員工編號，`seed:rbac` 會將其綁定 ADMIN；該員工以統一登入登入即具管理權限
  - 開發者登入（本機用）：`DEVMOD=true` 時登入頁出現「開發者登入（Super User）」，`POST /api/auth/dev-login`
    直接以 `dev-admin`（綁 ADMIN）取得 session，可不設定 `OAUTH_*`。關閉 `DEVMOD` 後既有開發者 session 立即失效；
    `NODE_ENV=production / staging` 時設 `DEVMOD=true` 會讓 server 啟動失敗
  - 權限三層：group → job → permission（`seeds/permission-dictionary.ts`），角色 × 權限多對多；ADMIN 角色全權限
  - 每個 endpoint 必須標 `@Public()` 或 `@RegisterApi({ key, name, permissions })`，開機同步到 `auth_apis`（缺宣告 = 403）
- `src/features/health/` — `GET /api/health` 範例 feature（`@Public()`）
- `test/` — e2e（auth / 角色 / 帳號 / 速率限制 / seed / request id）與 security e2e（認證強制模式）

**client/**（Next.js 16 + MUI + TanStack Query + axios + react-hook-form）
- `src/app/(auth)/` — 登入頁（統一登入按鈕）；`src/app/oauth/callback/` — 統一登入回呼頁
- `src/app/(dashboard)/` — AppShell（側欄依權限過濾選單）、首頁、權限管理（角色管理 / 排序、帳號管理）
- `src/providers/` — Auth（`/api/auth/me`）、Permission、MUI、React Query、Snackbar、Dialog
- `src/proxy.ts` — 無登入 cookie 時導向 `/login`
- `src/constants/menu.ts` / `routes.ts`、`src/configs/permissionActions.ts` — 新功能的選單與權限欄位於此登記
- `next.config.ts` — `/api/*` rewrite 到後端、standalone output

## 快速開始

```bash
docker compose up -d mysql redis          # 或用本機既有 MySQL / Redis
cp server/.env.example server/.env        # 依本機調整（JWT_SECRET、SUPER_ADMIN_EMPID、OAUTH_*、FEASTOGETHER_* 等）
cp client/.env.example client/.env.local  # NEXT_PUBLIC_API_BASE_URL=/api
pnpm install:all
pnpm -C server migration:run              # 建立 auth / RBAC 資料表
pnpm -C server seed:rbac                  # 權限字典 + ADMIN 角色 + 初始管理員綁定（冪等）
pnpm dev                                  # server :3001、client :3000
```

- API：http://localhost:3001/api/health
- Swagger：http://localhost:3001/swagger
- 前端：http://localhost:3000（以統一登入登入；`SUPER_ADMIN_EMPID` 對應的員工具管理權限。
  本機沒有統一登入可串接時，`server/.env` 設 `DEVMOD=true`，用「開發者登入」進入）
- 統一登入：`server/.env` 必須填齊 `OAUTH_*`，缺值或格式錯誤時 server 啟動即失敗（上游 client 須為 confidential、
  `client_secret_post`、`require_pkce=false`，callback 為 `<前端 origin>/oauth/callback`）

## 新增 feature

1. `server/src/features/<name>/` 建 module / controller / service，於 `features/feature.module.ts` 註冊；
   每個 endpoint 標 `@Public()` 或 `@RegisterApi(...)`（api key 集中在各 feature 的常數檔）
2. 需權限控管時：在 `features/auth/seeds/permission-dictionary.ts` 加 group / job / permission 與對應 enum，
   跑 `seed:rbac`；前端同步加 `JobKey`（`api/types/auth.ts`）、`constants/menu.ts`、`configs/permissionActions.ts`，
   頁面用 `useRequirePermission` 守門
3. 路徑常數加到 `config/config.path.ts`、錯誤碼加到 `common/errors/app-error-code.ts`
4. Entity 繼承 `AuditableEntity`，登記到 `mysql/mysql.options.ts` 的 `entities` 與 `mysql/mysql.module.ts` 的 `MYSQL_REPOSITORIES`
5. Migration：`pnpm -C server migration:generate`（依 entity 差異產生）或 `migration:create`（空白），`migration:run` 套用

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `pnpm dev` | 同時啟動 server + client |
| `pnpm test` | server 單元測試（jest） |
| `pnpm -C server test:e2e` / `test:e2e:security` | e2e / 安全 e2e（需 `.env.test`，自動建 DB + migration + seed） |
| `pnpm -C server seed:rbac` | 寫入權限字典、ADMIN 角色，並將 `SUPER_ADMIN_EMPID` 綁定 ADMIN（冪等） |
| `pnpm lint` | server + client lint |
| `pnpm -C server migration:run` / `migration:revert` | 套用 / 回滾 migration |
| `pnpm -C server db:test:create` | 建立測試 DB（需 `.env.test`，DB 名須 `nest_seed_test*` 開頭） |
