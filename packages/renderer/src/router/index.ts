import { createRouter, createWebHashHistory } from "vue-router";

import Home from '../pages/Home.vue'
import UsbConfig from '../pages/UsbConfig.vue'

const routes = [
    {
        path:'/',
        redirect:'/usb'
    },
    {
        path:'/usb',
        component: UsbConfig
    },
    {
        path:'/home',
        component: Home
    },
    
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})

export default router