import { useEffect } from "react";
import { useAuthObjStore, useIdTokenStore } from "@/store";
import { getExpiryFromJWT } from "@/utility";

export default function useInitializationTokensFromHeaders(headers?: Record<string, string>) {
  const setAuthObj = useAuthObjStore((state) => state.setAuthObj);
  const setIdToken = useIdTokenStore((state) => state.setIdToken);

  useEffect(() => {
    if (
      !headers ||
      !headers.hasOwnProperty("x-access-token") ||
      !headers.hasOwnProperty("x-id-token")
    )
      return;

    const accessToken = headers["x-access-token"];
    const idToken = headers["x-id-token"];

    if (accessToken && getExpiryFromJWT(accessToken)) {
      const expiryTimeStamp = (getExpiryFromJWT(accessToken) as number) * 1000;

      setAuthObj({
        isInit: true,
        access_token: accessToken,
        expiry_timestamp: expiryTimeStamp,
      });
    }

    if (idToken) {
      setIdToken(idToken);
    }
  }, [headers, setAuthObj, setIdToken]);
}
