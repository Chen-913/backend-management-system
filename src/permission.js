import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken, removeToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);
  // 获取用户信息
  const hasUserInfo = store.getters.userInfo;
  if (to.meta.auth) {
    // 如果需要验证权限
    if (hasUserInfo) {
      // 如果有用户信息，则直接进入
      next();
      NProgress.done();
    } else {
      // 如果没有用户信息，则查看是否有token，没有的话直接跳转到登录页
      const token = getToken();
      if (token) {
        // 如果有token，则需要验证token的正确性，恢复登录状态
        await store.dispatch('user/restoreStatus').then(() => {
          // token没有问题，则进入
          next();
        }).catch((err) => {
          // token有问题，则通知错误消息，清除token，重新跳转至登录页
          Message.error(err);
          removeToken();
          next({ name: 'Login' });
        });
      } else {
        // m没有token，直接跳转到登录页
        next({ name: 'Login' });
      }
      NProgress.done();
    }
  } else {
    // 不需要鉴权，看是否为登录页
    if (to.name === 'Login') {
      // 如果是登录页，则先判断是否已经登录，如果已经登录了，则跳转至控制台
      if (hasUserInfo) {
        next({ name: 'Console' });
      } else {
        next();
      }
    } else {
      // 如果不是登录页，直接放行
      next();
    }
    NProgress.done();
  }

  // 以下是vue-element-admin的鉴权逻辑
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // 如果已经登录了，并且是前往登录页的话，直接跳转至首页
  //     next({ path: '/' });
  //     NProgress.done();
  //   } else {
  //     // 如果已经登录但不是前往登录页，则直接放行
  //     const hasGetUserInfo = store.getters.name;
  //     if (hasGetUserInfo) {
  //       next();
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo');

  //         next();
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken');
  //         Message.error(error || 'Has Error');
  //         next(`/login?redirect=${to.path}`);
  //         NProgress.done();
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next();
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`);
  //     NProgress.done();
  //   }
  // }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
