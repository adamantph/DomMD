import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const {email} = request.body;
    // console.log("Getting info for", username)
    const user = await sql`SELECT * FROM users`;
    return response.status(200).json({user});
}