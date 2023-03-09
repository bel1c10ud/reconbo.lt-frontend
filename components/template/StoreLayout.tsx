import { ClientAPI } from '../../type';
import FeaturedBundle from '../FeaturedBundle';
import SkinsPanel from '../SkinsPanel';
import NightMarket from '../NightMarket';
import style from './StoreLayout.module.css';
import LanguageSelect from '../LanguageSelect';
import LoginButton from '../LoginButton';
import Footer from '../Footer';
import IsWrongStoreInfomation from '../IsWrongStoreInfomation';
import Head from 'next/head';
import Hr from '../Hr';
import Header from '../Header';

interface StoreLayoutProps {
  data: ClientAPI.Store
}

export default function StoreLayout(props: StoreLayoutProps) {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Store</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <FeaturedBundle data={props.data.FeaturedBundle} />
{ props.data.BonusStore && props.data.BonusStore.BonusStoreOffers?.length !== 0 && (
      <>
        <Hr />
        <NightMarket data={props.data.BonusStore.BonusStoreOffers} />
      </>
)}
        <Hr />
        <SkinsPanel data={props.data.SkinsPanelLayout} />
        <IsWrongStoreInfomation />
        <Footer />
      </div>
    </>
  )
}