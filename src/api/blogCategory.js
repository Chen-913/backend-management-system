import request from '@/utils/request.js';

/**
 * 添加文章分类
 * @param {Object} categoryInfo 分类信息
 * @returns
 */
export function addBlogCategory(categoryInfo) {
  return request({
    url: '/api/blogtype',
    method: 'post',
    data: categoryInfo
  });
}

/**
 * 通过分类id获取指定分类的信息
 * @param {String} blogId 分类id
 * @returns
 */
export function getCategory(categoryId) {
  return request({
    url: `/api/blogtype/${categoryId}`,
    method: 'get'
  });
}

/**
 * 通过分类id删除分类
 * @param {String} categoryId 分类id
 * @returns
 */
export function deleteBlogCategory(categoryId) {
  return request({
    url: `/api/blogtype/${categoryId}`,
    method: 'delete'
  });
}

/**
 * 获取所有的文章分类信息
 * @returns
 */
export function getBlogCategory() {
  return request({
    url: '/api/blogtype',
    method: 'get'
  });
}

/**
 * 根据分类id修改分类信息
 * @param {String} categoryId 分类id
 * @returns
 */
export function modifyCategory(categoryId, categoryInfo) {
  return request({
    url: `/api/blogtype/${categoryId}`,
    method: 'put',
    data: categoryInfo
  });
}
