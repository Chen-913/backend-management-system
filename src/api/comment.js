import request from '@/utils/request.js';

/**
 * 添加评论
 * @param {Object} commentInfo 评论信息
 * @returns
 */
export function addComment(commentInfo) {
  return request({
    url: '/api/comment',
    method: 'post',
    data: commentInfo
  });
}

/**
 * 根据评论id删除指定评论
 * @param {String} commentId 评论的id
 * @returns
 */
export function deleteComment(commentId) {
  return request({
    url: `/api/comment/${commentId}`,
    method: 'delete'
  });
}

/**
 * 查询指定文章的评论，没有指定文章id则查询所有评论
 * @param {Number} page 页码
 * @param {Number} limit 页容量
 * @param {String} blogid 文章id
 * @param {String} keyword 关键字
 * @returns
 */
export function getComments(page = 1, limit = 10, blogid = -1, keyword = '') {
  return request({
    url: '/api/comment',
    method: 'get',
    params: {
      page,
      limit,
      blogid,
      keyword
    }
  });
}
