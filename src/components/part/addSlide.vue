<template>
  <el-card class="box-card">
    <div class="top">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
        icon="el-icon-circle-plus-outline"
      >添加</el-button>
    </div>

    <el-row class="center">
      <el-col :span="24">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="creater_account" label="用　　户" align="center"></el-table-column>
          <el-table-column prop="boards_name" label="版区名称" align="center"></el-table-column>
          <el-table-column prop="boards_intro" label="版区介绍" align="center"></el-table-column>
          <el-table-column prop="boards_weight" label="版区权重" align="center" sortable></el-table-column>
          <el-table-column prop="boards_type_name" label="版区类型" align="center"></el-table-column>
          <el-table-column label="头　　像" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.boards_logo" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="操　　作" align="center">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="del(scope.row.boards_id)">删除</el-button>
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
      <el-form :model="addboard" :rules="rules" ref="formName">
        <el-form-item label="版区图片" :label-width="formLabelWidth" prop="logo">
          <pic-upload @uploadUrl="getUploadUrl" ref="upload"></pic-upload>
        </el-form-item>
        <el-form-item label="版区名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addboard.name" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="版区介绍" :label-width="formLabelWidth" prop="intro">
          <el-input v-model="addboard.intro" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="版区类型" :label-width="formLabelWidth" prop="type">
          <el-select placeholder="请选择类型" v-model="addboard.type" style="width:50%">
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版区权重" :label-width="formLabelWidth">
          <el-input v-model="addboard.weight" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="版区状态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addboard.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBoard">提交</el-button>
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
  // name: "upload",
  data() {
    return {
      images: [],
      tableData: [],
      // 初始页
      currentPage: 1,
      // 每页默认显示多少条
      pageSize: 0,
      // 总共多少条
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      addboard: {
        name: "",
        logo: "",
        intro: "",
        weight: 0,
        state: "inactive",
        type: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      list: [
        { value: "normal", label: "普通" },
        { value: "treehole", label: "树洞" },
        { value: "outfits", label: "穿搭" }
      ],
      rules: {
        name: [{ required: true, message: "请输入内容" }],
        logo: [{ required: true, message: "请选择图片" }],
        intro: [{ required: true, message: "请输入内容" }],
        type: [{ required: true, message: "请选择类型" }]
      }
    };
  },

  mounted() {
    this.boardList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.boardList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.boardList();
      // console.log(`当前页: ${val}`);
    },

    // 版区列表
    boardList() {
      this.axios.get(`admin/boards/list?page=${this.currentPage}`).then(res => {
        console.log(res);
        this.tableData = res.data.data.data;
        this.tableData.forEach(item => {
          if(item.boards_type == "normal") {
            item.boards_type_name = "普通"
          } else if (item.boards_type == "treehole") {
            item.boards_type_name = "树洞"
          } else if (item.boards_type == "outfits") {
            item.boards_type_name = "穿搭"
          }
        })
        this.total = res.data.data.total;
        this.per_page = res.data.data.per_page;
      });
    },

    // 版区是否激活状态
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/boards/activate", { boards_id: row.boards_id })
          .then(res => {
            this.boardList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/boards/inactivate", { boards_id: row.boards_id })
          .then(res => {
            this.boardList();
            console.log(res);
          });
      }
    },

    // 添加图片的参数
    getUploadUrl(url, name) {
      // console.log(url)
      // console.log(name)
      this.addboard.logo = `http://app.yuisource.tech/${name}`;
      // console.log(this.addboard.logo);
    },

    // 添加版区
    addBoard() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addboard;
        // console.log(data);
        this.axios.post("admin/boards/add", data).then(res => {
          console.log(res);
          this.boardList();
          this.dialogFormVisible = false;
          this.addboard = {
            name: "",
            logo: "",
            intro: "",
            weight: 0,
            type: "",
            state: "inactive"
          };
          this.$refs.upload.clearPic();
        });
      });
    },

    // 删除
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.post("admin/boards/del", { boards_id: id }).then(res => {
            this.boardList();
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
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/common.css";
.box-card {
  height: 100%;
}
</style>
