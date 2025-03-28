import { useLanguageStore, usePopupStore } from "@/store";
import { i18nMessage } from "@/i18n";
import style from "@/components/VideoPopup.module.css";

export default function VideoPopup(props: { src?: string }) {
  const closePopup = usePopupStore((state) => state.closePopup);
  const lang = useLanguageStore((state) => state.language);

  return (
    <div className={style["self"]}>
      <video src={props.src} controls onClick={(e) => e.stopPropagation()} />
      <button className={style["button"]} onClick={() => closePopup()}>
        {i18nMessage["CLOSE"][lang ?? "en-US"]}
      </button>
    </div>
  );
}
