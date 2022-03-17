<template>
  <div class="app-container">
    <h1>文章列表</h1>
    <!-- 文章表格 -->
    <el-table v-loading="loading" border :data="blogList" style="width: 100%">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (pagination.currentPage - 1) * pagination.pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章名称" min-width="160" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="博客图片预览" width="200" trigger="hover">
            <el-image style="width: 100%" :src="server.serverURL+scope.row.thumb" fit="fill" :preview-src-list="previewImageList" />
            <a slot="reference" href="#" @click.prevent="handleJumpArticle(scope.row)">{{ scope.row.title }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="文章描述" align="center" width="250" />
      <el-table-column prop="scanNumber" label="浏览数" width="90" align="center" />
      <el-table-column prop="commentNumber" label="评论量" width="90" align="center" />
      <el-table-column prop="category.name" label="所属分类" width="90" align="center" />
      <el-table-column prop="createDate" label="创建日期" min-width="220" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="操作" align="center" min-width="130">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 文章分页 -->
    <el-pagination
      style="margin-top: 25px;"
      background
      :current-page.sync="pagination.currentPage"
      :page-size.sync="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, total, ->, sizes, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />
  </div>
</template>

<script>
import { getBlogs, deleteBlog } from '@/api/blog.js';
import { formatDate } from '@/utils/tools.js';
import serverConfig from '@/utils/serverConfig.js';
export default {
  data() {
    return {
      blogList: [],
      // 表格数据加载状态
      loading: true,
      // 服务器的相关URL
      server: Object.freeze(serverConfig),
      // 预览图片的数组，这是 <el-image> 组件的一个属性
      previewImageList: [],
      // 分页相关的数据
      pagination: {
        // 当前页码
        currentPage: 1,
        // 每页显示的条数
        pageSize: 10,
        // 总条数
        total: 0,
        // 总页数
        totalPage: 0
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 获取数据
      this.loading = true;
      getBlogs(this.pagination.currentPage, this.pagination.pageSize).then(r => {
        this.blogList = r.data.rows;
        this.pagination.total = r.data.total;
        // 拿到表格数据后，将每篇文章的缩略图的url添加到预览数组previewImageList中
        this.blogList.forEach((item, index) => {
          this.previewImageList[index] = this.server.serverURL + item.thumb;
        });
        this.loading = false;
      });
    },
    formatDate,
    handleDelete(articleInfo) {
      this.$confirm('删除文章会同时删除评论且操作不可逆，确定继续吗?', '删除文章', {
        type: 'warning'
      }).then(r => {
        deleteBlog(articleInfo.id).then(r => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.fetchData();
        }).catch(err => {
          this.$message({
            type: 'error',
            message: `删除失败：${err}`
          });
        });
      }).catch(_ => {
        // 取消删除时，会执行到这里
        this.$message({
          type: 'info',
          message: '取消删除'
        });
      });
    },
    handleJumpArticle(articleInfo) {
      // 点击文章的名称之后，挑战至文章详情页
      window.open(`${this.server.serverURL}/article/${articleInfo.id}`);
    },
    handleCurrentChange(currentPage) {
      // 当前页发生变化时触发
      this.pagination.currentPage = currentPage;
      this.fetchData();
    },
    handlePrevClick() {
      // 点击上一页时触发
      this.pagination.currentPage--;
    },
    handleNextClick() {
      // 点击下一页时触发
      this.pagination.currentPage++;
    },
    handleSizeChange(pageSize) {
      // 每页显示条数发生变化时触发
      this.pagination.pageSize = pageSize;
      this.fetchData();
    }
  }
};
</script>

<style>

</style>
