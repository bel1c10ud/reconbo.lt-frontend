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
            <img src='/svg/close.svg' alt='close' />
          </button>
        </div>
        <ul className={style['pages']}>
          <li>
            <span className={style['page']} onClick={() => {router.push('/');setIsPopup(false)}}>
              <img className={style['icon']} src='/svg/home.svg' />
              <span>Home</span>
            </span>
          </li>
          <li>
            <span className={style['page']} onClick={() => {router.push('/store');setIsPopup(false)}}>
              <img className={style['icon']} src='/svg/cart.svg' />
              <span>Store</span>
            </span>
          </li>
          <li>
            <span className={style['page']} onClick={() => {router.push('/items');setIsPopup(false)}}>
              <img className={style['icon']} src='/svg/category.svg' />
              <span>Items</span>
            </span>
          </li>
        </ul>
        <ul className={style['refs']}>
          <li>
            <span className={style['ref']} 
            onClick={() => {router.push('/about');setIsPopup(false)}}
            >
              About
            </span>
          </li>
          <li>
            <span className={style['ref']}>
              <a href='https://github.com/bel1c10ud/valorant-store' target='_blank' rel='noreferrer'>Github</a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}