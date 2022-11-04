import style from './ItemCardSkeleton.module.css';

export default function ItemCardSkeleton() {
  return (
    <div className={style['self']}>
      <div className={style['ratio']}>
        <div className={style['content']}>
          <div className={style['image']}>
            
          </div>
          <div className={style['overlay']}>
            <div className={style['info']}>
              <div className={style['name']}></div>
              <div className={style['value']}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}