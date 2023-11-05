import { sql } from '@vercel/postgres';
 
 
export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') {
        return response.status(405).end();
    }
    // console.log(request.body)
    const {email} = request.body;
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit',minute: '2-digit',second: '2-digit', hour12: true };
    const date = new Date();
    const dateAdded = date.toLocaleDateString('en-US', options);
    await sql`INSERT INTO users (email,isVerified,dateAdded,conversations) VALUES (${email},false,${dateAdded},'[]')`;
    // return response.status(200).json({ message: 'User added successfully' });
    const user = await sql`SELECT * FROM users`;
    return response.status(200).json({user});
  } catch (error) {
    console.log(error)
    return response.status(500).json({ error });
  }
 
}