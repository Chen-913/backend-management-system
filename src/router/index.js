import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      auth: false
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: {
      auth: false
    }
  },

  // 控制台
  {
    path: '/',
    component: Layout,
    redirect: '/console',
    children: [
      {
        path: 'console',
        name: 'Console',
        component: () => import('@/views/console/index'),
        meta: { title: '控制台', icon: 'dashboard', auth: true }
      }
    ]
  },
  // 首页标语
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Banner',
        component: () => import('@/views/banner/index'),
        meta: { title: '首页标语', icon: 'el-icon-s-home', auth: true }
      }
    ]
  },
  // 文章管理
  {
    path: '/article',
    component: Layout,
    redirect: '/article/article-list',
    name: 'Article',
    meta: { title: '文章管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('@/views/article/articleList/index'),
        meta: { title: '文章列表', icon: 'el-icon-s-order', auth: true }
      },
      {
        path: 'article-category',
        name: 'ArticleCategory',
        component: () => import('@/views/article/articleCategory/index'),
        meta: { title: '文章分类', icon: 'el-icon-menu', auth: true }
      },
      {
        path: 'add-article',
        name: 'AddArticle',
        component: () => import('@/views/article/addArticle/index'),
        meta: { title: '添加文章', icon: 'el-icon-circle-plus', auth: true }
      },
      {
        path: 'edit-article',
        name: 'EditArticle',
        hidden: true,
        component: () => import('@/views/article/editArticle/index'),
        meta: { title: '编辑文章', icon: 'el-icon-menu', auth: true }
      }
    ]
  },
  // 项目管理
  {
    path: '/project',
    component: Layout,
    redirect: '/project/project-list',
    name: 'Project',
    meta: { title: '项目管理', icon: 'el-icon-folder-opened', auth: true },
    children: [
      {
        path: 'project-list',
        name: 'ProjectList',
        component: () => import('@/views/project/projectList/index'),
        meta: { title: '项目列表', icon: 'el-icon-notebook-1', auth: true }
      },
      {
        path: 'add-project',
        name: 'AddProject',
        component: () => import('@/views/project/addProject/index'),
        meta: { title: '添加项目', icon: 'el-icon-circle-plus-outline', auth: true }
      }
    ]
  },
  // 评论管理
  {
    path: '/comment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Comment',
        component: () => import('@/views/comment/index'),
        meta: { title: '评论管理', icon: 'el-icon-chat-dot-square', auth: true }
      }
    ]
  },
  // 留言板
  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Message',
        component: () => import('@/views/message/index'),
        meta: { title: '留言板', icon: 'el-icon-receiving', auth: true }
      }
    ]
  },
  // 关于我
  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'About',
        component: () => import('@/views/about/index'),
        meta: { title: '关于我', icon: 'el-icon-user-solid', auth: true }
      }
    ]
  },
  // 设置
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '设置', icon: 'el-icon-s-tools', auth: true }
      }
    ]
  },
  // 个人中心
  {
    path: '/personal-center',
    component: Layout,
    children: [
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        hidden: true,
        component: () => import('@/views/personal-center/index.vue'),
        meta: { title: '个人中心', auth: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: { name: '404' }, hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
