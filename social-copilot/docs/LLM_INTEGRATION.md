# LLM 提供商集成指南

本文档说明 Social Copilot 当前代码中的 LLM 管理边界，以及新增 Provider 时需要同步的文件、接口和验证。所有接口以 `packages/core/src/types/llm.ts` 与 `packages/core/src/llm/llm-manager.ts` 为准。

## 当前架构

```text
LLMManager
├── cache / dedup / fallback / recovery
├── DeepSeekProvider       packages/core/src/llm/provider.ts
├── OpenAIProvider         packages/core/src/llm/openai.ts
├── ClaudeProvider         packages/core/src/llm/claude.ts
├── NvidiaProvider         packages/core/src/llm/nvidia.ts
└── BuiltinProvider        packages/core/src/llm/builtin.ts

Prompt builders
├── buildSystemPrompt      packages/core/src/llm/prompts.ts
├── buildUserPrompt        packages/core/src/llm/prompts.ts
└── PromptHookRegistry     packages/core/src/llm/prompt-hooks.ts
```

当前 Provider 类型：

```ts
export type ProviderType = 'deepseek' | 'openai' | 'claude' | 'builtin' | 'nvidia';
```

## 核心接口

所有 Provider 必须实现 `LLMProvider`：

```ts
export interface LLMProvider {
  readonly name: string;
  generateReply(input: LLMInput, options?: LLMGenerateOptions): Promise<LLMOutput>;
}
```

当前 `LLMInput` / `LLMOutput` 结构：

```ts
export interface LLMInput {
  context: ConversationContext;
  profile?: ContactProfile;
  memorySummary?: string;
  styles: ReplyStyle[];
  language: 'zh' | 'en' | 'auto';
  temperature?: number;
  maxLength?: number;
  task?: 'reply' | 'profile_extraction' | 'memory_extraction';
  thoughtDirection?: ThoughtType;
  thoughtHint?: string;
  cacheKeySalt?: string;
}

export interface LLMOutput {
  candidates: ReplyCandidate[];
  model: string;
  latency: number;
  raw?: unknown;
}
```

注意：旧文档中的 `messages`、`contactProfile`、`styleHint`、`replies` 不是当前接口字段。新增 Provider 时必须使用 `context`、`profile`、`styles`、`candidates`。

## LLMManager 配置

```ts
export interface LLMManagerConfig {
  primary: {
    provider: ProviderType;
    apiKey: string;
    model?: string;
    baseUrl?: string;
    allowInsecureHttp?: boolean;
    allowPrivateHosts?: boolean;
  };
  fallback?: {
    provider: ProviderType;
    apiKey: string;
    model?: string;
    baseUrl?: string;
    allowInsecureHttp?: boolean;
    allowPrivateHosts?: boolean;
  };
  cache?: {
    enabled?: boolean;
    size?: number;
    ttl?: number;
  };
}
```

调用示例：

```ts
import { LLMManager } from '@social-copilot/core';

const manager = new LLMManager({
  primary: {
    provider: 'deepseek',
    apiKey: 'sk-xxx',
    model: 'deepseek-v3.2',
  },
  fallback: {
    provider: 'openai',
    apiKey: 'sk-yyy',
  },
});

const output = await manager.generateReply({
  context,
  profile,
  styles: ['caring', 'casual'],
  language: 'auto',
  task: 'reply',
  thoughtDirection: 'empathy',
  thoughtHint: '先回应对方情绪，再给出简短建议。',
});
```

## 新增 Provider 流程

### 1. 新增 Provider 文件

新 Provider 建议放在 `packages/core/src/llm/<provider>.ts`，结构参考 `nvidia.ts`：

