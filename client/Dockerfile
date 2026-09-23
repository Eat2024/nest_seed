# ========================
# client（Next.js）獨立 image
# build context = client/
# 採用 Next.js standalone output（自包含 server、image 最小）
# ========================
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# 先複製 manifest 與 lockfile（利用 layer 快取）
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ARG API_PROXY_TARGET=http://server:3000
ENV API_PROXY_TARGET=$API_PROXY_TARGET

ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# 複製原始碼並 build
COPY . ./
RUN pnpm build

# ========================
# Runtime stage
# ========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone 產物不含 static / public，需手動帶入
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
