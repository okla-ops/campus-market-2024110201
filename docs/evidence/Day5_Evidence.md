# Day5 证据卡：Pinia 状态管理与用户中心

## 一、任务概述

Day5 的核心任务是引入 Pinia 状态管理，解决多个页面共享用户信息和收藏状态的问题。Day1—Day4 中，项目已经包含页面路由、Mock 数据、列表渲染和发布表单，但出现了以下问题：

- 当前用户信息硬编码在多个组件中，修改时需要改多处
- 收藏状态无法在列表页和个人中心之间同步
- 发布页的 `publisher` 字段写死为固定值，与真实用户无关

Day5 我创建了两个 Store（user 和 favorite），在导航栏、发布页、列表页和个人中心等多个位置使用了这些状态，实现了跨页面的数据共享。

## 二、Pinia 挂载确认

打开 `src/main.ts`，确认 Pinia 已经挂载：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())  // 挂载 Pinia
app.use(router)
app.mount('#app')
```

Day1 种子项目创建时已选择了 Pinia 选项，无需额外安装。

## 三、Store 设计

### user Store（src/stores/user.ts）

管理当前登录用户的模拟信息，采用 Pinia 组合式 API（setup 语法）：

```ts
export const useUserStore = defineStore('user', () => {
  const nickname = ref('张同学')
  const avatar = ref('')
  const studentId = ref('2024****0123')
  const college = ref('信息科学与技术学院')
  const phone = ref('138****1234')
  const publishedCount = ref(3)

  const initial = computed(() => nickname.value.charAt(0))

  function updateProfile(data: Partial<{ nickname, avatar, studentId, college, phone }>) {
    Object.assign({ nickname, avatar, studentId, college, phone }, data)
  }

  return { nickname, avatar, studentId, college, phone, publishedCount, initial, updateProfile }
})
```

**state 设计说明：**
- `publishedCount` 虽然是数字，但作为用户资料的一部分放在 user Store 中，方便个人中心直接读取
- `initial` 是一个 getter，根据 nickname 动态计算首字，便于在头像位置显示
- `updateProfile` action 预留了更新接口，后续 Day6 如果做编辑资料功能可以直接使用

### favorite Store（src/stores/favorite.ts）

```ts
interface FavItem {
  type: 'trade' | 'lostfound' | 'groupbuy' | 'errand'
  id: number
  title: string
}

export const useFavoriteStore = defineStore('favorite', () => {
  const items = ref<FavItem[]>([])
  const count = computed(() => items.value.length)

  function isFav(type: string, id: number): boolean {
    return items.value.some((i) => i.type === type && i.id === id)
  }

  function toggle(type: FavItem['type'], id: number, title: string) {
    const idx = items.value.findIndex((i) => i.type === type && i.id === id)
    if (idx >= 0) items.value.splice(idx, 1)
    else items.value.push({ type, id, title })
  }

  return { items, count, isFav, toggle, removeByType, clear }
})
```

**设计要点：**
- 每个收藏项包含 `type`（所属业务类型）和 `id`（数据唯一标识），确保跨业务类型的收藏不会冲突
- `isFav` 用于列表页判断当前商品是否已收藏，控制按钮样式
- `toggle` 合并了添加和取消两个操作，简化调用方代码

### 状态边界说明（重要）

Pinia 不是用来放所有数据的。Day5 我明确区分了哪些数据应该放入 Store，哪些不应该：

| 数据类型 | 是否放入 Store | 理由 |
|----------|---------------|------|
| 当前用户信息 | ✅ 放入 user Store | 导航栏、发布页、个人中心三处都需要 |
| 收藏列表 | ✅ 放入 favorite Store | 列表页添加/取消，个人中心查看/管理 |
| 接口返回的列表数据 | ❌ 留在页面组件 | 每个列表页只使用自己的数据，不需要共享 |
| 表单输入 | ❌ 留在页面组件 | 只属于发布页的临时状态 |
| 表单校验错误 | ❌ 留在页面组件 | 只属于当前表单的生命周期 |
| 路由参数 | ❌ 不处理 | 不属于状态管理范畴 |

## 四、跨页面状态使用详解

### 1. 导航栏（AppHeader.vue）

```ts
import { useUserStore } from '@/stores/user'
const user = useUserStore()
```

模板中：
```html
<div class="user-badge">
  <span class="user-avatar">{{ user.initial }}</span>
  <span class="user-name">{{ user.nickname }}</span>
