import request from '@/utils/request.js';

/**
 * 获取验证码
 * @returns {Promise<any>}
 */
export function getCaptcha() {
  return request({
    url: '/res/captcha',
    method: 'get'
  });
}
