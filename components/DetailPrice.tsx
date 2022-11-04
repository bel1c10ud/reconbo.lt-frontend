import style from './DetailPrice.module.css';
import { ClientAPI } from "../type";
import Callout, { CalloutTitle } from './Callout';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../recoil';
import { i18nMessage } from './../i18n';

interface DetailPriceProps {
  data?: { 
    currencyType: keyof typeof ClientAPI.CurrencyType, 
    value: number 
  },
  isNotAccurate?: boolean
}

export default function DetailPrice(props: DetailPriceProps) {
  return (
    <div className={style['wrap']}>
{ props.isNotAccurate ? (
      <IsNotAccurate />
  ) : null
}
      <div className={style['self']}>
{ props.data ? (
    `${props.data.value} ${props.data.currencyType}`
  ) : (
    '...'
  )
}
      </div>
    </div>
  )
}

function IsNotAccurate() {
  const lang = useRecoilValue(languageAtom);

  return (
    <Callout>
      <CalloutTitle>ℹ️ { i18nMessage['THIS_INFORMATION_MAY_NOT_BE_ACCURATE'][lang ?? 'en-US'] }</CalloutTitle>
    </Callout>
  )
}