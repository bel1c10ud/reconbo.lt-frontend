import style from './ItemCard.module.css';
import { useMemo } from 'react';
import { useExternalAPI } from '../../hooks';
import { Cost, Discount } from './ItemCard';
import ItemCardSkeleton from './ItemCardSkeleton';
import SlideText from '../SlideText';
import { ExternalAPI, ClientAPI } from '../../type';

interface BuddyProps {
  uuid: string,
  bundleOffer?: Pick<ClientAPI.Item, "BasePrice"|"DiscountPercent"|"DiscountedPrice">
}

export default function Buddy(props: BuddyProps) {
  const externalAPIBuddies = useExternalAPI<ExternalAPI.Buddy[]>('buddies');
  const externalAPIBuddy = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPIBuddies.error) return { ...obj, error: externalAPIBuddies.error }
    else if(externalAPIBuddies.isLoading) return { ...obj, isLoading: true }
    else if(externalAPIBuddies.data) {
      return {
        ...obj,
        data: externalAPIBuddies.data.find(buddy => {
          if(buddy.uuid === props.uuid) return true
          return buddy.levels.find(level => level.uuid === props.uuid)
        })
      }
    }
    return { ...obj, error: new Error('Not found buddy')}
  }, [props.uuid, externalAPIBuddies])

  if(externalAPIBuddy.error) return <div>error</div>
  else if(externalAPIBuddy.isLoading || !externalAPIBuddy.data) return <ItemCardSkeleton />
  else return <BuddyLayout data={externalAPIBuddy.data} bundleOffer={props.bundleOffer} />
}

interface BuddyLayoutProps {
  data: ExternalAPI.Buddy,
  bundleOffer?: Pick<ClientAPI.Item, "BasePrice"|"DiscountPercent"|"DiscountedPrice">
}

function BuddyLayout(props: BuddyLayoutProps) {
  const cost = useMemo(() => props.bundleOffer?.BasePrice, [props.bundleOffer?.BasePrice]);
  const discountedPrice = useMemo(() => props.bundleOffer?.DiscountedPrice, [props.bundleOffer?.DiscountedPrice]);
  const discountPercent = useMemo(() => props.bundleOffer?.DiscountPercent && props.bundleOffer?.DiscountPercent * 100, [props.bundleOffer?.DiscountPercent]);

  return (
    <div className={style['self']} data-item-type='buddy'>
      <div className={style['ratio']}>
        <div className={style['content']}>
          <div className={style['image']}>
            <img alt={``} src={props.data.displayIcon} />
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