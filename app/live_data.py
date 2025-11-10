import os
import requests

TEST_MODE = os.getenv("TEST_MODE", "true").lower() == "true"

BACKEND_URL = "https://college-backend.onrender.com/api" 

def fetch_events():
    if TEST_MODE:
        print("⚙️ Using test data for events (local mode)")
        return ["TechFest 2025 at Main Hall", "AI Hackathon next week"]
    try:
        r = requests.get(f"{BACKEND_URL}/api/events/")
        r.raise_for_status()
        events = r.json()
        return [f"{e['name']} on {e['date']} at {e['venue']}" for e in events[:5]]
    except Exception as e:
        print("⚠️ Backend fetch failed:", e)
        return ["Couldn't fetch live events."]

def fetch_lost_found():
    if TEST_MODE:
        print("⚙️ Using test data for lost & found (local mode)")
        return ["Lost: Black wallet near canteen", "Found: USB drive in library"]
    try:
        r = requests.get(f"{BACKEND_URL}/api/lostfound/")
        r.raise_for_status()
        items = r.json()
        return [f"{i['item_name']} lost at {i['location']}" for i in items[:5]]
    except Exception as e:
        print("⚠️ Backend fetch failed:", e)
        return ["Couldn't fetch Lost & Found posts."]
