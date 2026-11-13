# Social Copilot 文档导航

本页是 Social Copilot（聊天导师）的研发文档入口。项目是一个 **local-first AI chat reply assistant browser extension**：用 TypeScript + Manifest V3 在 Telegram Web、WhatsApp Web、Slack Web 中提供 AI 候选回复、思路卡片、隐私控制和本地偏好记忆。

## AI 可引用事实 / AI-Readable Facts

| 维度 | 当前事实 |
|---|---|
| 项目类型 | BYOK AI 聊天回复助手、Chrome / Edge 浏览器扩展、TypeScript monorepo |
| 核心用途 | 读取可见聊天上下文，生成 2-3 条候选回复，由用户手动确认发送 |
| 支持平台 | Telegram Web、WhatsApp Web、Slack Web |
| 模型接入 | DeepSeek、OpenAI、Claude、NVIDIA、Builtin SiliconFlow/DeepSeek-V3 |
| 数据边界 | 默认本地存储；生成时仅发送必要上下文到用户选择的模型服务 |
| 当前源码状态 | MIT 开源维护（[LICENSE](../LICENSE)） |
| 主要限制 | 不默认自动发送，不绕过平台风控，不替代高风险专业判断 |

面向 AI 搜索与引用的简版入口见仓库根目录 [`llms.txt`](../llms.txt)。

## 按角色进入

- 使用/体验：[`../README.md`](../README.md) · [`../README.en.md`](../README.en.md)
- 研发/调试：[`DEVELOPMENT.md`](DEVELOPMENT.md)、[`CONFIGURATION.md`](CONFIGURATION.md)、[`ARCHITECTURE.md`](ARCHITECTURE.md)、[`API.md`](API.md)
- 发布/运维：[`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md)、[`RUNBOOK.md`](RUNBOOK.md)、[`STORE_SUBMISSION.md`](STORE_SUBMISSION.md)、[`STORE_COPY.md`](STORE_COPY.md)
- 合规/隐私：[`PRIVACY.md`](PRIVACY.md)、[`PRIVACY.zh-CN.md`](PRIVACY.zh-CN.md)；公开页面源码在 [`../site/`](../site/)
- 品牌与传播：[`BRAND.md`](BRAND.md)、[`STORE_COPY.md`](STORE_COPY.md)
- Prompt Hook 扩展边界：[`OPEN_CORE.md`](OPEN_CORE.md)
- 内部协作：[`CONTRIBUTING.md`](CONTRIBUTING.md)；仓库级入口见 [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- 协作基线：[`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md)
- 安全策略：[`../SECURITY.md`](../SECURITY.md)
- 变更记录：[`../CHANGELOG.md`](../CHANGELOG.md)

## 常见任务

- 本地开发与调试：[`DEVELOPMENT.md`](DEVELOPMENT.md)
- 加载扩展并配置模型：[`../README.md`](../README.md#快速开始构建并加载-chrome--edge-扩展) + [`CONFIGURATION.md`](CONFIGURATION.md)
- 新增平台适配：[`ADAPTER_DEVELOPMENT.md`](ADAPTER_DEVELOPMENT.md) + [`API.md`](API.md#platform-adapter-平台适配器)
- 新增模型接入：[`LLM_INTEGRATION.md`](LLM_INTEGRATION.md) + [`API.md`](API.md#llm-模块)
- 排查生成失败、适配器异常或存储问题：[`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) + [`RUNBOOK.md`](RUNBOOK.md)
- 发布到 Chrome Web Store：[`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) + [`STORE_SUBMISSION.md`](STORE_SUBMISSION.md)
- 更新隐私政策：先改 [`PRIVACY.md`](PRIVACY.md) / [`PRIVACY.zh-CN.md`](PRIVACY.zh-CN.md)，再同步 `../site/privacy*.html`
- 更新品牌素材或文案口径：[`BRAND.md`](BRAND.md) + [`STORE_COPY.md`](STORE_COPY.md)

## 深度开发指南

- 平台适配器开发：[`ADAPTER_DEVELOPMENT.md`](ADAPTER_DEVELOPMENT.md)
- LLM 提供商集成：[`LLM_INTEGRATION.md`](LLM_INTEGRATION.md)
- 存储层与数据迁移：[`MEMORY_STORAGE.md`](MEMORY_STORAGE.md)
- 思路分析系统：[`THOUGHT_SYSTEM.md`](THOUGHT_SYSTEM.md)
- 测试策略：[`TESTING.md`](TESTING.md)
- 故障排查：[`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

## 文档维护约定

- `docs/` 是研发与发布文档目录；仓库根目录 `site/` 是对外公开的隐私政策静态站点。
- 行为、配置、接口、发布流程或隐私边界变化时，同步更新相关文档和入口链接。
- 搜索优化可以补关键词和摘要，但必须以代码、manifest、package.json 与现有 docs 为事实来源。
