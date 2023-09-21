import Page from '../layouts/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import style from "../styles/Index.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';

const Login = () => {
  //Data is used to see the signed in goolge user.
  //If undefined, it means it's still loading.
  //If null, it means no user is signed in.
	const { data, status } = useSession();
  if (status === 'authenticated') {
		console.log(data)
		
	}else{
    console.log(data)
  }

  return (
    <div className={style.main} >
        <p className={style.welcome1}>Welcome to</p>
        <p className={style.welcome2}>AskDom</p>
        <p className={style.welcome3}>AI Medical Assistant</p>
        <button onClick={() => signIn('google')} className={style.signin}>
            Sign-in with Google
        </button>
        <p className={style.welcome4}>to ask the doctor!</p>
        
    </div>
  );
};

export default Login;
