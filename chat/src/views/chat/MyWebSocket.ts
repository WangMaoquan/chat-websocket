import { UserInfo } from '@/utils/userInfo';

interface SocketMethodsOptions {
  onMessage?: (e: Event) => void;
  onError?: (e: Event) => void;
  onClose?: (e: Event) => void;
  onOpen?: (e: Event) => void;
}

interface HeartCheckOptions {
  time?: number;
  serverTime?: number;
}

type HeartCheck = Required<HeartCheckOptions> & {
  sendTimeout: number | null;
  serverTimeout: number | null;
  start: (this: HeartCheck) => void;
};

interface MyWebScoketOptions {
  socketMethodsOptions?: SocketMethodsOptions;
  heartCheckOptions?: HeartCheckOptions;
}

type BaseFuncType = (e: Event) => void;

type MergeFuncType = (
  e: Event,
  baseFunc: BaseFuncType,
  ...funcs: BaseFuncType[]
) => void;

const defaultOpen = () => {};
const defaultClose = () => {};
const defaultMessage = () => {};
const defaultError = () => {};

class MyWebScoket {
  private url: string;
  private options: MyWebScoketOptions;
  private isConnect: boolean = false;
  private ws: WebSocket;
  private baseFunc: BaseFuncType;
  private mergeFunc: MergeFuncType;
  private heartCheck: HeartCheck;
  private connectTimer: number | null = null;
  constructor(url: string, options: MyWebScoketOptions) {
    this.url = url;
    this.options = options;
    this.ws = new WebSocket(url);
    this.heartCheck = this.initHeartCheck(
      (options.heartCheckOptions = options.heartCheckOptions || {}),
    );
    this.baseFunc = (e: Event) => {
      if (this.ws.readyState === 0 || this.ws.readyState === 1) {
        this.heartCheck.start();
      } else {
        this.connect();
      }
    };
    this.mergeFunc = (e: Event, baseFunc, ...funcs) => {
      funcs.forEach((func) => func(e));
      baseFunc(e);
    };
    this.initSocket(
      (options.socketMethodsOptions = options.socketMethodsOptions || {}),
    );
  }
  private initHeartCheck(options: HeartCheckOptions) {
    const that = this;
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
          if (that.ws.readyState === 1) {
            const userInfo = JSON.parse(
              localStorage.getItem('username')!,
            ) as UserInfo;
            that.ws.send(
              JSON.stringify({
                username: userInfo.username,
                msg: '心跳检测',
                msgType: 'heart',
              }),
            );
          }
          _this.serverTimeout = window.setTimeout(() => {
            console.log('重连失败 关闭连接');
            that.closeWebSocket();
          }, this.serverTime);
        }, this.time);
      },
    };
    return heartCheck;
  }
  private initSocket(options: SocketMethodsOptions) {
    const {
      onClose = defaultClose,
      onMessage = defaultMessage,
      onOpen = defaultOpen,
      onError = defaultError,
    } = options;
    this.ws.onopen = (e) => {
      this.isConnect = true;
      this.mergeFunc(e, this.baseFunc, onOpen);
      console.log('连接成功');
    };
    this.ws.onclose = (e) => {
      this.isConnect = false;
      this.mergeFunc(e, this.baseFunc, onClose);
      this.resetHeart();
    };
    // socket.onmessage = onMessage || defaultMessage;
    this.ws.onmessage = (e) => {
      this.mergeFunc(e, this.baseFunc, onMessage);
    };
    this.ws.onerror = (e) => {
      this.isConnect = false;
      this.mergeFunc(e, this.baseFunc, onError);
      this.resetHeart();
    };
  }
  private connect() {
    if (this.isConnect) {
      return;
    }
    this.isConnect = true;
    this.connectTimer && clearTimeout(this.connectTimer);
    console.log('尝试重连中...');
    this.connectTimer = window.setTimeout(() => {
      this.isConnect = false;
      this.ws = new WebSocket(this.url);
      this.initSocket(
        (this.options.socketMethodsOptions =
          this.options.socketMethodsOptions || {}),
      );
      this.resetHeart();
    }, 2000);
  }
  private resetHeart() {
    this.heartCheck.sendTimeout && clearTimeout(this.heartCheck.sendTimeout);
    this.heartCheck.serverTimeout && clearTimeout(this.heartCheck.serverTimeout);
    this.heartCheck = this.initHeartCheck(
      (this.options.heartCheckOptions = this.options.heartCheckOptions || {}),
    );
  }
  closeWebSocket() {
    this.ws.close();
  }

  send(msg: string) {
    this.ws.send(msg);
  }
}

export default MyWebScoket;
