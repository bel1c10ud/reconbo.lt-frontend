
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { accessTokenAtom } from '../recoil';

import type { CookieType } from '../type';

export default function InitManager(props: {
  cookies: CookieType[];
}) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  useEffect(function initAuth() {
    const accessTokenCookie = props.cookies.find(cookie => cookie.name === 'access_token');
    if(accessTokenCookie && accessTokenCookie.value !== accessToken) {
      console.log('set at');
      setAccessToken(accessTokenCookie.value)
    }
  }, []);

  return null
}