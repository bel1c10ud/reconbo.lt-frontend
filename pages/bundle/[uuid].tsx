import { useMemo } from 'react';
import { useRouter } from "next/router";
import { ClientAPI, ExternalAPI } from '../../type';

import BundleDetailLayout from "../../components/template/BundleDetailLayout";
import BundleDetailLayoutSkeleton from '../../components/template/BundleDetailLayoutSkeleton';
import { useAuth, useClientAPI, useExternalAPI } from '../../hooks';
import ErrorLayout from '../../components/template/ErrorLayout';

export default function BundleDetail() {
  const router = useRouter();
  const uuid = useMemo(() => {
    if(router.query.uuid instanceof Array) return router.query.uuid[0];
    else return router.query.uuid;
  }, [router.query]);

  const auth = useAuth();

  const clientAPIStore = useClientAPI<ClientAPI.Store>('store');
  const externalAPIBundles = useExternalAPI<ExternalAPI.Bundle[]>('bundles');

  const clientAPIBundle = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(clientAPIStore.error) return { ...obj, error: clientAPIStore.error }
    else if(clientAPIStore.isLoading) return { ...obj, isLoading: true }
    else if(clientAPIStore.data) {
      if(clientAPIStore.data.FeaturedBundle.Bundles.find((bundle: any) => bundle.DataAssetID === uuid))
        return { ...obj, data: clientAPIStore.data.FeaturedBundle.Bundles.find((bundle: any) => bundle.DataAssetID === uuid) }
      else 
        return { ...obj, error: new Error('not found client api bundle data') }
    }

    return { ...obj, error: new Error('not found client api store data')}
  }, [uuid, clientAPIStore]);

  const externalAPIBundle = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPIBundles.error) return { ...obj, error: externalAPIBundles.error }
    else if(externalAPIBundles.isLoading) return { ...obj, isLoading: true };
    else if(externalAPIBundles.data) {
      if(externalAPIBundles.data.find(bundle => bundle.uuid === uuid))
        return { ...obj, data: externalAPIBundles.data.find(bundle => bundle.uuid === uuid) }
      else 
        return { ...obj, error: new Error('not found external api bundle data') }
    }

    return { ...obj, error: new Error('not found external api bundles data') }
  }, [uuid, externalAPIBundles]);


  if(typeof uuid === 'undefined') 
    return <div>not found uuid!</div>

  if(externalAPIBundle.error) return <ErrorLayout error={externalAPIBundle.error} />
  else if(externalAPIBundle.isLoading || !externalAPIBundle.data) return <BundleDetailLayoutSkeleton />
  else {
    return (
      <BundleDetailLayout 
        auth={auth}
        uuid={uuid}
        externalAPIBundleData={externalAPIBundle.data}
        clientAPIBundleData={clientAPIBundle.data} 
      />
    )
  }
}