import { createApp } from 'vue'
import swal from 'sweetalert'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'

import App from './App.vue'
import router from './router'
import store from './store'

// Plugins
import axiosInstance from './plugins/axios'
import { encrypt, decrypt } from '@/plugins/crypto'
import can from '@/plugins/gate'
import i18n from './plugins/i18n'

import Contractable from '@/components/Contractable'
import Documentable from '@/components/Documentable'
import Concurrable from '@/components/Concurrable'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(i18n)

app.provide('icons', icons)

app.component('CIcon', CIcon)
app.component('Contractable', Contractable)
app.component('Documentable', Documentable)
app.component('Concurrable', Concurrable)

app.config.compilerOptions.isCustomElement = (tag) => tag.includes('ion-icon')

app.config.globalProperties.$axios = axiosInstance
app.config.globalProperties.$encrypt = encrypt
app.config.globalProperties.$decrypt = decrypt
app.config.globalProperties.$can = can
app.config.globalProperties.swal = swal

app.mount('#app')
