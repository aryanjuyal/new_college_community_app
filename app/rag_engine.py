
import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

class RAGEngine:
    def __init__(self, kb_path="knowledge_base", collection_name="community_kb"):
        self.kb_path = kb_path
        self.collection_name = collection_name
        self.client = chromadb.Client(Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(collection_name)
        self.embedder = None 
        self.indexed = False

    def _load_model(self):
        if self.embedder is None:
            print("🔄 Loading SentenceTransformer model lazily...")
            self.embedder = SentenceTransformer("paraphrase-MiniLM-L3-v2")

    def index_kb(self):
        if self.indexed:
            return
        print("🧩 Indexing knowledge base...")
        self._load_model()
        from pathlib import Path
        splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=150)
        chunks = []
        for path in Path(self.kb_path).glob("*.md"):
            chunks.extend(splitter.split_text(path.read_text(encoding="utf-8")))
        embeddings = self.embedder.encode(chunks).tolist()
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        self.collection.add(ids=ids, documents=chunks, embeddings=embeddings)
        self.indexed = True
        print(f"✅ Indexed {len(chunks)} chunks.")

    def retrieve(self, query: str, top_k=3):
        self._load_model()
        q_emb = self.embedder.encode([query]).tolist()
        result = self.collection.query(query_embeddings=q_emb, n_results=top_k)
        return result["documents"][0]