```ts
import type { LLMGenerateOptions, LLMInput, LLMOutput, LLMProvider } from '../types';
import type { PromptHookRegistry } from './prompt-hooks';
import { applySystemPromptHooks, applyUserPromptHooks } from './prompt-hooks';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { fetchWithTimeout } from './fetch-with-timeout';
import { parseReplyContent } from './reply-validation';
import { normalizeBaseUrl } from './normalize-base-url';

export interface MyProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  allowInsecureHttp?: boolean;
  allowPrivateHosts?: boolean;
  registry?: PromptHookRegistry;
}

export class MyProvider implements LLMProvider {
  readonly name = 'my-provider';
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly registry?: PromptHookRegistry;

  constructor(config: MyProviderConfig) {
    if (!MyProvider.validateApiKey(config.apiKey)) {
      throw new Error('Invalid MyProvider apiKey');
    }
    this.apiKey = config.apiKey.trim();
    this.baseUrl = normalizeBaseUrl(config.baseUrl || 'https://api.example.com', {
      allowInsecureHttp: config.allowInsecureHttp,
      allowPrivateHosts: config.allowPrivateHosts,
    });
    this.model = config.model || 'example-model';
    this.registry = config.registry;
  }

  static validateApiKey(apiKey: string): boolean {
    return typeof apiKey === 'string' && apiKey.trim().length > 0 && !/\s/.test(apiKey);
  }

  async generateReply(input: LLMInput, options?: LLMGenerateOptions): Promise<LLMOutput> {
    const task = input.task ?? 'reply';
    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(task, input);
    const userPrompt = buildUserPrompt(task, input);

    const finalSystemPrompt = this.registry
      ? this.registry.applySystemHooks(systemPrompt, input)
      : applySystemPromptHooks(systemPrompt, input);
    const finalUserPrompt = this.registry
      ? this.registry.applyUserHooks(userPrompt, input)
      : applyUserPromptHooks(userPrompt, input);

    const response = await fetchWithTimeout(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: finalUserPrompt },
        ],
        temperature: input.temperature ?? 0.8,
        max_tokens: Math.min(input.maxLength ?? 1000, 2000),
      }),
      signal: options?.signal,
      timeoutMs: 20_000,
      retry: { retries: 2 },
    });

    if (!response.ok) {
      throw new Error(`MyProvider API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      candidates: parseReplyContent(content, input.styles, task),
      model: this.model,
      latency: Date.now() - startTime,
      raw: data,
    };
  }
}
```

### 2. 注册到 LLMManager

需要同步：

- `packages/core/src/llm/llm-manager.ts`：扩展 `ProviderType`，在 `createProvider(...)` 中添加 case。
- `packages/core/src/types/schemas.ts`：扩展 `ProviderTypeSchema`。
- `packages/core/src/llm/index.ts`：导出 Provider。
- `packages/browser-extension/src/popup/index.html`：设置页 Provider 下拉框。
- `packages/browser-extension/src/popup/popup.ts`：默认模型、Base URL、文档链接、API Key 链接。
- `packages/browser-extension/src/background/index.ts`：默认模型与配置摘要。
- `packages/browser-extension/manifest.json`：如需新 API 域名，补 `host_permissions`。
- `docs/CONFIGURATION.md`、`docs/PRIVACY*.md`、`docs/STORE_COPY.md`：同步用户可见配置与第三方处理者说明。

### 3. 测试要求

至少补以下测试：

- API Key 校验。
- Base URL 规范化与 release 限制。
- 成功响应解析为 `candidates`。
- 非 2xx 错误脱敏并抛出。
- `ReplyParseError` 或结构异常的失败路径。
- `AbortSignal` 取消请求或重试等待。
- Prompt Hook 对 system / user prompt 的影响。

相关测试位置参考：

- `packages/core/src/llm/nvidia.test.ts`
- `packages/core/src/llm/openai.test.ts`
- `packages/core/src/llm/claude.test.ts`
- `packages/core/src/llm/prompt-hooks.providers.test.ts`
- `packages/core/src/llm/llm-manager.test.ts`

## Prompt Hook

Provider 不应手写私有策略，而应在构建 system/user prompt 后套用 Hook：

```ts
import { registerPromptHook } from '@social-copilot/core';

registerPromptHook({
  name: 'style-guard',
  transformSystemPrompt: (prompt, input) => {
    if ((input.task ?? 'reply') !== 'reply') return prompt;
    return `${prompt}\n\n额外约束：回复保持自然，不要机械重复。`;
  },
  transformUserPrompt: (prompt) => prompt,
});
```

Hook 要求：

- `name` 必填且非空。
- `transformSystemPrompt` / `transformUserPrompt` 必须返回字符串。
- Hook 内不要读写用户密钥或原始聊天样本。
- 涉及用户画像、记忆或自动代理策略时必须补测试与诊断说明。

## 缓存、去重与回退

`LLMManager` 内置：

- LRU 缓存：默认容量 100，默认 TTL 5 分钟。
- 并发去重：相同输入的进行中请求会复用 Promise。
- 主备回退：主 Provider 失败后切到 fallback，并在冷却期后尝试恢复。
- Abort 支持：请求和重试等待应响应 `AbortSignal`。

## 输出解析约束

回复任务默认要求模型输出 JSON 数组：

```json
[
  { "style": "caring", "text": "我理解你的感受，我们可以先一步步来。" },
  { "style": "casual", "text": "懂你，要不我们先把最急的那件事处理掉？" }
]
```

`parseReplyContent(...)` 会校验：

- 顶层必须是数组，或可从文本中提取 JSON 数组。
- `style` 必须能归一化到 `humorous/caring/rational/casual/formal`。
- `text` 必须是非空字符串。
- 画像和长期记忆任务允许返回结构化 JSON 文本候选。

## 相关文档

- [API 文档](./API.md)
- [配置说明](./CONFIGURATION.md)
- [架构设计](./ARCHITECTURE.md)
- [思路系统](./THOUGHT_SYSTEM.md)
