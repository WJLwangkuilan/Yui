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
          <el-table-column prop="c_name" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="c_intro" label="商品介绍" align="center"></el-table-column>
          <el-table-column prop="c_category" label="商品类型" align="center"></el-table-column>
          <el-table-column prop="c_brand" label="商品品牌" align="center"></el-table-column>
          <el-table-column prop="c_brand" label="商品产地" align="center"></el-table-column>
          <el-table-column label="商品主图" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.c_main_image" alt style="width: 80px" />
            </template>
          </el-table-column>
          <el-table-column label="商品信息图" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.c_intro_image" alt style="width: 80px" />
            </template>
          </el-table-column>
          <el-table-column prop="date_lunch" label="发售开始日期" align="center"></el-table-column>
          <el-table-column prop="date_closing" label="发售结束日期" align="center"></el-table-column>
          <el-table-column prop="c_down_payment" label="订　　金" align="center"></el-table-column>
          <el-table-column prop="c_final_payment" label="尾　　款" align="center"></el-table-column>
          <el-table-column label="操　　作" align="center">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="delCalendra(scope.row.c_id)"
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
      <el-form :model="addCalendar" :rules="rules" ref="formName">
        <el-form-item label="商品主图" :label-width="formLabelWidth" prop="image-main">
          <pic-upload @uploadUrl="getUploadMain" ref="upload_main"></pic-upload>
        </el-form-item>
        <el-form-item label="商品详情图" :label-width="formLabelWidth" prop="image-intro">
          <pic-upload @uploadUrl="getUploadIntro" ref="upload_intro"></pic-upload>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addCalendar.name" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" :label-width="formLabelWidth" prop="intro">
          <el-input v-model="addCalendar.intro" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" :label-width="formLabelWidth" prop="category">
          <el-input v-model="addCalendar.category" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="brand">
          <el-input v-model="addCalendar.brand" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" :label-width="formLabelWidth" prop="place">
          <el-input v-model="addCalendar.place" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="定　　金" :label-width="formLabelWidth" prop="payment-down">
          <el-input v-model="addCalendar['payment-down']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="尾　　款" :label-width="formLabelWidth" prop="payment-final">
          <el-input v-model="addCalendar['payment-final']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" :label-width="formLabelWidth" prop="date-lunch">
          <el-date-picker v-model="addCalendar['date-lunch']" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" :label-width="formLabelWidth" prop="date-closing">
          <el-date-picker
            v-model="addCalendar['date-closing']"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动状态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addCalendar.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="putInCalendar">提交</el-button>
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
      // 添加商品
      addCalendar: {
        name: "",
        intro: "",
        category: "",
        brand: "",
        place: "",
        "image-main": "",
        "image-intro": "",
        "date-lunch": "",
        "date-closing": "",
        "payment-down": "",
        "payment-final": "",
        state: "inactive"
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 分页相关变量
      currentPage: 1,
      pageSiae: 0,
      total: 0,
      rules: {
        name: [{ required: true, message: "请输入内容" }],
        intro: [{ required: true, message: "请输入内容" }],
        category: [{ required: true, message: "请输入内容" }],
        brand: [{ required: true, message: "请输入内容" }],
        place: [{ required: true, message: "请输入内容" }],
        "image-main": [{ required: true, message: "请选择图片" }],
        "image-intro": [{ required: true, message: "请选择图片" }],
        "date-lunch": [{ required: true, message: "请选择日期" }],
        "date-closing": [{ required: true, message: "请选择日期" }],
        "payment-down": [{ required: true, message: "请输入内容" }],
        "payment-final": [{ required: true, message: "请输入内容" }]
      }
    };
  },

  mounted() {
    this.calendarList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSiae = val;
      this.calendarList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.calendarList();
      // console.log(`当前页: ${val}`);
    },

    // 日历列表
    calendarList() {
      this.axios
        .get(`admin/calendar/commodity-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;

          // console.log(this.tableData);
          this.tableData.forEach(item => {
            item.date_lunch = this.$moment(item.c_launch_date * 1000).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.date_closing = this.$moment(item.c_closing_date * 1000).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
        });
    },

    getUploadMain(url, name) {
      this.addCalendar["image-main"] = `http://app.yuisource.tech/${name}`;
    },
    getUploadIntro(url, name) {
      this.addCalendar["image-intro"] = `http://app.yuisource.tech/${name}`;
    },

    // 提交列表
    putInCalendar() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addCalendar;
        // 日期格式转换为时间戳
        data["date-lunch"] = new Date(data["date-lunch"] / 1000).getTime();
        data["date-closing"] = new Date(data["date-closing"] / 1000).getTime();
        this.axios.post("admin/calendar/commodity-add", data).then(res => {
          // console.log(res);
          this.calendarList();
          this.dialogFormVisible = false;
          this.addCalendar = {
            name: "",
            intro: "",
            category: "",
            brand: "",
            place: "",
            "image-main": "",
            "image-intro": "",
            "date-lunch": "",
            "date-closing": "",
            "payment-down": "",
            "payment-final": "",
            state: "inactive"
          };
          this.$refs.upload_main.clearPic();
          this.$refs.upload_intro.clearPic();
        });
      });
    },

    // 删除数据
    delCalendra(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/calendar/commodity-del", {
              cid: id
            })
            .then(res => {
              this.calendarList();
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
    // switch 关闭
    changeSwitch(row) {
      if (row.state === "inactive") {
        this.axios
          .post("admin/calendar/commodity-inactivate", {
            cid: row.c_id
          })
          .then(res => {
            this.calendarList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/calendar/commodity-activate", {
            cid: row.c_id
          })
          .then(res => {
            this.calendarList();
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
  /* overflow: hidden; */
}
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
</style>
