import { useMemo } from "react";
import { Discount } from "@/components/ItemCards/ItemCard";
import ItemCardError from "@/components/ItemCards/ItemCardError";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import Price from "@/components/Price";
import SlideText from "@/components/SlideText";
import { useExternalAPI } from "@/hooks";
import type { AsyncData, ClientAPI, ExternalAPI } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface SprayProps {
  uuid: string;
  bundleOffer?: ClientAPI.Item;
  offer?: ClientAPI.Offer;
}

export default function Spray(props: SprayProps) {
  const externalAPISprays = useExternalAPI<ExternalAPI.Spray[]>("sprays");
  const externalAPISpray = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPISprays.error) return { ...obj, error: externalAPISprays.error };
    else if (externalAPISprays.isLoading) return { ...obj, isLoading: true };
    else if (externalAPISprays.data)
      return { ...obj, data: externalAPISprays.data.find((spray) => spray.uuid === props.uuid) };
    return { ...obj, error: new Error("Not found spray") };
  }, [props.uuid, externalAPISprays]);
  const clientAPIOffer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };
    if (props.offer) return { ...obj, data: props.offer };
    else return { ...obj, error: new Error("unknown") };
  }, [props.offer]);

  if (externalAPISpray.error) return <ItemCardError error={externalAPISpray.error} />;
  else if (externalAPISpray.isLoading || !externalAPISpray.data) return <ItemCardSkeleton />;
  else
    return (
      <SprayLayout
        data={externalAPISpray.data}
        offer={clientAPIOffer}
        bundleOffer={props.bundleOffer}
      />
    );
}

interface SprayLayoutProps {
  data: ExternalAPI.Spray;
  bundleOffer?: ClientAPI.Item;
  offer?: AsyncData<ClientAPI.Offer>;
}

function SprayLayout(props: SprayLayoutProps) {
  const imageURI = useMemo(
    () => props.data.animationGif ?? props.data.fullTransparentIcon ?? props.data.fullIcon,
    [props.data],
  );

  return (
    <div className={style["self"]} data-item-type="spray">
      <div className={style["ratio"]}>
        <div className={style["content"]}>
          <div className={style["image"]}>
            <img src={imageURI} alt="spray image" />
          </div>
          <div className={style["overlay}"]}>
            <div className={style["info"]}>
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
