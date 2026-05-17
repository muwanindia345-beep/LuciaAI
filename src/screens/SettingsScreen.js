import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Switch, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const clearChat = async () => {
    Alert.alert('Clear Chat', 'All chat history will be deleted!', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('lucia_chat_history');
          Alert.alert('✅ Done', 'Chat history cleared!');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileIcon}>🌸</Text>
          <View>
            <Text style={styles.profileName}>Lucia AI</Text>
            <Text style={styles.profileSub}>v1.0.0 — Smart. Reliable. Always with you.</Text>
          </View>
        </View>

        {/* AI Models */}
        <Text style={styles.sectionTitle}>🤖 AI Models</Text>
        <View style={styles.card}>
          {[
            { name: 'Claude Sonnet', color: '#7c3aed', status: 'Active' },
            { name: 'GPT-4o', color: '#10a37f', status: 'Active' },
            { name: 'Grok 3', color: '#1d9bf0', status: 'Active' },
          ].map((m, i) => (
            <View key={i} style={styles.modelRow}>
              <View style={[styles.modelDot, { backgroundColor: m.color }]} />
              <Text style={styles.modelName}>{m.name}</Text>
              <Text style={[styles.modelStatus, { color: m.color }]}>{m.status}</Text>
            </View>
          ))}
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>🎨 Preferences</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>🔔 Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: '#00a884' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>💾 Save Chat History</Text>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ true: '#00a884' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>🌙 Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ true: '#00a884' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>🗑️ Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.dangerBtn} onPress={clearChat}>
            <Text style={styles.dangerText}>🗑️ Clear Chat History</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <View style={styles.card}>
          {[
            { label: 'Version', value: '1.0.0' },
            { label: 'Developer', value: 'LuciaOrganisation' },
            { label: 'Platform', value: 'Android' },
            { label: 'Build', value: 'Expo SDK 55' },
          ].map((item, i) => (
            <View key={i}>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>{item.label}</Text>
                <Text style={styles.aboutValue}>{item.value}</Text>
              </View>
              {i < 3 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Technology is not just about machines,{'\n'}it's about making life better. 🌸
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },
  content: { padding: 16, gap: 10 },
  header: { paddingVertical: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#e9edef' },
  profileCard: {
    backgroundColor: '#1f2c34',
    borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  profileIcon: { fontSize: 44 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#e9edef' },
  profileSub: { fontSize: 11, color: '#8696a0', marginTop: 2 },
  sectionTitle: {
    fontSize: 12, color: '#8696a0',
    letterSpacing: 0.5, marginTop: 6,
    marginLeft: 4, textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#1f2c34',
    borderRadius: 14, padding: 4, overflow: 'hidden',
  },
  modelRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 10,
  },
  modelDot: { width: 10, height: 10, borderRadius: 5 },
  modelName: { flex: 1, color: '#e9edef', fontSize: 14 },
  modelStatus: { fontSize: 12, fontWeight: '600' },
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 14,
  },
  switchLabel: { color: '#e9edef', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#2a3942', marginHorizontal: 14 },
  dangerBtn: { padding: 16, alignItems: 'center' },
  dangerText: { color: '#e74c3c', fontSize: 14, fontWeight: '600' },
  aboutRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 14,
  },
  aboutLabel: { color: '#8696a0', fontSize: 14 },
  aboutValue: { color: '#e9edef', fontSize: 14, fontWeight: '600' },
  footer: {
    textAlign: 'center', color: '#2a3942',
    fontSize: 12, lineHeight: 20, marginTop: 10,
  },
});
