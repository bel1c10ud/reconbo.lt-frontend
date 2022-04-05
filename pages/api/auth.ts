import type { NextApiRequest, NextApiResponse } from 'next';
import { GetRiotTokenFromURI } from '../../utility';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // body check
  if(req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).send({ type: 'error', error: 'invalid content-type header!'})
  }
  if(typeof req.body !== 'object') {
    return res.status(400).send({ type: 'error', error: 'invalid content type!'})
  }
  if(req.body.type !== 'auth' && req.body.type !== 'multifactor') {
    return res.status(400).send({ type: 'error', error: 'invalid reqeust type!'})
  }

  // browser branch
  let browser;

  if(process.env.VERCEL === '1') {// on vercel ecosystem
    const chromium = (await import('chrome-aws-lambda')).default;
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

  } else {// on other ecosystem
    const puppeteer = (await import('puppeteer'));
    browser = await puppeteer.launch({
      // headless: false
    });
  }

  const device = (await import('puppeteer')).devices['iPhone 6'];
  const page = await browser.newPage();
  await page.emulate(device);
  await page.goto('https://auth.riotgames.com/api/v1/authorization');

  // process
  if(req.body.type === 'auth') {
    const initRes = await page.evaluate( initResFunc );
    const authRes = await page.evaluate( authResFunc, req.body.username, req.body.password);

    if(authRes.type === 'response') {
      const uri = authRes.parameters?.uri;

      if(typeof uri !== 'string'){
        return res.status(400).send({ type: 'error', error: 'not found uri', authResponse: authRes });
      }

      const riotTokenObj = GetRiotTokenFromURI(uri);

      res.setHeader('set-cookie', `access_token=${riotTokenObj.access_token}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`);

      return res.status(200).json({
        type: authRes.type,
        initialResponse: initRes,
        authorizationResponse: authRes,
        riotToken: { ...riotTokenObj }
      })

    } else if(authRes.type === 'multifactor') {
      return res.status(200).json({        
        type: authRes.type,
        initialResponse: initRes,
        authorizationResponse: authRes,
        previousSession: await JSON.stringify( (await page.cookies()) )
      })
    } else {
      // error
      return res.status(400).send({ type: 'error', error: 'invalid auth type res!'})
    }

  } else if(req.body.type === 'multifactor') {
    const cookies = await JSON.parse(req.body.previousSession);
    await page.setCookie(...cookies);
    const multiRes = await page.evaluate(multiResFunc, req.body.code);

    const uri = multiRes.response.parameters?.uri;

    if(typeof uri !== 'string'){
      return res.status(400).send({ type: 'error', error: 'not found uri', multiResponse: multiRes });
    }

    const riotTokenObj = GetRiotTokenFromURI(uri);

    res.setHeader('set-cookie', `access_token=${riotTokenObj.access_token}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`);

    return res.status(200).json({
      type: multiRes.type,
      multifactorResponse: multiRes,
      riotToken: { ...riotTokenObj }
    })

  } else {
    return res.status(400).send({ type: 'error', error: 'invalid request type!'});
  }
}

async function initResFunc() {
  const initForm = {
    'client_id': 'play-valorant-web-prod',
    'nonce': '1',
    'redirect_uri': 'https://playvalorant.com/opt_in',
    'response_type': 'token id_token',
  };

  const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(initForm),
  });

  return (await res.json());
}

async function authResFunc(username: string, password: string) {
  const authForm = {
    "type": "auth",
    "username": username,
    "password": password
  };

  const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
    method: 'PUT',  
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(authForm),
  });

  const json = await res.json();
  return json
}

async function multiResFunc(code: string) {
  const multiForm = {
    "type": "multifactor",
    "code": code,
    "rememberDevice": false
  }

  const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(multiForm)
  });

  const json = await res.json();
  return json;
}