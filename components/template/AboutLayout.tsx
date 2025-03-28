import Head from "next/head";
import { LegalNotice } from "@/components/Callout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hr from "@/components/Hr";
import { useLanguageStore } from "@/store";
import { i18nMessage } from "@/i18n";
import style from "@/components/template/AboutLayout.module.css";

export default function AboutLayout() {
  const lang = useLanguageStore((state) => state.language);

  return (
    <>
      <Head>
        <title>Reconbo.lt | About</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["about"]}>
          <h2>Introduce</h2>
          <LegalNotice />
          <p>{i18nMessage["INTRODUCTION_RECONBOLT"][lang ?? "en-US"]}</p>
          <Hr />
          <h2>Notice</h2>
          <p>{i18nMessage["INTRODUCTION_NOTICE"][lang ?? "en-US"]}</p>
          <h3>{i18nMessage["INTRODUCTION_WHERE_ARE_USED"][lang ?? "en-US"]}</h3>
          <ul>
            <li>{`${i18nMessage["LOGIN"][lang ?? "en-US"]} API`}</li>
            <li>{`${i18nMessage["PLAYER"][lang ?? "en-US"]} UUID API ${i18nMessage["REQUEST"][lang ?? "en-US"]}`}</li>
            <li>{`${i18nMessage["PLAYER"][lang ?? "en-US"]} ${i18nMessage["STORE"][lang ?? "en-US"]} API ${i18nMessage["REQUEST"][lang ?? "en-US"]}`}</li>
          </ul>
          <Hr />
          <h2>Special Thanks</h2>
          <ul>
            <li>HeyM1ke/ValorantClientAPI</li>
            <li>valorant-api.com</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}
