import { createI18n } from 'vue-i18n'
import messages from '../locales/messages'

if (!localStorage.getItem('dir')) {
  localStorage.setItem('dir', 'rtl')
}
if (!localStorage.getItem('locale')) {
  localStorage.setItem('locale', 'ar')
}

const i18n = createI18n({
  locale: localStorage.getItem('locale'),
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  missingWarn: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  formatFallbackMessages: true,
})

document.title = i18n.global.t('Murafiq')
document.dir = localStorage.getItem('dir')

export default i18n