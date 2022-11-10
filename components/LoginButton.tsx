import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import Button from './Button';
import { languageAtom, regionAtom } from './../recoil';
import { i18nMessage } from '../i18n';
import { useAuth } from '../hooks';

export default function LoginButton() {
  const router = useRouter();

  const auth = useAuth();
  const language = useRecoilValue(languageAtom);
  const region = useRecoilValue(regionAtom);

  return (
    <>
{ auth.isValid ? 
      <Button primary large onClick={() => router.push(`/rewrite/${region ?? 'kr'}/api/clear`)}>{i18nMessage['LOGOUT'][language?? 'en-US']}</Button> 
    : <Button primary large onClick={() => router.push('/authorization')}>{i18nMessage['LOGIN'][language?? 'en-US']}</Button>
}
    </>
  )
}