import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';
import style from "../styles/Layout.module.css"
import { useSession, signIn, signOut } from 'next-auth/react';
import router from 'next/router';
interface PageProps {
  children: ReactNode;
}
const Page = ({ children }: PageProps) => {
  
  return (
    <div className={style.main}>
      <header className={style.header}>
        <h1 >AskDom AI Doctor</h1>
        <nav className={style.links}>
        <Link href="/">Home</Link> 
        <Link href="/chat">Chat</Link>
        <button onClick={()=> signOut()}>Log Out</button>
        </nav>
      </header>
      <main className={style.body}>{children}</main>
      <footer className={style.footer}>
        <p>© {new Date().getFullYear()} AskDom AI Doctor</p>
        <p>Powered by GPT 3.5-Turbo</p>
      </footer>
    </div>
  );
};

export default Page;
