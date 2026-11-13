import { describe, test, expect } from 'vitest';
import { DeepSeekProvider } from './provider';

describe('DeepSeekProvider', () => {
  describe('validateApiKey', () => {
    test('accepts non-empty token-like keys', () => {
      expect(DeepSeekProvider.validateApiKey('sk-test-123')).toBe(true);
      expect(DeepSeekProvider.validateApiKey('abc123')).toBe(true);
      expect(DeepSeekProvider.validateApiKey('  token  ')).toBe(true);
    });

    test('rejects empty or whitespace keys', () => {
      expect(DeepSeekProvider.validateApiKey('')).toBe(false);
      expect(DeepSeekProvider.validateApiKey('   ')).toBe(false);
    });

    test('rejects keys containing whitespace', () => {
      expect(DeepSeekProvider.validateApiKey('key with space')).toBe(false);
      expect(DeepSeekProvider.validateApiKey('key\nwith-newline')).toBe(false);
    });
  });

  describe('constructor', () => {
    test('throws on invalid API key', () => {
      expect(() => new DeepSeekProvider({ apiKey: '   ' })).toThrow('Invalid DeepSeek apiKey');
    });

    test('trims API key before use', () => {
      const provider = new DeepSeekProvider({ apiKey: '  test-key  ' });
      expect(provider.name).toBe('deepseek');
    });
  });
});
