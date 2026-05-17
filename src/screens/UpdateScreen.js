import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Linking, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkForUpdate } from '../services/updater';

export default function UpdateScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        'https://api.github.com/repos/muwanindia345-beep/LuciaAI/releases/latest'
      );
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>🚀</Text>
          <Text style={styles.title}>LuciaAI Updates</Text>
          <Text style={styles.subtitle}>v1.0.0 — Current Version</Text>
        </View>

        {/* Check Button */}
        <TouchableOpacity
          style={styles.checkBtn}
          onPress={handleCheck}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.checkText}>🔍 Check for Update</Text>
          }
        </TouchableOpacity>

        {/* Result */}
        {result && !result.error && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              ⚡ {result.tag_name} Available!
            </Text>
            <Text style={styles.cardBody}>
              {result.body || 'Bug fixes and improvements'}
            </Text>
            {result.assets?.find(a => a.name.endsWith('.apk')) && (
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => Linking.openURL(
                  result.assets.find(a => a.name.endsWith('.apk')).browser_download_url
                )}>
                <Text style={styles.downloadText}>⬇️ Download APK</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {result?.error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {result.error}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 How Updates Work</Text>
          <Text style={styles.infoText}>1. New version GitHub pe release hoti hai</Text>
          <Text style={styles.infoText}>2. Discord pe notification aata hai</Text>
          <Text style={styles.infoText}>3. Check button se latest version milti hai</Text>
          <Text style={styles.infoText}>4. APK download karke install karo</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },
  content: { padding: 20, gap: 16 },
  header: { alignItems: 'center', paddingVertical: 20 },
  icon: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#e9edef', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#8696a0', marginTop: 4 },
  checkBtn: {
    backgroundColor: '#00a884',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  checkText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: {
    backgroundColor: '#1f2c34',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00a884',
    gap: 10,
  },
  cardTitle: { color: '#00a884', fontSize: 16, fontWeight: 'bold' },
  cardBody: { color: '#8696a0', fontSize: 13, lineHeight: 20 },
  downloadBtn: {
    backgroundColor: '#00a884',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  downloadText: { color: '#fff', fontWeight: 'bold' },
  errorCard: {
    backgroundColor: '#2a1a1a',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  infoCard: {
    backgroundColor: '#1f2c34',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  infoTitle: { color: '#e9edef', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: '#8696a0', fontSize: 13, lineHeight: 20 },
});
