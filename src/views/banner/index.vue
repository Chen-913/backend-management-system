<template>
  <div class="app-container">
    <!-- 显示的首页标语表格 -->
    <el-table
      v-loading="loading"
      border
      :data="originData"
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
            style="max-width: 250px;"
            :src="scope.row.midImg2"
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
            style="max-width: 300px;"
            :src="scope.row.bigImg2"
            :fit="'fill'"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改标语的对话框 -->
    <el-dialog title="修改标语信息" :visible.sync="dialogFormVisible">
      <el-form :model="editInfo">
        <el-form-item label="标语">
          <el-input v-model="editInfo.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editInfo.description" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上传中图">
              <Upload v-model="editInfo.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传大图">
              <Upload v-model="editInfo.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanners, setBanner } from '@/api/banner.js';
import serverConfig from '@/utils/serverConfig.js';
import Upload from '@/components/Upload/';
export default {
  components: {
    Upload
  },
  data() {
    return {
      originData: [],
      loading: true,
      // 是否显示修改对话框
      dialogFormVisible: false,
      // 需要修改的标语的信息
      editInfo: {
        id: '',
        title: '',
        description: '',
        midImg: '',
        bigImg: ''
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      getBanners().then(r => {
        this.originData = r.data;
        // 拿到数据后，重新处理，将原有的图片url存储起来
        this.originData.forEach(item => {
          item.midImg2 = serverConfig.serverURL + item.midImg;
          item.bigImg2 = serverConfig.serverURL + item.bigImg;
        });
        this.loading = false;
      });
    },
    handleEdit(scope) {
      // 将需要修改的标语的信息赋值给修改对话框
      this.editInfo = {
        // id并不需要修改，作用是在提交时分辨哪个是更新项
        id: scope.row.id,
        title: scope.row.title,
        description: scope.row.description,
        midImg: scope.row.midImg,
        bigImg: scope.row.bigImg
      };
      // 显示修改对话框
      this.dialogFormVisible = true;
    },
    handleEditConfirm() {
      // 生成一个已经被修改并且需要发送给服务器的数据格式
      const arr = this.originData.map((item) => {
        if (item.id === this.editInfo.id) {
          return {
            title: this.editInfo.title,
            description: this.editInfo.description,
            midImg: this.editInfo.midImg,
            bigImg: this.editInfo.bigImg
          };
        } else {
          return {
            midImg: item.midImg,
            bigImg: item.bigImg,
            title: item.title,
            description: item.description
          };
        }
      });
      // 发送给服务器
      setBanner(arr).then(r => {
        this.$message.success('修改成功');
        this.dialogFormVisible = false;
        // 更新表格界面的数据
        this.fetchData();
      });
    }
  }
};
</script>

<style>

</style>
