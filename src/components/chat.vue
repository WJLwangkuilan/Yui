<template>
  <div style="width: 80%;height: 700px;margin: auto">
    <div id="chat" class="clearfix">
      <!-- chat-aside -->
      <div class="chat-aside">
        <ul>
          <li
            v-for="(item, index) in stat.conversationList"
            :key="item.targetId"
            :class="{active: item.active}"
            @click="changeUser(item,index)"
          >
            {{item.targetUserName}}
            <span v-if="item.unreadMessageCount">{{item.unreadMessageCount}}</span>
          </li>
        </ul>
      </div>
      <!-- chat-aside -->

      <div class="chat">
        <!--header-->
        <header class="header">
          <span class="title">{{stat.currentUserInfo.name}}</span>
        </header>
        <!--header-->

        <!--chat-content-->
        <div class="chat-content">
          <div class="message-wrapper">
            <div
              class="message-item"
              v-for="(msg,index) in stat.messageList"
              :key="index"
              :class="[msg.messageDirection == 1 ? 'my-msg' : 'your-msg']"
            >
              <div class="message-text">
                <div class="rong-avatar">
                  <img
                    v-if="msg.messageDirection == 1"
                    :src="stat.currentUserInfo.icon"
                    class="rong-avatar-bd"
                  />
                  <img v-else :src="stat.targetUserInfo.icon" class="rong-avatar-bd" />
                </div>
                <div class="message-body">
                  <pre
                    class="user-msg"
                    v-if="msg.content.messageName == 'TextMessage'"
                    v-html="msg.content.content"
                  >{{msg.content.content}}</pre>
                  <img
                    class="image-message"
                    :src="`data:image/jpeg;base64,${msg.content.content}`"
                    alt="image"
                    v-if="msg.content.messageName == 'ImageMessage'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--chat-content-->

        <div class="chat-operation">
          <div>
            <el-upload
              class="upload-demo"
              action
              :show-file-list="false"
              :http-request="uploadHttp"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="expression">
            表情
            <div v-html="emoji" id="emoji"></div>
          </div>
        </div>
        <!--footer-->
        <footer class="footer">
          <div class="message-wrap">
            <textarea
              v-model="stat.sendMsgVal"
              @keydown.enter="sendMsg()"
              id="message-content"
              ref="textareaValue"
              placeholder="请输入文字..."
              class="message-content"
            ></textarea>
          </div>
          <span class="send-btn" @click="sendMsg">发送</span>
        </footer>
        <!--footer-->
      </div>
    </div>
  </div>
</template>

