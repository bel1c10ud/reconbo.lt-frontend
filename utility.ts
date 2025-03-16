import { RiotTokenResponseType, AuthObjType } from './type';

export function GetRiotTokenFromURI(uri: string): Partial<RiotTokenResponseType> {
  let riotToken: Partial<RiotTokenResponseType> = {};
  const requestedDate = ( new Date() ).toISOString();

  const paramsStr = uri.split('#')[1];
  const params = paramsStr.split('&'); 

  params.forEach((el: string) => {
    const [key, value] = el.split('=');
    const newObj: object = { ...riotToken, ...{ [key]: value } };
    riotToken = Object.assign({}, newObj);
  })

  return { ...riotToken, 'requestedDate': requestedDate };
}

export function cookieStrParser(str: string): object[] {
  const cookieStrArray = str.split(';');
  const cookies = cookieStrArray.map((el: string) => {
    const [key, value] = el.trim().split('=');
    return { name: key, value: value }
  })

  return cookies;
}

export function isValidAuth(authObj: Omit<AuthObjType, 'isValid'>): boolean {
  const now = Date.now();

  if(!authObj.access_token) return false;
  if(authObj.access_token.trim().length<1) return false;
  if(authObj.expiry_timestamp === undefined) return false;
  if(authObj.expiry_timestamp<= now) return false;

  return true;
}