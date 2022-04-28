import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type: undefined|string = req.body.type;
  const newRegion = req.body.regionCode?? '';
  // const oldRegion = req.cookies['region_code'];
  const authObj = {
    access_token: req.cookies['access_token'],
    expiry_timestamp: req.cookies['expiry_timestamp']
  };

  if(type && type === 'update') {
    if(
      (newRegion && newRegion.length > 0)
      // && (oldRegion && oldRegion.length > 0)
      && (authObj.access_token && authObj.access_token.length > 0)
      && (authObj.expiry_timestamp && authObj.expiry_timestamp.length > 0)
      && (authObj.expiry_timestamp && Number(authObj.expiry_timestamp) > Date.now())
    ) {
      const expires = new Date(Number(authObj.expiry_timestamp)).toUTCString();
      res.setHeader('set-cookie', [await `region_code=${newRegion}; Path=/; Expires=${expires}; HttpOnly; SameSite=Strict;`]);
      return res.status(200).json({ region_code: newRegion?? '' });
    } else {
      return res.status(400).send({ type: 'error', message: 'Invalid reqeust!'})
    }
  } else {
    return res.status(400).send({ type: 'error', message: 'Invalid reqeust type!'})
  }
}