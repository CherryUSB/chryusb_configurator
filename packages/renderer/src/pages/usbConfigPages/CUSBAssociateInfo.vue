<template>
    <div class="usb-associate-info">
        <div class="usb-associate-info-1">
            <PvlDropDown @on-list="onMaster" :list="ifListM">{{infoStr.first}}</PvlDropDown>
            <PvlInput @on-change="check" v-model:val="infoStr.count">COUNT</PvlInput>
            <PvlDropDown @on-list="onStr" :list="strList">{{infoStr.string}}</PvlDropDown>
        </div>
        <div class="usb-associate-info-2">
            <PvlInput @on-change="check" v-model:val="infoStr.class">CLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.subclass">SubCLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.protocol">PROTOCOL</PvlInput>
        </div>
    </div>
</template>


<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBAssociate.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.09
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
    * 1.0|Egahp|2022.04.09|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import PvlInput from '../../components/util/PvlInput.vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import { IUSBAssociateInfo, IUSBInterfaceInfo, IUSBStringInfo } from '../../mainModules/usbDescriptor';
import { nextTick, onMounted, reactive, watch } from 'vue';
import { react } from '@babel/types';
import { Pvl } from '../../Pvl';
import { isUint8, num2str, str2num } from './usbConfigUtil';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface IUSBAssociateInfoStr {
    string:string,
    class:string,
    subclass:string,
    protocol:string,
    first:string,
    count:string
}

interface Props{
    info:IUSBAssociateInfo,
    ifs:number,
    strs:IUSBStringInfo[]
}

const props = withDefaults(defineProps<Props>(),{
    info:()=>{
        return {
            string:0,
            class:0,
            subclass:0,
            protocol:0,
            first:0,
            count:0
        }
    },
    ifs:0,
    strs:()=>[]
})

watch(
    ()=>props.info,
    (nval:IUSBAssociateInfo)=>{
        info = nval;
        updateStr();
        updateIf();
        info2Str(props.info, infoStr);
    },
    {deep:true}
)

watch(
    ()=>props.strs,
    (nval:IUSBStringInfo[])=>{
        updateStr();
        updateIf();
        info2Str(props.info, infoStr);
    },
    {deep:true}
)

watch(
    ()=>props.ifs,
    (nval:number)=>{
        updateStr();
        updateIf();
        info2Str(props.info, infoStr);
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBAssociateInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
let info:IUSBAssociateInfo = reactive(props.info);
let infoStr:IUSBAssociateInfoStr = reactive({} as IUSBAssociateInfoStr);

let ifListM:Pvl.IList[] = reactive([]);

let strList:Pvl.IList[] = reactive([
    {label:"No String"}
])

/* methods -------------------------------------------------------------------*/
function updateIf():void {
    ifListM.splice(0, ifListM.length);

    for (let idx = 0;idx <props.ifs; idx++){
        ifListM.push({label:"INTERFACE:" + idx.toString()})
    }
}

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

function info2Str(info:IUSBAssociateInfo, infoStr:IUSBAssociateInfoStr):void{
    infoStr.string = strList[info.string].label;

    if (ifListM.length > 0){
        if (ifListM.length > info.first){
            let pos = ifListM[info.first].label.lastIndexOf(':');
            infoStr.first = "FIRST IF:" + ifListM[info.first].label.substring(pos+1);
        }
    } else {
        infoStr.first = "FIRST " + "IF:" + "NONE"
    }

    infoStr.count = num2str(info.count);
    infoStr.class = num2str(info.class, 16, 2);
    infoStr.subclass = num2str(info.subclass, 16, 2);
    infoStr.protocol = num2str(info.protocol, 16, 2);
}

function str2Info(infoStr:IUSBAssociateInfoStr, info:IUSBAssociateInfo):void{
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

    if (ifListM.length > 0){
        let pos = infoStr.first.lastIndexOf(':');
        let _master = str2num(infoStr.first.substring(pos+1))
        info.first = isUint8(_master) ? _master : 0;
    } else {
        info.first = 0;
    }

    if ((str2num(infoStr.count) + info.first) <= ifListM.length )
    {
        info.count = str2num(infoStr.count);
    } else {
        info.count = ifListM.length - info.first;
    }

    info2Str(info, infoStr);
    emit("update:info", info);
    emit("update");
}

const check= ():void => {
    nextTick(()=>{
        str2Info(infoStr, info);
    })
}

const onMaster:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    if (ifListM.length > 0){
        let pos = ifListM[index].label.lastIndexOf(':');
        infoStr.first = "FIRST IF:" + ifListM[index].label.substring(pos+1);
    } else {
        infoStr.first = "FIRST IF:" + "NONE"
    }
    check();
}

const onStr:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.string = strList[index].label;
    check();
}

/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    updateIf();
    updateStr();
    info2Str(props.info, infoStr);
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.usb-associate-info{
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

.usb-associate-info-1{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
}

.usb-associate-info-2{
    display: flex;
    flex-wrap:nowrap;
    flex-direction: column;
    justify-content: center;
}

.dropdown {
    margin: 2px;
}

.pvl-input{
    margin: 2px;
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