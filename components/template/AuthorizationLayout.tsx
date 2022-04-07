import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import axios from 'axios';

import style from './AuthorizationLayout.module.css';

import { accessTokenAtom } from '../../recoil';

import Input from '../Input';
import Button from '../Button';

export default function AuthorizationLayout() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prevSession, setPrevSession] = useState('');
  const [code, setCode] = useState('');

  const [process, setProcess] = useState<'AUTH'|'MULTI'>('AUTH')
  const [isProcess, setIsprocess] = useState(false);

  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  async function reqAuth(username: string, password: string) {
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
          password: password
        }
      });

      if(res.data.type === 'response') {
        if(res.data.riotToken['access_token']) { 
          setAccessToken(res.data.riotToken['access_token']);
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
      alert(error);
    }
    setIsprocess(false);
  }

  async function reqMulti(prevSession: string, code: string) {
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
          code: code
        }
      });

      if(res.data.type === 'response' && res.data.riotToken['access_token']) {
        setAccessToken(res.data.riotToken['access_token']);
        router.push('/');
      }

    } catch(error) {        
      setPrevSession('');
      if(window.confirm("2fa fail, try again?")) {
        setCode('');
        reqAuth(username, password);
      }
    }
  }

  async function onClickAuth() {
    reqAuth(username, password);
  }

  async function onClickMulti() {
    if(prevSession !== undefined) {
      reqMulti(prevSession, code);
    } else {
      alert('invalid previous session!');
    }
  }

  return (
    <div className={style.self}>
      <div className={style.headline}>로그인</div>
      <form className={!(process === 'AUTH') ? style.hidden: undefined} onSubmit={e => e.preventDefault()}>
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
        disabled={isProcess || username.trim().length === 0 || password.trim().length === 0}
        >
          로그인
        </Button>
      </form>
      <form className={!(process === 'MULTI') ? style.hidden: undefined} onSubmit={e => e.preventDefault()} >
        <Input type='text' name='code' placeholder='Multifactor Code' 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        />
        <Button onClick={onClickMulti} 
        disabled={prevSession.trim().length === 0 || code.trim().length === 0 }
        >
          제출
        </Button>
      </form>
    </div>
  )
}