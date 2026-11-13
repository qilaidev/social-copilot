# Social Copilot 1.0.0 发布证明

生成时间：2026-06-09 01:30（Asia/Shanghai）

本文件基于 `docs/RELEASE_CHECKLIST.md`、`docs/STORE_SUBMISSION.md`、`store-assets/`、`scripts/*` 和 GitHub Actions 发布流程整理，目标是给 1.0.0 Chrome Web Store 发布留一份可追溯证据包。

## 版本结论

- 当前工作区：`social-copilot/`
- Git 分支：`main`
- 当前提交：`f23fc67e1ef50b01a9009c0221a59d3c6dfab510`
- Root/package 版本：`1.0.0`
- Browser extension manifest 版本：`1.0.0`
- 本地 release zip：`packages/browser-extension/release/social-copilot-1.0.0.zip`
- 最终本地 SHA-256：`96510a8ef290685f788db59b072991a998509bd57e7eab9b301b7957334665e5`

结论：1.0.0 已具备本地构建、打包、权限审计和商店物料证据；尚不能直接宣称“可提交审核”，因为公开隐私政策 URL 当前返回 404，且三平台真实登录回归、默认模型连通性、Chrome Web Store 上传/审核仍待执行。

## 已完成

### 发布流程与版本

- `package.json`、`packages/core/package.json`、`packages/browser-extension/package.json`、`packages/mobile/package.json`、`packages/browser-extension/manifest.json` 均为 `1.0.0`。
- `scripts/validate-release.mjs` 已校验 manifest v3、版本一致、必要构建文件、权限范围、无 release sourcemap。
- `scripts/package-extension.mjs` 已生成 `packages/browser-extension/release/social-copilot-1.0.0.zip`。
- `.github/workflows/release-extension.yml` 存在：推送 `v*` 标签后会执行 `pnpm release:extension`、校验 tag 与版本一致、创建 GitHub Release 并附加 zip；Chrome Web Store 发布为 secrets 齐全时的可选步骤。
- `.github/workflows/ci.yml` 存在：PR/main push/每周定时执行 lint、typecheck、test、AUDIT-025、release zip 构建并上传 artifact。
- `.github/workflows/pages.yml` 存在：用于部署顶层 `docs/` 隐私政策站点。

### 本地验证结果

2026-06-09 本地执行并通过：

```bash
pnpm ci:local
```

覆盖结果：

- `pnpm check:boundaries`：通过。
- `pnpm audit:025 > audit-025.json`：通过。
- `pnpm lint`：通过。
- `pnpm typecheck`：3 个 workspace 包通过。
- `pnpm test`：`packages/core` 29 个测试文件通过、1 个 skipped；1322 个测试通过、6 个 skipped。`packages/browser-extension` 14 个测试文件、149 个测试通过。
- `pnpm release:extension`：通过，生成 1.0.0 zip。

额外验证：

- `pnpm release:extension` 已在 smoke 失败后重新执行，确保最终 `dist/` 和 zip 回到 release 构建状态。
- `unzip -l packages/browser-extension/release/social-copilot-1.0.0.zip` 显示 zip 包含 `manifest.json`、`background.js`、Telegram/WhatsApp/Slack content scripts、popup、样式、图标、assets，共 20 项，未发现 `.map` 文件。
- `shasum -a 256 packages/browser-extension/release/social-copilot-1.0.0.zip` 输出最终 SHA-256：`96510a8ef290685f788db59b072991a998509bd57e7eab9b301b7957334665e5`。

### Manifest 与权限证据

`packages/browser-extension/manifest.json` 当前状态：

- `manifest_version`: `3`
- `permissions`: 仅 `storage`
- `host_permissions`: DeepSeek/OpenAI/Anthropic/SiliconFlow/NVIDIA API、Telegram Web、WhatsApp Web、Slack Web、`raw.githubusercontent.com`
- `optional_host_permissions`: 空
- 未包含 `<all_urls>`、`*://*/*`、`https://*/*` 等宽泛权限
- content scripts 只匹配 Telegram Web、WhatsApp Web、Slack Web

