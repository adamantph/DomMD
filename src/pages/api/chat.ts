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

  try {
    // Prepare user message
    const userMessage = { role: 'user', content: message };

    // Make a request to the OpenAI GPT API to generate the response
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI-powered medical chatbot. We will start with an interview of me with important questions that will help you get to a proper diagnosis and treatment for me. You will ask the questions one message at a time and wait for my response after each one. Once you have asked enough questions to come up with a diagnosis, you will provide me with your diagnosis and treatment.' },
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
  } catch (error) {
    console.error('Error calling OpenAI GPT API:', error);
    return res.status(500).json({ message: 'Error generating chatbot response' });
  }
};

export default handler;
