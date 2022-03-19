import { login, whoAmI } from '@/api/user';
import { removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const getDefaultState = () => {
  return {
    userInfo: null
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((res) => {
          // res是对象且res.data为null则是账号密码错误，是字符串的话则是验证码错误
          if (typeof res === 'string') {
            reject(res);
          } else if (res.data == null) {
            reject(res.data);
          } else {
            // 验证成功
            commit('SET_USER_INFO', res.data);
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // restoreStatus
  restoreStatus({ commit, state }) {
    return new Promise((resolve, reject) => {
      whoAmI()
        .then((res) => {
          // 如果res是一个字符串，那么说明未登录或者登录过期
          if (typeof res === 'string') {
            res = JSON.parse(res);
            if (res.code === 401) {
              reject(res.msg);
            }
          } else {
            // 如果res是一个对象，那么就说明验证成功
            commit('SET_USER_INFO', res.data);
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // must remove  token  first
      removeToken();
      // 重置路由
      resetRouter();
      // 重置本地的用户信息
      commit('RESET_STATE');
      resolve();
    });
  }

  // remove token
  // resetToken({ commit }) {
  //   return new Promise((resolve) => {
  //     removeToken(); // must remove  token  first
  //     commit('RESET_STATE');
  //     resolve();
  //   });
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
