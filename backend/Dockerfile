FROM node:18-alpine

WORKDIR /app

# 의존성 설치를 위한 package.json 복사
COPY package*.json ./
RUN npm ci

# 애플리케이션 코드 복사
COPY . .

EXPOSE 5000

# 개발 모드로 실행 (nodemon 사용)
CMD ["npm", "run", "dev"]