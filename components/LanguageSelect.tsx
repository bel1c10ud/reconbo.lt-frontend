import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { languageAtom } from "../recoil";
import Select from "./Select";
import { languageOptions } from "../options";
import { LanguageCode } from '../type';

export default function LanguageSelect() {
  const [language, setLanguage] = useRecoilState(languageAtom);

  function updateLanguage(e: React.ChangeEvent<HTMLSelectElement>) {
    if(e.currentTarget.value) {
      setLanguage(e.currentTarget.value as LanguageCode)
      window.localStorage.setItem('language', e.currentTarget.value as LanguageCode);
    }
  }

  return (
    <Select name='lenguage' options={languageOptions} value={language} placeholder='Language' onChange={updateLanguage} />
  )
}