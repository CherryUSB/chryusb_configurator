<template>
    <div>
        <div class="usb-endpoint-info">
            <div class="usb-endpoint-info-1">
                <PvlDropDown @on-list="onDir" :list="dirList">{{infoStr.direction}}</PvlDropDown>
                <PvlDropDown @on-list="onType" :list="typeList">{{infoStr.type}}</PvlDropDown>
            </div>
            <div class="usb-endpoint-info-2">
                <PvlInput @on-change="check" v-model:val="infoStr.address" >ADDRESS</PvlInput>
                <PvlInput @on-change="check" v-model:val="infoStr.size" >SIZE</PvlInput>
            </div>
            <div class="usb-endpoint-info-3">
                <PvlInput @on-change="check" v-model:val="infoStr.interval" :disable="intervalDisable">INTERVAL</PvlInput>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBEndpointInfo.vue
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
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import PvlInput from '../../components/util/PvlInput.vue';
import { EUSBEndpointDir_IN, EUSBEndpointDir_OUT, EUSBEndpointType } from '../../mainModules/UsbConfigRender';
import { IUSBEndpointInfo } from '../../mainModules/usbDescriptor';
import { Pvl } from '../../Pvl';
import { isUint8, num2str, str2num } from './usbConfigUtil';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface IUSBEndpointInfoStr{
    address:string,
    direction:string,
    type:string,
    size:string,
    interval:string
}

interface Props{
    info:IUSBEndpointInfo
}

const props = withDefaults(defineProps<Props>(),{
    info:()=>{
        return {
            address:0,
            direction:EUSBEndpointDir_IN,
            type:EUSBEndpointType.INTR,
            size:64,
            interval:0
        }
    }
})

watch(
    ()=>props.info,
    (nval:IUSBEndpointInfo)=>{
        info = nval;
        info2Str(props.info, infoStr);
    },
    {deep:true}
)


/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBEndpointInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
let info:IUSBEndpointInfo = reactive(props.info);
let infoStr:IUSBEndpointInfoStr = reactive({} as IUSBEndpointInfoStr);

let intervalDisable = ref(false);

let dirList:Pvl.IList[] = reactive([
    {label:"IN"},
    {label:"OUT"},
])

let typeList:Pvl.IList[] = reactive([
    {label:"Control"},
    {label:"Isochronous"},
    {label:"Bulk"},
    {label:"Interrupt"},
])

/* methods -------------------------------------------------------------------*/
function info2Str(info:IUSBEndpointInfo, infoStr:IUSBEndpointInfoStr):void {
    infoStr.address = num2str(info.address,16,2);
    infoStr.direction = info.direction == EUSBEndpointDir_IN ? dirList[0].label : dirList[1].label;
    infoStr.type = typeList[info.type].label;
    infoStr.size = num2str(info.size);
    infoStr.interval = num2str(info.interval);

    switch(info.type){
        case EUSBEndpointType.CTRL:{
            intervalDisable.value = true;
            break;
        }
        case EUSBEndpointType.ISOC:{
            intervalDisable.value = false;
            break;
        }
        case EUSBEndpointType.BULK:{
            intervalDisable.value = true;
            break;
        }
        case EUSBEndpointType.INTR:{
            intervalDisable.value = false;
            break;
        }

        default:{
            break;
        }
    }
}

function str2Info(infoStr:IUSBEndpointInfoStr, info:IUSBEndpointInfo):void {
    var _address = str2num(infoStr.address);
    var _size = str2num(infoStr.size);
    var _interval = str2num(infoStr.interval);

    info.address = (!isNaN(_address) && (_address <= 127) && (_address >= 1)) ? _address : info.address;
    info.size = (!isNaN(_size) && (_size <= 127) && (_size >= 1)) ? _size : info.size;
    info.interval = isUint8(_interval) ? _interval : info.interval;

    info.direction = infoStr.direction == "IN" ? EUSBEndpointDir_IN : EUSBEndpointDir_OUT;
    
    switch(infoStr.type){
        case "Control":{
            info.type = EUSBEndpointType.CTRL;
            info.interval = 0;
            break;
        }
        case "Isochronous":{
            info.type = EUSBEndpointType.ISOC;
            break;
        }
        case "Bulk":{
            info.type = EUSBEndpointType.BULK;
            info.interval = 0;
            break;
        }
        case "Interrupt":{
            info.type = EUSBEndpointType.INTR;
            break;
        }

        default:{
            break;
        }
    }

    info2Str(info, infoStr)
    emit("update:info", info);
    emit("update")
}


const check = ():void => {
    nextTick(()=>{
        str2Info(infoStr, info);
    })
}

const onDir:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.direction = dirList[index].label;
    check();
}

const onType:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.type = typeList[index].label;
    check();
}
/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    info2Str(props.info, infoStr);
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/

</script>

<style scoped>
.usb-endpoint-info{
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

.usb-endpoint-info-1{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
}

.usb-endpoint-info-2{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    justify-content: center;
}

.usb-endpoint-info-3{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
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