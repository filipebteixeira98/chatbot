import types
from fastapi.testclient import TestClient
import main

client = TestClient(main.app)

def test_health_check():
    r = client.get("/")

    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_chat_uses_retrieved_context(monkeypatch):
    main._documents[:] = [
        {"id": 1, "title": "stock", "content": "Produto: Test Widget\nQuantidade: 10\nStatus: Em estoque"}
    ]

    captured = {}

    def fake_generate_content(*args, **kwargs):
        contents = kwargs.get("contents") if "contents" in kwargs else (args[0] if args else "")
        captured["prompt"] = contents
    
        return types.SimpleNamespace(text="Resposta simulada")

    monkeypatch.setattr(main.model, "generate_content", fake_generate_content)

    r = client.post("/chat", json={"user_message": "Quais são os produtos disponíveis no estoque?"})
    
    assert r.status_code == 200

    body = r.json()
    
    assert body["bot_response"] == "Resposta simulada"
    assert ("Test Widget" in captured["prompt"]) or ("test widget" in captured["prompt"].lower())
    assert isinstance(body.get("used_docs"), list)
    assert body["used_docs"][0]["id"] == 1