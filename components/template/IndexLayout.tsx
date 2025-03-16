import style from './IndexLayout.module.css';
import Footer from '../Footer';
import Head from 'next/head';
import Header from '../Header';
import LatestEpisodeOrAct from '../LatestEpisodeOrAct';
import { ThisProjectUnofficial } from '../Callout';
import LatestNews from '../LatestNews';
import Hero from '../Hero';
import Features from '../Features';

export default function IndexLayout() {
  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <div className={style['intro']}>
          <ThisProjectUnofficial />
          <Hero />
        </div>
        <Features />
      </div>
      <Footer />
    </>
  )
}
