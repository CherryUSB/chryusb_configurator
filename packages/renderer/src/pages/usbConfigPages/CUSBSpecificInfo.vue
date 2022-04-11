<template>
    <div class="usb-specific-info">
        <div class="usb-specific-info-1">
            <PvlDropDown @on-list="onList" :list="listClass">{{infoStr.type}}</PvlDropDown>
        </div>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBSpecificInfo.vue
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
import { nextTick } from 'process';
import { onMounted, reactive, watch } from 'vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import { EUSBClass } from '../../mainModules/UsbConfigRender';
import { IUSBSpecificInfo } from '../../mainModules/usbDescriptor';
import { Pvl } from '../../Pvl';

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface IUSBSpecificInfoStr {
    type:string
}

interface Props{
    info:IUSBSpecificInfo
}

const props = withDefaults(defineProps<Props>(),{
    info:()=>{
        return{
            type:0
        }
    }
})

watch(
    ()=>props.info,
    (nval:IUSBSpecificInfo)=>{
        info2Str(props.info, infoStr);
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBSpecificInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
let info:IUSBSpecificInfo = reactive(props.info);
let infoStr:IUSBSpecificInfoStr = reactive({} as IUSBSpecificInfoStr);

let listClass:Pvl.IList[] = reactive([
    {label:"UNKNOWN"},
    {label:"MSC"},
    {label:"HID"},
    {label:"CDC ACM CTRL"},
    {label:"CDC ACM DATA"},
])

const map: { [key: string]: number } = {
    "UNKNOWN": EUSBClass.UNKNOWN,
    "MSC": EUSBClass.MSC,
    "HID": EUSBClass.HID,
    "CDC ACM CTRL": EUSBClass.CDC_ACM,
    "CDC ACM DATA": EUSBClass.CDC_ACM_DATA,
}
/* methods -------------------------------------------------------------------*/
function info2Str(info:IUSBSpecificInfo, infoStr:IUSBSpecificInfoStr):void {
    infoStr.type = listClass[info.type].label;
}

function str2Info(infoStr:IUSBSpecificInfoStr, info:IUSBSpecificInfo):void {
    info.type = map[infoStr.type];

    info2Str(info, infoStr);
    emit("update:info", info);
    emit("update");
}

const check = ():void => {
    nextTick(()=>{
        str2Info(infoStr, info);
    })
}

const onList:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.type = listClass[index].label;
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
.usb-specific-info{
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

.usb-specific-info-1{
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