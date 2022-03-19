<template>
  <div class="app-container">
    <h3>项目名称</h3>
    <el-input
      v-model="projectForm.name"
      placeholder="请输入项目的名称"
    />
    <h3>项目描述(每项描述以英文逗号分割)</h3>
    <el-input
      v-model="projectForm.description"
      type="textarea"
      show-word-limit
      maxlength="200"
      :autosize="{ minRows: 1, maxRows: 10 }"
      placeholder="请输入项目的描述，每项描述以英文逗号分割"
    />
    <h3>项目链接</h3>
    <el-input
      v-model="projectForm.url"
      placeholder="请输入项目的链接"
    />
    <h3>GitHub 地址</h3>
    <el-input
      v-model="projectForm.github"
      placeholder="请输入项目的 GitHub 地址"
    />
    <h3>项目预览图</h3>
    <Upload v-model="projectForm.thumb" />
    <h3>项目等级</h3>
    <el-select v-model="projectForm.order" placeholder="请选择项目等级">
      <el-option
        v-for="item in projectLevel"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div style="margin: 20px 0;">
      <el-button type="primary" @click="handleSubmit">发布项目</el-button>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload';
import { addProject } from '@/api/project.js';
export default {
  components: {
    Upload
  },
  data() {
    return {
      // 需要提交的相关数据
      projectForm: {
        description: '',
        name: '',
        url: '',
        github: '',
        thumb: '',
        order: 1
      },
      // 可选的项目等级
      projectLevel: [
        {
          value: 1,
          label: '一级项目'
        },
        {
          value: 2,
          label: '二级项目'
        },
        {
          value: 3,
          label: '三级项目'
        },
        {
          value: 4,
          label: '四级项目'
        },
        {
          value: 5,
          label: '五级项目'
        }]
    };
  },
  methods: {
    handleSubmit() {
      if (this.projectForm.name && this.projectForm.description && this.projectForm.url && this.projectForm.github) {
        const submitInfo = {
          ...this.projectForm,
          description: this.projectForm.description.split(',')
        };
        addProject(submitInfo).then(r => {
          if (r.code === 0) {
            this.$message.success('添加成功');
            this.$router.push({ name: 'ProjectList' });
          } else {
            this.$message.error('检查项目描述是否用英文逗号分割');
          }
        }).catch(e => {
          this.$message.error(e);
        });
      } else {
        this.message.warning('部分信息未填写完整');
      }
    }
  }
};
</script>

<style>

</style>
