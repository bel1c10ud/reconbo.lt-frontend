import { useEffect } from "react";
import useSWR from "swr";
import { Fetcher } from "@/hooks";
import { useAuthObjStore, useIdTokenStore, useLanguageStore } from "@/store";
import { languageOptions } from "@/options";
import type { LanguageCode } from "@/type";

export default function useInitializationTokensFromCookie() {
  const authObj = useAuthObjStore((state) => state.authObj);
  const setAuthObj = useAuthObjStore((state) => state.setAuthObj);
  const idToken = useIdTokenStore((state) => state.idToken);
  const setIdToken = useIdTokenStore((state) => state.setIdToken);
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
        // error handling
      }
      if (reqCookie.data) {
        if (authObj.isInit) return;
        if (!reqCookie.data) return;

        const accessTokenFromCookie = reqCookie.data.hasOwnProperty("access_token")
          ? reqCookie.data["access_token"]
          : undefined;
        const expiryTimestampFromCookie = reqCookie.data.hasOwnProperty("expiry_timestamp")
          ? reqCookie.data["expiry_timestamp"]
          : undefined;
        const idTokenFromCookie = reqCookie.data.hasOwnProperty("id_token")
          ? reqCookie.data["id_token"]
          : undefined;

        if (
          accessTokenFromCookie &&
          accessTokenFromCookie !== authObj.access_token &&
          expiryTimestampFromCookie &&
          Number(expiryTimestampFromCookie) !== authObj.expiry_timestamp &&
          expiryTimestampFromCookie &&
          Number(expiryTimestampFromCookie) > Date.now()
        ) {
          setAuthObj({
            isInit: true,
            access_token: accessTokenFromCookie,
            expiry_timestamp: Number(expiryTimestampFromCookie),
          });
        } else {
          setAuthObj({ ...authObj, isInit: true });
        }

        if (idTokenFromCookie && idTokenFromCookie !== idToken) {
          setIdToken(idTokenFromCookie);
        }
      } else {
        // .. loading
      }
    },
    [authObj, idToken, reqCookie, setAuthObj, setIdToken],
  );

  return null;
}
