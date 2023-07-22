import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'
import GoogleAnalystics from '../components/GoogleAnalytics'

export default function Document(props: DocumentProps) {
  return (
    <Html>
      <Head>
{ props["__NEXT_DATA__"]["buildId"] !== "development" ? (
        <GoogleAnalystics />
) : null }
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}