<template>
  <div class="app-container">
    <h3>项目名称</h3>
    <el-input
      placeholder="请输入项目的名称"
    />
    <h3>项目描述(每项描述以英文逗号分割)</h3>
    <el-input
      type="textarea"
      placeholder="请输入项目的描述，每项描述以英文逗号分割"
    />
    <h3>项目链接</h3>
    <el-input
      placeholder="请输入项目的链接"
    />
    <h3>GitHub 地址</h3>
    <el-input
      placeholder="请输入项目的 GitHub 地址"
    />
    <h3>项目预览图</h3>
    <Upload />
    <h3>项目等级</h3>
    <el-select v-model="value" placeholder="请选择项目等级">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-button type="primary" @click="handleSubmit">发布项目</el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload';
export default {
  components: {
    Upload
  }
};
</script>

<style>

</style>
