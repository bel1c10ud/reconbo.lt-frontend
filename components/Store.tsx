import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { skinsDataAtom, contentTiersDataAtom, offersDataAtom } from '../recoil';
import { StoreDataType, SkinType, ContentTierType } from '../type';
import StoreLayout from './template/StoreLayout';


export default function Store(props: {
  access_token: string
}) {
  const [storeData, setStoreData] = useState<Error|StoreDataType|undefined>(undefined);

  const [skinsData, setSkinsData] = useRecoilState(skinsDataAtom);
  const [contentTiersData, setContentTiersData] = useRecoilState(contentTiersDataAtom);
  const [offersData, setOffersData] = useRecoilState(offersDataAtom);

  function initFetch() {
    reqAsync(props.access_token)
    .then(res => {
      setStoreData(res.storefront);
      setOffersData(res.offers);
    })
    .catch(error => {
      setStoreData(error);
      setOffersData(error);
    });

    reqSkins().then(res => setSkinsData(res.data.data)).catch(error => setSkinsData(error));
    reqContentTiers().then(res => setContentTiersData(res.data.data)).catch(error => setContentTiersData(error));
  }

  useEffect(initFetch, [])

  if(storeData === undefined) {
    return <div>loding...</div>
  } else if(storeData.constructor === Error) {
    return <div>error</div>
  } else {
    return <StoreLayout storeData={storeData as StoreDataType} />
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

async function reqStorefront(access_token: string, entitlements: string, puuid: string) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/rewrite/riot-pvp/kr/storefront/${puuid}`,
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

async function reqSkins() {
  const res = await axios({
    method: 'GET',
    url: 'https://valorant-api.com/v1/weapons/skins',
    params: {
      'language': 'ko-KR'
    }
  })

  return res;
}

async function reqOffers(access_token: string, entitlements: string) {
  try {
    const res = await axios({
      method: 'GET',
      url: `/rewrite/riot-pvp/kr/offers`,
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

async function reqAsync(access_token: string) {
  const entitlements = await reqEntitlements(access_token);
  const puuid = await reqPuuid(access_token);

  const resStorefront = await reqStorefront(access_token, entitlements, puuid);
  const resOffers = await reqOffers(access_token, entitlements);

  return {
    storefront: resStorefront,
    offers: resOffers
  }

}