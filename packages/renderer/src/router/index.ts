import { createRouter, createWebHashHistory } from "vue-router";

import UsbConfig from '../pages/UsbConfig.vue'

const routes = [
    {
        path:'/',
        redirect:'/usb'
    },
    {
        path:'/usb',
        component: UsbConfig
    }
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})

export default router