import { useActData } from "../hooks"
import { ValorantOfficialWeb } from "../type";
import style from './LatestEpisodeOrAct.module.css';

export default function LatestEpisodeOrAct() {
  const actData = useActData();

  return (
    <div className={style['self']}>
      <h1 className={style['title']}>LASTEST SEASON</h1>
{ actData.isLoading ? (
      <Skeleton />
) : null }
{ actData.error ? (
      <Error error={actData.error} />
) : null }
{ actData.data ? (
      <Layout data={actData.data as ValorantOfficialWeb.LatestEpisodeOrAct} />
) : null }
    </div>
  )
}

function Layout(props: {
  data: ValorantOfficialWeb.LatestEpisodeOrAct
}) {
  return (
    <div className={style['banner']}>
      <div className={style['background']}>
        <img src={props.data?.background.url?? ''} />
      </div>
      <div className={style['overlay']}>
        <div className={style['info']}>
          <div className={style['subtitle']}>{props.data?.subtitle}</div>
          <div className={style['title']}>{props.data?.title}</div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className={style['banner']}>
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
    <div className={style['banner']}>
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
