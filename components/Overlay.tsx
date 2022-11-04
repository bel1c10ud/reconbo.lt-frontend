import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isPopupAtom, popupComponentAtom, showSpinnerAtom } from '../recoil';
import style from './Overlay.module.css';

export default function Overlay() {
  const isPopup = useRecoilValue(isPopupAtom);
  const popupComponent = useRecoilValue(popupComponentAtom);
  const showSpinner = useRecoilValue(showSpinnerAtom);

  const show = useMemo(() => {
    if((isPopup || showSpinner)) return true;
    else return false;
  }, [isPopup, showSpinner]);

  return (
    <div className={style['self']}
    {...{[show ? 'data-layer-show':'data-layer-hide']: ''}}
    >
{ isPopup && (
      <div className={style['layer']}>
        <Background />
        {popupComponent}
      </div>
)}
{ showSpinner && (
      <div className={style['layer']}>
        <Background />
        <Spinner />
      </div>
)}
    </div>
  )
}

function Background() { return <div className={style['background']}></div>}
function Spinner() { return <div className={style['spinner']}></div> }

// const convention = [
//   { type: 'MODAL', background: true, component: () => {} },
//   { type: 'SPINNER' }
// ]