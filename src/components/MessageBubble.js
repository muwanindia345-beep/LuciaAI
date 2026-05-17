import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Clipboard, Alert
} from 'react-native';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const copyText = () => {
    Clipboard.setString(message.content);
    Alert.alert('Copied!', 'Message copied to clipboard');
  };

  // Code block detect karna
  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.replace(/```[\w]*\n?/, '').replace(/```$/, '');
        return (
          <View key={i} style={styles.codeBlock}>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => {
                Clipboard.setString(code);
                Alert.alert('Copied!', 'Code copied!');
              }}>
              <Text style={styles.copyText}>📋 Copy</Text>
            </TouchableOpacity>
            <Text style={styles.codeText}>{code}</Text>
          </View>
        );
      }
      return <Text key={i} style={[styles.msgText, isUser && styles.userText]}>{part}</Text>;
    });
  };

  return (
    <TouchableOpacity onLongPress={copyText} activeOpacity={0.8}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <Text style={styles.aiName}>🌸 Lucia</Text>
        )}
        {renderContent(message.content)}
        <Text style={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%', marginVertical: 4,
    padding: 10, borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#005C4B',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1F2C34',
    borderBottomLeftRadius: 2,
  },
  aiName: {
    fontSize: 11, color: '#00a884',
    fontWeight: 'bold', marginBottom: 4,
  },
  msgText: {
    fontSize: 15, color: '#E9EDEF', lineHeight: 20,
  },
  userText: { color: '#E9EDEF' },
  codeBlock: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8, padding: 10,
    marginVertical: 6,
    borderLeftWidth: 3, borderLeftColor: '#00a884',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12, color: '#a8ff78',
    lineHeight: 18,
  },
  copyBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#1F2C34',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, marginBottom: 6,
  },
  copyText: { fontSize: 11, color: '#00a884' },
  time: {
    fontSize: 10, color: '#667781',
    alignSelf: 'flex-end', marginTop: 4,
  },
});
