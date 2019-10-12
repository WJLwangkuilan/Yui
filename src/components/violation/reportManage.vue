<template>
  <el-card class="box-card" style="height:100%">
    <el-row class="top">
      <el-col :span="24">
        <el-radio-group v-model="type" size="medium" fill="#545C64" @change="changeRadio">
          <el-radio-button label="被举报的用户"></el-radio-button>
          <el-radio-button label="被举报的帖子"></el-radio-button>
          <el-radio-button label="被封禁的用户"></el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <!-- 被举报的用户 -->
        <el-table
          :data="tableData"
          style="width: 100%; max-height: 100%"
          height="1000"
          v-if="type == '被举报的用户'"
          :key="type"
        >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="whistleblowers_nickname" label="昵称"></el-table-column>
          <el-table-column prop="stateText" label="状态"></el-table-column>
          <el-table-column prop="violation_type" label="举报类型"></el-table-column>
          <el-table-column prop="irregularities" label="举报理由"></el-table-column>
          <el-table-column label="用户是否封禁">
            <template slot-scope="scope">
              <el-button type="info" @click.native="userBanning(scope.row)" size="mini">用户封禁</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 被举报的帖子 -->
        <el-table :data="tableData" style="width: 100%" v-if="type == '被举报的帖子'" :key="type">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="post_detail.title" label="标题"></el-table-column>
          <el-table-column prop="post_detail.content" label="内容"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <div>
                <img
                  :src="scope.row.post_detail.creater_icon"
                  alt
                  style="width: 100px"
                  v-if="scope.row.post_detail"
                />
                <a
                  href="javascript:;"
                  @click="openImgs(scope.row.post_detail.images)"
                  style="color: #000"
                >查看更多</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操　作">
            <template slot-scope="scope">
              <el-button type="warning" @click.native="postClose(scope.row)" size="mini">关闭帖子</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 被封禁的用户 -->
        <el-table :data="tableData" style="width: 100%" v-if="type == '被封禁的用户'" :key="type">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="user_detail.nickname" label="用户昵称"></el-table-column>
          <el-table-column label="用户头像">
            <template slot-scope="scope">
              <img
                :src="scope.row.user_detail.profile_image_url"
                alt
                style="width: 100px"
                v-if="scope.row.user_detail"
              />
            </template>
          </el-table-column>
          <el-table-column prop="user_detail.signature" label="用户简介"></el-table-column>
          <el-table-column label="操　作">
            <template slot-scope="scope">
              <el-button type="warning" @click.native="banningRemove(scope.row)" size="mini">解除封禁</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-row class="pag">
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15]"
          :page-size="15"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      type: "被举报的用户",
      radio: "user",
      //  用户封禁请求的参数
      addBan: {
        uid: "",
        violation_type_id: ""
      },
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      disabled: true
    };
  },

  mounted() {
    this.reportList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.reportList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.reportList();
      // console.log(`当前页: ${val}`);
    },

    // 举报列表
    reportList() {
      this.axios
        .post(`admin/violation/whistleblowing-list`, {
          type: this.radio,
          page: this.currentPage
        })
        .then(res => {
          console.log(res);
          res.data.data.data.forEach(item => {
            if (item.state == "untreated") {
              item.stateText = "未处理";
            }
            if (item.state == "being-processed") {
              item.stateText = "处理中";
            }
            if (item.state == "processing-complete") {
              item.stateText = "处理完成";
            }
            if (item.state == "already-feedback") {
              item.stateText = "已反馈";
            }
          });
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 选中事件
    changeRadio(value) {
      if (value == "被举报的用户") {
        this.radio = "user";
        this.reportList();
      }
      if (value == "被举报的帖子") {
        this.radio = "post";
        this.reportList();
      }
      // console.log(value)
      // console.log(this.radio)
      if (value == "被封禁的用户") {
        this.banningList();
      }
    },

    // 用户封禁
    userBanning(row) {
      this.addBan.uid = row.target_id;
      this.addBan.violation_type_id = row.violation_type_id;
      console.log(this.addBan);
      this.axios.post("admin/violation/user-banning", this.addBan).then(res => {
        console.log(res);
        this.reportList();
      });
    },

    // 解除用户封禁
    banningRemove(row) {
      //   console.log(row.target_id);
      this.axios
        .post("admin/violation/banning-remove", { uid: row.target_id })
        .then(res => {
          console.log(res);
          this.reportList();
        });
    },

    // 被封禁的用户列表
    banningList() {
      this.axios.get("admin/violation/banning-list").then(res => {
        console.log(res);
        this.tableData = res.data.data.data;
        this.total = res.data.data.total;
        this.per_page = res.data.data.per_page;
      });
    },

    // 帖子关闭
    postClose(row) {
      this.$confirm("此操作将永久关闭, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/violation/post-closing", { pid: row.target_id })
            .then(res => {
              console.log(res);
              this.disabled = false;
            });
          this.$message({
            type: "success",
            message: "关闭成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消关闭"
          });
        });
    },

    // 展示图片的点击事件
    openImgs(imgs) {
      let img = "";
      imgs.forEach(item => {
        img += `<img src="${item}" width="80" style="margin-right: 10px;"/>`;
      });
      this.$alert(img, {
        dangerouslyUseHTMLString: true,
        customClass: "alertPic",
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/common.css";
.box-card {
  height: 100%;
  /* padding-top: 0; */
}
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
<style>
.alertPic .el-message-box__header {
  padding-top: 25px;
}
.alertPic .el-message-box__content {
  height: 300px;
  overflow-y: auto;
}
</style>
