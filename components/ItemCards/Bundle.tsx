import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { languageAtom } from '../../recoil';
import { useRouter } from 'next/router';

import { ClientAPI, ExternalAPI } from '../../type';

import style from './Bundle.module.css';
import { useClientAPI, useExternalAPI } from '../../hooks';
import { i18nMessage } from '../../i18n';
import Button from '../Button';

interface BundleComponentProps {
  uuid: string
  detailButton?: boolean
}

export default function Bundle(props: BundleComponentProps) {

  const clientAPIStore = useClientAPI<ClientAPI.Store>('store');

  const externalAPIBundles = useExternalAPI<ExternalAPI.Bundle[]>('bundles');
  const externalAPIBundle = useMemo(() => {
    if(externalAPIBundles.data) return externalAPIBundles.data.find(bundle => bundle.uuid === props.uuid);
    return undefined
  }, [props.uuid, externalAPIBundles])

  const clientAPIBundleData = useMemo(() => {
    if(clientAPIStore.data && clientAPIStore.data?.FeaturedBundle.Bundles) {
      return clientAPIStore.data.FeaturedBundle.Bundles.find((bundle: any) => bundle.DataAssetID === props.uuid);
    }
  }, [props.uuid, clientAPIStore])
  


  if(externalAPIBundle && clientAPIBundleData) 
    return (
      <BundleLayout externalAPIBundleData={externalAPIBundle} clientAPIBundleData={clientAPIBundleData} detailButton={props.detailButton} />
    )
  else return <BundleSkeleton />
}

interface BundleLayoutCompomentProps {
  externalAPIBundleData: ExternalAPI.Bundle,
  clientAPIBundleData: ClientAPI.Bundle,
  detailButton?: boolean
}

function BundleLayout(props: BundleLayoutCompomentProps) {
  const router = useRouter();

  const lang = useRecoilValue(languageAtom);

  function goBundleDetail(uuid: string) {
    router.push(`/bundle/${uuid}`);
  }

  return (
    <div className={style['self']}>
      <div className={style['ratio']}></div>
      <div className={style['wrap']}>
        <img src={props.externalAPIBundleData.displayIcon} alt={props.externalAPIBundleData.description} />
        <div className={style['overlay']}>
          <div className={style['title']}>{props.externalAPIBundleData.displayName}</div>
{ props.externalAPIBundleData.displayNameSubText?.length ? (
          <div className={style['sub-title']}>{props.externalAPIBundleData.displayNameSubText}</div>
) : null}
{ props.externalAPIBundleData.extraDescription?.length ? (
          <div className={style['extra-desc']}>{props.externalAPIBundleData.extraDescription}</div>
) : null}
{ props.detailButton && (
            <div className={style['detail-button']}>
              <Button secondary small
              onClick={() => goBundleDetail(props.externalAPIBundleData.uuid)}>
                { i18nMessage['DETAIL'][lang?? 'en-US'] }
              </Button>
            </div>
)}

        </div>
      </div>
    </div>
  )
}

export function BundleSkeleton() {
  return (
    <div className={[style['self'], style['skeleton']].join(' ')}>
      <div className={style['ratio']}></div>
      <div className={style['wrap']}></div>
    </div>
  )
}