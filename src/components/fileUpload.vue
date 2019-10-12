<template>
  <div>
    <el-upload
      class="upload"
      action
      :file-list="fileList"
      :on-remove="handleRemove"
      :http-request="uploadHttp"
      :before-remove="beforeRemove"
    >
      <el-button size="medium" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import ossClient from "../methods/aliyun.oss.client";
export default {
  name: "picUpload",
  data() {
    return {
      uploadConf: {
        region: "oss-cn-zhangjiakou",
        bucket: "yuiapp",
        endpoint: "oss-cn-zhangjiakou.aliyuncs.com",
        accessKeyId: "LTAIgOW7St6ZXMBv",
        accessKeySecret: "jTPHZACycbVjH5C1byqWpcnntYyo7b"
      },
      fileList: []
    };
  },
  methods: {
    /**
     * 阿里云OSS上传
     */
    uploadHttp({ file }) {
      console.log(file);
      const fileName = `packages/android/${file.name}`; //文件名
      ossClient(this.uploadConf)
        .put(fileName, file, { ContentType: "*" })
        .then(({ res, url, name }) => {
          console.log(res, url, name);
          if (res && res.status == 200) {
            this.$emit("uploadUrl", url, name);
            this.fileList.push({ name: name, url: url });
          }
        });
    },

    /* 移除图片 */
    handleRemove(file, fileList) {
      console.log(file);
      ossClient(this.uploadConf)
        .delete(file.name)
        .then(res => {
          console.log(res);
          this.fileList = this.fileList.filter(item => item.name !== file.name);
        });
    },
    clearFile() {
      return (this.fileList = []);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
div >>> .el-upload-list__item .el-icon-close-tip {
  opacity: 0;
}
</style>
