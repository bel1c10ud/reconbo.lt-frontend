import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isPopupAtom, popupComponentAtom, showSpinnerAtom } from "@/recoil";
import style from "@/components/Overlay.module.css";

export default function Overlay() {
  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);
  const popupComponent = useRecoilValue(popupComponentAtom);
  const showSpinner = useRecoilValue(showSpinnerAtom);
  const router = useRouter();

  useEffect(() => {
    if (isPopup) {
      setIsPopup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const show = useMemo(() => {
    if (isPopup || showSpinner) return true;
    else return false;
  }, [isPopup, showSpinner]);

  return (
    <div className={style["self"]} {...{ [show ? "data-layer-show" : "data-layer-hide"]: "" }}>
      {isPopup && (
        <div className={style["layer"]}>
          <Background />
          {popupComponent}
        </div>
      )}
      {showSpinner && (
        <div className={style["layer"]}>
          <Background />
          <Spinner />
        </div>
      )}
    </div>
  );
}

function Background() {
  return <div className={style["background"]}></div>;
}
function Spinner() {
  return <div className={style["spinner"]}></div>;
}

// const convention = [
//   { type: 'MODAL', background: true, component: () => {} },
//   { type: 'SPINNER' }
// ]
