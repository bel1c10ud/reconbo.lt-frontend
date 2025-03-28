import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { usePopupStore, useShowSpinnerStore } from "@/store";
import style from "@/components/Overlay.module.css";

export default function Overlay() {
  const router = useRouter();
  const popup = usePopupStore((state) => state.popup);
  const setPopup = usePopupStore((state) => state.setPopup);
  const showSpinner = useShowSpinnerStore((state) => state.showSpinner);

  useEffect(() => {
    if (popup.visiable) {
      setPopup({ ...popup, visiable: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const show = useMemo(() => {
    if (popup.visiable || showSpinner) return true;
    else return false;
  }, [popup, showSpinner]);

  return (
    <div className={style["self"]} {...{ [show ? "data-layer-show" : "data-layer-hide"]: "" }}>
      {popup.visiable && (
        <div className={style["layer"]}>
          <Background />
          {popup.component}
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
