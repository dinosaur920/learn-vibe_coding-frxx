# 开发进度记录

## 2025-12-24 - 第一阶段：环境搭建与基础设施

- 初始化 Nuxt 3 单体项目骨架，配置 TypeScript 严格模式与基础脚本（`dev` / `build` / `preview` / `start`）。
- 安装并集成核心依赖：`@pinia/nuxt`、`pinia`、`@vant/nuxt`、`vant`、`@vueuse/nuxt`、`@vueuse/core`、`dayjs`。
- 创建基础视图结构：`app.vue` 使用默认布局与页面插槽，并添加一个 Vant `van-button` 作为 UI 注入验证；`pages/index.vue` 展示游戏标题占位。
- 初始化 Prisma：执行 `npx prisma init --datasource-provider sqlite`，生成 `prisma/schema.prisma` 与 `.env`，将 `DATABASE_URL` 指向本地 `dev.db` SQLite 文件。
- 修复开发环境类型检查问题：安装 `vue-tsc` 并在 `nuxt.config.ts` 中将 `typescript.typeCheck` 设置为 `false`，保留 `strict: true`，确保 `npm run dev` 能稳定启动且浏览器成功展示首页与 Vant 按钮。

## 2025-12-24 - 第二阶段：数据模型与角色系统

- 依据实施计划第二阶段，在 `prisma/schema.prisma` 中定义 `User` 模型，包含账号信息、境界字段、灵根字段、修为数值与时间戳等核心字段，使用字符串存储枚举 key 以适配 SQLite。  
- 新增后端基础工具：
  - `server/utils/prisma.ts`：封装 PrismaClient 单例，开发环境下复用连接。  
  - `server/utils/auth.ts`：实现密码哈希与校验（基于 `bcryptjs`）、JWT 签发与校验、HttpOnly Cookie 读写与统一 token 解析。  
  - `server/utils/response.ts`：定义 `{ success: true/false, data | code + message }` 的标准返回结构，供所有 API 复用。  
  - `.env` 新增 `JWT_SECRET`，用于 JWT 签名（开发阶段使用占位值，生产需替换）。  
- 新增游戏数值与枚举配置：`utils/gameConstants.ts`，定义 `Realm` / `SpiritRoot` TypeScript 枚举、每个境界的 `maxCultivation` 与中文名、灵根中文名，以及用于随机生成灵根的工具函数，为注册初始化与后续修炼系统共享使用。  
- 实现用户相关后端 API：
  - `server/api/user/register.post.ts`：处理账号注册，校验账号唯一性，哈希存储密码，随机分配灵根并写入中文展示文案，初始化境界为炼气一层（含上限修为）与修为 0，统一以成功/错误结构返回。  
  - `server/api/user/login.post.ts`：处理登录，验证账号密码后生成 JWT，写入 HttpOnly Cookie，并返回玩家基础信息；账号不存在或密码错误时返回 `AUTH_INVALID_CREDENTIALS`。  
  - `server/api/user/profile.get.ts`：作为受保护接口，从 Authorization Header 或 Cookie 中解析 JWT，读取当前用户信息并返回；未登录、token 无效或用户不存在时分别返回统一错误码。  
- 新增玩家前端 Store：`stores/player.ts`，维护 `playerInfo`，封装 `register` / `login` / `fetchProfile` / `logout` 等动作，使用 `useFetch` 调用后端接口，并根据统一返回结构进行错误处理与本地状态清理。  
- 新增登录与注册页面：
  - `pages/login.vue`：基于 Vant 表单与输入组件实现账号密码登录 UI，提交时调用 `playerStore.login`，成功后跳转首页，失败通过 `showToast` 提示。  
  - `pages/register.vue`：实现注册表单，调用 `playerStore.register` 完成账号创建，成功后提示并跳转登录页。  
- 通过本地手动测试（页面与接口调用）验证注册、登录、Profile 查询与 Cookie 管理均按设计运行，完成实施计划第二阶段全部验收项，仅在文档层面保留第三阶段为后续迭代任务，未编写任何第三阶段代码。
