import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import StoreFront from './template/StoreFront';
import Callout, { CalloutBody, CalloutTitle } from './Callout';

import { skinsDataAtom, contentTiersDataAtom, offersDataAtom } from '../recoil';
import { StoreDataType } from '../type';
import { RegionCode, LanguageCode } from '../options';
import { i18nMessage } from '../i18n';
import StoreFrontSkeleton from './template/StoreFrontSkeleton';


export default function Store(props: {
  access_token: string,
  region: RegionCode|undefined,
  language: LanguageCode
}) {
  const [storeData, setStoreData] = useState<Error|StoreDataType|undefined>(undefined);

  const [skinsData, setSkinsData] = useRecoilState(skinsDataAtom);
  const [contentTiersData, setContentTiersData] = useRecoilState(contentTiersDataAtom);
  const [offersData, setOffersData] = useRecoilState(offersDataAtom);

  function initFetch() {
    if(props.region) {
      reqAsync(props.access_token, props.region)
      .then(res => {
        setStoreData(res.storefront);
        setOffersData(res.offers);
      })
      .catch(error => {
        setStoreData(error);
        setOffersData(error);
      });
    }

    reqSkins(props.language).then(res => setSkinsData(res.data.data)).catch(error => setSkinsData(error));
    reqContentTiers().then(res => setContentTiersData(res.data.data)).catch(error => setContentTiersData(error));
  }

  useEffect(initFetch, [props.region, props.language])

  if(props.region === undefined) {
    return (
      <>
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['PLEASE_SELECT_REGION'][props.language]}</CalloutTitle>
          <CalloutBody>
            {i18nMessage['IF_REGION_INCORRECT'][props.language]}
          </CalloutBody>
        </Callout>
      </>
    )
  } else if(storeData === undefined) {
    return <StoreFrontSkeleton />
  } else if(storeData.constructor === Error) {
    return (
      <>
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['ERROR'][props.language]}</CalloutTitle>
          <CalloutBody>Store Reqest {i18nMessage['ERROR'][props.language]}</CalloutBody>
        </Callout>
      </>
    )
  } else {
    return (
      <>
        <StoreFront storeData={storeData as StoreDataType} />
        <Callout>
          <CalloutTitle>ℹ️ {i18nMessage['IS_WRONG_STORE_INFORMATION'][props.language?? 'en-US']}</CalloutTitle>
          <CalloutBody>
            {i18nMessage['IF_REGION_INCORRECT'][props.language?? 'en-US']}
          </CalloutBody>
        </Callout>
      </>
    )
  }
}

async function reqEntitlements(access_token: string) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://entitlements.auth.riotgames.com/api/token/v1',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      data: {}
    })

    if(res.data.hasOwnProperty('entitlements_token')) {
      return res.data.entitlements_token
    } else {
      return new Error('not found entitlements token from api!');
    }
  } catch(error) {
    return error;
  }
}

async function reqPuuid(access_token: string) {
  try {
    const res = await axios({
      method: 'GET',
      url: '/rewrite/auth-riotgames/userinfo',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })

    if(res.data.hasOwnProperty('sub')) {
      return res.data.sub;
    } else {
      return new Error('not found puuid from api!');
    }
  } catch(error) {
    return error;
  }
}

async function reqStorefront(access_token: string, entitlements: string, puuid: string, region: RegionCode) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/rewrite/riot-pvp/${region}/storefront/${puuid}`,
      headers: {
        'X-Riot-Entitlements-JWT': entitlements,
        'Authorization': `Bearer ${access_token}`
      }
    });
  
    if(res.data) {
      return res.data
    } else {
      return new Error('not found storefront from api!');
    }
  } catch(error) {
    return error
  }

}

async function reqSkins(language: LanguageCode) {
  const res = await axios({
    method: 'GET',
    url: 'https://valorant-api.com/v1/weapons/skins',
    params: {
      'language': language
    }
  })

  return res;
}

async function reqOffers(access_token: string, entitlements: string, region: RegionCode) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/rewrite/riot-pvp/${region}/offers`,
      headers: {
        'X-Riot-Entitlements-JWT': entitlements,
        'Authorization': `Bearer ${access_token}`
      }
    });

    if(res.data?.Offers) {
      return res.data.Offers
    } else {
      return new Error('not found offers from api!')
    } 

  } catch(error) {
    return error
  }
}

async function reqContentTiers() {
  const res = await axios({
    method: 'GET',
    url: 'https://valorant-api.com/v1/contenttiers',
  })

  return res
}

async function reqAsync(access_token: string, region: RegionCode) {
  const entitlements = await reqEntitlements(access_token);
  const puuid = await reqPuuid(access_token);

  const resStorefront = await reqStorefront(access_token, entitlements, puuid, region);
  const resOffers = await reqOffers(access_token, entitlements, region);

  return {
    storefront: resStorefront,
    offers: resOffers
  }

}