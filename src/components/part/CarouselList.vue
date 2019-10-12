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
        <el-table
          :data="tableData"
          style="width: 100%; max-height: 100%"
          height="1000"
          :default-sort="{prop: 'order', order: 'descending'}"
        >
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="slide_title" label="轮播标题" align="center"></el-table-column>
          <el-table-column prop="slide_type_name" label="跳转类型" align="center"></el-table-column>
          <el-table-column prop="order" label="排　　序" sortable align="center"></el-table-column>
          <el-table-column label="轮播图片" width="200" type="index" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.slide_img" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="slide_redirect" label="跳转地址" align="center">
            <template slot-scope="scope">
              <a :href="scope.row.slide_redirect">{{scope.row.slide_redirect}}</a>
            </template>
          </el-table-column>
          <el-table-column label="操　　作" align="center">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="delSlide(scope.row.slide_id)">删除</el-button>
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
                :disabled="scope.row.state == 'inacrive'"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="30%"
      @close="$refs.formName.resetFields()"
    >
      <el-form :model="addCarouse" :rules="rules" ref="formName">
        <el-form-item label="轮播图片" :label-width="formLabelWidth" prop="img">
          <pic-upload @uploadUrl="getUploadUrl" ref="upload"></pic-upload>
        </el-form-item>
        <el-form-item label="轮播标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="addCarouse.title" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="轮播排序" :label-width="formLabelWidth" prop="order">
          <el-input v-model="addCarouse.order" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型" :label-width="formLabelWidth" prop="type">
          <el-select
            placeholder="请选择类型"
            v-model="addCarouse.type"
            style="width:50%"
            @change="changeChoosType"
          >
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" :label-width="formLabelWidth" prop="redirect">
          <el-input
            v-model="addCarouse.redirect"
            autocomplete="off"
            style="width:50%"
            :disabled="redirectDis"
          >
            <a href="https://www.baidu.com/"></a>
          </el-input>
        </el-form-item>
        <el-form-item label="版区状态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addCarouse.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSlide">提交</el-button>
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
      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogVisible: false,
      dialogImageUrl: "",
      addCarouse: {
        title: "",
        img: "",
        type: "",
        redirect: "",
        order: 0,
        state: "active"
      },
      images: [],
      uploadConf: {
        region: null,
        accessKeyId: null,
        accessKeySecret: null,
        bucket: null,
        stsToken: null
      },
      // 跳转类型的参数
      list: [
        { value: "page", label: "web页面" },
        { value: "post", label: "原生" },
        { value: "lottery", label: "抽奖" }
      ],
      rules: {
        title: [{ required: true, message: "请输入内容" }],
        img: [{ required: true, message: "请选择图片" }],
        type: [{ required: true, message: "请选择类型" }],
        redirect: [{ required: true, message: "请输入内容" }],
        order: [{ required: true, message: "请输入内容" }]
      },
      redirectDis: false
    };
  },

  mounted() {
    this.slideList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.slideList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.slideList();
      console.log(`当前页: ${val}`);
    },

    // 数据列表
    slideList() {
      this.axios
        .get(`admin/boards/slide-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          // console.log(this.tableData)
          this.tableData.forEach(item => {
            if (item.slide_type == "page") {
              item.slide_type_name = "web页面";
            } else if (item.slide_type == "post") {
              item.slide_type_name = "原生";
            } else if (item.slide_type == "lottery") {
              item.slide_type_name = "抽奖";
            }
          });
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 跳转地址的选择事件
    changeChoosType() {
      console.log(this.addCarouse.type);
      console.log("12345");
      if (this.addCarouse.type == "lottery") {
        console.log("12345aaaaaaad");
        this.addCarouse.redirect = "http://";
        this.redirectDis = true;
      } else {
        if (this.redirectDis) {
          this.addCarouse.redirect = "";
        }
        this.redirectDis = false;
      }
    },

    getUploadUrl(url, name) {
      this.addCarouse.img = `http://app.yuisource.tech/${name}`;
    },

    // 添加
    addSlide() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addCarouse;
        this.axios.post("admin/boards/slide-add", data).then(res => {
          console.log(res);
          // console.log(data);
          this.slideList();
          this.dialogFormVisible = false;
          this.addCarouse = {
            title: "",
            img: "",
            type: "",
            redirect: "",
            order: 0,
            state: "active"
          };
          this.$refs.upload.clearPic();
        });
      });
    },

    // 删除
    delSlide(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.post("admin/boards/slide-del", { sid: id }).then(res => {
            this.slideList();
            console.log(res);
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

    // 状态
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/boards/slide-activate", { sid: row.slide_id })
          .then(res => {
            this.slideList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/boards/slide-inactivate", { sid: row.slide_id })
          .then(res => {
            this.slideList();
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

/* .el-icon-plus:before {
  line-height: 180px;
}
div >>> .el-upload-dragger {
  width: 180px;
} */
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
