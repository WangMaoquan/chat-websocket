<template>
  <div class="chat">
    <div class="container">
      <div class="left">tool</div>
      <div class="right">
        <div class="header">群聊</div>
        <div class="content">
          <div
            v-for="item in msgArr"
            :class="`message-item-wrap ${
              item.username === currentUser ? 'send' : 'receive'
            } `"
            :key="item.sendTime"
          >
            <div class="message-item-container">
              <div class="message-info-warp">
                <span class="user-name">{{ item.username }}</span>
                <span class="message-time">{{
                  changeTime(item.sendTime)
                }}</span>
              </div>
              <div class="message-text-warp">
                <div class="message-text-container">
                  <div>{{ item.message }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <textarea
            placeholder="请输入消息"
            :rows="100"
            :cols="200"
            v-model="msg"
          ></textarea>
          <div class="sendBtn">
            <button @click="sendMsg">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    handleError,
    onMounted,
    onUnmounted,
    reactive,
    ref,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { UserInfo, ResponseInfo } from '../../utils/userInfo';
  import initSocket from './index';
  import MyWebSocket from './MyWebSocket';
  export default defineComponent({
    name: 'Chat',
    setup() {
      const router = useRouter();
      !localStorage.getItem('username') && router.push('/login');
      const msgArr = reactive<ResponseInfo[]>([]);
      const msg = ref('');
      let currentUser =
        JSON.parse(localStorage.getItem('username')!)?.username || '';
      const handleOpen = (e: Event) => {
        console.log(e);
        console.log('open');
      };

      const handleMessage = (e: Event) => {
        const { data } = e as MessageEvent;
        const { msgType } = JSON.parse(data) as ResponseInfo;
        if (msgType !== 'heart') {
          msgArr.push(JSON.parse(data));
          msg.value = '';
        }
      };

      const handleError = (e: Event) => {
        console.log('error');
        // todo
      };

      const handleClose = (e: Event) => {
        console.log('close');
        // todo
      };

      // const ws = initSocket('ws:localhost:3000', {
      //   onMessage: handleMessage,
      //   onError: handleError,
      //   onClose: handleClose,
      //   onOpen: handleOpen,
      // });

      const myWs = new MyWebSocket('ws:localhost:3000', {
        socketMethodsOptions: {
          onMessage: handleMessage,
          onError: handleError,
          onClose: handleClose,
          onOpen: handleOpen,
        },
        heartCheckOptions: {
          serverTime: 10000,
          time: 3000,
        },
      });

      const sendMsg = () => {
        if (msg.value.trim() === '') {
          return;
        }
        const userInfo = JSON.parse(
          localStorage.getItem('username')!,
        ) as UserInfo;
        myWs.send(
          JSON.stringify({
            username: userInfo.username,
            msg: msg.value,
            msgType: 'info',
          }),
        );
      };

      // onMounted(() => {
      //   ws.addEventListener('open', handleOpen);
      //   ws.addEventListener('message', handleMessage);
      //   ws.addEventListener('error', handleError);
      //   ws.addEventListener('close', handleClose);
      // });

      // onUnmounted(() => {
      //   ws.close();
      //   ws.removeEventListener('open', handleOpen);
      //   ws.removeEventListener('message', handleMessage);
      //   ws.removeEventListener('error', handleError);
      //   ws.removeEventListener('close', handleClose);
      // });

      const changeTime = (value: number) => {
        let time = new Date().getTime();
        time = parseInt((time - value) / 1000 + '');
        //存储转换值
        let s;
        if (time < 60 * 3) {
          //三分钟内
          return '刚刚';
        } else if (time < 60 * 60 && time >= 60 * 3) {
          //超过十分钟少于1小时
          s = Math.floor(time / 60);
          return s + '分钟前';
        } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
          //超过1小时少于24小时
          s = Math.floor(time / 60 / 60);
          return s + '小时前';
        } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
          //超过1天少于3天内
          s = Math.floor(time / 60 / 60 / 24);
          return s + '天前';
        } else {
          //超过3天
          let date = new Date(value);
          return (
            date.getFullYear() +
            '.' +
            (date.getMonth() + 1) +
            '.' +
            date.getDate()
          );
        }
      };

      return {
        msg,
        msgArr,
        sendMsg,
        currentUser,
        changeTime,
      };
    },
  });
</script>
<style scoped>
  .chat {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 600px;
    min-width: 600px;
    height: 550px;
    background-color: rgb(238, 238, 238);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
  }
  .left {
    width: 10%;
    background-color: #333;
    color: #fff;
    border-radius: 8px 0 0 8px;
    text-align: center;
  }
  .right {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 90%;
  }
  .header,
  .content {
    width: 98%;
  }

  .message-item-wrap {
    margin: 0 30px 10px 30px;
  }

  .receive .message-info-warp {
    text-align: left;
  }

  .message-info-warp {
    line-height: 20px;
    height: 20px;
    margin-bottom: 5px;
  }

  .message-info-warp .user-name {
    font-size: 14px;
    color: #333;
  }

  .message-info-warp .message-time {
    margin: 0 10px;
    font-size: 12px;
    color: #606266;
  }

  .receive .message-text-container {
    position: relative;
    background-color: #fff;
  }

  .message-text-container {
    display: inline-block;
    min-height: 20px;
    min-width: 20px;
    line-height: 20px;
    font-size: 14px;
    border-radius: 4px;
    padding: 10px;
    color: #636363;
  }

  .receive .message-text-container:before,
  .send .message-text-container:after {
    position: absolute;
    top: 0;
    display: block;
    width: 0;
    height: 0;
    margin-top: 15px;
    content: '';
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }

  .receive .message-text-container:before {
    border-right: 5px solid #fff;
    left: 0;
    margin-left: -5px;
  }

  .message-text-container div {
    word-break: break-word;
  }

  .send .message-info-warp,
  .send .message-text-warp {
    text-align: right;
  }

  .send .message-text-container {
    position: relative;
    background-color: #b2e281;
    text-align: left;
  }
  .send .message-text-container:after {
    border-left: 5px solid #b2e281;
    right: 0;
    margin-right: -5px;
  }

  .header {
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #d1d1d1;
  }
  .content {
    height: 400px;
    border-bottom: 1px solid #d1d1d1;
    overflow: hidden;
  }
  .footer textarea {
    width: 100%;
    height: 60px;
    line-height: 20px;
    font-size: 14px;
    color: #333;
    border: 0;
    resize: none;
    outline: none;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: transparent;
  }
  .sendBtn {
    display: flex;
    justify-content: flex-end;
  }
  .sendBtn button {
    display: inline-block;
    padding: 3px 30px;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    font-size: 14px;
    text-decoration: none;
    background-color: #fff;
    color: #222;
    cursor: pointer;
    outline: none;
  }
</style>
