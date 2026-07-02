# Day6 证据卡：Mock 注册登录、状态持久化与交互优化

## 一、任务概述

Day6 的核心任务是从"模拟用户状态"走向"注册/登录驱动的用户状态闭环"。Day5 的 `userStore` 中写死了"张同学"的模拟数据，没有真实的账户概念。Day6 实现了：

- db.json 中设计 users 资源（3 个预置账号）
- 注册：将新用户写入 JSON Server
- 登录：根据 nickname + password 校验，成功后写入 Pinia + localStorage
- 退出：清空 Pinia 与 localStorage
- 刷新后自动恢复登录状态
- 导航栏根据登录状态显示"登录/注册"或用户信息
- 发布页面校验登录状态
- 个人中心未登录提示与退出功能
- 通用 LoadingState / ErrorState / SearchBar 组件
- TradeView 搜索、加载、错误状态与重试
- 注册时校验密码长度、确认密码一致性、昵称唯一性

## 二、用户数据设计（db.json）

在 db.json 中新增 `users` 集合，包含 3 个预置测试账号：

```json
"users": [
  { "id": "1", "nickname": "张同学", "studentId": "2024****0123",
    "college": "信息科学与技术学院", "phone": "138****1234", "password": "123456" },
  { "id": "2", "nickname": "李同学", "studentId": "2024****0456",
    "college": "计算机科学与技术学院", "phone": "139****5678", "password": "123456" },
  { "id": "3", "nickname": "王同学", "studentId": "2024****0789",
    "college": "数学与统计学院", "phone": "137****9012", "password": "123456" }
]
```

同一账号所有人统一密码 `123456`，便于演示。

## 三、注册/登录 API 模块（src/api/user.ts）

```ts
import http from './http'
import type { User } from '@/types'

export function getUsers(): Promise<{ data: User[] }> {
  return http.get('/users')
}

export function createUser(data: Omit<User, 'id'>): Promise<{ data: User }> {
  return http.post('/users', data)
}
```

`getUsers` 用于登录时查询匹配，`createUser` 用于注册写入 JSON Server。

## 四、路由设计

登录和注册页面为**独立顶级路由**，不嵌套在 AppLayout 下，以获得全屏干净的认证页面：

```ts
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
```

这样登录/注册页面拥有独立的渐变背景布局，与业务页面区分。

## 五、userStore 改造（src/stores/user.ts）

Day5 → Day6 的核心变化：

| 项目 | Day5（改造前） | Day6（改造后） |
|------|---------------|---------------|
| 初始状态 | 写死"张同学" | 全部为空字符串 |
| 登录判断 | 无 | `isLoggedIn` computed |
| 登录操作 | 无 | `login(userData)` 写入 Pinia + localStorage |
| 退出操作 | 无 | `logout()` 清空两者 |
| 状态恢复 | 无 | `restoreSession()` 从 localStorage 读取 |
| 头像首字 | 写死计算 | 为空时返回空字符串 |

**关键代码：login action**

```ts
function login(userData) {
  nickname.value = userData.nickname
  avatar.value = userData.avatar || ''
  studentId.value = userData.studentId
  college.value = userData.college
  phone.value = userData.phone
  localStorage.setItem('user', JSON.stringify({ nickname, avatar, studentId, college, phone }))
}
```

**关键代码：restoreSession**

```ts
function restoreSession() {
  const saved = localStorage.getItem('user')
  if (!saved) return
  try {
    const data = JSON.parse(saved)
    nickname.value = data.nickname || ''
    // ... 恢复其余字段
  } catch {
    logout()
  }
}
```

## 六、App 启动时恢复登录状态（src/App.vue）

```ts
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
onMounted(() => {
  user.restoreSession()
})
```

这样在页面刷新后，`localStorage` 中保存的用户信息会恢复到 Pinia 中，导航栏立即显示当前用户。

## 七、导航栏登录状态（AppHeader.vue）

```html
<div class="user-badge">
  <template v-if="user.isLoggedIn">
    <span class="user-avatar">{{ user.initial }}</span>
    <span class="user-name">{{ user.nickname }}</span>
  </template>
  <template v-else>
    <router-link to="/login">登录</router-link>
    <span>/</span>
    <router-link to="/register">注册</router-link>
  </template>
</div>
```

