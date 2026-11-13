# Social Copilot 项目证明材料（Recruiter-safe）

> 用途：用于 core-qilai/招聘沟通、简历项目附件、面试前项目说明。本文只基于当前仓库内 README、docs、store-assets、截图与真实代码实现整理，不包含未落地承诺、用户数据或私有业务样本。

## 一句话定位

Social Copilot 是一个面向 Telegram Web、WhatsApp Web、Slack Web 的本地优先 AI 聊天回复辅助浏览器扩展。它读取当前页面可见对话上下文，结合语气/意图提示、回复风格、联系人记忆与用户选择，生成 2-3 条候选回复；用户点击后填充或复制，默认不自动发送消息。

## 项目状态与边界

- 当前按私有产品维护，不再作为开源源码项目发布；外层 `README.md` 和 `LICENSE` 已明确私有保留权利。
- 已实现的主交付形态是 Chrome/Edge MV3 浏览器扩展，支持 Telegram Web、WhatsApp Web、Slack Web。
- `packages/mobile` 是 Expo 移动端预览，用于验证核心包复用；代码明确阻止在非开发客户端直接初始化真实 LLM API Key，因此不能对外表述为生产级移动端 App。
- Discord、微信等平台仅作为类型/规划边界存在，不能写成已稳定支持。
- 自动代理是高级实验功能，默认关闭；群聊自动发送禁用，不能写成“全自动代聊”。

## 核心能力

### 1. 多平台聊天页面适配

- `manifest.json` 使用 MV3，按站点注入 content script：Telegram、WhatsApp、Slack。
- `PlatformAdapter` 定义统一接口：页面匹配、联系人提取、消息提取、输入框定位、文本填充、新消息监听、运行时诊断。
- 消息 ID 构造按 `contactKey` 命名空间隔离，降低不同会话消息 ID 冲突风险。

代码证据：

- `packages/browser-extension/manifest.json`
- `packages/browser-extension/src/adapters/base.ts`
- `packages/browser-extension/src/adapters/telegram.ts`
- `packages/browser-extension/src/adapters/whatsapp.ts`
- `packages/browser-extension/src/adapters/slack.ts`

### 2. 本地优先的对话记忆与偏好学习

- 核心包提供 `IndexedDBStore`，保存消息、联系人画像、风格偏好、思路偏好和长期记忆摘要。
- 联系人使用结构化 `ContactKey` 建模，包含平台、应用、会话、对方标识、是否群聊等字段。
- 风格偏好与思路偏好可按联系人记录、重置和导出。
- 设置页支持联系人列表、清除单个联系人数据、导入/导出用户数据备份。

代码证据：

- `packages/core/src/memory/indexeddb-store.ts`
- `packages/core/src/types/contact.ts`
- `packages/core/src/preference/manager.ts`
- `packages/core/src/thought/preference-manager.ts`
- `packages/browser-extension/src/popup/importUserData.ts`
- `packages/browser-extension/src/popup/popup.ts`

### 3. 多模型 LLM 接入与稳定性处理

- `LLMManager` 统一管理 Provider，当前类型支持 DeepSeek、OpenAI、Claude、NVIDIA 和内置 SiliconFlow 配置。
- 支持主备 Provider 故障转移、恢复事件、全失败事件、请求去重、LRU 缓存、AbortSignal 取消。
- 各 Provider 有独立实现与响应校验测试；回复候选通过 schema/解析逻辑做结构化校验。
- 发布态构建会关闭不安全 HTTP 与私有地址开关，降低错误配置风险。

代码证据：

- `packages/core/src/llm/llm-manager.ts`
- `packages/core/src/llm/provider.ts`
- `packages/core/src/llm/openai.ts`
- `packages/core/src/llm/claude.ts`
- `packages/core/src/llm/nvidia.ts`
- `packages/core/src/llm/builtin.ts`
- `packages/core/src/llm/reply-validation.ts`
- `packages/browser-extension/src/background/index.ts`

### 4. 隐私控制与合规可解释性

- 首次使用必须确认隐私告知；未确认时 background 不调用第三方模型。
- 出站上下文支持最近消息条数、单条字符数、总字符预算控制。
- 默认支持邮箱、手机号、链接脱敏，以及发送人昵称匿名化。
- API Key 默认不持久化；当 `chrome.storage.session` 不可用时才用本地临时降级键，并设置启动清理与滑动 TTL。
- 诊断事件采用环形缓冲并做密钥脱敏，不应导出原文聊天内容。
- Chrome Web Store 文案、权限说明、隐私政策模板与公开隐私页面均已维护。

代码/文档证据：

- `packages/core/src/privacy/sanitize.ts`
- `packages/core/src/utils/redact.ts`
- `packages/browser-extension/src/background/index.ts`
- `docs/PRIVACY.md`
- `docs/PRIVACY.zh-CN.md`
- `docs/STORE_COPY.md`
- `store-assets/copy/privacy-disclosure.zh-CN.md`
- `store-assets/copy/permissions-justification.zh-CN.md`

### 5. 产品化交付与上架物料

