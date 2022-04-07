
import axios from 'axios';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { authObjAtom } from '../recoil';

import type { CookieType } from '../type';

export default function InitManager(props: {
  cookies: CookieType[];
}) {
  const [authObj, setAuthObj] = useRecoilState(authObjAtom);

  useEffect(function initAuth() {
    const accessTokenCookie: CookieType|undefined = props.cookies && props.cookies.find(cookie => cookie.name === 'access_token');
    const expiryTimestampCookie: CookieType|undefined = props.cookies && props.cookies.find(cookie => cookie.name === 'expiry_timestamp');

    if((accessTokenCookie && accessTokenCookie.value !== authObj.access_token) && (expiryTimestampCookie && Number(expiryTimestampCookie.value) !== authObj.expiry_timestamp)) {
      setAuthObj({
        access_token: accessTokenCookie.value,
        expiry_timestamp: expiryTimestampCookie===undefined ? undefined : Number(expiryTimestampCookie.value)
      })
    }
  }, []);

  return null
}