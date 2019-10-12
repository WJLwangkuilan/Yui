<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline">添加账号</el-button>
    </div>
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="nickname" label="账号昵称" align="center"></el-table-column>
          <el-table-column label="头　　像">
            <template slot-scope="scope">
              <img :src="scope.row.iconurl" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="binding_info.mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="binding_info.name" label="持有者" align="center"></el-table-column>
          <el-table-column prop="inding_info.email" label="邮　箱" align="center"></el-table-column>
          <el-table-column label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="active"
                inactive-value="inactive"
                :disabled="!!scope.row.binding_info.mobile"
                @change="changeSwitch(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="addNumber" :rules="rules" ref="formName">
        <el-form-item label="头像地址" :label-width="formLabelWidth" prop="iconurl">
          <pic-upload @uploadUrl="getUploadUrl" ref="upload"></pic-upload>
        </el-form-item>
        <el-form-item label="昵　　称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="addNumber.nickname" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" :label-width="formLabelWidth" prop="signature">
          <el-input v-model="addNumber.signature" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="性　　别" :label-width="formLabelWidth">
          <el-select v-model="addNumber.gender" style="width:50%">
            <el-option
              v-for="(item, index) in gender"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态" :label-width="formLabelWidth">
          <el-select v-model="addNumber.granted_state" style="width:50%">
            <el-option
              v-for="(item, index) in grantedState"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状　　态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addNumber.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="putInNumber">提交</el-button>
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
      // 账号添加的参数
      addNumber: {
        nickname: "",
        iconurl: "",
        signature: "",
        gender: "女",
        granted_state: "granted",
        state: "active"
      },
      gender: [{ label: "女", value: "女" }, { label: "男", value: "男" }],
      grantedState: [
        { label: "已授权", value: "granted" },
        { label: "未授权", value: "ungranted" }
      ],
      // 初始页
      currentPage: 1,
      // 每页默认显示多少条
      pageSize: 0,
      // 总共多少条
      total: 0,
      rules: {
        nickname: [{ required: true, message: "请输入昵称" }],
        iconurl: [{ required: true, message: "请选择图片" }],
        signature: [{ required: true, message: "请输入内容" }]
      }
    };
  },

  mounted() {
    this.numberList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.numberList();
      // console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.numberList();
      // console.log(`当前页: ${val}`);
    },

    // 虚拟账号列表
    numberList() {
      this.axios.get(`admin/am/ac-list?page=${this.currentPage}`).then(res => {
        console.log(res);
        this.tableData = res.data.data.data;
        this.total = res.data.data.total;
        this.per_page = res.data.data.per_page;
      });
    },

    // 添加图片的参数 上传到阿里云
    getUploadUrl(url, name) {
      this.addNumber.iconurl = `http://app.yuisource.tech/${name}`;
      // console.log(this.addboard.logo);
    },

    // 虚拟账号添加
    putInNumber() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;

        this.axios.post("admin/am/ac-add", this.addNumber).then(res => {
          console.log(res);
          this.numberList();
          this.dialogFormVisible = false;
          this.$refs.upload.clearPic();
          this.addNumber = {
            nickname: "",
            iconurl: "",
            signature: "",
            gender: "女",
            granted_state: "granted",
            state: "active"
          };
          this.$refs.upload.clearPic();
        });
      });
    },

    // 账号管理状态
    changeSwitch(row) {
      this.axios
        .post("admin/am/ac-state-manage", {
          uid: row.yui_uid,
          state: row.state
        })
        .then(res => {
          this.numberList();
          console.log(res);
        });
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/common.css";
.box-card {
  height: 100%;
}

/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
