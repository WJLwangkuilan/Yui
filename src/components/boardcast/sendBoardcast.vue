<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="sendAlias = true" icon="el-icon-right">发送推送</el-button>
    </div>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="title" label="推送标题"></el-table-column>
          <el-table-column prop="content" label="推送内容"></el-table-column>
          <el-table-column prop="push_type" label="推送类型"></el-table-column>
          <el-table-column label="图片地址">
            <template slot-scope="scope">
              <img :src="scope.row.image" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="目标用户头像">
            <template slot-scope="scope">
              <img
                :src="scope.row.user_detail.profile_image_url"
                alt
                style="width: 100px"
                v-if="scope.row.user_detail"
              />
            </template>
          </el-table-column>
          <el-table-column prop="user_detail.nickname" label="目标昵称"></el-table-column>
          <el-table-column prop="user_detail.signature" label="目标简介"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 发送对话框 -->
    <el-dialog :visible.sync="sendAlias" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="send_alias" :rules="rules" ref="formName">
        <el-form-item label="图片地址" :label-width="formLabelWidth" prop="img">
          <pic-upload @uploadUrl="getUserImage" ref="upload"></pic-upload>
        </el-form-item>
        <el-form-item label="选择类型" :label-width="formLabelWidth" prop="title">
          <el-select placeholder="请选择" v-model="send_alias.title" style="width:50%">
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="手机号　"
          :label-width="formLabelWidth"
          v-if="send_alias.title=='suffix'"
          prop="search"
        >
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            style="width:50%"
            v-model="send_alias.search"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="推送内容" :label-width="formLabelWidth" prop="content">
          <el-input v-model="send_alias.content" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="操作介绍" :label-width="formLabelWidth" prop="operation">
          <el-input v-model="send_alias.operation	" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendAlias = false">取 消</el-button>
        <el-button type="primary" @click="sendAliasList">提交</el-button>
      </div>
    </el-dialog>

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
import picUpload from "../picUpload";
export default {
  components: {
    picUpload
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 0,
      total: 0,
      // 发送推送请求参数
      send_alias: {
        uid: "",
        title: "",
        content: "",
        search: "",
        img: "",
        operation: ""
      },
      list: [
        { label: "全体", value: "prefix" },
        { label: "个人", value: "suffix" }
      ],
      dialogFormVisible: false,
      sendAlias: false,
      formLabelWidth: "120px",
      userList: [],
      rules: {
        img: [{ required: true, message: "请选择图片" }],
        title: [{ required: true, message: "请输入内容" }],
        content: [{ required: true, message: "请输入内容" }],
        operation: [{ required: true, message: "请输入内容" }],
        search: [{ required: true, message: "请输入内容" }]
      }
    };
  },

  mounted() {
    // this.aliasUserList();
    this.pushList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.pushList();
      console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.pushList();
      console.log(`当前页: ${val}`);
    },

    //  用户搜索接口
    searchUser() {
      if (this.send_alias.search.length !== 11)
        return this.$message({
          type: "warning",
          message: "请输入正确正式的手机号码"
        });
      this.axios
        .post("admin/im/user-search", { mobile: this.send_alias.search })
        .then(res => {
          console.log(res);
          if (!res.data.data.userid)
            return this.$message({
              type: "warning",
              message: "该手机号不能推送"
            });
          this.send_alias.uid = res.data.data.userid;
          console.log(this.send_alias.uid);
        });
    },

    // 用于别名推送的用户列表
    // aliasUserList() {
    //   this.axios
    //     .get(`admin/push/home-list?page=${this.currentPage}`)
    //     .then(res => {
    //       console.log(res);
    //       this.tableData = res.data.data.data;
    //       this.total = res.data.data.total;
    //       this.per_page = res.data.data.per_page;
    //     });
    // },

    // 推送记录
    pushList() {
      this.axios
        .get(`admin/push/push-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    getUserImage(url, name) {
      this.send_alias.img = `http://app.yuisource.tech/${name}`;
    },

    // 发送推送
    sendAliasList() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        let url = "admin/push/boardcast";
        if (this.send_alias.title == "prefix") {
          url = "admin/push/boardcast";
        } else {
          url = "admin/push/alias";
          // console.log(this.send_alias.uid);
          // if (!this.send_alias.uid)
          //   return this.$message({
          //     type: "warning",
          //     message: "请输入正确的手机号查找用户信息进行推送"
          //   });
        }
        this.axios.post(url, this.send_alias).then(res => {
          console.log(res);
          this.pushList();
          if (res.data.msg == "success") {
            this.$message({
              message: "恭喜你，发送推送成功",
              type: "success"
            });
          }
          this.sendAlias = false;
          this.send_alias = {
            uid: "",
            title: "",
            content: "",
            search: "",
            img: "",
            operation: ""
          };
          this.$refs.upload.clearPic();
        });
      });
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/common.css";
.box-card {
  height: 100%;
  overflow: hidden;
}
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
