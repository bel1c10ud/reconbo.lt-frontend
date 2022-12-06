import { useRecoilValue } from "recoil";

import { languageAtom } from "../recoil";
import { i18nMessage } from "../i18n";
import { AsyncData, ClientAPI } from "../type";
import { useAuth } from "../hooks";

interface PriceProps {
  offer?: AsyncData<ClientAPI.Offer>
  bonusStoreOffer?: ClientAPI.BonusStoreOffer
  bundleOffer?: ClientAPI.Item
  bundleOffers?: ClientAPI.Item[]
  data?: { value: number }
}

export default function Price(props: PriceProps) {
  const auth = useAuth();
  const lang = useRecoilValue(languageAtom);

  if(props.data) return <><span>{props.data.value}</span><span>VP</span></>
  else if(props.bundleOffers) {
    let vp = 0;
    props.bundleOffers.forEach(offer => {
      if(offer.CurrencyID === ClientAPI.CurrencyType.VP) vp = vp + offer.DiscountedPrice
    })
    return <><span>{vp}</span><span>VP</span></>
  }
  else if(props.bundleOffer) {
    if(props.bundleOffer.DiscountPercent) {
      return (
        <>
          <del>{props.bundleOffer.BasePrice}</del>
          <span>{props.bundleOffer.DiscountedPrice}</span>
          <span>VP</span>
        </>
      )
    }
    else return <><span>{props.bundleOffer.BasePrice}</span><span>VP</span></>
  }
  else if(props.offer) {
    if(auth.isInit && !auth.isValid) return <span>{i18nMessage['LOGIN_IS_REQUIRED'][lang?? 'en-US']}</span>
    else if(props.offer.error) return <span>error{props.offer.error instanceof Error ? `: ${props.offer.error.message}` : null}</span>
    else if(props.offer.isLoading) return <span>...</span>
    else if(props.offer.data) {
      if(props.offer.data.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']) {
        if(props.bonusStoreOffer?.DiscountCosts && props.bonusStoreOffer.DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']) {
          return (
            <>
              <del>{props.offer.data.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}</del>
              <span>{props.offer.data.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'] - props.bonusStoreOffer.DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}</span>
              <span>VP</span>
            </>
          )
        } else return <><span>{props.offer.data.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}</span><span>VP</span></>
      } else return <span>unknown</span>
    }
    else return <span>unknown</span>
  }
  else return <span>unknown</span>
}