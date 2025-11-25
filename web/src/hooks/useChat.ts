import { useState, useEffect } from 'react';

import { handleSendUserMessage } from '../services/api';

import type { ChatMessage } from '../types';

export function useChat() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const storedChatLog = localStorage.getItem('chatLog');

    if (storedChatLog) {
      setChatLog(JSON.parse(storedChatLog) as ChatMessage[]);
    }
  }, []);

  const handleChatMessages = async (): Promise<void> => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { type: 'user', text: userInput };
    const newUserChatLog = [...chatLog, userMessage];

    setChatLog(newUserChatLog);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const botText = await handleSendUserMessage(userInput);
      const botMessage: ChatMessage = { type: 'bot', text: botText };
      const finalChatLog = [...newUserChatLog, botMessage];

      setChatLog(finalChatLog);

      localStorage.setItem('chatLog', JSON.stringify(finalChatLog));
    } catch (error) {
      console.error('Error fetching chat response:', error);

      const errorMessage: ChatMessage = {
        type: 'error',
        text: 'Sorry, something went wrong. Please try again.',
      };

      setChatLog((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    userInput,
    setUserInput,
    chatLog,
    isChatLoading,
    handleChatMessages,
  };
}
