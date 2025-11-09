
import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter


class RAGEngine:
    def __init__(self, kb_path="knowledge_base", collection_name="community_kb"):
        self.kb_path = kb_path
        self.collection_name = collection_name
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.client = chromadb.Client(Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(collection_name)

    def index_kb(self):
        docs = []
        for file in os.listdir(self.kb_path):
            if file.endswith(".md"):
                with open(os.path.join(self.kb_path, file), "r", encoding="utf-8") as f:
                    docs.append(f.read())

        splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=150)
        chunks = []
        for d in docs:
            chunks.extend(splitter.split_text(d))

        embeddings = self.embedder.encode(chunks).tolist()
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        self.collection.add(ids=ids, embeddings=embeddings, documents=chunks)
        print(f"✅ Indexed {len(chunks)} chunks.")

    def retrieve(self, query: str, top_k=3):
        q_emb = self.embedder.encode([query]).tolist()
        result = self.collection.query(query_embeddings=q_emb, n_results=top_k)
        return result["documents"][0]
