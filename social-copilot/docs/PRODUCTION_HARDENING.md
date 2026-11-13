# Production Hardening Notes

## 2026-06-09 Critical Module Audit Fixes

This change intentionally favors stable production behavior over extra capability.

## Decisions

- Background message handlers now authorize by sender context:
  - chat content scripts can generate replies, analyze thoughts, acknowledge privacy, record style choice, cancel requests, open settings, and report diagnostics
  - extension UI pages can manage configuration, backups, data clearing, API keys, and diagnostics
  - unknown senders are limited to low-risk status/cancel/diagnostic paths
- Auto-agent is fill-only. It may auto-generate and place text in the input box for one-to-one chats, but it does not synthesize Enter or send the message.
- Core Base URL normalization is the runtime source of truth for local/private host rejection. It rejects localhost, IPv4 private/link-local ranges, IPv6 loopback, ULA, and link-local ranges unless private hosts are explicitly allowed.
- Backup import validation has count and text limits at the shared schema layer, so background imports are protected even if the popup file-size check is bypassed.

## Verification Scope

- Targeted unit tests cover URL private-host rejection and backup import limits.
- Browser-extension tests cover UI/content-script behavior and popup flows.
- Full `pnpm ci:local` remains the pre-release gate.

## Follow-up

- If true automatic sending is needed later, require a separate OpenSpec change with per-chat consent, visible countdown, cancellation, and send-state verification.
