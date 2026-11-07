import { useEffect, useMemo, useState } from 'react'
import LanguageContext from './languageContext.js'
import { productTranslations, translations } from './translations.js'

const supportedLanguages = ['uz', 'en', 'ru']
const languageCodes = { uz: 'uz-UZ', en: 'en', ru: 'ru-RU' }

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('burger-language')
    return supportedLanguages.includes(saved) ? saved : 'uz'
  })

  useEffect(() => {
    localStorage.setItem('burger-language', language)
    document.documentElement.lang = languageCodes[language]
    document.title = {
      uz: 'Burger — taom yetkazib berish',
      en: 'Burger — food delivery',
      ru: 'Burger — доставка еды',
    }[language]
  }, [language])

  const value = useMemo(() => {
    const t = (text) => translations[language][text] || text
    const localizeProduct = (product) => ({
      ...product,
      name: productTranslations[language]?.[product.name] || translations[language][product.name] || product.name,
      desc: productTranslations[language]?.[product.desc] || product.desc,
    })

    return { language, setLanguage, t, localizeProduct }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