这与 `docs/STORE_SUBMISSION.md` 的权限说明一致。

### 商店物料证据

仓库内已存在并纳入 Git 的 Chrome Web Store 物料：

- 截图：`store-assets/screenshots/01-reply-panel.png`、`02-settings.png`、`03-privacy-diagnostics.png`、`04-platforms.png`
- 小宣传图：`store-assets/promotional/small-promo-440x280.png`
- 文案：`store-assets/copy/short-description.txt`、`detailed-description.zh-CN.md`、`privacy-disclosure.zh-CN.md`、`permissions-justification.zh-CN.md`、`review-notes.zh-CN.md`
- 提交包说明：`store-assets/SUBMISSION_PACKAGE.md`

本地尺寸验证：

- 4 张截图均为 `1280 x 800` PNG。
- 小宣传图为 `440 x 280` PNG。
- 图标为 `16 x 16`、`48 x 48`、`128 x 128` PNG。
- 简短说明长度为 69 字符，低于 Chrome Web Store 132 字符限制。

### 合规与隐私素材

- 隐私政策源文件存在：`docs/PRIVACY.md`、`docs/PRIVACY.zh-CN.md`。
- 对外 HTML 素材存在：顶层 `docs/privacy.html`、`docs/privacy.zh-CN.html`。
- `docs/STORE_COPY.md` 包含数据使用披露、权限说明、隐私政策 URL 建议。
- `store-assets/copy/privacy-disclosure.zh-CN.md`、`permissions-justification.zh-CN.md`、`review-notes.zh-CN.md` 可直接作为后台填写素材。
- 代码与测试中存在密钥脱敏证据：`packages/core/src/utils/redact.ts`、`packages/core/src/privacy/sanitize.ts` 及对应测试已由本地测试覆盖。

### 运维与回滚证据

- `docs/RUNBOOK.md` 已包含发布后健康检查、问题排查、回滚与安全降级流程。
- `docs/RELEASE_CHECKLIST.md` 已包含三平台回归、默认模型测试连接、性能/成本、版本记录、构建验证、上架物料、发布后 24 小时健康检查。
- CI 会上传 release zip artifact，tag 发布会附加 zip 到 GitHub Release，用于上一稳定版本追溯。

## 待人工执行

- 启用或修复公开隐私政策部署。当前本地执行：
  - `curl -I https://qilaidev.github.io/social-copilot/privacy.zh-CN.html`
  - `curl -I https://qilaidev.github.io/social-copilot/privacy.html`
  两个 URL 均返回 `HTTP/2 404`。这是 Chrome Web Store 提交前的明确阻塞项。
- 创建或确认 `v1.0.0` Git 标签。本地 `git tag --list 'v1.0.0'` 未返回标签。
- 推送 `v1.0.0` 标签触发 `.github/workflows/release-extension.yml`，并确认 GitHub Release 附件存在 `social-copilot-1.0.0.zip`。
- 在 Chrome Web Store Developer Dashboard 创建或选择扩展条目，上传 zip，填写商店页、隐私字段、权限说明、审核测试说明、截图和小宣传图。
- 如走 API 发布，配置 `EXTENSION_ID`、`CLIENT_ID`、`CLIENT_SECRET`、`REFRESH_TOKEN`。本地环境检查四项均未配置。
- 把 `CHANGELOG.md` 的 1.0.0 变更从 `[Unreleased]` 归档为明确的 `[1.0.0]` 发布节，并补充发布日期。
- 评估 pnpm 10 配置告警：当前 `pnpm` 提示 `package.json` 中 `pnpm.overrides` 已不再读取。虽然 `pnpm audit --audit-level=high` 通过，但这是依赖治理配置可靠性隐患。
- 处理或接受 `pnpm audit --json` 报告的 1 个 moderate 漏洞：`uuid <11.1.1`，路径为 `packages__mobile>expo>@expo/config-plugins>xcode>uuid`。该路径不在浏览器扩展发布包中，但应在移动端依赖治理或 workspace audit 策略中记录。

