# Social Copilot · 本地优先、BYOK 的多平台 AI 聊天回复辅助扩展

<p align="center">
  <img src="site/assets/social-copilot-mark.svg" width="88" height="88" alt="Social Copilot logo" />
</p>
<p align="center">
  <strong>聊天导师 · Local-first, BYOK AI Chat Reply Assistant</strong><br />
  为 Telegram Web · WhatsApp Web · Slack Web 提供隐私可控的候选回复草稿（Manifest V3 浏览器扩展）
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Manifest-V3-4285F4.svg" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/TypeScript-Monorepo-3178C6.svg" alt="TypeScript Monorepo" />
  <img src="https://img.shields.io/badge/Architecture-Local--First%20%2B%20BYOK-10B981.svg" alt="Local-First + BYOK" />
</p>
<p align="center">
  <a href="README.md">简体中文</a> ·
  <a href="README.en.md">English</a> ·
  <a href="llms.txt">llms.txt</a> ·
  <a href="CONTRIBUTING.md">贡献指南</a> ·
  <a href="SECURITY.md">安全策略</a> ·
  <a href="LICENSE">MIT 协议</a> ·
  <a href="https://qilaidev.github.io/social-copilot/">隐私政策站点</a>
</p>

**Social Copilot（聊天导师）** 是一款面向 **Telegram Web、WhatsApp Web 与 Slack Web** 的本地优先（Local-first）、自带密钥（BYOK）AI 聊天回复辅助浏览器扩展。它读取当前网页中可见的对话上下文，结合你选择的回复风格与意图提示生成 2–3 条候选回复草稿，并始终由用户亲自审阅、插入或复制发送——绝不默认自动代发。

---

## 定位边界：它是什么 / 它不是什么

| 维度 | 它是什么 (What It Is) | 它不是什么 (What It Is Not) |
|---|---|---|
| **核心交互** | 人工在环（Human-in-the-loop）的回复草稿辅助工具：生成 2–3 条候选回复供用户编辑、插入或复制 | **不是**无人值守自动发消息机器人（默认不自动发送） |
| **数据架构** | **Local-First + BYOK**：设置、联系人画像、偏好与记忆摘要默认存储在浏览器本地 | **不是**云端聊天记录托管 SaaS，不设集中式消息存储后端 |
| **隐私控制** | 触发生成时才向你配置的 LLM Provider 发送经脱敏与长度预算裁剪的上下文 | **不是**后台静默抓包工具，也不利用聊天记录训练模型 |
| **合规边界** | 基于标准网页 DOM 的辅助阅读与输入框填充，遵守平台正常使用边界 | **不是**绕过反爬、反机器人风控、登录校验或批量群发的灰产工具 |
| **工程形态** | 模块化 TypeScript + pnpm Monorepo（`@social-copilot/core` + MV3 扩展） | **不是**黑盒闭源二进制脚本 |

---

## 支持平台

| 平台 | 支持状态 | 适配能力 | 说明 |
|---|---|---|---|
| **Telegram Web** (`web.telegram.org`) | ✅ 稳定支持 | 消息上下文提取、输入框自动填充、悬浮建议面板 | 支持私聊与群聊网页端 |
| **WhatsApp Web** (`web.whatsapp.com`) | ✅ 稳定支持 | 消息上下文提取、输入框自动填充、悬浮建议面板 | 适配网页版富文本输入区 |
| **Slack Web** (`app.slack.com`) | ✅ 稳定支持 | 频道/私信上下文提取、编辑器填充、跨语言润色 | 适合远程办公与客服协作 |
| Discord / 微信网页版 / 原生桌面端 | ⚠️ 暂未稳定支持 | — | 当前源码未纳入稳定支持矩阵 |

---

## 架构与隐私边界

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 浏览器本地 (Local-First Boundary)                                         │
│                                                                         │
│  [Telegram / WhatsApp / Slack Web DOM]                                  │
│        │  1. Platform Adapter 提取可见上下文（受条数与字符预算限制）          │
│        ▼                                                                │
│  [@social-copilot/core]                                                 │
│   ├─ 出站脱敏（PII Redaction & 昵称匿名化）                                │
│   ├─ Prompt Builder（风格: humorous/caring/rational/casual/formal + 思路卡）│
│   └─ 本地持久化（IndexedDB / chrome.storage：偏好、画像、记忆摘要）         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 2. 仅在用户主动触发时发送脱敏后的必要上下文
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 用户自带模型服务 (BYOK / Configured LLM Provider)                         │
│  DeepSeek · OpenAI · Claude · NVIDIA · SiliconFlow（支持主备故障转移）     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 3. 返回 2–3 条候选回复
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 人工确认发送 (Human-in-the-Loop)                                          │
│  用户审阅 / 修改 / 点击插入输入框或复制 → 由用户手动按下发送                 │
└─────────────────────────────────────────────────────────────────────────┘
```

| 隐私与安全机制 | 默认行为 |
|---|---|
| **本地存储** | 联系人偏好、风格权重与对话摘要保存在本地 `IndexedDB` 与 `chrome.storage` |
| **API Key 安全** | 支持 BYOK 自带密钥，默认不向任何第三方遥测服务器上传密钥 |
| **出站脱敏** | 发送给 LLM 前自动执行 PII 脱敏与发送者匿名化，并限制上下文条数与字符上限 |
| **诊断导出** | 导出排障日志时自动剥离原始聊天文本与 API Key |

---

## 快速开始：构建并加载 Chrome / Edge 扩展

环境要求：**Node.js >= 18.0.0**、**pnpm >= 10.0.0**、Chrome 或 Edge 浏览器。

```bash
git clone https://github.com/qilaidev/social-copilot.git
cd social-copilot
pnpm install
pnpm build
pnpm release:extension
```

加载未打包扩展到 Chrome / Edge：

1. 打开 `chrome://extensions/`（Edge 为 `edge://extensions/`）。
2. 开启右上角 **「开发者模式」**。
3. 点击 **「加载已解压的扩展程序」**，选择目录：`packages/browser-extension/dist`。
4. 点击扩展图标打开设置，确认隐私告知，选择 LLM Provider 并填入你的 API Key。

