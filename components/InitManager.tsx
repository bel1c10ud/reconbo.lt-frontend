import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { RegionCode, RegionOption, regionOptions } from '../options';

import { authObjAtom, regionAtom } from '../recoil';

import type { CookieType } from '../type';

export default function InitManager(props: {
  cookies: CookieType[];
}) {
  const [authObj, setAuthObj] = useRecoilState(authObjAtom);
  const [region, setRegion] = useRecoilState(regionAtom);

  useEffect(function initAuth() {
    const accessTokenCookie: CookieType|undefined = props.cookies && props.cookies.find(cookie => cookie.name === 'access_token');
    const expiryTimestampCookie: CookieType|undefined = props.cookies && props.cookies.find(cookie => cookie.name === 'expiry_timestamp');
    const regionCodeCookie: CookieType|undefined = props.cookies && props.cookies.find(cookie => cookie.name === 'region_code');

    if(
      (accessTokenCookie && accessTokenCookie.value !== authObj.access_token) 
      && (expiryTimestampCookie && Number(expiryTimestampCookie.value) !== authObj.expiry_timestamp)
      && (expiryTimestampCookie && Number(expiryTimestampCookie.value) > Date.now())
    ) {
      setAuthObj({
        access_token: accessTokenCookie.value,
        expiry_timestamp: Number(expiryTimestampCookie.value)
      })
    }

    if(
      (regionCodeCookie && regionOptions.find((option: RegionOption) => option.value === regionCodeCookie.value))
      && (expiryTimestampCookie && Number(expiryTimestampCookie.value) > Date.now())
    ) {
      setRegion(regionCodeCookie.value as RegionCode)
    }
  }, []);

  return null
}