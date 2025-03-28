import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLanguageStore, usePopupStore } from "@/store";
import { i18nMessage } from "@/i18n";
import style from "@/components/MenuPopup.module.css";

export default function MenuPopup() {
  const router = useRouter();
  const lang = useLanguageStore((state) => state.language);
  const closePopup = usePopupStore((state) => state.closePopup);

  return (
    <div className={style["self"]}>
      <div className={style["wrap"]}>
        <div className={style["header"]}>
          <button className={style["close-button"]} onClick={closePopup}>
            <Image src="/svg/x.svg" width={24} height={24} alt="close button icon" />
          </button>
        </div>
        <div className={style["anchors"]}>
          <ul className={style["pages"]}>
            <li>
              <span
                className={style["page"]}
                onClick={() => {
                  router.push("/");
                  closePopup();
                }}
              >
                <Image
                  className={style["icon"]}
                  src="/svg/home.svg"
                  width={28}
                  height={28}
                  alt={i18nMessage["MAIN"][lang ?? "en-US"]}
                />
                <span lang={lang}>{i18nMessage["MAIN"][lang ?? "en-US"]}</span>
              </span>
            </li>
            <li>
              <span
                className={style["page"]}
                onClick={() => {
                  router.push("/store");
                  closePopup();
                }}
              >
                <Image
                  className={style["icon"]}
                  src="/svg/shopping-cart.svg"
                  width={28}
                  height={28}
                  alt={i18nMessage["STORE"][lang ?? "en-US"]}
                />
                <span lang={lang}>{i18nMessage["STORE"][lang ?? "en-US"]}</span>
              </span>
            </li>
            <li>
              <span
                className={style["page"]}
                onClick={() => {
                  router.push("/items");
                  closePopup();
                }}
              >
                <Image
                  className={style["icon"]}
                  src="/svg/list-details.svg"
                  width={28}
                  height={28}
                  alt={i18nMessage["LIST_OF_ITEMS"][lang ?? "en-US"]}
                />
                <span lang={lang}>{i18nMessage["LIST_OF_ITEMS"][lang ?? "en-US"]}</span>
              </span>
            </li>
          </ul>
          <ul className={style["refs"]}>
            <li>
              <span className={style["ref"]}>
                <Image
                  className={style["icon"]}
                  src="/svg/book.svg"
                  width={20}
                  height={20}
                  alt="about this project"
                />
                <Link href="/about">About</Link>
              </span>
            </li>
            <li>
              <span className={style["ref"]}>
                <Image
                  className={style["icon"]}
                  src="/svg/brand-github.svg"
                  width={20}
                  height={20}
                  alt="github"
                />
                <a
                  href="https://github.com/bel1c10ud/reconbo.lt-frontend"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
