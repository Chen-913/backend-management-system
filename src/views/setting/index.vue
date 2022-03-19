<template>
  <div class="app-container">
    <h1>设置</h1>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="网站信息" name="siteInfo">
        <template slot="title">
          <i class="header-icon el-icon-info" />网站信息
        </template>
        <el-form ref="siteInfo" :model="siteInfo" label-width="auto" class="demo-ruleForm">
          <el-form-item
            label="网站标题"
            prop="siteTitle"
            :rules="[
              { required: true, message: '网站标题不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="siteInfo.siteTitle" type="text" />
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="mail"
            :rules="[
              { required: true, message: '邮箱不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="siteInfo.mail" type="text" />
          </el-form-item>
          <el-form-item
            label="备案号"
            prop="icp"
            :rules="[
              { required: true, message: '备案号不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="siteInfo.icp" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('siteInfo', siteInfo)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="网站头像信息" name="avatar">
        <template slot="title">
          <i class="el-icon-user-solid" />网站头像信息
        </template>
        <Upload v-model="avatar" :after-success="handleAfterSuccess" diy-width="150px" diy-height="150px" />
      </el-collapse-item>
      <el-collapse-item title="网址图标信息" name="faviconInfo">
        <template slot="title">
          <i class="el-icon-s-help" />网址图标信息
        </template>
        <el-form ref="faviconInfo" :model="faviconInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="图标地址"
            prop="favicon"
            :rules="[
              { required: true, message: '网址的图标地址不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="faviconInfo.favicon" type="text" />
          </el-form-item>
          <el-form-item label="网址图标预览" prop="favicon">
            <el-image
              style="width: 100px;height: 100px;"
              :src="faviconInfo.favicon"
              fit="fill"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('faviconInfo', faviconInfo)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="GitHub 信息" name="githubInfo">
        <template slot="title">
          <i class="iconfont icon-github1" />GitHub 信息
        </template>
        <el-form ref="githubInfo" :model="githubInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="GitHub 名字"
            prop="githubName"
            :rules="[
              { required: true, message: 'GitHub 名字不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="githubInfo.githubName" type="text" />
          </el-form-item>
          <el-form-item
            label="GitHub 地址"
            prop="github"
            :rules="[
              { required: true, message: 'GitHub 地址不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="githubInfo.github" type="text" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('githubInfo', githubInfo)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="QQ 信息" name="qqInfo">
        <template slot="title">
          <i class="iconfont icon-QQ" />QQ 信息
        </template>
        <el-form ref="qqInfo" :model="qqInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="QQ 号码"
            prop="qq"
            :rules="[
              { required: true, message: 'QQ 号码不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="qqInfo.qq" type="text" />
          </el-form-item>
          <el-form-item label="二维码预览" prop="qqQrCode">
            <Upload v-model="qqInfo.qqQrCode" :after-success="handleAfterSuccess" diy-width="100px" diy-height="100px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('qqInfo', qqInfo)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="微信信息" name="weixinInfo">
        <template slot="title">
          <i class="iconfont icon-weixin" />微信信息
        </template>
        <el-form ref="weixinInfo" :model="weixinInfo" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="微信号"
            prop="weixin"
            :rules="[
              { required: true, message: '微信号不能为空',trigger:'blur'},
            ]"
          >
            <el-input v-model.trim="weixinInfo.weixin" type="text" />
          </el-form-item>
          <el-form-item label="二维码预览" prop="weixinQrCode">
            <Upload v-model="weixinInfo.weixinQrCode" :after-success="handleAfterSuccess" diy-width="100px" diy-height="100px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('weixinInfo', weixinInfo)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Upload from '@/components/Upload';
import { getSetting, modifySetting } from '@/api/setting.js';
import serverConfig from '@/utils/serverConfig.js';
import { throttle } from '@/utils/tools.js';
export default {
  components: {
    Upload
  },
  data() {
    return {
      // 网站信息
      siteInfo: {
        siteTitle: '',
        mail: '',
        icp: ''
      },
      // 网站头像信息
      avatar: '',
      // 网址图标信息
      faviconInfo: {
        favicon: ''
      },
      // GitHub 信息
      githubInfo: {
        githubName: '',
        github: ''
      },
      // QQ 信息
      qqInfo: {
        qq: '',
        qqQrCode: ''
      },
      // 微信 信息
      weixinInfo: {
        weixin: '',
        weixinQrCode: ''
      },
      // 打开状态的折叠面板
      activeNames: ['siteInfo'],
      // 服务器的基本信息
      serverInfo: Object.freeze(serverConfig)
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 刷新数据
      getSetting().then(r => {
        if (r.code === 0) {
          const { data } = r;
          // 将全局配置回填至对应的表单中
          this.siteInfo.siteTitle = data.siteTitle;
          this.siteInfo.mail = data.mail;
          this.siteInfo.icp = data.icp;
          this.avatar = data.avatar;
          this.faviconInfo.favicon = data.favicon;
          this.githubInfo.githubName = data.githubName;
          this.githubInfo.github = data.github;
          this.qqInfo.qq = data.qq;
          this.qqInfo.qqQrCode = data.qqQrCode;
          this.weixinInfo.weixin = data.weixin;
          this.weixinInfo.weixinQrCode = data.weixinQrCode;
        } else {
          if (typeof r === 'string') {
            r = JSON.parse(r);
          }
          this.$message.error('错误:' + r.msg);
        }
      }).catch(e => {
        this.$message.error('错误:' + e);
      });
    },
    handleChange(val) {
      // console.log(val);
    },
    // 防抖函数
    submitForm: throttle(function (formName, modifyInfo) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过后，向服务器发送请求修改数据
          modifySetting(modifyInfo).then(r => {
            if (r.code === 0) {
              this.$message.success('修改成功');
              this.fetchData();
            } else {
              if (typeof r === 'string') {
                r = JSON.parse(r);
              }
              this.$message.error(r.msg);
            }
          }).catch(e => {
            console.log(e);
            this.$message('错误:' + e);
          });
        } else {
          // 验证未通过
          return false;
        }
      });
    }, 2000),
    handleAfterSuccess(res) {
      // 在图片上传成功后的回调函数
      const avatar = res.data;
      modifySetting({ avatar }).then(r => {
        if (r.code === 0) {
          this.$message.success('修改成功');
        } else {
          if (typeof r === 'string') {
            r = JSON.parse(r);
          }
          this.$message.error('错误:' + r.msg);
        }
      }).catch(e => {
        console.log(e);
        this.$message('错误:' + e);
      });
    }
  }
};
</script>

<style scoped>
@import url("//at.alicdn.com/t/font_3260077_hmu81br9rjo.css");
</style>
