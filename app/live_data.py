
import requests
BACKEND_URL = "https://college-backend.onrender.com"  

def fetch_events():
    try:
        r = requests.get(f"{BACKEND_URL}/api/events/")
        r.raise_for_status()
        events = r.json()
        return [f"{e['name']} on {e['date']} at {e['venue']}" for e in events[:5]]
    except Exception:
        return ["Couldn't fetch events right now."]

def fetch_lost_found():
    try:
        r = requests.get(f"{BACKEND_URL}/api/lostfound/")
        r.raise_for_status()
        items = r.json()
        return [f"{i['item_name']} lost at {i['location']}" for i in items[:5]]
    except Exception:
        return ["Couldn't fetch Lost & Found posts."]
