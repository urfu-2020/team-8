# Базовый слой
FROM mhart/alpine-node:14

# Копируем всё что нужно из локальной папки в образ
COPY server /app
COPY package.json /
COPY package-lock.json /
COPY tsconfig.json /

# При старте контейнер начнёт общаться через 8080 порт
EXPOSE 8080

RUN npm install
RUN npm link
RUN npm run-script build

# При старте контейнер выполнит эту команду – запустит наше приложение
CMD ["npm", "start"]
