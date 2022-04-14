import { useEffect, useState } from 'react';
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
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let time = 0
    const task = setInterval((i) => {
      time += 1;
      setSeconds(time);
    }, 1000);
    return () => clearInterval(task); 
  }, [])

  return (
    <div className={style['daily']}>
      <div className={style.headline}>
        <div className={style['title']}>오늘의 상점</div>
        <div className={style['countdown']}>
          <span>
          <CountDown seconds={props.skinsPanelLayout.SingleItemOffersRemainingDurationInSeconds - seconds} />
          </span>
        </div>
      </div>
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
    <div className={style.headline}>
      <div className={style['title']}>야시장</div>
    </div>
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

function CountDown(props: {
  seconds: number
}) {
  const hour = Math.floor(props.seconds / 60 / 60);
  const minute = Math.floor(props.seconds / 60) - (hour*60);
  const second = Math.floor(props.seconds) - (hour*60*60) - (minute*60);

  const hourStr = hour.toString();
  const minuteStr = hour.toString().padStart(2, '0');
  const secondStr = second.toString().padStart(2, '0');
  
  return (
    <>
    {hourStr}:{minuteStr}:{secondStr}
    </>
  )
}