<template>
  <div class="app-container">
    <h1>个人中心</h1>
    <el-form
      ref="formData"
      :model="formData"
      label-width="100px"
      class="demo-ruleForm"
      style="max-width: 700px;"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formData.name" disabled />
      </el-form-item>
      <el-form-item
        label="旧密码"
        prop="oldLoginPwd"
        :rules="[
          { required: true, message: '旧密码不能为空',trigger:'blur'},
        ]"
      >
        <el-input v-model="formData.oldLoginPwd" />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="loginPwd"
        :rules="[
          { required: true, message: '新密码不能为空', trigger:'blur'},
        ]"
      >
        <el-input v-model="formData.loginPwd" />
      </el-form-item>
      <el-form-item
        label="新密码确认"
        prop="checkLoginPwd"
        :rules="[
          { required: true, message: '确认密码不能为空', trigger:'blur'},
          {validator: checkPass, trigger: 'blur'}
        ]"
      >
        <el-input v-model="formData.checkLoginPwd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('formData')">修改</el-button>
        <el-button @click="handleBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUser } from '@/api/user.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    const checkPass = (rule, value, callback) => {
      if (value !== this.formData.loginPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        name: '',
        loginId: '',
        loginPwd: '',
        checkLoginPwd: '',
        oldLoginPwd: ''
      },
      loginId: '',
      checkPass
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.formData.name = this.userInfo.name;
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发送数据
          const userInfo = {
            name: this.formData.name,
            loginId: this.userInfo.loginId,
            loginPwd: this.formData.loginPwd,
            oldLoginPwd: this.formData.oldLoginPwd
          };
          updateUser(userInfo).then(r => {
            if (r.code === 0) {
              // 如果修改成功，清除token以及本地仓库，跳转至登录页
              this.$message.success('修改成功');
              this.$store.dispatch('user/logout').then(r => {
                this.$router.push({ name: 'Login' });
              });
            } else {
              // 未修改成功
              if (typeof r === 'string') {
                r = JSON.parse(r);
              }
              this.$message.error(r.msg);
            }
          }).catch(e => {
            console.log(e);
            this.$message.error('修改失败：' + e);
          });
        } else {
          // 验证未通过
          this.$message.warning('请检查表单是否通过验证');
          return false;
        }
      });
    },
    handleBack() {
      // 向后退一页
      this.$router.go(-1);
    }
  }
};
</script>

<style>

</style>
