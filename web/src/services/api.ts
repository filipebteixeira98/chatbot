export async function handleSendUserMessage(
  userInput: string
): Promise<string> {
  const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_message: userInput }),
  });

  if (!response.ok) {
    throw new Error(`Something went wrong! HTTP status: ${response.status}`);
  }

  const data = await response.json();

  return data.bot_response;
}
