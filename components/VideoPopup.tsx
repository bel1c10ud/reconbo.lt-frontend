import style from './VideoPopup.module.css';

export default function VideoPopup(props : {
  src?: string
}) {
  return (
    <video className={style['self']} src={props.src} controls onClick={(e) => e.stopPropagation()} />
  )
}