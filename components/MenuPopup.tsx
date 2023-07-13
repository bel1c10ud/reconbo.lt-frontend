import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isPopupAtom, languageAtom } from '../recoil';
import style from './MenuPopup.module.css';
import { i18nMessage } from '../i18n';
import Link from 'next/link';

export default function MenuPopup() {
  const router = useRouter();
  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);
  const lang = useRecoilValue(languageAtom);

  return (
    <div className={style['self']}>
      <div className={style['wrap']}>
        <div className={style['header']}>
          <button className={style['close-button']} onClick={() => setIsPopup(false)}>
            <img src='/svg/x.svg' alt='close' />
          </button>
        </div>
        <div className={style['anchors']}>
          <ul className={style['pages']}>
            <li>
              <span className={style['page']} onClick={() => {router.push('/');setIsPopup(false)}}>
                <img className={style['icon']} src='/svg/home.svg' alt={i18nMessage['MAIN'][lang?? 'en-US']} />
                <span lang={lang}>{i18nMessage['MAIN'][lang?? 'en-US']}</span>
              </span>
            </li>
            <li>
              <span className={style['page']} onClick={() => {router.push('/store');setIsPopup(false)}}>
                <img className={style['icon']} src='/svg/shopping-cart.svg' alt={i18nMessage['STORE'][lang?? 'en-US']} />
                <span lang={lang}>{i18nMessage['STORE'][lang?? 'en-US']}</span>
              </span>
            </li>
            <li>
              <span className={style['page']} onClick={() => {router.push('/items');setIsPopup(false)}}>
                <img className={style['icon']} src='/svg/list-details.svg' alt={i18nMessage['LIST_OF_ITEMS'][lang?? 'en-US']} />
                <span lang={lang}>{i18nMessage['LIST_OF_ITEMS'][lang?? 'en-US']}</span>
              </span>
            </li>
          </ul>
          <ul className={style['refs']}>
            <li>
              <span className={style['ref']}>
                <img className={style['icon']} src='/svg/book.svg' alt='about this project' />
                <Link href='/about'>About</Link>
              </span>
            </li>
            <li>
              <span className={style['ref']}>
                <img className={style['icon']} src='/svg/brand-github.svg' alt='github' />
                <a href='https://github.com/bel1c10ud/reconbo.lt-frontend' target='_blank' rel='noreferrer'>Github</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}