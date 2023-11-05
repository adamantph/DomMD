import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        if (request.method !== 'POST') {
            return response.status(405).end();
        }
        let conversationExistence = false, conversation;
        const { sender, message, userEmail, conversationID } = request.body;

        // Check if conversationID is valid
        // if (!conversationID) {
        //     return response.status(400).json({ error: "Invalid conversationID" });
        // }   

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const date = new Date();
        const dateStored = date.toLocaleDateString('en-US', options);

        //Create new conversation entry on Conversations table. 
        if (conversationID == '' || conversationID == undefined) {
            console.log("Creating new conversation")
            // Keep creating IDs until a new unique one is created
            while (true) {
                //Generate ID
                let convoID = Math.random().toString(36).substring(2, 9);
                //Check if a conversation with this ID exists
                const convo = await sql`SELECT * FROM conversations WHERE id = ${convoID}`;
                //If it doesnt, create a new entry on the conversations table
                if (convo.rows[0] == undefined) {
                    let newMessage = [
                        {
                            timestamp: dateStored,
                            from: sender,
                            content: message
                        }
                    ]

                    await sql`insert into conversations (id,messages,dateadded) values (${convoID},${JSON.stringify(newMessage)},${dateStored})`;
                    // await sql`UPDATE conversations SET messages = ${newMessage},dateadded = ${dateStored} WHERE id = ${conversationID}`;
                    console.log("Conversation ID : ", convoID)
                    return response.status(200).json({ convoID });
                }
            }
        }
        //Add new message if a conversationID is given.
        else {
            console.log("Adding new message to an existing conversation")
            //Get existing conversation
            const convo = await sql`SELECT * FROM conversations WHERE id = ${conversationID}`;

            let currentMessages = JSON.parse(convo.rows[0].messages);
            let newMessage =
            {
                timestamp: dateStored,
                from: sender,
                content: message
            }

            currentMessages.push(newMessage)
            // await sql`insert into conversations (id,messages,dateadded) values (${convoID},${JSON.stringify(newMessage)},${dateStored})`;
            await sql`UPDATE conversations SET messages = ${JSON.stringify(currentMessages)} WHERE id = ${conversationID}`;
            console.log("Conversation ID : ", conversationID)
            return response.status(200).json({ convoID: conversationID});
        }

        // while (conversationExistence) {
        //     let convoID = Math.random().toString(36).substring(2, 9);
        //     const convo = await sql`SELECT * FROM conversations WHERE id = ${convoID}`;
        // }
        // console.log(convo.rows[0], message)
        // if (convo.rows[0] == undefined) {
        //     conversationExistence = false

        // }
        // else {
        //     conversation = convo.rows[0];
        //     conversationExistence = true

        // }
        // // return conversationID

        // //If the conversation already exists
        // console.log("Conversation exists : ", conversationExistence)
        // if (!conversationExistence) {
        //     newMessage = [
        //         {
        //             timestamp: dateStored,
        //             from: sender,
        //             content: message
        //         }
        //     ]

        //     await sql`insert into conversations (messages,dateadded) values (${newMessage},${dateStored}) WHERE id = ${conversationID}`;
        //     // await sql`UPDATE conversations SET messages = ${newMessage},dateadded = ${dateStored} WHERE id = ${conversationID}`;
        //     return response.status(200).json({ conversationID });
        // } else {

        // }


        // else if (conversationID in JSON.parse(prevHistory)) {
        //     let currentChatHistory = JSON.parse(prevHistory);
        //     currentChatHistory[conversationID].push({
        //         timestamp: dateStored,
        //         from: sender,
        //         content: message
        //     });
        //     await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        //     return response.status(200).json({ currentChatHistory });
        // } else {
        //     let currentChatHistory = JSON.parse(prevHistory);
        //     currentChatHistory[conversationID] = [
        //         {
        //             timestamp: dateStored,
        //             from: sender,
        //             content: message
        //         }
        //     ];
        //     await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        //     return response.status(200).json({ currentChatHistory });
        // }
        // let newHistory = [];
        // if (prevHistory == null) {
        //     newHistory = {
        //         [conversationID]: [
        //             {
        //                 timestamp: dateStored,
        //                 from: sender,
        //                 content: message
        //             }
        //         ]
        //     };
        //     await sql`UPDATE users SET chatHistory = ${newHistory} WHERE email = ${userEmail}`;
        //     return response.status(200).json({newHistory});
        // } else if (conversationID in JSON.parse(prevHistory)) {
        //     let currentChatHistory = JSON.parse(prevHistory);
        //     currentChatHistory[conversationID].push({
        //         timestamp: dateStored,
        //         from: sender,
        //         content: message
        //     });
        //     await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        //     return response.status(200).json({currentChatHistory});
        // } else {
        //     let currentChatHistory = JSON.parse(prevHistory);
        //     currentChatHistory[conversationID] = [
        //         {
        //             timestamp: dateStored,
        //             from: sender,
        //             content: message
        //         }
        //     ];
        //     await sql`UPDATE users SET chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        //     return response.status(200).json({currentChatHistory});
        // }

    } catch (error) {
        console.log(error);
        return response.status(500).json({ error });
    }
}
