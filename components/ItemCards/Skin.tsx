import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Discount } from "@/components/ItemCards/ItemCard";
import ItemCardError from "@/components/ItemCards/ItemCardError";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import Price from "@/components/Price";
import SlideText from "@/components/SlideText";
import { useClientAPI, useExternalAPI } from "@/hooks";
import type { ExternalAPI, ClientAPI, AsyncData } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface SkinProps {
  uuid: string;
  bonusStoreOffer?: ClientAPI.BonusStoreOffer;
  bundleOffer?: ClientAPI.Item;
}

export default function Skin(props: SkinProps) {
  const clientAPIStore = useClientAPI<ClientAPI.Store>("store");

  const clientAPISkinOfferData = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (clientAPIStore.error) return { ...obj, error: clientAPIStore.error };
    else if (clientAPIStore.isLoading) return { ...obj, isLoading: true };
    if (clientAPIStore.data && clientAPIStore.data?.SkinsPanelLayout.SingleItemStoreOffers) {
      const data = clientAPIStore.data.SkinsPanelLayout.SingleItemStoreOffers.find(
        (offer) =>
          offer.OfferID === props.uuid ||
          (offer.Rewards.length === 1 &&
            offer.Rewards.find((reward) => reward.ItemID === props.uuid)),
      );

      return data ? { ...obj, data: data } : { ...obj, error: new Error("Not found offers") };
    }
  }, [props.uuid, clientAPIStore]);

  const externalAPISkins = useExternalAPI<ExternalAPI.Skin[]>("skins");
  const externalAPIcontentTiers = useExternalAPI<ExternalAPI.ContentTier[]>("contentTiers");
  const externalAPISkin = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPISkins.error) return { ...obj, error: externalAPISkins.error };
    else if (externalAPISkins.isLoading) return { ...obj, isLoading: true };
    else if (externalAPISkins.data) {
      let levelIndex = undefined;
      let chromaIndex = undefined;

      const externalAPISkin = externalAPISkins.data.find((skin) => {
        if (skin.uuid === props.uuid) {
          return true;
        } else {
          levelIndex =
            skin.levels.findIndex((level) => level.uuid == props.uuid) === -1
              ? undefined
              : skin.levels.findIndex((level) => level.uuid == props.uuid);
          chromaIndex =
            skin.chromas.findIndex((chroma) => chroma.uuid == props.uuid) === -1
              ? undefined
              : skin.chromas.findIndex((chroma) => chroma.uuid == props.uuid);

          if (levelIndex !== undefined && chromaIndex === undefined) {
            return true;
          } else if (levelIndex === undefined && chromaIndex !== undefined) {
            return true;
          } else {
            return false;
          }
        }
      });

      const data = {
        externalAPISkin: externalAPISkin,
        chromaIndex: chromaIndex,
        levelIndex: levelIndex,
      };

      return { ...obj, data: data };
    } else {
      return { ...obj, error: new Error("Not found skin") };
    }
  }, [props.uuid, externalAPISkins]);
  const externalAPIContentTier = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPIcontentTiers.error) return { ...obj, error: externalAPIcontentTiers.error };
    else if (externalAPIcontentTiers.isLoading) return { ...obj, isLoading: true };
    else if (externalAPIcontentTiers.data) {
      if (externalAPISkin.data) {
        return {
          ...obj,
          data: externalAPIcontentTiers.data.find(
            (tier) => tier.uuid === externalAPISkin.data.externalAPISkin?.contentTierUuid,
          ),
        };
      } else {
        return { ...obj, isLoading: true };
      }
    } else {
      return { ...obj, error: new Error("Not found content tier") };
    }
  }, [externalAPIcontentTiers, externalAPISkin]);

  if (externalAPISkin.error) return <ItemCardError error={externalAPISkin.error} />;
  else if (externalAPISkin.isLoading || !externalAPISkin.data) return <ItemCardSkeleton />;
  else
    return (
      <SkinLayout
        data={{
          ...externalAPISkin.data,
          contentTier: externalAPIContentTier.data,
          offer: clientAPISkinOfferData,
          bonusStoreOffer: props.bonusStoreOffer,
          bundleOffer: props.bundleOffer,
        }}
      />
    );
}

