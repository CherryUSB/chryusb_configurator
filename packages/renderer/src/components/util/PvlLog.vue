<template>
    <div class="log-panel">
        <div class="log-title">
            <PvlRadios :radio="0" :radios="logRadios" @onRadios="OnRadios"></PvlRadios>
            <PvlBtn @click="LogClean" style="margin-left: auto">CLEAN</PvlBtn>
        </div>
        <div  ref="logdom" class="log" v-html="msgs[msgIndex]" v-if="reloadFlag"></div>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlLog.vue
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
import {nextTick, onMounted, reactive, Ref, ref} from 'vue';
import theme from '../../theme';
import { Pvl } from '../../Pvl';
import PvlRadios from './PvlRadios.vue';
import PvlBtn from './PvlBtn.vue';

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/

/* emits ---------------------------------------------------------------------*/

/* expose --------------------------------------------------------------------*/
defineExpose({LogI,LogW,LogE,LogClean})
/* data ----------------------------------------------------------------------*/
const logRadios: Array<Pvl.IRadio> = reactive([
    {checked: true, label: "ALL" },
    {checked: false, label: "INFO" },
    {checked: false, label: "WARN" },
    {checked: false, label: "ERROR" }
])

const msgEmpty:Array<string> = [
    "<pre class='__a__'></pre>",
    "<pre class='__a__'></pre>",
    "<pre class='__a__'></pre>",
    "<pre class='__a__'></pre>"
]

const logdom = ref<any>(null)

var msgIndex:Ref<number> = ref(0);
var msgs:Array<string> = reactive(msgEmpty);
var reloadFlag:Ref<boolean> = ref(false);

/* methods -------------------------------------------------------------------*/
const OnRadios:Pvl.IOnRadios = function(index:number, radios?:Array<Pvl.IRadio>){
    msgIndex.value = index;
}

function Reload():void{
    reloadFlag.value = false;
    nextTick(()=>{
        reloadFlag.value = true;
        nextTick(()=>{
            if (logdom.value){
                logdom.value.scrollTop = logdom.value.scrollHeight;
            }
        })
    })
}

function LogE(msg:string):void{
    var msgE = "<pre class='__e__'>[E] "+ msg + "</pre></pre>";
    msgs[0] = msgs[0].substr(0, msgs[0].length-6) + msgE;
    msgs[3] = msgs[3].substr(0, msgs[3].length-6) + msgE;
    Reload();
}

function LogW(msg:string):void{
    var msgW = "<pre class='__w__'>[W] "+ msg + "</pre></pre>";
    msgs[0] = msgs[0].substr(0, msgs[0].length-6) + msgW;
    msgs[2] = msgs[2].substr(0, msgs[2].length-6) + msgW;
    Reload();
}

function LogI(msg:string):void{
    var msgI = "<pre class='__i__'>[I] "+ msg + "</pre></pre>";
    msgs[0] = msgs[0].substr(0, msgs[0].length-6) + msgI;
    msgs[1] = msgs[1].substr(0, msgs[1].length-6) + msgI;
    Reload();
}

function LogClean():void {
    msgs[0] = "<pre class='__a__'></pre>";
    msgs[1] = "<pre class='__a__'></pre>";
    msgs[2] = "<pre class='__a__'></pre>";
    msgs[3] = "<pre class='__a__'></pre>";
    Reload();

    // LogI("hello log");
}

/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    Reload();
})
/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.log-title {
    display: flex;
    justify-content: flex-start;
}

.log-title :deep(.radio){
    width: 20%;
    border-top: none;
    border-left: none;
}

.log-title :deep(.button){
    width: 20%;
    border-top: none;
    border-left: none;
    border-right: none;
}

.log {
    position: absolute;
    display: flex;
    margin: 0px;
    padding: 10px;
    top: 21px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    background: var(--background0);

    font-size: 14px;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    user-select: text;
    -webkit-user-select: text;
    overflow-y: scroll;
}

.log::-webkit-scrollbar{
    width: 10px;
    background-color: var(--background1);
}
.log::-webkit-scrollbar-track {
    background-color: var(--background0);
}

.log::-webkit-scrollbar-thumb{
    background-color: var(--background1);
    border-top: 10px solid var(--background0);
    border-bottom: 10px solid var(--background0);
}

.log:hover::-webkit-scrollbar-thumb{
    background-color: var(--primary0);
}

</style>

<style>
.__a__{
    margin: 0px;
}

/* 错误样式 */
.__e__{
    margin: 0px;
    color: var(--danger0);
    font-family: "OverpassMono-Regular", 'Microsoft Yahei', sans-serif;
    white-space: pre-wrap;
}
.__e__::selection{
    background: var(--danger2);;
}
.__e__ a{
    margin-left: 5px;
    margin-right: 5px;
    color: var(--danger0);
    text-decoration: underline;
}
.__e__ a::selection{
    background: var(--danger2);;
}
.__e__ a:hover{
    color: var(--primary1);
}

/* 警告样式 */
.__w__{
    margin: 0px;
    color: var(--warning0);
    font-family: "OverpassMono-Regular", 'Microsoft Yahei', sans-serif;
    white-space: pre-wrap;
}
.__w__::selection{
    background: var(--warning2);
}
.__w__ a{
    margin-left: 5px;
    margin-right: 5px;
    color: var(--warning0);
    text-decoration: underline;
}
.__w__ a::selection{
    background: var(--warning2);
}
.__w__ a:hover{
    color: var(--primary1);
}

/* 信息样式 */
.__i__{
    margin: 0px;
    color: var(--success0);
    font-family: "OverpassMono-Regular", 'Microsoft Yahei', sans-serif;
    white-space: pre-wrap;
}
.__i__::selection{
    background: var(--success2);
}
.__i__ a{
    margin-left: 5px;
    margin-right: 5px;
    color: var(--success0);
    text-decoration: underline;
}
.__i__ a::selection{
    background: var(--success2);
}
.__i__ a:hover{
    color: var(--primary1);
}
</style>