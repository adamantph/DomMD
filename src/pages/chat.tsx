import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Page from '../layouts/page';
import style from "../styles/Chat.module.css"
import 'tailwindcss/tailwind.css';

const Chat = () => {
  interface messageFormat {
    sender: string,
    message: string
  }
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<messageFormat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  
  const scrollToLast = () => {
    const lastChildElement = chatContainerRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let userMessage = message
    setMessages((prevMessages) => [...prevMessages, { sender: "user", message: userMessage }]);

    scrollToLast();
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    setMessages((prevMessages) => [...prevMessages, { sender: "AI", message: data.response }]);

    setMessage('');
    scrollToLast();
    scrollToLast();
    scrollToLast();
  };

  return (
    <Page>
      <div className={style.chat}>
        <div className={style.chat_container}>
          <div className={style.chat_wrapper} ref={chatContainerRef}>

            {messages.map((message, index) => (

              <div key={index} className={style[`chat_${message.sender}`]}>
                <div className={style.chat_bubble}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className={style.chat_input}>
          <input
            type="text"
            value={message}
            onChange={handleChange}
            className={style.chat_input_box}
            defaultValue=''
            placeholder='Ask'
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
