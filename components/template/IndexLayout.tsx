import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import { authObjAtom } from './../../recoil';

import style from './IndexLayout.module.css';

import Intro from '../Intro';
import Button from '../Button';
import Store from '../Store';
import Footer from '../Footer';
import Link from 'next/link';

export default function IndexLayout() {
  const router = useRouter();

  const [authObj, setAuthObj] = useRecoilState(authObjAtom);

  if(authObj.access_token !== undefined && (authObj.expiry_timestamp !== undefined && authObj.expiry_timestamp > Date.now())) {
    return (
      <div className={style.self}>
        <Button onClick={() => router.push('/api/clear')}>로그아웃</Button>
        <Store access_token={authObj.access_token} />
        <Footer />
      </div>
    )
  } else {
    return (
      <div className={style.self}>
        <Intro />
        <Button onClick={() => router.push('/authorization')}>로그인</Button>
        <Footer />
      </div>
    )
  }
}