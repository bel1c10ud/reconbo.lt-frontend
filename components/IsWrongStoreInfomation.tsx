import { useRecoilValue } from 'recoil';
import { languageAtom } from '../recoil';
import Callout, { CalloutBody, CalloutTitle } from './Callout';
import { i18nMessage } from '../i18n';

export default function IsWrongStoreInfomation() {
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