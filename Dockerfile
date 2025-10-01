FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 8080
ENV APP_ENV=development

CMD ["node", "index.js"]