</div>
```

效果：导航栏右侧固定显示当前用户头像和姓名，用户在使用任何页面时都能看到当前身份。

### 2. 发布页面（PublishView.vue）

Day4 中 `publisher` 写死为 `'张同学'`：
```ts
publisher: '张同学',  // Day4 硬编码
```

Day5 改为从 Store 读取：
```ts
import { useUserStore } from '@/stores/user'
const user = useUserStore()
// ...
publisher: user.nickname,  // Day5 从 Pinia 读取
```

这样做的意义：发布数据与当前用户身份绑定，后续个人中心"我的发布"功能才能准确筛选。

### 3. 列表页面（TradeView.vue）

在每张 ItemCard 底部添加收藏按钮：
```html
<template #footer>
  <button :class="['fav-btn', { active: fav.isFav('trade', item.id) }]"
          @click="fav.toggle('trade', item.id, item.title)">
    {{ fav.isFav('trade', item.id) ? '❤️ 已收藏' : '🤍 收藏' }}
  </button>
</template>
```

交互逻辑：
- 未收藏：显示浅色边框的"🤍 收藏"
- 已收藏：显示粉底红字的"❤️ 已收藏"
- 点击 toggle：自动切换状态，无需手动管理数组

### 4. 个人中心（UserCenterView.vue）

个人中心是 Day5 改动最大的页面，整合了三个数据源：

- **用户资料**：直接从 `userStore` 读取，不再依赖 API 请求
- **收藏列表**：从 `favoriteStore.items` 渲染，每条显示类型标签、标题和取消按钮
- **我的发布统计**：`onMounted` 中请求四类数据，筛选 `publisher === user.nickname`

```ts
const [trades, lost, buys, errs] = await Promise.all([
  getTrades(), getLostFounds(), getGroupBuys(), getErrands(),
])
myPublishCount.value =
  trades.data.filter((i) => i.publisher === me).length +
  lost.data.filter((i) => i.publisher === me).length +
  buys.data.filter((i) => i.publisher === me).length +
  errs.data.filter((i) => i.publisher === me).length
```

## 五、ItemCard 组件重构

为了支持收藏功能，Day5 在 ItemCard 中新增了具名插槽：

```html
<div v-if="$slots.footer" class="card-footer">
  <slot name="footer" />
</div>
```

**设计考虑：**
- 收藏按钮不应该出现在所有使用 ItemCard 的页面中（例如失物招领页暂时不需要收藏）
- 使用 `v-if="$slots.footer"` 确保没有传递 footer 内容时不显示多余的空容器
- 这样 ItemCard 既保持了通用性，又为特定页面提供了扩展能力

## 六、AI 协作记录

### AI 生成内容

AI 主要辅助生成了：
- Pinia 组合式 Store 的基础模板结构（`defineStore` + `ref` + `computed` + `function`）
- favorite Store 的 `toggle` 和 `isFav` 逻辑框架
- UserCenterView 中展示用户资料和收藏列表的模板结构
- 收藏按钮的基础样式和交互逻辑

### 人工调整内容

**1. Store 命名调整** — AI 初始将 favorite Store 中的收藏类型字段命名为 `category`，与 db.json 中的 `category`（商品分类）混淆。我改为 `type`，与已有数据模型保持一致。

**2. 收藏按钮交互优化** — AI 生成的收藏按钮只是简单的文字切换，没有视觉反馈。我补充了样式区分：未收藏时显示浅色边框（🤍收藏），已收藏时显示粉底红字（❤️已收藏）。

**3. ItemCard 插槽设计** — AI 直接将收藏按钮写在 ItemCard 组件内部，这样所有页面都会出现收藏按钮。我改为在 ItemCard 中添加 `#footer` 具名插槽，让每个页面按需使用。

**4. 我的发布统计** — AI 直接使用 `userStore.publishedCount` 的固定值（3），与实际数据脱节。我改为请求四类数据后实时筛选统计。

