import { useRef, useEffect, useState } from 'react';

import { Message } from './Message';

import type { ChatMessage } from '../types';

type ChatWindowProps = {
  chatLog?: ChatMessage[];
  isChatLoading?: boolean;
};

export function ChatWindow({
  chatLog = [],
  isChatLoading = false,
}: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chatWindowEndRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) return;

    const onScroll = () => {
      const tolerance = 20;
      const distanceFromBottom =
        containerElement.scrollHeight -
        containerElement.scrollTop -
        containerElement.clientHeight;

      setIsAtBottom(distanceFromBottom <= tolerance);
    };

    onScroll();

    containerElement.addEventListener('scroll', onScroll, { passive: true });

    return () => containerElement.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    chatWindowEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isChatLoading]);

  const handleScrollToBottom = () => {
    chatWindowEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    setIsAtBottom(true);
  };

  return (
    <div className="chat-window-wrapper">
      <div className="chat-window" ref={containerRef}>
        {chatLog.length === 0 && !isChatLoading ? (
          <div className="chat-placeholder">
            Start a conversation — type a message below.
          </div>
        ) : (
          <>
            {chatLog.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isChatLoading && <div className="message bot">Loading...</div>}
            <div ref={chatWindowEndRef} />
          </>
        )}
      </div>
      {!isAtBottom && (
        <button
          className="scroll-to-bottom"
          onClick={handleScrollToBottom}
          aria-label="Scroll to bottom"
          type="button"
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
}
