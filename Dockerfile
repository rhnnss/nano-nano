FROM imbios/bun-node:20-slim AS deps
ARG DEBIAN_FRONTEND=noninteractive

# I use Asia/Jakarta as my timezone, you can change it to your timezone
RUN apt-get -y update && \
    apt-get install -yq openssl git ca-certificates tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb ./
RUN bun install

# Build the app
FROM deps AS builder
WORKDIR /app
COPY . .

ARG VAULT_ADDR
ARG VAULT_USERNAME
ARG VAULT_PASSWORD
ARG VAULT_PATH

ENV VAULT_ADDR=${VAULT_ADDR}
ENV VAULT_USERNAME=${VAULT_USERNAME}
ENV VAULT_PASSWORD=${VAULT_PASSWORD}
ENV VAULT_PATH=${VAULT_PATH}

ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_USER
ARG NEXT_PUBLIC_PW
ARG NEXT_PUBLIC_KEY
ARG NEXT_PUBLIC_IV

ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}
ENV NEXT_PUBLIC_USER=${NEXT_PUBLIC_USER}
ENV NEXT_PUBLIC_PW=${NEXT_PUBLIC_PW}
ENV NEXT_PUBLIC_KEY=${NEXT_PUBLIC_KEY}
ENV NEXT_PUBLIC_IV=${NEXT_PUBLIC_IV}

# RUN --mount=type=secret,id=NEXT_PUBLIC_API \
#     export NEXT_PUBLIC_API=$(cat /run/secrets/NEXT_PUBLIC_API) && \
RUN bun run build

ARG VAULT_ADDR
ARG VAULT_USERNAME
ARG VAULT_PASSWORD
ARG VAULT_PATH

ENV VAULT_ADDR=${VAULT_ADDR}
ENV VAULT_USERNAME=${VAULT_USERNAME}
ENV VAULT_PASSWORD=${VAULT_PASSWORD}
ENV VAULT_PATH=${VAULT_PATH}

ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_USER
ARG NEXT_PUBLIC_PW
ARG NEXT_PUBLIC_KEY
ARG NEXT_PUBLIC_IV

ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}
ENV NEXT_PUBLIC_USER=${NEXT_PUBLIC_USER}
ENV NEXT_PUBLIC_PW=${NEXT_PUBLIC_PW}
ENV NEXT_PUBLIC_KEY=${NEXT_PUBLIC_KEY}
ENV NEXT_PUBLIC_IV=${NEXT_PUBLIC_IV}

# Production image, copy all the files and run next
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ARG CONFIG_FILE
COPY $CONFIG_FILE /app/.env
ENV NODE_ENV production

ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_USER
ARG NEXT_PUBLIC_PW
ARG NEXT_PUBLIC_KEY
ARG NEXT_PUBLIC_IV

ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}
ENV NEXT_PUBLIC_USER=${NEXT_PUBLIC_USER}
ENV NEXT_PUBLIC_PW=${NEXT_PUBLIC_PW}
ENV NEXT_PUBLIC_KEY=${NEXT_PUBLIC_KEY}
ENV NEXT_PUBLIC_IV=${NEXT_PUBLIC_IV}

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# if you wanna use standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]

# # Install dependencies only when needed
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install

# # Rebuild the source code only when needed
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# COPY --from=deps /app/node_modules ./node_modules


# ARG VAULT_ADDR
# ARG VAULT_USERNAME
# ARG VAULT_PASSWORD
# ARG VAULT_PATH

# ENV VAULT_ADDR=${VAULT_ADDR}
# ENV VAULT_USERNAME=${VAULT_USERNAME}
# ENV VAULT_PASSWORD=${VAULT_PASSWORD}
# ENV VAULT_PATH=${VAULT_PATH}

# RUN npm run build

# # Production image, copy all the files and run next
# FROM node:20-alpine AS runner
# WORKDIR /app

# ARG VAULT_ADDR
# ARG VAULT_USERNAME
# ARG VAULT_PASSWORD
# ARG VAULT_PATH

# ENV VAULT_ADDR=${VAULT_ADDR}
# ENV VAULT_USERNAME=${VAULT_USERNAME}
# ENV VAULT_PASSWORD=${VAULT_PASSWORD}
# ENV VAULT_PATH=${VAULT_PATH}

# ENV NODE_ENV production

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000

# CMD ["npm", "start"]
