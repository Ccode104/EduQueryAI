import ChatInput from '../ChatInput';
import { useState } from 'react';

export default function ChatInputExample() {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="max-w-2xl">
      <div className="mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-muted rounded text-sm">
            {msg}
          </div>
        ))}
      </div>
      <ChatInput
        onSend={(msg) => {
          console.log('Message sent:', msg);
          setMessages([...messages, msg]);
        }}
      />
    </div>
  );
}
