# Day2 过程性证据

## 今日完成内容

1. **创建页面视图** — 在 `src/views/` 下新增 6 个页面：ListView、PublishView、MessageView、ProfileView、DetailView、CartView
2. **完善路由系统** — 在 `src/router/index.ts` 中配置 8 个路由，全部采用懒加载
3. **构建导航系统** — 在 `App.vue` 中实现顶部导航栏，包含首页/列表/发布/消息/个人中心

## 学习收获

- 掌握了 Vue Router 的懒加载配置方式：`() => import('path')`
- 理解了路由参数传递：`/detail/:id`
- 学会了使用 `<router-link>` 和 `<RouterView>` 构建页面导航
- 熟悉了 Vue 3 Composition API 的 `<script setup>` 语法

## 遇到的问题

- 路由 path 与 name 需要一一对应，避免导航时名称混淆
- 使用重定向 `redirect: '/home'` 处理根路径访问

## 后续计划

- 实现各页面的具体业务逻辑
- 对接 API 接口
- 完善 UI 界面样式