运行完整本地验证（边界检查、Lint、类型检查、单元测试、打包）：

```bash
pnpm ci:local
```

---

## 仓库结构

```text
social-copilot/
├── README.md                        # 简体中文总览（本文件）
├── README.en.md                     # English README
├── llms.txt                         # AI / LLM 检索标准索引（llmstxt.org）
├── CONTRIBUTING.md                  # 开源贡献指南
├── SECURITY.md                      # 安全漏洞披露策略
├── CODE_OF_CONDUCT.md               # 社区行为准则
├── LICENSE                          # MIT 开源许可证
├── packages/
│   ├── core/                        # @social-copilot/core（LLM 抽象、Store、画像、Hook）
│   ├── browser-extension/           # @social-copilot/browser-extension（MV3 浏览器扩展）
│   └── mobile/                      # @social-copilot/mobile（Expo 开发预览客户端）
├── docs/                            # 架构、配置、适配器开发与发布文档
└── site/                            # 公开隐私政策静态站点（GitHub Pages）
```

---

## 常见问题 / FAQ

<details>
<summary><strong>1. API Key 和聊天记录会上传到作者的服务器吗？</strong></summary>

不会。Social Copilot 采用 **Local-First + BYOK** 架构，没有集中式托管后端。你的设置、偏好和对话记忆摘要仅保存在浏览器本地（`IndexedDB` / `chrome.storage`）；只有在你主动点击生成回复时，扩展才会将裁剪脱敏后的上下文直接请求你所配置的 LLM 服务商。
</details>

<details>
<summary><strong>2. 扩展会自动帮我发送消息吗？</strong></summary>

**默认绝不自动发送。** 生成的 2–3 条候选回复只会展示在建议面板中，由你点击「插入输入框」或「复制」后自行核对并手动发送。代码中的高阶自动代理实验默认处于关闭状态。
</details>

<details>
<summary><strong>3. 支持哪些大语言模型（LLM Provider）？</strong></summary>

目前内置支持 **DeepSeek**、**OpenAI**、**Claude (Anthropic)**、**NVIDIA** 以及 **SiliconFlow (DeepSeek-V3)** 路径，并支持配置主备 Provider 自动故障转移（Failover）。
</details>

<details>
<summary><strong>4. 出站脱敏（PII Redaction）具体保护什么？</strong></summary>

在上下文发往模型接口前，`@social-copilot/core` 会执行敏感信息（如邮箱、手机号、证件号等常见 PII 模式）脱敏与联系人昵称匿名化，同时通过上下文消息条数与最大字符预算限制外发数据范围。
</details>

<details>
<summary><strong>5. 如何为新的网页聊天平台编写适配器（Adapter）？</strong></summary>

可在 `packages/browser-extension/src/adapters/` 中实现统一的平台适配器接口（负责提取当前会话 DOM 消息列表、识别发送者与填充输入框），并在 manifest 权限及入口注册。详细规范见 [适配器开发文档](docs/ADAPTER_DEVELOPMENT.md)。
</details>

<details>
<summary><strong>6. 兼容哪些浏览器？</strong></summary>

支持所有基于 Chromium 的 **Manifest V3** 现代桌面浏览器，包括 **Google Chrome** 与 **Microsoft Edge**。移动端 `packages/mobile` 仅作 Expo 开发预览用途，不建议在客户端打包真实生产密钥。
</details>

---

## 延伸阅读

- [研发文档索引](docs/README.md) · [开发指南](docs/DEVELOPMENT.md)
- [架构设计](docs/ARCHITECTURE.md) · [配置说明](docs/CONFIGURATION.md)
- [LLM 集成](docs/LLM_INTEGRATION.md) · [适配器开发](docs/ADAPTER_DEVELOPMENT.md)
- [隐私说明](docs/PRIVACY.zh-CN.md) · [Prompt Hook 扩展指南](docs/OPEN_CORE.md)
