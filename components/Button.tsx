import { MouseEventHandler } from 'react';

import style from './Button.module.css';

export default function Button(props: {
  children?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button className={style.self} onClick={props.onClick}>
      {props.children}
    </button>
  )
}