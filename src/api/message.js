import request from '@/utils/request.js';

/**
 * 提交留言
 * @param {Object} messageInfo 留言信息
 * @returns
 */
export function addMessage(messageInfo) {
  return request({
    url: '/api/message',
    method: 'post',
    data: messageInfo
  });
}

/**
 * 分页获取留言
 * @param {Number} page 页码
 * @param {Number} limit 页容量
 * @param {String} keyword 关键字
 * @returns
 */
export function getMessages(page = 1, limit = 10, keyword = '') {
  return request({
    url: '/api/message',
    method: 'get',
    params: {
      page,
      limit,
      keyword
    }
  });
}

/**
 * 根据留言id删除指定留言
 * @param {String} messageId 留言id
 * @returns
 */
export function deleteMessage(messageId) {
  return request({
    url: `/api/message/${messageId}`,
    method: 'delete'
  });
}
