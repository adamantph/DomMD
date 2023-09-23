import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userEmail, conversationID } = req.body;

  // Input validation
  if (!userEmail || !conversationID) {
    return res.status(400).json({ message: 'Invalid input: userEmail and conversationID are required' });
  }

  try {
    // Fetch chat history for the given userEmail and conversationID from the database
    const user = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
    const chatHistoryForConversation = (user.rows[0].chathistory && user.rows[0].chathistory[conversationID]) ? user.rows[0].chathistory[conversationID] : [];

    return res.status(200).json({ history: chatHistoryForConversation });
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ message: `Error fetching chat history: ${error.message}` });
  }
};

export default handler;
