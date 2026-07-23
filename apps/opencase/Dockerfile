FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV CASE_DATA_DIR=/app/data

RUN mkdir -p /app/data

EXPOSE 8080

# Railway (and most PaaS) set PORT; Config.ts reads process.env.PORT
CMD ["node", "dist/main.js"]

