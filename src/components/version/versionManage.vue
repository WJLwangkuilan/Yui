<template>
  <el-card class="box-card">
    <el-row class="top">
      <el-col :span="24">
        <el-radio-group v-model="type" fill="#545C64" @change="changeRadio">
          <el-radio-button label="ios"></el-radio-button>
          <el-radio-button label="android" font-size="20px"></el-radio-button>
        </el-radio-group>
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="dialogFormVisible = true"
        >添加</el-button>
        <el-button type="warning" size="medium" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row class="center">
      <el-col :span="24">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%; max-height: 100%"
          height="1000"
        >
          <el-table-column label="#" type="index" align="center"></el-table-column>
          <el-table-column prop="view_version" label="版　　本" align="center"></el-table-column>
          <el-table-column prop="system" label="系　　统" align="center"></el-table-column>
          <el-table-column prop="download_address" label="版本地址" align="center"></el-table-column>
          <el-table-column prop="version_intro" label="版本信息" align="center"></el-table-column>
          <el-table-column prop="update_type_str" label="文字信息" align="center"></el-table-column>
          <el-table-column prop="state_str" label="版本可用状态" align="center"></el-table-column>
          <el-table-column prop="created_at" label="版本记录时间" align="center"></el-table-column>
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
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="30%"
      @close="$refs.formName.resetFields()"
    >
      <el-form :model="addSersion" :rules="rules" ref="formName">
        <el-form-item label="版本类型" :label-width="formLabelWidth" prop="system_type">
          <el-select v-model="addSersion.system_type" placeholder="请选择类型" style="width:50%">
            <el-option
              v-for="(item, index) in systemType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统版本" :label-width="formLabelWidth" prop="view_version">
          <el-input v-model="addSersion.view_version" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="更新类型" :label-width="formLabelWidth" prop="update_type">
          <el-select v-model="addSersion.update_type" placeholder="请选择类型" style="width:50%">
            <el-option
              v-for="(item, index) in updateType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本介绍" :label-width="formLabelWidth" prop="version_intro">
          <el-input v-model="addSersion.version_intro" autocomplete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="版本地址" :label-width="formLabelWidth" prop="download_addr">
          <file-upload @uploadUrl="getUploadUrl" ref="fileupload"></file-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSersionForm">提交</el-button>
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
import fileUpload from "../fileUpload";
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      tableData: [],
      type: "ios",
      // 初始页
      currentPage: 1,
      // 每页默认显示多少条
      pageSize: 0,
      // 总共多少条
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      addSersion: {
        system_type: "",
        view_version: "",
        download_addr: "",
        update_type: "",
        version_intro: ""
      },
      //   系统类型
      systemType: [
        { value: "ios", label: "ios" },
        { value: "android", label: "android" }
      ],
      //   更新类型
      updateType: [
        { value: "mandatory", label: "强制" },
        { value: "optional", label: "可选" }
      ],
      rules: {
        system_type: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        view_version: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        download_addr: [
          { required: true, message: "请上传地址", trigger: "blur" }
        ],
        update_type: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        version_intro: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      }
    };
  },

  mounted() {
    this.versionList();
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.versionList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.versionList();
      // console.log(`当前页: ${val}`);
    },

    // 版本列表
    versionList() {
      this.axios
        .post(`admin/version/version-list`, {
          system_type: this.type,
          page: this.currentPage
        })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.per_page = res.data.data.per_page;
        });
    },

    // 添加图片
    getUploadUrl(url, name) {
      // console.log(url)
      // console.log(name)
      this.addSersion.download_addr = `http://app.yuisource.tech/${name}`;
      // console.log(this.addboard.logo);
    },

    // 版本的添加
    addSersionForm() {
      this.$refs["formName"].validate(valid => {
        if (!valid) return false;
        this.axios
          .post("admin/version/new-version", this.addSersion)
          .then(res => {
            if (res.data.code == 10220) {
              return this.$message.success(res.data.msg);
            }
            console.log(res);
            this.versionList();
            this.dialogFormVisible = false;
            this.addSersion = {
              system_type: "",
              view_version: "",
              download_addr: "",
              update_type: "",
              version_intro: ""
            };
            this.$refs.fileupload.clearFile();
          });
      });
    },

    changeRadio() {
      this.versionList();
    },

    // 开关切换
    changeSwitch(row) {
      // console.log(row);
      let state = "";
      if (row.state == "active") {
        state = "on";
      } else {
        state = "off";
      }
      this.axios
        .post("admin/version/switch", { rid: row.r_id, switch: state })
        .then(res => {
          this.versionList();
          // console.log(res);
        });
    },

    // 刷新数据
    refresh() {
      this.axios.get("admin/version/cache").then(res => {
        console.log(res);
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
}
div >>> .el-radio-button__inner {
  font-weight: 700;
}
</style>
