import type { NextApiRequest, NextApiResponse } from 'next';
import { GetRiotTokenFromURI } from '../../utility';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // body check
  if(req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).send({ type: 'error', message: 'Invalid content-type header!'})
  }
  if(typeof req.body !== 'object') {
    return res.status(400).send({ type: 'error', message: 'Invalid request body!'})
  }
  if(req.body.type !== 'auth' && req.body.type !== 'multifactor') {
    return res.status(400).send({ type: 'error', message: 'Invalid reqeust type!'})
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

    if(authRes.status !== 200) {
      if(authRes.status === 429 && authRes.headers['retry-after']) {
        res.setHeader('Retry-After', authRes.headers['retry-after']);
        return res.status(429).send({ 
          type: 'error', 
          message: `Authorization API Error: ${authRes.data.error ?? authRes.data.message ?? 'unkown'}`, 
          authorization_response: authRes.data 
        })
      } else {
        return res.status(authRes.status).send({ 
          type: 'error', 
          message: `Authorization API Error: ${authRes.data.error ?? authRes.data.message ?? 'unkown'}`, 
          authorization_response: authRes.data 
        });
      }
    }

    if(authRes.data.type === 'response') {
      const uri = authRes.data.response?.parameters?.uri;

      if(typeof uri !== 'string'){
        return res.status(400).send({ 
          type: 'error', 
          message: 'Authorization API Error: Not found token URI', 
          authorization_response: authRes.data 
        });
      }

      const riotTokenObj = GetRiotTokenFromURI(uri);
      const expiryTimestamp = new Date(riotTokenObj.requestedDate as string).getTime() + (Number(riotTokenObj.expires_in) * 1000)

      res.setHeader('set-cookie', [`access_token=${riotTokenObj.access_token}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`, `expiry_timestamp=${expiryTimestamp}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`]);

      return res.status(200).json({
        type: authRes.data.type,
        initialization_response: initRes.data,
        authorization_response: authRes.data,
        authObj: {
          access_token: riotTokenObj.access_token,
          expiry_timestamp: expiryTimestamp
        }
      })

    } else if(authRes.data.type === 'multifactor') {
      return res.status(200).json({        
        type: authRes.data.type,
        initialization_response: initRes.data,
        authorization_response: authRes.data,
        previousSession: await JSON.stringify( (await page.cookies()) )
      })
    } else {
      // error
      return res.status(400).send({ type: 'error', message: 'Authorization API Error: Invalid response type'})
    }

  } else if(req.body.type === 'multifactor') {
    const cookies = await JSON.parse(req.body.previousSession);
    await page.setCookie(...cookies);
    const multiRes = await page.evaluate(multiResFunc, req.body.code);

    if(multiRes.status !== 200) {
      if(multiRes.status === 429 && multiRes.headers['retry-after']) {
        res.setHeader('Retry-After', multiRes.headers['retry-after']);
        return res.status(429).send({ 
          type: 'error', 
          message: `Multifactor API Error: ${multiRes.data.error ?? multiRes.data.message ?? 'unkown'}`, 
          multifactor_response: multiRes.data 
        })
      } else {
        return res.status(multiRes.status).send({ 
          type: 'error', 
          message: `Multifactor API Error: ${multiRes.data.error ?? multiRes.data.message ?? 'unkown'}`, 
          multifactor_response: multiRes.data 
        });
      }
    }

    const uri = multiRes.data.response?.parameters?.uri;

    if(typeof uri !== 'string') {
      return res.status(400).send({ 
        type: 'error', 
        message: 'Multifactor API Error: Not found token URI', 
        multifactor_response: multiRes.data 
      });
    }

    const riotTokenObj = GetRiotTokenFromURI(uri);
    const expiryTimestamp = new Date(riotTokenObj.requestedDate as string).getTime() + (Number(riotTokenObj.expires_in) * 1000)

    res.setHeader('set-cookie', [`access_token=${riotTokenObj.access_token}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`, `expiry_timestamp=${expiryTimestamp}; Path=/; Max-Age=${riotTokenObj.expires_in}; HttpOnly; SameSite=Strict;`]);

    return res.status(200).json({
      type: multiRes.data.type,
      multifactor_response: multiRes.data,
      authObj: {
        access_token: riotTokenObj.access_token,
        expiry_timestamp: expiryTimestamp
      }
    })

  } else {
    return res.status(400).send({ type: 'error', message: 'Invalid reqeust type!'});
  }
}

async function initResFunc() {
  const initForm = {
    'client_id': 'play-valorant-web-prod',
    'nonce': '1',
    'redirect_uri': 'https://playvalorant.com/opt_in',
    'response_type': 'token id_token',
  };

  try {
    const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(initForm),
    });
  
    let headers: any = Array.from(res.headers.entries()).reduce((pre, cur) => {
      const [key, ...values] = cur;
      return { 
        ...pre,
        [key.toLowerCase()]: values 
      }
    }, {})
  
    const json = await res.json();
  
    return {
      status: res.status,
      headers: headers,
      data: json
    }
  } catch(error) {
    return {
      status: 500,
      Headers: {},
      data: { 
        type: 'error',
        error: 'Initialization Error: request fail', 
        message: 'Initialization Error: request fail' 
      },
      error: error
    }
  }


}

async function authResFunc(username: string, password: string) {
  const authForm = {
    "type": "auth",
    "username": username,
    "password": password
  };

  try {
    const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
      method: 'PUT',  
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(authForm),
    });

    let headers: any = Array.from(res.headers.entries()).reduce((pre, cur) => {
      const [key, ...values] = cur;
      return { 
        ...pre,
        [key.toLowerCase()]: values 
      }
    }, {})

    const json = await res.json();

    return {
      status: res.status,
      headers: headers,
      data: json
    }
  } catch(error) {
    return {
      status: 500,
      Headers: {},
      data: { 
        type: 'error',
        error: 'Authorization Error: request fail', 
        message: 'Authorization Error: request fail' 
      },
      error: error
    }
  }

  
}

async function multiResFunc(code: string) {
  const multiForm = {
    "type": "multifactor",
    "code": code,
    "rememberDevice": false
  }

  try {
    const res = await fetch('https://auth.riotgames.com/api/v1/authorization', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(multiForm)
      });
    
      let headers: any = Array.from(res.headers.entries()).reduce((pre, cur) => {
        const [key, ...values] = cur;
        return { 
          ...pre,
          [key.toLowerCase()]: values 
        }
      }, {})
    
      const json = await res.json();
    
      return {
        status: res.status,
        headers: headers,
        data: json
      }
  } catch(error) {
    return {
      status: 500,
      Headers: {},
      data: { 
        type: 'error',
        error: 'Multifcator Error: request fail', 
        message: 'Multifcator Error: request fail' 
      },
      error: error
    }
  }

  
}