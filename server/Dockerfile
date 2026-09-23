# ========================
# server（NestJS）獨立 image
# build context = server/
# ========================
# Node ≥20.19
FROM node:20.19-alpine AS builder

WORKDIR /app
RUN corepack enable

# 先複製 manifest、lockfile 與 pnpm 設定（利用 layer 快取）
# .npmrc 的 auto-install-peers 必須與 lockfile settings 一致，否則 frozen install 會拒絕建置。
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# 複製原始碼並 build
COPY . ./
RUN pnpm build

# 移除 dev 依賴，只留 production node_modules
RUN pnpm prune --prod

# ========================
# Runtime stage
# ========================
FROM node:20.19-alpine

WORKDIR /app
ENV NODE_ENV=production

# package.json 必須保留：server 用 Node subpath imports（#app/*）需靠它解析
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# liveness：/api/health（alpine 內建 busybox wget）
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

# 以非 root 執行（node:20-alpine 內建 node 使用者）。複製進來的檔案為
# world-readable，node 可讀 dist/node_modules。
USER node

CMD ["node", "dist/main.js"]
