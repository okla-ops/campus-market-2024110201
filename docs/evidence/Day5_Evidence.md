# Day5 证据卡：Pinia 状态管理与用户中心

## 一、任务概述

Day5 的核心任务是引入 Pinia 状态管理，解决多个页面共享用户信息和收藏状态的问题。我创建了两个 Store（user 和 favorite），在导航栏、发布页、列表页和个人中心等多个位置使用了这些状态，实现了跨页面的数据共享。

## 二、Store 设计

### user Store（src/stores/user.ts）

管理当前登录用户的模拟信息，采用 Pinia 组合式 API（setup 语法）：

- **state**：nickname（张同学）、avatar、studentId、college、phone、publishedCount
- **getter**：initial（头像首字）
- **action**：updateProfile（更新用户信息）

用户信息在 `AppHeader.vue` 中读取并展示在导航栏右侧，在 `PublishView.vue` 中作为 `publisher` 字段提交，在 `UserCenterView.vue` 中展示完整资料。

### favorite Store（src/stores/favorite.ts）

管理用户在前端收藏的商品/信息：

- **state**：items（收藏数组，每个元素含 type、id、title）
- **getter**：count（收藏总数）
- **action**：isFav（判断是否已收藏）、toggle（添加/取消收藏）、removeByType、clear

收藏状态只保存在 Pinia 内存中，刷新页面后会丢失，这是 Day5 可以接受的现象。

### 状态边界说明

**放入 Store 的状态：**
- 当前用户信息——导航栏、发布页、个人中心都需要
- 收藏列表——列表页和个人中心都需要

**未放入 Store 的状态：**
- 表单输入内容——只属于发布页面，不需要跨页面共享
- 接口返回的列表数据——每个列表页自己维护，不需要共享
- 表单校验错误——只属于当前表单页面

## 三、跨页面状态使用

### 导航栏（AppHeader.vue）

在导航栏右侧显示当前用户头像首字和昵称，让用户身份在整个应用中可见。

### 发布页面（PublishView.vue）

Day4 中 `publisher` 写死为 `'张同学'`，Day5 改为从 `userStore.nickname` 读取，使发布数据与当前用户状态建立联系。

### 列表页面（TradeView.vue）

在每张 ItemCard 底部添加了收藏按钮，点击可切换收藏状态。按钮样式跟随 `favoriteStore.isFav()` 实时变化（🤍收藏 / ❤️已收藏）。

### 个人中心（UserCenterView.vue）

用户资料从 `userStore` 直接读取，不再依赖 API。收藏列表从 `favoriteStore.items` 渲染，并可在个人中心直接取消收藏。"我的发布"数量通过筛选四类数据中 `publisher === user.nickname` 的条目统计。

## 四、AI 协作记录

### AI 生成内容

AI 主要辅助生成了：
- Pinia 组合式 Store 的基础模板结构（`defineStore` + `ref` + `computed` + `function`）
- favorite Store 的 `toggle` 和 `isFav` 逻辑框架
- UserCenterView 中展示用户资料和收藏列表的模板结构

### 人工调整内容

**1. Store 命名调整**
AI 初始将 favorite Store 中的收藏类型字段命名为 `category`，与 db.json 中的 `category`（商品分类）混淆。我改为 `type`，与已有数据模型保持一致。

**2. 收藏按钮交互优化**
AI 生成的收藏按钮只是简单的文字切换，我补充了样式区分——未收藏时显示浅色边框（🤍收藏），已收藏时显示粉底红字（❤️已收藏），视觉反馈更清晰。

**3. ItemCard 插槽设计**
AI 直接将收藏按钮写在 ItemCard 组件内部，这样所有使用 ItemCard 的页面都会出现收藏按钮。我改为在 ItemCard 中添加具名插槽 `#footer`，让每个页面按需决定是否显示收藏功能。

**4. 我的发布统计**
AI 直接使用 `userStore.publishedCount` 的固定值。我改为在 `onMounted` 中请求四类数据，筛选 `publisher === user.nickname` 的条目，实时统计真实发布数量。

**5. 个人中心收藏列表内取消**
AI 在个人中心的收藏列表中没有提供取消操作。我补充了"取消"按钮，调用 `favoriteStore.toggle()` 可以直接在个人中心移除收藏。

## 五、真实测试记录

测试时间：2026-06-29

### 测试一：导航栏显示用户

1. 启动项目，打开首页
2. 结果：导航栏右侧显示蓝色圆形头像（"张"字）+ "张同学"文字

### 测试二：发布数据携带用户身份

1. 进入发布页，选择"二手交易"
2. 填写表单后提交
3. 打开 db.json，trades 最后一条数据的 `publisher` 字段为 "张同学"

### 测试三：收藏功能

1. 进入二手交易页面，点击某商品卡片的"🤍 收藏"
2. 结果：按钮变为"❤️ 已收藏"，粉色高亮
3. 再次点击：恢复为"🤍 收藏"
4. 进入个人中心：收藏列表中显示该商品

### 测试四：个人中心数据聚合

1. 进入个人中心
2. 结果：用户资料显示完整（姓名、学号、学院、手机）
3. "我的发布"显示发布数量
4. "我的收藏"显示收藏条目，点击"取消"可移除

## 六、最终交付

| 交付物 | 说明 |
|--------|------|
| `src/stores/user.ts` | 用户状态 Store（模拟登录用户） |
| `src/stores/favorite.ts` | 收藏状态 Store（添加/取消/判断） |
| `src/components/AppHeader.vue` | 导航栏显示当前用户 |
| `src/views/PublishView.vue` | publisher 从 userStore 读取 |
| `src/views/TradeView.vue` | 商品卡片添加收藏按钮 |
| `src/components/ItemCard.vue` | 新增 footer 插槽 |
| `src/views/UserCenterView.vue` | 用户资料 + 收藏列表 + 发布统计 |
