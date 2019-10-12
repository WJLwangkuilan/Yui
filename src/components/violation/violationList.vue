<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline">添加</el-button>
    </div>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="t_title" label="标　题" align="center"></el-table-column>
          <el-table-column prop="t_description" label="描　述" align="center"></el-table-column>
          <el-table-column prop="t_weight" label="权　重" align="center" sortable></el-table-column>
          <el-table-column label="操　作" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="delViolationList(scope.row.t_id)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="active"
                inactive-value="inactive"
                @change="changeSwitch(scope.row)"
                v-model="scope.row.state"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="addList" :rules="rules" ref="formName">
        <el-form-item label="标　　　　题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="addList.title" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="描　　　　述" :label-width="formLabelWidth" prop="des">
          <el-input v-model="addList.des" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="权　　　　重" :label-width="formLabelWidth">
          <el-input v-model="addList.weight" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="权限是否开启" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addList.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addViolationList">提交</el-button>
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
export default {
  data() {
    return {
      tableData: [],
      // 添加参数
      addList: {
        title: "",
        des: "",
        weight: "",
        state: "inactive"
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      rules: {
        title: [{ required: true, message: "请输入内容" }],
        des: [{ required: true, message: "请输入内容" }],
      }
    };
  },

  mounted() {
    this.violationList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.violationList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.violationList();
      // console.log(`当前页: ${val}`);
    },

    // 违规列表
    violationList() {
      this.axios
        .get(`admin/violation/violation-type-list?page=${this.currentPage}`)
        .then(res => {
          this.tableData = res.data.data.data;
          console.log(res);
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 添加列表
    addViolationList() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addList;
        // console.log(data);
        this.axios
          .post("admin/violation/violation-type-add", data)
          .then(res => {
            this.dialogFormVisible = false;
            this.violationList();
            // console.log(res);
            this.addList = {
              title: "",
              des: "",
              weight: "",
              state: "inactive"
            };
          });
      });
    },

    // 删除
    delViolationList(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/violation/violation-type-del", { tid: id })
            .then(res => {
              this.dialogFormVisible = false;
              this.violationList();
              // console.log(res);
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
    // switch 开关
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/violation/violation-type-activate", {
            tid: row.t_id
          })
          .then(res => {
            this.violationList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/violation/violation-type-inactivate", {
            tid: row.t_id
          })
          .then(res => {
            this.violationList();
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
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
