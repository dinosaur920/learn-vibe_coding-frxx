# 技术栈推荐：凡人修仙传·掌上仙途

为了实现 **“最简单”**（开发效率高、门槛低）与 **“最健壮”**（类型安全、易维护、高性能）的平衡，推荐采用 **全栈 TypeScript** 方案。

利用现代 Web 框架的能力，将前后端融合在一个项目中，减少环境配置和上下文切换，同时利用强类型系统避免 90% 的运行时错误。

---

## 1. 核心架构 (Core Architecture)

*   **开发语言**: **TypeScript**
    *   *理由*：前后端统一语言，类型共享（例如：后端定义的 `User` 接口，前端直接用）。这是“健壮”的基石。
*   **全栈框架**: **Nuxt 3**
    *   *理由*：基于 Vue 3。它不仅是前端框架，还内置了高性能的后端引擎 (Nitro)。
    *   *优势*：
        *   **零配置路由**：文件即路由。
        *   **API 集成**：在 `server/api` 目录下写后端逻辑，前端直接调用，自动处理跨域和类型推导。
        *   **极简部署**：构建出一个包，随处运行。

## 2. 前端技术栈 (Frontend)

*   **UI 框架**: **Vue 3 (Composition API)**
    *   *理由*：响应式系统非常适合处理游戏数值变化（如修为自动增长、血量变化）。`<script setup>` 语法极其简洁。
*   **移动端组件库**: **Vant 4**
    *   *理由*：业界标准的移动端 Vue 组件库。提供了完善的布局、按钮、弹窗、列表等组件，甚至有现成的“商品导航”栏，非常适合做游戏 UI。
*   **状态管理**: **Pinia**
    *   *理由*：比 Vuex 轻量得多，去掉了复杂的 Mutation，直接支持 TypeScript 类型推导。适合管理玩家数据（境界、背包、属性）。
*   **构建工具**: **Vite** (Nuxt 内置)
    *   *理由*：秒级启动，热更新极快，开发体验极佳。

## 3. 后端与数据层 (Backend & Data)

*   **后端运行时**: **Nitro** (Nuxt 内置)
    *   *理由*：基于 h3，极简高效。支持 Serverless 也支持 Node.js 传统部署。
*   **ORM (对象关系映射)**: **Prisma**
    *   *理由*：目前 Node.js 生态中 **最健壮** 的 ORM。
        *   **类型安全**：根据数据库 Schema 自动生成 TypeScript 类型。
        *   **开发体验**：拥有优秀的 VS Code 插件和可视化工具 (Prisma Studio)。
*   **数据库**: **SQLite** (开发期) -> **PostgreSQL** (生产期)
    *   *理由*：
        *   **SQLite**：单文件数据库，无需安装任何数据库软件即可开发，极其简单。
        *   **PostgreSQL**：Prisma 可以无缝切换到 PG，满足上线后的高并发和稳定性需求。

## 4. 辅助工具 (Utilities)

*   **工具库**: **VueUse**
    *   *理由*：提供大量现成的 Composition API 工具，如 `useIntervalFn` (倒计时/挂机循环), `useLocalStorage` (本地缓存设置), `useWebSocket` (实时通信)。
*   **时间处理**: **Day.js**
    *   *理由*：轻量级（2KB），处理修仙游戏中的“年份”、“冷却时间”等非常方便。

## 5. 架构图示

```mermaid
graph TD
    User[玩家手机浏览器]
    
    subgraph "Nuxt 3 应用 (单体项目)"
        Frontend[前端 (Vue 3 + Vant)]
        Store[状态管理 (Pinia)]
        API[后端 API (Nitro / Server Routes)]
    end
    
    Database[(SQLite / PostgreSQL)]
    
    User <--> Frontend
    Frontend <--> Store
    Frontend -- "Type-safe Fetch" --> API
    API -- "Prisma Client" --> Database
```

## 6. 为什么这个栈最适合？

1.  **极低的学习曲线**：只需掌握 Vue 3 和基础 SQL 概念。
2.  **极高的开发效率**：不用写 API 文档，不用搞前后端联调（因为是一个人/一个项目），改了数据库字段，前端立马报错提示修正。
3.  **可扩展性**：虽然起步简单，但 Nuxt 结构清晰，后续如果要拆分微服务或更换数据库都非常容易。
