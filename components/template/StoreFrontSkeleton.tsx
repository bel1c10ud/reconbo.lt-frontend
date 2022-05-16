import style from './StoreFrontSkeleton.module.css';

export default function StoreFrontSkeleton() {
  return (
    <div className={style['self']}>
      <div className={style['headline']}>
        <div className={style['market-title']}></div>
        <div className={style['countdown']}></div>
      </div>
      <div className={style['skins']}>
        <div className={style['skin']}><div className={style['ratio']}><div className={style['info']}></div></div></div>
        <div className={style['skin']}><div className={style['ratio']}><div className={style['info']}></div></div></div>
        <div className={style['skin']}><div className={style['ratio']}><div className={style['info']}></div></div></div>
        <div className={style['skin']}><div className={style['ratio']}><div className={style['info']}></div></div></div>
      </div>
    </div>
  )
}