import style from './Intro.module.css';

export default function Intro() {
  return (
    <div className={style.self}>
      <div className={style.headline}>VALORANT<br />STORE</div>
      <div className={style.description}>You can check the store on the webpage without launching the game.</div>
    </div>
  )
}