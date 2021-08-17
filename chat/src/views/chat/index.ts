import { UserInfo } from '@/utils/userInfo';

interface SocketMethodsOptions {
  onMessage?: (e: Event) => void;
  onError?: (e: Event) => void;
  onClose?: (e: Event) => void;
  onOpen?: (e: Event) => void;
}

interface HeartCheck {
  time: number;
  serverTime: number;
  sendTimeout: number | null;
  serverTimeout: number | null;
  start: (this: HeartCheck) => void;
}

interface HeartCheckOptions {
  time?: number;
  serverTime?: number;
}

interface MyWebScoketOptions {
  socketMethodsOptions?: SocketMethodsOptions;
  heartCheckOptions: HeartCheckOptions;
}

const customOnOpen = () => {};
const customOnClose = () => {};
const customMessage = () => {};
const customOnError = () => {};

type BaseFuncType = (e: Event) => void;

type MergeFuncType = (
  e: Event,
  baseFunc: BaseFuncType,
  ...funcs: BaseFuncType[]
) => void;

const initSocket = (url: string, options: SocketMethodsOptions) => {
  const { onClose, onMessage, onOpen, onError } = options;
  let socket = new WebSocket(url);
  const heartCheck = initHeartCheck(socket, { time: 3000, serverTime: 3000 });
  const baseFunc: BaseFuncType = (e: Event) => {
    // console.log("index")
    heartCheck.start();
  };
  const mergeFunc: MergeFuncType = (e: Event, baseFunc, ...funcs) => {
    funcs.forEach((func) => func(e));
    baseFunc(e);
  };
  socket.onopen = (e) => {
    console.log('open');
    mergeFunc(e, baseFunc, onOpen || customOnOpen);
  };
  socket.onclose = onClose || customOnClose;
  // socket.onmessage = onMessage || customMessage;
  socket.onmessage = (e) => {
    mergeFunc(e, baseFunc, onMessage || customMessage);
  };
  socket.onerror = onError || customOnError;
  return socket;
};

const initHeartCheck = (ws: WebSocket, options?: HeartCheckOptions) => {
  const heartCheck: HeartCheck = {
    time: options?.time || 3000,
    serverTime: options?.serverTime || 5000,
    sendTimeout: null,
    serverTimeout: null,
    start() {
      let _this = this;
      this.sendTimeout && clearTimeout(this.sendTimeout);
      this.serverTimeout && clearTimeout(this.serverTimeout);
      this.sendTimeout = window.setTimeout(() => {
        if (ws.readyState === 1) {
          const userInfo = JSON.parse(
            localStorage.getItem('username')!,
          ) as UserInfo;
          ws.send(
            JSON.stringify({
              username: userInfo.username,
              msg: '心跳检测',
              msgType: 'heart',
            }),
          );
        }
        console.log('heartCheck');
        _this.serverTimeout = window.setTimeout(() => {
          console.log('close');
          ws.close();
        }, this.serverTime);
      }, this.time);
    },
  };
  return heartCheck;
};

class MyWebScoket {
  private isConnect: boolean = false;
  private ws: WebSocket;
  private baseFunc: BaseFuncType;
  private mergeFunc: MergeFuncType;
  private heartCheck: HeartCheck;
  constructor(url: string, options: MyWebScoketOptions) {
    this.ws = initSocket(url, options?.socketMethodsOptions || {});
    this.heartCheck = initHeartCheck(this.ws, options.heartCheckOptions);
    this.baseFunc = (e: Event) => {
      this.heartCheck.start();
    };
    this.mergeFunc = (e: Event, baseFunc, ...funcs) => {
      funcs.forEach((func) => func(e));
      baseFunc(e);
    };
  }
}

export default initSocket;
