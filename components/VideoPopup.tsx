import { useRecoilState, useRecoilValue } from 'recoil';
import { isPopupAtom, languageAtom } from '../recoil';
import style from './VideoPopup.module.css';
import { i18nMessage } from './../i18n';

export default function VideoPopup(props : {
  src?: string
}) {
  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);
  const lang = useRecoilValue(languageAtom);

  return (
    <div className={style['self']}>
{ isPopup && <video src={props.src} controls onClick={(e) => e.stopPropagation()} /> }
      <button className={style['button']} onClick={() => setIsPopup(false)}>{i18nMessage['CLOSE'][lang ?? 'en-US']}</button>
    </div>
  )
}