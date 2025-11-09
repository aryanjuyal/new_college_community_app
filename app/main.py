
from fastapi import FastAPI
from pydantic import BaseModel
from app.intent_engine import detect_intent
from app.rag_engine import RAGEngine
from app.live_data import fetch_events, fetch_lost_found
from app.llm_generator import generate_answer

app = FastAPI(title="Community App Chatbot")
rag = RAGEngine()

class ChatRequest(BaseModel):
    user_id: int | None = None
    message: str

@app.on_event("startup")
def setup():
    try:
        rag.index_kb()
    except:
        print("KB already indexed ✅")

@app.post("/chat/")
def chat(req: ChatRequest):
    msg = req.message
    intent = detect_intent(msg)

    if intent == "events_query":
        events = fetch_events()
        context = "\n".join(events)
    elif intent == "lost_found_query":
        items = fetch_lost_found()
        context = "\n".join(items)
    elif intent == "info_query":
        docs = rag.retrieve(msg)
        context = "\n".join(docs)
    else:
        context = "General college chatbot — ask me about events, lost items, or how to use the app!"

    answer = generate_answer(context, msg)
    return {"intent": intent, "answer": answer, "context": context}

@app.get("/")
def root():
    return {"message": "Community Chatbot is live 🚀"}
