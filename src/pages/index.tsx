import Page from '../layouts/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import style from "../styles/Index.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import Loading from "../components/loading"
import Login from "../components/login"
import MainPage from "../components/home"
import UserDetails from "../components/userDetails"
import { useEffect, useState } from 'react';

const Home = () => {
    //Data is used to see the signed in goolge user.
    //If undefined, it means it's still loading.
    //If null, it means no user is signed in.
    const { data, status } = useSession();
    const [user,setUser] = useState(null)
    const [isVerified,setVerification] = useState(false)

    const checkUser = async () => {
        try {
            const email = data?.user?.email
            if (email != undefined) {
                const response = await fetch(`/api/getuser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                })
                const result = await response.json();
                if(result.user.rowCount > 0){
                    console.log("User found")
                    setUser(result.user.rows[0])
                    return true;
                }
                else{
                    console.log("User not found")
                    addUser();
                    return false;
                    
                }
            }
            else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
    const addUser = async () => {
        try {
            const email = data?.user?.email
            const name = data?.user?.name
            if (email != undefined) {
                const response = await fetch(`/api/adduser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email }),
                })
                const result = await response.json();
                setUser(result.user.rows[0])
                console.log("User Added" , result.user.rows[0])
            }
        } catch (err) {

        }
    }
    useEffect(() => {
        const checkLogin = async () => {
            if (status === 'authenticated') {
                checkUser();
            }
        };

        checkLogin();
    }, [status])

    // useEffect(() => {
    //     console.log(user)
    // }, [user])

    const verifyUser = () => {
        //Need to check if user exists
        if(user!=null ){
            return user['isverified']
        }
    }

    if (status === 'authenticated') {
        if(verifyUser()){
            return <MainPage />
        }
        else if(verifyUser() == undefined){
            return <Loading> </Loading>
        }
        else{
            return <UserDetails />
        }
    }
    else if (status === 'unauthenticated') {
        return <Login />
    }
    else if (status === 'loading') {
        return <Loading> </Loading>
    }
    else {
        return <Loading> </Loading>
    }

};

export default Home;
