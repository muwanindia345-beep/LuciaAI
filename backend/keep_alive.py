from flask import Flask
from threading import Thread
import requests
import time
import os

app = Flask(__name__)

@app.route('/')
def home():
    return "LuciaAI Bot is alive! 🌸"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    url = os.getenv("RENDER_URL", "https://luciaai-qgyz.onrender.com")
    while True:
        try:
            requests.get(url)
            print(f"✅ Self-ping successful!")
        except Exception as e:
            print(f"❌ Ping failed: {e}")
        time.sleep(600)  # har 10 min ping karega

def start():
    # Flask server thread
    t1 = Thread(target=run)
    t1.daemon = True
    t1.start()
    
    # Self-ping thread
    t2 = Thread(target=keep_alive)
    t2.daemon = True
    t2.start()
