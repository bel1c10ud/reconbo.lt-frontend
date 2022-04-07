import { ChangeEventHandler } from 'react';
import style from './Input.module.css';

export default function Input(props: {
  type: 'text'|'password',
  name?: string,
  placeholder?: string,
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>,
  disabled?: boolean
}) {
  return (
    <input className={style.self} 
    type={props.type} 
    name={props.name} 
    placeholder={props.placeholder} 
    value={props.value}
    onChange={props.onChange}
    disabled={props.disabled}
    />
  )
}