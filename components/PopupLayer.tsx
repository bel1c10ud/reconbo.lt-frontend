import style from './PopupLayer.module.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isPopupAtom, popupComponentAtom } from './../recoil'; 

export default function PopupLayer() {
  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);
  const [PopupComponent, setPopupComponent] = useRecoilState(popupComponentAtom);

  function onClickLayer() {
    setPopupComponent(undefined);
    setIsPopup(false);
  }
  

  return (
    <div className={style['self']} {...{[isPopup ? 'data-layer-show':'data-layer-hide']: ''}} onClick={onClickLayer}>
      <div className={style['overlay']}></div>
      <div className={style['component']}>
        { PopupComponent }
      </div>
    </div>
  )
}