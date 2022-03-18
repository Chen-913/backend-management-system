import request from '@/utils/request.js';

/**
 * 分页获取文章列表
 * @param {Number} page 页码
 * @param {Number} limit 每页数量
 * @param {String} keyword 搜索关键字
 * @param {String} categoryId 分类id
 * @returns
 */
export function getBlogs(page = 1, limit = 10, keyword = '', categoryId = -1) {
  return request({
    url: '/api/blog',
    params: {
      page,
      limit,
      keyword,
      categoryId
    }
  });
}

/**
 * 删除指定 id 的文章
 * @param {String} id 文章id
 * @returns
 */
export function deleteBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete'
  });
}

/**
 * 发布文章
 * @param {Object} blogInfo 文章信息
 * @returns
 */
export function addBlog(blogInfo) {
  return request({
    url: '/api/blog',
    method: 'post',
    data: blogInfo
  });
}

/**
 * 根据传入的文章 id，修改文章内容
 * @param {String} blogId 文章id
 * @param {Object} blogInfo 文章相关信息
 * @returns
 */
export function modifyBlog(blogId, blogInfo) {
  return request({
    url: `/api/blog/${blogId}`,
    method: 'put',
    data: blogInfo
  });
}

/**
 * 根据文章id获取文章的相关信息
 * @param {String} blogId 文章id
 * @returns
 */
export function getBlog(blogId) {
  return request({
    url: `/api/blog/${blogId}`,
    method: 'get'
  });
}
