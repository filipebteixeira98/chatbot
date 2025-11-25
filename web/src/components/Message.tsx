import type { ChatMessage } from '../types';

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  return <div className={`message ${message.type}`}>{message.text}</div>;
}
