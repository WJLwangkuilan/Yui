<template>
  <el-card class="box-card">
    <div class="top">
      <el-radio-group v-model="type" size="medium" fill="#545C64" @change="changeRadio">
        <el-radio-button label="前缀"></el-radio-button>
        <el-radio-button label="后缀"></el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="dialogFormVisible = true" size="medium" icon="el-icon-circle-plus-outline">名称添加</el-button>
      <el-button type="warning" @click="cacheFlush" size="medium" icon="el-icon-refresh">刷新缓存</el-button>
    </div>

    <!-- 表格 -->
    <el-row>
      <el-col :span="24" class="center">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" :key="type" height="1000">
          <el-table-column label="＃" align="center" type="index"></el-table-column>
          <el-table-column prop="prefix_name" label="前缀名" v-if="type == '前缀'" align="center"></el-table-column>
          <el-table-column prop="suffix_name" label="后缀名" v-if="type == '后缀'" align="center"></el-table-column>
          <el-table-column prop="created_at" label="时　间"></el-table-column>
          <el-table-column label="操　作" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="delRandname(scope.row.n_id)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="available"
                inactive-value="unavailable"
                v-model="scope.row.state"
                @change="updateState(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%" @close="$refs.formName.resetFields()">
      <el-form :model="addContent" :rules="rules" ref="formName">
        <el-form-item label="类　　型" :label-width="formLabelWidth" prop="type">
          <el-select placeholder="请选择类型" v-model="addContent.type" style="width:50%">
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称内容" :label-width="formLabelWidth" prop="name_part">
          <el-input v-model="addContent.name_part" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="putInrandname">提交</el-button>
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
      // 初始页
      currentPage: 1,
      pageSize: 0,
      total: 0,
      type: "前缀",
      radio: "prefix",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 添加的内容
      addContent: {
        type: "",
        name_part: ""
      },
      //   添加下拉框的可选值
      list: [
        { label: "前缀", value: "prefix" },
        { label: "后缀", value: "suffix" }
      ],
      rules: {
        type: [{ required: true, message: "请选择内容" }],
        name_part: [{ required: true, message: "请输入内容" }]
      }
    };
  },

  mounted() {
    this.randnameList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.randnameList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.randnameList();
      console.log(`当前页: ${val}`);
    },

    // 随机名称列表接口
    randnameList() {
      this.axios
        .post(`admin/randname/list`, {
          type: this.radio,
          page: this.currentPage
        })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },
    // 选中事件
    changeRadio(value) {
      if (value == "前缀") {
        this.radio = "prefix";
        this.randnameList();
      }
      if (value == "后缀") {
        this.radio = "suffix";
        this.randnameList();
      }
    },

    // 名称添加
    putInrandname() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        this.axios.post("admin/randname/add", this.addContent).then(res => {
          // console.log(res);
          this.dialogFormVisible = false;
          this.randnameList();
          this.addContent = {
            type: "",
            name_part: ""
          };
        });
      });
    },

    // 名称删除
    delRandname(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/randname/del", { nid: id, type: this.radio })
            .then(res => {
              console.log(res);
              this.randnameList();
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

    // 名称状态修改接口
    updateState(row) {
      // console.log(row.state)
      this.axios
        .post("admin/randname/state-modify", {
          nid: row.n_id,
          type: this.radio,
          action: row.state
        })
        .then(res => {
          console.log(res);
          this.randnameList();
        });
    },

    // 刷新缓存
    cacheFlush() {
      this.axios.get("admin/randname/cache-flush").then(res => {
        // console.log(res);
        this.$router.push(this.$route.path);
        // console.log( this.$route)
        this.$message({
          message: "恭喜你，刷新成功",
          type: "success"
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
