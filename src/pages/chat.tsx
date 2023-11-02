import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Page from '../layouts/page';
import style from "../styles/Chat.module.css";
import 'tailwindcss/tailwind.css';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const Chat = () => {
	// Generate a unique conversationID if not already set
	const [conversationID, setConversationID] = useState(() => {
		return Math.random().toString(36).substr(2, 9);
	});
	const [userEmail, setUserEmail] = useState('');

	const { data, status } = useSession();
	useEffect(() => {
		if (status !== 'authenticated') {
			router.push('/');
		}
	});

	useEffect(() => {
		if (data?.user?.email) {
			setUserEmail(data.user.email);
		}
	}, [data]);

	interface messageFormat {
		sender: string,
		message: string
	}
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<messageFormat[]>([]);
	const [chatDisabled, setChatDisabled] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);

	const scrollToLast = () => {
		const lastChildElement = chatContainerRef.current?.lastElementChild;
		lastChildElement?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
		scrollToLast();
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setChatDisabled(true);

		// Fetch the chat history for the given conversationID and userEmail
		const chatHistoryResponse = await fetch(`/api/fetchChatHistory`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userEmail, conversationID }),
		});
		const chatHistoryData = await chatHistoryResponse.json();
		const previousMessages = chatHistoryData && Array.isArray(chatHistoryData.history) ? chatHistoryData.history : [];

		// Concatenate chat history with the current message
		const fullMessage = previousMessages.map((msg: messageFormat) => `${msg.sender}: ${msg.message}`).join('\n') + `${message}`;

		// Add user query messages
		setMessages((prevMessages) => [...prevMessages, { sender: "user", message: fullMessage }]);
		setMessages((prevMessages) => [...prevMessages, { sender: "load", message: 'AskDom is thinking ...' }]);

		// Store the user's message
		fetch(`/api/storeMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userEmail, sender: "user", message: fullMessage, conversationID }),
		});

		scrollToLast();
		setMessage('');

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userEmail, message: fullMessage, messages: messages }),  // Use the concatenated message
		});

		const data = await response.json();

		// Add chatbot response messages
		setMessages((prevMessages) => prevMessages.slice(0, -1));
		setMessages((prevMessages) => [...prevMessages, { sender: "assistant", message: data.response }]);

		// Store the chatbot's response
		fetch(`/api/storeMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userEmail, sender: "assistant", message: data.response, conversationID }),
		});

		scrollToLast();
		setChatDisabled(false);
	};

	useEffect(() => {
		scrollToLast();
	},[messages]);

	function formatTextToJSXParagraphs(inputText: string) {
		const paragraphs = inputText.split('\n');

		// Function to process text for bold and italics
		const processText = (text : string, key : any) => {
			// Split the text by ** for bold and * for italics
			return text.split(/(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g).map((part, index) => {
				if (!part) return null; // Filter out empty strings
				// Check for bold text surrounded by **
				if (/^\*\*(.*)\*\*$/.test(part)) {
					return <span key={`${key}-b-${index}`} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</span>;
				}
				// Check for italic text surrounded by *
				if (/^\*(.*)\*$/.test(part)) {
					return <span key={`${key}-i-${index}`} style={{ fontStyle: 'italic',fontWeight: '600'  }}>{part.slice(1, -1)}</span>;
				}
				// Check for italic text surrounded by _
				if (/^_(.*)_$/g.test(part)) {
					return <span key={`${key}-i-${index}`} style={{ textDecoration: 'underline',}}>{part.slice(1, -1)}</span>;
				  }
				  
				// Return the text as is if it's not bold or italic
				return part;
			});
		};

		// Map each paragraph to a JSX <p> element with formatted text
		const paragraphElements = paragraphs.map((paragraph, pIndex) => {
			const parts = processText(paragraph, pIndex);

			return (
				<div key={pIndex}>
					<p>{parts}</p>
					{pIndex < paragraphs.length - 1 && <><br/></>} {/* Add breaks except after the last paragraph */}
				</div>
			);
		});

		return paragraphElements;
	}
	return (
		<Page>
			<div className={style.chat}>
				<div className={style.chat_container}>
					<div className={style.chat_wrapper} ref={chatContainerRef}>
						{messages.map((message, index) => (
							<div key={index} className={style[`chat_${message.sender}`]}>
								<div className={style.chat_bubble}>
									{formatTextToJSXParagraphs(message.message)}
								</div>
							</div>
						))}
					</div>
				</div>
				<form onSubmit={handleSubmit} className={style.chat_input}>
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
									placeholder='Type your message...'
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
