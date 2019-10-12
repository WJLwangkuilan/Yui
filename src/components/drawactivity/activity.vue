<template>
  <el-card class="box-card">
    <div class="top">
      <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-circle-plus-outline">添加活动</el-button>
    </div>

    <!-- 表格 -->
    <el-row class="center">
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%; max-height: 100%" height="1000">
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="draw_name" label="抽奖活动名称" align="center"></el-table-column>
          <el-table-column prop="draw_phase" label="抽奖活动期数" align="center"></el-table-column>
          <el-table-column prop="lucky_draw_intro" label="抽奖活动介绍" align="center"></el-table-column>
          <el-table-column prop="share" label="允许抽奖方式" align="center"></el-table-column>
          <el-table-column prop="events_start_timestamp" label="活动开始时间" align="center"></el-table-column>
          <el-table-column prop="lottery_timestamp" label="活动开奖时间" align="center"></el-table-column>
          <el-table-column prop="events_end_timestamp" label="活动结束时间" align="center"></el-table-column>
          <el-table-column prop="lottery_vague_mins" label="活动开奖误差" align="center"></el-table-column>
          <el-table-column label="权限是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="active"
                inactive-value="inactive"
                @change="changeSwitch(scope.row)"
                v-model="scope.row.state"
                :disabled="scope.row.state == 'inactive'"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%"  @close="$refs.formName.resetFields()">
      <el-form :model="addDraw" :rules="rules" ref="formName">
        <el-form-item label="抽奖活动名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addDraw.name" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="抽奖活动期数" :label-width="formLabelWidth" prop="phase">
          <el-input v-model="addDraw.phase" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="抽奖活动介绍" :label-width="formLabelWidth" prop="intro">
          <el-input v-model="addDraw.intro" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="额外抽奖次数" :label-width="formLabelWidth" prop="channel">
          <el-input v-model="addDraw.channel" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" :label-width="formLabelWidth" prop="stimestamp">
          <el-date-picker
            v-model="addDraw.stimestamp"
            type="datetime"
            placeholder="选择日期时间"
            style="width:50%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" :label-width="formLabelWidth" prop="etimestamp">
          <el-date-picker
            v-model="addDraw.etimestamp"
            type="datetime"
            placeholder="选择日期时间"
            style="width:50%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动开奖时间" :label-width="formLabelWidth" prop="ltimestamp">
          <el-date-picker
            v-model="addDraw.ltimestamp"
            type="datetime"
            placeholder="选择日期时间"
            style="width:50%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="抽奖活动奖品" :label-width="formLabelWidth" prop="cid">
          <el-select placeholder="请选择奖品" v-model="addDraw.cid" style="width:50%">
            <el-option
              v-for="(item, index) in optionList"
              :key="index"
              :value="item.commodity_id"
              :label="item.commodity_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动开奖误差" :label-width="formLabelWidth">
          <el-input v-model="addDraw.lmins" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="抽奖活动状态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addDraw.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDrawList">提交</el-button>
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
      // 添加的参数
      addDraw: {
        cid: "",
        name: "",
        phase: 0,
        intro: "",
        channel: "",
        stimestamp: "",
        etimestamp: "",
        ltimestamp: "",
        lmins: 10,
        state: "inactive"
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 对话框中下拉框的数据
      optionList: [
        {
          value: "",
          label: ""
        }
      ],
      // 初始页
      currentPage: 1,
      pageSize: 0,
      total: 0,
      rules: {
        cid: [{ required: true, message: "请选择奖品" }],
        name: [{ required: true, message: "请输入内容" }],
        phase: [{ required: true, message: "请输入内容" }],
        intro: [{ required: true, message: "请输入内容" }],
        channel: [{ required: true, message: "请输入内容" }],
        stimestamp: [{ required: true, message: "请选择日期" }],
        etimestamp: [{ required: true, message: "请选择日期" }],
        ltimestamp: [{ required: true, message: "请选择日期" }]
      }
    };
  },

  mounted() {
    this.addLuckyDraw();
    this.activeCommodityList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.addLuckyDraw();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.addLuckyDraw();
      // console.log(`当前页: ${val}`);
    },

    // 活动列表接口
    addLuckyDraw() {
      this.axios
        .get(`admin/lucky-draw/draw-management-list?page=${this.currentPage}`)
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
          this.tableData.forEach(item => {
            item.share = JSON.parse(item.other_opportunity_channel).share;
            // console.log(this.tableData)
          });
        });
    },

    // 活动添加
    addDrawList() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        const data = this.addDraw;
        // console.log(data);
        data.stimestamp = new Date(data.stimestamp / 1000).getTime();
        data.etimestamp = new Date(data.etimestamp / 1000).getTime();
        data.ltimestamp = new Date(data.ltimestamp / 1000).getTime();

        this.axios.post("admin/lucky-draw/draw-add", data).then(res => {
          console.log(res);
          this.dialogFormVisible = false;
          this.addLuckyDraw();
          this.addDraw = {
            cid: "",
            name: "",
            phase: 0,
            intro: "",
            channel: "",
            stimestamp: 0,
            etimestamp: 0,
            ltimestamp: 0,
            lmins: 10,
            state: "inactive"
          };
        });
      });
    },

    // 可用的商品列表
    activeCommodityList() {
      this.axios.get("admin/lucky-draw/commodity-list-active").then(res => {
        this.optionList = res.data.data;
        console.log(res);
      });
    },

    // switch 关闭
    changeSwitch(row) {
      if (row.state === "inactive") {
        this.axios
          .post("admin/lucky-draw/draw-inactivate", {
            eid: row.draw_id
          })
          .then(res => {
            // this.addLuckyDraw();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/lucky-draw/draw-activate", {
            eid: row.draw_id
          })
          .then(res => {
            // this.addLuckyDraw();
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
/* .center /deep/ .el-table {
  overflow-y: auto !important;
} */
div >>> .el-dialog {
  width: 10%;
}
</style>