import { ReactElement } from 'react';
import style from './Callout.module.css';

export default function Callout(props: {
  children: ReactElement|ReactElement[]
}) {
  return (
    <div className={style['self']}>
      {props.children}
    </div>
  )
}

export function CalloutTitle(props: {
  children?: string|string[]
}) {
  return (
    <div className={style['callout-title']}>{props.children}</div>
  )
}

export function CalloutBody(props: {
  children?: string|string[]
}) {
  return (
    <div className={style['callout-body']}>{props.children}</div>
  )
}