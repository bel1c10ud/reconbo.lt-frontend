import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import ErrorLayout from "@/components/template/ErrorLayout";
import StoreLayout from "@/components/template/StoreLayout";
import StoreLayoutSkeleton from "@/components/template/StoreLayoutSkeleton";
import { useAuth, useClientAPI } from "@/hooks";
import { useLanguageStore } from "@/store";
import { i18nMessage } from "@/i18n";
import type { ClientAPI } from "@/type";

export default function StorePage() {
  const router = useRouter();
  const auth = useAuth();
  const lang = useLanguageStore((state) => state.language);
  const clientAPIStore = useClientAPI<ClientAPI.Store>("store");

  let count = useRef(0);

  useEffect(() => {
    // confirm redirect
    if (auth.isInit && !auth.isValid) {
      if (count.current === 0) {
        count.current = count.current + 1;
        const confirmMessage = `${i18nMessage["LOGIN_IS_REQUIRED"][lang ?? "en-US"]}\n${
          i18nMessage["GO_TO_THE_LOGIN_PAGE"][lang ?? "en-US"]
        }`;
        if (window.confirm(confirmMessage)) {
          router.push("/authorization");
        } else {
          router.back();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  if (auth.isInit && !auth.isValid) return <StoreLayoutSkeleton />;
  else if (clientAPIStore.error) return <ErrorLayout error={clientAPIStore.error} />;
  else if (clientAPIStore.isLoading) return <StoreLayoutSkeleton />;
  else return <StoreLayout data={clientAPIStore.data as ClientAPI.Store} />;
}
