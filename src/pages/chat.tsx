import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Page from '../layouts/page';
import style from "../styles/Chat.module.css"
import 'tailwindcss/tailwind.css';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const Chat = () => {

  const { data, status } = useSession();
  useEffect(()=>{
    if (status !== 'authenticated') {
      router.push('/')
    }
  })
  
  interface messageFormat {
    sender: string,
    message: string
  }
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<messageFormat[]>([]);
  const [chatDisabled,setChatDisabled] = useState(false);
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
    setChatDisabled(true)
    setMessages((prevMessages) => [...prevMessages, { sender: "user", message: message }]);
    let previousMessages = [...messages, { sender: "user", message: message }]
    setMessages((prevMessages) => [...prevMessages, { sender: "load", message: 'AskDom is thinking ...' }]);

    scrollToLast();
    setMessage('');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    
    setMessages((prevMessages) => prevMessages.slice(0, -1));
    setMessages((prevMessages) => [...prevMessages, { sender: "AI", message: data.response }]);

    scrollToLast();
    scrollToLast();
    scrollToLast();
    
    setChatDisabled(false)
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
        <form onSubmit={handleSubmit} className={style.chat_input} >
          {
            chatDisabled ? 
            <>             
              <input
                type="text"
                value={message}
                onChange={handleChange}
                className={style.chat_input_box_disabled}
                placeholder='Please wait...'
                disabled
              />
              <button type="submit" className="p-2 bg-gray-400 text-white rounded" disabled>
                Send
              </button>
            </>
            :
            <>
              <input
                type="text"
                value={message}
                onChange={handleChange}
                className={style.chat_input_box}
                placeholder='Ask'
              />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                Send
              </button>
            </>
          }
        </form>
      </div>
    </Page>
  );
};

export default Chat;
