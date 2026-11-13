# Social Copilot（聊天导师）· 本地优先、BYOK 的多平台 AI 聊天回复辅助扩展

<p align="center">
  <img src="site/assets/social-copilot-mark.svg" width="88" height="88" alt="Social Copilot logo" />
</p>
<p align="center">
  <strong>聊天导师 · Local-First, BYOK AI Chat Reply Assistant</strong><br />
  面向 Telegram Web · WhatsApp Web · Slack Web 的隐私优先 Manifest V3 浏览器扩展
</p>
<p align="center">
  <a href="https://github.com/qilaidev/social-copilot/actions/workflows/ci.yml"><img src="https://github.com/qilaidev/social-copilot/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/qilaidev/social-copilot/actions/workflows/codeql.yml"><img src="https://github.com/qilaidev/social-copilot/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Manifest-V3-4285F4.svg" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/TypeScript-Monorepo-3178C6.svg" alt="TypeScript Monorepo" />
  <img src="https://img.shields.io/badge/Architecture-Local--First%20%2B%20BYOK-10B981.svg" alt="Local-First + BYOK" />
</p>
<p align="center">
  <strong>简体中文</strong> ·
  <a href="README.en.md">English</a> ·
  <a href="llms.txt">llms.txt</a> ·
  <a href="codemeta.json">codemeta.json</a> ·
  <a href="docs/README.md">研发文档</a> ·
  <a href="CONTRIBUTING.md">贡献指南</a> ·
  <a href="SECURITY.md">安全策略</a> ·
  <a href="LICENSE">MIT 协议</a> ·
  <a href="https://qilaidev.github.io/social-copilot/">隐私政策站点</a>
</p>

**Social Copilot（聊天导师）** 是一款开源（MIT）、本地优先（Local-first）、自带密钥（BYOK）的 **Manifest V3 浏览器扩展与 TypeScript SDK**，专为 **Telegram Web、WhatsApp Web 与 Slack Web** 设计。它读取当前标签页可见的对话上下文，经出站 PII 脱敏与发送者匿名化后调用用户自选的大语言模型（DeepSeek、OpenAI、Claude、NVIDIA、SiliconFlow）生成 2–3 条候选回复草稿，并始终由用户人工审阅、插入或复制发送——默认绝不自动发送消息。

---

## 核心事实卡（Entity Snapshot）