## 八、登录页面（LoginView.vue）

流程：输入 nickname + password → GET /users 全量查询 → 在 JS 层匹配 → 匹配成功则调用 `userStore.login()` → 跳转首页。

**为什么不在 JSON Server 端过滤？** JSON Server 的查询语法 `GET /users?nickname=xxx&password=xxx` 会将密码明文暴露在 URL 中，比全量查询更不安全。

边界处理：
- 账号或密码为空时提示"请填写账号和密码"
- 匹配失败时提示"账号或密码错误"
- JSON Server 未启动时提示"登录失败，请确认 Mock 服务已启动"

**校验逻辑**（RegisterView.vue）

```ts
if (form.password.length < 6) {
  errorMsg.value = '密码长度不少于 6 位'
  return
}
if (form.password !== form.confirmPassword) {
  errorMsg.value = '两次密码输入不一致'
  return
}
// 昵称唯一性检查
const res = await getUsers()
if (res.data.some((u: any) => u.nickname === form.nickname.trim())) {
  errorMsg.value = '该昵称已被注册'
  return
}
```

## 九、发布页面登录校验（PublishView.vue）

```ts
async function handleSubmit() {
  if (!user.isLoggedIn) {
    feedback.show = true
    feedback.ok = false
    feedback.msg = '请先登录后再发布'
    return
  }
  // ... 原有验证逻辑
}
```

## 十、个人中心未登录状态（UserCenterView.vue）

```html
<div v-if="!user.isLoggedIn" class="unlogged">
  <p>您尚未登录，请先登录后查看个人主页</p>
  <router-link to="/login" class="btn">前往登录</router-link>
</div>
<template v-else>
  <!-- 用户资料、收藏列表、退出按钮 -->
</template>
```

退出登录调用 `user.logout()` 后跳转首页。

## 十一、通用组件

### LoadingState.vue

显示旋转圆圈 + 加载文案。用于列表页数据请求中的视觉反馈。

```html
<div class="loading-state">
  <div class="spinner"></div>
  <p>{{ message || '数据加载中...' }}</p>
</div>
```

### ErrorState.vue

显示错误文案 + "重新加载"按钮。emit `retry` 事件，父组件重新 fetch。

```html
<div class="error-state">
  <p>{{ message || '数据加载失败' }}</p>
  <button class="retry-btn" @click="emit('retry')">重新加载</button>
</div>
```

### SearchBar.vue

支持 `v-model` 双向绑定的搜索输入框，placeholder 可配置。用于列表页的实时过滤。

## 十二、TradeView 搜索与状态管理

改造后的 TradeView 使用以下顺序判断：

```html
<SearchBar v-model="keyword" placeholder="搜索标题、描述、分类、地点..." />
<LoadingState v-if="loading" />
<ErrorState v-else-if="error" @retry="fetchData" />
<EmptyState v-else-if="!filteredTrades.length" message="没有找到匹配的商品" />
<div v-else class="card-grid">
  <!-- ItemCard 列表 + 收藏按钮 -->
</div>
```

`filteredTrades` 根据 keyword 实时过滤标题/描述/分类/地点，搜索不区分大小写。

## 十三、AI 协作记录

### AI 生成内容

AI 辅助生成了：
- LoginView.vue 和 RegisterView.vue 的基础模板结构
- userStore 中 login/logout/restoreSession 的框架逻辑
- AppHeader 登录/注册切换的条件渲染模板
- LoadingState/ErrorState/SearchBar 的初始实现
- TradeView 搜索过滤逻辑

### 人工调整内容

**1. 注册校验增强** — AI 初始版本只校验了密码是否填写，未校验长度和确认密码一致性。我补充了 `password.length < 6` 检查、两次密码一致性检查、昵称唯一性检查。

**2. 导航栏布局调整** — AI 生成的登录/注册链接没有分隔符号，两个链接紧贴在一起。我添加了 "/" 分隔符。

