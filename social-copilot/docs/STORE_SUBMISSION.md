# Chrome Web Store 提交流程对照表

> 用于把仓库内容映射到 Chrome Web Store 提交流程中的必填/常见字段。

## 1) 物料与元信息

- 扩展名称：`Social Copilot`
- 版本号：`social-copilot/packages/browser-extension/manifest.json` 的 `version`
- 图标：`social-copilot/packages/browser-extension/icons/`（构建产物会打包）
- 截图：`social-copilot/store-assets/screenshots/`（1280 × 800 PNG，可上传 1~5 张）
- 小宣传图：`social-copilot/store-assets/promotional/small-promo-440x280.png`
- 品牌素材：`docs/assets/`（Logo / OG 预览）与 `social-copilot/store-assets/`（商店物料）

## 2) 描述与披露

- 简短说明：见 `social-copilot/docs/STORE_COPY.md`
- 详细说明：见 `social-copilot/docs/STORE_COPY.md`
- 数据使用披露（重要）：建议直接复用 `social-copilot/docs/STORE_COPY.md` 中的 “数据使用披露” 段落
- 权限说明：见 `social-copilot/docs/STORE_COPY.md` 的 “权限说明”

## 3) 隐私政策 URL（通常必填）

- 模板：`social-copilot/docs/PRIVACY.md`（英文）与 `social-copilot/docs/PRIVACY.zh-CN.md`（中文）
- 中文：`https://qilaidev.github.io/social-copilot/privacy.zh-CN.html`
- 英文：`https://qilaidev.github.io/social-copilot/privacy.html`

## 4) 权限与域名审计（对应 manifest）

文件：`packages/browser-extension/manifest.json`

- `permissions`: 仅使用 `storage`
- `host_permissions`:
  - 站点：Telegram/WhatsApp/Slack（用于注入与展示）
  - API：DeepSeek/OpenAI/Anthropic/NVIDIA/官方内置（SiliconFlow）（用于请求第三方模型服务）
  - `raw.githubusercontent.com`：远程选择器配置（可选热修复）

生产版本不启用 optional host permissions，以避免安装时出现“可访问所有网站”的权限告警；如需定制授权策略，请在发布前单独评估。

## 5) 构建与提交包

在 `social-copilot/` 目录执行：

```bash
pnpm ci:local
pnpm release:extension
```

产物：`packages/browser-extension/release/social-copilot-<version>.zip`

当前 1.0.0 产物：

- `packages/browser-extension/release/social-copilot-1.0.0.zip`

## 6) Chrome Web Store 后台填写建议

- Category：`Productivity`
- Language：`Chinese (Simplified)`；如使用英文描述，可再补英文 locale
- Single purpose：为 Telegram Web、WhatsApp Web、Slack Web 提供用户确认后插入/复制的 AI 回复建议、轻量语气提示和本地优先设置管理
- Data usage：仅在用户触发生成/分析时向用户选择的模型服务发送必要上下文；默认脱敏；API Key 仅本地保存；不出售、不共享、不用于广告
- Review notes：见 `social-copilot/store-assets/copy/review-notes.zh-CN.md`

## 7) 发布后验证清单

见：`social-copilot/docs/RELEASE_CHECKLIST.md`
