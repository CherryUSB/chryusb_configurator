import { createI18n } from 'vue-i18n'

import zh_cn from './zh_cn'

const i18n = createI18n({
    locale: 'zh-cn',
    messages: {
        "zh-cn": zh_cn
    }
})

export default i18n;