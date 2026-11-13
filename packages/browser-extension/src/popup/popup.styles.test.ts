import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

describe('popup styles', () => {
  test('keeps inline form groups explicitly aligned', () => {
    expect(html).toContain('.form-group.inline');
    expect(html).toContain('display: flex');
    expect(html).toContain('align-items: flex-start');
    expect(html).toContain('gap: 10px');
  });

  test('uses textarea min-height and content-aware sizing', () => {
    expect(html).toContain('textarea');
    expect(html).toContain('min-height: 80px');
    expect(html).toContain('field-sizing: content');
  });

  test('styles range and checkbox with webkit prefixes', () => {
    expect(html).toContain('input[type="range"]::-webkit-slider-runnable-track');
    expect(html).toContain('input[type="range"]::-webkit-slider-thumb');
    expect(html).toContain('-webkit-appearance: none');
  });
});
