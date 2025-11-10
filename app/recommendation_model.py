
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def recommend_posts(user_id: int, users_df: pd.DataFrame, posts_df: pd.DataFrame, interactions_df: pd.DataFrame):
   
    if posts_df.empty:
        return []

    posts_df["combined"] = posts_df["title"].fillna('') + " " + posts_df["content"].fillna('')

    tfidf = TfidfVectorizer(stop_words="english")
    post_vectors = tfidf.fit_transform(posts_df["combined"])

    user_posts = interactions_df[interactions_df["user_id"] == user_id]["post_id"].values
    if len(user_posts) == 0:
        return posts_df.sample(min(3, len(posts_df)))["id"].tolist()


    indices = [posts_df[posts_df["id"] == pid].index[0] for pid in user_posts if pid in posts_df["id"].values]
    if not indices:
        return posts_df.sample(min(3, len(posts_df)))["id"].tolist()

    user_vec = np.asarray(post_vectors[indices].mean(axis=0)) 
    sims = cosine_similarity(user_vec, post_vectors).flatten()

    top_indices = sims.argsort()[-5:][::-1]
    return posts_df.iloc[top_indices]["id"].tolist()
