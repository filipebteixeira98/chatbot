export type ChatMessage = {
  type: 'user' | 'bot' | 'error';
  text: string;
};
