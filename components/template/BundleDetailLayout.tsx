import Head from "next/head";
import { RequiredLoginCallout, IsNotAccurate } from "@/components/Callout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Buddy from "@/components/ItemCards/Buddy";
import ItemCardError from "@/components/ItemCards/ItemCardError";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import PlayerCard from "@/components/ItemCards/PlayerCard";
import PlayerTitle from "@/components/ItemCards/PlayerTitle";
import Skin from "@/components/ItemCards/Skin";
import Spray from "@/components/ItemCards/Spray";
import Price from "@/components/Price";
import type { AuthObjType, ExternalAPI } from "@/type";
import { ClientAPI } from "@/type";
import style from "@/components/template/BundleDetailLayout.module.css";

interface BundleDetailLayoutProps {
  auth: AuthObjType;
  uuid: string;
  clientAPIBundleData?: ClientAPI.Bundle;
  externalAPIBundleData: ExternalAPI.Bundle;
}

export default function BundleDetailLayout(props: BundleDetailLayoutProps) {
  return (
    <>
      <Head>
        <title>{props.externalAPIBundleData.displayName}</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["title"]}>
          <div className={style["display-name"]}>{props.externalAPIBundleData.displayName}</div>
        </div>
        <div className={style["preview"]}>
          <div className={style["preview-image"]}>
            <img
              src={props.externalAPIBundleData.displayIcon}
              alt={props.externalAPIBundleData.description}
            />
          </div>
          <div className={style["preview-description"]}>
            {props.externalAPIBundleData.description}
          </div>
        </div>
        <div className={style["bundle-info"]}>
          <div className={style["bundle-info-title"]}>PRICE</div>
          {props.auth.isValid ? (
            <>
              <IsNotAccurate />
              <div className={style["bundle-price"]}>
                <Price bundleOffers={props.clientAPIBundleData?.Items} />
              </div>
            </>
          ) : (
            <RequiredLoginCallout />
          )}
        </div>
        <div className={style["bundle-info"]}>
          <div className={style["bundle-info-title"]}>COMPONENTS</div>
          {props.auth.isValid ? (
            <BundleComponents data={props.clientAPIBundleData} />
          ) : (
            <RequiredLoginCallout />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

interface BundleComponentsProps {
  data?: ClientAPI.Bundle;
}

function BundleComponents(props: BundleComponentsProps) {
  if (!props.data) {
    return (
      <div className={style["bundle-components"]}>
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>
    );
  } else {
    return (
      <div className={style["bundle-components"]}>
        {props.data.Items.map((item) => {
          let bundleOffer = undefined;

          if (
            item.hasOwnProperty("BasePrice") &&
            item.hasOwnProperty("DiscountPercent") &&
            item.hasOwnProperty("DiscountPercent")
          ) {
            bundleOffer = item;
          }

          switch (item.Item.ItemTypeID) {
            case ClientAPI.ItemTypeID.SkinLevelTypeID:
              return (
                <Skin key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />
              );
            case ClientAPI.ItemTypeID.SprayTypeID:
              return (
                <Spray key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />
              );
            case ClientAPI.ItemTypeID.BuddyTypeID:
              return (
                <Buddy key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />
              );
            case ClientAPI.ItemTypeID.PlayerCardTypeID:
              return (
                <PlayerCard
                  key={item.Item.ItemID}
                  uuid={item.Item.ItemID}
                  bundleOffer={bundleOffer}
                />
              );
            case ClientAPI.ItemTypeID.PlayerTitleTypeID:
              return <PlayerTitle key={item.Item.ItemID} uuid={item.Item.ItemID} />;
            default:
              return (
                <ItemCardError key={item.Item.ItemID} error={new Error("Unknown type item")} />
              );
          }
        })}
      </div>
    );
  }
}
