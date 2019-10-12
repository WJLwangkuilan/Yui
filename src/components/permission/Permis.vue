<template>
  <el-card class="box-card">
    <div class="top">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
        icon="el-icon-circle-plus-outline"
      >添加权限</el-button>
    </div>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%; height: 100%"
          height="1000"
          @expand-change="getLimits"
          ref="refTable"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.children"
                style="width: 100%; height: 100%"
                border
                :key="index"
              >
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="一级权限" prop="one_level_intro" align="center"></el-table-column>
                <el-table-column label="二级权限" prop="two_level_intro" align="center"></el-table-column>
                <el-table-column label="操　　作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delLimits(scope.row)">删除</el-button>
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
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="100" align="center"></el-table-column>
          <el-table-column label="用户名" prop="account" align="center"></el-table-column>
          <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
          <el-table-column label="邮　箱" prop="email" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%"  @close="$refs.formName.resetFields()">
      <el-form :model="addPermis" :rules="rules" ref="formName">
        <el-form-item label="管理账号 ID" :label-width="formLabelWidth" prop="tid">
          <el-select v-model="addPermis.tid" placeholder="请选择">
            <el-option
              v-for="(item, index) in tableData"
              :key="index"
              :label="item.account"
              :value="item.account_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加一级权限" :label-width="formLabelWidth" prop='one-level'>
          <el-select v-model="addPermis['one-level']" placeholder="请选择" @change="getValue">
            <el-option
              v-for="(item, index) in subkeys"
              :key="index"
              :label="item.intro"
              :value="item.one_level"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加二级权限" :label-width="formLabelWidth" prop='two-level'>
          <el-select
            v-model="addPermis['two-level']"
            placeholder="请选择"
            @focus="twoLevelFocus"
            ref="twoLevel"
          >
            <el-option
              v-for="(item, index) in two_level"
              :key="index"
              :label="item.intro"
              :value="item.two_level"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限是否开启" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addPermis.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLimits">确 定</el-button>
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
      index: 0,
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      // 总条数
      total: 0,
      // 列表请求得数据放这里
      tableData: [],
      // switch开关
      value: true,
      // 添加权限参数
      addPermis: {
        tid: "",
        "one-level": "",
        "two-level": "",
        state: "inactive"
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 管理员账号id
      account_id: "",
      tableDataList: [],
      // 接收key的数据
      subkeys: [],
      // 一级权限
      one_level: [],
      // 二级权限
      two_level: [],
      // 每一行的题目
      row: [],
      // 每一行下的选项
      expandedRows: [],
      rules: {
        tid: [{ required: true, message: "请选择内容" }],
        "one-level": [{ required: true, message: "请选择权限" }],
        "two-level": [{ required: true, message: "请输入权限" }]
      }
    };
  },

  mounted() {
    this.getUserList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
      // console.log(`当前页: ${val}`);
    },

    // 1 获取管理员列表
    getUserList() {
      this.axios
        .get(`admin/permissions/admin-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
          this.tableData.forEach(item => {
            item.children = [];
          });
          this.getKey();
        });
    },

    // 2 获取key的数据
    getKey() {
      this.axios.get("admin/permissions/admin-permissions-keys").then(res => {
        console.log(res);
        // 获取到的数据赋值给data中定义的subkeys
        this.subkeys = res.data.data;
        // console.log(this.subkeys)
      });
    },

    // 获取一级权限所有的值 一级权限的值从key的数据中取
    getValue(val) {
      this.subkeys.forEach(item => {
        if (item.one_level == val) {
          this.two_level = item.subkeys;
        }
      });
    },

    //  一级选择了才能选择二级，二级权限获取焦点事件
    twoLevelFocus() {
      if (this.addPermis["one-level"] == "") {
        alert("请先选择一级权限");
        this.$refs.twoLevel.blur();
      }
    },

    // 3 获取管理员全部权限
    getLimits(row, expandedRows) {
      // console.log(row)
      // console.log(row, expandedRows);
      if (
        expandedRows.length == 0 ||
        row.account_id !== expandedRows[expandedRows.length - 1].account_id
      )
        return false;
      if (expandedRows.length > 1) {
        this.$refs.refTable.toggleRowExpansion(expandedRows[0]);
      }
      this.row = row;
      // console.log(this.row)
      this.expandedRows = expandedRows;
      // console.log("调接口了，id=" + row.account_id);
      this.getPowerList(row);
    },

    // 根据id获取角色权限
    getPowerList(row) {
      this.axios
        .post("admin/permissions/admin-permissions-list", {
          "account-id": row.account_id
        })
        .then(res => {
          // console.log(res);
          const { data } = res.data.data;
          // console.log("调接口了，id=" + row.account_id);
          data.forEach(item => {
            // 循环角色权限 拿到每一项
            if (this.subkeys) {
              this.subkeys.forEach(oneLevelItem => {
                // console.log(oneLevelItem)
                // 循环 所有权限
                // 用角色权限每一项的one_level和所有权限的one_level匹配  如果相同 执行 if
                if (item.one_level == oneLevelItem.one_level) {
                  item.one_level_intro = oneLevelItem.intro; // 把列表渲染的one_level的intro值添加到数据里
                  // 循环 匹配好的 one_level里的 subkeys 用来匹配 two_level
                  oneLevelItem.subkeys.forEach(twoLevelItem => {
                    if (item.two_level == twoLevelItem.two_level) {
                      item.two_level_intro = twoLevelItem.intro; // 把列表渲染的two_level的intro值添加到数据里面
                    }
                  }); // end each (oneLevelItem.subkeys)
                }
              }); // end each (this.subkeys)
            }
          }); // end each (data)
          row.children = data;
          // console.log(row.children);
          setTimeout(() => {
            this.index++;
            // console.log(this);
          }, 100);
          // console.log(this.tableData);
        });
    },

    // 添加权限接口
    addLimits() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addPermis;
        // console.log(data);
        this.axios.post("admin/permissions/add", data).then(res => {
          // console.log(res);
          if (this.row.account_id) {
            this.getPowerList(this.row);
          }
          this.dialogFormVisible = false;
          this.addPermis = {
            tid: "",
            "one-level": "",
            "two-level": "",
            state: "inactive"
          };
        });
      });
    },

    // 删除权限接口
    delLimits(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/permissions/del", { pid: id.permission_id })
            .then(res => {
              console.log(res);
              this.getLimits(this.row, this.expandedRows);
              this.getPowerList(this.row);
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

    // switch 关闭
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/permissions/activate", {
            pid: row.permission_id
          })
          .then(res => {
            this.getKey();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/permissions/inactivate", {
            pid: row.permission_id
          })
          .then(res => {
            this.getKey();
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
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>