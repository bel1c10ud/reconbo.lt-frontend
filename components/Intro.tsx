import style from './Intro.module.css';
import { i18nMessage } from '../i18n';
import { LanguageCode } from '../type';

export default function Intro(props: {
  language: LanguageCode
}) {
  return (
    <div className={style.self}>
      <div className={style.headline}>Reconbo.lt</div>
      <div className={style.description}>{i18nMessage['YOU_CAN_CHECK_STORE'][props.language]}</div>
    </div>
  )
}