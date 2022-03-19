import request from '@/utils/request.js';

/**
 * 获取所有项目
 * @returns
 */
export function getProjects() {
  return request({
    url: `/api/project`,
    method: 'get'
  });
}

/**
 * 根据项目id修改指定的项目
 * @param {String} projectId 项目id
 * @param {Object} projectInfo 项目信息
 * @returns
 */
export function modifyProject(projectId, projectInfo) {
  return request({
    url: `/api/project/${projectId}`,
    method: 'put',
    data: projectInfo
  });
}

/**
 * 新增项目
 * @param {Object} projectInfo 项目信息
 * @returns
 */
export function addProject(projectInfo) {
  return request({
    url: '/api/project',
    method: 'post',
    data: projectInfo
  });
}

/**
 * 根据项目id删除指定的项目
 * @param {String} projectId 项目id
 * @returns
 */
export function deleteProject(projectId) {
  return request({
    url: `/api/project/${projectId}`,
    method: 'delete'
  });
}
