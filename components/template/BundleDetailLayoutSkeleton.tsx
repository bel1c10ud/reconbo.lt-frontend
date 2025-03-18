import Head from "next/head";
import { CalloutSkeleton } from "@/components/Callout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import style from "@/components/template/BundleDetailLayoutSkeleton.module.css";

export default function BundleDetailLayoutSkeleton() {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Bundle Detail</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["title"]}></div>
        <div className={style["preview"]}>
          <div className={style["preview-image"]}></div>
          <div className={style["preview-description"]}></div>
        </div>
        <div className={style["bundle-info"]}>
          <div className={style["bundle-info-label"]}>PRICE</div>
          <CalloutSkeleton />
          <div className={style["bundle-info-item"]}>
            <div className={style["price"]}>
              <div className={style["price-value"]}></div>
            </div>
          </div>
        </div>
        <div className={style["bundle-info"]}>
          <div className={style["bundle-info-label"]}>COMPONENTS</div>
          <div className={style["bundle-info-item"]}>
            <div className={style["components"]}>
              <div className={style["component"]}></div>
              <div className={style["component"]}></div>
              <div className={style["component"]}></div>
              <div className={style["component"]}></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
