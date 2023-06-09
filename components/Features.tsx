import { useRecoilValue } from 'recoil';
import { i18nFeatures } from '../i18n';
import style from './Features.module.css';
import { languageAtom } from '../recoil';

export default function Features() {
  const lang = useRecoilValue(languageAtom);

  return (
    <section className={style['self']}>
      <h1 className={style['title']}>FEATURES</h1>
      <ul className={style['features']}>
{ i18nFeatures.map((feature, i) => (
        <li key={`feature-${i}`} className={style['feature']}>
          <picture>
            <img src={feature.symbol} alt={feature.accent[lang?? 'en-US']} />
          </picture>
          <div className={style['desc']}>
            <p className={style['accent']}>
              <span lang={lang?? 'en-US'}>{feature.accent[lang?? 'en-US']}</span>
            </p>
            <p>
              <span lang={lang?? 'en-US'}>{feature.paragraph[lang?? 'en-US']}</span>
            </p>
          </div>
        </li>
)) }
      </ul>
    </section>
  )
}