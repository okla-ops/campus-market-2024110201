/**
 * 路由导航守卫
 * 功能：在每次路由切换前更新页面标题
 */
import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router) {
  router.beforeEach((to) => {
    // 从路由元信息中获取标题，默认值兜底
    const title = (to.meta?.title as string) || '校园轻集市'
    document.title = `${title} | 校园轻集市`
  })
}
