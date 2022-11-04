import style from './IndexLayout.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../hooks';
import Intro from '../Intro';
import LanguageSelect from '../LanguageSelect';
import Footer from '../Footer';
import Head from 'next/head';
import { languageAtom } from './../../recoil';
import LoginButton from '../LoginButton';

export default function IndexLayout() {
  const router = useRouter();
  const auth = useAuth();
  const lang = useRecoilValue(languageAtom);

  useEffect(() => {
    if(auth.isValid) {
      router.push('/store');
    }
  }, [auth.isValid])

  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <div className={style['self']}>
        <Intro language={lang?? 'en-US'} />
        <div className={style['options']}>
          <LanguageSelect />
        </div>
        <LoginButton />
        <Footer />
      </div>
    </>
  )
}
