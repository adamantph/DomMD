import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Page from '../layouts/page';
import style from "../styles/User.module.css"
import 'tailwindcss/tailwind.css';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const UserInfo = () => {
    interface UserFormat {
        address: string;
        name: string;
        phone: string;
        email: string;
        dateadded: string;
        city: string;
        chathistory: string;
        country: string;
        isVerified: boolean;
    };
    const defaultUser = {
        address: "",
        name: "",
        phone: "",
        email: "",
        dateadded: "",
        city: "",
        chathistory: "",
        country: "",
        isVerified: false,
    }
    const [user, setUser] = useState<UserFormat>(defaultUser);
    const [userName, setUserName] = useState('');

    const { data, status } = useSession();
    useEffect(() => {
        if (status !== 'authenticated') {
            router.push('/')
        }
    })

    //Set conversationID and user's Email
    useEffect(() => {
        const getUser = async () => {
            if (data?.user?.email) {

                const response = await fetch(`/api/getuser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.user.email }),
                })
                const result = await response.json();
                // console.log(result.user.rows[0].chathistory)
                setUser(result.user.rows[0])
            }
        }
        getUser();

    }, [data])

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <Page>
            <div className={style.user_container}>
                <div className={style.user_wrapper}>

                    <p className={style.user_title}>User Info</p>
                    <div className={style.user_hr}> </div>

                    <p className={style.user_label}>Full Name</p>
                    <input type="text" className={style.user_data} value={user.name} disabled/>

                    <p className={style.user_label}>E-mail Address</p>
                    <input type="text" className={style.user_data} value={user.email} disabled/>

                    <p className={style.user_label}>Phone Number</p>
                    <input type="text" className={style.user_data} value={user.phone} disabled/>

                    <p className={style.user_label}>Address</p>
                    <input type="text" className={style.user_data} value={user.address} disabled/>
                    
                    <p className={style.user_label}>City</p>
                    <input type="text" className={style.user_data} value={user.city} disabled/>

                    <p className={style.user_label}>Country</p>
                    <input type="text" className={style.user_data} value={user.country} disabled/>

                    <p className={style.user_label}>Date Registered</p>
                    <p className={style.user_data}>{user.dateadded} </p>
                </div>
            </div>
        </Page>
    );
};

export default UserInfo;
