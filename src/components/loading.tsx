import { ReactNode } from 'react';
import Page from '../layouts/page';
import Link from 'next/link';
import style from "../styles/Index.module.css";
interface PageProps {
  children: ReactNode;
}
const Login = ({ children }: PageProps) => {

  return (
    <div className={style.loading_container}>
      <div className={style.loading_children}>{children}</div>
      <div className={style.loading}>
      </div>
    </div>
  );
};

export default Login;
