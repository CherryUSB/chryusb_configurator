<template>
    <div class="cbase">
        
        <div class="cbase-1">
            <PvlDropDown :list="usbList" @on-list="onUsb">{{infoStr.usb}}</PvlDropDown>
            <PvlInput @on-change="check" v-model:val="infoStr.ep0size">EP0SIZE</PvlInput>
        </div>

        <div class="cbase-2">
            <PvlInput @on-change="check" v-model:val="infoStr.class">CLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.subclass">SubCLASS</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.protocol">PROTOCOL</PvlInput>
        </div>

        <div class="cbase-3">
            <PvlInput @on-change="check" v-model:val="infoStr.pid">PID</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.vid">VID</PvlInput>
            <PvlInput @on-change="check" v-model:val="infoStr.version">VERSION</PvlInput>
        </div>
    </div>
</template>
<script setup lang="ts">
/****
    ******************************************************************************
    * @file          cBase.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.02
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
    * 1.0|Egahp|2022.04.02|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import {ref,Ref, reactive, onMounted, watch, nextTick} from 'vue'
import { Pvl } from '../../Pvl';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import PvlInput from '../../components/util/PvlInput.vue';
import {num2str, str2num, isUint8, isUint16} from './usbConfigUtil';
import {IUSBBaseInfo, IUSBDeviceInfo} from '../../mainModules/usbDescriptor'
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/


interface IUSBDeviceInfoStr {
    usb:string,
    class:string,
    subclass:string,
    protocol:string,
    ep0size:string,
    pid:string,
    vid:string,
    version:string
}

interface Props
{
    info:IUSBDeviceInfo
}

const props = withDefaults(defineProps<Props>(),{
    info: ()=>{
        return <IUSBDeviceInfo>{
            usb:1.1,
            class:0x00,
            subclass:0x00,
            protocol:0x00,
            ep0size:64,
            pid:0xffff,
            vid:0xffff,
            version:1
        }}
})

watch(
    ()=>props.info,
    (nval:IUSBDeviceInfo)=>{
        info = nval;
        info2Str(info, infoStr);
    },
    {deep:true}
)
/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBDeviceInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>()
/* data ----------------------------------------------------------------------*/


let info:IUSBDeviceInfo = reactive(props.info);
let infoStr:IUSBDeviceInfoStr = reactive({} as IUSBDeviceInfoStr);

let usbList:Pvl.IList[] = reactive([
    {disable:false, label:"USB Version 1.1"},
    {disable:false, label:"USB Version 2.0"},
    {disable:false, label:"USB Version 2.1"}
])

/* methods -------------------------------------------------------------------*/


function info2Str(info:IUSBDeviceInfo, infoStr:IUSBDeviceInfoStr):void{
    if (info.usb == 2.1){
        infoStr.usb = "USB Version 2.1";
    } else if(info.usb == 2) {
        infoStr.usb = "USB Version 2.0";
    } else {
        infoStr.usb = "USB Version 1.1";
    }

    infoStr.class = num2str(info.class, 16, 2);
    infoStr.subclass = num2str(info.subclass, 16, 2);
    infoStr.protocol = num2str(info.protocol, 16, 2);
    infoStr.ep0size = num2str(info.ep0size);
    infoStr.pid = num2str(info.pid, 16, 4);
    infoStr.vid = num2str(info.vid, 16, 4);
    infoStr.version = num2str(info.version);
}

function str2Info(infoStr:IUSBDeviceInfoStr, info:IUSBDeviceInfo):void{
    if (infoStr.usb === "USB Version 2.1"){
        info.usb = 2.1
    } else if(infoStr.usb === "USB Version 2.0") {
        info.usb = 2.0
    } else {
        info.usb = 1.1
    }

    var _class = str2num(infoStr.class);
    var _subclass = str2num(infoStr.subclass);
    var _protocol = str2num(infoStr.protocol);
    var _ep0size = str2num(infoStr.ep0size);
    var _pid = str2num(infoStr.pid);
    var _vid = str2num(infoStr.vid);
    var _version = str2num(infoStr.version);

    info.class = isUint8(_class) ? _class : info.class;
    info.subclass = isUint8(_subclass) ? _subclass : info.subclass;
    info.protocol = isUint8(_protocol) ? _protocol : info.protocol;
    info.ep0size = (!isNaN(_ep0size) && _ep0size <= 64 && _ep0size >= 0) ? _ep0size : info.ep0size;
    info.pid = isUint16(_pid) ? _pid : info.pid;
    info.vid = isUint16(_vid) ? _vid : info.vid;
    info.version = isUint8(_version) ? _version : info.version;

    info2Str(info, infoStr);
    emit("update:info", info);
    emit("update");
}

const check = ():void => {
    nextTick(()=>{
        str2Info(infoStr, info);
    })
}

const onUsb:Pvl.IOnList  = (index:number, list?: Array<Pvl.IList>):void =>{
    infoStr.usb = usbList[index].label;
    check();
}
/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    info2Str(props.info, infoStr)
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.cbase {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: center;
    align-content: center;
}

.cbase-1{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
}

.cbase-2{
    display: flex;
    flex-wrap:nowrap;
    flex-direction: column;
}

.cbase-3{
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

.dropdown :deep(.dropdown-list .button)
{
    padding: 0px 10px;
    text-align: center;
}



</style>