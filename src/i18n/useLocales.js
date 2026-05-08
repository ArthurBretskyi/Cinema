import { useI18n } from 'vue-i18n'

export function useLocales() {
  const { t, locale } = useI18n({ useScope: 'global' })

  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('lastLocale', lang)
  }
  function checkLocale() {
    const lastLocale = localStorage.getItem('lastLocale')
    if (lastLocale && lastLocale !== locale.value) {
      setLocale(localStorage.getItem('lastLocale'))
    }
  }

  return {
    locale,
    t,
    setLocale,
    checkLocale,
  }
}
