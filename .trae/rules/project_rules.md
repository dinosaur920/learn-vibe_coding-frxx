# 项目开发规范 (Project Development Rules)

本文档旨在指导大模型（及开发者）在开发《凡人修仙传·掌上仙途》项目时需遵循的技术规范、代码风格及业务理解准则。

# 重要提示 (Important Hints)

> **⚠️ 必须强制阅读 (Mandatory Reading)**

- **写任何代码前必须完整阅读** `memory-bank/@architecture.md`（包含完整数据库结构）
- **写任何代码前必须完整阅读** `memory-bank/@game-design-document.md`
- **每完成一个重大功能或里程碑后，必须更新** `memory-bank/@architecture.md`

## 1. 核心原则 (Core Principles)

- **语言统一**: 全栈使用 **TypeScript**。禁止使用 JavaScript，除非配置文件强制要求。
- **类型安全**: 必须定义明确的 Interface/Type。后端 API 返回的数据类型必须与前端共享或自动推导，严禁使用 `any`。
- **极简架构**: 遵循 **Nuxt 3** 单体架构，前后端不分离部署，利用 Nitro 引擎处理 API。
- **移动优先**: UI 设计与交互必须针对移动端 H5 优化，使用 **Vant 4** 组件库。
- **代码组织**: 强调模块化（多文件），禁止单体巨文件 (monolith)。

## 2. 技术栈强制约束 (Tech Stack Constraints)

在生成代码或回答技术问题时，必须严格遵守以下技术选型：

| 领域 | 选型 | 备注 |
| :--- | :--- | :--- |
| **全栈框架** | **Nuxt 3** | 核心框架，负责前后端胶水层 |
| **前端框架** | **Vue 3** | 使用 `<script setup lang="ts">` 语法 |
| **UI 组件库** | **Vant 4** | 移动端组件，禁止引入 Element Plus 或 AntD |
| **状态管理** | **Pinia** | 禁止使用 Vuex |
| **后端引擎** | **Nitro** | Nuxt 内置，API 位于 `server/api` 目录 |
| **ORM** | **Prisma** | 数据库操作唯一入口，禁止手写 SQL |
| **数据库** | **SQLite** | 开发阶段使用，生产环境可迁至 PostgreSQL |
| **工具库** | **VueUse** | 优先使用其提供的 Composable (如 `useIntervalFn`) |
| **时间处理** | **Day.js** | 处理游戏内时间与冷却 |

## 3. 代码开发规范 (Coding Standards)

### 3.1 TypeScript & 类型系统
- **接口定义**: 所有的领域模型（如 User, Item, Cultivation）应定义在 `types/` 目录或 Prisma Schema 中。
- **前后端类型共享**: 利用 Nuxt 3 的特性，前端调用 `useFetch('/api/xxx')` 时应能自动获得后端返回的类型推导。

### 3.2 Vue 3 / Nuxt 3 前端
- **组件风格**: 必须使用 Composition API (`<script setup>`)。
- **路由**: 使用 Nuxt 的文件系统路由 (`pages/` 目录)，不要手动配置 Router。
- **状态管理**: Store 定义在 `stores/` 目录，使用 `defineStore`。
- **样式**: 推荐使用 Scoped CSS 或 Tailwind CSS (如果已集成)，遵循 Vant 主题定制规范。

### 3.3 后端 (Nitro + Prisma)
- **API 路径**: 所有后端接口文件存放在 `server/api/` 下。
- **数据库操作**:
    1.  先修改 `prisma/schema.prisma`。
    2.  运行 `npx prisma db push` 或 `migrate` 更新数据库。
    3.  使用 `prisma.user.findUnique(...)` 等生成的强类型方法操作数据。
- **错误处理**: 使用 `createError` 抛出标准 HTTP 错误。

## 4. 业务领域知识 (Domain Knowledge)

在编写业务逻辑时，需参考《游戏设计文档》，准确使用以下术语：

- **境界 (Realms)**: 炼气 (Qi Refining), 筑基 (Foundation Establishment), 结丹 (Core Formation), 元婴 (Nascent Soul) 等。
- **货币**: 灵石 (Spirit Stones)。
- **核心资源**: 绿液 (Green Liquid - 用于催熟), 修为 (Cultivation Base - 经验值)。
- **属性**: 神识 (Spiritual Sense), 灵根 (Spirit Roots).

## 5. 工作流指引 (Workflow Guide)

当被要求实现一个新功能时（例如“添加打坐功能”）：
1.  **数据层**: 检查 `schema.prisma` 是否需要新增字段（如 `cultivation`, `realm`），并执行迁移。
2.  **后端**: 在 `server/api/` 创建对应接口（如 `server/api/cultivate.post.ts`），处理逻辑并返回数据。
3.  **状态层**: 在 Pinia Store 中添加对应 Action 调用 API。
4.  **UI 层**: 在 Vue 组件中使用 Vant 组件展示，并调用 Store 方法。

---
**注意**: 在回答用户问题时，请优先参考本项目已有的 `.md` 文档（tech-stack.md 和 game-design-document.md）中的设定。
