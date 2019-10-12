<template>
  <div class="login-wrap">
    <div class="login-right">
      <el-form
        class="login-form"
        label-position="left"
        label-width="80px"
        :model="formData"
        ref="upload"
      >
        <div style="float: right">
          <img src="../assets/img/logo.png" alt />
        </div>
        <el-input
          v-model="formData.account"
          placeholder="输入管理账号"
          class="input"
          size="mini"
          type="password"
          prefix-icon="el-icon-user"
        ></el-input>
        <br />
        <el-input
          v-model="formData.passwd"
          placeholder="输入管理密码"
          size="mini"
          type="password"
          prefix-icon="el-icon-lock"
          show-password
        ></el-input>
        <br />
        <el-input
          v-model="formData.mobile"
          placeholder="输入手机号码"
          size="mini"
          style="margin-top: 20px"
          maxlength="11"
          prefix-icon="el-icon-mobile-phone"
        ></el-input>
        <br />
        <el-input
          size="mini"
          placeholder="输入验证码"
          class="input-with-select"
          style="margin-top: 20px"
          v-model="formData.code"
          prefix-icon="el-icon-lock"
        >
          <el-button v-if="show" slot="append" @click="SendverificationCode">发送验证码</el-button>
          <el-button v-if="!show" slot="append" disabled style>倒计时{{count}}秒</el-button>
        </el-input>
        <el-button
          class="login-button"
          type="primary"
          style="width: 300px"
          size="small"
          @click="loginBtn"
        >登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        account: "",
        passwd: "",
        mobile: "",
        code: ""
      },
      show: true,
      count: "",
      timer: null,
    };
  },
  methods: {
    // 登录点击事件
    loginBtn() {
      if (!this.formData.account) return this.$message.error("请输入账号");
      if (!this.formData.passwd) return this.$message.error("请输入密码");
      if (!this.formData.mobile) return this.$message.error("请输入手机号");
      if (!this.formData.code) return this.$message.error("请输入验证码");
      const data = {
        account: this.formData.account,
        passwd: this.$md5(this.formData.passwd),
        mobile: this.formData.mobile,
        code: this.formData.code * 1
      };
      console.log(data);
        this.axios.post("admin/auth/login", data).then(res => {
          console.log(res);
          const data = res.data;
          const { code, msg } = data;
          if (code === 200) {
            const token = data.data.token;
            sessionStorage.setItem("token", token);
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          this.$router.push("/");
      });
    },

    // 发送验证码
    SendverificationCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      this.axios
        .post("admin/auth/verification-code", {
          mobile: this.formData.mobile
        })
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style scoped>
.input-with-select >>> .el-input__inner {
  width: 200px;
}
.input-with-select button {
  width: 100px;
}
.lolita {
  width: 210px;
  height: 16px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 16px;
}
.types {
  width: 75px;
  height: 16px;
  font-size: 12px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 16px;
  margin-left: 130px;
}
span {
  width: 154px;
  height: 28px;
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  float: right;
  margin-bottom: 60px;
}
.login-wrap {
  background-color: #eee;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}
.login-wrap .login-form {
  margin: auto 50px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.login-wrap .login-form .input {
  /* padding: 50px 0 20px 0; */
  padding: 16px 0 20px 0;
  width: 300px;
}
div >>> .el-input__inner {
  width: 300px;
  height: 40px;
  background: rgba(6, 7, 20, 0.5);
  border-radius: 6px;
  border: none;
}
div >>> .el-input--mini .el-input__inner {
  color: #fff;
}
.login-wrap .login-form .login-button {
  margin: 100px 0;
  background-color: #fff;
  color: black;
  height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  font-size: 18px;
  padding: 0 15px;
}

/* 右侧 */
.login-right {
  height: 100%;
  width: 400px;
  position: absolute;
  right: 200px;
  background: linear-gradient(
    180deg,
    rgba(125, 175, 188, 1) 0%,
    rgba(24, 29, 61, 1) 100%
  );
  opacity: 0.8;
}
/* img图片 */
.login-right img {
  width: 300px;
  padding: 0 0 20px 0;
}
</style>
