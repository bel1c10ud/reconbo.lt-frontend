import { useState } from "react";
import type { ChangeEventHandler, ChangeEvent } from "react";
import style from "@/components/TextInput.module.css";

interface TextInputProps {
  type: "text" | "password";
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export default function TextInput(props: TextInputProps) {
  const [value, setValue] = useState(props.value ?? "");

  function updateValue(e: ChangeEvent<HTMLInputElement>) {
    if (props.onChange) {
      props.onChange(e);
    }
    setValue(e.target.value);
  }

  return (
    <fieldset className={style["self"]}>
      <input
        className={style["input-tag"]}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={value}
        onChange={updateValue}
        disabled={props.disabled}
      />
      <div className={style["overlay"]}>
        <div className={style["label"]}>{props.placeholder}</div>
        <div className={style["placeholder"]}>{props.placeholder}</div>
      </div>
    </fieldset>
  );
}
