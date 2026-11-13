<p align="center">
  <img src="site/assets/social-copilot-mark.svg" width="88" height="88" alt="Social Copilot logo" />
</p>
<h1 align="center">Social Copilot · Local-First, BYOK AI Chat Reply Assistant</h1>
<p align="center">
  Privacy-first Manifest V3 browser extension for Telegram Web, WhatsApp Web, and Slack Web
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
  <a href="README.md">简体中文</a> ·
  <strong>English</strong> ·
  <a href="llms.txt">llms.txt</a> ·
  <a href="codemeta.json">codemeta.json</a> ·
  <a href="docs/README.md">Engineering Docs</a> ·
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="SECURITY.md">Security</a> ·
  <a href="LICENSE">MIT License</a> ·
  <a href="https://qilaidev.github.io/social-copilot/">Privacy Policy Site</a>
</p>

**Social Copilot** (`聊天导师`) is an open-source (MIT), local-first, bring-your-own-key (BYOK) **Manifest V3 browser extension and TypeScript SDK** for **Telegram Web, WhatsApp Web, and Slack Web**. It reads visible conversation context in your active web chat tab, applies outbound PII redaction and sender anonymization, calls your configured LLM provider (DeepSeek, OpenAI, Claude, NVIDIA, or SiliconFlow) to draft 2–3 style-aware replies, and keeps the human in complete control—never auto-sending messages by default.

---

## Entity Snapshot

