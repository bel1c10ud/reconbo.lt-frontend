import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router"
import SkinDetailLayout from "../../components/template/SkinDetailLayout";
import { ClientAPI, ExternalAPI } from "../../type"; 
import { useAuth, useClientAPI, useExternalAPI, } from "../../hooks";
import SkinDetailLayoutSkeleton from "../../components/template/SkinDetailLayoutSkeleton";
import ErrorLayout from "../../components/template/ErrorLayout";

export default function SkinDetail() {
  const router = useRouter();
  const uuid = router.query.uuid as string|undefined;

  const auth = useAuth();

  const offers = useClientAPI<ClientAPI.Offers>('offers');
  const externalAPISkins = useExternalAPI<ExternalAPI.Skin[]>('skins');
  const externalAPIContentTiers = useExternalAPI<ExternalAPI.ContentTier[]>('contentTiers')

  const externalAPISkin = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if(externalAPISkins.error) return { ...obj, error: externalAPISkins.error }
    else if(externalAPISkins.isLoading) return { ...obj, isLoading: true }
    else {
      let chromaIndex;
      let levelIndex;
      let skin = externalAPISkins.data?.find(skin => {
        if(skin.uuid === uuid) return true;
        else {
          const chroma = skin.chromas.findIndex(chroma => chroma.uuid === uuid);
          const level = skin.levels.findIndex(level => level.uuid === uuid);

          if(level !== -1 || chroma !== -1) {
            if(level !== -1) { levelIndex = level; }
            if(chroma !== -1) { chromaIndex = chroma; }
            return true
          }
        }
      });

      if(skin) {
        return { ...obj, data: {skin: skin, levelIndex: levelIndex, chromaIndex: chromaIndex} }
      } else {
        return { ...obj, error: new Error('not found skin') }
      }
    }
  }, [externalAPISkins, uuid]);

  const contentTier = useMemo(() => {
    if(externalAPISkin.data) {
      if(externalAPIContentTiers.data) {
        return externalAPIContentTiers.data.find(contentTier => contentTier.uuid === externalAPISkin.data.skin.contentTierUuid)
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [externalAPISkin, externalAPIContentTiers])

  const offer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };
    if(externalAPISkin.error) return { ...obj, error: externalAPISkin.error }
    else if(externalAPISkin.isLoading) return { ...obj, isLoading: true }
    else if(externalAPISkin.data) {
      if(offers.error) return { ...obj, error: offers.error }
      else if(offers.isLoading) return { ...obj, isLoading: true }
      else if(offers.data) {
        return { 
          ...obj, 
          data: offers.data.Offers.find((offer: any) => offer.OfferID == externalAPISkin.data.skin.levels[0].uuid)
        }
      }
      else return { ...obj, error: new Error('Not found offer from Client API') }
    }
    else return { ...obj, error: new Error('Not found skin from External API') }
  }, [externalAPISkin, offers])

  if(typeof uuid === 'undefined') return <div>not found uuid!</div>

  if(externalAPISkin.error) return <ErrorLayout error={externalAPISkin.error} />
  else if(externalAPISkin.isLoading || !externalAPISkin.data) return <SkinDetailLayoutSkeleton />
  else {
    return (
      <SkinDetailLayout 
        auth={auth}
        data={{
          externalAPISkin: externalAPISkin.data.skin,
          levelIndex: externalAPISkin.data.levelIndex,
          chromaIndex: externalAPISkin.data.chromaIndex,
          contentTier: contentTier,
          offer: offer
        }}
      />
    )
  }
}