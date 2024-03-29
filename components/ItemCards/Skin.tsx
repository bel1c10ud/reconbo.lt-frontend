
import style from './ItemCard.module.css';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useClientAPI, useExternalAPI } from '../../hooks';
import ItemCardSkeleton from './ItemCardSkeleton';
import SlideText from '../SlideText';
import ItemCardError from './ItemCardError';
import { Discount } from './ItemCard';
import Price from '../Price';
import Link from 'next/link';
import { ExternalAPI, ClientAPI, AsyncData } from '../../type';

interface SkinProps {
  uuid: string,
  bonusStoreOffer?: ClientAPI.BonusStoreOffer,
  bundleOffer?: ClientAPI.Item
}

export default function Skin(props: SkinProps) {
  const clientAPIOffers = useClientAPI<ClientAPI.Offers>('offers');
  const externalAPISkins = useExternalAPI<ExternalAPI.Skin[]>('skins');
  const externalAPIcontentTiers = useExternalAPI<ExternalAPI.ContentTier[]>('contentTiers');
  const externalAPISkin = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPISkins.error) return { ...obj, error: externalAPISkins.error }
    else if(externalAPISkins.isLoading) return { ...obj, isLoading: true }
    else if(externalAPISkins.data) {
      let levelIndex = undefined;
      let chromaIndex = undefined;

      const externalAPISkin = externalAPISkins.data.find(skin => {
        if(skin.uuid === props.uuid) {
          return true
        } else {
          levelIndex = skin.levels.findIndex(level => level.uuid == props.uuid) === -1 ? undefined : skin.levels.findIndex(level => level.uuid == props.uuid);
          chromaIndex = skin.chromas.findIndex(chroma => chroma.uuid == props.uuid) === -1 ? undefined : skin.chromas.findIndex(chroma => chroma.uuid == props.uuid);

          if((levelIndex !== undefined) && (chromaIndex === undefined)) {
            return true;
          } else if((levelIndex === undefined) && (chromaIndex !== undefined)) {
            return true;
          } else {
            return false
          }
        }
      });

      const data = {
        externalAPISkin: externalAPISkin,
        chromaIndex: chromaIndex,
        levelIndex: levelIndex,
      }

      return { ...obj, data: data }
    } else {
      return { ...obj, error: new Error('Not found skin')}
    }

  }, [props.uuid, externalAPISkins])
  const externalAPIContentTier = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPIcontentTiers.error) return { ...obj, error: externalAPIcontentTiers.error }
    else if(externalAPIcontentTiers.isLoading) return { ...obj, isLoading: true }
    else if(externalAPIcontentTiers.data) {
      if(externalAPISkin.data) {
        return {
          ...obj,
          data: externalAPIcontentTiers.data.find(tier => tier.uuid === externalAPISkin.data.externalAPISkin?.contentTierUuid)
        }
      } else {
        return { ...obj, isLoading: true }
      }
    } else {
      return { ...obj, error: new Error('Not found content tier')}
    }
  }, [externalAPIcontentTiers, externalAPISkin])
  const clientAPIOffer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(clientAPIOffers.error) return { ...obj, error: clientAPIOffers.error }
    else if(clientAPIOffers.isLoading) return { ...obj, isLoading: true }
    else if(clientAPIOffers.data) {
      if(externalAPISkin.error) return { ...obj, error: externalAPISkin.error }
      else if(externalAPISkin.isLoading) return { ...obj, isLodaing: true }
      else if(externalAPISkin.data) {
        const uuid = externalAPISkin.data.externalAPISkin?.levels[externalAPISkin.data.levelIndex ?? 0].uuid;
        const data = clientAPIOffers.data.Offers.find((offer: ClientAPI.Offer) => {
          if(offer.OfferID === uuid ) 
            return true
          else {
            const reward = offer.Rewards.find(reward => reward.ItemID === uuid);
            if(reward && offer.Rewards.length === 1) return true
          }
        });

        return { ...obj, data: data }
      }
      else return { ...obj, error: new Error('Not found skin from External API') }
    }
    return { ...obj, error: new Error('Not found offers from Client API') }
  }, [props.uuid, clientAPIOffers, externalAPISkin.data]);

  if(externalAPISkin.error) return <ItemCardError error={externalAPISkin.error} />
  else if(externalAPISkin.isLoading || !externalAPISkin.data) return <ItemCardSkeleton />
  else 
    return (
      <SkinLayout data={{
        ...externalAPISkin.data,
        contentTier: externalAPIContentTier.data,
        offer: clientAPIOffer,
        bonusStoreOffer: props.bonusStoreOffer,
        bundleOffer: props.bundleOffer
        }}  
      />
    )
}

