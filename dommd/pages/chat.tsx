import { ChangeEvent, FormEvent, useState } from 'react';
import Page from '../src/app/page';
import 'tailwindcss/tailwind.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessages((prevMessages) => [...prevMessages, message]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    setMessages((prevMessages) => [...prevMessages, data.response]);

    setMessage('');
  };

  return (
    <Page>
      <div className="flex flex-col h-full">
        <div className="overflow-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            className="flex-grow mr-2"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </form>
      </div>
    </Page>
  );
};

export default Chat;
