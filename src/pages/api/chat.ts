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

  const { message } = req.body;

  // Input validation
  if (typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ message: 'Invalid input: message must be a non-empty string' });
  }

  try {
    // Prepare user message
    const userMessage = { role: 'user', content: message };

    // Make a request to the OpenAI GPT API to generate the response
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI-powered medical chatbot. After asking a few questions about symptoms, you should be able to make a diagnosis and suggest a treatment.' },
          { role: 'user', content: message },
          { role: 'assistant', content: 'assistant: Hello! How can I assist you today? Please describe your symptoms or concerns.' },
          userMessage,
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
    // Improved error handling
    if (error.response && error.response.data) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(500).json({ message: `Error generating chatbot response: ${error.response.data.error}` });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(500).json({ message: 'Chatbot service is currently unavailable' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ message: `Error generating chatbot response: ${error.message}` });
    }
  }
};

export default handler;
