import { useEffect } from "react";
import useSWR from "swr";
import { Fetcher } from "@/hooks";
import { useAuthObjStore, useLanguageStore, useRegionStore } from "@/store";
import { regionOptions, languageOptions } from "@/options";
import type { RegionOption } from "@/options";
import type { RegionCode, LanguageCode } from "@/type";

export default function InitManager() {
  const authObj = useAuthObjStore((state) => state.authObj);
  const setAuthObj = useAuthObjStore((state) => state.setAuthObj);
  const setRegion = useRegionStore((state) => state.setRegion);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const reqCookie = useSWR("/api/cookie", Fetcher);

  useEffect(function initLang() {
    const langs = languageOptions.map((lang) => lang.value);
    const localLang: string | undefined | null = window.localStorage.getItem("language");
    const clientLang = navigator.language;

    if (localLang !== undefined && localLang !== null && langs.find((lang) => lang === localLang)) {
      setLanguage(localLang as LanguageCode);
    } else {
      if (navigator) {
        if (clientLang) {
          if (langs.find((lang) => lang === clientLang)) {
            setLanguage(clientLang as LanguageCode);
          } else {
            setLanguage("en-US");
          }
        } else {
          setLanguage("en-US");
        }
      } else {
        setLanguage("en-US");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    function initAuth() {
      if (reqCookie.error) {
        // ... error
      } else if (reqCookie.data) {
        if (!authObj.isInit) {
          const accessToken =
            reqCookie.data && reqCookie.data.hasOwnProperty("access_token")
              ? reqCookie.data["access_token"]
              : undefined;
          const expiryTimestamp =
            reqCookie.data && reqCookie.data.hasOwnProperty("expiry_timestamp")
              ? reqCookie.data["expiry_timestamp"]
              : undefined;
          const regionCode =
            reqCookie.data && reqCookie.data.hasOwnProperty("region_code")
              ? reqCookie.data["region_code"]
              : undefined;

          if (
            accessToken &&
            accessToken !== authObj.access_token &&
            expiryTimestamp &&
            Number(expiryTimestamp) !== authObj.expiry_timestamp &&
            expiryTimestamp &&
            Number(expiryTimestamp) > Date.now()
          ) {
            setAuthObj({
              isInit: true,
              access_token: accessToken,
              expiry_timestamp: Number(expiryTimestamp),
            });
          } else {
            setAuthObj({ ...authObj, isInit: true });
          }

          if (
            regionCode &&
            regionOptions.find((option: RegionOption) => option.value === regionCode) &&
            expiryTimestamp &&
            Number(expiryTimestamp) > Date.now()
          ) {
            setRegion(regionCode as RegionCode);
          }
        }
      } else {
        // .. loading
      }
    },
    [authObj, reqCookie, setAuthObj, setRegion],
  );

  return null;
}
