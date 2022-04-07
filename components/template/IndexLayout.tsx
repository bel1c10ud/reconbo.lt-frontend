import style from './IndexLayout.module.css';

import Intro from '../Intro';
import Button from '../Button';

export default function IndexLayout() {
  return (
    <div className={style.self}>
      <Intro />
      <Button>로그인</Button>
    </div>
  )
}