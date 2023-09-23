import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { extractDiagnoses, extractTreatments, extractDoctors } from './helper';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ChatbotResponse {
  response: string;
  diagnoses: string[];
  treatments: string[];
  doctors: string[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message, userEmail, conversationID } = req.body;

  // Input validation
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ message: 'Invalid input: message must be a non-empty string' });
  }

  // Fetch recent chat history (Replace with your actual database query method)
  const history = YOUR_DATABASE_QUERY_METHOD(`
    SELECT chathistory FROM users
    WHERE email = ${userEmail}
  `);

  // Extract chat messages for the given conversationID from the history
  const chatHistoryForConversation = history[conversationID] || [];
  const fullMessage = chatHistoryForConversation.map(row => `${row.role}: ${row.content}`).join('\n') + `\nUser: ${message}`;

  try {
    // Make a request to the OpenAI GPT API to generate the response
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a medical assistant chatbot designed to gather patient history and provide potential diagnoses.' },
          { role: 'user', content: fullMessage },
          { role: 'assistant', content: 'AskDom: Hello! How can I assist you today? Please describe your symptoms or concerns.' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const { choices } = response.data;
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
