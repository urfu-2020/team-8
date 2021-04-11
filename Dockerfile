# Базовый слой
FROM mhart/alpine-node:14

# Копируем всё что нужно из локальной папки в образ
COPY app /app
COPY package.json /
COPY package-lock.json / 

# Устанавливаем зависимости, в образе появится /node_modules
RUN npm ci --production

# При старте контейнер начнёт общаться через 8080 порт
EXPOSE 8080

RUN npm install

# При старте контейнер выполнит эту команду – запустит наше приложение
CMD ["npm", "start"]
