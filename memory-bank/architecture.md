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
  - 关键变量：
    - `DATABASE_URL="file:./dev.db"`：Prisma 指向的 SQLite 数据文件路径。
    - `JWT_SECRET="dev-secret"`：JWT 签名密钥，当前为开发占位值，生产环境需替换为安全随机字符串。
  - 与 `prisma/schema.prisma` 中的 `datasource db` 配置配合使用，统一数据库连接入口；同时为后端认证模块提供密钥。

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

- `pages/login.vue`
  - 登录页面，对应路由 `/login`。
  - 使用 Vant 的 `van-form`、`van-field`、`van-button` 组件构建账号密码登录表单。
  - 提交时调用 `stores/player.ts` 中的 `login` 动作，成功后跳转到首页；失败时通过 `showToast` 显示统一错误提示。
  - 主要职责：完成“进入游戏”的入口，引导已有账号用户快速登录。

- `pages/register.vue`
  - 注册页面，对应路由 `/register`。
  - 使用 Vant 表单组件收集账号密码，调用 `stores/player.ts` 中的 `register` 动作创建新用户。
  - 注册成功后提示玩家并跳转回登录页，形成登录前的简单两步流程。
  - 主要职责：完成新玩家账号创建，并为后续绑定更多信息（如邮箱）预留空间。

## 4. 数据访问层与数据库文件

- `prisma/schema.prisma`
  - Prisma 的 Schema 定义文件。
  - 当前内容：
    - `generator client`：配置 Prisma Client 的生成器。
    - `datasource db`：
      - `provider = "sqlite"`：开发阶段使用 SQLite。
      - `url = env("DATABASE_URL")`：从 `.env` 中读取连接字符串。
    - `model User`：
      - `username`、`passwordHash`、`email` 等账号凭证字段。
      - `realm` / `realmLabel`：以字符串存储当前境界的枚举 key 与中文名。
      - `spiritRoot` / `spiritRootLabel`：以字符串存储灵根类型与展示文案。
      - `cultivation` / `maxCultivation`：当前修为值及其上限。
      - `lastCultivateAt`：上次修炼结算时间。
      - `createdAt` / `updatedAt`：通用审计时间戳。
  - 角色：
    - 作为所有领域模型（User、洞府、行囊等）的单一事实来源。
    - 当前已完成 User 模型的定义与数据库同步，为后续修炼、突破与洞府功能提供统一用户数据基础。

## 5. 后端通用工具与 API 层

- `server/utils/prisma.ts`
  - 封装 PrismaClient 单例，避免开发环境下热重载导致的多连接问题。
  - 根据 `NODE_ENV` 配置日志级别，在开发期输出查询与警告便于调试，生产仅保留错误日志。

- `server/utils/auth.ts`
  - 提供认证相关的底层能力：
    - `hashPassword` / `verifyPassword`：基于 `bcryptjs` 实现密码哈希与验证，使用固定成本参数保证安全性与性能平衡。
    - `signAuthToken` / `verifyAuthToken`：使用 `JWT_SECRET` 签发与验证 HS256 JWT，统一包含 `userId` 与过期时间。
    - `getTokenFromRequest`：从 `Authorization: Bearer` 头或 HttpOnly Cookie `auth_token` 中解析 token。
    - `setAuthCookie` / `clearAuthCookie`：设置或清除 HttpOnly Cookie，生产环境开启 `secure` 标记。
  - 角色：所有需要身份校验的 API 的通用依赖，是“账号系统”与后续“挂机修炼”、“洞府”等受保护接口的安全基石。

- `server/utils/response.ts`
  - 统一约束后端返回结构：
    - 成功：`{ success: true, data: T }`。
    - 失败：`{ success: false, code: string, message: string }`。
  - 角色：为前端提供稳定的错误码与文案，方便 UI 层做统一处理（如 toast、重定向登录）。

- `server/api/user/register.post.ts`
  - 负责新玩家注册：
    - 校验用户名与密码必填。
    - 检查用户名唯一性，冲突时返回 `AUTH_USERNAME_TAKEN`。
    - 生成密码哈希，随机分配灵根（基于 `utils/gameConstants.ts`），初始化境界为炼气一层，设置修为与上限，并记录 `lastCultivateAt`。
  - 返回不包含密码哈希的脱敏用户信息。

- `server/api/user/login.post.ts`
  - 负责账号登录：
    - 校验凭证并验证密码哈希。
    - 登录成功后签发 JWT，写入 HttpOnly Cookie，并返回玩家基础信息。
    - 登录失败时统一返回 `AUTH_INVALID_CREDENTIALS`，隐藏具体失败原因。

- `server/api/user/profile.get.ts`
  - 受保护接口，用于在前端刷新玩家信息：
    - 从 Header 或 Cookie 中解析 JWT，验证后根据 `userId` 读取用户。
    - 未登录、token 无效或用户被删除时返回 `AUTH_UNAUTHORIZED` 或 `USER_NOT_FOUND`。
  - 角色：为前端 Store 提供“当前登录玩家”的权威数据来源。

## 6. 状态管理层

- `stores/player.ts`
  - 基于 Pinia 的玩家 Store：
    - `state`：维护 `playerInfo`（当前登录玩家信息）与预留的 `token` 字段。
    - `actions`：
      - `register`：调用注册接口，成功后更新本地玩家信息。
      - `login`：调用登录接口，依赖服务端 Cookie 持久化 token，仅在前端保存玩家基础信息。
      - `fetchProfile`：调用 `/api/user/profile` 刷新信息，未授权时清空本地状态。
      - `logout`：清除本地玩家信息（正式登出接口可在后续阶段扩展）。
  - 角色：串联认证 API 与界面，作为全局“玩家会话”的单一读写入口。

## 7. 未来文件布局预期（基于实施计划）

> 以下为未来阶段的结构预期，便于后续开发者在阅读本文件时理解即将出现的目录与文件定位。

- `server/api/`
  - 已实现：
    - `server/api/user/register.post.ts`：用户注册。
    - `server/api/user/login.post.ts`：登录与 JWT 签发。
    - `server/api/user/profile.get.ts`：获取当前登录玩家信息。
  - 未来待实现（第三阶段及以后）：
    - `server/api/game/cultivate.post.ts`：修炼结算（挂机 Tick）。
    - `server/api/game/breakthrough.post.ts`：境界突破。
    - `server/api/cave/*.ts`：洞府状态查询、种植、收获。
    - `server/api/inventory/*.ts`：行囊物品查询与更新。

- `stores/`
  - 已实现：
    - `stores/player.ts`：维护玩家登录状态、基础信息以及与后端 Profile 的同步。
  - 未来待实现：
    - `stores/cave.ts`、`stores/inventory.ts` 等模块化 Store。

- `utils/gameConstants.ts`
  - 当前已实现：
    - 炼气一层到炼气十层的境界配置与 `maxCultivation`。
    - 灵根枚举与中文展示文案。
    - 用于注册时随机生成灵根的工具函数。
  - 未来扩展：
    - 核心修炼数值（基础修炼速度、灵根/境界系数）。
    - 洞府灵草配置（成熟时间、物品 ID、物品类型等）。

随着后续阶段推进，本文件将继续扩充每个新增模块的职责说明，以及它们之间的调用关系与数据流向。  
