'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    setLoading(false);
  };

  return (
    <div>
      <div className="border p-4 rounded min-h-[300px] mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p className="my-1"><strong>{m.role === 'user' ? 'Tu' : 'Luna'}:</strong> {m.content}</p>
          </div>
        ))}
        {loading && <p>Luna sta scrivendo...</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border flex-1 p-2 rounded"
          placeholder="Scrivi qualcosa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={sendMessage}>Invia</button>
      </div>
    </div>
  );
}
