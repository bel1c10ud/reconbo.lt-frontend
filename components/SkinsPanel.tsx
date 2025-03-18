import Countdown from "@/components/Countdown";
import Skin from "@/components/ItemCards/Skin";
import type { ClientAPI } from "@/type";
import style from "@/components/SkinsPanel.module.css";

interface SkinsPanelProps {
  data: ClientAPI.SkinsPanelLayout;
}

export default function SkinsPanel(props: SkinsPanelProps) {
  return (
    <div className={style["self"]}>
      <div className={style["headline"]}>
        <div className={style["title"]}>DAILY</div>
        <div className={style["countdown"]}>
          <Countdown duration={props.data.SingleItemOffersRemainingDurationInSeconds} />
        </div>
      </div>
      <div className={style["skins"]}>
        {props.data.SingleItemOffers.map((uuid) => (
          <Skin key={uuid} uuid={uuid} />
        ))}
      </div>
    </div>
  );
}
