<p align="center">
  <img src="site/assets/social-copilot-mark.svg" width="88" height="88" alt="Social Copilot logo" />
</p>
<h1 align="center">Social Copilot · Local-First, BYOK AI Chat Reply Assistant</h1>
<p align="center">
  Privacy-first Manifest V3 browser extension for Telegram Web, WhatsApp Web, and Slack Web
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
  <a href="CONTRIBUTING.md">Contributing</a> ·
  <a href="SECURITY.md">Security</a> ·
  <a href="LICENSE">MIT License</a> ·
  <a href="https://qilaidev.github.io/social-copilot/">Privacy Policy Site</a>
</p>

**Social Copilot** is a local-first, bring-your-own-key (BYOK) AI chat reply assistant browser extension for **Telegram Web, WhatsApp Web, and Slack Web**. It reads visible conversation context in your active web chat tab, generates 2–3 style-aware draft replies, and keeps the human in complete control—never auto-sending messages by default.

---

## Positioning: What It Is / What It Is Not

| Dimension | What It Is | What It Is Not |
|---|---|---|
| **Interaction Model** | Human-in-the-loop draft assistant: generates 2–3 reply candidates for you to review, insert, or copy | **Not** an unattended auto-sending bot (never auto-sends by default) |
| **Data Architecture** | **Local-First + BYOK**: preferences, contact profiles, and memory summaries stay in browser-local storage | **Not** a hosted chat SaaS or centralized message-logging backend |
| **Privacy Boundary** | Sends only redacted, budget-capped context to your chosen LLM provider when you trigger generation | **Not** a background scraper or model-training data collector |
| **Platform Compliance** | Standard DOM-based reading and input-box assistance within normal browser usage | **Not** an anti-bot bypass, scraping, or bulk-messaging automation tool |
| **Codebase** | Modular TypeScript + pnpm monorepo (`@social-copilot/core` + MV3 extension) | **Not** an opaque closed-source binary |

---

## Supported Platforms

| Platform | Status | Capabilities | Notes |
|---|---|---|---|
| **Telegram Web** (`web.telegram.org`) | ✅ Supported | Context extraction, input box filling, floating draft panel | Works for DMs and group chats |
| **WhatsApp Web** (`web.whatsapp.com`) | ✅ Supported | Context extraction, rich-text input filling, floating draft panel | Adapts to WhatsApp Web composer |
| **Slack Web** (`app.slack.com`) | ✅ Supported | Channel/DM context extraction, editor filling, tone polishing | Ideal for remote work & support |
| Discord / WeChat Web / Desktop Apps | ⚠️ Not stable | — | Outside the stable support matrix |

---

## Architecture & Privacy Boundary

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Browser-Local Storage & Processing (Local-First Boundary)               │
│                                                                         │
│  [Telegram / WhatsApp / Slack Web DOM]                                  │
│        │  1. Platform Adapter extracts visible messages (budget-capped)   │
│        ▼                                                                │
│  [@social-copilot/core]                                                 │
│   ├─ Outbound PII Redaction & Sender Anonymization                      │
│   ├─ Prompt Builder (Styles: humorous/caring/rational/casual/formal)    │
│   └─ Local Persistence (IndexedDB / chrome.storage: profiles & memory)  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ 2. Triggered on-demand with redacted context
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

| Privacy Control | Default Behavior |
|---|---|
| **Local Storage** | Settings, contact preferences, and memory summaries stay in `IndexedDB` and `chrome.storage` |
| **API Key Handling** | Bring your own key (BYOK); keys are never sent to any Social Copilot server |
| **Outbound Redaction** | PII patterns and sender names are anonymized before leaving the browser, bounded by message/char limits |
| **Diagnostics Export** | Diagnostic bundles strip raw chat messages and API keys |

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
4. Open the extension popup, acknowledge the privacy notice, select your LLM provider, and enter your API key.

Run the full local verification suite (boundary checks, lint, typecheck, unit tests, release build):

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
├── CONTRIBUTING.md                  # Open-source contribution guide
├── SECURITY.md                      # Security vulnerability reporting policy
├── CODE_OF_CONDUCT.md               # Community code of conduct
├── LICENSE                          # MIT License
├── packages/
│   ├── core/                        # @social-copilot/core (LLM, Store, Profile, Hooks)
│   ├── browser-extension/           # @social-copilot/browser-extension (MV3 extension)
│   └── mobile/                      # @social-copilot/mobile (Expo dev preview)
├── docs/                            # Architecture, config, adapter & release docs
└── site/                            # Public privacy policy site (GitHub Pages)
```

---

## Frequently Asked Questions (FAQ)

<details>
<summary><strong>1. Where are my API keys and chat data stored?</strong></summary>

Everything is stored locally in your browser (`IndexedDB` and `chrome.storage`). Social Copilot operates on a **Local-First + BYOK** model with no hosted backend. Context is only sent directly to your configured LLM provider when you explicitly trigger reply generation.
</details>

<details>
<summary><strong>2. Does Social Copilot auto-send messages?</strong></summary>

**No.** By default, Social Copilot never sends messages automatically. It generates 2–3 draft replies that you can review, insert into the chat input box, or copy, leaving you in full control of sending.
</details>

<details>
<summary><strong>3. Which LLM providers are supported?</strong></summary>

Built-in adapters support **DeepSeek**, **OpenAI**, **Claude (Anthropic)**, **NVIDIA**, and **SiliconFlow (DeepSeek-V3)**, with primary/fallback provider failover support.
</details>

<details>
<summary><strong>4. How does outbound PII redaction work?</strong></summary>

Before sending context to an LLM, `@social-copilot/core` applies pattern-based PII redaction (such as emails and phone numbers), anonymizes sender names, and enforces configurable message-count and character-length budgets.
</details>

<details>
<summary><strong>5. How can I add a new chat platform adapter?</strong></summary>

Implement the platform adapter interface under `packages/browser-extension/src/adapters/` to extract visible messages and fill the target input element, then register it in the extension entry point and manifest. See [Adapter Development](docs/ADAPTER_DEVELOPMENT.md).
</details>

<details>
<summary><strong>6. Which browsers are compatible?</strong></summary>

Any modern Chromium-based desktop browser supporting **Manifest V3**, including **Google Chrome** and **Microsoft Edge**. The `packages/mobile` Expo app is for development preview only and should not bundle production API keys.
</details>

---

## Further Reading

- [Engineering Docs Index](docs/README.md) · [Development Guide](docs/DEVELOPMENT.md)
- [Architecture](docs/ARCHITECTURE.md) · [Configuration](docs/CONFIGURATION.md)
- [LLM Integration](docs/LLM_INTEGRATION.md) · [Adapter Development](docs/ADAPTER_DEVELOPMENT.md)
- [Privacy Policy Template](docs/PRIVACY.md) · [Prompt Hook Extensions](docs/OPEN_CORE.md)
