import { createI18n } from 'vue-i18n'

import en_us from './en_us'
import zh_cn from './zh_cn'

const i18n = createI18n({
    locale: 'en-us',
    fallbackLocale: 'zh-cn',
    messages: {
        "en-us": en_us,
        "zh-cn": zh_cn
    }
})

export default i18n;