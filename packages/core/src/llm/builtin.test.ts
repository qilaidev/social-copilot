import { afterEach, describe, expect, test, vi } from 'vitest';
import { BuiltinProvider } from './builtin';
import type { LLMInput } from '../types';

const baseInput: LLMInput = {
  context: {
    contactKey: {
      platform: 'web',
      app: 'telegram',
      accountId: 'acc',
      conversationId: 'conv',
      peerId: 'peer',
      isGroup: false,
    },
    recentMessages: [
      {
        id: '1',
        contactKey: {
          platform: 'web',
          app: 'telegram',
          accountId: 'acc',
          conversationId: 'conv',
          peerId: 'peer',
          isGroup: false,
        },
        direction: 'incoming',
        senderName: 'Alice',
        text: 'Hi!',
        timestamp: Date.now(),
      },
    ],
    currentMessage: {
      id: '2',
      contactKey: {
        platform: 'web',
        app: 'telegram',
        accountId: 'acc',
        conversationId: 'conv',
        peerId: 'peer',
        isGroup: false,
      },
      direction: 'incoming',
      senderName: 'Alice',
      text: 'How are you?',
      timestamp: Date.now(),
    },
  },
  styles: ['casual'],
  language: 'zh',
};

describe('BuiltinProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('redacts secret-like tokens in non-2xx error messages', async () => {
    const provider = new BuiltinProvider({ apiKey: 'test-key' });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error: { message: 'bad key sk-supersecret1234567890abcde' },
      }),
    }));

    await expect(provider.generateReply(baseInput)).rejects.toThrow(
      /Builtin API error: 401 bad key sk-\*\*\*REDACTED\*\*\*/
    );
  });
});

