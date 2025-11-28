import { createI18n } from 'vue-i18n'
// 修正Element Plus语言包ES模块导入路径（补充es/层级）
import zhcnLocale from 'element-plus/es/locale/lang/zh-cn';
import enLocale from 'element-plus/es/locale/lang/en';

import { useAppStore } from '/@/stores'
import { computed } from 'vue'

import nextZhcn from './lang/zh-cn'
import nextEn from './lang/en'

import pagesGISZhcn from '/@/i18n/pages/gis/zh-cn';
import pagesGISEn from '/@/i18n/pages/gis/en';

import type { FallbackLocale } from 'vue-i18n'
const messages = {
 	[zhcnLocale.name]: {
		...zhcnLocale,
		message: {
			...nextZhcn,
			...pagesGISZhcn
		},
	},
  [enLocale.name]: {
		...enLocale,
		message: {
			...nextEn,
			...pagesGISEn,
		},
	},
}
console.log(messages)

const i18n = createI18n({
  legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn', // 初始值保持静态
  messages
})

const fallback = {
  default: ['en']
}
export function initI18nLocale() {
  const appStore = useAppStore()
  i18n.global.locale.value = appStore.state.language
}
export default i18n


