const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_KEY;
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY;
const GROK_API_KEY   = process.env.EXPO_PUBLIC_GROK_KEY;

const SYSTEM_PROMPT = `You are Lucia, an elite AI assistant and expert software engineer. You specialize in Python, JavaScript, React Native, Discord bots, and Termux development. Always write clean, well-commented, production-grade code. Explain your code clearly. Remember everything in this conversation.`;

// ── CLAUDE ──────────────────────────────────────────
export async function sendToClaude(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

// ── GPT-4o ──────────────────────────────────────────
export async function sendToGPT(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

// ── GROK ────────────────────────────────────────────
export async function sendToGrok(messages) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

// ── MAIN SENDER (model selector) ────────────────────
export async function sendMessage(messages, model = 'claude') {
  switch (model) {
    case 'claude': return await sendToClaude(messages);
    case 'gpt':    return await sendToGPT(messages);
    case 'grok':   return await sendToGrok(messages);
    default:       return await sendToClaude(messages);
  }
}
