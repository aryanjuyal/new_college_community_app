
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_answer(context, question):
    prompt = (
        "You are a helpful chatbot for a college community app.\n"
        "Use the provided context to answer accurately and concisely.\n"
        f"Context:\n{context}\n\nQuestion:\n{question}\nAnswer:"
    )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",  
        messages=[
            {"role": "system", "content": "You are a friendly assistant for a college community app."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()
