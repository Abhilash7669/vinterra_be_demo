FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run compile

EXPOSE 8080

CMD ["npm", "start"]
