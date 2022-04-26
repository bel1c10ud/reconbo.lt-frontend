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

export default function IndexLayout() {
  const router = useRouter();

  const authObj = useRecoilValue(authObjAtom)
  const region = useRecoilValue(regionAtom);
  const language = useRecoilValue(languageAtom);

  if(authObj.access_token !== undefined && (authObj.expiry_timestamp !== undefined && authObj.expiry_timestamp > Date.now())) {
    return (
      <div className={style.self}>
{ region && language ? 
        <Store access_token={authObj.access_token} region={region} language={language} /> 
        : <div>Please select a region and Language</div>
}        
        <div className={style['options']}>
          <RegionSelect />
          <LanguageSelect />
        </div>
        <Button onClick={() => router.push('/api/clear')}>Logout</Button>
        <Footer />
      </div>
    )
  } else {
    return (
      <div className={style.self}>
        <Intro />
        <div className={style['options']}>
          <RegionSelect />
          <LanguageSelect />
        </div>
        <Button onClick={() => router.push('/authorization')}>Login</Button>
        <Footer />
      </div>
    )
  }
}