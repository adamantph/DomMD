import Page from '../layouts/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import style from "../styles/Index.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import Loading from "../components/loading"
import Login from "../pages/login"
import MainPage from "../components/home"

const Home = () => {
  //Data is used to see the signed in goolge user.
  //If undefined, it means it's still loading.
  //If null, it means no user is signed in.
  const { data, status } = useSession();
  console.log(status)
  console.log(data)
  if (status === 'authenticated') {
    return <MainPage />
  }
  else if (status === 'unauthenticated') {
    return <Login />
  }
  else if (status === 'loading') {
    return <Loading />
  }
  else {
    return <Loading />
  }

};

export default Home;
