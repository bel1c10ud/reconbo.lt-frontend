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
  placeholder?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
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
    <select className={style['self']} 
    name={props.name}
    value={value}
    onChange={updateValue}
    { ...( value.length > 0 ? { 'data-selected': '' }: { 'data-not-selected': '' } ) }
    >
      <option 
      className={style['placeholder']} 
      value='' 
      disabled
      >
        {props.placeholder ?? props.name ?? '-'}
      </option>
{props.options.map(option => (
      <option 
      key={option.value} 
      value={option.value}
      >
        {option.label}
      </option>
))}
    </select>
  )
}