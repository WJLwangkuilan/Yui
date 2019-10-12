<template>
  <el-card class="box-card">
    <div class="top">
      <el-radio-group v-model="type" size="medium" fill="#545C64" @change="changeRadio">
        <el-radio-button label="全　部"></el-radio-button>
        <el-radio-button label="已打开"></el-radio-button>
        <el-radio-button label="未打开"></el-radio-button>
      </el-radio-group>
      <el-button
        type="primary"
        @click="addTopic = true"
        icon="el-icon-circle-plus-outline"
        size="medium"
      >添加题目</el-button>
      <el-button
        type="success"
        @click="addOptions = true"
        icon="el-icon-circle-plus-outline"
        size="medium"
      >添加选项</el-button>
      <el-button type="warning" @click="answerList = true" size="medium" icon="el-icon-document-add">答案绑定</el-button>
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

          <!-- 选项部分 -->
          <el-table-column type="expand" align="center">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.children"
                style="width: 100%; height: 100%"
                border
                :key="index"
              >
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column prop="content" label="选项内容" align="center"></el-table-column>
                <el-table-column label="操　作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="delOptions(scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="选项是否激活" align="center">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.state"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="active"
                      inactive-value="inactive"
                      @change="changeSwitchOption(scope.row)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="是否为正确答案" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isRightAnswer == 'false'">否</span>
                    <span v-if="scope.row.isRightAnswer == 'true'">是</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>

          <el-table-column label="内　　容" prop="q_content" align="center"></el-table-column>
          <el-table-column label="操　　作" align="center">
            <template slot-scope="scope">
              <!-- icon="el-icon-delete" -->
              <el-button type="warning" size="mini" @click="delAnswerList(scope.row.q_id)">删除</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加题目对话框 -->
    <el-dialog :visible.sync="addTopic" :close-on-click-modal="false" width="30%" @close="$refs.formTitle.resetFields()">
      <el-form :model="addanswer" :rules="rules" ref="formTitle">
        <el-form-item label="题目内容" :label-width="formLabelWidth" prop="content">
          <el-input v-model="addanswer.content" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="状　　态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addanswer.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTopic = false">取 消</el-button>
        <el-button type="primary" @click="addAnswerList">提交</el-button>
      </div>
    </el-dialog>

    <!-- 添加选项的对话框 -->
    <el-dialog :visible.sync="addOptions" :close-on-click-modal="false" width="30%" @close="$refs.formAnswer.resetFields()">
      <el-form :model="addOption" :rules="rules" ref="formAnswer">
        <el-form-item label="题　目" :label-width="formLabelWidth" prop="qid">
          <el-select v-model="addOption.qid" placeholder="请选择" style="width:50%">
            <el-option
              v-for="(item, index) in tableData"
              :key="index"
              :label="item.q_content"
              :value="item.q_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选　项" :label-width="formLabelWidth" prop="content">
          <el-input v-model="addOption.content" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="状　态" :label-width="formLabelWidth">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="addOption.state"
            active-value="active"
            inactive-value="inactive"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOptions = false">取 消</el-button>
        <el-button type="primary" @click="addOptionList">提交</el-button>
      </div>
    </el-dialog>

    <!-- 绑定答案对话框 -->
    <el-dialog :visible.sync="answerList" :close-on-click-modal="false" width="30%" @close="$refs.formBangding.resetFields()">
      <el-form :model="bangding" :rules="rules" ref="formBangding">
        <el-form-item label="选择题目" :label-width="formLabelWidth" prop="title">
          <el-select placeholder="请选择" v-model="bangding.title" @change="gettitle">
            <el-option
              v-for="item in tableData"
              :key="item.q_id"
              :label="item.q_content"
              :value="item.q_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择答案" :label-width="formLabelWidth" prop="answer">
          <el-select v-model="bangding.answer" multiple placeholder="请选择">
            <el-option
              v-for="item in answerData"
              :key="item.o_id"
              :label="item.content"
              :value="item.o_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="answerList = false">取 消</el-button>
        <el-button type="primary" @click="commitAnswer">确 定</el-button>
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
      tableData: [],
      currentPage: 1,
      // 每页默认显示10条
      pageSize: 0,
      total: 0,
      addTopic: false,
      addOptions: false,
      answerList: false,
      formLabelWidth: "80px",
      // 添加的题目
      addanswer: {
        content: "",
        state: "inactive"
      },
      // 添加的选项
      addOption: {
        qid: "",
        content: "",
        state: "active"
      },
      // 展开行
      row: [],
      expandedRows: [],
      // 答案绑定的题目id
      title: [],
      // 答案绑定的选项
      answer: [],
      // 放置答案的数据
      answerData: [],
      // ridio初始值
      type: "全　部",
      radio: "all",
      rules: {
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        qid: [{ required: true, message: "请输入内容", trigger: "blur" }],
        title: [{ required: true, message: "请选择内容", trigger: "blur" }],
        answer: [{ required: true, message: "请选择内容", trigger: "change" }]
      },
      bangding: {
        title: "",
        answer: []
      }
    };
  },

  mounted() {
    this.questionsList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.questionsList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.questionsList();
      console.log(`当前页: ${val}`);
    },

    // radio 选中的事件
    changeRadio(value) {
      if (value == "全　部") {
        this.radio = "all";
        this.questionsList();
      }
      if (value == "已打开") {
        this.radio = "active";
        this.questionsList();
      }
      if (value == "未打开") {
        this.radio = "inactive";
        this.questionsList();
      }
    },

    // 题目列表
    questionsList() {
      this.axios
        .post(`admin/examination/questions-list`, {
          type: this.radio,
          page: this.currentPage
        })
        .then(res => {
          console.log(res);
          // 循环拿到每一项的答案
          res.data.data.data.forEach(item => {
            item.children = [];
          });
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 添加题目
    addAnswerList() {
      this.$refs["formTitle"].validate(valid => {
        if (!valid) return false;
        this.axios
          .post("admin/examination/question-add", this.addanswer)
          .then(res => {
            this.addTopic = false;
            this.questionsList();
            console.log(res);
            this.addanswer = {
              content: "",
              state: "inactive"
            };
          });
      });
    },

    // 删除题目
    delAnswerList(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/examination/question-del", {
              qid: id
            })
            .then(res => {
              console.log(res);
              this.questionsList();
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

    // 题目switch 开关
    changeSwitch(row) {
      if (row.state === "inactive") {
        this.axios
          .post("admin/examination/question-inactivate", {
            qid: row.q_id
          })
          .then(res => {
            this.questionsList();
            console.log(res);
          });
      } else {
        this.axios
          .post("admin/examination/question-activate", {
            qid: row.q_id
          })
          .then(res => {
            this.questionsList();
            console.log(res);
          });
      }
    },

    // 选项列表接口
    getPowerList(row) {
      this.axios
        .post("admin/examination/options-list", {
          qid: row.q_id
        })
        .then(res => {
          // console.log(res);
          const { data } = res.data;
          data.forEach(item => {
            item.isRightAnswer = "false";
            if (row.options_id) {
              row.options_id.forEach(option => {
                if (item.o_id == option) {
                  item.isRightAnswer = "true";
                }
              });
            }
          });
          // console.log(data);
          row.children = data;
          setTimeout(() => {
            this.index++;
          }, 100);
        });
    },

    getLimits(row, expandedRows) {
      // console.log(row, expandedRows);
      console.log(row);
      if (
        // 选项的长度为0的话或者答案的id不等于选项的id
        expandedRows.length == 0 ||
        row.account_id !== expandedRows[expandedRows.length - 1].account_id
      )
        return false;
      // 如果选项的长度大于1
      if (expandedRows.length > 1) {
        this.$refs.refTable.toggleRowExpansion(expandedRows[0]);
      }
      this.row = row;
      this.expandedRows = expandedRows;
      this.getPowerList(row);
    },

    // 添加选项
    addOptionList() {
      this.$refs["formAnswer"].validate(valid => {
        if (!valid) return false;
        this.axios
          .post("admin/examination/option-add", this.addOption)
          .then(res => {
            console.log(res);
            this.questionsList();
            this.addOptions = false;
            this.addOption = {
              qid: "",
              content: "",
              state: "active"
            };
          });
      });
    },

    // 选项删除
    delOptions(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("admin/examination/option-del", { oid: id.o_id })
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

    // 选项switch 开关
    changeSwitchOption(row) {
      if (row.state === "inactive") {
        this.axios
          .post("admin/examination/option-inactivate", {
            oid: row.o_id
          })
          .then(res => {
            console.log(res);
            this.getPowerList();
          });
      } else {
        this.axios
          .post("admin/examination/option-activate", {
            oid: row.o_id
          })
          .then(res => {
            console.log(res);
            this.getPowerList();
          });
      }
    },

    // 答案绑定提交
    commitAnswer() {
      this.$refs["formBangding"].validate(valid => {
        if (!valid) return false;
        this.axios
          .post("admin/examination/binding-answers", {
            qid: this.bangding.title,
            answers: JSON.stringify(this.bangding.answer)
          })
          .then(res => {
            // console.log(this.answer);
            console.log(res);
            this.answerList = false;
            this.questionsList();
            this.bangding.title = "";
            this.bangding.answer = "";
          });
      });
    },

    // 题目的选中事件
    gettitle() {
      this.tableData.forEach(item => {
        if (item.q_id == this.bangding.title) {
          console.log(item);
          this.bangding.answer = item.options_id;
          this.axios
            .post("admin/examination/options-list", { qid: item.q_id })
            .then(res => {
              console.log(res);
              this.answerData = res.data.data;
            });
        }
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
.el-radio-button--medium .el-radio-button__inner {
  font-weight: 700;
}
</style>
