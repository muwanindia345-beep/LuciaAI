import { Linking, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GITHUB_USER = 'muwanindia345-beep';
const GITHUB_REPO = 'LuciaAI';
const CURRENT_VERSION = '1.0.0';
const DISCORD_WEBHOOK = process.env.EXPO_PUBLIC_DISCORD_WEBHOOK;
// GitHub se latest release check karo
export async function checkForUpdate(silent = false) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/latest`
    );
    const data = await res.json();

    const latest = data.tag_name?.replace('v', '');
    const apkAsset = data.assets?.find(a => a.name.endsWith('.apk'));

    if (!latest || !apkAsset) {
      if (!silent) Alert.alert('No Update', 'Koi update nahi mila!');
      return;
    }

    if (latest === CURRENT_VERSION) {
      if (!silent) Alert.alert('✅ Up to date!', `Version ${CURRENT_VERSION} latest hai!`);
      return;
    }

    // Naya version mila!
    await AsyncStorage.setItem('pending_update', JSON.stringify({
      version: latest,
      apkUrl: apkAsset.browser_download_url,
      changelog: data.body || 'Bug fixes and improvements',
      size: (apkAsset.size / 1024 / 1024).toFixed(1) + ' MB',
    }));

    showUpdatePrompt(latest, apkAsset.browser_download_url, data.body, apkAsset.size);

  } catch (err) {
    if (!silent) Alert.alert('Error', 'Update check failed: ' + err.message);
  }
}

// Update prompt dikhao
function showUpdatePrompt(version, apkUrl, changelog, size) {
  const sizeMB = (size / 1024 / 1024).toFixed(1);
  Alert.alert(
    '🚀 Update Available!',
    `Version v${version} ready!\n\nChangelog:\n${changelog || 'Bug fixes'}\n\nSize: ${sizeMB} MB`,
    [
      { text: 'Baad Mein', style: 'cancel' },
      {
        text: '⬇️ Install Now',
        onPress: () => Linking.openURL(apkUrl),
      },
    ]
  );
}

// Discord pe update notification bhejo
export async function notifyDiscord(version, changelog) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🚀 LuciaAI New Update!',
          description: `**Version:** v${version}\n\n**Changelog:**\n${changelog}`,
          color: 0x7c3aed,
          footer: { text: 'LuciaAI Auto-Update System' },
          timestamp: new Date().toISOString(),
        }]
      }),
    });
  } catch (err) {
    console.log('Discord notify failed:', err);
  }
}
