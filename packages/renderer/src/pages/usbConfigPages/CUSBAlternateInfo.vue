<template>
    <div class="usb-alternate-info">
        <div class="usb-alternate-info-1">
            <PvlDropDown @on-list="onStr" :list="strList">{{infoStr.string}}</PvlDropDown>
            <PvlInput @on-change="check" v-model:val="infoStr.class">CLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.subclass">SubCLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.protocol">PROTOCOL</PvlInput>
        </div>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBAlternateInfo.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.08
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
    * 1.0|Egahp|2022.04.08|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import PvlInput from '../../components/util/PvlInput.vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import {IUSBAlternateInfo, IUSBStringInfo} from '../../mainModules/usbDescriptor';
import { nextTick, onMounted, reactive, watch } from 'vue';
import { Pvl } from '../../Pvl';
import { isUint8, num2str, str2num } from './usbConfigUtil';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface IUSBAlternateInfoStr {
    string:string,
    class:string,
    subclass:string,
    protocol:string
}

interface Props{
    info:IUSBAlternateInfo,
    strs:IUSBStringInfo[]
}

const props = withDefaults(defineProps<Props>(),{
    info:()=>{
        return{
            string:0,
            class:0,
            subclass:0,
            protocol:0,
            endpoint:[]
        }
    },
    strs:()=>[]
})

watch(
    ()=>props.info,
    (nval:IUSBAlternateInfo)=>{
        info = nval;
        info2Str(nval, infoStr);
    },
    {deep:true}
)

watch(
    ()=>props.strs,
    (nval:IUSBStringInfo[])=>{
        updateStr();
        info2Str(props.info, infoStr);
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBAlternateInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
let info:IUSBAlternateInfo = reactive(props.info);
let infoStr:IUSBAlternateInfoStr = reactive({} as IUSBAlternateInfoStr);

let strList:Pvl.IList[] = reactive([
    {label:"No String"}
])

/* methods -------------------------------------------------------------------*/
function updateStr():void{
    strList.splice(0, strList.length);
    strList.push({label:"No String"});

    props.strs.forEach(item=>{
        strList.push({label:item.name});
    });

    var flag = true;
    if (strList.length > 1){
        for (let i=0; i<strList.length; i++){
            if (infoStr.string == strList[i].label){
                info.string = i;
                flag = false;
                break;
            }
        }
    }

    if (flag){
        info.string = 0;
    }

}


function info2Str(info:IUSBAlternateInfo, infoStr:IUSBAlternateInfoStr):void{
    if (info.string >= strList.length){
        info.string = 0;
    }
    infoStr.string = strList[info.string].label;

    infoStr.class = num2str(info.class, 16, 2);
    infoStr.subclass = num2str(info.subclass, 16, 2);
    infoStr.protocol = num2str(info.protocol, 16, 2);
}

function str2Info(infoStr:IUSBAlternateInfoStr, info:IUSBAlternateInfo):void{
    var _class = str2num(infoStr.class);
    var _subclass = str2num(infoStr.subclass);
    var _protocol = str2num(infoStr.protocol);

    info.class = isUint8(_class) ? _class : info.class;
    info.subclass = isUint8(_subclass) ? _subclass : info.subclass;
    info.protocol = isUint8(_protocol) ? _protocol :info.protocol;
    
    var flag = true;

    for (let i=0;i<strList.length;i++){
        if (infoStr.string == strList[i].label){
            flag = false;
            info.string = i;
        }
    }

    if (flag){
        info.string = 0;
    }

    info2Str(info, infoStr);
    emit("update:info", info);
    emit("update");
}

const check = ():void => {
    nextTick(()=>{
        str2Info(infoStr, info);
    })
}

const onStr:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.string = strList[index].label;
    check();
}

/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    updateStr();
    info2Str(props.info, infoStr);
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.usb-alternate-info{
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: center;
    align-content: center;
}

.usb-alternate-info-1{
    display: flex;
    flex-wrap:nowrap;
    flex-direction: column;
}

.dropdown {
    margin: 5px;
}

.pvl-input{
    margin: 5px;
}

.dropdown :deep(.button){
    font-size: 16px;
    line-height: 32px;
    height: 30px;
    width: 180px;
}
.dropdown :deep(.dropdown-list)
{
    padding: 5px 0px;
}

.dropdown :deep(.dropdown-list .button)
{
    padding: 0px 10px;
    text-align: center;
}
</style>