import { useActData } from "../hooks"
import style from './LatestEpisodeOrAct.module.css';

export default function LatestEpisodeOrAct() {
  const actData = useActData();

  if(actData.isLoading) return <Skeleton />
  else if(actData.error) return <Error error={actData.error} />
  return (
    <div className={style['self']}>
      <div className={style['background']}>
        <img src={actData.data?.background.url?? ''} />
      </div>
      <div className={style['overlay']}>
        <div className={style['info']}>
          <div className={style['subtitle']}>{actData?.data?.subtitle}</div>
          <div className={style['title']}>{actData.data?.title}</div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className={style['self']}>
      <div className={style['background']}></div>
      <div className={style['overlay']}>
        <div className={style['info']}>
          <div className={style['subtitle-skeleton']}></div>
          <div className={style['title-skeleton']}></div>
        </div>
      </div>
    </div>
  )
}

function Error(props: { error?: Error }) {
  return (
    <div className={style['self']}>
      <div className={style['background']}></div>
      <div className={style['overlay']}>
        <div className={style['info']}>
          <div className={style['subtitle']}>{props.error?.stack ?? 'unkown error!'}</div>
          <div className={style['title']}>{props.error?.message ?? 'Error'}</div>
        </div>
      </div>
    </div>
  )
}
