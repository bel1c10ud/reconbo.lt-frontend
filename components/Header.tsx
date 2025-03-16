import style from './Header.module.css';
import { useAuth } from '../hooks';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isPopupAtom, languageAtom, popupComponentAtom, regionAtom } from '../recoil';
import { useRouter } from 'next/router';
import { i18nMessage } from '../i18n';
import { languageOptions } from '../options';
import { LanguageCode } from '../type';
import MenuPopup from './MenuPopup';

interface HeaderProps {

}

export default function Header(props: HeaderProps) {
  const router = useRouter();

  const auth = useAuth();
  const language = useRecoilValue(languageAtom);
  const region = useRecoilValue(regionAtom);

  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);
  const [popupComponent, setPopupComponent] = useRecoilState(popupComponentAtom);

  function onClickLogin() {
    if(auth.isValid) {
      if(window.confirm(i18nMessage['DO_YOU_WANT_TO_LOGOUT'][language?? 'en-US'])) {
        router.push(`/api/clear`)
      }
    } else {
      router.push(`/authorization`)
    }
  }

  return (
    <div className={style['self']}>
      <div className={style['nav']}>
        <div className={style['left']}>
          <button className={style['hamburger']}
          onClick={() => {setPopupComponent(()=><MenuPopup />);setIsPopup(true);}}
          >
            <img src='/svg/menu.svg' alt='menu' />
          </button>
        </div>
        <div className={style['right']}>
          <button className={style['language']}>
            <LanguageSelector />
          </button>
          <button className={style['login']} onClick={onClickLogin}>
            { auth.isValid ? i18nMessage['LOGOUT'][language?? 'en-US'] : i18nMessage['LOGIN'][language?? 'en-US'] }
          </button>
        </div>
      </div>
    </div>
  )
}

function LanguageSelector() {
  const [language, setLanguage] = useRecoilState(languageAtom);

  function onChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if(languageOptions.find(lang => lang.value === e.target.value)) {
      window.localStorage.setItem('language', e.currentTarget.value as LanguageCode);
      return setLanguage(e.target.value as LanguageCode)
    }
  }

  return (
    <fieldset className={style['language-selector']}>
      <select value={language} onChange={onChangeSelect}>
        <option disabled>Language</option>
{ languageOptions.map(lang => (
        <option key={lang.value} value={lang.value}>{lang.label}</option>
))}      
      </select>
      <div className={style['overlay']}>
        <img className={style['icon']} src='/svg/language.svg' alt='language' />
      </div>
    </fieldset>
  )
}