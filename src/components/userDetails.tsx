import Page from '../layouts/page';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import style from "../styles/Details.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import countryCodes from 'country-calling-code';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/loading'

const UserDetails = () => {
  const [redirecting, setRedirecting] = useState(false);

  const [emailRef, setEmail] = useState('');
  const [name, setName] = useState('');
  const [countryC, setCountry] = useState("Afghanistan");
  const [phonePrefix, setPhonePrefix] = useState("+93");
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user?.email) {
      setEmail(data.user.email);
    }
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data]);
  
  const getPhonePrefix = (e: any) => {
    setCountry(e)
    for (let c of countryCodes) {

      if (c.country == e) {

        // console.log(c.country , e,c.countryCodes[0])
        setPhonePrefix("+" + c.countryCodes[0])
        break
      }
    }
  }

  const goToIndex = () => {
    setRedirecting(true)
    setTimeout(()=>{
      window.location.reload()
    },5000)
  }

  const verifyUser = async (e: any) => {
    e.preventDefault();
    const email = emailRef;
    const name = nameRef?.current?.value;
    const phonenumber = "(" + phonePrefix + ") " + phoneRef?.current?.value;
    const country = countryC;
    const city = cityRef?.current?.value;
    const address = addressRef?.current?.value;
    fetch(`/api/verifyuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phonenumber, email, country, city, address }),
    }).then(response => response.json()) // Convert the response data to JSON
      .then(data => {
        console.log(data.message); // Log the response data to the console
        goToIndex()
      })
  }

  return (
    <div className={style.main} >

      {
        redirecting ?
        <Loading>
          <p>Finished setting your account! Telling the doctor that you&apos;re ready.</p> 
          <p>Please Wait...</p>
        </Loading>
        :
        <></>

      }



      <div className={style.details_shape}>
        <p className={style.details_title}>Finish setting up your account</p>
        <form onSubmit={verifyUser} className={style.login_form}>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              Email Address
            </label>
            <input name="E-mail Address" type="email" placeholder="Your email" disabled={true} className={style.login_form_input} value={emailRef} />

          </div>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              Full Name
            </label>
            <input name="Full Name" type="text" placeholder="Your full name" className={style.login_form_input} defaultValue={name} ref={nameRef}/>

          </div>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              Country
            </label>
            {/* <input name="Country" type="text" placeholder='Country' required className={style.login_form_input} ref={countryRef} /> */}
            <div className={style.login_form_address_container}>
              <select
                name="Country"
                className={style.login_form_address}
                value={countryC}
                onChange={(e) => getPhonePrefix(e.target.value)}
              >
                {countryCodes.map((countryCode, index) => (
                  <option key={index} value={countryCode.country}>
                    {countryCode.country}
                  </option>
                ))}
              </select>
            </div>

          </div>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              City
            </label>
            <input name="City" type="text" placeholder='City' required className={style.login_form_input} ref={cityRef} />
          </div>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              Address
            </label>
            <input name="Address" type="text" placeholder='Address' required className={style.login_form_input} ref={addressRef} />
          </div>
          <div className={style.login_form_field}>
            <label className={style.login_form_label}>
              Phone Number
            </label>
            <div className={style.login_form_input_phone}>
              <p>{phonePrefix}</p>
              <input name="phonenumber" type="text" placeholder='Phone Number' required ref={phoneRef} />
            </div>
          </div>
          <button type="submit" className={style.login_form_submit}>Finish</button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
