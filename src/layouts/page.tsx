import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';
import style from "../styles/Layout.module.css"
interface PageProps {
  children: ReactNode;
}

const Page = ({ children }: PageProps) => {
  return (
    <div className={style.main}>
      <header className={style.header}>
        <h1 >AskDom AI Doctor</h1>
        <nav>
        <Link href="/">Home</Link>  <Link href="/chat">Chat</Link>
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
