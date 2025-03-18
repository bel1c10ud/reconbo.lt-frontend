import Head from "next/head";
import Header from "@/components/Header";
import Hr from "@/components/Hr";
import style from "@/components/template/StoreLayoutSkeleton.module.css";

export default function StoreLayoutSkeleton() {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Store</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <>
          <div className={style["headline"]}>
            <div className={style["market-title"]}></div>
          </div>
          <div className={style["bundle"]}>
            <div className={style["bundle-image"]}></div>
            <div className={style["bundle-slider"]}></div>
          </div>
        </>
        <Hr />
        <>
          <div className={style["headline"]}>
            <div className={style["market-title"]}></div>
            <div className={style["countdown"]}></div>
          </div>
          <div className={style["items"]}>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
          </div>
        </>
        <Hr />
        <>
          <div className={style["headline"]}>
            <div className={style["market-title"]}></div>
            <div className={style["countdown"]}></div>
          </div>
          <div className={style["items"]}>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
            <div className={style["item"]}>
              <div className={style["ratio"]}>
                <div className={style["info"]}></div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}
