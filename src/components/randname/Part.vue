<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%; overflow:auto;" height="1000">
          <el-table-column label="＃" align="center" type="index" width="100"></el-table-column>
          <el-table-column label="用户头像" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.icon" alt style="width: 80px" />
            </template>
          </el-table-column>
          <el-table-column prop="icon_category" label="用户种类" align="center"></el-table-column>
          <el-table-column prop="icon_intro" label="用户简介" align="center"></el-table-column>
          <el-table-column prop="position_num" label="头像位置" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
          <el-table-column prop label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeSwitch(scope.row)"
                active-value="active"
                inactive-value="inactive"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="add" :rules="rules" ref="formName">
        <el-form-item label="头像地址" :label-width="formLabelWidth" prop="icon">
          <pic-upload @uploadUrl="getUploadUrl" ref="upload"></pic-upload>
        </el-form-item>
        <el-form-item label="头像简介" :label-width="formLabelWidth" prop="intro">
          <el-input v-model="add.intro" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="头像位置" :label-width="formLabelWidth" prop="pnum">
          <el-select v-model="add.pnum" placeholder="请选择" style="width:50%">
            <el-option :value="item" v-for="item in 9" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像状态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="add.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addDialogForm">提交</el-button>
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
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      add: {
        pnum: "",
        icon: "",
        intro: "",
        state: "inactive"
      },
      rules: {
        pnum: [{ required: true, message: "请选择内容" }],
        icon: [{ required: true, message: "请选择图片" }],
        intro: [{ required: true, message: "请输入内容" }]
      }
    };
  },

  mounted() {
    this.userInfo();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.userInfo();
      // console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.userInfo();
      // console.log(`当前页: ${val}`);
    },

    // 匿名昵称头像列表
    userInfo() {
      this.axios
        .get(`admin/anonymous/icon-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          // console.log(this.tableData);
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    getUploadUrl(url, name) {
      this.add.icon = `http://app.yuisource.tech/${name}`;
    },

    // 添加对话框
    addDialogForm() {
      const data = this.add;
      // console.log(data)
      // const index = data.icon.indexOf("com") + 3;
      // data.icon = "http://app.yuisource.tech" + data.icon.slice(index);
      // console.log(data.icon);
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        this.axios.post("admin/anonymous/icon-add", data).then(res => {
          console.log(res);
          this.userInfo();
          this.add = {
            pnum: "",
            icon: "",
            intro: "",
            state: "inactive"
          };
        this.$refs.upload.clearPic();
        this.dialogFormVisible = false;
        });
      });
    },

    // switch 开关
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/anonymous/icon-activate", {
            pid: row.icon_id,
            pnum: row.position_num
          })
          .then(res => {
            this.userInfo();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/anonymous/icon-inactivate", { pid: row.icon_id })
          .then(res => {
            this.userInfo();
            console.log(res);
          });
      }
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
div >>> .el-dialog {
  width: 40%;
}
div >>> .el-dialog__footer {
  padding-top: 100px;
}
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
