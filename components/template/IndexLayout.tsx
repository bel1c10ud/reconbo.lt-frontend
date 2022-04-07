import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import { accessTokenAtom } from './../../recoil';

import style from './IndexLayout.module.css';

import Intro from '../Intro';
import Button from '../Button';
import Store from '../Store';

export default function IndexLayout() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
 
  return (
    <div className={style.self}>
      <Intro />
{ accessToken === undefined || accessToken.length === 0 ? 
      <Button onClick={() => router.push('/authorization')}>로그인</Button> 
      : <Button onClick={() => router.push('/api/clear')}>로그아웃</Button>
}
{ accessToken !== undefined && accessToken.length > 0 && (
      <Store access_token={accessToken} />
)}
    </div>
  )
}