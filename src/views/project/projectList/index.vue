<template>
  <div class="app-container">
    <!-- 项目数据显示表格 -->
    <el-table
      :data="projectList"
      border
      style="width: 100%"
      :header-cell-style="{textAlign:'center'}"
    >
      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="项目名称"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" class="projectName">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="项目描述"
        min-width="250px"
      >
        <template slot-scope="scope">
          <ul v-if="scope.row.description">
            <li v-for="(item,index) in scope.row.description" :key="index">{{ item }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="预览图"
        min-width="180px"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px;"
            :src="serverConfig.serverURL + scope.row.thumb"
            fit="fill"
            :preview-src-list="previewImgList"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="GitHub" placement="top">
            <el-button type="info" icon="iconfont icon-github" circle @click="handleGitHub(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改项目信息对话框 -->
    <el-dialog
      title="修改项目信息"
      fullscreen
      :modal="false"
      :visible.sync="dialogVisible"
    >
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
        <el-button type="primary" @click="handleSubmit">修改项目</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjects, deleteProject, modifyProject } from '@/api/project.js';
import serverConfig from '@/utils/serverConfig.js';
import Upload from '@/components/Upload';
export default {
  components: {
    Upload
  },
  data() {
    return {
      // 项目列表数据
      projectList: [],
      // 服务器地址
      serverConfig: Object.freeze(serverConfig),
      // <el-image/>图片预览功能
      previewImgList: [],
      // 修改对话框是否可见
      dialogVisible: false,
      // 修改对话框的相关数据
      projectForm: {
        name: '',
        description: '',
        url: '',
        github: '',
        thumb: '',
        order: 1
      },
      // 可选的项目优先级
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
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getProjects().then(r => {
        if (r.code === 0) {
          this.projectList = r.data;
          r.data.forEach((item, index) => {
            this.previewImgList[index] = serverConfig.serverURL + item.thumb;
          });
        }
      }).catch(e => {
        this.$message.error(e);
      });
    },
    handleGitHub(projectInfo) {
      // 点击github按钮，跳转至github地址
      window.open(projectInfo.url);
    },
    handleEdit(projectInfo) {
      this.projectForm = {
        ...projectInfo,
        description: projectInfo.description.join(''),
        thumb: projectInfo.thumb,
        id: projectInfo.id
      };
      this.dialogVisible = true;
    },
    handleDelete(projectInfo) {
      this.$confirm('此操作不可逆，确定要删除这个项目吗？', '删除项目', {
        type: 'warning'
      }).then(r => {
        // 删除项目
        deleteProject(projectInfo.id).then(r => {
          if (r.code === 0) {
            this.$message.success('删除成功');
            this.fetchData();
          }
        }).catch(e => {
          this.$message.error(e);
        });
      }).catch(e => {
        this.$message.info('取消删除');
      });
    },
    handleSubmit() {
      if (this.projectForm.name && this.projectForm.description && this.projectForm.url && this.projectForm.github) {
        const submitInfo = {
          ...this.projectForm,
          description: this.projectForm.description.split(',')
        };
        modifyProject(this.projectForm.id, submitInfo).then(r => {
          if (r.code === 0) {
            this.$message.success('修改成功');
            this.dialogVisible = false;
            this.fetchData();
          } else {
            this.$message.error('好像出了点问题，请稍后再试：' + r);
          }
        });
      } else {
        this.$message.warning('部分信息未填写完整');
      }
    }
  }
};
</script>

<style scoped>
@import url("//at.alicdn.com/t/font_3260077_hmu81br9rjo.css");
.projectName:hover{
	color: rgb(66, 199, 199);
}
</style>
