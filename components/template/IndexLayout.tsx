import style from './IndexLayout.module.css';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import Intro from '../Intro';
import Footer from '../Footer';
import Head from 'next/head';
import { languageAtom } from './../../recoil';
import { i18nMessage } from '../../i18n';
import Header from '../Header';
import LatestEpisodeOrAct from '../LatestEpisodeOrAct';
import { ThisProjectUnofficial } from '../Callout';
import LatestNews from '../LatestNews';

export default function IndexLayout() {
  const router = useRouter();
  const lang = useRecoilValue(languageAtom);

  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <ThisProjectUnofficial />
        <Intro language={lang?? 'en-US'} />
        <div className={style['anchors']}>
          <div className={style['anchor']} onClick={() => router.push('/store')}>{'> '}{i18nMessage['GO_TO_STORE'][lang ?? 'en-US']}</div>
          <div className={style['anchor']} onClick={() => router.push('/items')}>{'> '}{i18nMessage['LIST_OF_ITEMS'][lang ?? 'en-US']}</div>
        </div>
        <LatestEpisodeOrAct />
        <LatestNews />
      </div>
      <Footer />
    </>
  )
}