**5. 个人中心收藏列表内取消** — AI 在个人中心的收藏列表中没有提供取消操作。我补充了"取消"按钮。

**6. AppHeader 样式调整** — AI 生成的头像没有添加 `flex-shrink: 0`，在导航栏空间不足时头像会被压缩变形。我补充了该属性。

### AI 使用质量总结

| 审查维度 | 评价 |
|----------|------|
| Store 划分是否合理 | ✅ user 和 favorite 两个 Store 职责清晰 |
| 状态是否必要 | ✅ 只管理了跨页面共享状态 |
| 命名是否清晰 | ➡️ 调整了 category → type |
| 代码是否简洁 | ✅ 没有多余登录/权限逻辑 |
| 业务是否贴合 | ✅ 围绕校园用户和收藏场景 |

## 七、真实测试记录

测试时间：2026-06-29，环境：Windows 本地 dev server（localhost:5173）

### 测试一：导航栏用户显示

1. 启动项目，打开首页 `/home`
2. 观察导航栏右侧
3. 结果：蓝色圆形头像显示"张"字，旁边显示"张同学"
4. 结论：`AppHeader.vue` 成功读取 `userStore`

### 测试二：发布数据携带用户身份

1. 进入 `/publish`，选择"二手交易"
2. 填写：标题="Day5测试商品"、分类="其他"、价格="1"、成色="全新"、地点="测试"、描述="测试数据"
3. 点击提交，成功跳转到 `/trade`
4. 检查 db.json，trades 最后一条：
   - `publisher` 为 "张同学" ✓
   - 其余字段与表单填写一致 ✓

### 测试三：收藏功能完整流程

1. 进入 `/trade`，有 6 条商品
2. 点击第一条商品的"🤍 收藏"
   - 按钮变为"❤️ 已收藏"，粉色背景 ✓
3. 点击其他商品继续添加收藏，共收藏 3 条
4. 再次点击已收藏的商品
   - 恢复为"🤍 收藏"，收藏数减 1 ✓
5. 进入 `/profile`，收藏列表显示 2 条 ✓
6. 在个人中心点击收藏项的"取消"按钮
   - 该收藏项从列表中消失 ✓
7. 回到 `/trade`，对应商品的按钮已恢复为未收藏状态 ✓

### 测试四：个人中心数据聚合

1. 进入 `/profile`
2. 用户资料区显示：
   - 头像："张" ✓
   - 学号、学院、手机与 db.json 一致 ✓
3. "我的发布"显示发布数量 ✓
4. "我的收藏"显示当前收藏列表 ✓

### 测试五：收藏数据刷新丢失验证

1. 在 `/trade` 添加收藏后，手动刷新浏览器
2. 结果：收藏按钮全部恢复为"🤍 收藏"
3. 结论：符合预期——Day5 收藏保存在内存中，刷新后丢失

## 八、最终交付

| 交付物 | 说明 |
|--------|------|
| `src/stores/user.ts` | 用户状态 Store（昵称/学号/学院/手机，组合式 API） |
| `src/stores/favorite.ts` | 收藏状态 Store（添加/取消/判断/计数） |
| `src/components/AppHeader.vue` | 导航栏右侧显示当前用户 |
| `src/views/PublishView.vue` | publisher 从 `userStore.nickname` 读取 |
| `src/views/TradeView.vue` | 商品卡片底部收藏按钮 |
| `src/components/ItemCard.vue` | 新增 `#footer` 具名插槽 |
| `src/views/UserCenterView.vue` | 用户资料 + 收藏列表 + 发布统计 |

## 九、本日小结

Day5 的核心收获是理解了"前端状态管理"的实际价值。在引入 Pinia 之前，用户信息分散在各个组件中，收藏操作无法跨页面同步。引入 Pinia 后，`userStore` 和 `favoriteStore` 成为了全局可信数据源，任何组件只要引入 Store，就能读取或修改共享状态。

一个重要的设计原则是：**不是所有数据都适合放入 Store**。只有那些需要在多个页面或组件之间共享的状态，才值得用 Pinia 管理。表单输入、临时 UI 状态、单页使用的接口数据，都应该留在组件内部。

Day5 没有实现真实登录、权限控制或持久化存储。这些是 Day6 和 Day7 的任务。
