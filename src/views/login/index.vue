<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">个人博客后台管理系统</h3>
      </div>

      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model="loginForm.loginId"
          placeholder="请输入账号"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="loginPwd"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="请输入密码"
          name="loginPwd"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <div class="captcha-container">
        <el-form-item prop="captcha">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            name="captcha"
            type="text"
            tabindex="3"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <div class="captcha-img" @click="handleClickCaptcha" v-html="captchaSvg" />
      </div>

      <el-checkbox v-model="checked">7日内免登录</el-checkbox>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px;margin-top: 10px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername, validPassword, validCaptcha } from '@/utils/validate';
import { getCaptcha } from '@/api/captcha';

export default {
  name: 'Login',
  data() {
    // 给username自定义验证规则
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('账号由3-15位数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码由6-15位数字、字母或下划线组成'));
      } else {
        callback();
      }
    };
    const validateCaptcha = (rule, value, callback) => {
      if (!validCaptcha(value)) {
        callback(new Error('验证码由4位数字或字母组成'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginId: '',
        loginPwd: '',
        captcha: ''
      },
      loginRules: {
        loginId: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        loginPwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [{ require: true, trigger: 'blur', validator: validateCaptcha }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      checked: true,
      captchaSvg: ''
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.handleClickCaptcha();
  },
  methods: {
    showPwd() {
      // 切换 passwordType 的值
      if (this.passwordType === 'password') {
        this.passwordType = 'text';
      } else {
        this.passwordType = 'password';
      }
      // 自动聚焦密码输入框
      this.$nextTick(() => {
        this.$refs.loginPwd.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.checked) {
            // 是否7日内免登录
            this.loginForm.remember = 7;
          }
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
              this.loading = false;
            })
            .catch((err) => {
              if (err == null) {
                this.$message.error('账号密码错误');
                // 自动聚焦到账号输入框
                this.$nextTick(() => {
                  this.$refs.loginId.focus();
                });
              } else {
                this.$message.error('验证码错误');
                // 自动聚焦到验证码输入框
                this.$nextTick(() => {
                  this.$refs.captcha.focus();
                });
              }
              // 清空验证码
              this.loginForm.captcha = '';
              // 重新获取验证码
              this.handleClickCaptcha();
              this.loading = false;
            });
        } else {
          this.$message({
            message: '部分验证不符合要求',
            type: 'warning'
          });
          return false;
        }
      });
    },
    handleClickCaptcha() {
      // 将获取到的 svg 图片直接插入到页面中
      getCaptcha().then(r => { this.captchaSvg = r });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

.captcha-container{
	display: flex;
	.el-form-item{
		width:70%;
	}
	.captcha-img{
		width:30%;
		background-color: rgb(0, 0, 0);
		margin-bottom:22px;
		border-radius: 0 5px 5px 0;
		cursor:pointer;
		:first-child{
			width: 100%;
		}
	}
}
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
