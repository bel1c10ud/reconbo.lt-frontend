import { NEXT_DATA } from 'next/dist/shared/lib/utils';
import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'
import { GA_TRACKING_ID } from '../gtag'

export default function Document(props: DocumentProps) {

  return (
    <Html>
      <Head>
{ props['__NEXT_DATA__']['buildId'] !== 'development' && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
          <script dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
  
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `
          }} />
        </>
)}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}