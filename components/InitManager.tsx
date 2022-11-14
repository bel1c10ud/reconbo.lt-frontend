import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import type { RegionCode } from '../type';
import { RegionOption, regionOptions, languageOptions } from '../options';

import { authObjAtom, languageAtom, regionAtom } from '../recoil';

import type { CookieType, LanguageCode } from '../type';
import { useAuth } from '../hooks';

export default function InitManager(props: {
  cookies: CookieType[];
}) {
  const [authObj, setAuthObj] = useRecoilState(authObjAtom);
  const [region, setRegion] = useRecoilState(regionAtom);
  const [language, setLanguage] = useRecoilState(languageAtom);

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
        isInit: true,
        access_token: accessTokenCookie.value,
        expiry_timestamp: Number(expiryTimestampCookie.value)
      })
    } else {
      setAuthObj({ ...authObj, isInit: true });
    }

    if(
      (regionCodeCookie && regionOptions.find((option: RegionOption) => option.value === regionCodeCookie.value))
      && (expiryTimestampCookie && Number(expiryTimestampCookie.value) > Date.now())
    ) {
      setRegion(regionCodeCookie.value as RegionCode)
    }
  }, []);

  useEffect(function initLang() {
    const langs = languageOptions.map(lang => lang.value);
    const localLang: string|undefined|null = window.localStorage.getItem('language');
    const clientLang = navigator.language;

    if((localLang !== undefined && localLang !== null) && langs.find(lang => lang === localLang)) {
      setLanguage(localLang as LanguageCode);
    } else {
      if(navigator) {
        if(clientLang) {
          if(langs.find(lang => lang === clientLang)) {
            setLanguage(clientLang as LanguageCode)
          } else {
            setLanguage('en-US');
          }
        } else {
          setLanguage('en-US');
        }
      } else {
        setLanguage('en-US');
      }
    }
  }, [])

  return null
}