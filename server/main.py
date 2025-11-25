import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import re
from typing import List, Optional

load_dotenv()

app = FastAPI()

genai.configure(api_key=os.getenv("API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

origins = [
    "http://localhost:5173",
    "http://localhost:4000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    user_message: str

class Document(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    content: str

_documents: List[dict] = []
_next_doc_id = 1

def _tokenize(text: str) -> List[str]:
    return re.findall(r"\w+", (text or "").lower())

def _score_overlap(query: str, doc_text: str) -> float:
    q_tokens = set(_tokenize(query))
    d_tokens = set(_tokenize(doc_text))
    
    if not q_tokens or not d_tokens:
        return 0.0
    
    overlap = q_tokens.intersection(d_tokens)
    
    return len(overlap) / (len(q_tokens) ** 0.5)

def simple_search(query: str, top_k: int = 3) -> List[dict]:
    scored = []
    
    for d in _documents:
        s = _score_overlap(query, d["content"])
        
        if s > 0:
            scored.append((s, d))
    
    scored.sort(key=lambda x: x[0], reverse=True)
    
    return [d for _, d in scored[:top_k]]

def load_documents_from_folder(folder: str = "knowledge"):
    """Read all .txt files from `folder` and populate the in-memory store."""
    
    global _documents, _next_doc_id
    _documents = []
    _next_doc_id = 1
    
    os.makedirs(folder, exist_ok=True)
    
    for fname in sorted(os.listdir(folder)):
        if not fname.lower().endswith(".txt"):
            continue
    
        path = os.path.join(folder, fname)
    
        try:
            with open(path, "r", encoding="utf-8") as fh:
                content = fh.read().strip()
        except Exception as e:
            print(f"Failed to read {path}: {e}")
            continue
       
        entry = {"id": _next_doc_id, "title": os.path.splitext(fname)[0], "content": content}
        _documents.append(entry)
        _next_doc_id += 1
    
    print(f"Loaded {_next_doc_id - 1} documents from {folder}")

load_documents_from_folder("knowledge")

@app.get("/")
async def health_check():
    """A simple endpoint to confirm the server is running."""
    
    return {"status": "ok"}

@app.post("/chat")
async def chat_with_ai(input_data: ChatInput):
    """The main endpoint to handle chat interactions with simple RAG."""
    try:
        retrieved = simple_search(input_data.user_message, top_k=3)
       
        if retrieved:
            context_parts = []
            
            for d in retrieved:
                title = f"{d.get('title')} — " if d.get('title') else ""
                context_parts.append(f"{title}{d['content']}")
            
            context_str = "\n\n---\n\n".join(context_parts)
            prompt = (
                "Você é um assistente que responde usando APENAS o contexto abaixo. "
                "Se a resposta NÃO estiver no contexto, responda que não sabe ou algo relacionado, informando ao usuário que sua capacidade está restrita às informações contidas no documentos. "
                "Responda exatamente no mesmo idioma da pergunta do usuário, seja qual for. \n\n"
                f"Contexto:\n{context_str}\n\nPergunta: {input_data.user_message}\n\nResposta:"
            )
        else:
            prompt = (
                "Não encontrei contexto relevante nos documentos. "
                "Se quiser, adicione mais documentos ou seja mais específico. "
                f"Pergunta: {input_data.user_message}\n\nResposta: Não sei"
            )
            
        response = model.generate_content(contents=prompt)

        return {"bot_response": response.text, "used_docs": retrieved}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))