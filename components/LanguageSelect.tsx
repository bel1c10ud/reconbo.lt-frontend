import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { languageAtom } from "../recoil";
import Select from "./Select";
import { languageOptions, LanguageCode } from "../options";

export default function LanguageSelect() {
  const [language, setLanguage] = useRecoilState(languageAtom);

  function updateLanguage(e: React.ChangeEvent<HTMLSelectElement>) {
    if(e.currentTarget.value) {
      setLanguage(e.currentTarget.value as LanguageCode)
    }
  }

  useEffect(function initLang() {
    if(navigator) {
      const clientLang = navigator.language;
      const langs = languageOptions.map(lang => lang.value);

      if(clientLang) {
        const findLang = langs.find(lang => lang === clientLang) as undefined|LanguageCode;

        if(findLang) {
          setLanguage(findLang)
        } else {
          setLanguage('en-US');
        }
      } else {
        setLanguage('en-US');
      }
    } else {
      setLanguage('en-US');
    }
  }, [])

  return (
    <Select name='lenguage' options={languageOptions} value={language} placeholder='Language' onChange={updateLanguage} />
  )
}