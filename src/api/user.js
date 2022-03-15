import request from '@/utils/request';

// 登录
export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  });
}

/**
 * 验证token的有效性
 * @returns
 */
export function whoAmI() {
  return request({
    url: '/api/admin/whoami',
    method: 'get'
  });
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  });
}
