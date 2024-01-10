FROM node:18-alpine

WORKDIR /app

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package.json /app
COPY package-lock.json /app

COPY src /app/src
COPY public /app/public
COPY tailwind.config.js /app
COPY tsconfig.json /app

RUN npm install
RUN npm i -g serve

EXPOSE 3000

RUN npm run build

CMD ["npx", "serve", "-s", "build"]
