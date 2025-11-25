import './styles/index.css';

import { Bot } from 'lucide-react';

import { ChatWindow } from './components/ChatWindow';
import { ChatForm } from './components/ChatForm';
import { useChat } from './hooks/useChat';

export function App() {
  const {
    userInput,
    setUserInput,
    chatLog,
    isChatLoading,
    handleChatMessages,
  } = useChat();

  return (
    <div className="container">
      <div className="app">
        <header className="app-header">
          <Bot className="logo-icon" size={28} />
          <h1 className="app-title">AI priori</h1>
        </header>
        <ChatWindow chatLog={chatLog} isChatLoading={isChatLoading} />
        <ChatForm
          userInput={userInput}
          setUserInput={setUserInput}
          handleSubmit={handleChatMessages}
          disabled={isChatLoading}
        />
      </div>
    </div>
  );
}
