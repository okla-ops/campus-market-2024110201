/**
 * 路由配置
 * 嵌套路由 + 公共布局 + 懒加载 + 404 兜底
 */
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          meta: { title: '首页' },
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'trade',
          name: 'trade',
          meta: { title: '二手交易专区' },
          component: () => import('../views/TradeView.vue'),
        },
        {
          path: 'lostfound',
          name: 'lostfound',
          meta: { title: '失物认领板块' },
          component: () => import('../views/LostFoundView.vue'),
        },
        {
          path: 'groupbuy',
          name: 'groupbuy',
          meta: { title: '拼单互助' },
          component: () => import('../views/GroupBuyView.vue'),
        },
        {
          path: 'errand',
          name: 'errand',
          meta: { title: '跑腿代办' },
          component: () => import('../views/ErrandView.vue'),
        },
        {
          path: 'publish',
          name: 'publish',
          meta: { title: '信息发布' },
          component: () => import('../views/PublishView.vue'),
        },
        {
          path: 'message',
          name: 'message',
          meta: { title: '消息聊天' },
          component: () => import('../views/MessageView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          meta: { title: '个人主页' },
          component: () => import('../views/UserCenterView.vue'),
        },
      ],
    },
    // 登录 / 注册（独立页面，不继承 AppLayout）
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: '注册' },
      component: () => import('../views/RegisterView.vue'),
    },
    // 404 无效地址自动跳转首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

// 注册全局标题拦截器
setupRouterGuard(router)

export default router
