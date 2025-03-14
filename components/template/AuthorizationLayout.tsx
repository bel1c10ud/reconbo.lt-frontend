import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import axios, { isAxiosError } from 'axios';

import style from './AuthorizationLayout.module.css';

import { authObjAtom, regionAtom, languageAtom, showSpinnerAtom } from '../../recoil';

import Input from '../Input';
import RegionSelect from '../RegionSelect';
import Callout, { CalloutTitle, CalloutBody } from '../Callout';
import { RegionCode } from '../../type';
import { i18nMessage } from '../../i18n';
import Head from 'next/head';
import TextInput from '../TextInput';
import Header from '../Header';
import Footer from '../Footer';
import Link from 'next/link';

export default function AuthorizationLayout() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prevSession, setPrevSession] = useState('');
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');

  const [process, setProcess] = useState<'AUTH'|'MULTI'|'MANUAL'>('MANUAL');
  const [isProcess, setIsprocess] = useState(false);

  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom)?? 'en-US';

  const setShowSpinner = useSetRecoilState(showSpinnerAtom);
  const setAuthObj = useSetRecoilState(authObjAtom);

  useEffect(() => {
    const regionEl: HTMLSelectElement|null = document.querySelector('select[name="region"]');
    const codeEl: HTMLInputElement|null = document.querySelector('input[name="code"]');

    if(process === 'AUTH') regionEl?.focus();
    else if(process === 'MULTI') codeEl?.focus();
  }, [process])

  useEffect(() => {
    if(isProcess) setShowSpinner(true);
    else setShowSpinner(false);
  }, [isProcess])

  async function reqAuth(username: string, password: string, region: RegionCode) {
    setIsprocess(true);
    try {
      const res = await axios({
        method: 'POST',
        url: `/rewrite/${region}/api/auth`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          type: 'auth',
          username: username,
          password: password,
          regionCode: region
        }
      });

      if(res.data.type === 'response') {
        if(res.data.authObj['access_token']) { 
          setAuthObj({
            isInit: true,
            access_token: res.data.authObj['access_token'],
            expiry_timestamp: res.data.authObj['expiry_timestamp']
          })
          router.push('/');
        } 
        else { 
          alert(i18nMessage['NOT_FOUND_TOKEN'][language]); 
        }
      } else if(res.data.type === 'multifactor') {
        if(typeof res.data.previousSession === 'string') { 
          setPrevSession(res.data.previousSession);
          setProcess('MULTI');
        } 
        else { 
          alert(i18nMessage['NOT_FOUND_PREV_SESSION'][language]); 
        }
      }

    } catch(error) {
      if(isAxiosError(error)) {
        alert(error.response?.data.message);
      } else if(error instanceof Error) {
        alert(`${error.name}\n${error.message}`);
      } else {
        alert(i18nMessage['UNKNOWN_ERROR'][language])
      }
    }
    setIsprocess(false);
  }

  async function reqMulti(prevSession: string, code: string, region: RegionCode) {
    try {
      const res = await axios({
        method: 'POST',
        url: `/rewrite/${region}/api/auth`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          type: 'multifactor',
          previousSession: prevSession,
          code: code,
          regionCode: region
        }
      });

      if(res.data.type === 'response' && res.data.authObj['access_token']) {
        setAuthObj({
          isInit: true,
          access_token: res.data.authObj['access_token'],
          expiry_timestamp: res.data.authObj['expiry_timestamp']
        })
        router.push('/');
      }

    } catch(error) {
      if(isAxiosError(error)) {
        alert(error.response?.data.message);
      } else if(error instanceof Error) {
        alert(`${error.name}\n${error.message}`);
      } else {
        alert(i18nMessage['UNKNOWN_ERROR'][language])
      }
      setPrevSession('');
      if(window.confirm(i18nMessage['2FA_FAILED'][language])) {
        setCode('');
        reqAuth(username, password, region);
      }
    }
  }

  async function reqManualAuth(url: string, region: RegionCode) {
    setIsprocess(true);
    try {
      const res = await axios({
        method: 'POST',
        url: `/api/manual-auth`,
        data: {
          url: url,
          regionCode: region
        }
      });

      if(!res.data.authObj.hasOwnProperty('access_token')) {
        throw new Error(i18nMessage['NOT_FOUND_TOKEN'][language]);
      }

      await axios({
        method: 'GET',
        url: `/rewrite/${region}/auth-riotgames/userinfo`,
        headers: {
          'Authorization': `Bearer ${res.data.authObj.access_token}`
        },
      });

      setAuthObj({
        isInit: true,
        access_token: res.data.authObj['access_token'],
        expiry_timestamp: res.data.authObj['expiry_timestamp']
      })

      router.push('/');
    } catch(error) {
      if(isAxiosError(error) && error.response?.status === 401) {
        alert(i18nMessage['INVALID_TOKEN'][language]);
      } else if(isAxiosError(error)) {
        alert(error.response?.data.message ?? i18nMessage['UNKNOWN_ERROR'][language]);
      } else if(error instanceof Error) {
        alert(`${error.name}\n${error.message}`);
      } else {
        alert(i18nMessage['UNKNOWN_ERROR'][language])
      }
    }
    setIsprocess(false);
  }

  async function onClickAuth() {
    if(isProcess) {
      alert(i18nMessage['REQUEST_IS_BEING_PROCESSED'][language])
    } else if(username.trim().length === 0 || password.trim().length === 0 || region === undefined) {
      alert(i18nMessage['INVALID_INPUT_VALUE'][language]);
    } else {
      reqAuth(username, password, region);
    }
  }

  async function onClickMulti() {
    if(prevSession === undefined || region === undefined) {
      alert('');
    } else {
      reqMulti(prevSession, code, region);
    }
  }

  async function onClickManualAuth() {
    if(isProcess) {
      alert(i18nMessage['REQUEST_IS_BEING_PROCESSED'][language])
    } else if(url.trim().length === 0 || region === undefined) {
      alert(i18nMessage['INVALID_INPUT_VALUE'][language]);
    } else {
      reqManualAuth(url, region);
    }
  }

  return (
  <>
    <Head>
      <title>Reconbo.lt | {i18nMessage['LOGIN'][language]}</title>
    </Head>
    <Header />
    <div className={style.self}>
      <div className={style.headline}>
        {i18nMessage['LOGIN'][language]}
      </div>
      <form className={!(process === 'MANUAL') ? style.hidden: undefined} onSubmit={e => e.preventDefault()}>
        <Callout>
          <CalloutTitle>
            ℹ️ {i18nMessage['FOLLOWING_THE_DESCRIPTION_AND_IMAGE'][language]}
          </CalloutTitle>
          <CalloutBody>
            <p className={style.description}>{i18nMessage['PASTE_THE_REDIRECTED_ADDRESS_INTO_THE_URL_FIELD'][language]}</p>
            <Link className={style['login-link']} href={'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid'} target='_blank'>
              🔗 {i18nMessage['LOGIN_LINK'][language]}
            </Link>
            <video className={style['login-video']} src="/manual-auth.mp4" controls autoPlay muted loop/>
          </CalloutBody>
        </Callout>
        <RegionSelect disabled={isProcess} />
        <TextInput type='text' name='url' placeholder='URL' 
        value={url} 
        onChange={e => setUrl(e.target.value)} 
        disabled={isProcess}
        />
        <button className={style['submit-button']}
        onClick={onClickManualAuth} 
        disabled={isProcess || url.trim().length === 0 || region === undefined}
        >
          {i18nMessage['LOGIN'][language]}
        </button>
      </form>
      <form className={!(process === 'AUTH') ? style.hidden: undefined} onSubmit={e => e.preventDefault()}>
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['PLEASE_SELECT_REGION'][language]}</CalloutTitle>
          <CalloutBody>
            {i18nMessage['IF_REGION_INCORRECT'][language]}
          </CalloutBody>
        </Callout>
        <RegionSelect disabled={isProcess} />
        <TextInput type='text' name='username' placeholder='Username' 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        disabled={isProcess}
        />
        <TextInput type='password' name='Password' placeholder='Password' 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        disabled={isProcess}
        />
        <button className={style['submit-button']}
        onClick={onClickAuth} 
        disabled={isProcess || username.trim().length === 0 || password.trim().length === 0 || region === undefined}
        >
          {i18nMessage['LOGIN'][language]}
        </button>
      </form>
      <form className={!(process === 'MULTI') ? style.hidden: undefined} onSubmit={e => e.preventDefault()} >
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['PLEASE_ENTER_VERIFICATION_CODE'][language]}</CalloutTitle>
        </Callout>
        <Input type='text' name='code' placeholder='Multifactor Code' 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        />
        <button className={style['submit-button']} onClick={onClickMulti} 
        disabled={prevSession.trim().length === 0 || code.trim().length === 0 }
        >
          {i18nMessage['CONFIRM'][language]}
        </button>
      </form>
    </div>
    <Footer />
  </>
  )
}