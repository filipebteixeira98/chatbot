# Pixaflow — Simple RAG demo with Gemini (Gemini LLM)

Small FastAPI project demonstrating a minimal Retrieval-Augmented Generation (RAG) setup that:

- Loads plain-text documents from a local `knowledge/` folder at startup
- Uses a tiny keyword-overlap retriever to find relevant documents
- Passes retrieved documents as context to Google Gemini (via `google-generativeai`)

This repository is intentionally minimal so you can iterate quickly and test RAG behavior in a Vite frontend.

## 📰 Files of interest

- [`main.py`](main.py) — FastAPI app, retriever, and chat endpoint (see [`chat_with_ai`](main.py) and [`simple_search`](main.py)).
- `knowledge/market-stock.txt`, `knowledge/faq.txt`, `knowledge/deployment.txt` — sample context documents loaded at startup.
- [`requirements.txt`](requirements.txt) — Python dependencies.

## 👷‍♀️ What it does

- Loads all `.txt` files from `knowledge/` into an in-memory list (`_documents`) at startup (via `load_documents_from_folder`).
- When `/chat` is called it:
  - Runs `simple_search` (keyword overlap) to get top-k relevant docs.
  - Builds a prompt that includes those docs as "context" and the user question.
  - Calls Gemini (`model.generate_content`) and returns `{ "bot_response": ..., "used_docs": [...] }`.

## 💻 Quickstart (Linux)

```bash
# Create virtualenv
python3 -m venv .venv
source .venv/bin/activate

# Install deps
pip install -r requirements.txt

# Provide API key

# Create a `.env` file in the project root with:
# GOOGLE_API_KEY=your_api_key_here

# Start server
uvicorn main:app --reload --port 8000

# Test endpoints
curl -s -X POST http://localhost:8000/chat \
 -H "Content-Type: application/json" \
 -d '{"user_message":"Quais são os produtos disponíveis no estoque?"}' \
# Response JSON contains `bot_response` and `used_docs`.
```

## 📝 License

This project is under the MIT license.

<p align="center">
  Made with ♥ by me
</p>
