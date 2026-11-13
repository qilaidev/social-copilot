# 内部协作指南

Social Copilot 当前按私有产品维护，不再走公开 Fork / Pull Request 协作流程。

## 开发环境

- Node.js >= 18.0.0
- pnpm >= 10.0.0
- Chrome 或 Edge 浏览器

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
```

## 开发流程

1. 从内部任务或本地分支开始，不从公开 fork 进入。
2. 先确认变更属于产品、扩展、核心 SDK、文档、隐私政策或商店发布哪一类。
3. 涉及聊天内容、API Key、浏览器权限、自动发送、存储迁移、备份恢复、日志诊断的变更，默认按高风险路径处理。
4. 代码变更后同步更新相关 docs，尤其是 `README.md`、`RELEASE_CHECKLIST.md`、`RUNBOOK.md`、`PRIVACY*.md`、`STORE_SUBMISSION.md`。
5. 提交前运行对应验证，并在交付说明中写清楚验证结果。

## 发布前检查

```bash
pnpm ci:local
pnpm release:extension
```

发布到 Chrome Web Store 前，必须复核：

- manifest 权限是否仍是最小必要
- API Key 是否只保存在本地
- 日志、诊断、截图不包含原始聊天内容或密钥
- 隐私政策公开 URL 可访问
- 商店文案没有继续承诺源码开源、MIT 或公开协作入口

## 安全披露

安全问题走 `../../SECURITY.md` 的私有披露流程，不在公开 issue、公开文档或发布说明中暴露复现细节。
