
from transformers import pipeline

moderator = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=None
)

def analyze_post(content: str):
   
    result = moderator(content)
    
    if isinstance(result, list):
        result = result[0]
        if isinstance(result, list):
            result = result[0]

    label = result.get("label", "unknown")
    score = round(float(result.get("score", 0.0)), 3)
    return {"label": label, "confidence": score}
