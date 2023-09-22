import { sql } from '@vercel/postgres';
 
 
export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') {
        return response.status(405).end();
    }
    // console.log(request.body)
    const {sender,message,userEmail,conversationID} = request.body;
    //Sender is who sent the message
    //Message is the content of the message
    //userEmail is the email of the signed in user
    //conversationID is the ID of the conversation used for storing purposes and proper grouping of all the messages


    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit',minute: '2-digit',second: '2-digit', hour12: true };
    const date = new Date();
    const dateStored = date.toLocaleDateString('en-US', options);

    //Get user's current history
    const user = await sql`SELECT * FROM users where email = ${userEmail}`;
    const prevHistory = user.rows[0].chathistory
    // console.log(chatHistory)
    let newHistory = []
    if(prevHistory == null){
        // console.log("No history");
        newHistory = {
            [conversationID] : [
                {
                    timestamp : dateStored,
                    from : sender,
                    content : message
                }
            ]
        }
        await sql` update users set chatHistory = ${newHistory} WHERE email = ${userEmail}`;
        console.log(newHistory)
        return response.status(200).json({newHistory});
    }else if(conversationID in JSON.parse(prevHistory)) {
        //Covnersation exists so just need to push to it
        let currentChatHistory = JSON.parse(prevHistory)
        currentChatHistory[conversationID].push(
            {
                timestamp : dateStored,
                from : sender,
                content : message
            }
        );
        await sql` update users set chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        // console.log(currentChatHistory,"2nd")
        return response.status(200).json({currentChatHistory});
    }else{
        //Has history but not for this conversation. So create a new entry.
        let currentChatHistory = JSON.parse(prevHistory)
        currentChatHistory[conversationID] = [
            {
                timestamp : dateStored,
                from : sender,
                content : message
            }];
        await sql` update users set chatHistory = ${currentChatHistory} WHERE email = ${userEmail}`;
        // console.log(currentChatHistory,"3rd")
        return response.status(200).json({currentChatHistory});
    }

    // await sql`INSERT INTO users (email,isVerified,dateAdded) VALUES (${email},false,${dateAdded})`;
    // return response.status(200).json({ message: 'User added successfully' });
    // const user = await sql`SELECT * FROM users`;


    // console.log(sender,message,userEmail,conversationID)
    return response.status(200).json({message});
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error });
  }
 
}