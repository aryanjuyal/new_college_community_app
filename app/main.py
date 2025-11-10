
import os
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv


from app.llm_generator import generate_answer
from app.rag_engine import RAGEngine
from app.moderation_model import analyze_post
from app.recommendation_model import recommend_posts

load_dotenv()

app = FastAPI(title="College Community ML API")

rag = RAGEngine()


class ChatInput(BaseModel):
    message: str

class PostInput(BaseModel):
    text: str

class RecommendationInput(BaseModel):
    user_id: int
    users: List[Dict]
    posts: List[Dict]
    interactions: List[Dict]


@app.get("/")
def root():
    return {"message": "🚀 College Community ML API running"}

@app.post("/chat/")
def chat(data: ChatInput):
    msg = data.message
    context = "Some context from RAG or live data (simplified for now)"
    answer = generate_answer(context, msg)
    return {"answer": answer}

@app.post("/moderate-post/")
def moderate_post(data: PostInput):
    return analyze_post(data.text)

@app.post("/recommend-posts/")
def recommend(data: RecommendationInput):
    users_df = pd.DataFrame(data.users)
    posts_df = pd.DataFrame(data.posts)
    interactions_df = pd.DataFrame(data.interactions)
    recs = recommend_posts(data.user_id, users_df, posts_df, interactions_df)
    return {"user_id": data.user_id, "recommendations": recs}
