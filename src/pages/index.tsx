import Page from '../layouts/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import style from "../styles/Index.module.css"

const Home = () => {
  return (
    <Page>
      <div className={style.index}>
        <h1 className="text-2xl mb-1">Welcome to AskDom !</h1>
        <h1 className="text-xl mb-2">Your AI Medical Chat Bot</h1>
        <p className="mb-4">
          This chatbot uses AI to provide general health information based on your symptoms. Please note that this chatbot does not replace a consultation with a healthcare professional and is intended to be used for informational purposes only.
        </p>
        <Link href="/chat" className="p-2 bg-blue-500 text-white rounded">Start Chat</Link>
      </div>
      <div className="mt-5 text-center">
        <h2 className="text-xl mb-1">How to Use the AI Doctor Chatbot</h2>
        <p className="mb-1">1. Click the &quot;Start Chat&quot; button to begin.</p>
        <p className="mb-1">2. Describe your symptoms in as much detail as possible.</p>
        <p className="mb-1">3. The chatbot will provide general health information based on your symptoms.</p>
        <p className="mb-1">4. If necessary, consult a healthcare professional for further advice.</p>
      </div>
      <div className="mt-2 text-center">
        <h2 className="text-xs mb-2">Disclaimer</h2>
        <p className="text-xs"> This chatbot is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </Page>
  );
};

export default Home;
