<template>
  <div class="app-container">
    <!-- 显示的首页标语表格 -->
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="序号"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标语"
        width="160"
        align="center"
      />
      <el-table-column
        prop="description"
        label="描述"
        align="center"
        width="250"
      />

      <el-table-column
        prop="description"
        label="中图预览"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 60%;"
            :src="scope.row.midImg"
            :fit="'fill'"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="大图预览"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 80%;"
            :src="scope.row.bigImg"
            :fit="'fill'"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="操作"
        align="center"
      >
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改标语的对话框 -->
  </div>
</template>

<script>
import { getBanners } from '@/api/banner.js';
import serverConfig from '@/utils/serverConfig.js';
export default {
  data() {
    return {
      originData: [],
      loading: true
    };
  },
  computed: {
    tableData() {
      // 根据返回的数据，重新处理图片的链接地址
      return this.originData.map((item) => {
        const midImg = serverConfig.serverURL + item.midImg;
        const bigImg = serverConfig.serverURL + item.bigImg;
        return {
          ...item,
          midImg,
          bigImg
        };
      });
    }
  },
  created() {
    this.loading = true;
    getBanners().then(r => {
      this.originData = r.data;
      this.loading = false;
    });
  }
};
</script>

<style>

</style>
