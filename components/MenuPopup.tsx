import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { isPopupAtom } from '../recoil';
import style from './MenuPopup.module.css';

export default function MenuPopup() {
  const router = useRouter();
  const [isPopup, setIsPopup] = useRecoilState(isPopupAtom);

  return (
    <div className={style['self']}>
      <div className={style['wrap']}>
        <div className={style['header']}>
          <h1 className={style['title']}>Menu</h1>
          <button className={style['close-button']}
          onClick={() => setIsPopup(false)}
          >
            <img src='/close.svg' alt='close' />
          </button>
        </div>
        <ul className={style['pages']}>
          <li onClick={() => {router.push('/');setIsPopup(false)}}>Home</li>
          <li onClick={() => {router.push('/store');setIsPopup(false)}}>Store</li>
          <li onClick={() => {router.push('/items');setIsPopup(false)}}>Items</li>
        </ul>
        <ul className={style['ref']}>
          <li onClick={() => {router.push('/about');setIsPopup(false)}}>About</li>
          <li onClick={() => {router.push('');setIsPopup(false)}}>Github</li>
        </ul>
      </div>
    </div>
  )
}