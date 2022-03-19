<template>
  <div class="app-container">
    <h1>关于我</h1>
    <el-input
      v-model.trim="urlInfo.url"
      placeholder="请输入URL"
      :disabled="!isEditable"
    />
    <div style="margin: 20px 0;">
      <el-button type="primary" @click="handleEdit">{{ buttonContent }}</el-button>
    </div>
  </div>
</template>

<script>
import { getAboutURL, setAboutURL } from '@/api/about.js';
import { throttle } from '@/utils/tools.js';
export default {
  data() {
    return {
      // 是否可编辑
      isEditable: false,
      // 输入框内容
      urlInfo: {
        url: ''
      },
      // 按钮的内容
      buttonContent: '编辑'
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAboutURL().then(r => {
        if (r.code === 0) {
          this.urlInfo.url = r.data;
        } else {
          this.$message.error('出了一点小意外：' + r);
        }
      }).catch(e => {
        this.$message.error('请求失败：' + e);
      });
    },
    handleEdit: throttle(function () {
      // 当处于非编辑状态时，点击按钮，则变为编辑状态
      if (!this.isEditable) {
        this.isEditable = true;
        this.buttonContent = '保存';
      } else {
        // 当处于编辑状态时，点击按钮，提交数据，然后变为非编辑状态
        if (this.urlInfo.url) {
          // 仅当url不为空时可以提交数据
          setAboutURL(this.urlInfo).then(r => {
            if (r.code === 0) {
              this.$message.success('设置成功');
              this.buttonContent = '编辑';
              this.isEditable = false;
            } else {
              this.$message.error('出了一点小意外：' + r);
            }
          }).catch(e => {
            this.$message.error('请求失败：' + e);
          });
        } else {
          this.$message.error('请输入URL');
        }
      }
    }, 800)
  }
};
</script>

<style>

</style>
