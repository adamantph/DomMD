import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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
    // Make a request to the OpenAI GPT API to generate the response
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI-powered medical chatbot. You can help provide insights about your symptoms and suggest possible diagnoses, treatments, and recommended doctors.' },
          { role: 'user', content: `Patient: ${message}` },
          { role: 'assistant', content: 'assistant: Hello! How can I assist you today? Please describe your symptoms or concerns.' },
          { role: 'user', content: `Patient: ${message}` },

          { role: 'assistant', content: 'assistant: Sure, I will ask you a few questions to better understand your symptoms.' },
          { role: 'user', content: `Patient: ${message}` },

          { role: 'assistant', content: 'assistant: What is your age?' },
          { role: 'user', content: `Patient: ${message}` },

          { role: 'assistant', content: 'assistant: Are you currently taking any medications?' },
          { role: 'user', content: `Patient: ${message}` },


          { role: 'assistant', content: 'assistant: Have you recently traveled to any foreign countries?' },
          { role: 'user', content: `Patient: ${message}` },

          { role: 'assistant', content: 'assistant: Have you been in contact with someone who has a known illness?' },
          { role: 'user', content: `Patient: ${message}` },

          { role: 'assistant', content: 'assistant: Have you had any recent changes in your diet or exercise routine?' },
          { role: 'user', content: `Patient: ${message}` },


          { role: 'assistant', content: 'assistant: Are you experiencing any specific pain or discomfort?' },
          { role: 'user', content: `Patient: ${message}` },


          { role: 'assistant', content: 'assistant: Are there any other symptoms or information you would like to share?' },
          { role: 'user', content: `Patient: ${message}` },

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
    const chatbotResponse = choices[0].message.content.trim();

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

// Helper function to extract possible diagnoses from the chatbot response
const extractDiagnoses = (response: string): string[] => {
  const diagnoses: string[] = [];
  const regex = /Possible diagnosis[s]?:\s*(.*?)\s*(?=Possible treatment[s]?|\n|$)/gs;
  let match;

  while ((match = regex.exec(response))) {
    const diagnosis = match[1].trim();
    diagnoses.push(diagnosis);
  }

  return diagnoses;
};

// Helper function to extract possible treatments from the chatbot response
const extractTreatments = (response: string): string[] => {
  const treatments: string[] = [];
  const regex = /Possible treatment[s]?:\s*(.*?)\s*(?=Recommended doctor[s]?|\n|$)/gs;
  let match;

  while ((match = regex.exec(response))) {
    const treatment = match[1].trim();
    treatments.push(treatment);
  }

  return treatments;
};

// Helper function to extract recommended doctors from the chatbot response
const extractDoctors = (response: string): string[] => {
  const doctors: string[] = [];
  const regex = /Recommended doctor[s]?:\s*(.*?)\s*(?=\n|$)/gs;
  let match;

  while ((match = regex.exec(response))) {
    const doctor = match[1].trim();
    doctors.push(doctor);
  }

  return doctors;
};

export default handler;
