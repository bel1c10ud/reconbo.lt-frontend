interface RiotTokenResponseType {
  'access_token': string,
  "scope": string,
  "iss": string,
  "id_token": string,
  "token_type": string,
  "session_state": string,
  "expires_in": string,
  "requestedDate": string
}


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