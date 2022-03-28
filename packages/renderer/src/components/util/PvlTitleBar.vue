<script lang="ts" setup>
import { ref } from "vue";
import {ipcRenderer} from "electron";
import { deflate } from "zlib";

interface Props {
    title: string,
    version: string
}

const props = withDefaults(defineProps<Props>(),{
    title: "Product",
    version: "1.0.0"
})

function ButtonMenu():void{
    console.log("ButtonMenu")
}

function ButtonMin():void{
    ipcRenderer.send("main.window.min")
}

function ButtonMax():void{
    ipcRenderer.send("main.window.max")
}

function ButtonClose():void{
    ipcRenderer.send("main.window.close")
}
</script>

<template>
    <div class="title">
        <el-row :gutter="0" type="flex" justify="start">
            <el-col :span="2" :offset="1">
                <img style="height:32px;" src="../../assets/logo.png" />
            </el-col>

            <el-col :span="17">{{ props.title +" " + props.version}}</el-col>
            <el-col :span="1"><button @click="ButtonMenu()"  class="mdi mdi-18px title-btn mdi-menu-down"                    ></button></el-col>
            <el-col :span="1"><button @click="ButtonMin()"   class="mdi mdi-18px title-btn mdi-minus"                        ></button></el-col>
            <el-col :span="1"><button @click="ButtonMax()"   class="mdi mdi-14px title-btn mdi-square-outline"               ></button></el-col>
            <el-col :span="1"><button @click="ButtonClose()" class="mdi mdi-18px title-btn mdi-close title-btn-danger"   ></button></el-col>
        </el-row>
    </div>
</template>

<style scoped>

.title{
    margin:0px;
    padding: 0px;
    width: 100%;
    color: var(--text0);
    line-height: 32px;

    font-size: 14px;
    font-family: "Orbitron-Regular";
    letter-spacing: 1px;

    user-select: none;
    -webkit-app-region: drag;

    background: var(--background1);
}

.title .el-row{
    height: 32px;
}

.title-btn{
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 32px;
    color: var(--text0);
    line-height: 26px;
    font-size: 14px;
    border: none;
    outline: none;
    -webkit-app-region: no-drag;
    background: var(--background1);
    transition: ease-in 100ms;
}

.title-btn:hover{
    color: var(--text1);
    background: var(--primary0);
}

.title-btn:active{
    color: var(--text1);
    background: var(--primary2);
}

.title-btn-danger:hover{
    color: var(--text1);
    transition: ease-in 100ms;
    background: var(--danger0);
}

</style>
