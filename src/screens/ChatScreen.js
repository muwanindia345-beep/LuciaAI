import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withDelay,
  FadeInDown, FadeInLeft, FadeInRight,
} from 'react-native-reanimated';
import MessageBubble from '../components/MessageBubble';
import ModelSelector from '../components/ModelSelector';
import LuciaAvatar from '../components/LuciaAvatar';
import { sendMessage } from '../services/api';

const STORAGE_KEY = 'lucia_chat_history';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('claude');
  const [inputFocused, setInputFocused] = useState(false);
  const flatListRef = useRef(null);
  const inputScale = useSharedValue(1);
  const sendBtnScale = useSharedValue(1);

  useEffect(() => { loadHistory(); }, []);

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
    Alert.alert('Clear Chat', 'All messages will be deleted!', [
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

    // Send button animation
    sendBtnScale.value = withSpring(0.85, {}, () => {
      sendBtnScale.value = withSpring(1);
    });

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
      Alert.alert('❌ Error', err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  };

  // Input focus animation
  const inputContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const sendBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendBtnScale.value }],
  }));

  const modelColors = {
    claude: '#7c3aed',
    gpt: '#10a37f',
    grok: '#1d9bf0',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#111b21" />

      {/* ── HEADER ── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.header}>
        <View style={styles.headerLeft}>
          <LuciaAvatar isTyping={loading} size="small" />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Lucia AI</Text>
            <View style={styles.statusRow}>
              <View style={[
                styles.statusDot,
                { backgroundColor: loading ? '#ffaa00' : '#00a884' }
              ]} />
              <Text style={[
                styles.headerStatus,
                { color: loading ? '#ffaa00' : '#00a884' }
              ]}>
                {loading ? 'typing...' : 'online'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Active model badge */}
          <View style={[
            styles.modelBadge,
            { borderColor: modelColors[model] }
          ]}>
            <Text style={[styles.modelBadgeText, { color: modelColors[model] }]}>
              {model === 'claude' ? '🟣' : model === 'gpt' ? '🟢' : '⚡'} {model.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── MODEL SELECTOR ── */}
      <ModelSelector selected={model} onSelect={setModel} />

      {/* ── MESSAGES ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={
              item.role === 'user'
                ? FadeInRight.duration(300).delay(50)
                : FadeInLeft.duration(300).delay(50)
            }>
            <MessageBubble message={item} />
          </Animated.View>
        )}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.emptyContainer}>
            <LuciaAvatar isTyping={false} size="large" />
            <Text style={styles.emptyName}>Lucia AI</Text>
            <Text style={styles.emptyTagline}>
              Smart. Reliable. Always with you.
            </Text>
            <View style={styles.suggestionsContainer}>
              {[
                '💡 Explain quantum computing',
                '🐍 Write Python code',
                '🔧 Debug my code',
                '✍️ Write an essay',
              ].map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestion}
                  onPress={() => setInput(s.substring(3))}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        }
      />

      {/* ── TYPING INDICATOR ── */}
      {loading && (
        <Animated.View
          entering={FadeInLeft.duration(200)}
          style={styles.typingRow}>
          <LuciaAvatar isTyping={true} size="small" />
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>Lucia is thinking</Text>
            <ActivityIndicator size="small" color="#00a884" style={{marginLeft: 6}} />
          </View>
        </Animated.View>
      )}

      {/* ── INPUT BAR ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={[styles.inputWrapper, inputContainerStyle]}>
          <View style={[
            styles.inputRow,
            inputFocused && styles.inputRowFocused
          ]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Message Lucia..."
              placeholderTextColor="#8696a0"
              multiline
              maxLength={4000}
              onFocus={() => {
                setInputFocused(true);
                inputScale.value = withTiming(1.01);
              }}
              onBlur={() => {
                setInputFocused(false);
                inputScale.value = withTiming(1);
              }}
            />
            <Animated.View style={sendBtnStyle}>
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  !input.trim() && styles.sendDisabled,
                  input.trim() && { backgroundColor: modelColors[model] }
                ]}
                onPress={send}
                disabled={!input.trim() || loading}>
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Text style={styles.inputHint}>
            {input.length > 0 ? `${input.length}/4000` : 'Powered by Claude · GPT-4o · Grok'}
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b141a' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111b21',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#1f2c34',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerInfo: { gap: 2 },
  headerName: { color: '#e9edef', fontSize: 16, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  headerStatus: { fontSize: 12, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modelBadge: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  modelBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  clearBtn: { padding: 6 },
  clearIcon: { fontSize: 18 },

  // Messages
  msgList: { padding: 10, paddingBottom: 6, flexGrow: 1 },

  // Empty
  emptyContainer: {
    alignItems: 'center', paddingTop: 40, gap: 12,
  },
  emptyName: {
    color: '#e9edef', fontSize: 24,
    fontWeight: '700', marginTop: 8,
  },
  emptyTagline: { color: '#8696a0', fontSize: 13 },
  suggestionsContainer: {
    width: '100%', paddingHorizontal: 20,
    marginTop: 16, gap: 8,
  },
  suggestion: {
    backgroundColor: '#1f2c34',
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2a3942',
  },
  suggestionText: { color: '#8696a0', fontSize: 13 },

  // Typing
  typingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, paddingHorizontal: 16, paddingVertical: 6,
  },
  typingBubble: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1f2c34',
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8,
  },
  typingText: { color: '#8696a0', fontSize: 12 },

  // Input
  inputWrapper: { backgroundColor: '#111b21' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 8, gap: 8,
    borderTopWidth: 1, borderTopColor: '#1f2c34',
  },
  inputRowFocused: { borderTopColor: '#00a884' },
  input: {
    flex: 1, backgroundColor: '#2a3942',
    borderRadius: 24, paddingHorizontal: 16,
    paddingVertical: 10, color: '#e9edef',
    fontSize: 15, maxHeight: 120,
    borderWidth: 1, borderColor: 'transparent',
  },
  sendBtn: {
    backgroundColor: '#2a3942', width: 46,
    height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  sendDisabled: { backgroundColor: '#1f2c34' },
  sendIcon: { color: '#fff', fontSize: 18 },
  inputHint: {
    color: '#2a3942', fontSize: 10,
    textAlign: 'center', paddingBottom: 6,
    letterSpacing: 0.3,
  },
});
