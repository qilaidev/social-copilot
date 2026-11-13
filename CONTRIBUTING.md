# Contributing to Social Copilot

Thank you for your interest in contributing to Social Copilot!

## Development Workflow

1. Fork the repository and create a feature branch from `main`.
2. Keep changes focused and well-scoped (core SDK, browser extension adapter, docs, or tests).
3. Run the verification suite from the repository root before opening a Pull Request:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

4. For extension release packaging checks, run:

```bash
pnpm release:extension
```

5. Update `CHANGELOG.md` and relevant documentation under `docs/` when adding features or changing behavior.

## Adding a Platform Adapter or LLM Provider

- **Platform Adapters**: See [Adapter Development](docs/ADAPTER_DEVELOPMENT.md) for DOM extraction, input filling, and selector conventions.
- **LLM Providers**: See [LLM Integration](docs/LLM_INTEGRATION.md) for provider abstraction and fallback behavior.

## Boundaries

- Do not commit API keys, model credentials, user chat data, or screenshots containing private conversations.
- Security-sensitive findings must follow [SECURITY.md](SECURITY.md) rather than public issues.
- All contributions are licensed under the [MIT License](LICENSE).
