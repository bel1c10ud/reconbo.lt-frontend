import style from './BundleDetailLayoutSkeleton.module.css';
import Head from "next/head";
import Hr from '../Hr';
import Header from '../Header';

export default function BundleDetailLayoutSkeleton() {
  return (
    <>
      <Head>
        <title>Reconbo.lt | Bundle Detail</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <div className={style['title']}>BUNDLE DETAIL</div>
        <div className={style['headline']}></div>
        <div className={style['preview']}>
          <div className={style['preview-image']}></div>
          <div className={style['preview-description']}></div>
        </div>
        <Hr />
        <div className={style['bundle-info']}>
          <div className={style['bundle-info-label']}></div>
          <div className={style['bundle-info-item']}></div>
        </div>
      </div>
    </>
  )
}