interface SkinDataType {
  externalAPISkin?: ExternalAPI.Skin;
  levelIndex?: number;
  chromaIndex?: number;
  contentTier?: ExternalAPI.ContentTier;
  offer?: AsyncData<ClientAPI.Offer>;
  bonusStoreOffer?: ClientAPI.BonusStoreOffer;
  bundleOffer?: ClientAPI.Item;
}

interface SkinLayoutProps {
  data: SkinDataType;
}

function SkinLayout(props: SkinLayoutProps) {
  const router = useRouter();

  const name = props.data.externalAPISkin?.levels[props.data.levelIndex ?? 0].displayName;
  const imageSrc = props.data.externalAPISkin?.levels[props.data.levelIndex ?? 0].displayIcon;

  const detailURI = useMemo(
    function onClickSkin() {
      if (props.data?.externalAPISkin) {
        const queryObj: { [key: string]: number | string | boolean | undefined } = {
          level: props.data.levelIndex,
          chroma: props.data.chromaIndex,
        };

        const queryArray = Object.entries(queryObj).reduce<string[]>((prev, query) => {
          const [key, value] = query;

          if (value === undefined || value === false || value == 0) return prev;
          else if (value === true) return prev.concat(key);
          else return prev.concat(`${key}=${value}`);
        }, []);

        if (queryArray.length > 0) {
          return `/skin/${props.data.externalAPISkin.uuid}?${queryArray.join("&")}`;
        } else {
          return `/skin/${props.data.externalAPISkin.uuid}`;
        }
      }
    },
    [props.data],
  );

  const category = useMemo(() => {
    if (props.data.externalAPISkin) {
      return props.data.externalAPISkin.assetPath.split("/")[3];
    }
  }, [props.data.externalAPISkin]);

  function onClickSkin() {
    if (props.data?.externalAPISkin) {
      const queryObj: { [key: string]: number | string | boolean | undefined } = {
        level: props.data.levelIndex,
        chroma: props.data.chromaIndex,
      };

      const queryArray = Object.entries(queryObj).reduce<string[]>((prev, query) => {
        const [key, value] = query;

        if (value === undefined || value === false || value == 0) return prev;
        else if (value === true) return prev.concat(key);
        else return prev.concat(`${key}=${value}`);
      }, []);

      if (queryArray.length > 0) {
        return router.push(`/skin/${props.data.externalAPISkin.uuid}?${queryArray.join("&")}`);
      } else {
        return router.push(`/skin/${props.data.externalAPISkin.uuid}`);
      }
    }
  }

  return (
    <div
      className={style.self}
      data-item-type="skin"
      data-tier={props.data.contentTier?.devName}
      data-category={category}
      onClick={onClickSkin}
    >
      <Link href={detailURI ?? "/"}>
        <div className={style.ratio}>
          <div className={style.content}>
            <div className={style.image}>
              <img src={imageSrc} alt={`${name} skin image`} />
            </div>
            <div className={style.overlay}>
              <div className={style.info}>
                {props.data.offer?.data || props.data.bonusStoreOffer || props.data.bundleOffer ? (
                  <>
                    <div className={style["title"]}>
                      <SlideText>{name}</SlideText>
                    </div>
                    <div className={style["value"]}>
                      <div className={style["content-tier"]}>
                        <Image
                          width={28}
                          height={28}
                          alt={`${props.data.contentTier?.devName ?? "unknown"} tier`}
                          src={props.data.contentTier?.displayIcon ?? "/svg/question-mark.svg"}
                        />
                      </div>
                      <div className={style["price"]}>
                        <Price
                          offer={props.data.offer}
                          bonusStoreOffer={props.data.bonusStoreOffer}
                          bundleOffer={props.data.bundleOffer}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={style["title"]}>
                    <div className={style["content-tier"]}>
                      <Image
                        width={28}
                        height={28}
                        alt={`${props.data.contentTier?.devName ?? "unknown"} tier`}
                        src={props.data.contentTier?.displayIcon ?? "/svg/question-mark.svg"}
                      />
                    </div>
                    <SlideText>{name}</SlideText>
                  </div>
                )}
              </div>
              <Discount
                bundleOffer={props.data.bundleOffer}
                bonusStoreOffer={props.data.bonusStoreOffer}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
