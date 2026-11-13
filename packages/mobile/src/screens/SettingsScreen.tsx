import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>⚙️ 设置</Text>
      <Text style={styles.subtitle}>更多功能敬请期待...</Text>
    </View>
  </View>
);

export default memo(SettingsScreen);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc', justifyContent: 'center' },
  card: { padding: 32, alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.05)', shadowColor: '#5b5ef6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 3 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#64748b', fontWeight: '500' },
});
