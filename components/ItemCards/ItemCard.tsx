import style from './ItemCard.module.css';

export function Discount(props: { percent?: number }) {
  if(props.percent !== undefined) {
    return (
      <div className={style['discount']}>
        <div className={style['discount-percent']}>-{props.percent}% </div>
      </div>
    )
  } else {
    return null
  }
}

export function Cost(props: {
  cost?: number,
  discountCost?: number,
  discountedPrice?: number
}) {

  let isDiscount: boolean = false;
  let discountedCost: undefined|number = undefined;

  if(props.cost !== undefined) {
    if(props.discountCost !== undefined && props.discountCost > 0) {
      isDiscount = true;
      discountedCost = props.cost - props.discountCost;
    } else if(props.discountedPrice !== undefined && (props.cost - props.discountedPrice) > 0 ) {
      isDiscount = true;
      discountedCost = props.discountedPrice;
    }
  } else {
    return (
      <div>
        <span>unkown</span>
      </div>
    )
  }

  if(isDiscount) {
    return (
      <div>
        <span>
          <del>{props.cost}</del>
          <span> </span>
          <span>{discountedCost} VP</span> 
        </span>
      </div>
    )
  } else {
    return (
      <div>
        <span>{props.cost} VP</span>
      </div>
    )
  }
}