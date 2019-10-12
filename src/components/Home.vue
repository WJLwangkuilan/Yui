<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header" style="height: 100px">
      <el-row>
        <el-col :span="18">
          <div class="admin">
            <img src="../assets/img/logo_nei.png" alt class="logo_nei" />
            <span class="home">YUI后台管理系统</span>
            <!-- <span style="padding-left: 20px">管理员：15810704731</span> -->
          </div>
        </el-col>
        <el-col :span="6">
          <div style="float:right; margin-right: 80px">
            <i class="el-icon-switch-button"></i>&nbsp;
            <a href="#" class="loginout" @click="loginOut">登出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-container style="height: 100%">
      <!-- 侧边栏 -->
      <el-aside width="218px">
        <el-menu
          :router="true"
          :unique-opened="true"
          default-active="1"
          class="el-menu-vertical-demo menu"
          background-color="#545C64"
          text-color="#fff"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-data-board"></i>
              <span style="font-size: 16px">版区模块</span>
            </template>
           
            <el-menu-item-group>
              <el-menu-item index="/addSlide" style="font-size: 14px">版区管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/carouselList" style="font-size: 14px">轮播管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-suitcase-1"></i>
              <span style="font-size: 16px">抽奖模块</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/commodityManage" style="font-size: 14px">商品管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/activity" style="font-size: 14px">活动管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item-group>
            <el-menu-item index="/permis" style="font-size: 16px">
              <i class="el-icon-s-tools"></i>
              权限管理
            </el-menu-item>
          </el-menu-item-group>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-news"></i>
              <span style="font-size: 16px">违规模块</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/violationList" style="font-size: 14px">违规管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/reportManage" style="font-size: 14px">帖子管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item-group>
            <el-menu-item index="/calendar" style="font-size: 16px">
              <i class="el-icon-date"></i>
              日历管理
            </el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <el-menu-item index="/answerModule" style="font-size: 16px">
              <i class="el-icon-edit"></i>
              答题模块
            </el-menu-item>
          </el-menu-item-group>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span style="font-size: 16px">树洞模块</span>
            </template>
           <el-menu-item-group>
              <el-menu-item index="/part" style="font-size: 14px">
              头像管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/randnameManage" style="font-size: 14px">
              昵称管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item-group>
            <el-menu-item index="/sendBoardcast" style="font-size: 16px">
              <i class="el-icon-document-checked"></i>
              发送管理
            </el-menu-item>
          </el-menu-item-group>
           <el-menu-item-group>
            <el-menu-item index="/versionManage" style="font-size: 16px">
              <i class="el-icon-set-up"></i>
              版本管理
            </el-menu-item>
          </el-menu-item-group>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-files"></i>
              <span style="font-size: 16px">虚拟模块</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/virtualMobile" style="font-size: 16px">
                手机号管理
              </el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <el-menu-item index="/virtualNumber" style="font-size: 16px">
                账号管理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item-group>
            <el-menu-item index="chat" style="font-size: 16px">
              <i class="el-icon-document-checked"></i>
              私聊功能
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>

      <!-- 右侧表格 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    loginOut() {
      sessionStorage.clear();
      this.$router.push({ name: "login" });
      this.$message.success("退出成功");
    }
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
}
i {
  color: #ffffff;
}
/* icon图标 */
.el-menu-item i {
  color: #fff;
}
.el-submenu__title i {
  color: #fff;
}
.container {
  height: 100%;
}
/* 头部 */
.header {
  background: url("../assets/img/tit_bg.png") no-repeat top/cover;
  line-height: 100px;
}
.admin {
  font-size: 20px;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
}
.admin .home {
  color: #bababa;
}
.admin .logo_nei {
  width: 50px;
  padding: 16px 0;
  vertical-align: top;
}
/* 右侧 */
.main {
  height: 100%;
}
/* 退出 */
.header .loginout {
  line-height: 60px;
  color: #fff;
  font-size: 18px;
}
.menu {
  height: 100%;
}
li.el-submenu >>> .el-submenu__icon-arrow {
  font-size: 18px;
}
</style>
