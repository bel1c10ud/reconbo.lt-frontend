import { useMemo } from "react";
import { Discount } from "@/components/ItemCards/ItemCard";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import Price from "@/components/Price";
import SlideText from "@/components/SlideText";
import { useExternalAPI } from "@/hooks";
import type { ExternalAPI, ClientAPI, AsyncData } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface PlayerTitleProps {
  uuid: string;
  bundleOffer?: ClientAPI.Item;
  offer?: ClientAPI.Offer;
}

export default function PlayerTitle(props: PlayerTitleProps) {
  const externalAPIPlayerTitles = useExternalAPI<ExternalAPI.PlayerTitle[]>("playerTitles");
  const externalAPIPlayerTitle = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPIPlayerTitles.error) return { ...obj, error: externalAPIPlayerTitles.error };
    else if (externalAPIPlayerTitles.isLoading) return { ...obj, isLoading: true };
    else if (externalAPIPlayerTitles.data) {
      return {
        ...obj,
        data: externalAPIPlayerTitles.data.find((title) => title.uuid === props.uuid),
      };
    }
    return { ...obj, error: new Error("Not found player title") };
  }, [props.uuid, externalAPIPlayerTitles]);
  const clientAPIOffer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };
    if (props.offer) return { ...obj, data: props.offer };
    else return { ...obj, error: new Error("unknown") };
  }, [props.offer]);

  if (externalAPIPlayerTitles.error) return <div>error</div>;
  else if (externalAPIPlayerTitles.isLoading || !externalAPIPlayerTitle.data)
    return <ItemCardSkeleton />;
  else
    return (
      <PlayerTitleLayout
        data={externalAPIPlayerTitle.data}
        offer={clientAPIOffer}
        bundleOffer={props.bundleOffer}
      />
    );
}

interface PlayerTitleLayoutProps {
  data: ExternalAPI.PlayerTitle;
  bundleOffer?: ClientAPI.Item;
  offer?: AsyncData<ClientAPI.Offer>;
}

function PlayerTitleLayout(props: PlayerTitleLayoutProps) {
  return (
    <div className={style["self"]} data-item-type="player-title">
      <div className={style["ratio"]}>
        <div className={style["content"]}>
          <div className={style["image"]}>
            <span>{props.data.titleText}</span>
          </div>
          <div className={style.overlay}>
            <div className={style.info}>
              <SlideText>{props.data.displayName}</SlideText>
              <div className={style["value"]}>
                <Price offer={props.offer} bundleOffer={props.bundleOffer} />
              </div>
            </div>
            <Discount bundleOffer={props.bundleOffer} />
          </div>
        </div>
      </div>
    </div>
  );
}
