import type { NextApiRequest, NextApiResponse } from 'next'
import { languageOptions, regionOptions } from '../../options';
import { RiotTokenResponseType } from '../../type';
import { i18nMessage } from '../../i18n';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const language = languageOptions.find(option => option.value === req.cookies.language)?.value ?? 'en-US';

  // 메소드 확인
  if(req.method !== 'POST') {
    return res.status(405).send({ type: 'error', message: i18nMessage['THIS_METHOD_IS_NOT_ALLOWED'][language]})
  }

  // 로그인 URL 검증
  const urlPattern = /https:\/\/playvalorant\.com(\/.+?)?\/opt_in(\/)?#access_token=.+?&scope=.+?&iss=.+?&id_token=.+?&token_type=Bearer&session_state=.+?&expires_in=\d+/;

  if(!req.body.url || typeof req.body.url !== 'string' || !urlPattern.test(req.body.url)) {
    return res.status(400).send({ type: 'error', message: `${i18nMessage['INVALID_VALUE'][language]} (url)`})
  }

  // Region Code 검증
  if(
    !req.body.regionCode || typeof req.body.regionCode !== 'string'
    || !regionOptions.find(el => el.value === req.body.regionCode)
  ) {
    return res.status(400).send({ type: 'error', message: `${i18nMessage['INVALID_VALUE'][language]}, (region code)`})
  }

  const params = req.body.url.split('#')[1].split('&');
  const requestedDate = ( new Date() ).toISOString();

  const riotToken: Partial<RiotTokenResponseType> = params.reduce((pre: Partial<RiotTokenResponseType>, cur: string) => {
    const [key, value] = cur.split('='); 
    return { ...pre, [key]: value };
  }, {});
  const expiryTimestamp = new Date(requestedDate as string).getTime() + (Number(riotToken.expires_in) * 1000);

  if(!riotToken.hasOwnProperty('access_token') || typeof riotToken.access_token !== 'string'
|| !riotToken.hasOwnProperty('expires_in') || typeof riotToken.expires_in !== 'string') {
    return res.status(400).send({ type: 'error', message: 'Invalid request body!'})
  }

  res.setHeader('set-cookie', [
    `access_token=${riotToken.access_token}; Path=/; Max-Age=${riotToken.expires_in}; HttpOnly; SameSite=Strict;`, 
    `expiry_timestamp=${expiryTimestamp}; Path=/; Max-Age=${riotToken.expires_in}; HttpOnly; SameSite=Strict;`,
    `region_code=${req.body.regionCode?? ''}; Path=/; Max-age=${riotToken.expires_in}; HttpOnly; SameSite=Strict;`
  ]);

  return res.status(200).json({
    authObj: {
      access_token: riotToken.access_token,
      expiry_timestamp: expiryTimestamp
    }
  })
}
