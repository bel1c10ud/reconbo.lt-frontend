import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import axios, { AxiosError } from 'axios';

import style from './AuthorizationLayout.module.css';

import { authObjAtom, regionAtom, languageAtom, showSpinnerAtom } from '../../recoil';

import Input from '../Input';
import Button from '../Button';
import RegionSelect from '../RegionSelect';
import Callout, { CalloutTitle, CalloutBody } from '../Callout';
import { RegionCode } from '../../type';
import { i18nMessage } from '../../i18n';
import Head from 'next/head';
import LanguageSelect from '../LanguageSelect';
import TextInput from '../TextInput';
import Header from '../Header';
import Footer from '../Footer';

export default function AuthorizationLayout() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prevSession, setPrevSession] = useState('');
  const [code, setCode] = useState('');

  const [process, setProcess] = useState<'AUTH'|'MULTI'>('AUTH');
  const [isProcess, setIsprocess] = useState(false);

  const [showSpinner, setShowSpinner] = useRecoilState(showSpinnerAtom);

  const [authObj, setAuthObj] = useRecoilState(authObjAtom);
  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom)?? 'en-US';

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
          alert('not found token!'); 
        }
      } else if(res.data.type === 'multifactor') {
        if(typeof res.data.previousSession === 'string') { 
          setPrevSession(res.data.previousSession);
          setProcess('MULTI');
        } 
        else { 
          alert('not found previous session!'); 
        }
      }

    } catch(error) {
      alert((error as AxiosError).response?.data.message);
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
      alert((error as AxiosError).response?.data.message);
      setPrevSession('');
      if(window.confirm("2fa fail, try again?")) {
        setCode('');
        reqAuth(username, password, region);
      }
    }
  }

  async function onClickAuth() {
    if(isProcess) {
      alert('The request is being processed.')
    } else if(username.trim().length === 0 || password.trim().length === 0 || region === undefined) {
      alert('The input value is incorrect.');
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
        <Button 
        onClick={onClickAuth} 
        disabled={isProcess || username.trim().length === 0 || password.trim().length === 0 || region === undefined}
        primary large
        >
           {i18nMessage['LOGIN'][language]}
        </Button>
      </form>
      <form className={!(process === 'MULTI') ? style.hidden: undefined} onSubmit={e => e.preventDefault()} >
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['PLEASE_ENTER_VERIFICATION_CODE'][language]}</CalloutTitle>
        </Callout>
        <Input type='text' name='code' placeholder='Multifactor Code' 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        />
        <Button onClick={onClickMulti} 
        disabled={prevSession.trim().length === 0 || code.trim().length === 0 }
        primary large
        >
          {i18nMessage['CONFIRM'][language]}
        </Button>
      </form>
    </div>
    <Footer />
  </>
  )
}