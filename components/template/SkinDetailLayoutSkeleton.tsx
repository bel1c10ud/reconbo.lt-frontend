import style from './SkinDetailLayoutSkeleton.module.css';
import Head from "next/head";
import Hr from '../Hr';
import Header from '../Header';

export default function SkinDetailLayoutSkeleton() {
  return (
    <>      
      <Head>
        <title>Reconbo.lt | Skin Detail</title>
      </Head>
      <Header />
      <div className={style['self']}>
        <div className={style['title']}>SKIN DETAIL</div>
        <div className={style['headline']}>
          <div className={style['content-tier']}></div>
          <div className={style['display-name']}></div>
        </div>
        <div className={style['preview']}></div>
        <Hr />
        <div className={style['option']}>
          <div className={style['option-label']}></div>
          <div className={style['option-item']}></div>
        </div>
      </div>
    </>
  )
}