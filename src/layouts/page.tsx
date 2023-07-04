import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';

interface PageProps {
  children: ReactNode;
}

const Page = ({ children }: PageProps) => {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <header className="mb-4">
        <h1 className="text-2xl">DomMD AI Doctor</h1>
        <nav>
      
          <Link href="/chat">Chat</Link>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="mt-4">
        <p>© {new Date().getFullYear()} DomMD AI Doctor</p>
      </footer>
    </div>
  );
};

export default Page;
