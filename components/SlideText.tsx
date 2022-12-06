import { useState, useEffect, useMemo, useRef } from 'react';
import style from './SlideText.module.css';

interface SlideTextProps {
  children: (string|JSX.Element|undefined)|(string|JSX.Element|undefined)[]
}

export default function SlideText(props: SlideTextProps) {
  const wrapEl = useRef<HTMLSpanElement>(null);
  const textEl = useRef<HTMLSpanElement>(null);
  const [resize, setResize] = useState(Date.now());

  const slideSize = useMemo(() => {
    if(wrapEl.current?.offsetWidth && textEl.current?.offsetWidth) {
      if(wrapEl.current.offsetWidth >= textEl.current.offsetWidth) {
        return 0
      } else {
        return wrapEl.current.offsetWidth * Math.floor(textEl.current.offsetWidth / wrapEl.current.offsetWidth);
      }
    } else {
      return undefined
    }
  }, [props.children, wrapEl.current?.offsetWidth, textEl.current?.offsetWidth, resize])

  useEffect(() => { // inner style
    if(textEl.current && wrapEl.current) {
      if(slideSize) {
        textEl.current.style.marginLeft = `-${slideSize}px`;
        textEl.current.style.animationDuration = (6000 / wrapEl.current.offsetWidth) * slideSize + 'ms';
        textEl.current.style.animationDelay = '1ms';
      } else {
        textEl.current.style.marginLeft = `0`;
      }
    }
  }, [slideSize])

  useEffect(() => { // resize detect
    let timer: null|NodeJS.Timer;
    const callback = () => {
      if(!timer) {
        timer = setTimeout(() => { 
          setResize(Date.now());
          timer = null 
        }, 500)
      }
    };
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback)
  }, [])

  return (
    <span className={style['self']} ref={wrapEl}>
      <span className={style['text']} data-slide={slideSize ? 'true':'false'} ref={textEl}>
        {props.children}
      </span>
    </span>
  )
}