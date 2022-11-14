import { prependOnceListener } from 'process';
import React, { useState, useEffect } from 'react';
import style from './Select.module.css';

interface SelectOptionType {
  value: string,
  label: string
}

export default function Select(props: {
  name?: string,
  options: SelectOptionType[],
  value?: string,
  defaultValue?: string,
  placeholder?: string,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>,
  disabled?: boolean,
  required?: boolean
}) {
  const [value, setValue] = useState<string>(props.value?.trim() ?? props.defaultValue?.trim() ?? '');

  useEffect(() => {
    if(props.value) { setValue(props.value.trim()); } 
    else { setValue(''); }
  }, [props.value])

  function updateValue(e: React.ChangeEvent<HTMLSelectElement>) {
    setValue(e.currentTarget.value ?? '');
    if(props.onChange) {
      props.onChange(e);
    }
  }

  return (
    <fieldset className={style['self']}>
      <select 
      className={style['select-tag']} 
      name={props.name}
      value={value}
      onChange={updateValue}
      { ...( value.length > 0 ? { 'data-selected': '' }: { 'data-not-selected': '' } ) }
      disabled={props.disabled}
      required={props.required}
      >
        <Placeholder label={props.placeholder} />
        <Options data={props.options} />
      </select>
      <div className={style['overlay']}>
        <div className={style['label']}>{props.placeholder}</div>
        <div className={style['placeholder']}>{props.placeholder}</div>
        <div className={style['arrow']}>▾</div>
      </div>
    </fieldset>
  )
}

function Placeholder(props: { label?: string }) {
  if(props.label) return <option value='' disabled>{props.label}</option>
  else return <option value='' disabled>-</option>
}

function Options(props: { data: SelectOptionType[] }) {
  return (
    <>
{props.data.map(option => (
        <option 
        key={option.value} 
        value={option.value}
        >
          {option.label}
        </option>
))}
    </>
  )
}