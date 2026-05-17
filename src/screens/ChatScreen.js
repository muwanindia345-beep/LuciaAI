import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageBubble from '../components/MessageBubble';
import ModelSelector from '../components/ModelSelector';
import { sendMessage } from '../services/api';

const STORAGE_KEY = 'lucia_chat_history';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('claude');
  const flatListRef = useRef(null);

  // Load chat history on start
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {}
  };

  const saveHistory = async (msgs) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch (e) {}
  };

  const clearChat = () => {
    Alert.alert('Clear Chat', 'Sari chat delete karein?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          setMessages([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    ]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      // Full conversation history bhejo API ko (memory!)
      const apiMessages = updated.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendMessage(apiMessages, model);

      const aiMsg = {
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      const final = [...updated, aiMsg];
      setMessages(final);
      saveHistory(final);
    } catch (err) {
      Alert.alert('Error', err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.avatar}>🌸</Text>
          <View>
            <Text style={styles.headerName}>Lucia AI</Text>
            <Text style={styles.headerStatus}>
              {loading ? 'typing...' : 'online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Model Selector */}
      <ModelSelector selected={model} onSelect={setModel} />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🌸</Text>
            <Text style={styles.emptyText}>Lucia AI</Text>
            <Text style={styles.emptySubtext}>Smart. Reliable. Always with you.</Text>
          </View>
        }
      />

      {/* Typing indicator */}
      {loading && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color="#00a884" />
          <Text style={styles.typingText}>Lucia is thinking...</Text>
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message Lucia..."
            placeholderTextColor="#8696a0"
            multiline
            maxLength={4000}
            onSubmitEditing={send}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendDisabled]}
            onPress={send}
            disabled={!input.trim() || loading}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2c34',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { fontSize: 32 },
  headerName: { color: '#e9edef', fontSize: 16, fontWeight: 'bold' },
  headerStatus: { color: '#00a884', fontSize: 12 },
  clearBtn: { padding: 8 },
  clearText: { fontSize: 20 },
  msgList: { padding: 10, paddingBottom: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyIcon: { fontSize: 60 },
  emptyText: { color: '#e9edef', fontSize: 22, fontWeight: 'bold' },
  emptySubtext: { color: '#8696a0', fontSize: 13 },
  typingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingHorizontal: 16, paddingVertical: 6,
  },
  typingText: { color: '#8696a0', fontSize: 12 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 8, backgroundColor: '#1f2c34', gap: 8,
  },
  input: {
    flex: 1, backgroundColor: '#2a3942',
    borderRadius: 24, paddingHorizontal: 16,
    paddingVertical: 10, color: '#e9edef',
    fontSize: 15, maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: '#00a884', width: 44,
    height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  sendDisabled: { backgroundColor: '#2a3942' },
  sendIcon: { color: '#fff', fontSize: 18 },
});
