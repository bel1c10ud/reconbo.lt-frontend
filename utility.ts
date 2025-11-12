import type { RiotTokenResponseType, AuthObjType } from "@/type";

export function getRiotTokenFromURI(uri: string): Partial<RiotTokenResponseType> {
  let riotToken: Partial<RiotTokenResponseType> = {};
  const requestedDate = new Date().toISOString();

  const paramsStr = uri.split("#")[1];
  const params = paramsStr.split("&");

  params.forEach((el: string) => {
    const [key, value] = el.split("=");
    const newObj: object = { ...riotToken, ...{ [key]: value } };
    riotToken = Object.assign({}, newObj);
  });

  return { ...riotToken, requestedDate: requestedDate };
}

export function getExpiryFromJWT(token: string) {
  const isNode =
    typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

  const [, payload] = token.split(".");
  const decodedPaylaod = isBrowser
    ? JSON.parse(window.atob(payload))
    : isNode
      ? JSON.parse(Buffer.from(payload, "base64").toString("utf8"))
      : {};

  if (decodedPaylaod.hasOwnProperty("exp")) {
    return Number(decodedPaylaod.exp);
  }

  return undefined;
}

export function cookieStrParser(str: string): object[] {
  const cookieStrArray = str.split(";");
  const cookies = cookieStrArray.map((el: string) => {
    const [key, value] = el.trim().split("=");
    return { name: key, value: value };
  });

  return cookies;
}

export function isValidAuth(authObj: Omit<AuthObjType, "isValid">): boolean {
  const now = Date.now();

  if (!authObj.access_token) return false;
  if (authObj.access_token.trim().length < 1) return false;
  if (authObj.expiry_timestamp === undefined) return false;
  if (authObj.expiry_timestamp <= now) return false;

  return true;
}
