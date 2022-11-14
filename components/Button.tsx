import { useMemo, MouseEventHandler } from 'react';

import style from './Button.module.css';

export default function Button(props: {
  children?: any|any[],
  className?: string,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean,
  primary?: boolean,
  secondary?: boolean,
  large?: boolean,
  medium?: boolean,
  small?: boolean,
}) {
  const classArray = useMemo(() => {
    let arr = [style.self];
    const propsClassName = props.className ? props.className.trim().split(' ') : [];
    if(props.primary) arr = [ ...arr, style.primary];
    if(props.secondary) arr = [ ...arr, style.secondary];
    if(props.large) arr = [ ...arr, style.large];
    if(props.medium) arr = [ ...arr, style.medium];
    if(props.small) arr = [ ...arr, style.small];
    return [ ...arr, ...propsClassName ]
  }, [props]);
  
  return (
    <button className={classArray.join(' ')} 
    onClick={props.onClick}
    disabled={props.disabled}
    >
      <div className={style['overlay']}></div>
      <div className={style['label']}>{props.children}</div>
    </button>
  )
}