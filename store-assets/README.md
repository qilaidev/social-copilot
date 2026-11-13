# Chrome Web Store 物料目录

> 本目录用于存放上架所需物料（截图/宣传图/文案拷贝），方便协作与版本管理。

建议结构：

- `screenshots/`：商店截图（1280 × 800 PNG/JPG，Chrome Web Store 至少 1 张，最多 5 张）
- `promotional/`：宣传图（小宣传图 440 × 280 为必备项）
- `copy/`：商店文案快照（可直接拷贝提交）
- `screenshots/source/`：截图源 HTML，可用 Chrome headless 重新导出

## 物料建议（通用）

- 截图至少 4 张（建议 6 张），覆盖：
  - 设置页（含隐私与发送范围开关）
  - 生成面板（候选回复 + 思路卡片）
  - 联系人页（偏好统计 + 长期记忆）
  - 关于页（清除数据 + 诊断导出）
- 描述文案参考：`docs/STORE_COPY.md`
- 隐私政策 URL：部署后填写 `https://qilaidev.github.io/social-copilot/privacy.html`（源码位于 `site/privacy.html` 或 `site/privacy.zh-CN.html`）

## 已准备物料

- `copy/short-description.txt`
- `copy/detailed-description.zh-CN.md`
- `copy/privacy-disclosure.zh-CN.md`
- `copy/permissions-justification.zh-CN.md`
- `copy/review-notes.zh-CN.md`
- `screenshots/01-reply-panel.png`
- `screenshots/02-settings.png`
- `screenshots/03-privacy-diagnostics.png`
- `screenshots/04-platforms.png`
- `promotional/small-promo-440x280.png`

## 图标

图标由扩展项目自带：

- `packages/browser-extension/icons/`

## 品牌资产与口径

- 品牌指南：`docs/BRAND.md`
- 社交预览与 Logo：`site/assets/`
