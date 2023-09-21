import { sql } from '@vercel/postgres';


export default async function handler(request, response) {
    try {
        if (request.method !== 'POST') {
            return response.status(405).end();
        }
        // console.log(request.body)
        const { name, phonenumber, email, country, city, address} = request.body;
        await sql`
        update users set 
        isVerified = true,
        name = ${name},
        phone = ${phonenumber},
        country = ${country},
        city = ${city},
        address = ${address}
        WHERE email = ${email}`;
        return response.status(200).json({ message: `User ${email} is now verified` });
    } catch (error) {
        console.log(error)
        return response.status(500).json({ error });
    }

}