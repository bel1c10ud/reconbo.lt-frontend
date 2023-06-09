import style from './Hero.module.css';
import { useRecoilValue } from 'recoil';
import { authObjAtom, languageAtom } from '../recoil';
import { i18nMessage } from '../i18n';
import { isValidAuth } from '../utility';
import Link from 'next/link';

export default function Hero() {
  const lang = useRecoilValue(languageAtom);
  const auth = useRecoilValue(authObjAtom);

  return (
    <section className={style['self']}>
      <div className={style['intro']}>
        <h1>
          <span>Reconbo.lt</span>
        </h1>
{ isValidAuth(auth) ? (
        <p>
          <span lang={lang?? 'en-US'}>{i18nMessage['CHECK_TODAYS_STORE_ROTATION'][lang?? 'en-US']}</span>
        </p>
) : (
        <p>
          <span lang={lang?? 'en-US'}>{i18nMessage['CHECK_TODAYS_STORE_ROTATION_AFTER_LOGIN'][lang?? 'en-US']}</span>
        </p>
)}
      </div>
      <div className={style['actions']}>
{ isValidAuth(auth) ? (
        <Link className={style['anchor']} href='/store'>
          <span lang={lang?? 'en-US'}>{i18nMessage['STORE'][lang?? 'en-US']}</span> 
          <span>{'›'}</span>
        </Link>
) : (
        <Link className={style['anchor']} href='/authorization'>
          <span lang={lang?? 'en-US'}>{i18nMessage['LOGIN'][lang?? 'en-US']}</span> 
          <span>{'›'}</span>
        </Link>
)}
      </div>
    </section>
  )
}