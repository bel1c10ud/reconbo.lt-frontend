import style from './ItemCard.module.css';
import { useMemo } from 'react';
import { useExternalAPI } from '../../hooks';
import { Cost, Discount } from './ItemCard';
import ItemCardSkeleton from './ItemCardSkeleton';
import SlideText from '../SlideText';
import { ExternalAPI, ClientAPI } from '../../type';

interface PlayerTitleProps {
  uuid: string,
  bundleOffer?: Pick<ClientAPI.Item, "BasePrice"|"DiscountPercent"|"DiscountedPrice">
}

export default function PlayerTitle(props: PlayerTitleProps) {
  const externalAPIPlayerTitles = useExternalAPI<ExternalAPI.PlayerTitle[]>('playerTitles');
  const externalAPIPlayerTitle = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false }

    if(externalAPIPlayerTitles.error) return { ...obj, error: externalAPIPlayerTitles.error }
    else if(externalAPIPlayerTitles.isLoading) return { ...obj, isLoading: true }
    else if(externalAPIPlayerTitles.data) {
      return {
        ...obj,
        data: externalAPIPlayerTitles.data.find(title => title.uuid === props.uuid)
      }
    }
    return { ...obj, error: new Error('Not found player title') }
  }, [props.uuid, externalAPIPlayerTitles])

  if(externalAPIPlayerTitles.error) return <div>error</div>
  else if(externalAPIPlayerTitles.isLoading || !externalAPIPlayerTitle.data) return <ItemCardSkeleton />
  else return <PlayerTitleLayout data={externalAPIPlayerTitle.data} bundleOffer={props.bundleOffer} />
}

interface PlayerTitleLayoutProps {
  data: ExternalAPI.PlayerTitle,
  bundleOffer?: Pick<ClientAPI.Item, "BasePrice"|"DiscountPercent"|"DiscountedPrice">
}

function PlayerTitleLayout(props: PlayerTitleLayoutProps) {
  const cost = useMemo(() => props.bundleOffer?.BasePrice, [props.bundleOffer?.BasePrice]);
  const discountedPrice = useMemo(() => props.bundleOffer?.DiscountedPrice, [props.bundleOffer?.DiscountedPrice]);
  const discountPercent = useMemo(() => props.bundleOffer?.DiscountPercent && props.bundleOffer?.DiscountPercent * 100, [props.bundleOffer?.DiscountPercent]);

  return (
    <div className={style['self']} data-item-type='player-title'>
    <div className={style['ratio']}>
      <div className={style['content']}>
        <div className={style['image']}>
          <span>{props.data.titleText}</span>
        </div>
        <div className={style.overlay}>
          <div className={style.info}>
            <SlideText>{props.data.displayName}</SlideText>
            <div className={style['value']}>
              <Cost 
              cost={cost} 
              discountedPrice={discountedPrice}
              />
            </div>
          </div>
{ discountPercent !== undefined && <Discount percent={discountPercent} />}
        </div>
      </div>
    </div>
  </div>
  )
}