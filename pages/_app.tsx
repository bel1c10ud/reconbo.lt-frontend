import '../styles/globals.css'
import App from 'next/app'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RecoilRoot} from 'recoil';
import type { AppContext, AppProps } from 'next/app'
import InitManager from '../components/InitManager';
import Overlay from '../components/Overlay';
import * as gtag from './../gtag';

function MyApp({ Component, pageProps }: AppProps) {
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
      <InitManager />
      <Component {...pageProps} />
      <Overlay />
    </RecoilRoot>
  )
}


MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps }
}

export default MyApp
