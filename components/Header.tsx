import Image from "next/image";
import { useRouter } from "next/router";
import MenuPopup from "@/components/MenuPopup";
import { useAuth } from "@/hooks";
import { useLanguageStore, usePopupStore } from "@/store";
import { languageOptions } from "@/options";
import { i18nMessage } from "@/i18n";
import type { LanguageCode } from "@/type";
import style from "@/components/Header.module.css";

export default function Header() {
  const router = useRouter();

  const auth = useAuth();
  const language = useLanguageStore((state) => state.language);
  const setPopup = usePopupStore((state) => state.setPopup);

  function onClickLogin() {
    if (auth.isValid) {
      if (window.confirm(i18nMessage["DO_YOU_WANT_TO_LOGOUT"][language ?? "en-US"])) {
        router.push(`/api/clear`);
      }
    } else {
      router.push(`/authorization`);
    }
  }

  return (
    <header className={style["self"]}>
      <div className={style["nav"]}>
        <div className={style["left"]}>
          <button
            className={style["hamburger"]}
            onClick={() => {
              setPopup({
                visiable: true,
                component: <MenuPopup />,
              });
            }}
          >
            <Image src="/svg/menu.svg" width={24} height={24} alt="menu" />
          </button>
        </div>
        <div className={style["right"]}>
          <button className={style["language"]}>
            <LanguageSelector />
          </button>
          <button className={style["login"]} onClick={onClickLogin}>
            {auth.isValid
              ? i18nMessage["LOGOUT"][language ?? "en-US"]
              : i18nMessage["LOGIN"][language ?? "en-US"]}
          </button>
        </div>
      </div>
    </header>
  );
}

function LanguageSelector() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  function onChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (languageOptions.find((lang) => lang.value === e.target.value)) {
      window.localStorage.setItem("language", e.currentTarget.value as LanguageCode);
      return setLanguage(e.target.value as LanguageCode);
    }
  }

  return (
    <fieldset className={style["language-selector"]}>
      <select value={language} onChange={onChangeSelect}>
        <option disabled>Language</option>
        {languageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div className={style["overlay"]}>
        <Image
          className={style["icon"]}
          src="/svg/language.svg"
          width={24}
          height={24}
          alt="language"
        />
      </div>
    </fieldset>
  );
}
