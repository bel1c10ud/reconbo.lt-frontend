import Head from "next/head";
import AccessoryStore from "@/components/AccessoryStore";
import { IsWrongStoreInfomation } from "@/components/Callout";
import FeaturedBundle from "@/components/FeaturedBundle";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hr from "@/components/Hr";
import NightMarket from "@/components/NightMarket";
import SkinsPanel from "@/components/SkinsPanel";
import type { ClientAPI } from "@/type";
import style from "@/components/template/StoreLayout.module.css";

interface StoreLayoutProps {
  data: ClientAPI.Store;
}

export default function StoreLayout(props: StoreLayoutProps) {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Store</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <FeaturedBundle data={props.data.FeaturedBundle} />
        {props.data.BonusStore && props.data.BonusStore.BonusStoreOffers?.length !== 0 && (
          <>
            <Hr />
            <NightMarket data={props.data.BonusStore.BonusStoreOffers} />
          </>
        )}
        <Hr />
        <SkinsPanel data={props.data.SkinsPanelLayout} />
        <Hr />
        <AccessoryStore data={props.data.AccessoryStore} />
        <IsWrongStoreInfomation />
      </div>
      <Footer />
    </>
  );
}
