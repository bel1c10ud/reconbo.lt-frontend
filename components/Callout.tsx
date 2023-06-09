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
    </Callout>
  )
}

export function IsNotAccurate() {
  const lang = useRecoilValue(languageAtom);

  return (
    <Callout>
      <CalloutTitle>ℹ️ { i18nMessage['THIS_INFORMATION_MAY_NOT_BE_ACCURATE'][lang ?? 'en-US'] }</CalloutTitle>
    </Callout>
  )
}

export function ThisProjectUnofficial() {
  const lang = useRecoilValue(languageAtom);

  return (
    <Callout>
      <CalloutTitle>ℹ️ { i18nMessage['THIS_PROJECT_IS_UNOFFICIAL'][lang ?? 'en-US'] }</CalloutTitle>
    </Callout>
  )
}

export function LegalNotice() {
  const lang = useRecoilValue(languageAtom);

  return (
    <Callout>
      <CalloutTitle>ℹ️ { i18nMessage['LEGAL_NOTICE'][lang ?? 'en-US'] }</CalloutTitle>
    </Callout>
  )
}

export function CalloutSkeleton() {
  return (
    <Callout>
      <CalloutTitle>ℹ️ </CalloutTitle>
    </Callout>
  )
}

export function IsWrongStoreInfomation() {
  const language = useRecoilValue(languageAtom);
  return (
    <Callout>
      <CalloutTitle>ℹ️ {i18nMessage['IS_WRONG_STORE_INFORMATION'][language?? 'en-US']}</CalloutTitle>
      <CalloutBody>
        {i18nMessage['IF_REGION_INCORRECT'][language?? 'en-US']}
      </CalloutBody>
    </Callout>
  )
}
