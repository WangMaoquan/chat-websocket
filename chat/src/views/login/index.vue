<template>
  <div class="container">
    <div class="form-container">
      <div class="form-body">
        <div class="header">
          <h2>Login</h2>
          <p>welcome to my chat room</p>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="text" placeholder="username" v-model="username" />
        </div>
        <div class="input-group">
          <input type="password" placeholder="password" v-model="password" />
        </div>
        <!-- <div class="input-group flex">
          <div class="remember">
            <input id="rcheckbox" type="checkbox" />
            <label for="rcheckbox"> Remenber Me </label>
          </div>
        </div> -->
        <div class="input-group right">
          <button @click="login">LOGIN</button>
        </div>
      </div>
      <div class="form-image">
        <div class="text">
          <h2>
            Welcome <br />
            Back!
          </h2>
          <p>decade</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, inject, reactive, toRefs } from 'vue';
  import { useRouter } from 'vue-router';
  import { UserInfo } from "../../utils/userInfo";
  export default defineComponent({
    name: 'Login',
    setup() {
      const state = reactive({
        username: '',
        password: '',
      });
      const router = useRouter();
      const login = () => {
        if (state.username.trim() !== "") {
          const jsonStr = localStorage.getItem("username")!;
          const userInfo: UserInfo = JSON.parse(jsonStr);
          if (userInfo && userInfo.username === state.username.trim()) {
            alert("用户名已经注册了, 换一个")
            return;
          }
          localStorage.setItem("username", JSON.stringify({
            username: state.username,
            password: state.password || 123456,
            isOnline: false,
            loginTime: new Date()
          }))
          router.push("/");
        } else {
          alert("用户名不能为空")
        }
      };
      return {
        ...toRefs(state),
        login,
      };
    },
  });
</script>
<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f2f2f2;
    font-family: Arial;
  }
  .container .form-container {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 700px;
    min-width: 700px;
    height: 500px;
    background: #fff;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    transition: 0.5s;
  }
  /* .container .form-container:hover {
    transform: translateY(-10px) rotate(-1deg);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  } */

  /* body */
  .form-body {
    width: 100%;
    margin-top: 70px;
  }
  .form-body .header {
    margin: 0 40px;
  }
  .form-body .header h2 {
    font-size: 30px;
    margin-bottom: 30px;
  }
  .form-body .header p {
    font-size: 16px;
  }

  /* group */
  .form-group {
    margin: 50px 40px;
  }
  .form-group .input-group {
    width: 300px;
    margin: 20px 0px;
  }

  .form-group .input-group input[type='password'],
  .form-group .input-group input[type='text'] {
    width: 100%;
    padding: 8px 15px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .form-group .input-group.right {
    text-align: right;
  }
  .form-group .input-group button {
    position: relative;
    width: 100px;
    padding: 10px 15px;
    margin-top: 15px;
    color: #fff;
    background: rgb(235, 0, 255);
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    z-index: 1;
    overflow: hidden;
  }
  .form-group .input-group button::before {
    position: absolute;
    top: 0;
    left: -100px;
    width: 100%;
    height: 100%;
    content: '';
    border-radius: 5px;
    background: linear-gradient(
      to left,
      rgba(235, 0, 255, 0.9),
      rgba(17, 166, 233, 0.9)
    );
  }
  .form-group .input-group button:hover::before {
    transform: translateX(100px);
    z-index: -1;
    transition: 0.5s;
  }
  .form-group .input-group.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }
  .form-group .input-group.flex .remember {
    display: flex;
    align-items: center;
  }
  .form-group .input-group.flex .remember input {
    margin-right: 5px;
  }
  .form-group .input-group.flex a {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.8);
  }

  /* image */
  .container .form-image {
    position: absolute;
    right: 0;
    width: 55%;
    height: 100%;
    background: linear-gradient(
      rgba(235, 0, 255, 0.9),
      rgba(17, 166, 233, 0.9)
    );
    color: #fff;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 100%);
  }
  .container .form-image .text {
    position: absolute;
    right: 0;
    width: 60%;
    padding: 30px;
    margin-top: 30px;
    text-align: right;
  }
  .container .form-image .text p {
    font-size: 12px;
  }
  .container .form-image .text h2 {
    font-size: 34px;
    margin-bottom: 20px;
  }
</style>
