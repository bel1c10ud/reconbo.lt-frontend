import App from 'next/app'
import { useEffect } from 'react';
import { RecoilRoot} from 'recoil';

import '../styles/globals.css'
import { cookieStrParser } from '../utility';

import type { AppContext, AppProps } from 'next/app'
import type { CookieType } from './../type';
import InitManager from '../components/InitManager';

interface CustomAppProps extends AppProps{ 
  cookies: CookieType[]
}

function MyApp({ Component, pageProps, cookies }: CustomAppProps) {
  return (
    <RecoilRoot>
      <InitManager cookies={cookies} />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}


MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const cookies = appContext.ctx.req?.headers?.cookie ? 
    cookieStrParser(appContext.ctx.req?.headers?.cookie) : [];

  return { 
    ...appProps, 
    cookies: cookies
  }
}

export default MyApp
