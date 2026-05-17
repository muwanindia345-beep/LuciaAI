from flask import Flask
from threading import Thread
import requests
import time

app = Flask(__name__)

@app.route('/')
def home():
    return "LuciaAI Bot is alive! 🌸"

@app.route('/health')
def health():
    return {"status": "online", "bot": "LuciaAI"}

def ping_self():
    time.sleep(30)  # startup ka wait
    while True:
        try:
            requests.get("https://luciaai-qgyz.onrender.com")
            print("✅ Self-ping OK!")
        except Exception as e:
            print(f"❌ Ping failed: {e}")
        time.sleep(600)

def start():
    # Ping thread
    t = Thread(target=ping_self)
    t.daemon = True
    t.start()
    
    # Flask PORT=10000 Render default
    app.run(host='0.0.0.0', port=10000)
