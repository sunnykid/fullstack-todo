# 개발 환경용 멀티스테이지 빌드
FROM node:18-alpine AS base

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 개발 스테이지
FROM base AS development
WORKDIR /app
COPY . .
EXPOSE 3000
ENV WATCHPACK_POLLING=true
CMD ["npm", "start"]

# 프로덕션 빌드 스테이지
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]