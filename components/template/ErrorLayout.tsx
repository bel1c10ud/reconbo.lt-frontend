import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { i18nMessage } from '../../i18n';
import { languageAtom } from '../../recoil';
import Button from '../Button';
import style from './ErrorLayout.module.css';

interface ErrorLayoutProps {
  error?: Error
}

export default function ErrorLayout(props: ErrorLayoutProps) {
  const router = useRouter();
  const lang = useRecoilValue(languageAtom);
  return (
    <>
      <Head>
        <title>Reconbo.lt | Bundle Error</title>
      </Head>
      <div className={style['self']}>
        <div className={style['title']}>ERROR!</div>
        <div className={style['headline']}>
          { props.error? props.error.message: 'Unknown Error' }
        </div>
{ props.error ? (
        <div className={style['stack']}>
          <div className={style['stack-title']}>Error stack</div>
          <div className={style['stack-body']}>{props.error.stack ?? '...'}</div>
        </div>
): null }
        <Button primary large onClick={() => { router.push('/')}}>{i18nMessage['CLOSE'][lang?? 'en-US']}</Button>
      </div>
    </>
  )
}