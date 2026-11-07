import { useLanguage } from './useLanguage.js'
import './LanguageSwitcher.css'

const languageLabels = {
  uz: 'O‘zbekcha',
  en: 'English',
  ru: 'Русский',
}

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <label className={`language-switcher ${className}`.trim()}>
      <span className="language-switcher__label">Language</span>
      <select
        aria-label={t('Select language')}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {Object.entries(languageLabels).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
