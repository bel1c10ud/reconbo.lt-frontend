import { ClientAPI } from '../type';
import style from './AccessoryStore.module.css';
import Countdown from './Countdown';
import Buddy from './ItemCards/Buddy';
import ItemCardError from './ItemCards/ItemCardError';
import PlayerCard from './ItemCards/PlayerCard';
import PlayerTitle from './ItemCards/PlayerTitle';
import Spray from './ItemCards/Spray';

export default function AccessoryStore(props: {
  data: ClientAPI.AccessoryStore
}) {
  return (
    <div className={style['self']}>
      <div className={style['headline']}>
        <div className={style['title']}>ACCESSORY</div>
        <div className={style['countdown']}>
          <Countdown duration={props.data.AccessoryStoreRemainingDurationInSeconds} />
        </div>
      </div>
      <div className={style['items']}>
{ props.data.AccessoryStoreOffers.map((acc) => {
        switch(acc.Offer.Rewards[0].ItemTypeID) {
          case ClientAPI.ItemTypeID.SprayTypeID:
            return <Spray key={acc.Offer.Rewards[0].ItemID} uuid={acc.Offer.Rewards[0].ItemID} offer={acc.Offer}/>;
          case ClientAPI.ItemTypeID.BuddyTypeID:
            return <Buddy key={acc.Offer.Rewards[0].ItemID} uuid={acc.Offer.Rewards[0].ItemID} offer={acc.Offer} />;
          case ClientAPI.ItemTypeID.PlayerCardTypeID:
            return <PlayerCard key={acc.Offer.Rewards[0].ItemID} uuid={acc.Offer.Rewards[0].ItemID} offer={acc.Offer} />;
          case ClientAPI.ItemTypeID.PlayerTitleTypeID:
            return <PlayerTitle key={acc.Offer.Rewards[0].ItemID} uuid={acc.Offer.Rewards[0].ItemID} offer={acc.Offer} />
          default:
            return <ItemCardError key={acc.Offer.Rewards[0].ItemID} error={new Error('Unknown type item')} />
        }
})}
      </div>
    </div>
  )
}