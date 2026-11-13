/**
 * 思路类型枚举
 */
export const THOUGHT_TYPES = ['empathy', 'solution', 'humor', 'neutral'] as const;
export type ThoughtType = (typeof THOUGHT_TYPES)[number];

/**
 * 轻量语气/意图枚举。只用于对话辅助提示，不表示心理或医学判断。
 */
export const TONE_TYPES = ['needs_support', 'asks_help', 'playful', 'neutral'] as const;
export type ToneType = (typeof TONE_TYPES)[number];

/**
 * 思路卡片数据
 */
export interface ThoughtCard {
  type: ThoughtType;
  label: string;
  description: string;
  icon: string;
  promptHint: string;
}

/**
 * 思路分析结果
 */
export interface ThoughtAnalysisResult {
  recommended: ThoughtType[];
  confidence: number;
  reason?: string;
  tone?: ToneType;
  toneSummary?: string;
}

/**
 * 思路历史记录条目
 */
export interface ThoughtHistoryEntry {
  thought: ThoughtType;
  count: number;
  lastUsed: number;
}

/**
 * 思路偏好数据结构
 */
export interface ThoughtPreference {
  contactKeyStr: string;
  thoughtHistory: ThoughtHistoryEntry[];
  defaultThought: ThoughtType | null;
  updatedAt: number;
}

/**
 * 预定义思路卡片数据
 */
export const THOUGHT_CARDS: Record<ThoughtType, ThoughtCard> = {
  empathy: {
    type: 'empathy',
    label: '共情关怀',
    description: '表达理解和支持',
    icon: '💗',
    promptHint: '以共情和关怀的语气回复，表达理解对方的感受，给予情感支持',
  },
  solution: {
    type: 'solution',
    label: '解决方案',
    description: '提供建议或帮助',
    icon: '💡',
    promptHint: '以解决问题为导向，提供实用的建议或具体的帮助方案',
  },
  humor: {
    type: 'humor',
    label: '幽默化解',
    description: '轻松有趣的回应',
    icon: '😄',
    promptHint: '以幽默轻松的方式回复，活跃气氛，让对话更有趣',
  },
  neutral: {
    type: 'neutral',
    label: '中性回应',
    description: '平和自然的回复',
    icon: '💬',
    promptHint: '以平和自然的语气回复，不带特定情感倾向',
  },
};
