import style from "@/components/ItemCards/ItemCardError.module.css";

interface ItemCardErrorProps {
  error?: Error;
}

export default function ItemCardError(props: ItemCardErrorProps) {
  return (
    <div className={style["self"]}>
      <div className={style["ratio"]}>
        <div className={style["content"]}>
          <div className={style["stack"]}>
            <div className={style["stack-title"]}>ErrorStack</div>
            <div className={style["stack-body"]}>
              {props.error?.stack ? props.error?.stack : "..."}
            </div>
          </div>
          <div className={style["error-info"]}>
            <div className={style["error-message"]}>
              {props.error?.message ? props.error.message : "Unknown Error"}
            </div>
            <div className={style["error-name"]}>
              {props.error?.name ? props.error?.name : "Unknown Error"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
