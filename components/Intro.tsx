import Link from "next/link";
import { i18nMessage } from "@/i18n";
import type { LanguageCode } from "@/type";
import style from "@/components/Intro.module.css";

export default function Intro(props: { language: LanguageCode }) {
  return (
    <div className={style.self}>
      <div className={style.headline}>Introduce</div>
      <div className={style.description}>
        <p>
          {i18nMessage["INTRODUCTION_RECONBOLT"][props.language]}{" "}
          <Link href="/about">{`${i18nMessage["DETAIL"][props.language].toLowerCase()}`}</Link>
        </p>
      </div>
    </div>
  );
}