- 已准备 Chrome Web Store 截图 4 张，均为 1280 x 800；小宣传图为 440 x 280。
- `store-assets` 包含短描述、详细描述、隐私披露、权限说明、审核备注等上架文案。
- 发布脚本会执行 release build、manifest/权限校验、产物完整性校验并打包 zip。
- GitHub Actions 包含 PR/push CI、每周定时 CI、CodeQL、Pages、tag release 扩展包发布流程。

证据：

- `store-assets/screenshots/01-reply-panel.png` 到 `04-platforms.png`
- `store-assets/promotional/small-promo-440x280.png`
- `store-assets/SUBMISSION_PACKAGE.md`
- `scripts/validate-release.mjs`
- `scripts/package-extension.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/release-extension.yml`

## 真实技术点提炼

- TypeScript monorepo：pnpm workspace 管理 `core`、`browser-extension`、`mobile` 三个包。
- Chrome Extension MV3：background service worker、content scripts、popup/options UI、站点 host permissions、web accessible resources。
- 平台适配器模式：把 DOM 抽取、输入框填充、新消息监听与平台差异隔离，便于新增平台或修复 DOM 变更。
- LLM Provider 抽象：统一 DeepSeek/OpenAI/Claude/NVIDIA/内置服务接口，集中处理 fallback、重试、缓存、取消、结构化输出解析。
- 隐私工程：出站上下文预算、PII 脱敏、昵称匿名化、API Key 默认非持久化、诊断脱敏、发布态配置收敛。
- 本地数据模型：IndexedDB 保存消息、画像、偏好、长期记忆摘要；用户可在设置页导入/导出和按联系人清理。
- Prompt Hook：核心包提供可插拔 prompt hook，用于不改 Provider 的情况下扩展系统/用户提示词。
- 质量门禁：lint、typecheck、Vitest、架构边界检查、发布校验、Playwright smoke 脚本、CI 产物上传。

## 结果证据

- 当前包版本：`social-copilot/package.json`、`packages/*/package.json`、`manifest.json` 均为 `1.0.0`，发布校验脚本会强制版本一致。
- 代码规模证据：`packages/` 下当前有 119 个 TypeScript/TSX 文件，44 个测试文件。
- 测试结构：核心包覆盖 LLM、memory、privacy、profile、preference、thought、types、utils；扩展包覆盖 adapter、popup、remote config、XSS、accessibility、UI states 等。
- 商店素材：4 张 1280 x 800 截图 + 1 张 440 x 280 宣传图已在 `store-assets` 中准备。
- 发布路径：`pnpm release:extension` 会构建 release 版本、校验 manifest/权限/产物完整性并生成 Chrome Web Store zip。
- CI 路径：PR/push 默认执行 boundary guard、依赖安全审计、lint、typecheck、test、架构审计和 release zip 构建。

## 简历可用简介

Social Copilot 是一个 TypeScript monorepo 实现的本地优先 AI 聊天回复辅助 Chrome 扩展，面向 Telegram Web、WhatsApp Web、Slack Web。项目将平台 DOM 适配、核心 LLM 编排、IndexedDB 本地记忆、隐私脱敏、设置/诊断/导入导出和 Chrome Web Store 发布流程拆分为可测试模块；支持多 Provider（DeepSeek/OpenAI/Claude/NVIDIA/内置服务）、主备故障转移、回复结构化校验、Prompt Hook 和发布态权限校验，已配套商店截图、隐私政策、发布清单与 CI/CD。

## 简历项目亮点

- 设计并实现 MV3 浏览器扩展架构：以统一 `PlatformAdapter` 抽象适配 Telegram/WhatsApp/Slack 的消息抽取、输入框填充和新消息监听，将平台 DOM 差异隔离在 content script 层。
- 搭建可扩展 LLM 核心包：封装 DeepSeek/OpenAI/Claude/NVIDIA/内置服务 Provider，支持主备故障转移、请求去重、LRU 缓存、Abort 取消、结构化回复校验和 Prompt Hook 扩展。
- 强化隐私与发布工程：实现出站上下文预算、PII 脱敏、昵称匿名化、API Key 默认非持久化、诊断脱敏、本地数据导入导出，并通过 release 校验脚本和 CI 流程约束权限、版本一致性与上架 zip 产物。

## 面试可展开问题

- 为什么选择浏览器扩展而不是后端代理或桌面端？
- 三个平台 DOM 频繁变化时，适配器如何诊断和恢复？
- API Key 默认非持久化会牺牲哪些体验？为什么这样取舍？
- LLM 输出如何防止非 JSON、空回复、风格不匹配或 provider 差异？
- 自动代理为什么默认关闭，群聊为什么禁用自动发送？
- 移动端为什么只做预览并禁止生产客户端直连真实 API Key？

## 不建议对外宣称

- 不说“已开源可商用”，当前仓库已改为私有保留权利。
- 不说“支持微信/Discord”，当前稳定支持只写 Telegram Web、WhatsApp Web、Slack Web。
- 不说“无需 API Key”，当前 README 和代码均以 BYOK/可配置模型服务为核心。
- 不说“端到端加密”或“绝不上传任何内容”，生成回复时会把必要上下文发送给用户选择的第三方模型服务。
- 不说“生产级移动端”，移动端当前是 Expo 预览，生产使用真实 API Key 需要后端代理。
- 不说“全自动代聊”，自动代理是高级实验能力，默认关闭且存在明确风险提示。