| 属性 | 规格与事实 |
| --- | --- |
| **项目实体** | `Social Copilot`（中文名：`聊天导师` · 仓库：`qilaidev/social-copilot`） |
| **版本与协议** | v1.0.0 · MIT License · pnpm + TypeScript Monorepo |
| **核心技术栈** | TypeScript · Chrome/Edge Manifest V3 · Vite 8 · `@social-copilot/core` (`zod`, `uuid`, `IndexedDB`) · Vitest |
| **支持网页平台** | Telegram Web (`web.telegram.org`) · WhatsApp Web (`web.whatsapp.com`) · Slack Web (`app.slack.com`) |
| **支持模型服务** | DeepSeek · OpenAI · Claude (Anthropic) · NVIDIA · SiliconFlow (Builtin DeepSeek-V3)，支持主备 Fault Failover |
| **隐私与出站控制** | 本地持久化（`IndexedDB` / `chrome.storage`）、默认会话级密钥存储（`persistApiKey=false`）、出站 PII 脱敏与上下文预算裁剪 |
| **扩展能力** | `@social-copilot/core` Prompt Hook 插件化系统 · 五种回复风格 · 四维思路卡 · 可选 `selectors.json` 远程热修 |
| **所属工程矩阵** | [qilai · qilaidav.com](https://qilaidav.com) · [03 · Telegram 频道运营与高度拟人交互（OASH）](https://qilaidav.com/oash/) |

---

## 定位边界：它是什么 / 它不是什么

| 维度 | 它是什么 (What It Is) | 它不是什么 (What It Is Not) |
|---|---|---|
| **核心交互** | 人工在环（Human-in-the-loop）的回复草稿辅助工具：生成 2–3 条候选回复供用户编辑、插入或复制 | **不是**无人值守自动发消息机器人（默认不自动发送，Release 版仅填充输入框） |
| **数据架构** | **Local-First + BYOK**：设置、联系人画像、偏好与记忆摘要默认存储在浏览器本地 | **不是**云端聊天记录托管 SaaS，不设集中式消息存储后端 |
| **隐私控制** | 须先确认隐私告知；触发生成时才向用户选择的模型接口发送经脱敏与长度预算裁剪的上下文 | **不是**后台静默抓包工具，也不利用聊天记录训练模型 |
| **合规边界** | 基于标准网页 DOM 的辅助阅读与输入框填充，遵守平台正常使用边界 | **不是**绕过反爬、反机器人风控、登录校验或批量群发的灰产工具 |
| **工程形态** | 模块化 TypeScript + pnpm Monorepo（`@social-copilot/core` + MV3 扩展） | **不是**黑盒闭源二进制脚本，也不适合用于医疗/法律/心理危机诊断 |

---

## 支持平台

| 平台 | 支持状态 | 适配能力 | 说明 |
|---|---|---|---|
| **Telegram Web** (`web.telegram.org`) | ✅ 稳定支持 | 消息上下文提取、输入框自动填充、悬浮建议面板 | 支持私聊与群聊网页端 |
| **WhatsApp Web** (`web.whatsapp.com`) | ✅ 稳定支持 | 消息上下文提取、输入框自动填充、悬浮建议面板 | 适配网页版富文本输入区 |
| **Slack Web** (`app.slack.com`) | ✅ 稳定支持 | 频道/私信上下文提取、编辑器填充、跨语言润色 | 适合远程办公与客服协作 |
| Discord / 微信网页版 / 原生桌面端 | ⚠️ 暂未稳定支持 | — | 当前源码未纳入稳定支持矩阵 |

---

## 适用场景与同类方案对比

### 典型适用场景

- **跨语言沟通与远程办公协作**：在 Slack Web、Telegram Web、WhatsApp Web 中根据上下文快速起草 2–3 个不同分寸（`caring` / `rational` / `formal` 等）的候选回复，减少切换标签页与复制粘贴成本。
- **隐私合规与 BYOK 自控成本**：不愿将团队对话与联系人习惯上传至第三方闭源 AI 扩展后端，希望用自己的 DeepSeek / OpenAI / Claude API Key 直连模型接口。
- **团队与开发者二次定制**：基于 `@social-copilot/core` 提供的 Prompt Hook（`registerPromptHook`）与平台 Adapter 接口扩展业务术语约束或适配新的网页聊天工具。

### 架构对比（基于源码与 Manifest 事实，无虚构对比数据）

| 对比维度 | `Social Copilot` | 闭源云端 AI 聊天插件 | 手动切窗口复制进 ChatGPT / Claude | 无人值守自动群发脚本 |
|---|---|---|---|---|
| **开源与可审计性** | MIT 全量开源（核心 SDK + 扩展） | 闭源前端与云端黑盒代理 | 不适用 | 多为黑盒或违反平台条款 |
| **API 密钥与计费模式** | BYOK（用户自带 Key 直连厂商） | 厂商订阅制 + 平台中转 | 独立网页端账号或 API | 各自配置 |
| **数据落盘边界** | 浏览器本地 `IndexedDB` + `chrome.storage` | 经由插件运营商服务器中转存储 | 完整对话粘贴至第三方网页历史 | 易集中泄露账号会话 |
| **出站安全处理** | 自动 PII 脱敏 + 发送者匿名化 + 条数/字符上限 | 依赖厂商黑盒策略 | 完全靠人工手动抹除敏感词 | 无隐私裁剪 |
| **发送控制权** | 100% 人工确认（仅插入输入框或复制） | 部分支持自动插入 | 人工复制粘贴 | 自动触发发送，封号风险高 |
| **主备模型故障转移** | 内置多 Provider 容灾切换（Failover） | 隐藏后端路由，不可控 | 需手动切换网页窗口 | 通常单模型硬编码 |

---

## 架构与隐私边界

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 浏览器本地 (Local-First Boundary)                                         │
│                                                                         │
│  [Telegram / WhatsApp / Slack Web DOM]                                  │
│        │  1. Platform Adapter 提取可见上下文（默认 10 条 / 4000 字符上限）  │
│        ▼                                                                │
│  [@social-copilot/core]                                                 │
│   ├─ 出站脱敏（PII Redaction & 昵称匿名化）                                │
│   ├─ Prompt Builder（风格: humorous/caring/rational/casual/formal + 思路卡）│
│   └─ 本地持久化（IndexedDB / chrome.storage：偏好、画像、可选记忆摘要）     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 2. 仅在确认隐私告知并主动触发时外发脱敏上下文
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

| 隐私与安全机制 | 默认行为（源码验证见 [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md)） |
|---|---|
| **本地存储** | 联系人画像、风格偏好与（默认关闭的）长期记忆摘要保存在本地 `IndexedDB` 与 `chrome.storage.local` |
| **API Key 安全** | 默认 `persistApiKey=false`，优先暂存 `chrome.storage.session`（浏览器启动或 24 小时不活跃清理），永不上传至作者服务器 |
| **出站脱敏与预算** | 默认开启 `redactPii=true` 与 `anonymizeSenders=true`，限制最近 `10` 条消息、单条 `500` 字符、总计 `4000` 字符 |
| **诊断导出与备份** | 诊断环缓冲（`__sc_diagnostics_v1`）与 JSON 备份/恢复均自动剥离原始对话正文与 `sk-*` 类密钥 |

---

## 快速开始：构建并加载 Chrome / Edge 扩展

环境要求：**Node.js >= 18.0.0**、**pnpm >= 10.0.0**、Google Chrome 或 Microsoft Edge 浏览器。

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
4. 点击扩展图标打开设置，确认隐私告知（`privacyAcknowledged`），选择 LLM Provider 并填入你的 API Key。

运行完整本地 CI 验证（边界检查、架构审计、Lint、类型检查、单元测试、发布打包）：

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
├── codemeta.json                    # CodeMeta 2.0 结构化软件元数据
├── CONTRIBUTING.md                  # 开源贡献指南
├── SECURITY.md                      # 安全漏洞披露策略
├── CODE_OF_CONDUCT.md               # 社区行为准则
├── LICENSE                          # MIT 开源许可证
├── selectors.json                   # 远程 DOM 选择器热修基准配置
├── packages/
│   ├── core/                        # @social-copilot/core（LLM 抽象、Store、画像、脱敏、Prompt Hook）
│   ├── browser-extension/           # @social-copilot/browser-extension（MV3 浏览器扩展）
│   └── mobile/                      # @social-copilot/mobile（Expo 开发预览客户端）
├── docs/                            # 架构、配置、适配器开发与发布文档
└── site/                            # 公开隐私政策静态站点（GitHub Pages）
```

---

## 常见问题（FAQ）

### 1. API Key 和聊天记录会上传到作者的服务器吗？
不会，Social Copilot 采用 **Local-First + BYOK** 架构，不存在任何集中式托管后端。你的联系人画像、风格偏好和记忆摘要仅存储在本地浏览器（`IndexedDB` / `chrome.storage`）；只有在你确认隐私告知并主动触发生成时，扩展才会将脱敏和裁剪后的上下文直接请求到你配置的 LLM 接口域名。

### 2. 扩展会自动帮我发送消息吗？
**默认绝不自动发送。** 生成的 2–3 条候选回复只会展示在悬浮面板中，必须由你点击「插入输入框」或「复制」后亲自审阅并手动发送；配置中的 `autoAgent` 实验门控默认关闭，且在 Release 构建中即便开启也仅填充输入框，不会自动提交发送。

### 3. 默认情况下 API Key 保存在哪里，关闭浏览器后会清空吗？
默认 `persistApiKey=false`，API Key 会写入浏览器会话级存储 `chrome.storage.session`（或兼容回退至 `__sc_session_*` 临时键，在浏览器重启或 24 小时未使用后自动清理）。如果你希望长期免重复输入，可在可信设备上于设置页手动开启持久化存储（`persistApiKey=true`）。

### 4. 支持哪些大语言模型（LLM Provider），支持主备故障转移吗？
内置支持 **DeepSeek**、**OpenAI**、**Claude (Anthropic)**、**NVIDIA** 以及 **SiliconFlow (DeepSeek-V3)** 官方域名接入，并在 `@social-copilot/core` 的 `LLMManager` 中提供自动故障转移（`enableFallback`）与请求缓存去重能力。在生产 Release 版本中，为降低浏览器权限提示风险，`baseUrl` 仅允许各提供商官方域名与 HTTPS。

### 5. 出站脱敏（PII Redaction）和上下文裁剪具体保护什么？
在上下文离开浏览器前，`@social-copilot/core` 默认启用 `redactPii`（掩码常见邮箱、手机号、链接等敏感字段）与 `anonymizeSenders`（将发言人昵称匿名化为“我 / 对方”）。同时通过 `contextMessageLimit=10`、`maxCharsPerMessage=500` 与 `maxTotalChars=4000` 严格约束每次发给模型的文本总量。

### 6. 如何为新的网页聊天平台编写适配器（Adapter）或扩展 Prompt Hook？
如需适配新的网页聊天工具，可在 `packages/browser-extension/src/adapters/` 中实现统一适配器接口（提取消息 DOM、识别发送者、填充输入框）并在 manifest 入口注册，详见 [`docs/ADAPTER_DEVELOPMENT.md`](docs/ADAPTER_DEVELOPMENT.md)。如需在不改核心源码的情况下注入提示词策略，可直接调用 `@social-copilot/core` 导出的 `registerPromptHook()`（见 [`docs/OPEN_CORE.md`](docs/OPEN_CORE.md)）。

### 7. 兼容哪些浏览器？移动端 `packages/mobile` 可以直接上线使用吗？
扩展兼容所有基于 Chromium 的 **Manifest V3** 现代桌面浏览器，包括 **Google Chrome** 与 **Microsoft Edge**。仓库中的 `packages/mobile` 目前仅作为 Expo / React Native 开发预览工程保留，文档明确不建议在移动端客户端内硬编码或打包真实生产 API Key。

---

<details>
<summary><strong>检索意图与高频词索引（Search Intent & Query Mapping）</strong></summary>

| 用户检索意图 | 典型检索词（中文 / English） | 仓库对应事实与入口 |
| --- | --- | --- |
| 寻找本地隐私安全的网页聊天 AI 回复助手 | AI 聊天回复助手 · Telegram WhatsApp Slack AI 插件 · local-first AI chat reply assistant | [`packages/browser-extension/manifest.json`](packages/browser-extension/manifest.json) · [`README.md`](README.md) |
| 需要自带 API Key（BYOK）且支持多模型故障转移 | BYOK AI 浏览器扩展 · DeepSeek OpenAI Claude 切换插件 · BYOK Chrome extension LLM failover | [`packages/core/src/llm/`](packages/core/src/llm/) · [`docs/LLM_INTEGRATION.md`](docs/LLM_INTEGRATION.md) |
| 关注出站脱敏与人工确认防自动乱发 | 出站 PII 脱敏 · 不自动发消息 AI 助手 · human-in-the-loop chat assistant PII redaction | [`packages/core/src/privacy/sanitize.ts`](packages/core/src/privacy/sanitize.ts) · [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) |
| 扩展适配其他网页聊天应用或自定义 Prompt Hook | Prompt Hook 二次开发 · 网页聊天适配器开发 · registerPromptHook adapter development | [`docs/OPEN_CORE.md`](docs/OPEN_CORE.md) · [`docs/ADAPTER_DEVELOPMENT.md`](docs/ADAPTER_DEVELOPMENT.md) |

</details>

<sub>**关键词**：AI 聊天回复助手 · 聊天导师 · BYOK 浏览器扩展 · Manifest V3 Chrome 扩展 · Telegram Web AI 助手 · WhatsApp Web AI 回复 · Slack Web AI 辅助 · 本地优先隐私保护 · local-first AI reply assistant · human-in-the-loop chat extension · outbound PII redaction · multi-provider LLM failover</sub>

---

## 延伸阅读

- [研发文档索引](docs/README.md) · [开发指南](docs/DEVELOPMENT.md) · [测试策略](docs/TESTING.md)
- [架构设计](docs/ARCHITECTURE.md) · [配置说明](docs/CONFIGURATION.md) · [运维手册](docs/RUNBOOK.md)
- [LLM 集成](docs/LLM_INTEGRATION.md) · [适配器开发](docs/ADAPTER_DEVELOPMENT.md) · [思路分析系统](docs/THOUGHT_SYSTEM.md)
- [隐私说明](docs/PRIVACY.zh-CN.md) · [Prompt Hook 扩展指南](docs/OPEN_CORE.md) · [变更记录](CHANGELOG.md)

---

## 工程架构与生态 · qilai (`qilaidav.com`)

本项目由 **[qilai · qilaidav](https://qilaidav.com)** 独立工程工作室设计与开源维护，聚焦 **确定性系统工程与高信噪比技术诊断（Deterministic Systems Engineering & High-Signal Technical Diagnostics）**。

- **所属工程支柱**：[03 · Telegram 频道运营与高度拟人交互系统（OASH）](https://qilaidav.com/oash/) · [English Pillar](https://qilaidav.com/en/oash/)
- **工作室主站**：[https://qilaidav.com](https://qilaidav.com) · [English](https://qilaidav.com/en/)
- **工程技术笔记（Field Reports）**：[https://qilaidav.com/notes/](https://qilaidav.com/notes/)
- **开源项目矩阵**：[https://github.com/qilaidev](https://github.com/qilaidev)
- **工程联络**：[Telegram @BD8888](https://t.me/BD8888) · [公开频道 @AIKB8](https://t.me/AIKB8) · `hello@qilaidav.com`
