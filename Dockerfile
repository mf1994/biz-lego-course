# Dockerfile
FROM node
WORKDIR /app
COPY . /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
# 安装
# RUN npm set registry https://registry.npm.taobao.org
# RUN npm cache clean --force
#RUN npm i

EXPOSE 3001

# 启动
CMD npm run prd-dev && npx pm2 log
#CMD npm run prd && npx pm2 log
