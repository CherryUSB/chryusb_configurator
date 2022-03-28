<template>
    <div>
        <!-- 标题栏 -->
        <div class="title-panel">
            <PvlBtn>{{ $tm("usbconfig.title.button.file") }}</PvlBtn>
            <PvlBtn>{{ $tm("usbconfig.title.button.project") }}</PvlBtn>
            <PvlBtn>{{ $tm("usbconfig.title.button.view") }}</PvlBtn>
            <PvlBtn>{{ $tm("usbconfig.title.button.compile") }}</PvlBtn>
            <PvlBtn>{{ $tm("usbconfig.title.button.help") }}</PvlBtn>
            <PvlBtn>{{ $tm("usbconfig.title.button.about") }}</PvlBtn>
        </div>

        <!-- 主容器 -->
        <div class="main-panel" v-on:mousemove="MouseMove">
            <!-- 树形图容器 -->
            <div class="left-panel" :style="{ width: resize.treePanel.w + 'px' }">
                <div class="panel file-panel">
                    <PvlRadios :radio="0" :radios="fileRadios" @onRadios="OnFileRadios"><PvlBtn class="mdi mdi-close" @click="FileClose"></PvlBtn></PvlRadios>
                </div>
                <!-- <div class="panel tree-panel">
                    <PvlTree></PvlTree>
                </div> -->
            </div>

            <!-- 调整栏 -->
            <div
                class="panel-hresize"
                v-on:mousedown="MouseDown0"
                :style="{ background: resize.resize0 ? color.primary[0] : color.background[1], left: resize.treePanel.w + 'px' }"
            ></div>

            <div class="right-panel" :style="{ left: resize.treePanel.w + 3 + 'px' }">
                <!-- 按键容器 -->
                <div class="panel button-panel" :style="{ height: resize.buttonPanel.h + 'px' }">
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                </div>

                <!-- 调整栏 -->
                <div
                    class="panel-vresize"
                    v-on:mousedown="MouseDown1"
                    :style="{ background: resize.resize1 ? color.primary[0] : color.background[1], top: resize.buttonPanel.h + 20 + 'px' }"
                ></div>

                <!-- 配置容器 -->
                <div
                    class="panel config-panel"
                    :style="{ top: resize.buttonPanel.h + 30 + 'px', bottom: resize.messagePanel.h + 30 + 'px' }">
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                    <PvlBtn></PvlBtn>
                </div>

                <!-- 调整栏 -->
                <div
                    class="panel-vresize"
                    v-on:mousedown="MouseDown2"
                    :style="{ background: resize.resize2 ? color.primary[0] : color.background[1], bottom: resize.messagePanel.h + 20 + 'px' }"
                ></div>

                <!-- 信息容器 -->
                <div class="panel message-panel" :style="{ height: resize.messagePanel.h + 'px' }">
                    <PvlLog ref = "log"></PvlLog>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
/****
    ******************************************************************************
    * @file          UsbConfig.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.03.28
    ******************************************************************************
    * @attention
    * 
    * <h2><center>&copy; Copyright 2021 Egahp.
    * All rights reserved.</center></h2>
    * 
    * @htmlonly 
    * <span style='font-weight: bold'>History</span> 
    * @endhtmlonly
    * 版本|作者|时间|描述
    * ----|----|----|----
    * 1.0|Egahp|2022.03.28|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import {reactive, onMounted, ref, provide } from "vue";
import theme from "../theme";
import { Pvl } from "../Pvl";
import PvlLog from "../components/util/PvlLog.vue";
import PvlBtn from "../components/util/PvlBtn.vue";
import PvlTree from "../components/util/PvlTree.vue";
import PvlRadios from "../components/util/PvlRadios.vue";


const init_w = 1024;
const init_h = 720;
const init_treePanel_w = 500;
const init_buttonPanel_h = 200;
const init_messagePanel_h = 200;

const color = {
    primary: theme.GetBlock('primary'),
    border: theme.GetBlock('border'),
    text: theme.GetBlock('text'),
    background: theme.GetBlock('background')
}

/* declare -------------------------------------------------------------------*/
interface Point {
    x: number,
    y: number
}

interface Rect {
    w: number,
    h: number
}

/* props ---------------------------------------------------------------------*/

/* emits ---------------------------------------------------------------------*/

/* expose --------------------------------------------------------------------*/

/* data ----------------------------------------------------------------------*/
const log = ref<any>(null)

const resize = reactive({
    resize0: <boolean>false,
    resize1: <boolean>false,
    resize2: <boolean>false,
    pos: <Point>{ x: 0, y: 0 },
    panel: <Rect>{ w: init_w, h: init_h },
    treePanel: <Rect>{ w: init_treePanel_w, h: 0 },
    buttonPanel: <Rect>{ w: 0, h: init_buttonPanel_h },
    messagePanel: <Rect>{ w: 0, h: init_messagePanel_h }
})

var fileRadios: Array<Pvl.IRadio> = reactive([
    { disable: false, checked: true, label: "file1" },
    { disable: false, checked: false, label: "file2" },
    { disable: false, checked: false, label: "file3" },
    { disable: false, checked: false, label: "file4" }
])

/* methods -------------------------------------------------------------------*/
function MouseDown0(event: any): void {
    if ((event.buttons & 0x01) == 0x01) {
        resize.resize0 = true;
        resize.pos.x = event.clientX;
        resize.pos.y = event.clientY;
    }
}

function MouseDown1(event: any): void {
    if ((event.buttons & 0x01) == 0x01) {
        resize.resize1 = true;
        resize.pos.x = event.clientX;
        resize.pos.y = event.clientY;
    }
}

