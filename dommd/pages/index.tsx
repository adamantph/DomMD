import Page from '../src/app/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

const Home = () => {
  return (
    <Page>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl mb-4">Welcome to the AI Doctor Chatbot!</h1>
        <p className="mb-4">
          This chatbot uses AI to provide general health information based on your symptoms. Please note that this chatbot does not replace a consultation with a healthcare professional and is intended to be used for informational purposes only.
        </p>
        <Link href="/chat" className="p-2 bg-blue-500 text-white rounded">Start Chat</Link>
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-xl mb-2">How to Use the AI Doctor Chatbot</h2>
        <p className="mb-2">1. Click the "Start Chat" button to begin.</p>
        <p className="mb-2">2. Describe your symptoms in as much detail as possible.</p>
        <p className="mb-2">3. The chatbot will provide general health information based on your symptoms.</p>
        <p className="mb-2">4. If necessary, consult a healthcare professional for further advice.</p>
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-xl mb-2">Disclaimer</h2>
        <p>This chatbot is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </Page>
  );
};

export default Home;
