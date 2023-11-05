import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email} = req.body;
  try {
    // Fetch conversations created by the user
    const conversations = await sql`SELECT * FROM conversations WHERE createdby = ${email}`;

    return res.status(200).json({ conversations : conversations.rows });
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ message: `Error fetching chat history: ${error.message}` });
  }
};

export default handler;
