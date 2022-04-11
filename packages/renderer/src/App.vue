<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { computed, onMounted } from 'vue';
import theme from './theme';
import PvlTitleBar from './components/util/PvlTitleBar.vue';

const GetStyle = computed((index:number):any=>{
    return theme.GetStyle();
})

</script>

<template>
    <div :style="GetStyle">
        <el-container class="base-layout">

            <el-header height="32px" >
                <PvlTitleBar title="ChryUSB Configurator" version="1.0.0"></PvlTitleBar>
            </el-header>

            <el-main><router-view></router-view></el-main>
        </el-container>
    </div>
</template>

<style scoped>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.base-layout{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    font-family: "OverpassMono-Bold";
    color: var(--text0);
    background: var(--background0);
    user-select: none;
}

.base-layout .el-header {
    padding: 0px;
}

.base-layout .el-main {
    position: absolute;
    top: 32px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 0px;
    border-top: 1px solid var(--border0);
}


</style>

<style>
@font-face {
    font-family: 'Orbitron-Regular';
    src: url('./assets/font/Orbitron-Regular.ttf') format('truetype');
}

@font-face {
    font-family: 'Orbitron-Bold';
    src: url('./assets/font/Orbitron-Bold.ttf') format('truetype');
}

@font-face {
    font-family: 'OverpassMono-Regular';
    src: url('./assets/font/OverpassMono-Regular.ttf') format('truetype');
}

@font-face {
    font-family: 'OverpassMono-Bold';
    src: url('./assets/font/OverpassMono-Bold.ttf') format('truetype');
}

body {
    font-family: "OverpassMono-Regular", 'Microsoft Yahei', sans-serif;
}
</style>
