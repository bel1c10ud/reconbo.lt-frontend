import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { skinsDataAtom, contentTiersDataAtom, offersDataAtom } from '../recoil';
import { ContentTierType, OfferType, SkinType, DiscountType } from '../type';
import style from './Skin.module.css';

interface SkinDataType {
  skin: SkinType,
  levelIndex?: number,
  contentTier?: ContentTierType
  offer?: OfferType
  discount?: DiscountType
}

export default function Skin(props: {
  uuid: string
  offer?: OfferType
  discount?: DiscountType
}) {
  const [skinData, setSkinData] = useState<undefined|SkinDataType|Error>(undefined);

  const skinsData = useRecoilValue(skinsDataAtom);
  const contentTiersData = useRecoilValue(contentTiersDataAtom);
  const offersData = useRecoilValue(offersDataAtom);

  function findSkin(skinsData: SkinType[], uuid: string) {
    let result;

    for(const skin of (skinsData as SkinType[])) {
      const levelIndex = skin.levels.findIndex(level => level.uuid === uuid);

      if(levelIndex !== -1) {
        result = {
          skin: skin,
          levelIndex: levelIndex
        };
        break;
      }
    }

    return result;
  }

  function findTier(contentTiersData: ContentTierType[], uuid: string) {
    let result;

    for(const tier of contentTiersData) {
      if(tier.uuid === uuid) {
        result = tier;
        break;
      }
    }

    return result;
  }

  function findOffer(offersData: OfferType[], uuid: string) {
    let result;

    for(const offer of offersData) {
      if(offer.OfferID === uuid) {
        result = Object.assign({}, offer);
        break;
      }
      const targetReward = offer.Rewards.find(reward => reward.ItemID === uuid);
      if(targetReward && offer.Rewards.length === 1) {
        result = Object.assign({}, offer);
        break;
      }
    }

    return result
  }

  function init() {
    let skin;
    let tier;
    let offer;
    let discount = {};

    if(skinsData !== undefined && skinsData.constructor !== Error ){
      skin = findSkin(skinsData as SkinType[], props.uuid);
    }

    if(skin?.skin.contentTierUuid && (contentTiersData && contentTiersData.constructor !== Error)) {
      tier = findTier(contentTiersData as ContentTierType[], skin.skin.contentTierUuid);
    }

    if(props.offer) {
      offer = props.offer;
    } else if(offersData !== undefined && offersData.constructor !== Error) {
      offer = findOffer(offersData as OfferType[], props.uuid);
    }

    if(props.discount) {
      discount = {
        discount: {
          discountCosts: props.discount.discountCosts,
          discountPercent: props.discount.discountPercent,
        }
      }
    }

    if(skin) {
      setSkinData({ 
        ...skin, 
        contentTier: tier,
        offer: offer,
        ...discount
      });
    }
  }

  useEffect(init, [props.uuid, skinsData, contentTiersData, offersData]);

  if(skinData === undefined)  return <SkinLoading />
  else if(skinData.constructor === Error) return <SkinError />
  else  return <SkinLayout skinData={skinData as SkinDataType} />
}

function SkinLayout(props: {
  skinData: SkinDataType
}) {
  const name = props.skinData.skin.levels[props.skinData.levelIndex ?? 0].displayName;
  const imageSrc = props.skinData.skin.levels[props.skinData.levelIndex ?? 0].displayIcon;

  return (
    <div className={style.self} data-tier={props.skinData.contentTier?.devName}>
      <div className={style.ratio}>
        <div className={style.content}>
          <div className={style.image}>
            <img alt={`${name} skin image`} src={imageSrc} />
          </div>
          <div className={style.overlay}>
            <div className={style.info}>
              <div className={style.name}>{name}</div>
              <div className={style['value']}>
                <div className={style['content-tier']}>
                  <img alt={`${props.skinData.contentTier?.devName?? 'unknown'} tier`} src={props.skinData.contentTier?.displayIcon} />
                </div>
                <div className={style['cost']}>
                  <Cost 
                  cost={props.skinData.offer?.Cost['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']} 
                  discountCost={props.skinData.discount?.discountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}
                  />
                </div>
              </div>
            </div>
{props.skinData.discount && (
            <div className={style.discount}>
              <div className={style.percent}>-{props.skinData.discount?.discountPercent}% </div>
            </div>
)}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkinLoading() {
  return (
    <div className={style.self}>loading</div>
  )
}

function SkinError() {
  return (
    <div className={style.self}>Error</div>
  )
}


function Cost(props: {
  cost?: number,
  discountCost?: number
}) {
  const isDiscount: boolean = props.discountCost ? true:false
  
  if(props.cost && !props.discountCost) {
    return <span>{props.cost} VP</span>
  } else if(props.cost && props.discountCost) {
    return (
      <span>
        <del>{props.cost}</del>
        <span> </span>
        <span>{props.cost - props.discountCost} VP</span> 
      </span>)
  }
  return <span></span>
}