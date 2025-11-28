import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import other from '/@/utils/other';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import config from '@arcgis/core/config'
import App from './App.vue'
import i18n, { initI18nLocale } from './i18n'
import '/@/theme/index.scss';

// Configure ArcGIS API for Chrome Extension
// Disable features that might require eval
config.request.useIdentity = false

// Additional configuration to minimize eval usage
// Note: Manifest V3 doesn't allow 'unsafe-eval' in CSP
// Basic map functionality should work without eval
// Our implementation uses only basic features that don't require eval

const app = createApp(App)
const pinia = createPinia()
other.elSvg(app);
// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
initI18nLocale()
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')

