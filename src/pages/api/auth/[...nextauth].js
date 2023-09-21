import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from "next-auth/providers/credentials";
// import { sql } from '@vercel/postgres';

const checkCredentials = async (username, password) => {
    // const user = await sql`SELECT * FROM user_creds where username = ${username};`;
    // console.log(user.rows)
    // if (Object.keys(user.rows).length >= 1) {
    //     return username == user.rows[0].username && password== user.rows[0].password
    // }
    return false;
  };
export const authOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],
 session: {
  strategy: 'jwt',
 },
};
export default NextAuth(authOptions);