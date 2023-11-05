import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Page from '../layouts/page';
import style from "../styles/History.module.css"
import 'tailwindcss/tailwind.css';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const ChatHistory = () => {
    interface MessageFormat {
        timestamp: string;
        from: string;
        content: string;
    };
    const [chatHistory, setChatHistory] = useState([]);
    const [conversationToggle, setConversationToggle] = useState<boolean[]>([]);

    const { data, status } = useSession();
    useEffect(() => {
        if (status !== 'authenticated') {
            router.push('/')
        }
    })

    //Get conversations
    useEffect(() => {
        const getConversations = async () => {
            if (data?.user?.email) {

                const response = await fetch(`/api/getConversations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.user.email }),
                })
                const result = await response.json();
                console.log(result.conversations)
                setChatHistory(result.conversations)
                setConversationToggle(result.conversations.map(() => false))
            }
        }
        getConversations();

    }, [data])

    const updateIndex = (index: number) => {
        setConversationToggle(currentArray => {
          // Create a new array with all the same values as the current one
          let updatedArray = [...currentArray];
          
          // Update the value at the specific index
          updatedArray[index] = !updatedArray[index];
          
          // Return the new array to update the state
          return updatedArray;
        });
      };
      
    const getMessages = (messages: string) => {
        let messagesObject = JSON.parse(messages);

        return messagesObject.map((message: any, index: any) => (
            <div key={index} className={style.message_container}>
                <p className={style.message_timestamp}>{message.timestamp}</p>
                <p className={style.message_from}>From <span className={style.message_sender}>{message.from} </span></p>
                <p className={style.message_content}>{message.content}</p>
            </div>
        ));
    }
    const getHistory = () => {
        try {

            return chatHistory.map((conversation: any, index: any) => (
                <div key={index} className={conversationToggle[index] ? style.conversation_container : style.conversation_container_closed}>
                    <div className={style.conversation_header}>
                        <div>

                            <p className={style.conversation_title}>{conversation.title ? conversation.title : "Unnamed conversation"}</p>
                            <p className={style.conversation_sub_title}><span>{conversation.id}</span>|<span>{conversation.dateadded}</span></p>
                        </div>
                        <div className={style.conversation_actions}>
                            <button title='View messages' onClick={() => updateIndex(index)}>V</button>
                            <button title='Rename this conversation'>R</button>
                            <button title='Continue this conversation' onClick={() => router.push(`/chat/${conversation.id}`)}>C</button>
                        </div>
                    </div>
                    {getMessages(conversation.messages)}
                </div>
            ));
        }
        catch (err) {
            return "";
        }
    }

    return (
        <Page>
            <div className={style.history_container}>
                {getHistory()}
            </div>
        </Page>
    );
};

export default ChatHistory;
