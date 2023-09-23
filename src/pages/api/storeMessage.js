import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') {
        return response.status(405).end();
    }

    const {sender, message, userEmail, conversationID} = request.body;
    // Check if conversationID is valid
    if (!conversationID) {
        return response.status(400).json({ error: "Invalid conversationID" });
    }   

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const date = new Date();
    const dateStored = date.toLocaleDateString('en-US', options);

    // Get user's current history
    const user = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
    const prevHistory = user.rows[0].chathistory;

    let newHistory = [];
    if (prevHistory == null) {
        newHistory = {
            [conversationID]: [
                {
                    timestamp: dateStored,
                    from: sender,
                    content: message
                }
            ]
        };
        await sql`UPDATE users SET chatHistory = ${newHistory} WHERE email = ${userEmail}`;
        return response.status(200).json({newHistory});
    } else if (conversationID in JSON.parse(prevHistory)) {
        let currentChatHistory = JSON.parse(prevHistory);
        currentChatHistory[conversationID].push({
            timestamp: dateStored,
            from: sender,
            content: message
        });
        await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        return response.status(200).json({currentChatHistory});
    } else {
        let currentChatHistory = JSON.parse(prevHistory);
        currentChatHistory[conversationID] = [
            {
                timestamp: dateStored,
                from: sender,
                content: message
            }
        ];
        await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        return response.status(200).json({currentChatHistory});
    }

    return response.status(200).json({message});
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
}
