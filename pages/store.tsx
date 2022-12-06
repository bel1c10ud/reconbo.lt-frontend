import { useEffect } from 'react';
import { useRouter } from 'next/router';

import StoreLayout from "../components/template/StoreLayout";
import StoreLayoutSkeleton from '../components/template/StoreLayoutSkeleton';
import { useAuth, useClientAPI } from '../hooks';
import { ClientAPI } from '../type';
import ErrorLayout from '../components/template/ErrorLayout';

export default function StorePage() {
  const router = useRouter();
  const auth = useAuth();

  const clientAPIStore = useClientAPI<ClientAPI.Store>('store');

  useEffect(() => { // redirect root
    if(auth.isInit && !auth.isValid) {
      router.push('/');
    }
  }, [auth])


  if(clientAPIStore.error) return <ErrorLayout error={clientAPIStore.error} />
  else if(clientAPIStore.isLoading) return <StoreLayoutSkeleton />
  else return <StoreLayout data={clientAPIStore.data as ClientAPI.Store} />
}