import style from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className={style['self']}>
      <div className={style['items']}>
        <div className={style['item']}>
          <Link href="/about">About</Link>
        </div>
        <div className={style['item']}>
          <a href="https://github.com/bel1c10ud/valorant-store" target='_blank' rel='noreferrer'>
            Github
          </a>
        </div>        
        <div className={style['item']}>
          <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbel1c10ud%2Fvalorant-store"  target='_blank' rel='noreferrer'>
            Deploy on Vercel
          </a>
        </div>
      </div>

    </div>
  )
}