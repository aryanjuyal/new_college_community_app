
import os, openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_answer(context, question):
    prompt = (
        "You are a friendly AI assistant for a college community app.\n"
        "Use the given context and data to answer accurately.\n"
        f"Context:\n{context}\n\nQuestion:\n{question}\nAnswer:"
    )
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300
    )
    return response.choices[0].message["content"].strip()
