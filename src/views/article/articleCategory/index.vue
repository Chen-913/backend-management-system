<template>
  <div class="app-container">
    <!-- 输入框 -->
    <el-input
      v-model.trim="categoryName"
      placeholder="请输入分类名称，左侧选择优先级"
      class="input-with-select"
      style="width: 20%;min-width: 350px; margin-right: 20px;"
    >
      <el-select slot="prepend" v-model="level" placeholder="请选择">
        <el-option
          v-for="item in orderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-input>
    <el-button type="primary" @click="handleAdd">添加</el-button>

    <!-- 文章分类列表 -->
    <el-table v-loading="loading" border :data="categoryList" style="width: 100%;margin-top: 20px;">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
          <!-- 有多页的情况下使用下面的计算方式 -->
          <!-- {{ scope.$index + (pagination.currentPage - 1) * pagination.pageSize + 1 }} -->
        </template>
      </el-table-column>
      <el-table-column prop="name" label="博客类别" align="center" />
      <el-table-column prop="articleCount" label="文章数量" align="center" />
      <el-table-column label="操作" align="center" min-width="130">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改文章分类的对话框 -->
    <el-dialog title="修改分类信息" :visible.sync="dialogFormVisible">
      <el-form :model="editInfo">
        <el-form-item label="分类名称">
          <el-input v-model.trim="editInfo.name" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="editInfo.order" placeholder="请选择">
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBlogCategory, getCategory, deleteBlogCategory, getBlogCategory, modifyCategory } from '@/api/blogCategory.js';
export default {
  data() {
    return {
      // 文章分类列表
      categoryList: [],
      // 文章分类名称
      categoryName: '',
      // 分类的优先级
      level: '1',
      // 是否正在加载数据
      loading: false,
      // 修改对话框是否显示
      dialogFormVisible: false,
      // 可编辑的分类信息
      editInfo: {
        name: '',
        order: '',
        id: ''
      },
      // 可选的优先级
      orderOptions: [
        {
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 3,
          label: '3'
        },
        {
          value: 4,
          label: '4'
        },
        {
          value: 5,
          label: '5'
        }]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      getBlogCategory().then(r => {
        this.categoryList = r.data;
        this.loading = false;
      });
    },
    handleEdit(categoryInfo) {
      this.dialogFormVisible = true;
      // 获取相关分类的信息，并回填到表单中
      getCategory(categoryInfo.id).then(r => {
        this.editInfo = r.data;
      });
    },
    handleDelete(categoryInfo) {
      this.$confirm('此操作不可逆,确定要删除该分类吗？', '删除分类', {
        type: 'warning'
      }).then(r => {
        deleteBlogCategory(categoryInfo.id).then(r => {
          if (r.code || r.code === 0) {
            this.$message.success(`删除成功, ${r.data} 篇文章受影响`);
            this.fetchData();
          } else {
            if (typeof r === 'string') {
              r = JSON.parse(r);
            }
            // 添加失败
            this.$message.error(r.msg);
          }
        });
      }).catch(r => {
        // 取消时触发
        this.$message.info('取消删除');
      });
    },
    handleAdd() {
      if (this.categoryName === '') {
        this.$message.error('请输入分类名称');
      } else {
        const categoryInfo = {
          name: this.categoryName,
          order: this.level
        };
        addBlogCategory(categoryInfo).then(r => {
          if (r.code === 0) {
            this.$message.success('添加成功');
            // 恢复优先级选项以及输入框
            this.categoryName = '';
            this.level = '1';
            // 重新请求数据刷新页面
            this.fetchData();
          } else {
            if (typeof r === 'string') {
              r = JSON.parse(r);
            }
            // 添加失败
            this.$message.error(r.msg);
          }
        });
      }
    },
    handleEditConfirm() {
      if (this.editInfo.name.length === 0) {
        this.$message.error('分类名称不能为空');
      } else {
        const latestInfo = {
          name: this.editInfo.name,
          order: this.editInfo.order
        };
        modifyCategory(this.editInfo.id, latestInfo).then(r => {
          this.$message.success('修改成功');
          this.dialogFormVisible = false;
          this.fetchData();
        }).catch(r => {
          if (typeof r === 'string') {
            r = JSON.parse(r);
          }
          this.$message.error(r.msg);
        });
      }
    }
  }
};
</script>

<style>

</style>