interface SkinDataType {
  externalAPISkin?: ExternalAPI.Skin,
  levelIndex?: number,
  chromaIndex?: number,
  contentTier?: ExternalAPI.ContentTier,
  offer?: AsyncData<ClientAPI.Offer>
  bonusStoreOffer?: ClientAPI.BonusStoreOffer,
  bundleOffer?: ClientAPI.Item
}

interface SkinLayoutProps {
  data: SkinDataType
}

function SkinLayout(props: SkinLayoutProps) {
  const router = useRouter();

  const name = props.data.externalAPISkin?.levels[props.data.levelIndex ?? 0].displayName;
  const imageSrc = props.data.externalAPISkin?.levels[props.data.levelIndex ?? 0].displayIcon;

  const detailURI = useMemo(function onClickSkin() {
    if(props.data?.externalAPISkin) {
      const queryObj: { [key: string]: number|string|boolean|undefined } = {
        level: props.data.levelIndex,
        chroma: props.data.chromaIndex,
      }
  
      const queryArray = Object.entries(queryObj).reduce<string[]>((prev, query) => {
        const [key, value] = query;
  
        if(value === undefined || value === false || value == 0) return prev;
        else if(value === true) return prev.concat(key);
        else return prev.concat(`${key}=${value}`);
      }, []);

      if(queryArray.length > 0) {
        return `/skin/${props.data.externalAPISkin.uuid}?${queryArray.join('&')}`
      } else {
        return `/skin/${props.data.externalAPISkin.uuid}`;
      }
    }
  }, [props.data]);

  const category = useMemo(() => {
    if(props.data.externalAPISkin) {
      return props.data.externalAPISkin.assetPath.split('/')[3];
    }
  }, [props.data.externalAPISkin])

  function onClickSkin() {
    if(props.data?.externalAPISkin) {
      const queryObj: { [key: string]: number|string|boolean|undefined } = {
        level: props.data.levelIndex,
        chroma: props.data.chromaIndex,
      }
  
      const queryArray = Object.entries(queryObj).reduce<string[]>((prev, query) => {
        const [key, value] = query;
  
        if(value === undefined || value === false || value == 0) return prev;
        else if(value === true) return prev.concat(key);
        else return prev.concat(`${key}=${value}`);
      }, []);

      if(queryArray.length > 0) {
        return router.push(`/skin/${props.data.externalAPISkin.uuid}?${queryArray.join('&')}`);
      } else {
        return router.push(`/skin/${props.data.externalAPISkin.uuid}`);
      }

    }
  
  }

  return (
    <div className={style.self} 
    data-item-type='skin'
    data-tier={props.data.contentTier?.devName} 
    data-category={category}
    onClick={onClickSkin}>
      <Link href={detailURI ?? '/'}>
      <div className={style.ratio}>
        <div className={style.content}>
          <div className={style.image}>
            <img alt={`${name} skin image`} src={imageSrc} />
          </div>
          <div className={style.overlay}>
            <div className={style.info}>
              <SlideText>{name}</SlideText>
              <div className={style['value']}>
                <div className={style['content-tier']}>
                  <img alt={`${props.data.contentTier?.devName?? 'unknown'} tier`} src={props.data.contentTier?.displayIcon} />
                </div>
                <div className={style['price']}>                
                  <Price 
                  offer={props.data.offer}
                  bonusStoreOffer={props.data.bonusStoreOffer}
                  bundleOffer={props.data.bundleOffer} 
                  />
                </div>
              </div>
            </div>
            <Discount bundleOffer={props.data.bundleOffer} bonusStoreOffer={props.data.bonusStoreOffer} />
          </div>
        </div>
      </div>
      </Link>
    </div>
  )
}