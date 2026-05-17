import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const models = [
  { id: 'claude', label: '🟣 Claude', color: '#7c3aed' },
  { id: 'gpt',    label: '🟢 GPT-4o', color: '#10a37f' },
  { id: 'grok',   label: '⚡ Grok',   color: '#1d9bf0' },
];

export default function ModelSelector({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {models.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[
            styles.btn,
            selected === m.id && { backgroundColor: m.color, borderColor: m.color }
          ]}
          onPress={() => onSelect(m.id)}>
          <Text style={[
            styles.label,
            selected === m.id && styles.activeLabel
          ]}>
            {m.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#111b21',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a3942',
    backgroundColor: '#1f2c34',
  },
  label: {
    fontSize: 12,
    color: '#8696a0',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#fff',
  },
});
