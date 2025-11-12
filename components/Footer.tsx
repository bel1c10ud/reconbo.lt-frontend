import Image from "next/image";
import Link from "next/link";
import { useLanguageStore } from "@/store";
import { i18nMessage } from "@/i18n";
import style from "@/components/Footer.module.css";

export default function Footer() {
  const lang = useLanguageStore((state) => state.language);

  return (
    <footer className={style["self"]}>
      <div className={style["logo"]}>
        <Image src="/svg/wifi_tethering.svg" width={64} height={64} alt="logo" />
      </div>
      <div className={style["items"]}>
        <div className={style["item"]}>
          <Link href="/about">About</Link>
        </div>
        <div className={style["item"]}>
          <a
            href="https://github.com/bel1c10ud/reconbo.lt-frontend"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
        <div className={style["item"]}>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbel1c10ud%2Fvalorant-store"
            target="_blank"
            rel="noreferrer"
          >
            Deploy on Vercel
          </a>
        </div>
      </div>
      <div className={style["legal-notice"]}>{i18nMessage["LEGAL_NOTICE"][lang ?? "en-US"]}</div>
    </footer>
  );
}
