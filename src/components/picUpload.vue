<template>
  <div>
    <el-upload
      class="upload"
      action
      :show-file-list="false"
      :http-request="uploadHttp"
      :before-upload="beforeAvatarUpload"
      list-type="picture-card"
    >
      <img v-if="img" :src="img" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
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
      img: ""
    };
  },
  mounted() {},
  methods: {
    // 上传图片
    init() {
      this.axios.get("url").then(res => {
        console.log(res);
        const {
          Region,
          AccessKeyId,
          AccessKeySecret,
          Bucket,
          endpoint
        } = res.data.data.data;
        this.uploadConf.region = "oss-cn-zhangjiakou";
        this.uploadConf.bucket = "yuiapp";
        this.uploadConf.endpoint = "oss-cn-zhangjiakou.aliyuncs.com";
        this.uploadConf.accessKeyId = "LTAIgOW7St6ZXMBv";
        this.uploadConf.accessKeySecret = "jTPHZACycbVjH5C1byqWpcnntYyo7b";
      });
    },

    /**
     * 阿里云OSS上传
     */
    uploadHttp({ file }) {
      console.log(file);
      const fileName = `uploadtest/${Math.ceil(
        Math.random() * 99999999
      )}${Date.parse(new Date())}`; //定义唯一的文件名
      ossClient(this.uploadConf)
        .put(fileName, file, { ContentType: "image/jpeg" })
        .then(({ res, url, name }) => {
          if (res && res.status == 200) {
            this.$emit("uploadUrl", url, name);
            this.img = url;
            console.log(`阿里云OSS上传图片成功回调`, res);
            // console.log(url);
            this.img = url;
            // console.log(name);
          }
        })
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err);
        });
    },

    /* 图片限制 */
    beforeAvatarUpload(file) {
      console.log(file);
      const nameArr = file.name.split(".");
      const isJPEG = nameArr[nameArr.length - 1] === "jpeg";
      const isJPG = nameArr[nameArr.length - 1] === "jpg";
      const isPNG = nameArr[nameArr.length - 1] === "png";
      const isLt500K = file.size / 1024 / 500 < 2;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过 500KB!");
      }
      return (isJPEG || isJPG || isPNG) && isLt500K;
    },

    /* 移除图片 */
    handleRemove(file, fileList) {
      console.log(`移除图片回调`, fileList);
    },
    clearPic() {
      return (this.img = "");
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
</style>