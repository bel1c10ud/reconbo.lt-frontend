import style from './ItemCard.module.css';
import { useMemo } from 'react';
import { useExternalAPI } from '../../hooks';
import { Discount } from './ItemCard';
import Price from '../Price';
import ItemCardSkeleton from './ItemCardSkeleton';
import SlideText from '../SlideText';
import { ExternalAPI, ClientAPI } from '../../type';

interface PlayerCardProps {
  uuid: string,
  bundleOffer?: ClientAPI.Item
}

export default function PlayerCard(props: PlayerCardProps) {
  const externalAPIPlayerCards = useExternalAPI<ExternalAPI.PlayerCard[]>('playerCards');
  const externalAPIPlayerCard = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false }

    if(externalAPIPlayerCards.error) return { ...obj, error: externalAPIPlayerCards.error }
    else if(externalAPIPlayerCards.isLoading) return { ...obj, isLoading: true }
    else if(externalAPIPlayerCards.data) {
      return {
        ...obj,
        data: externalAPIPlayerCards.data.find(card => card.uuid === props.uuid)
      }
    }
    return { ...obj, error: new Error('Not found player card') }
  }, [props.uuid, externalAPIPlayerCards])

  if(externalAPIPlayerCard.error) return <div>error</div>
  else if(externalAPIPlayerCard.isLoading || !externalAPIPlayerCard.data) return <ItemCardSkeleton />
  else return <PlayerCardLayout data={externalAPIPlayerCard.data} bundleOffer={props.bundleOffer} />
}

interface PlayerCardLayoutProps {
  data: ExternalAPI.PlayerCard,
  bundleOffer?: ClientAPI.Item
}

function PlayerCardLayout(props: PlayerCardLayoutProps) {
  return (
    <div className={style['self']} data-item-type='player-card'>
    <div className={style['ratio']}>
      <div className={style['content']}>
        <div className={style['image']}>
          <img alt={``} src={props.data.displayIcon} />
        </div>
        <div className={style.overlay}>
          <div className={style.info}>
            <SlideText>{props.data.displayName}</SlideText>
            <div className={style['value']}>
              <Price bundleOffer={props.bundleOffer} />
            </div>
          </div>
          <Discount bundleOffer={props.bundleOffer} />
        </div>
      </div>
    </div>
  </div>
  )
}