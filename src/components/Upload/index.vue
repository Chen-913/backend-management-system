<template>
  <div class="upload-container">
    <h3 v-if="title.length!=0">{{ title }}</h3>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value.length!=0" :src="imgURL" :style="{width:diyWidth, height:diyHeight}" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js';
import serverConfig from '@/utils/serverConfig.js';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    diyWidth: {
      type: String,
      default: '250px'
    },
    diyHeight: {
      type: String,
      default: '178px'
    },
    // 给外部提供上传成功后的回调函数
    afterSuccess: {
      type: Function,
      default: (res) => {}
    }
  },
  computed: {
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      };
    },
    imgURL() {
      return serverConfig.serverURL + this.value;
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      this.$emit('input', res.data);
      this.afterSuccess(res);
    }
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
		width: auto;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    display: block;
  }
</style>
