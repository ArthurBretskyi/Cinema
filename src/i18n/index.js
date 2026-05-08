import { createI18n } from 'vue-i18n'
import localesEN from '@/i18n/locales/en.json'
import localesUK from '@/i18n/locales/uk.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lastLocale') || import.meta.env.VITE_I18N_LOCALE || 'uk',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'uk',
  messages: {
    en: localesEN,
    uk: localesUK,
  },
  globalInjection: true,
})

export default i18n
