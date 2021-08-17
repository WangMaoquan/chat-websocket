export interface UserInfo {
  username: string;
  isOnLine: boolean;
  password: string;
  loginTime: string;
}

export interface ResponseInfo {
  username: string;
  sendTime: number;
  message: string;
  msgType: "info" | "heart"
}