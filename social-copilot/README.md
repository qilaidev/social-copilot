# Social Copilot（聊天导师）

> Local-first AI chat reply assistant for Telegram Web, WhatsApp Web, and Slack Web.
> 面向主流 Web 聊天工具的 AI 回复建议与填充浏览器扩展，强调隐私可控、BYOK 模型配置和用户确认发送。

快速入口：[仓库入口](../README.md) · [隐私政策站点](https://qilaidev.github.io/social-copilot/privacy.zh-CN.html) · [研发文档](docs/README.md) · [架构设计](docs/ARCHITECTURE.md) · [配置说明](docs/CONFIGURATION.md)

## 项目定位

Social Copilot 是一个 TypeScript monorepo，核心产物是 Chrome / Edge Manifest V3 浏览器扩展。扩展在支持的聊天网页中读取当前可见对话，生成 2-3 条候选回复，并允许用户点击填充或复制。

项目的设计重点不是“自动代聊”，而是降低回复起草成本，同时保留人的判断和发送控制权。默认没有 Social Copilot 自建后端；LLM 调用走用户配置的 API Key 或明确配置的模型服务。

## 当前状态

本工作区当前按私有产品维护，不再作为开源项目对外发布源码。Chrome Web Store 物料、公开隐私政策页面和扩展发布流程可以继续维护，但它们不代表源码开放授权。

## 适合谁

- 需要在 Telegram / WhatsApp / Slack 中快速起草回复的个人用户。
- 做客服、社群、招聘、BD、远程协作的人，希望先拿到可编辑草稿再自行发送。
- 想研究 AI chat reply assistant、browser extension、LLM Provider、Prompt Hook、local-first storage 的 TypeScript 开发者。
- 需要私有化维护 BYOK AI reply extension 的团队。

## 核心功能

- **智能回复建议**：基于当前对话上下文生成 2-3 条候选回复。
- **多风格草稿**：支持关心、幽默、随意、理性、正式等回复风格。
- **轻量语气/意图提示**：识别“需要支持 / 寻求帮助 / 轻松玩笑 / 中性”等辅助语境，不做心理或医学诊断。
- **思路卡片**：共情、解决方案、幽默、中性等方向会注入 prompt，帮助回复更贴合意图。
- **联系人画像与偏好学习**：本地记录联系人画像、风格选择和思路偏好。
- **本地优先存储**：聊天消息、画像、偏好、长期记忆摘要默认保存在 IndexedDB / chrome.storage。
- **隐私控制**：出站前默认脱敏邮箱/手机号/链接，并匿名化昵称；发送条数和字符预算可配置。
- **多模型支持**：DeepSeek、OpenAI、Claude、NVIDIA，以及内置 SiliconFlow/DeepSeek-V3 路径。
- **主备故障转移**：支持备用 Provider / 模型 / API Key，并记录诊断事件。
- **快捷操作**：自动弹出可关闭，`Alt+S` 可手动触发，`Esc` 关闭面板。
- **备份恢复与诊断**：导出本地偏好/画像/记忆数据，导出脱敏诊断 JSON。
- **移动端预览**：Expo 客户端可用于开发演示；生产环境不应直连真实 API Key。

## 支持平台

| 平台 | 状态 | 说明 |
|------|------|------|
| Telegram Web | 支持 | 支持 K 版和 A 版，依赖 Web DOM 结构 |
| WhatsApp Web | 支持 | 通过 content script 读取会话并填充输入框 |
| Slack Web | 支持 | 支持 `https://app.slack.com/*` |
| Discord | 计划中 | 未进入稳定支持 |
| WeChat / 微信 | 未支持 | 当前没有稳定 Web / 桌面适配器 |

## 技术栈

- TypeScript + pnpm workspace
- Chrome / Edge Manifest V3 extension
- Vite + Vitest + ESLint
- IndexedDB + `chrome.storage.local` / `chrome.storage.session`
- LLM Provider abstraction：DeepSeek / OpenAI / Claude / NVIDIA / Builtin
- Expo / React Native mobile preview

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 10.0.0
- Chrome 或 Edge 浏览器

### 安装与构建

```bash
pnpm install
pnpm build
```

### 发布打包（Chrome Web Store 上传用）

```bash
pnpm release:extension
```

产物输出：`packages/browser-extension/release/social-copilot-<version>.zip`。

### 本地 CI（推荐）

```bash
pnpm ci:local
```

本地 CI 会执行边界检查、依赖安全审计、架构审计、lint、typecheck、测试和 release 打包。

### 本地端到端 Smoke（可选）

需要你已在目标网站登录并进入任意聊天视图，否则会判定适配器健康失败。

```bash
pnpm e2e:smoke
SC_E2E_TARGETS=telegram,slack pnpm e2e:smoke
SC_E2E_CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" pnpm e2e:smoke
```

### 加载扩展

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `packages/browser-extension/dist`

### 配置

1. 点击扩展图标打开设置。
2. 勾选「隐私告知」确认，未确认时不会调用第三方模型。
3. 选择模型提供商：普通模式走内置路径；高级模式可选 DeepSeek / OpenAI / Claude / NVIDIA。
4. 填写 API Key；默认不持久化保存，除非手动开启。
5. 可选填写 Base URL；release 构建默认只允许官方域名，不支持私有网段或明文 HTTP。
6. 可选填写模型名称；不填则使用代码中的默认模型。
7. 可选启用备用模型，实现主备故障转移。
8. 选择默认回复风格、回复条数、语言、上下文条数和字符预算。
9. 可选关闭「收到消息自动生成建议」，仅通过 `Alt+S` 手动触发。
10. 高级自动代理属于实验功能，默认关闭；群聊不自动发送。

### 使用

1. 打开 Telegram Web、WhatsApp Web 或 Slack Web。
2. 进入任意聊天视图。
3. 收到消息时建议面板会自动弹出，或按 `Alt+S` 手动触发。
4. 查看语气/意图提示和思路卡片。
5. 点击候选回复填充到输入框，或点击复制后手动粘贴。
6. 按 `Esc` 关闭面板。

### 移动端预览（可选）

预览版移动客户端使用 Expo 直连核心 LLM，仅限开发预览，生产需改用后端代理：

```bash
EXPO_PUBLIC_LLM_API_KEY=<你的 API Key> \
EXPO_PUBLIC_LLM_PROVIDER=deepseek \
EXPO_PUBLIC_LLM_MODEL=deepseek-v3.2 \
pnpm --filter @social-copilot/mobile start
```

不要把真实生产 API Key 打进移动端发布包。

## 项目结构

```text
social-copilot/
├── packages/
│   ├── core/                    # 核心逻辑：类型、LLM、存储、画像、偏好、思路
│   ├── browser-extension/       # Chrome / Edge 扩展
│   └── mobile/                  # Expo 移动端预览
├── docs/                        # 研发、隐私、运维、发布、商店文档
├── openspec/                    # 规格驱动变更记录
├── scripts/                     # 本地 CI、release、smoke、审计脚本
└── CHANGELOG.md                 # 更新日志
```

## 文档

- [文档导航](docs/README.md)：按角色和任务查找文档
- [开发指南](docs/DEVELOPMENT.md)：环境配置、构建流程、调试技巧
- [架构设计](docs/ARCHITECTURE.md)：系统架构、模块设计、数据流
- [API 文档](docs/API.md)：核心模块 API 参考
- [配置说明](docs/CONFIGURATION.md)：配置项、环境变量与安全注意事项
- [平台适配器开发](docs/ADAPTER_DEVELOPMENT.md)：新增聊天平台适配
- [LLM 接入](docs/LLM_INTEGRATION.md)：新增模型 Provider
- [隐私政策](docs/PRIVACY.md)：数据处理与用户告知
- [运行手册](docs/RUNBOOK.md)：排障、恢复与回滚
- [上线清单](docs/RELEASE_CHECKLIST.md)：Chrome Web Store 发布检查项
- [商店文案](docs/STORE_COPY.md)：Chrome Web Store 文案模板
- [Prompt Hook 扩展](docs/OPEN_CORE.md)：私有 prompt 策略扩展边界

## 隐私与安全边界

- 所有聊天数据默认存储在浏览器本地。
- API Key 默认写入 session storage；只有开启持久化时才写入 local storage。
- 仅在生成回复、画像或记忆摘要时发送必要上下文到你选择的模型服务。
- 默认发送前做 PII 脱敏与昵称匿名化，可在设置中关闭。
- 诊断导出不包含原文对话和 API Key。
- 远程选择器配置只从 `raw.githubusercontent.com` 拉取 JSON，不包含聊天内容。

更详细的说明见 [隐私政策](docs/PRIVACY.md) 与 [配置说明](docs/CONFIGURATION.md)。

## 限制与注意事项

- 生成结果只是草稿，需用户自行判断和发送。
- 不支持绕过平台风控、登录限制、反机器人保护或批量自动化。
- 不适合替代法律、医疗、心理、财务等高风险判断。
- 平台 DOM 更新可能导致适配器失效，需要通过发版或远程选择器修复。
- 移动端预览不等于生产移动端方案。
- 当前源码私有保留权利，见 [../LICENSE](../LICENSE)。

## 搜索关键词

AI 聊天助手、AI 聊天回复助手、AI 聊天导师、浏览器扩展 AI 回复、Chrome 扩展聊天助手、Telegram AI 回复、WhatsApp AI 回复助手、Slack AI reply assistant、BYOK LLM assistant、local-first AI assistant、browser extension chat reply assistant、AI social reply assistant、LLM prompt assistant、TypeScript browser extension。
