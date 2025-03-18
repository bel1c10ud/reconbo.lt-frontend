import axios from "axios";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { authObjAtom, languageAtom, regionAtom } from "@/recoil";
import { isValidAuth } from "@/utility";
import type { AxiosHeaders } from "axios";
import type { ClientAPI, LanguageCode, ValorantOfficialWeb } from "@/type";
import { ExternalAPI } from "@/type";

const swrConfig = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const endpoint = {
  userinfo: {
    method: "GET",
    url: "/rewrite/userinfo",
    headers: {
      Authorization: "Bearer ${access_token}",
    },
  },
  entitlements: {
    method: "POST",
    url: "/rewrite/entitlements",
    headers: {
      Authorization: "Bearer ${access_token}",
      "Content-Type": "application/json",
    },
  },
  store: {
    method: "POST",
    url: "/rewrite/storefront/${region}/${puuid}",
    headers: {
      "X-Riot-ClientPlatform": "${client_platform}",
      "X-Riot-ClientVersion": "${client_version}",
      "X-Riot-Entitlements-JWT": "${entitlements}",
      Authorization: "Bearer ${access_token}",
    },
  },
};

export function Fetcher(url: string) {
  return axios({
    url: url,
  }).then((res) => res.data);
}

function ClientAPIFetcher(...args: ["GET" | "POST", string, AxiosHeaders]) {
  const [method, url, headers] = args;

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: {},
    ...(method === "POST" ? { data: {} } : {}),
  }).then((res) => res.data);
}

function ExternalAPIFetcher(url: string, lang: LanguageCode) {
  return axios.get(`${url}?language=${lang}`).then((res) => {
    if (res.data.status === 200 && res.data?.data) {
      return res.data.data;
    } else {
      return new Error(res.data);
    }
  });
}

export function useClientAPI<T>(key: keyof typeof ClientAPI.Key) {
  const region = useRecoilValue(regionAtom);
  const authObj = useRecoilValue(authObjAtom);

  const reqUserinfo = useSWR(
    () => {
      if (!isValidAuth(authObj) || !authObj.access_token) return false;
      else
        return [
          endpoint["userinfo"].method,
          endpoint["userinfo"].url,
          JSON.parse(
            JSON.stringify(endpoint["userinfo"].headers).replaceAll(
              "${access_token}",
              authObj.access_token,
            ),
          ),
        ];
    },
    ClientAPIFetcher,
    swrConfig,
  );

  const reqEntitlements = useSWR(
    () => {
      if (!isValidAuth(authObj) || !authObj.access_token) return false;
      else
        return [
          endpoint["entitlements"].method,
          endpoint["entitlements"].url,
          JSON.parse(
            JSON.stringify(endpoint["entitlements"].headers).replaceAll(
              "${access_token}",
              authObj.access_token,
            ),
          ),
        ];
    },
    ClientAPIFetcher,
    swrConfig,
  );

  const reqClientVersion = useSWR(
    [ExternalAPI.Endpoint["version"], "en-US"],
    ExternalAPIFetcher,
    swrConfig,
  );

  const puuid = useMemo(() => reqUserinfo.data?.sub, [reqUserinfo]);
  const entitlements = useMemo(() => reqEntitlements.data?.entitlements_token, [reqEntitlements]);
  const clientVersion = useMemo(() => reqClientVersion.data?.riotClientVersion, [reqClientVersion]);

  const { data, error } = useSWR<T>(
    () => {
      let objStr = JSON.stringify(endpoint[key]);

      if (objStr.includes("${region}")) {
        if (region) objStr = objStr.replace(new RegExp(/\$\{region\}/, "gim"), region);
        else return false;
      }

      if (objStr.includes("${access_token}")) {
        if (isValidAuth(authObj) && authObj.access_token)
          objStr = objStr.replace(new RegExp(/\$\{access_token\}/, "gim"), authObj.access_token);
        else return false;
      }

      if (objStr.includes("${puuid}")) {
        if (puuid) objStr = objStr.replace(new RegExp(/\$\{puuid\}/, "gim"), puuid);
        else return false;
      }

      if (objStr.includes("${entitlements}")) {
        if (entitlements)
          objStr = objStr.replace(new RegExp(/\$\{entitlements\}/, "gim"), entitlements);
        else return false;
      }

      if (objStr.includes("${client_platform}")) {
        const clientPlatform =
          "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";
        objStr = objStr.replace(new RegExp(/\$\{client_platform\}/, "gim"), clientPlatform);
      }

      if (objStr.includes("${client_version}")) {
        if (clientVersion)
          objStr = objStr.replace(new RegExp(/\$\{client_version\}/, "gim"), clientVersion);
        else return false;
      }

      if (objStr.includes("${") && objStr.includes("}")) {
        return false;
      } else {
        const obj = JSON.parse(objStr);
        return [obj.method, obj.url, obj.headers];
      }
    },
    ClientAPIFetcher,
    swrConfig,
  );

  if (!error && !data) return { data: undefined, error: undefined, isLoading: true };
  else if (error) return { data: undefined, error: error, isLoading: false };
  else return { data: data, error: undefined, isLoading: false };
}

export function useExternalAPI<T>(key: keyof typeof ExternalAPI.Endpoint) {
  const lang = useRecoilValue(languageAtom);
  const endpoint = ExternalAPI.Endpoint[key];

  const { data, error } = useSWR<T>([endpoint, lang ?? "en-US"], ExternalAPIFetcher, swrConfig);

  if (!error && !data) return { data: undefined, error: undefined, isLoading: true };
  else if (error) return { data: undefined, error: error, isLoading: false };
  else return { data: data, error: undefined, isLoading: false };
}

export function useAuth() {
  const authObj = useRecoilValue(authObjAtom);

  const obj = {
    ...authObj,
    isValid: isValidAuth(authObj),
  };

  return obj;
}

export function useActData() {
  const lang = useRecoilValue(languageAtom);
  const reqPageData = useSWR<ValorantOfficialWeb.LatestEpisodeOrAct>(
    `/api/latestEpisodeOrAct?lang=${lang ?? "en-US"}`,
    Fetcher,
    swrConfig,
  );

  if (!reqPageData.error && !reqPageData.data)
    return { data: undefined, error: undefined, isLoading: true };
  else if (reqPageData.error)
    return { data: undefined, error: reqPageData.error, isLoading: false };
  else return { data: reqPageData.data, error: undefined, isLoading: false };
}

export function usePlayValPageData() {
  const lang = useRecoilValue(languageAtom);
  const reqPageData = useSWR<ValorantOfficialWeb.PageDataResult>(
    `/api/playvalorant-page-data?lang=${lang ?? "en-US"}`,
    Fetcher,
    swrConfig,
  );

  if (!reqPageData.error && !reqPageData.data)
    return { data: undefined, error: undefined, isLoading: true };
  else if (reqPageData.error)
    return { data: undefined, error: reqPageData.error, isLoading: false };
  else return { data: reqPageData.data, error: undefined, isLoading: false };
}
