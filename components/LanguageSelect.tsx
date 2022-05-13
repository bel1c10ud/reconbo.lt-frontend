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
      window.localStorage.setItem('language', e.currentTarget.value as LanguageCode);
    }
  }

  useEffect(function initLang() {
    const langs = languageOptions.map(lang => lang.value);
    const localLang: string|undefined|null = window.localStorage.getItem('language');
    const clientLang = navigator.language;

    if((localLang !== undefined && localLang !== null) && langs.find(lang => lang === localLang)) {
      setLanguage(localLang as LanguageCode);
    } else {
      if(navigator) {
        if(clientLang) {
          if(langs.find(lang => lang === clientLang)) {
            setLanguage(clientLang as LanguageCode)
          } else {
            setLanguage('en-US');
          }
        } else {
          setLanguage('en-US');
        }
      } else {
        setLanguage('en-US');
      }
    }
  }, [])

  return (
    <Select name='lenguage' options={languageOptions} value={language} placeholder='Language' onChange={updateLanguage} />
  )
}