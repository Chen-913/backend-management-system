import request from '@/utils/request.js';

/**
 * 设置关于我页面的url
 * @param {String} url 关于我页面的网址
 * @returns
 */
export function setAboutURL(urlInfo) {
  return request({
    url: '/api/about',
    method: 'post',
    data: urlInfo
  });
}

/**
 * 获取关于我页面的url
 * @returns
 */
export function getAboutURL() {
  return request({
    url: '/api/about',
    method: 'get'
  });
}
