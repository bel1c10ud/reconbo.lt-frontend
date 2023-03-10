import { useEffect} from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import StoreLayout from "../components/template/StoreLayout";
import StoreLayoutSkeleton from '../components/template/StoreLayoutSkeleton';
import { useAuth, useClientAPI } from '../hooks';
import { ClientAPI } from '../type';
import ErrorLayout from '../components/template/ErrorLayout';
import { i18nMessage } from '../i18n';
import { languageAtom } from '../recoil';

export default function StorePage() {
  const router = useRouter();
  const auth = useAuth();
  const lang = useRecoilValue(languageAtom);
  const clientAPIStore = useClientAPI<ClientAPI.Store>('store');

  let count = 0;

  useEffect(() => { // confirm redirect
    if(auth.isInit && !auth.isValid) {
      if(count === 0) { 
        count = count + 1;
        const confirmMessage = `${i18nMessage['LOGIN_IS_REQUIRED'][lang ?? 'en-US']}\n${i18nMessage['GO_TO_THE_LOGIN_PAGE'][lang ?? 'en-US']}`;
        if(window.confirm(confirmMessage)) { router.push('/authorization'); }
        else { router.back(); }
      }
    }
  }, [auth]);


  if(auth.isInit && !auth.isValid) return <StoreLayoutSkeleton />
  else if(clientAPIStore.error) return <ErrorLayout error={clientAPIStore.error} />
  else if(clientAPIStore.isLoading) return <StoreLayoutSkeleton />
  else return <StoreLayout data={clientAPIStore.data as ClientAPI.Store} />
}