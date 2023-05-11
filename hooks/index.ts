import useSWR from "swr";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import { authObjAtom, languageAtom, regionAtom } from "../recoil";
import { isValidAuth } from "../utility";

import { ClientAPI, ExternalAPI, LanguageCode, ValorantOfficialWeb } from "../type";
import axios from "axios";

const swrConfig = {
  revalidateOnFocus: false,
  revalidateIfStale: false
}

const endpoint = {
  puuid: {
    method: 'GET',
    url: '/rewrite/${region}/auth-riotgames/userinfo',
    headers: {
      'Authorization': 'Bearer ${access_token}'
    }
  },
  entitlements: {
    method: 'POST',
    url: 'https://entitlements.auth.riotgames.com/api/token/v1',
    headers: {
      'Authorization': 'Bearer ${access_token}',
      'Content-Type': 'application/json'
    }
  },
  store: {
    method: 'GET',
    url: '/rewrite/${region}/riot-pvp/${region}/storefront/${puuid}',
    headers: {
      'X-Riot-Entitlements-JWT': '${entitlements}',
      'Authorization': 'Bearer ${access_token}'
    }
  },
  offers: {
    method: 'GET',
    url: '/rewrite/${region}/riot-pvp/${region}/offers',
    headers: {
      'X-Riot-Entitlements-JWT': '${entitlements}',
      'Authorization': 'Bearer ${access_token}'
    }
  }
};

export function Fetcher(url: string) {
  return axios({
    url: url
  }).then(res => res.data);
}

function ClientAPIFetcher(...args: ['GET'|'POST', string, string, string]) {
  const [method, url, access_token, entitlements] = args;

  let headers: {} = {  };

  if(access_token)
    headers = { ...headers, 'Authorization': `Bearer ${access_token}` }
  if(entitlements)
    headers = { ...headers, 'X-Riot-Entitlements-JWT': entitlements }

  return axios({
    method: method,
    url: url,
    headers: headers,
    ...(method === 'POST' ? { data: {} } : {})
  }).then(res => res.data)
}

function ExternalAPIFetcher(url: string, lang: LanguageCode) {
  return axios.get(`${url}?language=${lang}`).then(res => {
    if(res.data.status === 200 && res.data?.data) {
      return res.data.data
    } else {
      return new Error(res.data);
    }
  })
}

export function useClientAPI<T>(key: keyof typeof ClientAPI.Key) {
  const region = useRecoilValue(regionAtom);
  const authObj = useRecoilValue(authObjAtom);

  const reqPuuid = useSWR(() => {
    if(!region)
      return false
    else if(!isValidAuth(authObj) || !authObj.access_token)
      return false
    else
      return ['GET', `/rewrite/${region}/auth-riotgames/userinfo`, authObj.access_token];
  }, ClientAPIFetcher, swrConfig);

  const reqEntitlements = useSWR(() => {
    if(!isValidAuth(authObj) || !authObj.access_token)
      return false
    else 
      return ['POST', 'https://entitlements.auth.riotgames.com/api/token/v1', authObj.access_token];
  }, ClientAPIFetcher, swrConfig);

  const puuid = useMemo(() => {
    if(reqPuuid.data?.hasOwnProperty('sub')) {
      return reqPuuid.data.sub;
    }
  }, [reqPuuid]);

  const entitlements = useMemo(() => {
    if(reqEntitlements.data?.hasOwnProperty('entitlements_token')) {
      return reqEntitlements.data.entitlements_token
    }
  }, [reqEntitlements])

  const { data, error } = useSWR<T>(() => {
    let objStr = JSON.stringify(endpoint[key]);

    if(objStr.includes('${region}')) {
      if(region) 
        objStr = objStr.replace(new RegExp(/\$\{region\}/, 'gim'), region);
      else 
        return false
    }

    if(objStr.includes('${access_token}')) {
      if(isValidAuth(authObj) && authObj.access_token) 
        objStr = objStr.replace(new RegExp(/\$\{access_token\}/, 'gim'), authObj.access_token);
      else 
        return false
    }

    if(objStr.includes('${puuid}')) {
      if(puuid)
        objStr = objStr.replace(new RegExp(/\$\{puuid\}/, 'gim'), puuid);
      else
        return false
    }

    if(objStr.includes('${entitlements}')) {
      if(entitlements)
        objStr = objStr.replace(new RegExp(/\$\{entitlements\}/, 'gim'), entitlements);
      else
        return false
    }

    if(objStr.includes('${') && objStr.includes('}')) {
      return false
    } else {
      const obj = JSON.parse(objStr);
      const access_token = obj.headers['Authorization'].replace('Bearer ', '');

      return [obj.method, obj.url, access_token, obj.headers['X-Riot-Entitlements-JWT']]
    }
  }, ClientAPIFetcher, swrConfig);

  if(!error && !data) 
    return { data: undefined, error: undefined, isLoading: true }
  else if(error) 
    return { data: undefined, error: error, isLoading: false }
  else 
    return { data: data, error: undefined, isLoading: false }
}

export function useExternalAPI<T>(key: keyof typeof ExternalAPI.Endpoint) {
  const lang = useRecoilValue(languageAtom);
  const endpoint = ExternalAPI.Endpoint[key];

  const {data, error} = useSWR<T>([endpoint, lang ?? 'en-US'], ExternalAPIFetcher, swrConfig);

  if(!error && !data) 
    return { data: undefined, error: undefined, isLoading: true }
  else if(error) 
    return { data: undefined, error: error, isLoading: false }
  else 
    return { data: data, error: undefined, isLoading: false }
}

export function useAuth() {
  const authObj = useRecoilValue(authObjAtom);

  const obj = {
    ...authObj,
    isValid: isValidAuth(authObj),
  }

  return obj
}

export function useActData() {
  const lang = useRecoilValue(languageAtom);
  const reqPageData = useSWR<ValorantOfficialWeb.LatestEpisodeOrAct>(`/api/latestEpisodeOrAct?lang=${lang ?? 'en-US'}`, Fetcher, swrConfig);

  if(!reqPageData.error && !reqPageData.data) 
    return { data: undefined, error: undefined, isLoading: true }
  else if(reqPageData.error) 
    return { data: undefined, error: reqPageData.error, isLoading: false }
  else 
    return { data: reqPageData.data, error: undefined, isLoading: false }
}

export function usePlayValPageData() {
  const lang = useRecoilValue(languageAtom);
  const reqPageData = useSWR<ValorantOfficialWeb.PageDataResult>(`/api/playvalorant-page-data?lang=${lang ?? 'en-US'}`, Fetcher, swrConfig);

  if(!reqPageData.error && !reqPageData.data) 
    return { data: undefined, error: undefined, isLoading: true }
  else if(reqPageData.error) 
    return { data: undefined, error: reqPageData.error, isLoading: false }
  else 
    return { data: reqPageData.data, error: undefined, isLoading: false }
}

