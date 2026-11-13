# Prompt Hook 扩展边界（私有维护模式）

目标：在私有产品维护下，继续保持 Prompt Hook 能力扩展的低耦合、可测试和可回滚。

## 1. 当前边界

当前源码不再按开源项目发布。正式能力仍应进入主工作区并接受本地验证：

- `packages/core`：核心 SDK（类型、存储、画像、偏好、思路、LLM 接入）
- `packages/browser-extension`：浏览器扩展（适配器、UI、配置）
- `packages/mobile`：移动端预览（可选）
- `docs/`：开发、架构、运维与发布文档

`private/` 仅保留为本地实验目录（默认忽略），不作为正式功能依赖。

## 2. 扩展方式（Prompt Hook）

`@social-copilot/core` 提供 Prompt Hook，可对不同 Provider 的 system/user prompt 做可插拔增强。

### API

- `registerPromptHook(hook)`：注册 Hook（按注册顺序执行）
- `applySystemPromptHooks(prompt, input)`：内部调用（变换系统提示词）
- `applyUserPromptHooks(prompt, input)`：内部调用（变换用户提示词）
- `clearPromptHooks()`：测试/重置用

### 示例

```ts
import { registerPromptHook } from '@social-copilot/core';

registerPromptHook({
  name: 'style-guard',
  transformSystemPrompt: (prompt, input) => {
    if ((input.task ?? 'reply') !== 'reply') return prompt;
    return `${prompt}\n\n【额外约束】回复保持口语自然，避免机械重复。`;
  },
  transformUserPrompt: (prompt) => prompt,
});
```

### 推荐做法

- 在单独入口文件注册 Hook，避免污染核心 Provider 实现
- 将策略拆成多个小 Hook，便于回滚和 A/B 验证
- Hook 保持纯函数；动态配置通过参数注入
- 涉及用户聊天内容、画像、风格偏好或自动发送的 Hook 必须补测试与诊断说明

## 3. 协作原则

- 任何扩展都必须通过 `lint + typecheck + test + build`
- 若策略影响输出稳定性，需补充测试与变更说明（`CHANGELOG.md`）
- 不把私有 Prompt 策略、模型凭据或用户样本写入公开页面或商店截图
