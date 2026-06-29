# Day3 证据卡：Mock 数据模型与列表渲染

## 一、任务概述

Day3 的核心目标是将项目从"静态页面"推进到"数据驱动页面"阶段。我在 `db.json` 中设计了四类业务数据（二手交易、失物招领、拼单搭子、跑腿委托），通过 JSON Server 提供 Mock API，前端使用 Axios 请求数据并完成列表渲染，同时重构了组件结构使其更清晰。

## 二、我的设计

### 数据建模思路

在分析"校园轻集市"的四类核心业务后，我确定了每个集合的关键字段：

- **trades（二手交易）**：围绕商品交易场景，需要标题、价格、分类、成色、发布人、发布时间、地点、状态。价格用数字类型方便排序和格式化，状态区分 `open`（在售）和 `closed`（已下架）。
- **lostFounds（失物招领）**：用 `type` 字段区分"丢失"和"捡到"，而不是分两个集合。全部统一放在一个集合中，页面端用 `computed` 按类型拆分展示。时间字段根据类型用 `lostTime` 或 `foundTime` 区分。
- **groupBuys（拼单搭子）**：核心是进度展示，所以设计了 `targetCount`（目标人数）和 `currentCount`（当前人数），页面端通过百分比计算渲染进度条。
- **errands（跑腿委托）**：酬劳用 `reward` 数字字段突出显示，`pickup` 和 `delivery` 分别表示取件和送达地点，形成路线信息。

每条数据都添加了校园场景的描述文字，例如"考研用书""宿舍小冰箱""二食堂小笼包"等，确保贴合学生日常生活。

### 组件结构设计

我按照建议的项目结构，将原有的 `MainLayout.vue` 拆分为三个独立组件：

- `AppLayout.vue`：外层布局容器，包含渐变背景动画和内容区
- `AppHeader.vue`：顶部导航栏，含 logo
- `AppNav.vue`：导航链接列表

同时将 `ProfileView.vue` 重命名为 `UserCenterView.vue`，与建议结构保持一致。

### 数据请求分层

我采用了三层架构：

1. `src/api/http.ts` — Axios 实例，baseURL 指向 JSON Server（localhost:3001）
2. `src/api/trade.ts`、`lostFound.ts`、`groupBuy.ts`、`errand.ts`、`message.ts`、`profile.ts` — 按业务模块拆分的 API 文件
3. 页面组件在 `onMounted` 中调用对应的 API 方法，获取数据后渲染

## 三、AI 设计

AI 在本次任务中主要辅助了以下方面：

### 数据生成

AI 根据我给出的字段定义，快速生成了四类 Mock 数据的内容，包括商品标题、描述文字、价格等。AI 生成的数据结构规范，字段名采用驼峰命名，类型一致，例如 `targetCount` 和 `currentCount` 都使用数字类型。

### 组件拆分建议

AI 建议将 `MainLayout.vue` 拆分为 `AppLayout`、`AppHeader`、`AppNav` 三个组件，使布局逻辑更加清晰，每个组件职责单一。

### 代码生成

AI 辅助生成了 `ItemCard.vue` 通用卡片组件的模板结构和样式，以及各页面中列表渲染的模板代码和状态管理（loading / error / empty 状态）。

## 四、人工判断与修改

我主动判断和调整了以下内容：

### 数据字段调整

AI 初始生成的数据中，部分字段命名不够统一。例如拼单数据中 AI 用了 `maxCount` 和 `curCount`，我统一改为 `targetCount` 和 `currentCount`，更符合语义且与其他数据风格一致。AI 生成的失物招领数据没有区分 `lostTime` 和 `foundTime`，我根据 `type` 字段补充了对应的时机字段。

### 组件复用判断

AI 建议将 GroupBuyView 也使用 ItemCard 组件，但 GroupBuyView 需要展示进度条，ItemCard 的通用结构不适合嵌入进度条。我最终决定 GroupBuyView 保留独立的卡片结构，直接渲染进度条，而不是强行套用 ItemCard。

### API 封装选择

AI 最初建议使用 `json-server` 的中间件模式或者拦截器实现复杂逻辑，我判断 Day3 阶段不需要过度封装，只保留了基础 Axios 实例，没有添加 JWT Token 和权限拦截等复杂功能。

### 状态处理完善

AI 生成的页面代码只处理了成功状态，我补充了 loading（加载中）、error（请求失败）、empty（数据为空）三种状态的处理，并在页面中展示对应的 UI 反馈。

## 五、最终交付

| 交付物 | 说明 |
|--------|------|
| `db.json` | 四类业务数据，共 trades(6条)+lostFounds(5条)+groupBuys(5条)+errands(5条)+messages(6条)+profile(1条) |
| `src/api/http.ts` | Axios 基础实例封装 |
| `src/api/*.ts` | 6个业务 API 模块 |
| `src/components/ItemCard.vue` | 通用列表卡片组件 |
| `src/components/EmptyState.vue` | 空状态组件 |
| `src/components/AppLayout.vue` | 全局布局组件 |
| `src/components/AppHeader.vue` | 顶部导航栏组件 |
| `src/components/AppNav.vue` | 导航链接组件 |
| `src/views/` | 8个页面全部完成 Mock 数据列表渲染 |

## 六、运行确认

- Mock API 服务：`npm run mock` → http://localhost:3001（JSON Server 正常返回数据）
- 前端服务：`npm run dev` → http://localhost:5173（页面正常渲染数据）
- 类型检查：`vue-tsc --noEmit` 通过
- 生产构建：`vite build` 成功
