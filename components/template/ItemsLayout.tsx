import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Bleed from "@/components/Bleed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hr from "@/components/Hr";
import Buddy from "@/components/ItemCards/Buddy";
import Flex from "@/components/ItemCards/Flex";
import ItemCardError from "@/components/ItemCards/ItemCardError";
import ItemCardSkeleton from "@/components/ItemCards/ItemCardSkeleton";
import PlayerCard from "@/components/ItemCards/PlayerCard";
import PlayerTitle from "@/components/ItemCards/PlayerTitle";
import Skin from "@/components/ItemCards/Skin";
import Spray from "@/components/ItemCards/Spray";
import Select from "@/components/Select";
import { useExternalAPI } from "@/hooks";
import { ExternalAPI } from "@/type";
import style from "@/components/template/ItemsLayout.module.css";

const categoryOption: { label: string; value: keyof typeof ExternalAPI.Endpoint }[] = [
  { label: "Weapon Skin", value: "weapons" },
  { label: "Spray", value: "sprays" },
  { label: "Buddy", value: "buddies" },
  { label: "Player Card", value: "playerCards" },
  { label: "Player Title", value: "playerTitles" },
];

const weaponOption = [{ label: "All", value: "all" }];

type DataType = (
  | ExternalAPI.Weapon
  | ExternalAPI.Buddy
  | ExternalAPI.Spray
  | ExternalAPI.PlayerCard
  | ExternalAPI.PlayerTitle
)[];

interface ItemsLayoutProps {
  type?: keyof typeof ExternalAPI.Endpoint;
  filter?: string;
  limit?: number;
}

export default function ItemsLayout(props: ItemsLayoutProps) {
  const router = useRouter();

  const [itemType, setItemType] = useState(() =>
    props.type ? props.type : categoryOption[0].value,
  );
  const [filter, setFilter] = useState(props.filter ?? "all");
  const [pageSize, setPageSize] = useState(12);
  const [limit, setLimit] = useState(
    props.limit && props.limit > pageSize ? props.limit : pageSize,
  );

  const filterRegex = useMemo(() => {
    if (itemType === "weapons") {
      if (filter === "all") return new RegExp("", "ig");
      else return new RegExp(`\/${filter}\/`, "ig");
    }
    // ...
    else return new RegExp("", "ig");
  }, [itemType, filter]);

  const query = useMemo(() => {
    let obj = {};
    obj = { ...obj, type: itemType };
    if (itemType === "weapons") obj = { ...obj, filter: filter };
    if (limit > pageSize) obj = { ...obj, limit: limit };
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, filter, limit]);

  const fetch = useExternalAPI<DataType>(itemType);

  const data = useMemo(() => {
    const obj = { error: undefined, data: undefined, isLoading: false };
    if (fetch.error) return { ...obj, error: fetch.error };
    if (fetch.isLoading) return { ...obj, isLoading: true };
    if (fetch.data) {
      if (itemType === "weapons") {
        let arr: ExternalAPI.Skin[] = [];
        (fetch.data as ExternalAPI.Weapon[]).forEach((weapon) =>
          weapon.skins.forEach((skin) => (arr = [...arr, skin])),
        );
        arr = arr.filter((el) => {
          return (
            el.assetPath.match(filterRegex) &&
            el.themeUuid !== ExternalAPI.ThemeUuid.Random &&
            el.themeUuid !== ExternalAPI.ThemeUuid.Standard
          );
        });
        return { ...obj, data: arr };
      } else {
        return { ...obj, data: fetch.data };
      }
    } else return { ...obj, error: new Error("not found items data") };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, fetch]);
  const weapons = useMemo(() => {
    if (itemType === "weapons") {
      const obj = { error: undefined, data: undefined, isLoading: false };
      if (fetch.error) return { ...obj, error: fetch.error };
      if (fetch.isLoading) return { ...obj, isLoading: true };
      if (fetch.data) {
        const data = fetch.data.map((el) => {
          const assetPathArr = el.assetPath.split("/");
          let value = "";
          if (assetPathArr[3] === "Guns") value = assetPathArr[5];
          if (assetPathArr[3] === "Melee") value = "Melee";
          return { label: el.displayName, value: value };
        });
        return { ...obj, data: data };
      } else return { ...obj, error: new Error("not found weapon data") };
    }
  }, [itemType, fetch]);

  const updateItemType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value)
      setItemType(e.currentTarget.value as keyof typeof ExternalAPI.Endpoint);
  };

  const updateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value) setFilter(e.currentTarget.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setLimit(props.limit && props.limit > pageSize ? props.limit : pageSize), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setLimit(pageSize), [itemType, filter]);

  useEffect(() => {
    if (router.query.type) router.push({ query: query }, undefined, { scroll: false });
    else router.replace({ query: query }, undefined, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <Head>
        <title>Reconbo.lt | Items</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["title"]}>ITEMS</div>
        <Select
          name="category"
          options={categoryOption}
          value={itemType}
          placeholder="Category"
          onChange={updateItemType}
        />
        {itemType === "weapons" ? (
          <Select
            name="weapon"
            options={[...weaponOption, ...(weapons?.data ?? [])]}
            placeholder="Weapon"
            value={filter}
            onChange={updateFilter}
          />
        ) : null}
        <Hr />
        <Bleed>
          <div className={style["items-wrap"]}>
            {data.error ? <ItemCardError /> : null}
            {data.isLoading
              ? Array.apply(null, Array(limit)).map((el, i) => <ItemCardSkeleton key={i} />)
              : null}
            {data.data
              ? data.data.slice(0, limit).map((data) => {
                  if (itemType === "weapons") return <Skin key={data.uuid} uuid={data.uuid} />;
                  if (itemType === "sprays") return <Spray key={data.uuid} uuid={data.uuid} />;
                  if (itemType === "buddies") return <Buddy key={data.uuid} uuid={data.uuid} />;
                  if (itemType === "playerCards")
                    return <PlayerCard key={data.uuid} uuid={data.uuid} />;
                  if (itemType === "playerTitles")
                    return <PlayerTitle key={data.uuid} uuid={data.uuid} />;
                  if (itemType === "flex") return <Flex key={data.uuid} uuid={data.uuid} />;
                })
              : null}
            {(data.data?.length ?? 0) > limit ? (
              <div className={style["limit"]}>
                <button onClick={() => setLimit(limit + pageSize)}>
                  {limit} / {data.data?.length ?? "?"}
                </button>
              </div>
            ) : null}
          </div>
        </Bleed>
      </div>
      <Footer />
    </>
  );
}
