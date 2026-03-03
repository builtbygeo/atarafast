"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language, type Translation } from "./translations"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "bg",
  setLang: () => {},
  t: translations.bg,
})

const LANG_KEY = "atara-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("bg")

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Language | null
    if (saved === "en" || saved === "bg") setLangState(saved)
  }, [])

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem(LANG_KEY, l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
