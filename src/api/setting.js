import request from '@/utils/request.js';

/**
 * 获取全局设置
 * @returns
 */
export function getSetting() {
  return request({
    url: '/api/setting',
    method: 'get'
  });
}

/**
 * 修改全局设置
 * @param {Object} configInfo
 * @returns
 */
export function modifySetting(configInfo) {
  return request({
    url: '/api/setting',
    method: 'put',
    data: configInfo
  });
}
