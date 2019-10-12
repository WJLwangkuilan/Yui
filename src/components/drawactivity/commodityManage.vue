<template>
  <el-card class="box-card">
    <div class="top">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
        icon="el-icon-circle-plus-outline"
      >添加商品</el-button>
    </div>
    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column type="index" label="#" align="center"></el-table-column>
          <el-table-column prop="commodity_name" label="商品名称" align="center"></el-table-column>
          <el-table-column label="商品主图" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.commodity_main_image" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="商品信息图" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.commodity_intro_image" alt style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="commodity_original_price" label="商品原价" align="center"></el-table-column>
          <el-table-column prop="lucky_draw_price" label="商品抽奖价格" align="center"></el-table-column>
          <el-table-column label="商品状态" align="center">
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
      <el-form :model="form" :rules="rules" ref="formName">
        <el-form-item label="商品主图" :label-width="formLabelWidth" prop="c-main-image">
          <pic-upload @uploadUrl="getUploadMain" ref="upload_main"></pic-upload>
        </el-form-item>
        <el-form-item label="商品信息图" :label-width="formLabelWidth" prop="c-intro-image">
          <pic-upload @uploadUrl="getUploadIntro" ref="upload_intro"></pic-upload>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="c-name">
          <el-input v-model="form['c-name']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="货币种类" :label-width="formLabelWidth">
          <el-select placeholder="请选择" v-model="form.currency_type" style="width:50%">
            <el-option
              v-for="(item, index) in option"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品原价" :label-width="formLabelWidth" prop="c-original-price">
          <el-input v-model="form['c-original-price']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="抽奖价格" :label-width="formLabelWidth" prop="c-lucky-draw-price">
          <el-input v-model="form['c-lucky-draw-price']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="介绍信息" :label-width="formLabelWidth">
          <el-input v-model="form['c-itro']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品列表" :label-width="formLabelWidth">
          <!-- 改成下拉框 -->
          <el-input v-model="form['c-category']" autocomplete="off" style="width:50%"></el-input>
          <!-- <el-select placeholder="请选择" style="width:50%">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-input v-model="form['c-brand']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" :label-width="formLabelWidth">
          <el-input v-model="form['c-place']" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="状态是否开启" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="form['c-state']"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCommodity">提交</el-button>
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
      form: {
        "c-name": "",
        "c-main-image": "",
        "c-intro-image": "",
        "currency_type": "rmb",
        "c-original-price": "",
        "c-lucky-draw-price": "",
        "c-itro": "",
        "c-category": "",
        "c-brand": "",
        "c-place": "",
        "c-state": "inactive"
      },

      // 初始页
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      option: [
        { label: "人名币", value: "rmb" },
        { label: "美元", value: "dollar" },
        { label: "日元", value: "yen" }
      ],
      rules: {
        "c-name": [{ required: true, message: "请输入内容" }],
        "c-main-image": [{ required: true, message: "请选择图片" }],
        "c-intro-image": [{ required: true, message: "请选择图片" }],
        "c-original-price": [{ required: true, message: "请输入内容" }],
        "c-lucky-draw-price": [{ required: true, message: "请输入内容" }],
      }
    };
  },

  mounted() {
    this.commodityList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.commodityList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.commodityList();
      // console.log(`当前页: ${val}`);
    },

    // 商品列表
    commodityList() {
      const data = this.commodity;
      // console.log(data);
      this.axios
        .get(`admin/lucky-draw/commodity-list?page=${this.currentPage}`, data)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    getUploadMain(url, name) {
      this.form["c-main-image"] = `http://app.yuisource.tech/${name}`;
    },
    getUploadIntro(url, name) {
      this.form["c-intro-image"] = `http://app.yuisource.tech/${name}`;
    },

    // 添加商品
    addCommodity() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.form;
        this.axios.post("admin/lucky-draw/commodity-add", data).then(res => {
          console.log(data)
          console.log(res);
          this.commodityList();
          this.dialogFormVisible = false;
          this.form = {
            "c-name": "",
            "c-main-image": "",
            "c-intro-image": "",
            "currency_type": "rmb",
            "c-original-price": "",
            "c-lucky-draw-price": "",
            "c-itro": "",
            "c-category": "",
            "c-brand": "",
            "c-place": "",
            "c-state": "inactive"
          };
          this.$refs.upload_main.clearPic();
          this.$refs.upload_intro.clearPic();
        });
      });
    },

    // switch 开关
    changeSwitch(row) {
      if (row.state === "active") {
        this.axios
          .post("admin/lucky-draw/commodity-activate", {
            cid: row.commodity_id
          })
          .then(res => {
            this.commodityList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/lucky-draw/commodity-inactivate", {
            cid: row.commodity_id
          })
          .then(res => {
            this.commodityList();
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
  overflow: hidden;
}
</style>
