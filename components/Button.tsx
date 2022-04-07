import { MouseEventHandler } from 'react';

import style from './Button.module.css';

export default function Button(props: {
  children?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean
}) {
  return (
    <button className={style.self} 
    onClick={props.onClick}
    disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}