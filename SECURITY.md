# Security Policy

## Supported Versions

Security fixes are provided for the latest `main` branch and currently distributed extension builds.

## Reporting a Vulnerability

Please **do not** disclose security vulnerabilities in public GitHub issues, pull requests, screenshots, or release notes before triage.

Report vulnerabilities privately via [GitHub Security Advisories](https://github.com/qilaidev/social-copilot/security/advisories/new). Please include:

1. Affected version or commit SHA
2. Reproduction steps or Proof of Concept (PoC)
3. Impact scope and potential abuse path
4. Suggested mitigation, if known
5. Whether user chat content, API keys, or browser-extension permissions are involved

## Response SLA (Target)

- Initial acknowledgement: within 72 hours
- Triage status update: within 7 days
- Fix ETA communication: as soon as impact is confirmed

## Disclosure

After a fix is prepared and users have a reasonable upgrade window, we will publish only the necessary user-facing remediation details without exposing exploit steps, secrets, or private user data.

## Security Baseline

- Never commit API keys, tokens, or user chat data
- Keep logs and diagnostics free of secrets and raw message content
- Prefer minimal browser-extension permissions and least-privilege changes
- Add or update unit tests for security-critical paths (PII sanitization, input validation, provider fallback, storage migration, and backup/restore)
