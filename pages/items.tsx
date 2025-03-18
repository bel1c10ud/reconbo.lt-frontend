import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ItemsLayout from "@/components/template/ItemsLayout";
import { ExternalAPI } from "@/type";

export default function ItemsPage() {
  const router = useRouter();
  const type = useMemo(() => {
    if (router.query.type) {
      if (typeof router.query.type === "string") {
        if (Object.keys(ExternalAPI.Endpoint).find((endpoint) => endpoint === router.query.type)) {
          return router.query.type as keyof typeof ExternalAPI.Endpoint;
        }
      } else {
        const type = router.query.type;
        if (
          Object.keys(ExternalAPI.Endpoint).find((endpoint) => endpoint === type[type.length - 1])
        )
          return router.query.type[
            router.query.type.length - 1
          ] as keyof typeof ExternalAPI.Endpoint;
      }
    }
  }, [router.query.type]);
  const filter = useMemo(() => {
    if (type === "weapons") {
      if (router.query.filter) {
        if (typeof router.query.filter === "string") return router.query.filter;
        else return router.query.filter[router.query.filter.length - 1];
      }
    }
    // ...
  }, [router.query.filter, type]);
  const limit = useMemo(() => {
    if (typeof Number(router.query.limit) === "number") return Number(router.query.limit);
  }, [router.query.limit]);

  return <ItemsLayout type={type} filter={filter} limit={limit} />;
}
