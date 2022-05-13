import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import axios, { AxiosError } from 'axios';

import style from './AuthorizationLayout.module.css';

import { authObjAtom, regionAtom, languageAtom } from '../../recoil';

import Input from '../Input';
import Button from '../Button';
import RegionSelect from '../RegionSelect';
import Callout, { CalloutTitle, CalloutBody } from '../Callout';
import { RegionCode } from '../../options';
import { i18nMessage } from '../../i18n';

export default function AuthorizationLayout() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prevSession, setPrevSession] = useState('');
  const [code, setCode] = useState('');

  const [process, setProcess] = useState<'AUTH'|'MULTI'>('AUTH')
  const [isProcess, setIsprocess] = useState(false);

  const [authObj, setAuthObj] = useRecoilState(authObjAtom);
  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom)?? 'en-US';

  async function reqAuth(username: string, password: string, region: RegionCode) {
    setIsprocess(true);
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/auth',
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
        url: '/api/auth',
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
          access_token: res.data.authObj['access_token'],
          expiry_timestamp: res.data.authObj['expiry_timestamp']
        })
        router.push('/');
      }

    } catch(error) {        
      console.log((error as AxiosError).response);
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
        <Input type='text' name='username' placeholder='Username' 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        disabled={isProcess}
        />
        <Input type='password' name='password' placeholder='Password' 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        disabled={isProcess}
        />
        <Button 
        onClick={onClickAuth} 
        disabled={isProcess || username.trim().length === 0 || password.trim().length === 0 || region === undefined}
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
        >
          {i18nMessage['CONFIRM'][language]}
        </Button>
      </form>
    </div>
  )
}