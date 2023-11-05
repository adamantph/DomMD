import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { extractDiagnoses, extractTreatments, extractDoctors } from './helper';
import { sql } from '@vercel/postgres';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ChatbotResponse {
	response: string;
	diagnoses: string[];
	treatments: string[];
	doctors: string[];
}

function convertToMessagesArray(inputArray: [], fullMessage: string) {
	// Convert the input array to the desired format
	const messages = inputArray.map((item: any) => ({
		role: item.sender.toLowerCase(),
		content: item.message
	}));

	// Insert the system message at the start
	messages.unshift({
		role: 'system',
		content: 'You are a medical assistant chatbot designed to gather patient history and provide potential diagnoses. Please add ** tags for medical terms such as diseases and the such.'
	});

	// Append the user message at the end
	messages.push({
		role: 'user',
		content: fullMessage
	});

	return messages;
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	const { message, messages, userEmail, conversationID } = req.body;
	// console.log(messages, message)
	// Input validation
	if (typeof message !== 'string' || message.trim() === '') {
		return res.status(400).json({ message: 'Invalid input: message must be a non-empty string' });
	}

	// Fetch recent chat history
	// const user = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
	// const prevHistory = user.rows[0].chathistory;
	// const chatHistoryForConversation = (prevHistory && prevHistory[conversationID]) ? prevHistory[conversationID] : [];

	// // Ensure chatHistoryForConversation is an array and has the expected structure
	// const validHistory = Array.isArray(chatHistoryForConversation) ? chatHistoryForConversation : [];
	// const fullMessage = validHistory.map(row => `${row.from || 'Unknown'}: ${row.content || ''}`).join('\n') + `${message}`;

	try {
		// Make a request to the OpenAI GPT API to generate the response
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4',
				// messages: [
				//   { role: 'system', content: 'You are a medical assistant chatbot designed to gather patient history and provide potential diagnoses.' },
				//   { role: 'user', content: fullMessage },
				//   { role: 'assistant', content: 'Hello! How can I assist you today? Please describe your symptoms or concerns.' },
				// ],
				messages: convertToMessagesArray(messages, message),
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
			}
		);

		const { choices } = response.data;
		// response.choices[0].message['content']
		// console.log(choices[0].message['content'])
		const chatbotResponse = choices[0]?.message?.content?.trim() || '';

		// Extract diagnoses, treatments, and recommended doctors from the chatbot response
		const diagnoses = extractDiagnoses(chatbotResponse);
		const treatments = extractTreatments(chatbotResponse);
		const doctors = extractDoctors(chatbotResponse);

		const chatbotResponseWithInfo: ChatbotResponse = {
			response: chatbotResponse,
			diagnoses,
			treatments,
			doctors,
		};

		return res.status(200).json(chatbotResponseWithInfo);
	} catch (error: any) {
		console.error('Error calling OpenAI GPT API:', error);
		if (error.response && error.response.data) {
			return res.status(500).json({ message: `Error generating chatbot response: ${error.response.data.error}` });
		} else if (error.request) {
			return res.status(500).json({ message: 'Chatbot service is currently unavailable' });
		} else {
			return res.status(500).json({ message: `Error generating chatbot response: ${error.message}` });
		}
	}
};

export default handler;

// CREATE TABLE users (
//   email VARCHAR UNIQUE NOT NULL,
//   name VARCHAR(100),
//   country VARCHAR(50),
//   city VARCHAR(50),
//   address VARCHAR(255),
//   phone VARCHAR(20),
//   isVerified BOOLEAN,
//   dateAdded VARCHAR(50),
//   chatHistory VARCHAR
// );
