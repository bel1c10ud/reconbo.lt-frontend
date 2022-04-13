import { BonusStoreOfferType, SkinsPanelLayoutType, StoreDataType } from '../../type';
import Skin from '../Skin';
import style from './StoreLayout.module.css';

export default function StoreLayout(props: {
  storeData: StoreDataType
}) {
  return (
    <div className={style.self}>
      <Daily skinsPanelLayout={props.storeData.SkinsPanelLayout} />
{ props.storeData.BonusStore && props.storeData.BonusStore.BonusStoreOffers?.length !== 0 && (
      <NightMarket bonusOffers={props.storeData.BonusStore.BonusStoreOffers} />
)}
    </div>
  )
}

function Daily(props: {
  skinsPanelLayout: SkinsPanelLayoutType
}) {
  return (
    <div className={style['daily']}>
      <div className={style.headline}>오늘의 상점</div>
      <div className={style.skins}>
{ props.skinsPanelLayout.SingleItemOffers.map( uuid => <Skin key={uuid} uuid={uuid} /> )}
      </div>
    </div>
  )
}

function NightMarket(props: {
  bonusOffers: BonusStoreOfferType[]
}) {
  return (
    <div className={style['night-market']}>
    <div className={style.headline}>야시장</div>
      <div className={style.skins}>
{ props.bonusOffers.map( (bonusOffer) => {
    if(bonusOffer.Offer.Rewards.length === 1 && bonusOffer.Offer.Rewards[0].ItemID) {
      return (
        <Skin key={bonusOffer.Offer.Rewards[0].ItemID} 
        uuid={bonusOffer.Offer.Rewards[0].ItemID} 
        offer={bonusOffer.Offer} 
        discount={ { discountCosts: bonusOffer.DiscountCosts, discountPercent: bonusOffer.DiscountPercent }}
        />
      )
    } else {
      return null
    }
} ) }
      </div>
    </div>
  )
}