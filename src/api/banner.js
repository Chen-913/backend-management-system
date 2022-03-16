import request from '@/utils/request.js';

/**
 * 获取首页标语
 * @returns {Object}
 */
export function getBanners() {
  return request({
    url: '/api/banner',
    method: 'get'
  });
}

/**
 *
 * @returns 设置首页标语
 */
export function setBanner(data) {
  return request({
    url: '/api/banner',
    method: 'post',
    data
  });
}