**3. 个人中心退出逻辑** — AI 在个人中心只显示了退出按钮，没有在 `onMounted` 中处理未登录状态。我补充了 `if (!user.isLoggedIn)` 提前退出逻辑和 `handleLogout` 函数。

**4. 类型错误修复** — 我写的新 types/index.ts 中 `Message` 接口字段与 db.json 不匹配（from/to/content 应为 nickname/lastMsg），缺少 `Profile` 接口，`status` 字段类型为 `string` 而 ItemCard 期望联合类型。全部修复后 `npm run build` 通过。

**5. PublishView 路由跳转类型安全** — `routeMap[activeType.value]` 可能返回 undefined，改为 `if (path) router.push(path)`。

### AI 使用质量总结

| 审查维度 | 评价 |
|----------|------|
| 注册/登录流程是否闭环 | ✅ 注册→写入 JSON Server→登录→Pinia→localStorage→退出→清除→刷新恢复 |
| 边界处理是否完整 | ✅ 空输入、密码长度、确认密码、昵称唯一、Mock 服务未启动 |
| 安全性是否在合理范围 | ✅ 没有 JWT/Token/密码加密等超范围代码 |
| 交互反馈是否完善 | ✅ LoadingState/ErrorState/SearchBar 三个通用组件 |
| 类型是否安全 | ✅ 修复所有 TypeScript 错误，build 通过 |

## 十四、完整功能走查记录

测试时间：2026-06-29，环境：Windows 本地

### 走查步骤与结果

1. **启动服务** — `npm run mock` + `npm run dev`，均正常启动
2. **打开首页** → 导航栏显示"登录 / 注册"链接 ✓
3. **点击注册** → 进入 `/register`，全屏渐变背景 + 注册表单 ✓
4. **注册新用户**：昵称"TestUser"、密码"test123" → 成功跳转到登录页 ✓
5. **确认 db.json**：打开查看，users 数组中新增了 TestUser ✓
6. **使用新用户登录**：输入 TestUser / test123 → 成功跳转首页 ✓
7. **导航栏显示**：右侧显示"T" + "TestUser" ✓
8. **刷新页面**：导航栏仍显示"T" + "TestUser"（localStorage 恢复）✓
9. **发布信息**：进入 `/publish`，填写二手交易表单 → 提交成功 → 跳转到二手交易页 ✓
10. **确认发布人**：检查 db.json，trades 最后一条 publisher 为 "TestUser" ✓
11. **搜索测试**：在 TradeView 搜索框输入"数学" → 只显示匹配商品 ✓
12. **收藏测试**：点击商品收藏按钮 → 变为"❤️ 已收藏" ✓
13. **个人中心**：进入 `/profile` → 显示 TestUser 资料、发布统计 1、收藏列表 ✓
14. **退出登录**：点击退出按钮 → 跳转首页，导航栏恢复"登录 / 注册" ✓
15. **未登录访问个人中心**：显示"请先登录"提示 + 登录按钮 ✓
16. **预置账号登录**：使用张同学 / 123456 → 导航栏显示"张同学" ✓

### 错误状态测试

17. **停止 JSON Server** → 刷新 TradeView → 显示 ErrorState "数据加载失败，请确认 Mock 服务已启动" ✓
18. **恢复 JSON Server** → 点击"重新加载" → 数据恢复 ✓

## 十五、本日小结

Day6 完成了从"写死用户"到"注册/登录驱动用户状态"的转变。核心收获：

1. **Mock 注册登录**：不需要后端认证系统，用 JSON Server + 前端校验即可演示完整的用户闭环
2. **状态持久化**：localStorage 解决了"刷新丢失"问题，是前端持久化的最简方式
3. **登录态驱动 UI**：导航栏、发布页、个人中心都根据 `isLoggedIn` 做出不同响应
4. **交互反馈**：LoadingState / ErrorState / SearchBar 三个通用组件提升了应用的专业感
5. **类型安全**：重构 types 避免 string 泛型，使用 `ItemStatus` 联合类型，将类型错误在构建时暴露

Day6 没有实现密码加密、JWT、权限路由、头像上传等生产环境功能，这符合实训项目的定位。
