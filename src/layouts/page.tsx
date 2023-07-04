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
        <h1 >DomMD AI Doctor</h1>
        <nav>
          <Link href="/chat">Chat</Link>
        </nav>
      </header>
      <main className={style.body}>{children}</main>
      <footer className={style.footer}>
        <p>© {new Date().getFullYear()} DomMD AI Doctor</p>
      </footer>
    </div>
  );
};

export default Page;
