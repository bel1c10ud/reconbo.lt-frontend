import Head from "next/head";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import style from "@/components/template/SkinDetailLayoutSkeleton.module.css";

export default function SkinDetailLayoutSkeleton() {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Skin Detail</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["title"]}>
          <div className={style["content-tier"]}></div>
          <div className={style["display-name"]}></div>
        </div>
        <div className={style["preview"]}></div>
        <div className={style["option"]}>
          <div className={style["option-label"]}>PRICE</div>
          <div className={style["option-item"]}>
            <div className={style["price"]}>
              <div className={style["price-value"]}></div>
            </div>
          </div>
        </div>
        <div className={style["option"]}>
          <div className={style["option-label"]}>CHROMA</div>
          <div className={style["option-item"]}>
            <div className={style["chroma"]}></div>
          </div>
        </div>
        <div className={style["option"]}>
          <div className={style["option-label"]}>LEVEL</div>
          <div className={style["option-item"]}>
            <div className={style["level"]}>
              <div className={style["level-title"]}></div>
              <div className={style["level-type"]}></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
