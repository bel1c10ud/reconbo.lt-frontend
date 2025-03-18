import { useMemo } from "react";
import { Discount } from "@/components/ItemCards/ItemCard";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import Price from "@/components/Price";
import SlideText from "@/components/SlideText";
import { useExternalAPI } from "@/hooks";
import type { ExternalAPI, ClientAPI, AsyncData } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface BuddyProps {
  uuid: string;
  bundleOffer?: ClientAPI.Item;
  offer?: ClientAPI.Offer;
}

export default function Buddy(props: BuddyProps) {
  const externalAPIBuddies = useExternalAPI<ExternalAPI.Buddy[]>("buddies");
  const externalAPIBuddy = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPIBuddies.error) return { ...obj, error: externalAPIBuddies.error };
    else if (externalAPIBuddies.isLoading) return { ...obj, isLoading: true };
    else if (externalAPIBuddies.data) {
      return {
        ...obj,
        data: externalAPIBuddies.data.find((buddy) => {
          if (buddy.uuid === props.uuid) return true;
          return buddy.levels.find((level) => level.uuid === props.uuid);
        }),
      };
    }
    return { ...obj, error: new Error("Not found buddy") };
  }, [props.uuid, externalAPIBuddies]);
  const clientAPIOffer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };
    if (props.offer) return { ...obj, data: props.offer };
    else return { ...obj, error: new Error("unknown") };
  }, [props.offer]);

  if (externalAPIBuddy.error) return <div>error</div>;
  else if (externalAPIBuddy.isLoading || !externalAPIBuddy.data) return <ItemCardSkeleton />;
  else
    return (
      <BuddyLayout
        data={externalAPIBuddy.data}
        offer={clientAPIOffer}
        bundleOffer={props.bundleOffer}
      />
    );
}

interface BuddyLayoutProps {
  data: ExternalAPI.Buddy;
  bundleOffer?: ClientAPI.Item;
  offer?: AsyncData<ClientAPI.Offer>;
}

function BuddyLayout(props: BuddyLayoutProps) {
  return (
    <div className={style["self"]} data-item-type="buddy">
      <div className={style["ratio"]}>
        <div className={style["content"]}>
          <div className={style["image"]}>
            <img src={props.data.displayIcon} alt="buddy image" />
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
