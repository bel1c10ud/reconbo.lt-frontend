import { useAuth } from "@/hooks";
import { useLanguageStore } from "@/store";
import { i18nMessage } from "@/i18n";
import type { AsyncData } from "@/type";
import { ClientAPI } from "@/type";

interface PriceProps {
  data?: { value: number };
  offer?: AsyncData<ClientAPI.Offer>;
  bonusStoreOffer?: ClientAPI.BonusStoreOffer;
  bundleOffer?: ClientAPI.Item;
  bundleOffers?: ClientAPI.Item[];
}

export default function Price(props: PriceProps) {
  const auth = useAuth();
  const lang = useLanguageStore((state) => state.language);

  if (props.data)
    return (
      <>
        <span>{props.data.value}</span>
        <span>VP</span>
      </>
    );
  else if (props.bonusStoreOffer) {
    const baseCosts = Object.entries(props.bonusStoreOffer.Offer.Cost);
    const baseCostCurrencyTypeID = baseCosts[0][0] as ClientAPI.CurrencyType;
    const baseCost = props.bonusStoreOffer.Offer.Cost[baseCostCurrencyTypeID];
    const baseCostCurrencyLabel =
      Object.entries(ClientAPI.CurrencyType)
        .find((el) => el[1] === baseCostCurrencyTypeID)
        ?.shift() ?? "unknown";

    const discountedCost = props.bonusStoreOffer.DiscountCosts[baseCostCurrencyTypeID];

    if (baseCostCurrencyTypeID && baseCost && discountedCost) {
      return (
        <>
          <del>{baseCost}</del>
          <span>{discountedCost}</span>
          <span>{baseCostCurrencyLabel}</span>
        </>
      );
    } else {
      return <span>unknown</span>;
    }
  } else if (props.bundleOffers) {
    let vp = 0;
    props.bundleOffers.forEach((offer) => {
      if (offer.CurrencyID === ClientAPI.CurrencyType.VP) vp = vp + offer.DiscountedPrice;
    });
    return (
      <>
        <span>{vp}</span>
        <span>VP</span>
      </>
    );
  } else if (props.bundleOffer) {
    if (props.bundleOffer.DiscountPercent) {
      return (
        <>
          <del>{props.bundleOffer.BasePrice}</del>
          <span>{props.bundleOffer.DiscountedPrice}</span>
          <span>VP</span>
        </>
      );
    } else
      return (
        <>
          <span>{props.bundleOffer.BasePrice}</span>
          <span>VP</span>
        </>
      );
  } else if (props.offer) {
    if (auth.isInit && !auth.isValid)
      return <span>{i18nMessage["LOGIN_IS_REQUIRED"][lang ?? "en-US"]}</span>;
    else if (props.offer.error)
      return (
        <span>
          error{props.offer.error instanceof Error ? `: ${props.offer.error.message}` : null}
        </span>
      );
    else if (props.offer.isLoading) return <span>...</span>;
    else if (props.offer.data) {
      const costs = Object.entries(props.offer?.data?.Cost);
      const CurrencyTypeID = costs[0][0];
      const CurrencyCost = costs[0][1];
      const findCurrencyType = Object.entries(ClientAPI.CurrencyType).find(
        (el) => el[1] === CurrencyTypeID,
      );
      const CurrencyLabel = findCurrencyType ? findCurrencyType[0] : undefined;

      if (costs.length === 1) {
        return (
          <>
            <span>{CurrencyCost}</span>
            <span>{CurrencyLabel ?? "unknown"}</span>
          </>
        );
      } else {
        return <span>unknown</span>;
      }
    } else return <span>unknown</span>;
  } else return <span>unknown</span>;
}
