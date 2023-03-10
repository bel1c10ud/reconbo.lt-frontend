import style from './Intro.module.css';
import { i18nMessage } from '../i18n';
import { LanguageCode } from '../type';
import Link from 'next/link';

export default function Intro(props: {
  language: LanguageCode
}) {
  return (
    <div className={style.self}>
      <div className={style.headline}>Introduce</div>
      <div className={style.description}>{i18nMessage['INTRODUCTION_RECONBOLT'][props.language]}</div>
    </div>
  )
}