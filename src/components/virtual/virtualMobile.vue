<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline">添加用户</el-button>
    </div>

    <!-- 列表 -->
    <el-row>
      <el-col :span="24" class="center">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="name" label="姓　名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="email" label="邮　箱" align="center"></el-table-column>
          <el-table-column prop="nickname" label="绑定账户昵称" align="center"></el-table-column>
          <el-table-column label="绑定账户头像" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.iconurl" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop label="操　作" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="delMobile(scope.row.mobile)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="active"
                inactive-value="inactive"
                @change="changeSwitch(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="账号是否绑定" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click.native="bindAccount(scope.row)"
                size="mini"
              >虚拟绑定</el-button>
            </template>
          </el-table-column>
          <el-table-column label="账号是否解除" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click.native="removeBading(scope.row)"
                size="mini"
              >解除绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 添加对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="addMobile" :rules="rules" ref="formName">
        <el-form-item label="姓　名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addMobile.name" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addMobile.mobile" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="邮　箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addMobile.email" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="状　态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addMobile.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="putInMobile">提交</el-button>
      </div>
    </el-dialog>

    <!-- 绑定对话框 -->
    <el-dialog :visible.sync="virtualBading" :close-on-click-modal="false" width="30%">
      <el-form :model="accountNum">
        <el-form-item label="选择绑定的账号" :label-width="formLabelWidth">
          <el-select v-model="accountNum.accountNumId" placeholder="请选择">
            <el-option
              v-for="item in accountNumList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="virtualBading = false">取 消</el-button>
        <el-button type="primary" @click="putInBading">提交</el-button>
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
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 添加的参数
      addMobile: {
        mobile: "",
        name: "",
        email: "",
        state: "active"
      },
      tableData: [],
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      virtualBading: false,
      // 可以绑定的账号数组
      accountNumList: [],
      accountNum: {
        // 绑定的账号id
        accountNumId: "",
        // 绑定的手机号码
        mobile: ""
      },
      rules: {
        mobile: [{ required: true, message: "请输入手机号" }],
        name: [{ required: true, message: "请输入姓名" }],
        email: [{ required: true, message: "请输入邮箱" }]
      }
    };
  },

  mounted() {
    this.mobileList();
    this.getAccountNumList();
  },

  methods: {
    // 分页功能
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },

    // 手机号码列表
    mobileList() {
      this.axios
        .get(`admin/am/mobile-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 添加手机账号
    putInMobile() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        this.axios.post("admin/am/mobile-add", this.addMobile).then(res => {
          // console.log(res);
          this.dialogFormVisible = false;
          this.mobileList();
          this.addMobile = {
            mobile: "",
            name: "",
            email: "",
            state: "active"
          };
        });
      });
    },

    // 删除手机号
    delMobile(mobile) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/am/mobile-del", { mobile: mobile })
            .then(res => {
              // console.log(res);
              this.mobileList();
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 修改手机号状态
    changeSwitch(row) {
      this.axios
        .post("admin/am/mobile-state", { mobile: row.mobile, state: row.state })
        .then(res => {
          console.log(res);
          this.mobileList();
        });
    },

    // 绑定虚拟账号
    bindAccount(row) {
      if (row.state !== "active") {
        return this.$message({
          message: "手机号处于关闭状态，禁止绑定虚拟账号",
          type: "warning"
        });
      }
      this.virtualBading = true;
      this.accountNum.mobile = row.mobile;
    },

    // 获取可绑定的数组
    getAccountNumList() {
      this.axios.get("admin/am/ac-list").then(res => {
        // 要绑定的数组
        this.accountNumList = [];
        // 循环所有要绑定的账号
        res.data.data.data.forEach(item => {
          // 如果状态是打开的状态并且bindng_info没有绑定手机号，则添加到 this.accountNumList
          if (item.state == "active" && !item.binding_info.mobile) {
            this.accountNumList.push({
              value: item.yui_uid,
              label: item.nickname,
              binding_info: item.binding_info
            });
          }
        });
      });
    },

    // 手机绑定虚拟账号提交
    putInBading() {
      // 传入的参数
      const data = {
        uid: this.accountNum.accountNumId,
        mobile: this.accountNum.mobile
      };
      this.axios.post("admin/am/mobile-binding", data).then(res => {
        console.log(res);
        this.virtualBading = false;
        this.mobileList();
      });
    },

    // 解除绑定
    removeBading(row) {
      // 判断用户没有绑定虚拟账号
      if (row.yui_uid == "") {
        return this.$message({
          message: "该手机号未绑定虚拟账号",
          type: "warning"
        });
      }
      this.$confirm("此操作将解绑, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 用户绑定了虚拟账号需解除绑定
          this.axios
            .post("admin/am/mobile-binding-remove", { mobile: row.mobile })
            .then(res => {
              this.mobileList();
              console.log(res);
            });
          this.$message({
            type: "success",
            message: "解绑成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
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
}

/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
