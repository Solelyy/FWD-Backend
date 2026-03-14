FROM node:20-alpine

WORKDIR /FWD-Backend

COPY package*.json ./

# npm install doenst work on docker nestjs, should be npm ci
RUN npm ci

COPY prisma ./prisma/


RUN npx prisma generate 

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]