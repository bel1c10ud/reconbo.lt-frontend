import { RefObject, useState, useRef, useEffect, useCallback, SyntheticEvent, useMemo } from 'react'
import style from './Slider.module.css'
import { useResizeObserver } from '@react-hookz/web';

interface PropsType {
  children?: JSX.Element[],
  skeleton?: JSX.Element,
  hint?: boolean,
  auto?: boolean,
}

export default function Slider(props: PropsType) {
  const pagesRef = useRef<HTMLDivElement>(null);
  const { skeleton: Skeleton } = props;

  useEffect(() => {
    if(props.auto) {
      const cb = () => {
        const { current: pageEl } = pagesRef;

        if(pageEl) {
          const length = pageEl.children.length;
          const currentX = pageEl.scrollLeft;
          const startX = pageEl.children[0].getBoundingClientRect().left;
          const positions = Array.from(pageEl.children).map(el => el.getBoundingClientRect().left - startX);
          const currentIndex = positions.map(x => Math.abs(currentX - x)).reduce((pre, cur, i, arr) => {
            if(arr[pre] > cur) return i;
            else return pre;
          }, 0);

          if(currentIndex + 1 < length) { pageEl.scrollTo({ left: positions[currentIndex+1], behavior:'smooth'}); }
          else { pageEl.scrollTo({ left: positions[0], behavior:'smooth'}); }
        }
      }
      const timer = setInterval(cb, 10000);
      return () => { clearInterval(timer); }
    }
  }, [props.auto]);

  return (
    <div className={style['self']} {...{ 'data-hint': props.hint ? 'true' : 'false'}}>
      <div className={style['pages']} ref={pagesRef}>
{ props.children?.map((el, i) => (
        <div className={style['page']} key={i}>{el}</div>
))}
{ (!props.children || props.children?.length < 1) && Skeleton ? (
        <div className={style['page']} key={0}>
          {Skeleton}
        </div>
) : null }
      </div>
      <ScrollBar contentRef={pagesRef} />
    </div>
  )
}

export function ScrollBar(props: {
  contentRef: RefObject<HTMLDivElement>
}) {
  const scrollTrackRef = useRef<HTMLDivElement>(null); 
  const scrollThumbRef = useRef<HTMLDivElement>(null); 
  const [thumbWidth, setThumbWidth] = useState<number>();
  const [thumbLeft, setThumbLeft] = useState<number>();
  const [initialScrollLeft, setInitialScrollLeft] = useState<number>(0);
  const [dragStartPosition, setDragStartPosition] = useState<number>();
  const [isDragging, setIsDragging] = useState<Boolean>(false);

 const resizeHandler = useCallback((e) => {
    if(e.target) {
      const contentScrollWidth = e.target.scrollWidth;
      const contentWidth  = e.target.clientWidth;
      const thumbWidth = contentWidth / contentScrollWidth;
      setThumbWidth(thumbWidth * 100);
    }
  }, [setThumbWidth]);

  const scrollHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if(props.contentRef.current) {
      const contentScrollWidth = props.contentRef.current.scrollWidth;
      const contentScrollLeft = props.contentRef.current.scrollLeft;
      const thumbLeft = contentScrollLeft / contentScrollWidth;
      setThumbLeft(thumbLeft * 100);
    }
  }, [props.contentRef]);

  const trackClickHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { current: thumbEl } = scrollThumbRef;
    const { current: trackEl } = scrollTrackRef;
    const { current: contentEl } = props.contentRef;

    if(thumbEl && trackEl && contentEl) {
      const clickX = e.clientX;
      const relativeX = clickX - e.target.getBoundingClientRect().left;
      const ratio = (relativeX - (thumbEl.clientWidth / 2)) / trackEl.clientWidth;
      contentEl.scrollTo({
        left: ratio * contentEl.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [props.contentRef]);

  const thumbDrageStartHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragStartPosition(e.clientX); 
    if(props.contentRef.current) {
      setInitialScrollLeft(props.contentRef.current.scrollLeft);
    }
    setIsDragging(true);
  }, [props.contentRef]);

  const thumbDraggingHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const { current: thumbEl } = scrollThumbRef;
    const { current: trackEl } = scrollTrackRef;
    const { current: contentEl } = props.contentRef;

    if(!thumbEl || !trackEl || !contentEl) return ;
    
    if(isDragging && dragStartPosition) {
      const dragSize = e.clientX - dragStartPosition;
      const leftSize = dragSize * (contentEl.offsetWidth / thumbEl.clientWidth);
      const newScrollLeft = initialScrollLeft + leftSize
      contentEl.scrollTo({left: newScrollLeft, behavior: 'smooth'});
    }
  }, [props.contentRef, isDragging, dragStartPosition, initialScrollLeft]);
  
  const thumbDragEndHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if(isDragging) { 
      setIsDragging(false);
    }
  }, [isDragging]);

  useResizeObserver(props.contentRef, resizeHandler);

  useEffect(() => {
    if(props.contentRef.current) {
      props.contentRef.current.addEventListener('scroll', scrollHandler);
      return () => props.contentRef.current?.removeEventListener('scroll', scrollHandler);
    }
  }, [props.contentRef, scrollHandler]);

  useEffect(() => {
    document.addEventListener('mousemove', thumbDraggingHandler);
    document.addEventListener('mouseup', thumbDragEndHandler);
    document.addEventListener('mouseleave', thumbDragEndHandler);
    return () => {
      document.removeEventListener('mousemove', thumbDraggingHandler);
      document.removeEventListener('mouseup', thumbDragEndHandler);
      document.removeEventListener('mouseleave', thumbDragEndHandler);
    };
  }, [thumbDraggingHandler, thumbDragEndHandler]);

  return (
    <div className={style['scroll-bar']}>
      <div className={style['scroll-bar-track']} 
      ref={scrollTrackRef}
      onClick={trackClickHandler}>
        <div className={style['scroll-bar-track-line']}></div>
      </div>
      <div className={style['scroll-bar-thumb']} 
      ref={scrollThumbRef}
      style={{
        'width': `${thumbWidth}%`, 
        'left': `${thumbLeft}%`
      }}
      onMouseDown={thumbDrageStartHandler}
      >
        <div className={style['scroll-bar-thumb-handle']}></div>
      </div>
    </div>
  )
}