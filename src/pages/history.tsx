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
    const [chatHistory, setChatHistory] = useState({});

    const { data, status } = useSession();
    useEffect(() => {
        if (status !== 'authenticated') {
            router.push('/')
        }
    })

    //Set conversationID and user's Email
    useEffect(() => {
        const getUser = async () => {
            if (data?.user?.email) {

                const response = await fetch(`/api/getuser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.user.email }),
                })
                const result = await response.json();
                // console.log(result.user.rows[0].chathistory)
                setChatHistory(JSON.parse(result.user.rows[0].chathistory))
            }
        }
        getUser();

    }, [data])

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
        try{

            return Object.entries(chatHistory).map(([key, value]) => (
                <div key={key} className={style.conversation_container}>
                    <p>Conversation ID {key}</p>
                    { getMessages(JSON.stringify(value))}
                    {/* { JSON.stringify(value)} */}
                    {/* {value.map(item => (
                        <div key={item.id}>
                            <h2>{item.name}</h2>
                            <p>Age: {item.age}</p>
                            <p>Country: {item.country}</p>
                        </div>
                    ))} */}
                </div>
            ))
        }
        catch(err){
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