| Field | Verified Specification |
| --- | --- |
| **Entity Name** | `Social Copilot` (Chinese name: `聊天导师` · Repo: `qilaidev/social-copilot`) |
| **Version & License** | v1.0.0 · MIT License · pnpm + TypeScript Monorepo |
| **Core Stack** | TypeScript · Chrome/Edge Manifest V3 · Vite 8 · `@social-copilot/core` (`zod`, `uuid`, `IndexedDB`) · Vitest |
| **Supported Surfaces** | Telegram Web (`web.telegram.org`) · WhatsApp Web (`web.whatsapp.com`) · Slack Web (`app.slack.com`) |
| **LLM Providers** | DeepSeek · OpenAI · Claude (Anthropic) · NVIDIA · SiliconFlow (Builtin DeepSeek-V3) with primary/fallback failover |
| **Privacy Controls** | Browser-local persistence (`IndexedDB` / `chrome.storage`), session-first API key default (`persistApiKey=false`), outbound PII redaction & budget caps |
| **Extensibility** | `@social-copilot/core` Prompt Hook API · 5 reply styles · 4 thought-card directions · optional `selectors.json` hotfixes |
| **Studio Ecosystem** | [qilai · qilaidav.com](https://qilaidav.com/en/) · [03 · Telegram Channel Ops (OASH) & Persona Engine](https://qilaidav.com/en/oash/) |

---

## Positioning: What It Is / What It Is Not

| Dimension | What It Is | What It Is Not |
|---|---|---|
| **Interaction Model** | Human-in-the-loop draft assistant: generates 2–3 reply candidates for you to review, insert, or copy | **Not** an unattended auto-sending bot (never auto-sends by default; release builds only fill the input box) |
| **Data Architecture** | **Local-First + BYOK**: preferences, contact profiles, and memory summaries stay in browser-local storage | **Not** a hosted chat SaaS or centralized message-logging backend |
| **Privacy Boundary** | Requires privacy acknowledgment; sends only redacted, budget-capped context to your chosen LLM provider on trigger | **Not** a background scraper or model-training data collector |
| **Platform Compliance** | Standard DOM-based reading and input-box assistance within normal browser usage | **Not** an anti-bot bypass, scraping, or bulk-messaging automation tool |
| **Codebase & Scope** | Modular TypeScript + pnpm monorepo (`@social-copilot/core` + MV3 extension) | **Not** an opaque closed-source binary or high-risk medical/legal advisor |

---

## Supported Platforms

| Platform | Status | Capabilities | Notes |
|---|---|---|---|
| **Telegram Web** (`web.telegram.org`) | ✅ Supported | Context extraction, input box filling, floating draft panel | Works for DMs and group chats |
| **WhatsApp Web** (`web.whatsapp.com`) | ✅ Supported | Context extraction, rich-text input filling, floating draft panel | Adapts to WhatsApp Web composer |
| **Slack Web** (`app.slack.com`) | ✅ Supported | Channel/DM context extraction, editor filling, tone polishing | Ideal for remote work & support |
| Discord / WeChat Web / Desktop Apps | ⚠️ Not stable | — | Outside the stable support matrix |

---

## Use Cases & Alternatives Comparison

### Primary Use Cases

- **Multilingual work & chat drafting**: Generate 2–3 tone-calibrated draft replies (`caring`, `rational`, `formal`, `humorous`, `casual`) inside Telegram Web, WhatsApp Web, or Slack Web without tab-switching.
- **Privacy-conscious BYOK workflows**: Connect your own DeepSeek, OpenAI, Claude, NVIDIA, or SiliconFlow API key directly from the browser without routing chat history through a third-party SaaS relay.
- **Extensible SDK & custom rules**: Use `@social-copilot/core`'s `registerPromptHook()` and clean adapter interfaces to enforce domain terminology or add support for new web chat surfaces.

### Architectural Comparison (Fact-Based, Zero Fabricated Benchmarks)

| Dimension | `Social Copilot` | Closed-Source SaaS Chat Extensions | Manual Copy-Paste to ChatGPT / Claude Web | Unattended Auto-Send Bots |
|---|---|---|---|---|
| **Open Source & Auditable** | MIT open source (SDK + MV3 extension) | Proprietary code + opaque cloud relay | N/A | Often opaque / policy-violating |
| **Keys & Billing** | BYOK direct to chosen LLM API | Vendor subscription + proxy markup | Separate web subscription or API | Varies |
| **Storage Boundary** | Browser-local `IndexedDB` + `chrome.storage` | Proxied and often stored on vendor servers | Full thread pasted into cloud chat history | High credential exposure risk |
| **Outbound Sanitization** | Built-in PII redaction + sender anonymization + char caps | Opaque vendor handling | Manual user redaction only | Rarely bounded |
| **Send Control** | Human-in-the-loop (insert or copy only) | Varies (some auto-insert) | Manual copy-paste | Auto-sends (high ban risk) |
| **Provider Failover** | Built-in primary + fallback failover (`LLMManager`) | Hidden backend routing | Manual tab switching | Usually single-provider |

---

## Architecture & Privacy Boundary

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Browser-Local Storage & Processing (Local-First Boundary)               │
│                                                                         │
│  [Telegram / WhatsApp / Slack Web DOM]                                  │
│        │  1. Platform Adapter extracts visible messages (10 msgs / 4000c)│
│        ▼                                                                │
│  [@social-copilot/core]                                                 │
│   ├─ Outbound PII Redaction & Sender Anonymization                      │
│   ├─ Prompt Builder (Styles: humorous/caring/rational/casual/formal)    │
│   └─ Local Persistence (IndexedDB / chrome.storage: profiles & memory)  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 2. Triggered on-demand after privacy ack
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ User-Configured LLM Provider (BYOK)                                     │
│  DeepSeek · OpenAI · Claude · NVIDIA · SiliconFlow (with Failover)      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 3. Returns 2–3 candidate drafts
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Human-in-the-Loop Confirmation                                          │
│  User reviews, edits, inserts into input box, or copies → manual send   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Privacy Control | Default Behavior (verified in [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md)) |
|---|---|
| **Local Storage** | Contact profiles, style preferences, and opt-in (`enableMemory=false`) memory summaries stay in `IndexedDB` and `chrome.storage.local` |
| **API Key Handling** | `persistApiKey=false` by default: keys live in `chrome.storage.session` (or `__sc_session_*` fallback cleared on startup / 24h idle) |
| **Outbound Redaction & Caps** | `redactPii=true` and `anonymizeSenders=true` by default, capped at `10` recent messages, `500` chars/message, `4000` total chars |
| **Diagnostics & Backups** | Diagnostic ring buffer (`__sc_diagnostics_v1`) and JSON backup/restore exclude raw chat messages and mask `sk-*` keys |

---

## Quick Start: Build & Load Unpacked Extension

Requirements: **Node.js >= 18.0.0**, **pnpm >= 10.0.0**, Google Chrome or Microsoft Edge.

```bash
git clone https://github.com/qilaidev/social-copilot.git
cd social-copilot
pnpm install
pnpm build
pnpm release:extension
```

Load the unpacked extension in Chrome / Edge:

1. Open `chrome://extensions/` (or `edge://extensions/`).
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select `packages/browser-extension/dist`.
4. Open the extension popup, acknowledge the privacy notice (`privacyAcknowledged`), select your LLM provider, and enter your API key.

Run the full local CI verification suite (boundary guard, architecture audit, lint, typecheck, unit tests, release build):

```bash
pnpm ci:local
```

---

## Repository Structure

```text
social-copilot/
├── README.md                        # Simplified Chinese README
├── README.en.md                     # English README (this file)
├── llms.txt                         # AI / LLM context index (llmstxt.org)
├── codemeta.json                    # CodeMeta 2.0 structured software metadata
├── CONTRIBUTING.md                  # Open-source contribution guide
├── SECURITY.md                      # Security vulnerability reporting policy
├── CODE_OF_CONDUCT.md               # Community code of conduct
├── LICENSE                          # MIT License
├── selectors.json                   # Remote DOM selector hotfix schema
├── packages/
│   ├── core/                        # @social-copilot/core (LLM, Store, Profile, Redaction, Prompt Hooks)
│   ├── browser-extension/           # @social-copilot/browser-extension (MV3 extension)
│   └── mobile/                      # @social-copilot/mobile (Expo dev preview)
├── docs/                            # Architecture, config, adapter & release docs
└── site/                            # Public privacy policy site (GitHub Pages)
```

---

## Frequently Asked Questions (FAQ)

### 1. Where are my API keys and chat data stored?
Everything stays locally in your browser (`IndexedDB` and `chrome.storage`). Social Copilot operates strictly on a **Local-First + BYOK** model with no hosted backend; redacted conversation context is sent directly to your selected LLM endpoint only after privacy acknowledgment and explicit user action.

### 2. Does Social Copilot auto-send messages?
**No.** By default, Social Copilot never sends messages automatically. It generates 2–3 draft replies in the floating suggestion panel for you to review, insert into the input box, or copy, and even the gated experimental `autoAgent` flag only populates the composer in release builds.

### 3. How are API keys persisted across browser restarts?
By default (`persistApiKey=false`), keys are stored ephemerally in `chrome.storage.session` (or `__sc_session_*` local fallback keys cleared on browser startup and after 24 hours of inactivity). You can opt into persistent storage (`persistApiKey=true`) in extension settings on trusted devices.

### 4. Which LLM providers are supported, and how does failover work?
Built-in provider adapters support **DeepSeek**, **OpenAI**, **Claude (Anthropic)**, **NVIDIA**, and **SiliconFlow (DeepSeek-V3)**, with optional primary/fallback failover and request deduplication inside `LLMManager`. Release builds restrict `baseUrl` overrides to official HTTPS provider domains.

### 5. How do outbound PII redaction and context caps protect privacy?
Before any prompt leaves the browser, `@social-copilot/core` runs `redactPii` (masking patterns such as emails, phone numbers, and URLs) and `anonymizeSenders` by default. Outbound payloads are further bounded by `contextMessageLimit` (default `10`), `maxCharsPerMessage` (`500`), and `maxTotalChars` (`4000`).

### 6. How can I add a new chat platform adapter or register a Prompt Hook?
Implement the unified adapter interface under `packages/browser-extension/src/adapters/` to extract visible messages and fill the composer, then register it in the manifest and entrypoints ([`docs/ADAPTER_DEVELOPMENT.md`](docs/ADAPTER_DEVELOPMENT.md)). For prompt customization without touching core providers, use `registerPromptHook()` from `@social-copilot/core` ([`docs/OPEN_CORE.md`](docs/OPEN_CORE.md)).

### 7. Which browsers are supported, and is `packages/mobile` production-ready?
The extension supports all modern Chromium desktop browsers implementing **Manifest V3**, including **Google Chrome** and **Microsoft Edge**. The `packages/mobile` workspace is an Expo / React Native development preview and should not bundle production API keys.

---

<details>
<summary><strong>Search Intent & Query Mapping</strong></summary>

| User Search Intent | Typical Queries (EN / ZH) | Verified Implementation Surface |
| --- | --- | --- |
| Privacy-first AI reply extension for web chat | local-first AI chat reply assistant · Telegram WhatsApp Slack AI extension · AI 聊天回复助手 | [`packages/browser-extension/manifest.json`](packages/browser-extension/manifest.json) · [`README.en.md`](README.en.md) |
| Bring-your-own-key multi-LLM browser extension | BYOK Chrome extension DeepSeek OpenAI Claude · LLM failover extension · BYOK 浏览器扩展 | [`packages/core/src/llm/`](packages/core/src/llm/) · [`docs/LLM_INTEGRATION.md`](docs/LLM_INTEGRATION.md) |
| Outbound PII redaction & no auto-send safety | human-in-the-loop chat AI · outbound PII redaction browser extension · 不自动发送 AI 插件 | [`packages/core/src/privacy/sanitize.ts`](packages/core/src/privacy/sanitize.ts) · [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) |
| Custom Prompt Hooks & web adapter SDK | registerPromptHook TypeScript SDK · web chat DOM adapter · Prompt Hook 扩展 | [`docs/OPEN_CORE.md`](docs/OPEN_CORE.md) · [`docs/ADAPTER_DEVELOPMENT.md`](docs/ADAPTER_DEVELOPMENT.md) |

</details>

<sub>**Keywords**: local-first AI chat reply assistant · BYOK browser extension · Manifest V3 Chrome extension · Telegram Web AI assistant · WhatsApp Web AI reply helper · Slack Web AI assistant · outbound PII redaction · human-in-the-loop chat assistant · TypeScript LLM SDK · 聊天导师 · AI 聊天回复助手</sub>

---

## Further Reading

- [Engineering Docs Index](docs/README.md) · [Development Guide](docs/DEVELOPMENT.md) · [Testing Guide](docs/TESTING.md)
- [Architecture](docs/ARCHITECTURE.md) · [Configuration](docs/CONFIGURATION.md) · [Operations Runbook](docs/RUNBOOK.md)
- [LLM Integration](docs/LLM_INTEGRATION.md) · [Adapter Development](docs/ADAPTER_DEVELOPMENT.md) · [Thought System](docs/THOUGHT_SYSTEM.md)
- [Privacy Policy Template](docs/PRIVACY.md) · [Prompt Hook Extensions](docs/OPEN_CORE.md) · [Changelog](CHANGELOG.md)

---

## Architecture & Ecosystem · qilai (`qilaidav.com`)

This open-source project is engineered and maintained by **[qilai · qilaidav](https://qilaidav.com/en/)** — an independent systems engineering studio focused on **Deterministic Systems Engineering & High-Signal Technical Diagnostics**.

- **Pillar Alignment**: [03 · Telegram Channel Ops (OASH) & Human-Grade Persona Engine](https://qilaidav.com/en/oash/) · [中文专栏](https://qilaidav.com/oash/)
- **Studio Website**: [https://qilaidav.com/en/](https://qilaidav.com/en/) · [中文主站](https://qilaidav.com/)
- **Technical Notes & Field Reports**: [https://qilaidav.com/notes/](https://qilaidav.com/notes/)
- **GitHub Open-Source Matrix**: [https://github.com/qilaidev](https://github.com/qilaidev)
- **Direct Engineering Contact**: [Telegram @BD8888](https://t.me/BD8888) · [Public Channel @AIKB8](https://t.me/AIKB8) · `hello@qilaidav.com`
