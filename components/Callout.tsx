import { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../recoil';
import { i18nMessage } from '../i18n';
import style from './Callout.module.css';

export default function Callout(props: {
  children: ReactElement|ReactElement[]
}) {
  return (
    <div className={style['self']}>
      {props.children}
    </div>
  )
}

export function CalloutTitle(props: {
  children?: string|string[]
}) {
  return (
    <div className={style['callout-title']}>{props.children}</div>
  )
}

export function CalloutBody(props: {
  children?: string|string[]
}) {
  return (
    <div className={style['callout-body']}>{props.children}</div>
  )
}

export function RequiredLoginCallout() {
  const lang = useRecoilValue(languageAtom);

  return (
    <Callout>
      <CalloutTitle>ℹ️ { i18nMessage['LOGIN_IS_REQUIRED'][lang ?? 'en-US'] }</CalloutTitle>
      <CalloutBody>{ i18nMessage['GET_ADDITIONAL_INFORMATION'][lang ?? 'en-US'] }</CalloutBody>
    </Callout>
  )
}