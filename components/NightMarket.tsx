// import style from './NightMarket.module.css';
import style from './SkinsPanel.module.css';
import { ClientAPI } from '../type';
import Skin from './ItemCards/Skin';

export default function NightMarket(props: {
  data: ClientAPI.BonusStoreOffer[]
}) {
  return (
    <div className={style['self']}>
      <div className={style['headline']}>
        <div className={style['title']}>NIGHT MARKET</div>
      </div>
      <div className={style.skins}>
{ props.data.map( (bonusOffer) => {
    if(bonusOffer.Offer.Rewards.length === 1 && bonusOffer.Offer.Rewards[0].ItemID) {
      return (
        <Skin key={bonusOffer.Offer.Rewards[0].ItemID} 
        uuid={bonusOffer.Offer.Rewards[0].ItemID} 
        bonusStoreOffer={bonusOffer}
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