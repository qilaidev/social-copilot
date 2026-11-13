# Chrome Web Store 提交包

更新时间：2026-05-21

## 可上传文件

- Extension zip：`packages/browser-extension/release/social-copilot-1.0.0.zip`
- SHA-256：上传前在本机运行 `shasum -a 256 packages/browser-extension/release/social-copilot-1.0.0.zip` 生成校验值；zip 为本地发布产物，不纳入 Git。
- Small promotional image：`store-assets/promotional/small-promo-440x280.png`
- Screenshots：
  - `store-assets/screenshots/01-reply-panel.png`
  - `store-assets/screenshots/02-settings.png`
  - `store-assets/screenshots/03-privacy-diagnostics.png`
  - `store-assets/screenshots/04-platforms.png`

## 后台可粘贴文案

- Short description：`store-assets/copy/short-description.txt`
- Detailed description：`store-assets/copy/detailed-description.zh-CN.md`
- Privacy disclosure：`store-assets/copy/privacy-disclosure.zh-CN.md`
- Permission justification：`store-assets/copy/permissions-justification.zh-CN.md`
- Review notes：`store-assets/copy/review-notes.zh-CN.md`

## 隐私政策 URL

- 中文：`https://qilaidev.github.io/social-copilot/privacy.zh-CN.html`
- 英文：`https://qilaidev.github.io/social-copilot/privacy.html`

## 当前发布阻塞

本机环境未配置 Chrome Web Store API 发布凭据：

- `EXTENSION_ID`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `REFRESH_TOKEN`

如果走手动发布，需要登录 Chrome Web Store Developer Dashboard，创建或选择扩展条目，上传 zip，填写商店页、隐私字段、权限说明、审核测试说明和截图/宣传图，然后提交审核。

如果走 API 发布，需要先在 Google Cloud 启用 Chrome Web Store API，创建 OAuth 凭据，使用拥有该扩展条目的 Google 开发者账号获取 refresh token，并设置以上环境变量或 CI secrets。
