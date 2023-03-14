import { useEffect, useState } from "react";
import style from './Slider.module.css';

interface SliderProps {
  children?: JSX.Element[]
  skelethon?: JSX.Element
}

export default function Slider(props: SliderProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState( props.children?.length ?? 0 );

  useEffect(() => {
    setLength(props.children?.length ?? 0);
  }, [props.children])

  useEffect(() => {
    if(index >= length) {
      setIndex(0);
    } else if(index < 0) {
      setIndex(length - 1);
    }
  }, [index, length])

  function updateIndex(type: 'prev'|'next', length: number) {
    if(length <= 1) {
      return null
    } else if(type==='prev') {
      if(index === 0) setIndex(length - 1);
      else setIndex(index-1);
    } else if(type==='next') {
      if(index === (length-1)) setIndex(0);
      else setIndex(index+1);
    }
  }

  return (
    <div className={style['self']}>
      <div>
{ props.children?.length ? props.children[index] : props.skelethon }
      </div>
      <div className={style['buttons']}>
        <button className={style['prev-button']} onClick={() => updateIndex('prev', length)}>
          <img src='/svg/before.svg' alt='before button' />
        </button>
        <button className={style['index']}>{index+1} <span className={style['divider']}>/</span> {length}</button>
        <button className={style['next-button']} onClick={() => updateIndex('next', length)}>
          <img src='/svg/next.svg' alt='next button' />
        </button>
      </div>
    </div>
  )
}