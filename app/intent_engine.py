
import re

def detect_intent(message: str):
    msg = message.lower()

    if "event" in msg or "upcoming" in msg:
        return "events_query"
    elif "lost" in msg or "found" in msg:
        return "lost_found_query"
    elif any(word in msg for word in ["how", "where", "what", "explain"]):
        return "info_query"
    else:
        return "general_chat"
