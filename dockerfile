FROM node as node_test_ng
WORKDIR /app
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=node_test_ng /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx","-g", "daemon off;"]