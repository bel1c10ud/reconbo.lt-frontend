import { ClientAPI } from '../../type';
import FeaturedBundle from '../FeaturedBundle';
import SkinsPanel from '../SkinsPanel';
import NightMarket from '../NightMarket';
import style from './StoreLayout.module.css';
import Footer from '../Footer';
import { IsWrongStoreInfomation } from '../Callout';
import Head from 'next/head';
import Hr from '../Hr';
import Header from '../Header';
import AccessoryStore from '../AccessoryStore';

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
        <Hr />
        <AccessoryStore data={props.data.AccessoryStore} />
        <IsWrongStoreInfomation />
      </div>
      <Footer />
    </>
  )
}