function MouseDown2(event: any): void {
    if ((event.buttons & 0x01) == 0x01) {
        resize.resize2 = true;
        resize.pos.x = event.clientX;
        resize.pos.y = event.clientY;
    }
}

function Resize0Check(): void {
    if (resize.treePanel.w < 300) {
        resize.treePanel.w = 300;
    } else if (resize.panel.w - resize.treePanel.w < 350) {
        resize.treePanel.w = resize.panel.w - 350;
    }
}

function Resize1Check(): void {
    if (resize.buttonPanel.h < 200) {
        resize.buttonPanel.h = 200;
    }
    if (resize.panel.h - resize.buttonPanel.h - resize.messagePanel.h < 320) {
        resize.buttonPanel.h = resize.panel.h - 320 - resize.messagePanel.h;
    }
}

function Resize2Check(): void {
    if (resize.messagePanel.h < 200) {
        resize.messagePanel.h = 200;
    }
    if (resize.panel.h - resize.buttonPanel.h - resize.messagePanel.h < 320) {
        resize.messagePanel.h = resize.panel.h - 320 - resize.buttonPanel.h;
    }
}

function WinResizeCheck(): void {
    Resize0Check();

    if (resize.messagePanel.h < 200) {
        resize.messagePanel.h = 200;
    }

    if (resize.buttonPanel.h < 200) {
        resize.buttonPanel.h = 200;
    }

    if (resize.panel.h - resize.buttonPanel.h - resize.messagePanel.h < 320) {
        if (resize.messagePanel.h > 200) {
            resize.messagePanel.h = resize.panel.h - 320 - resize.buttonPanel.h;
        } else if (resize.buttonPanel.h > 200) {
            resize.buttonPanel.h = resize.panel.h - 320 - 200;
        }
    }
}

function MouseUp(): void {
    if (resize.resize0) {
        Resize0Check();
    }
    else if (resize.resize1) {
        Resize1Check();
    }
    else if (resize.resize2) {
        Resize2Check();
    }

    resize.resize0 = false;
    resize.resize1 = false;
    resize.resize2 = false;
}

function MouseMove(event: any): void {
    if ((event.buttons & 0x01) == 0x01) {
        if (resize.resize0) {
            resize.treePanel.w += event.clientX - resize.pos.x;
            Resize0Check();
            resize.pos.x = event.clientX;
            resize.pos.y = event.clientY;
        }
        else if (resize.resize1) {
            resize.buttonPanel.h += event.clientY - resize.pos.y;
            Resize1Check();
            resize.pos.x = event.clientX;
            resize.pos.y = event.clientY;
        }
        else if (resize.resize2) {
            resize.messagePanel.h -= event.clientY - resize.pos.y;
            Resize2Check();
            resize.pos.x = event.clientX;
            resize.pos.y = event.clientY;
        }
    }
    else {
        resize.resize0 = false;
        resize.resize1 = false;
        resize.resize2 = false;
    }
}

provide("LogI",LogI);
function LogI(msg:string):void
{
    log.value.LogI(msg);
}

provide("LogW",LogW);
function LogW(msg:string):void
{
    log.value.LogW(msg);
}

provide("LogE",LogE);
function LogE(msg:string):void
{
    log.value.LogE(msg);
}

provide("LogClean",LogClean);
function LogClean():void
{
    log.value.LogClean();
}

var fileCloseFlag:boolean = false;
const OnFileRadios:Pvl.IOnRadios = function(index:number, radios?:Array<Pvl.IRadio>){
    if (fileCloseFlag == true)
    {
        fileRadios.splice(index,1);
        console.log("close" + index);
    }
    else{
        console.log("change"  + index);
    }

    fileCloseFlag = false;
}

function FileClose():void{
    fileCloseFlag = true;
}

/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(() => {
    window.onresize = () => {
        resize.treePanel.w += document.documentElement.clientWidth - resize.panel.w;
        resize.panel.w = document.documentElement.clientWidth;
        resize.panel.h = document.documentElement.clientHeight;
        WinResizeCheck()
    }

    document.onmouseup = () => {
        MouseUp()
    }
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.title-panel {
    position: absolute;
    display: flex;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 20px;

    font-size: 14px;
    text-align: center;
    user-select: none;

    justify-content: left;
    align-items: center;

    color: var(--text0);
    background: var(--background1);
    border-bottom: 1px solid var(--border0);
}

.title-panel :deep(.button){
    border:none
}


.main-panel {
    position: absolute;
    top: 21px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    color: var(--text0);
    overflow: hidden;
}

.left-panel {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
}

.right-panel {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
}

.panel-hresize {
    position: absolute;
    top: 20px;
    bottom: 20px;
    width: 3px;
    cursor: w-resize;
}

.panel-vresize {
    position: absolute;
    left: 0px;
    right: 20px;
    height: 3px;
    cursor: s-resize;
}

.panel {
    background: var(--background1);
    border: 1px solid var(--border0);
}

.file-panel {
    position: absolute;
    display: flex;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 20px;
    justify-content: flex-start;
}

.file-panel :deep(.radio){
    padding-right: 0px;
    width: auto;
    min-width: 80px;
    border-top: none;
    border-bottom: none;
    border-left: none;
}

.file-panel :deep(.button){
    margin-left: auto;
    margin-right: 2px;
    margin-top: 2px;
    padding: 0px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 16px;
    border:none;
    border-radius: 16px;
    background:transparent;
}

/* 树形图容器 */
.tree-panel {
    position: absolute;
    top: 30px;
    left: 10px;
    right: 10px;
    bottom: 10px;
}

/* 按键容器 */
.button-panel {
    position: absolute;
    display: flex;
    top: 10px;
    left: 10px;
    right: 10px;

    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
}

.config-panel {
    position: absolute;
    left: 10px;
    right: 10px;
}

.message-panel {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
}
</style>