<h1 align="center"> AI Priori </h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/filipebteixeira98/chatbot?color=4129a3&style=flat-square">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/filipebteixeira98/chatbot?color=4129a3&style=flat-square">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/filipebteixeira98/chatbot?color=4129a3&style=flat-square">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/filipebteixeira98/chatbot?color=4129a3&style=flat-square">
</p>

<p align="center">
  <img alt="AI priori" src="web/.github/mockup.png" width="100%">
</p>

Small React + TypeScript chat UI that talks to a backend LLM endpoint.  
Uses Vite, React 19, TypeScript, lucide-react for icons.

## 💻 Environment

- API base URL is read from VITE_API_URL. Copy and edit:
  - See [.env.example](.env.example)
  - Create `.env` at project root with:
    VITE_API_URL=http://localhost:8000
- Vite reads .env on startup, so you need to restart dev server after changing.

## 👷‍♂️ How to run

Prerequisites

- Node.js (16+ recommended)
- npm

```bash
# Clone repository and enter folder
git clone https://github.com/filipebteixeira98/chatbot.git
cd chatbot/web

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:5173 (Vite prints the exact URL)
```

# Simple RAG with Gemini (Gemini LLM)

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
# Navigate to the server directory
cd server

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
