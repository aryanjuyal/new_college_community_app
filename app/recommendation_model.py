
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


model = SentenceTransformer("sentence-transformers/paraphrase-MiniLM-L3-v2")


def build_user_profiles(users_df, posts_df, interactions_df):
   
    valid_posts = posts_df[
        posts_df["content"].notna() & (posts_df["content"].str.strip() != "")
    ]

    if valid_posts.empty:
        return {}, np.array([]), valid_posts

   
    post_embeddings = model.encode(valid_posts["content"].tolist(), convert_to_numpy=True)

    user_profiles = {}

    for uid in users_df["id"]:
        user_int = interactions_df[interactions_df["user_id"] == uid]
        if user_int.empty:
            user_profiles[uid] = np.zeros(post_embeddings.shape[1])
            continue

        post_ids = user_int["post_id"].tolist()
        valid_ids = valid_posts[valid_posts["id"].isin(post_ids)].index

        if valid_ids.empty:
            user_profiles[uid] = np.zeros(post_embeddings.shape[1])
            continue


        indices = [valid_posts.index.get_loc(i) for i in valid_ids]
        user_vectors = post_embeddings[indices]

        user_profiles[uid] = np.mean(user_vectors, axis=0)

    return user_profiles, post_embeddings, valid_posts


def recommend_posts(
    user_id: int, users_df: pd.DataFrame, posts_df: pd.DataFrame, interactions_df: pd.DataFrame, top_k: int = 3
):
    
    if posts_df.empty or users_df.empty:
        return []

    user_profiles, post_emb, valid_posts = build_user_profiles(users_df, posts_df, interactions_df)

 
    user_vec = user_profiles.get(user_id)

    if user_vec is None or np.all(user_vec == 0) or post_emb.size == 0:
        return []

 
    sims = cosine_similarity([user_vec], post_emb)[0]


    seen_posts = set(interactions_df[interactions_df["user_id"] == user_id]["post_id"])
    candidates = []

    for idx, score in enumerate(sims):
        post_id = valid_posts.iloc[idx]["id"]
        if post_id not in seen_posts:
            candidates.append((post_id, score))

  
    candidates.sort(key=lambda x: x[1], reverse=True)

    
    top_ids = [p[0] for p in candidates[:top_k]]

    return valid_posts[valid_posts["id"].isin(top_ids)][["id", "content"]].to_dict(orient="records")
