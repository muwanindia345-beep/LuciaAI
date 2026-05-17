import discord
from discord.ext import commands
from discord import app_commands
import aiohttp
import os
import threading
import time
import urllib.request
from flask import Flask, send_from_directory
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
GITHUB_USER = os.getenv("GITHUB_USER", "muwanindia345-beep")
GITHUB_REPO = os.getenv("GITHUB_REPO", "LuciaAI")
UPDATE_CHANNEL_ID = int(os.getenv("UPDATE_CHANNEL_ID", "0"))

# ── Flask App ─────────────────────────────────────────────────
app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/health')
def health():
    return {"status": "online", "bot": "LuciaAI 🌸"}

# ── Keep Alive ────────────────────────────────────────────────
def keep_alive():
    time.sleep(15)
    while True:
        try:
            urllib.request.urlopen(
                "https://luciaai-qgyz.onrender.com",
                timeout=10
            )
            print("💓 Keep-alive ping sent!")
        except Exception as e:
            print(f"⚠️ Ping failed: {e}")
        time.sleep(600)

# ── Discord Bot ───────────────────────────────────────────────
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ {bot.user} online!")
    try:
        await bot.load_extension("cogs.update_panel")
        print("✅ Update panel loaded!")
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} commands synced!")
    except Exception as e:
        print(f"❌ Error: {e}")

# ── Start Everything ──────────────────────────────────────────
def run_flask():
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == '__main__':
    # Keep-alive thread
    t1 = threading.Thread(target=keep_alive, daemon=True)
    t1.start()
    print("💓 Keep-alive started!")

    # Flask thread
    t2 = threading.Thread(target=run_flask, daemon=True)
    t2.start()
    print("🌐 Flask started!")

    # Discord bot
    bot.run(TOKEN)
