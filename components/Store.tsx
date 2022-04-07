import axios from 'axios';
import { useState, useEffect } from 'react';
import { StoreDataType } from '../type';
import StoreLayout from './template/StoreLayout';


export default function Store(props: {
  access_token: string
}) {
  const [storeData, setStoreData] = useState<Error|StoreDataType|undefined>(undefined);

  function initFetch() {
    reqStorefront(props.access_token).then(res => {
      setStoreData(res.data);
    }).catch(() => setStoreData(undefined));
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

async function reqPuuid(access_token: string ) {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/riot/global/userinfo',
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

async function reqStorefront(access_token: string) {
  const entitlements = await reqEntitlements(access_token);
  const puuid = await reqPuuid(access_token);
  
  const res = await axios({
    method: 'GET',
    url: `/api/riot/kr/storefront/${puuid}`,
    headers: {
      'X-Riot-Entitlements-JWT': entitlements,
      'Authorization': `Bearer ${access_token}`
    }
  });

  return res
}