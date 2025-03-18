import { useRouter } from "next/router";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useClientAPI, useExternalAPI } from "@/hooks";
import { languageAtom } from "@/recoil";
import type { ClientAPI, ExternalAPI } from "@/type";
import style from "@/components/ItemCards/Bundle.module.css";

interface BundleComponentProps {
  uuid: string;
}

export default function Bundle(props: BundleComponentProps) {
  const clientAPIStore = useClientAPI<ClientAPI.Store>("store");

  const externalAPIBundles = useExternalAPI<ExternalAPI.Bundle[]>("bundles");
  const externalAPIBundle = useMemo(() => {
    if (externalAPIBundles.data)
      return externalAPIBundles.data.find((bundle) => bundle.uuid === props.uuid);
    return undefined;
  }, [props.uuid, externalAPIBundles]);

  const clientAPIBundleData = useMemo(() => {
    if (clientAPIStore.data && clientAPIStore.data?.FeaturedBundle.Bundles) {
      return clientAPIStore.data.FeaturedBundle.Bundles.find(
        (bundle: any) => bundle.DataAssetID === props.uuid,
      );
    }
  }, [props.uuid, clientAPIStore]);

  if (externalAPIBundle && clientAPIBundleData)
    return (
      <BundleLayout
        externalAPIBundleData={externalAPIBundle}
        clientAPIBundleData={clientAPIBundleData}
      />
    );
  else return <BundleSkeleton />;
}

interface BundleLayoutCompomentProps {
  externalAPIBundleData: ExternalAPI.Bundle;
  clientAPIBundleData: ClientAPI.Bundle;
}

function BundleLayout(props: BundleLayoutCompomentProps) {
  const router = useRouter();
  const lang = useRecoilValue(languageAtom);

  function goBundleDetail(uuid: string) {
    router.push(`/bundle/${uuid}`);
  }

  return (
    <div className={style["self"]}>
      <div className={style["ratio"]}></div>
      <div
        className={style["wrap"]}
        onClick={() => goBundleDetail(props.externalAPIBundleData.uuid)}
      >
        <img
          src={props.externalAPIBundleData.displayIcon}
          alt={props.externalAPIBundleData.description}
        />
        <div className={style["overlay"]}>
          <div className={style["title"]}>{props.externalAPIBundleData.displayName}</div>
          {props.externalAPIBundleData.displayNameSubText?.length ? (
            <div className={style["subtitle"]}>
              <span lang={lang ?? "en-US"}>{props.externalAPIBundleData.displayNameSubText}</span>
            </div>
          ) : null}
          {props.externalAPIBundleData.extraDescription?.length ? (
            <div className={style["extra-desc"]}>
              <span lang={lang ?? "en-US"}>{props.externalAPIBundleData.extraDescription}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function BundleSkeleton() {
  return (
    <div className={[style["self"], style["skeleton"]].join(" ")}>
      <div className={style["ratio"]}></div>
      <div className={style["wrap"]}></div>
    </div>
  );
}
