import React from "react";
import Select from "@/components/Select";
import { useLanguageStore } from "@/store";
import { languageOptions } from "@/options";
import type { LanguageCode } from "@/type";

export default function LanguageSelect() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  function updateLanguage(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value) {
      setLanguage(e.currentTarget.value as LanguageCode);
      window.localStorage.setItem("language", e.currentTarget.value as LanguageCode);
    }
  }

  return (
    <Select
      name="lenguage"
      options={languageOptions}
      value={language}
      placeholder="Language"
      onChange={updateLanguage}
    />
  );
}
