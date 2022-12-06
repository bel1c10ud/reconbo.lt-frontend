import style from './ItemCard.module.css';
import { useMemo } from 'react';
import { useExternalAPI } from '../../hooks';
import ItemCardSkeleton from './ItemCardSkeleton';
import SlideText from '../SlideText';
import ItemCardError from './ItemCardError';
import { Discount } from './ItemCard';
import Price from '../Price';
import { ClientAPI, ExternalAPI } from '../../type';

interface SprayProps {
  uuid: string,
  bundleOffer?: ClientAPI.Item
}

export default function Spray(props: SprayProps) {
  const externalAPISprays = useExternalAPI<ExternalAPI.Spray[]>('sprays');
  const externalAPISpray = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPISprays.error) return { ...obj, error: externalAPISprays.error }
    else if(externalAPISprays.isLoading) return { ...obj, isLoading: true }
    else if(externalAPISprays.data) return { ...obj, data: externalAPISprays.data.find(spray => spray.uuid === props.uuid) }
    return { ...obj, error: new Error('Not found spray') }
  }, [props.uuid, externalAPISprays])

  if(externalAPISpray.error) return <ItemCardError error={externalAPISpray.error} />
  else if(externalAPISpray.isLoading || !externalAPISpray.data) return <ItemCardSkeleton />
  else return <SprayLayout data={externalAPISpray.data} bundleOffer={props.bundleOffer} />
}


interface SprayLayoutProps {
  data: ExternalAPI.Spray,
  bundleOffer?: ClientAPI.Item
}

function SprayLayout(props: SprayLayoutProps) {
  const imageURI = useMemo(() => props.data.animationGif ?? props.data.fullTransparentIcon ?? props.data.fullIcon, [props.data]);

  return (
    <div className={style['self']} data-item-type='spray'>
      <div className={style['ratio']}>
        <div className={style['content']}>
          <div className={style['image']}>
            <img alt={``} src={imageURI} />
          </div>
          <div className={style['overlay}']}>
            <div className={style['info']}>
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