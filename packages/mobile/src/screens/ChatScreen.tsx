import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import type { Message, ContactKey, ReplyStyle, ProviderType } from '@social-copilot/core';
import { initLLM, generateReply } from '../adapters/coreClient';
import { getApiKey, getModel, getProvider } from '../env';

const dummyContactKey: ContactKey = { app: 'other', peerId: 'self', platform: 'web', conversationId: 'demo', isGroup: false };
const defaultStyles: ReplyStyle[] = ['caring', 'humorous', 'casual'];

export default function ChatScreen() {
  const apiKeyRef = useRef<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [llmReady, setLlmReady] = useState(false);
  const initOnce = useRef(false);
  const [provider, setProvider] = useState<ProviderType>('deepseek');
  const [model, setModel] = useState('');

  useEffect(() => {
    if (initOnce.current) return;
    initOnce.current = true;
    const apiKey = getApiKey()?.trim();
    if (!apiKey) {
      setError('未配置 LLM API Key，请在环境变量 EXPO_PUBLIC_LLM_API_KEY 中设置');
      return;
    }
    try {
      apiKeyRef.current = apiKey;
      const initialProvider = getProvider() ?? 'deepseek';
      const initialModel = getModel() ?? '';
      setProvider(initialProvider);
      setModel(initialModel);
      initLLM({ apiKey, provider: initialProvider, model: initialModel.trim() || undefined });
      setLlmReady(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const handleApplyConfig = () => {
    const apiKey = apiKeyRef.current;
    if (!apiKey) {
      setError('未配置 LLM API Key，请在环境变量 EXPO_PUBLIC_LLM_API_KEY 中设置');
      setLlmReady(false);
      return;
    }
    try {
      initLLM({ apiKey, provider, model: model.trim() || undefined });
      setError(null);
      setLlmReady(true);
    } catch (err) {
      setError((err as Error).message);
      setLlmReady(false);
    }
  };

  const handleSend = async () => {
    if (!llmReady) {
      setError('LLM 未初始化，请检查 API Key 配置');
      return;
    }
    const msg: Message = {
      id: Date.now().toString(),
      contactKey: dummyContactKey,
      direction: 'outgoing',
      senderName: '我',
      text: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setError(null);

    const inputPayload = {
      context: {
        contactKey: dummyContactKey,
        recentMessages: messages.concat(msg),
        currentMessage: msg,
      },
      styles: defaultStyles,
      language: 'zh',
    } as const;

    try {
      const output = await generateReply(inputPayload);
      setSuggestions(output.candidates.map((c) => c.text));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.configBox}>
        <Text style={styles.sectionTitle}>模型配置</Text>
        <View style={styles.providerRow}>
          <Text style={styles.label}>Provider</Text>
          <View style={styles.providerChips}>
            {(['deepseek', 'openai', 'claude', 'nvidia', 'builtin'] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => setProvider(p)}
                style={[styles.chip, provider === p && styles.chipActive]}
              >
                <Text style={[styles.chipText, provider === p && styles.chipTextActive]}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.modelRow}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.modelInput}
            value={model}
            onChangeText={setModel}
            placeholder="可选：如 gpt-5.2-chat-latest / deepseek-v3.2"
          />
          <Button title="应用" onPress={handleApplyConfig} />
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {messages.map((m) => {
          const isMe = m.direction === 'outgoing';
          return (
            <View key={m.id} style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
              <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{m.text}</Text>
              </View>
            </View>
          );
        })}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>💡 回复建议</Text>
            {suggestions.map((s, idx) => (
              <Pressable key={idx} style={styles.suggestionCard} onPress={() => setInput(s)}>
                <Text style={styles.suggestionItem}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="输入消息..."
          placeholderTextColor="#94a3b8"
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>发送</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  configBox: { margin: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.08)', borderRadius: 16, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  messageWrapper: { marginBottom: 12, flexDirection: 'row', width: '100%' },
  messageWrapperMe: { justifyContent: 'flex-end' },
  messageWrapperOther: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageBubbleMe: { backgroundColor: '#5b5ef6', borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.08)', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextMe: { color: '#ffffff' },
  messageTextOther: { color: '#0f172a' },
  suggestionsContainer: { marginTop: 16 },
  suggestionsTitle: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 12, marginLeft: 4 },
  suggestionCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(91, 94, 246, 0.2)', marginBottom: 8, shadowColor: '#5b5ef6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  suggestionItem: { fontSize: 14, color: '#1e293b', lineHeight: 20 },
  sectionTitle: { fontWeight: '700', fontSize: 15, color: '#0f172a', marginBottom: 4 },
  label: { width: 70, fontWeight: '600', color: '#475569', fontSize: 13 },
  providerRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  providerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.1)', backgroundColor: '#fff' },
  chipActive: { borderColor: '#5b5ef6', backgroundColor: '#5b5ef6' },
  chipText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  modelRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  modelInput: { flex: 1, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.1)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#f8fafc', fontSize: 14, color: '#0f172a' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: 'rgba(15, 23, 42, 0.05)' },
  input: { flex: 1, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.1)', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f8fafc', fontSize: 15, maxHeight: 100 },
  sendButton: { backgroundColor: '#5b5ef6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  error: { color: '#ef4444', marginTop: 12, textAlign: 'center', fontSize: 13, backgroundColor: '#fef2f2', padding: 12, borderRadius: 8, overflow: 'hidden' },
});
