const ws = require("ws");

const wss = new ws.Server({ port: 3000 });

function initWebSocketServer() {
  wss.on("connection", handleConnect);
  wss.on("error", handleError);
  wss.on("close", handleClose);
}

// 触发 connection 的 方法
function handleConnect(ws) {
  console.log("server connect success");
  ws.on("message", (msg) => {
    console.log(msg)
    let obj = JSON.parse(msg);
    obj.sendTime = (new Date()).getTime();
    wss.clients.forEach(client => {
      client.send(JSON.stringify(obj));
    })
  })
}

// 触发 error 的 方法
function handleError() {
  console.log("server error");
}

// 触发 close 方法
function handleClose() {
  console.log("server close");
}

initWebSocketServer();