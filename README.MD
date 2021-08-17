### server

1. 使用 nodemon 启动服务
  ```cmd
  npm install --save-dev nodemon
  ```
2. 安装 node的 ws 模块
  ```cmd
  mpm i ws
  ```


### chat room

```cmd
mkdit chat 
cd chat
npm init -y
npm i vue@next
npm i webpack webpack-cli webpack-dev-server --save-dev
npm i html-webpack-plugin mini-css-extract-plugin css-loader style-loader --save-dev
npm i vue-loader@next @vue/compiler-sfc --save-dev
npm i typescript ts-loader -D
npm i vue-tsx-loader --save-dev
```

1. 创建 webpack.config.js
2. 创建 tsconfig.json
3. 创建 src 目录
4. 创建 main.ts
5. 创建 shims-vue.d.ts