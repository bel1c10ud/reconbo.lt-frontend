import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { authObjAtom, regionAtom, languageAtom } from './../../recoil';

import style from './IndexLayout.module.css';

import Intro from '../Intro';
import Button from '../Button';
import Store from '../Store';
import Footer from '../Footer';
import RegionSelect from '../RegionSelect';
import LanguageSelect from '../LanguageSelect';
import { i18nMessage } from '../../i18n';

import Head from 'next/head';

export default function IndexLayout() {
  const router = useRouter();

  const authObj = useRecoilValue(authObjAtom);
  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom);

  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <div className={style['self']}>
{ (authObj.access_token !== undefined && (authObj.expiry_timestamp !== undefined && authObj.expiry_timestamp > Date.now()))  ? 
        <Store access_token={authObj.access_token} region={region} language={language ?? 'en-US'} />
        : <Intro language={language?? 'en-US'} />
}
        <div className={style['options']}>
          <RegionSelect />
          <LanguageSelect />
        </div>
{ (authObj.access_token !== undefined && (authObj.expiry_timestamp !== undefined && authObj.expiry_timestamp > Date.now())) ? 
        <Button onClick={() => router.push('/api/clear')}>{i18nMessage['LOGOUT'][language?? 'en-US']}</Button> 
        : <Button onClick={() => router.push('/authorization')}>{i18nMessage['LOGIN'][language?? 'en-US']}</Button>
}
        <Footer />
      </div>
    </>
  )
}
