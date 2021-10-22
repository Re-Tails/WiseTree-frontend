FROM node:12

WORKDIR /root/frontend/wtg

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]