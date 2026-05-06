FROM node:20-alpine

WORKDIR /app

# O npm install será rodado após inicializar o Vite no commit 6
# COPY package.json package-lock.json ./
# RUN npm install

EXPOSE 5173

# Adicionamos --host para expor corretamente fora do container
CMD ["npm", "run", "dev", "--", "--host"]
