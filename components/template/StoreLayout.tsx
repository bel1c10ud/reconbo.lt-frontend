import { StoreDataType } from '../../type';
import Skin from '../Skin';
import style from './StoreLayout.module.css';

export default function StoreLayout(props: {
  storeData: StoreDataType
}) {
  return (
    <div className={style.self}>
      <div className={style['daily-skin']}>
        <div className={style.headline}>오늘의 상점</div>
        <div className={style.skins}>
{ props.storeData.SkinsPanelLayout.SingleItemOffers.map( uuid => <Skin key={uuid} uuid={uuid} /> )}
        </div>
      </div>
      <div className={style['night-market']}>
        <div className={style.headline}>야시장</div>
        <div className={style.skins}>
{ props.storeData.BonusStore?.BonusStoreOffers.map(bonusOffer => {
  if(bonusOffer.Offer.Rewards.length === 1 && bonusOffer.Offer.Rewards[0].ItemID) {
    return <Skin key={bonusOffer.Offer.Rewards[0].ItemID} uuid={bonusOffer.Offer.Rewards[0].ItemID} />
  } else {
    return null
  }
})}
        </div>

      </div>
    </div>
  )
}