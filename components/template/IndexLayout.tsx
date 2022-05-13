import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';

import { authObjAtom, regionAtom, languageAtom } from './../../recoil';

import style from './IndexLayout.module.css';

import Intro from '../Intro';
import Button from '../Button';
import Store from '../Store';
import Footer from '../Footer';
import RegionSelect from '../RegionSelect';
import LanguageSelect from '../LanguageSelect';
import Callout, { CalloutTitle, CalloutBody } from '../Callout';
import { i18nMessage } from '../../i18n';

export default function IndexLayout() {
  const router = useRouter();

  const authObj = useRecoilValue(authObjAtom);
  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom);

  if(authObj.access_token !== undefined && (authObj.expiry_timestamp !== undefined && authObj.expiry_timestamp > Date.now())) {
    return (
      <div className={style.self}>
{ region && language ? 
        <>
          <Store access_token={authObj.access_token} region={region} language={language} />
          <Callout>
            <CalloutTitle>ℹ️ {i18nMessage['IS_WRONG_STORE_INFORMATION'][language]}</CalloutTitle>
            <CalloutBody>
              {i18nMessage['IF_REGION_INCORRECT'][language]}
            </CalloutBody>
          </Callout>
        </>
        : <Callout>
            <CalloutTitle>ℹ️ Please select region and language</CalloutTitle>
            <CalloutBody>
              If the region setting is incorrect, the in-game store information cannot be fetched.
            </CalloutBody>
          </Callout>
}        
        <div className={style['options']}>
          <RegionSelect />
          <LanguageSelect />
        </div>
        <Button onClick={() => router.push('/api/clear')}>{i18nMessage['LOGOUT'][language?? 'en-US']}</Button>
        <Footer />
      </div>
    )
  } else {
    return (
      <div className={style.self}>
        <Intro language={language?? 'en-US'} />
        <div className={style['options']}>
          <RegionSelect />
          <LanguageSelect />
        </div>
        <Button onClick={() => router.push('/authorization')}>{i18nMessage['LOGIN'][language?? 'en-US']}</Button>
        <Footer />
      </div>
    )
  }
}