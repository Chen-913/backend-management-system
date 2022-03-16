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
