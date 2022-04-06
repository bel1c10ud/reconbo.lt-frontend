import style from './Intro.module.css';

export default function Intro() {
  return (
    <div className={style.self}>
      <div className={style.headline}>발로란트<br />오늘의 상점</div>
      <div className={style.description}>게임을 직접 실행하지 않고 웹페이지를 통해 일일상점을 확인할 수 있습니다.</div>
    </div>
  )
}