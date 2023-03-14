import style from './Footer.module.css';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../recoil';
import { i18nMessage } from '../i18n';

export default function Footer() {
  const lang = useRecoilValue(languageAtom);

  return (
    <div className={style['self']}>
      <div className={style['logo']}>
        <img src='/svg/wifi_tethering.svg' alt='logo' /> 
      </div>
      <div className={style['items']}>
        <div className={style['item']}>
          <Link href="/about">About</Link>
        </div>
        <div className={style['item']}>
          <a href="https://github.com/bel1c10ud/valorant-store" target='_blank' rel='noreferrer'>
            Github
          </a>
        </div>        
        <div className={style['item']}>
          <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbel1c10ud%2Fvalorant-store"  target='_blank' rel='noreferrer'>
            Deploy on Vercel
          </a>
        </div>
      </div>
      <div className={style['legal-notice']}>
        {i18nMessage['LEGAL_NOTICE'][lang ?? 'en-US']}
      </div>
    </div>
  )
}