## 待真实登录环境验证

以下项目需要真实浏览器登录态、可用 API Key 或商店账号，不能用本地静态检查替代。

- 三平台手工回归：
  - Telegram Web：自动弹出/Alt+S、语气/意图提示、候选填充、复制、思路卡片重生成、错误重试。
  - WhatsApp Web：同上。
  - Slack Web：同上。
- 群聊策略验证：群聊默认不自动弹出；开启配置后可弹出；关闭后恢复。
- 默认模型有效性：DeepSeek `deepseek-v3.2`、OpenAI `gpt-5.2-chat-latest`、Claude `claude-sonnet-4-5`、NVIDIA `z-ai/glm4.7`、builtin/SiliconFlow 默认服务需用真实 API/服务环境执行“测试连接”。
- 真实隐私确认链路：未确认隐私告知时不调用第三方模型；确认后才允许生成。
- API Key 持久化策略：默认不持久化；显式选择后才持久化；诊断/错误中不回显密钥。
- 诊断导出和数据备份恢复：
  - 诊断 JSON 包含 `errorCode`、`retriable`、provider/model、适配器摘要，不包含原文消息/API Key。
  - 数据备份导出/导入不包含 API Key。
  - 本地数据库初始化失败时可通过“清除数据”恢复。
- 14 英寸 MacBook Pro 主基准 `1512 x 982` CSS px 下视觉回归：面板不遮挡输入区、候选文本不溢出、暗色模式可读。
- Chrome Web Store 审核流：上传、权限披露、隐私字段、审核说明、提交审核和审核结果。

本地尝试：

```bash
pnpm e2e:smoke
```

结果：构建成功并启动 Chrome，但在 Telegram 目标等待 `#social-copilot-root` 时浏览器上下文关闭，命令以 exit code 1 结束。该结果不能作为功能失败结论，只能说明当前本机未形成可用的三平台登录态 smoke 证据。

## 已盘点但不应误判为完成的事项

- `packages/browser-extension/release/social-copilot-1.0.0.zip` 是本地生成产物，按 `store-assets/SUBMISSION_PACKAGE.md` 口径不纳入 Git；发布证据需要记录 SHA-256 或通过 GitHub Release artifact 追溯。
- 顶层 `docs/privacy*.html` 已存在，但公网 URL 当前 404；“素材存在”不等于“隐私政策 URL 可提交”。
- 仓库有 `.github/workflows/release-extension.yml`，但本地尚无 `v1.0.0` 标签和发布运行结果；“流程存在”不等于“Release 已发布”。
- 本地单元测试覆盖 LLM 行为、脱敏、fallback 等逻辑，但未替代真实 provider API 可用性。
- `CHANGELOG.md` 当前没有明确 `[1.0.0]` 节；商店 Release notes 可以从 `[Unreleased]` 和 store copy 提炼，但正式发布记录仍应补齐。

## 建议发布顺序

1. 修复公开隐私政策 URL，确认两个 URL 返回 200。
2. 补齐 `CHANGELOG.md` 的 `[1.0.0]` 发布节。
3. 在真实登录 Chrome 中安装 `packages/browser-extension/dist` 或 zip 解压版本，完成三平台手工回归和默认模型测试连接。
4. 重新执行 `pnpm ci:local` 和 `pnpm release:extension`，记录最新 SHA-256。
5. 创建并推送 `v1.0.0` 标签，确认 GitHub Release 附件。
6. 登录 Chrome Web Store 后台提交审核，或配置 API secrets 后走自动发布。
7. 发布后 24 小时内按 `docs/RUNBOOK.md` 和 `docs/RELEASE_CHECKLIST.md` 执行健康检查并留痕。
