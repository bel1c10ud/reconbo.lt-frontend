import style from "@/components/Bleed.module.css";

interface BleedProps {
  children?: any | any[];
}

export default function Bleed(props: BleedProps) {
  return (
    <div className={style["self"]}>
      <div className={style["wrap"]}>{props.children}</div>
    </div>
  );
}
