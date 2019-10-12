<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import init from "@/assets/rongyun/init";
export default {
  name: "App",
  created() {
    const token = window.sessionStorage.getItem("token");
    // console.log(token);
    if (token) {
      var _this = this;
      var callbacks = {
        CONNECTED: function(instance) {
          return (_this.instance = instance);
        },
        Success: function(id) {},
        Received: function(message) {
          console.log("获取新消息", message)
          _this.$message({
            type: "success",
            message: "有一条未读消息"
          })
        }
      };
      this.axios
        .get("admin/im/get-token")
        .then(res => {
          console.log(res);
          window.sessionStorage.setItem("userInfo", JSON.stringify(res.data.data))
          var userInfo = {
            // 生产环境的appkey
            // appKey: "qd46yzrfqpl1f",

            // 开发环境的appkey
            appKey: "25wehl3u2gxfw",
            // 获取后台返回的token
            token: res.data.data.token
          };
          init(userInfo, callbacks);
        });
    }
  }
};
</script>

<style>
#app {
  height: 100%;
}
</style>
