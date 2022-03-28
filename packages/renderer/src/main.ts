import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@mdi/font/css/materialdesignicons.css';

import ipcRendererSample from './mainModules/ipcRendererSample'
import fsExample from './mainModules/builtinModuleSample'
import sqliteExample from './mainModules/nodeModulesSample'

import i18n from './lang'

import './theme/theme.css'

const app = createApp(App)
    .use(ElementPlus)
    .use(i18n)
    .use(router)
    .mount('#app')
    .$nextTick(() => { window.removeLoading() })

