import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import ErrorLayout from "@/components/template/ErrorLayout";
import SkinDetailLayout from "@/components/template/SkinDetailLayout";
import SkinDetailLayoutSkeleton from "@/components/template/SkinDetailLayoutSkeleton";
import { useAuth, useClientAPI, useExternalAPI } from "@/hooks";
import type { ClientAPI, ExternalAPI } from "@/type";

export default function SkinDetail() {
  const router = useRouter();
  const uuid = router.query.uuid as string | undefined;

  const auth = useAuth();

  const clientAPIStore = useClientAPI<ClientAPI.Store>("store");
  const externalAPISkins = useExternalAPI<ExternalAPI.Skin[]>("skins");
  const externalAPIContentTiers = useExternalAPI<ExternalAPI.ContentTier[]>("contentTiers");

  const externalAPISkin = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPISkins.error) return { ...obj, error: externalAPISkins.error };
    else if (externalAPISkins.isLoading) return { ...obj, isLoading: true };
    else {
      let chromaIndex;
      let levelIndex;
      let skin = externalAPISkins.data?.find((skin) => {
        if (skin.uuid === uuid) return true;
        else {
          const chroma = skin.chromas.findIndex((chroma) => chroma.uuid === uuid);
          const level = skin.levels.findIndex((level) => level.uuid === uuid);

          if (level !== -1 || chroma !== -1) {
            if (level !== -1) {
              levelIndex = level;
            }
            if (chroma !== -1) {
              chromaIndex = chroma;
            }
            return true;
          }
        }
      });

      if (skin) {
        return { ...obj, data: { skin: skin, levelIndex: levelIndex, chromaIndex: chromaIndex } };
      } else {
        return { ...obj, error: new Error("not found skin") };
      }
    }
  }, [externalAPISkins, uuid]);

  const contentTier = useMemo(() => {
    if (externalAPISkin.data) {
      if (externalAPIContentTiers.data) {
        return externalAPIContentTiers.data.find(
          (contentTier) => contentTier.uuid === externalAPISkin.data.skin.contentTierUuid,
        );
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [externalAPISkin, externalAPIContentTiers]);

  const offer = useMemo(() => {
    const obj = { data: undefined, error: undefined, isLoading: false };

    if (externalAPISkin.error || clientAPIStore.error)
      return { ...obj, error: externalAPISkin.error || clientAPIStore.error };
    if (externalAPISkin.isLoading || clientAPIStore.isLoading) return { ...obj, isLoading: true };
    if (
      externalAPISkin.data?.skin.levels.length &&
      clientAPIStore.data?.SkinsPanelLayout.SingleItemStoreOffers
    ) {
      const data = clientAPIStore.data.SkinsPanelLayout.SingleItemStoreOffers.find(
        (offer) =>
          offer.OfferID === externalAPISkin.data.skin.levels[0].uuid ||
          (offer.Rewards.length === 1 &&
            offer.Rewards.find(
              (reward) => reward.ItemID === externalAPISkin.data.skin.levels[0].uuid,
            )),
      );

      if (data) return { ...obj, data };
    }
    if (
      externalAPISkin.data?.skin.levels.length &&
      clientAPIStore.data?.BonusStore?.BonusStoreOffers
    ) {
      const data = clientAPIStore.data.BonusStore.BonusStoreOffers.find(
        (bounsStoreOffer) =>
          bounsStoreOffer.Offer.OfferID === externalAPISkin.data.skin.levels[0].uuid ||
          (bounsStoreOffer.Offer.Rewards.length === 1 &&
            bounsStoreOffer.Offer.Rewards.find(
              (reward) => reward.ItemID === externalAPISkin.data.skin.levels[0].uuid,
            )),
      );

      if (data) return { ...obj, data: data.Offer };
    }
    return { ...obj, error: new Error("Not found offers") };
  }, [clientAPIStore, externalAPISkin]);

  if (typeof uuid === "undefined") return <div>not found uuid!</div>;

  if (externalAPISkin.error) return <ErrorLayout error={externalAPISkin.error} />;
  else if (externalAPISkin.isLoading || !externalAPISkin.data) return <SkinDetailLayoutSkeleton />;
  else {
    return (
      <SkinDetailLayout
        auth={auth}
        data={{
          externalAPISkin: externalAPISkin.data.skin,
          levelIndex: externalAPISkin.data.levelIndex,
          chromaIndex: externalAPISkin.data.chromaIndex,
          contentTier: contentTier,
          offer: offer,
        }}
      />
    );
  }
}
