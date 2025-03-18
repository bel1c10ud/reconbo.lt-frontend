import axios from "axios";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Select from "@/components/Select";
import { authObjAtom, regionAtom } from "@/recoil";
import { regionOptions } from "@/options";
import type { RegionCode } from "@/type";

export default function RegionSelect(props: { disabled?: boolean }) {
  const [region, setRegion] = useRecoilState(regionAtom);
  const authObj = useRecoilValue(authObjAtom);

  function updateRegion(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value && e.currentTarget.value.length > 0) {
      if (
        authObj.access_token &&
        authObj.access_token.length > 0 &&
        authObj.expiry_timestamp &&
        authObj.expiry_timestamp > Date.now()
      ) {
        reqRegion(e.currentTarget.value as RegionCode);
      }
      setRegion(e.currentTarget.value as RegionCode);
    } else {
      setRegion(undefined);
    }
  }

  return (
    <Select
      name="region"
      options={regionOptions}
      value={region}
      placeholder="Region"
      onChange={updateRegion}
      disabled={props.disabled}
    />
  );
}

async function reqRegion(regionCode: RegionCode) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/region",
      data: {
        type: "update",
        regionCode: regionCode,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
}
