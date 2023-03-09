import style from './IndexLayout.module.css';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../hooks';
import Intro from '../Intro';
import LanguageSelect from '../LanguageSelect';
import Footer from '../Footer';
import Head from 'next/head';
import { languageAtom } from './../../recoil';
import LoginButton from '../LoginButton';
import Hr from '../Hr';
import { RequiredLoginCallout } from '../Callout';
import { i18nMessage } from '../../i18n';
import Header from '../Header';

export default function IndexLayout() {
  const router = useRouter();
  const auth = useAuth();
  const lang = useRecoilValue(languageAtom);

  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <Intro language={lang?? 'en-US'} />
{ auth.isInit && auth.isValid ? (
      <>
        <div className={style['anchors']}>
          <div className={style['anchor']} onClick={() => router.push('/store')}>{'> '}{i18nMessage['GO_TO_STORE'][lang ?? 'en-US']}</div>
          <div className={style['anchor']} onClick={() => router.push('/items')}>{'> '}{i18nMessage['LIST_OF_ITEMS'][lang ?? 'en-US']}</div>
        </div>

      </>
        ) : (
      <>
        <RequiredLoginCallout />
      </>
)}
        <Footer />
      </div>
    </>
  )
}
