import { ClientAPI } from '../type';
import Skin from './ItemCards/Skin';
import style from './SkinsPanel.module.css';
import Countdown from './Countdown';

interface SkinsPanelProps {
  data: ClientAPI.SkinsPanelLayout
}

export default function SkinsPanel(props: SkinsPanelProps) {
  return (
    <div className={style['self']}>
      <div className={style['headline']}>
        <div className={style['title']}>DAILY</div>
        <div className={style['countdown']}>
          <Countdown duration={props.data.SingleItemOffersRemainingDurationInSeconds} />
        </div>
      </div>
      <div className={style['skins']}>
{ props.data.SingleItemOffers.map(uuid => (
        <Skin key={uuid} uuid={uuid} />
))}
      </div>
    </div>
  )
}

