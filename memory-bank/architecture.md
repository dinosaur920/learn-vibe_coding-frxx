# 架构概览：凡人修仙传·掌上仙途（MVP 起步阶段）

## 1. 总体结构

- 项目类型：Nuxt 3 单体应用（前后端一体），运行在 Node.js 环境，后端由 Nitro 驱动。
- 语言与类型系统：全栈 TypeScript，前端组件与后端 API 共用统一类型定义。
- 数据存储：Prisma + SQLite（开发期），后续可平滑迁移到 PostgreSQL。
- 目标：支撑 MVP 的三大核心闭环——创建角色、挂机修炼、境界突破，并为后续洞府与行囊系统预留扩展空间。

## 2. 根目录关键文件与作用

- `package.json`
  - 管理项目依赖与脚本。
  - 核心脚本：
    - `dev`: 启动 Nuxt 开发服务器。
    - `build`: 构建生产包。
    - `preview`: 预览构建结果。
    - `start`: 启动生产环境服务器。
  - 关键依赖：
    - `nuxt`: Nuxt 3 框架核心。
    - `@pinia/nuxt` 与 `pinia`: 全局状态管理，后续承载玩家信息、行囊、洞府状态。
    - `@vant/nuxt` 与 `vant`: 移动端 UI 组件库，用于构建修炼面板、洞府、行囊等界面。
    - `@vueuse/nuxt` 与 `@vueuse/core`: 提供如 `useIntervalFn` 等组合式工具，用于实现挂机轮询、定时刷新。
    - `@prisma/client` 与 `prisma`: 数据访问层，统一管理 User、洞府、行囊等数据库模型。
    - `dayjs`: 时间与冷却逻辑处理库。

- `nuxt.config.ts`
  - 使用 `defineNuxtConfig` 声明应用配置。
  - `modules`:
    - 注册 `@pinia/nuxt`、`@vant/nuxt`、`@vueuse/nuxt` 三个核心模块，使其在页面与组件中可直接使用。
  - `typescript`:
    - `strict: true`: 开启 TS 严格模式，保证类型安全。
    - `typeCheck: false`: 关闭 dev 阶段的实时 vue-tsc 检查，避免第三方插件路径问题干扰开发；后续可通过独立脚本执行类型检查。
  - `app.head.meta`:
    - 配置 `viewport`，锁定移动端视口，禁用缩放，使 UI 更贴合手机 H5 使用场景。

- `tsconfig.json`
  - 配置 TypeScript 编译选项：
    - 目标与模块均为 `ESNext`，适配现代打包与运行环境。
    - `moduleResolution: "Node"`，支持标准 Node 模块解析。
    - `strict: true`，与 Nuxt 配置一致，确保类型严格。
    - `lib: ["DOM", "DOM.Iterable", "ESNext"]`，为前端与服务器环境提供基础类型声明。
    - `types: ["node", "nuxt"]`，引入 Nuxt 与 Node 的全局类型。
  - `include`:
    - 覆盖 `*.ts` 与 `*.vue` 文件，使前端与后端代码都受 TypeScript 管理。

- `.env`
  - 保存环境变量。
  - 当前仅定义：
    - `DATABASE_URL="file:./dev.db"`：Prisma 指向的 SQLite 数据文件路径。
  - 与 `prisma/schema.prisma` 中的 `datasource db` 配置配合使用，统一数据库连接入口。

## 3. 前端视图层文件

- `app.vue`
  - 应用根组件，所有页面与布局的包裹层。
  - 使用 `<NuxtLayout>` + `<NuxtPage>` 结构：
    - `<NuxtLayout>`：后续可配置默认布局、底部 TabBar 等。
    - `<NuxtPage>`：根据路由渲染具体页面内容。
  - 目前包含一个 Vant 的 `<van-button type="primary">Test</van-button>`：
    - 用于验证 Vant 模块是否正确注册、样式是否加载成功，以及移动端 UI 渲染链路是否畅通。
  - 后续计划：
    - 将底部导航（修炼 / 洞府 / 行囊）放入默认布局组件 `layouts/default.vue`。

- `pages/index.vue`
  - 默认首页路由 `/` 对应的页面。
  - 当前功能：
    - 展示游戏标题文本（例如“凡人修仙传·掌上仙途”），作为项目启动与路由配置无误的验证点。
  - 后续演进：
    - 按实施计划第三、四阶段，将此页面演进为“修炼面板”：
      - 显示玩家基础信息（境界、灵根）。
      - 显示修为进度条。
      - 提供“打坐”、“突破”等交互按钮，并对接后端 API。

## 4. 数据访问层与数据库文件

- `prisma/schema.prisma`
  - Prisma 的 Schema 定义文件。
  - 当前内容：
    - `generator client`：配置 Prisma Client 的生成器。
    - `datasource db`：
      - `provider = "sqlite"`：开发阶段使用 SQLite。
      - `url = env("DATABASE_URL")`：从 `.env` 中读取连接字符串。
  - 角色：
    - 作为所有领域模型（User、洞府、行囊等）的单一事实来源。
    - 后续在第二阶段开始扩展 User 模型与枚举（Realm、SpiritRoot），并通过 `prisma db push` 同步数据库结构。

## 5. 未来文件布局预期（基于实施计划）

> 以下为未来阶段的结构预期，便于后续开发者在阅读本文件时理解即将出现的目录与文件定位。

- `server/api/`
  - 存放后端 API：
    - `server/api/user/register.post.ts`：用户注册。
    - `server/api/user/login.post.ts`：登录与 JWT 签发。
    - `server/api/game/cultivate.post.ts`：修炼结算（挂机 Tick）。
    - `server/api/game/breakthrough.post.ts`：境界突破。
    - `server/api/cave/*.ts`：洞府状态查询、种植、收获。
    - `server/api/inventory/*.ts`：行囊物品查询与更新。

- `stores/`
  - 存放 Pinia Store：
    - `stores/player.ts`：维护玩家登录状态、基础信息以及与后端 Profile 的同步。
    - 后续可能增加 `stores/cave.ts`、`stores/inventory.ts` 等模块化 Store。

- `utils/gameConstants.ts`
  - 前后端共享的游戏配置：
    - 境界列表与每层 `maxCultivation`。
    - 基础修炼速度与灵根/境界系数占位值。
    - 洞府灵草配置（成熟时间、物品 ID、物品类型等）。

随着后续阶段推进，本文件将继续扩充每个新增模块的职责说明，以及它们之间的调用关系与数据流向。  

