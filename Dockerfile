FROM node:24-alpine

WORKDIR /src/app

COPY . /src/app

RUN npm install

RUN npm run compile

EXPOSE 8080

CMD ["npm", "start"]