import { useMemo } from "react";
import type { ClientAPI } from "@/type";
import style from "@/components/ItemCards/ItemCard.module.css";

interface DiscountProps {
  bonusStoreOffer?: Partial<ClientAPI.BonusStoreOffer>;
  bundleOffer?: ClientAPI.Item;
}

export function Discount(props: DiscountProps) {
  const percent = useMemo(() => {
    if (props.bundleOffer) return props.bundleOffer.DiscountPercent * 100;
    else if (props.bonusStoreOffer) return props.bonusStoreOffer.DiscountPercent;
    else return undefined;
  }, [props.bonusStoreOffer, props.bundleOffer]);

  if (percent) {
    return (
      <div className={style["discount"]}>
        <div className={style["discount-percent"]}>-{percent}%</div>
      </div>
    );
  } else {
    return null;
  }
}
