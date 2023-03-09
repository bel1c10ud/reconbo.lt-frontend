import style from './BundleDetailLayout.module.css';

import Buddy from '../ItemCards/Buddy';
import PlayerCard from '../ItemCards/PlayerCard';
import PlayerTitle from '../ItemCards/PlayerTitle';
import Skin from '../ItemCards/Skin';
import Spray from '../ItemCards/Spray';

import { AuthObjType, ClientAPI, ExternalAPI } from '../../type';
import { RequiredLoginCallout } from '../Callout';
import Head from 'next/head';
import Footer from '../Footer';
import LanguageSelect from '../LanguageSelect';
import LoginButton from '../LoginButton';
import Hr from '../Hr';
import { useMemo } from 'react';

import ItemCardSkeleton from '../ItemCards/ItemCardSkeleton';
import ItemCardError from '../ItemCards/ItemCardError';
import { IsNotAccurate } from '../Callout';
import Price from '../Price';
import Button from '../Button';
import Header from '../Header';

interface BundleDetailLayoutProps {
  auth: AuthObjType,
  uuid: string,
  clientAPIBundleData?: ClientAPI.Bundle,
  externalAPIBundleData: ExternalAPI.Bundle
}

export default function BundleDetailLayout(props: BundleDetailLayoutProps) {
  const price = useMemo(() => {
    let sum = 0;

    if(props.clientAPIBundleData?.Items) {
      props.clientAPIBundleData.Items.forEach(item => {
        if(item.CurrencyID === ClientAPI.CurrencyType.VP) {
          sum = sum + item.DiscountedPrice
        }
      })
    }

    if(sum) return { currencyType: "VP" as keyof typeof ClientAPI.CurrencyType, value: sum }
    else return undefined
  }, [props.clientAPIBundleData?.Items])

  return (
    <>
      <Head>
        <title>Reconbo.lt | Bundle Detail</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <div className={style['title']}>BUNDLE DETAIL</div>
        <div className={style['headline']}>
          <div className={style['display-name']}>{props.externalAPIBundleData.displayName}</div>
        </div>
        <div className={style['preview']}>
          <div className={style['preview-image']}>
            <img src={props.externalAPIBundleData.displayIcon} alt={props.externalAPIBundleData.description} />
          </div>
          <div className={style['preview-description']}>
            { props.externalAPIBundleData.description }
          </div>
        </div>
        <Hr />
        <div className={style['bundle-info']}>
          <div className={style['bundle-info-title']}>PRICE</div>
{ props.auth.isValid ? (
          <>
            <IsNotAccurate />
            <Button className={style['bundle-price']} secondary medium>
              <Price bundleOffers={props.clientAPIBundleData?.Items} />
            </Button>
          </>
        ) : (
            <RequiredLoginCallout />
) }
        </div>
        <Hr />
        <div className={style['bundle-info']}>
          <div className={style['bundle-info-title']}>COMPONENTS</div>
{ props.auth.isValid ? (
            <BundleComponents data={props.clientAPIBundleData} />
        ) : (
            <RequiredLoginCallout />
) }
        </div>
        <Footer />
      </div>
    </>
  )
}

interface BundleComponentsProps {
  data?: ClientAPI.Bundle
}

function BundleComponents(props: BundleComponentsProps) {
  if(!props.data) {
    return (
      <div className={style['bundle-components']}>
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>
    )
  } else {
    return (
      <div className={style['bundle-components']}>
{ props.data.Items.map(item => {
        let bundleOffer = undefined;

        if(item.hasOwnProperty('BasePrice') && item.hasOwnProperty('DiscountPercent') && item.hasOwnProperty('DiscountPercent')) {
          bundleOffer = item;
        }

        switch(item.Item.ItemTypeID) {
          case 'e7c63390-eda7-46e0-bb7a-a6abdacd2433':
            return <Skin key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />;
          case 'd5f120f8-ff8c-4aac-92ea-f2b5acbe9475':
            return <Spray key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />;
          case 'dd3bf334-87f3-40bd-b043-682a57a8dc3a':
            return <Buddy key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />;
          case '3f296c07-64c3-494c-923b-fe692a4fa1bd':
            return <PlayerCard key={item.Item.ItemID} uuid={item.Item.ItemID} bundleOffer={bundleOffer} />;
          case 'de7caa6b-adf7-4588-bbd1-143831e786c6':
            return <PlayerTitle key={item.Item.ItemID} uuid={item.Item.ItemID} />
          default:
            return <ItemCardError key={item.Item.ItemID} error={new Error('Unknown type item')} />
        }
}) }
      </div>
    )
  }
}

