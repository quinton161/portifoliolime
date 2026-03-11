from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests
import wikipedia
import pywhatkit as kit
from typing import Optional

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/status")
async def status():
    return {"status": "online", "gemini": model is not None}

def get_gemini_response(query: str):
    if not model:
        return "Gemini API key not configured."
    try:
        response = model.generate_content(query)
        return response.text.replace("*", "")
    except Exception as e:
        return f"Error: {str(e)}"

@app.post("/chat")
async def chat(request: ChatRequest):
    query = request.message.lower()
    
    # Basic command logic from jarvis.py
    if "how are you" in query:
        return {"response": "I am absolutely fine sir. What about you?"}
    
    elif "google" in query and "search" in query:
        search_query = query.replace("search on google", "").strip()
        if search_query:
            kit.search(search_query)
            return {"response": f"Searching Google for {search_query}"}
            
    elif "wikipedia" in query:
        search_query = query.replace("search on wikipedia", "").strip()
        try:
            results = wikipedia.summary(search_query, sentences=2)
            return {"response": f"According to Wikipedia: {results}"}
        except:
            pass

    # Fallback to Gemini
    if model:
        response = get_gemini_response(query)
        return {"response": response}
    
    return {"response": "I'm sorry, I couldn't process that request."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
