import discord
from discord.ext import commands
import os
from dotenv import load_dotenv
from keep_alive import start

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

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

start()
bot.run(TOKEN)
