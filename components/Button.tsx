import style from './Button.module.css';
import React from "react";

export default function Button(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button {...{ ...props, className: [style['self'], props.className].join(' ') }}></button>
  )
}