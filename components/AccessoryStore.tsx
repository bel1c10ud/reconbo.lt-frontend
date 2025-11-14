import Countdown from "@/components/Countdown";
import Buddy from "@/components/ItemCards/Buddy";
import Flex from "@/components/ItemCards/Flex";
import ItemCardError from "@/components/ItemCards/ItemCardError";
import PlayerCard from "@/components/ItemCards/PlayerCard";
import PlayerTitle from "@/components/ItemCards/PlayerTitle";
import Spray from "@/components/ItemCards/Spray";
import { ClientAPI } from "@/type";
import style from "@/components/AccessoryStore.module.css";

export default function AccessoryStore(props: { data: ClientAPI.AccessoryStore }) {
  return (
    <div className={style["self"]}>
      <div className={style["headline"]}>
        <div className={style["title"]}>ACCESSORY</div>
        <div className={style["countdown"]}>
          <Countdown duration={props.data.AccessoryStoreRemainingDurationInSeconds} />
        </div>
      </div>
      <div className={style["items"]}>
        {props.data.AccessoryStoreOffers.map((acc) => {
          switch (acc.Offer.Rewards[0].ItemTypeID) {
            case ClientAPI.ItemTypeID.SprayTypeID:
              return (
                <Spray
                  key={acc.Offer.Rewards[0].ItemID}
                  uuid={acc.Offer.Rewards[0].ItemID}
                  offer={acc.Offer}
                />
              );
            case ClientAPI.ItemTypeID.BuddyTypeID:
              return (
                <Buddy
                  key={acc.Offer.Rewards[0].ItemID}
                  uuid={acc.Offer.Rewards[0].ItemID}
                  offer={acc.Offer}
                />
              );
            case ClientAPI.ItemTypeID.PlayerCardTypeID:
              return (
                <PlayerCard
                  key={acc.Offer.Rewards[0].ItemID}
                  uuid={acc.Offer.Rewards[0].ItemID}
                  offer={acc.Offer}
                />
              );
            case ClientAPI.ItemTypeID.PlayerTitleTypeID:
              return (
                <PlayerTitle
                  key={acc.Offer.Rewards[0].ItemID}
                  uuid={acc.Offer.Rewards[0].ItemID}
                  offer={acc.Offer}
                />
              );
            case ClientAPI.ItemTypeID.FlexTypeID:
              return (
                <Flex
                  key={acc.Offer.Rewards[0].ItemID}
                  uuid={acc.Offer.Rewards[0].ItemID}
                  offer={acc.Offer}
                />
              );
            default:
              return (
                <ItemCardError
                  key={acc.Offer.Rewards[0].ItemID}
                  error={new Error("Unknown type item")}
                />
              );
          }
        })}
      </div>
    </div>
  );
}
