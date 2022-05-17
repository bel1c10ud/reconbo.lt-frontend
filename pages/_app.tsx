import App from 'next/app'
import { useRouter } from 'next/router';
import { RecoilRoot} from 'recoil';

import '../styles/globals.css'
import { cookieStrParser } from '../utility';

import type { AppContext, AppProps } from 'next/app'
import type { CookieType } from './../type';
import InitManager from '../components/InitManager';
import PopupLayer from '../components/PopupLayer';
import { useEffect } from 'react';
import * as gtag from './../gtag';

interface CustomAppProps extends AppProps{ 
  cookies: CookieType[]
}

function MyApp({ Component, pageProps, cookies }: CustomAppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <RecoilRoot>
      <InitManager cookies={cookies} />
      <Component {...pageProps} />
      <PopupLayer />
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
