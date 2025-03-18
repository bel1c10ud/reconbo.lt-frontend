import { useMemo } from "react";
import { Discount } from "@/components/ItemCards/ItemCard";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import Price from "@/components/Price";
import SlideText from "@/components/SlideText";
import { useExternalAPI } from "@/hooks";
import type { ExternalAPI, ClientAPI, AsyncData } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface PlayerCardProps {
  uuid: string;
  bundleOffer?: ClientAPI.Item;
  offer?: ClientAPI.Offer;
}

export default function PlayerCard(props: PlayerCardProps) {
  const externalAPIPlayerCards = useExternalAPI<ExternalAPI.PlayerCard[]>("playerCards");
  const externalAPIPlayerCard = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPIPlayerCards.error) return { ...obj, error: externalAPIPlayerCards.error };
    else if (externalAPIPlayerCards.isLoading) return { ...obj, isLoading: true };
    else if (externalAPIPlayerCards.data) {
      return {
        ...obj,
        data: externalAPIPlayerCards.data.find((card) => card.uuid === props.uuid),
      };
    }
    return { ...obj, error: new Error("Not found player card") };
  }, [props.uuid, externalAPIPlayerCards]);
  const clientAPIOffer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };
    if (props.offer) return { ...obj, data: props.offer };
    else return { ...obj, error: new Error("unknown") };
  }, [props.offer]);

  if (externalAPIPlayerCard.error) return <div>error</div>;
  else if (externalAPIPlayerCard.isLoading || !externalAPIPlayerCard.data)
    return <ItemCardSkeleton />;
  else
    return (
      <PlayerCardLayout
        data={externalAPIPlayerCard.data}
        offer={clientAPIOffer}
        bundleOffer={props.bundleOffer}
      />
    );
}

interface PlayerCardLayoutProps {
  data: ExternalAPI.PlayerCard;
  bundleOffer?: ClientAPI.Item;
  offer?: AsyncData<ClientAPI.Offer>;
}

function PlayerCardLayout(props: PlayerCardLayoutProps) {
  return (
    <div className={style["self"]} data-item-type="player-card">
      <div className={style["ratio"]}>
        <div className={style["content"]}>
          <div className={style["image"]}>
            <img src={props.data.displayIcon} alt="player card image" />
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
