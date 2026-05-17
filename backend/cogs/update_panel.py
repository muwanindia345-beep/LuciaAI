import discord
from discord.ext import commands
from discord import app_commands
import aiohttp
import json
import os
from dotenv import load_dotenv
load_dotenv()

GITHUB_USER = os.getenv("GITHUB_USER", "muwanindia345-beep")
GITHUB_REPO = os.getenv("GITHUB_REPO", "LuciaAI")
UPDATE_CHANNEL_ID = int(os.getenv("UPDATE_CHANNEL_ID", "0"))

class UpdatePanel(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # ── SLASH COMMAND ──────────────────────────────
    @app_commands.command(name="update_panel", description="LuciaAI update panel dikhao")
    @app_commands.checks.has_permissions(administrator=True)
    async def update_panel(self, interaction: discord.Interaction):
        await interaction.response.defer()

        # GitHub se latest release fetch karo
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/releases/latest"
            ) as res:
                data = await res.json()

        version = data.get("tag_name", "Unknown")
        changelog = data.get("body", "No changelog")
        apk = next((a for a in data.get("assets", []) if a["name"].endswith(".apk")), None)
        apk_url = apk["browser_download_url"] if apk else None
        apk_size = f"{apk['size']/1024/1024:.1f} MB" if apk else "N/A"

        embed = discord.Embed(
            title="🚀 LuciaAI Update Panel",
            description=f"**Latest Version:** `{version}`\n\n**Changelog:**\n{changelog}\n\n**APK Size:** {apk_size}",
            color=0x7c3aed
        )
        embed.set_footer(text="LuciaAI Auto-Update System 🌸")
        embed.set_thumbnail(url="https://cdn.discordapp.com/emojis/🌸")

        view = UpdateView(apk_url, version)
        await interaction.followup.send(embed=embed, view=view)

    # ── GITHUB RELEASE WEBHOOK ─────────────────────
    @app_commands.command(name="release", description="Naya release announce karo")
    @app_commands.checks.has_permissions(administrator=True)
    async def release(self, interaction: discord.Interaction, version: str, changelog: str):
        await interaction.response.defer()

        channel = self.bot.get_channel(UPDATE_CHANNEL_ID)

        embed = discord.Embed(
            title=f"⚡ LuciaAI v{version} Released!",
            description=f"**Changelog:**\n{changelog}",
            color=0x00ff88
        )
        embed.add_field(name="📱 Platform", value="Android APK", inline=True)
        embed.add_field(name="🔄 Type", value="Stable Release", inline=True)
        embed.set_footer(text="Click button to update!")

        view = UpdateView(None, version)
        msg = await channel.send(embed=embed, view=view)
        await interaction.followup.send(f"✅ Released v{version}!", ephemeral=True)


# ── BUTTONS VIEW ───────────────────────────────────
class UpdateView(discord.ui.View):
    def __init__(self, apk_url, version):
        super().__init__(timeout=None)
        self.apk_url = apk_url
        self.version = version

        if apk_url:
            self.add_item(discord.ui.Button(
                label=f"⬇️ Download v{version}",
                url=apk_url,
                style=discord.ButtonStyle.link
            ))

    @discord.ui.button(label="📋 Changelog", style=discord.ButtonStyle.secondary, emoji="📋")
    async def changelog(self, interaction: discord.Interaction, button: discord.ui.Button):
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://api.github.com/repos/{GITHUB_USER}/{GITHUB_REPO}/releases/latest"
            ) as res:
                data = await res.json()
        await interaction.response.send_message(
            f"**Changelog:**\n{data.get('body', 'No changelog')}",
            ephemeral=True
        )

    @discord.ui.button(label="🔔 Notify All", style=discord.ButtonStyle.primary, emoji="🔔")
    async def notify(self, interaction: discord.Interaction, button: discord.ui.Button):
        if not interaction.user.guild_permissions.administrator:
            await interaction.response.send_message("❌ Admin only!", ephemeral=True)
            return
        channel = interaction.guild.get_channel(UPDATE_CHANNEL_ID)
        await channel.send(f"@everyone 🚀 **LuciaAI v{self.version}** update available! Download karo!")
        await interaction.response.send_message("✅ Notified!", ephemeral=True)


async def setup(bot):
    await bot.add_cog(UpdatePanel(bot))