<script>
import init from "@/assets/rongyun/init";
import emoji from "@/assets/rongyun/emoji";
import ossClient from "../methods/aliyun.oss.client";
export default {
  data() {
    return {
      images: [],
      emoji: "",
      uploadConf: {
        region: "oss-cn-zhangjiakou",
        bucket: "yuiapp",
        endpoint: "oss-cn-zhangjiakou.aliyuncs.com",
        accessKeyId: "LTAIgOW7St6ZXMBv",
        accessKeySecret: "jTPHZACycbVjH5C1byqWpcnntYyo7b"
      },
      instance: "",
      stat: {
        currentView: "chat",
        currentUserInfo: {
          id: "user1",
          name: "客服",
          icon:
            "http://himg.bdimg.com/sys/portrait/item/98fbe9b8a3e89d895745491c12.jpg?cdnversion=0741"
        },
        targetUserInfo: {
          id: "user2",
          name: "开发",
          icon: "https://www.rongcloud.cn/docs/assets/img/index/logo.png"
        },
        conversationList: [], // 会话列表
        chooseUser: [], // 选中的user
        messageList: [], // 历史记录
        targetId: "",
        sendMsgVal: ""
      }
    };
  },

  mounted() {
    // 初始化表情
    this.emoji = emoji;
    setTimeout(() => {
      this.getConversationList();
      const userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // console.log(userInfo)
      this.stat.currentUserInfo.id = userInfo.aid;
      this.stat.currentUserInfo.name = userInfo.nickname;
      this.stat.currentUserInfo.icon = userInfo.iconurl;
    }, 500);
  },

  methods: {
    // 阿里云OSS上传
    uploadHttp({ file }) {
      // 阿里云上传
      const fileName = `im_log/${Math.ceil(
        Math.random() * 99999999
      )}${Date.parse(new Date())}`; //定义唯一的文件名
      ossClient(this.uploadConf)
        .put(fileName, file, { ContentType: "image/jpeg" })
        .then(({ res, url, name }) => {
          if (res && res.status == 200) {
            console.log(`阿里云OSS上传图片成功回调`, res);
            this.img = url;
          }
        })
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err);
        });

      var that = this;
      // 转成base64
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function() {
        // 创建canvas
        var canvas = document.createElement("canvas");
        // 获取img标签实例
        var image = new Image();
        // 给img标签设置src
        image.src = this.result;
        image.onload = function() {
          var cw = image.width;
          var ch = image.height;
          var w = image.width;
          var h = image.height;
          canvas.width = w;
          canvas.height = h;
          if (cw > 400 && cw > ch) {
            w = 400;
            h = (400 * ch) / cw;
            canvas.width = w;
            canvas.height = h;
          }
          if (ch > 400 && ch > cw) {
            h = 400;
            w = (400 * cw) / ch;
            canvas.width = w;
            canvas.height = h;
          }
          canvas.getContext("2d").drawImage(image, 0, 0, w, h);
          var url = canvas.toDataURL("image/jpeg", 0.7);
          console.log(url);
          var base64Str = url.slice(url.indexOf("base64") + 7); // base64字符串
          that.imUploadPic(base64Str, fileName);
        };
      };
    },

    // 点击发送图片
    imUploadPic(base64Str, fileName) {
      var that = this;
      // 融云上传
      // var base64Str = this.result; // base64字符串
      // var base64Str = this.result.slice(this.result.indexOf("base64,") + 7);
      var imageUri =
        "http://yuiapp.oss-cn-zhangjiakou.aliyuncs.com/" + fileName; // 上传到自己服务器的 URL。
      console.log(imageUri);
      var msg = new RongIMLib.ImageMessage({
        content: base64Str,
        imageUri: imageUri
      });
      var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的会话类型即可
      // var conversationType = RongIMLib.ConversationType.CUSTOMER_SERVICE; // 单聊, 其他会话选择相应的会话类型即可
      var targetId = that.targetId; // 目标 Id
      // console.log(targetId)
      // var targetId = "yui_89964446c15661835d1103714bbff149"; // 目标 Id
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function(message) {
          console.log(message);
          // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          console.log("Send successfully");
          that.stat.messageList.push(message);
          that.$nextTick(that.scrollEnd);
        }
      });
    },

    // 发送图片的限制
    beforeAvatarUpload(file) {
      console.log(file);
      const nameArr = file.name.split(".");
      const isJPEG = nameArr[nameArr.length - 1] === "jpeg";
      const isJPG = nameArr[nameArr.length - 1] === "jpg";
      const isPNG = nameArr[nameArr.length - 1] === "png";
      const isLt500K = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过 5M!");
      }
      return (isJPEG || isJPG || isPNG) && isLt500K;
    },

    /* 移除图片 */
    handleRemove(file, fileList) {
      console.log(`移除图片回调`, fileList);
    },

    // 获取会话列表
    getConversationList() {
      var _this = this;
      RongIMClient.getInstance().getConversationList(
        {
          onSuccess: function(list) {
            // list => 会话列表集合
            console.log(list);
            // return;
            list.forEach((item, index) => {
              // 根据id获取用户信息
              _this.getUserInfoById(item);
              // RongIMClient.getInstance().clearConversations({
              //   onSuccess: function() {
              //     // 清除会话成功
              //     console.log("删除会话成功");
              //   },
              //   onError: function(error) {
              //     // error => 清除会话错误码
              //     console.log(error);
              //   }
              // });
              if (index == 0) {
                item.active = true;
              } else {
                item.active = false;
              }
            });
            _this.stat.conversationList = list;
            if (list.length) {
              _this.targetId = list[0].targetId;
              setTimeout(function() {
                _this.stat.targetUserInfo.id = list[0].targetUserId;
                _this.stat.targetUserInfo.name = list[0].targetUserName;
                _this.stat.targetUserInfo.icon = list[0].targetPortraitUri;
              }, 200);
              _this.getHistoryMessages(); // 获取历史记录
            }
          },
          onError: function(error) {}
        },
        null
      );
    },

    // 获取历史信息
    getHistoryMessages() {
      const _this = this;
      //传入实例参数  获取历史消息
      var conversationType = RongIMLib.ConversationType.PRIVATE;
      // var conversationType = RongIMLib.ConversationType.CUSTOMER_SERVICE;
      var targetId = this.targetId;
      RongIMClient.getInstance().getHistoryMessages(
        conversationType,
        targetId,
        0,
        20,
        {
          onSuccess(list, hasMsg) {
            // 清除此消息的未读数量
            _this.removeNoReady();
            list.forEach(item => {
              item.content.content = RongIMLib.RongIMEmoji.emojiToHTML(
                item.content.content
              );
            });
            //渲染会话列表
            _this.stat.messageList = list;
            _this.$nextTick(_this.scrollEnd);
          }
        },
        null
      );
    },

    // 根据会话列表选择不同的角色
    changeUser(user, index) {
      console.log(user);
      if (user.targetId == this.targetId) return false;
      this.stat.conversationList.forEach(item => {
        item.active = false;
      });
      this.stat.targetUserInfo.id = user.targetUserId;
      this.stat.targetUserInfo.name = user.targetUserName;
      this.stat.targetUserInfo.icon = user.targetPortraitUri;
      this.targetId = user.targetId;
      user.active = true;
      this.getHistoryMessages();
    },

    // 发送信息
    sendMsg() {
      this.stat.sendMsgVal = this.$refs.textareaValue.value;
      var text = RongIMLib.RongIMEmoji.symbolToEmoji(this.stat.sendMsgVal);
      if (!text) {
        return false;
      }
      var user = {
        id: 123,
        name: 123,
        icon: 123
      };
      var msg = new RongIMLib.TextMessage({
        content: text,
        user: user,
        extra: "附加信息"
      });
      var conversationType = RongIMLib.ConversationType.PRIVATE; // 私聊
      // var conversationType = RongIMLib.ConversationType.CUSTOMER_SERVICE; // 私聊
      // var targetId = "yui_89964446c15661835d1103714bbff149"; // 目标 Id

      var targetId = "ana_7cba908076ee1938dc37df1ddc46682a"; // 目标 Id
      // var targetId = this.targetId; // 目标 Id
      // console.log(targetId)
      var that = this;
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        // 发送消息成功
        onSuccess: function(message) {
          message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(
            message.content.content
          );
          that.stat.sendMsgVal = "";
          that.stat.messageList.push(message);
          that.$nextTick(that.scrollEnd);
        }
      });
    },

    scrollEnd: function() {
      //添加完消息 跳转到最后一条
      var list = document.querySelectorAll(".message-item");
      if (list.length > 1) {
        var last = list[list.length - 1];
        last.scrollIntoView();
      }
    },

    // 清除未读消息数
    removeNoReady() {
      var conversationType = RongIMLib.ConversationType.PRIVATE;
      // var conversationType = RongIMLib.ConversationType.CUSTOMER_SERVICE;
      var targetId = this.targetId;
      RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
        onSuccess: function() {
          // 清除未读消息成功
          console.log(`清除${targetId}的未读消息`);
        },
        onError: function(error) {
          // error => 清除未读消息数错误码
        }
      });
    },

    // 获取用户列表信息
    getUserInfoById(user) {
      this.axios
        .post("admin/im/get-userinfo", { uid: user.targetId })
        .then(res => {
          console.log(res);
          user.targetUserId = res.data.data.userid;
          user.targetUserName = res.data.data.nickname;
          user.targetPortraitUri = res.data.data.profile_image_url;
          // console.log(user);
        });
    }
  }
};
</script>

<style scoped>
@import "../assets/chat.css";
</style>
