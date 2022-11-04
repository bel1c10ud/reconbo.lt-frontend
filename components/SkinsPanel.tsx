import { useState, useEffect } from 'react';
import { ClientAPI } from '../type';
import Skin from './ItemCards/Skin';
import style from './SkinsPanel.module.css';

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

function Countdown(props: { duration: number }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let time = 0
    const task = setInterval((i) => {
      time += 1;
      setSeconds(time);
    }, 1000);
    return () => clearInterval(task); 
  }, []);

  return <CountdownLayout seconds={props.duration - seconds} />
}

function CountdownLayout(props: { seconds: number }) {
  const hour = Math.floor(props.seconds / 60 / 60);
  const minute = Math.floor(props.seconds / 60) - (hour*60);
  const second = Math.floor(props.seconds) - (hour*60*60) - (minute*60);

  const hourStr = hour.toString();
  const minuteStr = hour.toString().padStart(2, '0');
  const secondStr = second.toString().padStart(2, '0');
  
  return <span>{hourStr}:{minuteStr}:{secondStr}</span>
}

