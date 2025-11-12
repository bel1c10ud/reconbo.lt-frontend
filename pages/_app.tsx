import App from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { AppContext, AppProps } from "next/app";
import { gtag } from "@/components/GoogleAnalytics";
import Overlay from "@/components/Overlay";
import useInitializationTokensFromCookie from "@/hooks/useInitializationTokensFromCookie";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useInitializationTokensFromCookie();

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Component {...pageProps} />
      <Overlay />
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
