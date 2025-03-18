import React from "react";
import style from "@/components/Button.module.css";

export default function Button(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
  return <button {...{ ...props, className: [style["self"], props.className].join(" ") }}></button>;
}
