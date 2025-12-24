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
- 通过本地手动测试（页面与接口调用）验证注册、登录、Profile 查询与 Cookie 管理均按设计运行，完成实施计划第二阶段全部验收项。

## 2025-12-24 - 第三阶段：核心玩法 - 修炼循环

- 扩展游戏数值配置：在 `utils/gameConstants.ts` 中新增修炼相关常量与工具函数：
  - `BASE_CULTIVATION_PER_SECOND` 基础每秒修为增长值。
  - 灵根系数与境界系数映射，分别影响不同灵根与境界下的修炼速度。
  - `calculateCultivationGainPerSecond` 等工具，用于在后端统一计算单位时间修为增量。  
- 实现修炼结算后端 API：`server/api/game/cultivate.post.ts`：
  - 从 JWT 中解析当前用户，读取 `realm`、`spiritRoot`、`cultivation`、`maxCultivation` 与 `lastCultivateAt`。
  - 根据当前时间与 `lastCultivateAt` 的秒级时间差，结合基础速度与两类系数计算修为增量，并限制不超过 `maxCultivation`。
  - 采用“按需结算 + 离线补算”模式：仅在调用修炼接口时进行结算，但会一次性补算离线期间的修为。  
- 扩展玩家 Store：在 `stores/player.ts` 中新增 `cultivate` 动作：
  - 调用 `/api/game/cultivate`，按统一返回结构处理成功与错误。
  - 未授权时清空本地 `playerInfo`，便于前端跳转登录。  
- 将首页升级为“修炼面板”：`pages/index.vue`：
  - 展示玩家基础信息（道号、境界、灵根）和修为进度条（基于 `cultivation / maxCultivation`）。
  - 提供“打坐修炼”按钮，手动触发一次修炼结算。
  - 使用 `useIntervalFn` 实现挂机修炼开关，每秒自动调用一次修炼接口，并在组件卸载时停止轮询。  
- 通过实际页面操作完成第三阶段功能验证：
  - 注册/登录后进入首页，可以看到修为随“打坐修炼”与挂机开关稳定增长。
  - 多次刷新页面与重新登录，修为数值保持一致，且长时间不登录后再次进入时，会在首次结算时一次补算离线期间修为。
