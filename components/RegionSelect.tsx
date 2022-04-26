import React from "react";
import { useRecoilState } from "recoil";
import { regionAtom } from "../recoil";
import Select from "./Select";
import { regionOptions, RegionCode } from "../options";

export default function RegionSelect() {
  const [region, setRegion] = useRecoilState(regionAtom);

  function updateRegion(e: React.ChangeEvent<HTMLSelectElement>) {
    if(e.currentTarget.value) {
      if(e.currentTarget.value.length === 0 ) setRegion(undefined);
      else setRegion(e.currentTarget.value as RegionCode)
    } else {
      setRegion(undefined);
    }
  }

  return (
    <Select name='region' options={regionOptions} value={region} placeholder='Region' onChange={updateRegion} />
  )
}