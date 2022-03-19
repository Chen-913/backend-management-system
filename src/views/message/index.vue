<template>
  <div class="app-container">
    <h1>留言板</h1>
    <!-- 留言表格 -->
    <el-table v-loading="loading" border :data="messageList" style="width: 100%">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (pagination.currentPage - 1) * pagination.pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="70" align="center">
        <template slot-scope="scope">
          <el-image style="width: 100%" :src="server.serverURL+scope.row.avatar" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center" width="100" />
      <el-table-column prop="content" label="留言内容" min-width="200" align="center" />
      <el-table-column prop="createDate" label="留言日期" min-width="220" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 评论分页 -->
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
import { getMessages, deleteMessage } from '@/api/message.js';
import { formatDate } from '@/utils/tools.js';
import serverConfig from '@/utils/serverConfig.js';
export default {
  data() {
    return {
      messageList: [],
      // 表格数据加载状态
      loading: true,
      // 服务器的相关URL
      server: Object.freeze(serverConfig),
      // 分页相关的数据
      pagination: {
        // 当前页码
        currentPage: 1,
        // 每页显示的条数
        pageSize: 5,
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
      getMessages(this.pagination.currentPage, this.pagination.pageSize).then(r => {
        this.messageList = r.data.rows;
        this.pagination.total = r.data.total;
        this.loading = false;
      }).catch(e => {
        this.loading = false;
        this.$message.error('发生了错误：' + e);
      });
    },
    formatDate,
    handleDelete(messageInfo) {
      this.$confirm('该操作不可逆，确定删除该留言吗?', '删除留言', {
        type: 'warning'
      }).then(r => {
        deleteMessage(messageInfo.id).then(r => {
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
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.fetchData();
    }
  }
};
</script>

<style>

</style>
