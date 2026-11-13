import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Popup UI States', () => {
  const htmlPath = resolve(__dirname, 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');

  test('should have unified scrollbar styles', () => {
    expect(htmlContent).toContain('::-webkit-scrollbar');
    expect(htmlContent).toContain('::-webkit-scrollbar-thumb');
    expect(htmlContent).toContain('::-webkit-scrollbar-track');
  });

  test('should have focus-visible styles', () => {
    expect(htmlContent).toContain(':focus-visible');
    expect(htmlContent).toContain('outline: 2px solid var(--sc-primary)');
  });

  test('should have tab interaction states', () => {
    expect(htmlContent).toContain('.tab:hover');
    expect(htmlContent).toContain('.tab:active');
    expect(htmlContent).toContain('.tab:focus-visible');
  });

  test('should have standardized button states', () => {
    expect(htmlContent).toContain('button.primary:hover');
    expect(htmlContent).toContain('button.primary:active');
    expect(htmlContent).toContain('button.secondary:hover');
    expect(htmlContent).toContain('button.secondary:active');
  });

  test('should have standardized form input focus states', () => {
    expect(htmlContent).toContain('.form-group input:focus');
    expect(htmlContent).toContain('.form-group select:focus');
    expect(htmlContent).toContain('.form-group textarea:focus');
  });

  test('should style checkbox controls explicitly', () => {
    expect(htmlContent).toContain('.form-group.inline input[type="checkbox"]');
    expect(htmlContent).toContain('accent-color: var(--sc-primary)');
  });

  test('should style range controls explicitly', () => {
    expect(htmlContent).toContain('input[type="range"]');
    expect(htmlContent).toContain('input[type="range"]:active::-webkit-slider-thumb');
  });

  test('should keep auto agent behind advanced experimental UI', () => {
    expect(htmlContent).toContain('id="autoAgentGroup"');
    expect(htmlContent).toContain('高级实验：自动代理');
    expect(htmlContent).toContain('我确认风险并启用自动发送实验');
  });
});
