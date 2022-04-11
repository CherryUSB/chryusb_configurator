<template>
    <div class="usb-config-info">
        <div class="usb-config-info-1">
            <PvlDropDown @on-list="onSelfpower" :list="selfPowerList">{{infoStr.selfpower}}</PvlDropDown>
            <PvlDropDown @on-list="onRemotewakeup" :list="remotewakeupList">{{infoStr.remotewakeup}}</PvlDropDown>
        </div>

        <div class="usb-config-info-1">
            <PvlDropDown @on-list="onStr" :list="strList">{{infoStr.string}}</PvlDropDown>
            <PvlInput @on-change="check" v-model:val="infoStr.power">POWER mA</PvlInput>
        </div>
    </div>
</template>


<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBConfigInfo.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.04
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
    * 1.0|Egahp|2022.04.04|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import { nextTick, onMounted, reactive, watch } from 'vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import PvlInput from '../../components/util/PvlInput.vue';
import { IUSBConfigInfo, IUSBBaseInfo, IUSBStringInfo } from '../../mainModules/usbDescriptor';
import { Pvl } from '../../Pvl';
import { num2str, str2num } from './usbConfigUtil';

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface IUSBConfigInfoStr{
    string:string,
    selfpower:string,
    remotewakeup:string,
    power:string
}

interface Props{
    info:IUSBConfigInfo,
    strs:IUSBStringInfo[]
}

const props = withDefaults(defineProps<Props>(),{
    info: ()=>{
        return{
            string:0,
            selfpower:false,
            remotewakeup:false,
            power:500,
            group:[]
        }
    },
    strs: ()=> []
});

watch(
    ()=>props.info,
    (nval:IUSBConfigInfo)=>{
        info = nval;
        updateStr();
        info2Str(props.info, infoStr);
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
    (event:"update:info", info:IUSBConfigInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/

let info:IUSBConfigInfo = reactive(props.info);
let infoStr:IUSBConfigInfoStr = reactive({} as IUSBConfigInfoStr);

let strList:Pvl.IList[] = reactive([
    {disable:false, label:"No String"}
])

let selfPowerList:Pvl.IList[] = reactive([
    {disable:false, label:"Self Power"},
    {disable:false, label:"BUS Power"}
])

let remotewakeupList:Pvl.IList[] = reactive([
    {disable:false, label:"Remote Wakeup"},
    {disable:false, label:"Disable Wakeup"}
])
/* methods -------------------------------------------------------------------*/
function updateStr():void{
    strList.splice(0,strList.length);
    
    strList.push({disable:false, label:"No String"})

    props.strs.forEach(item => {
        strList.push({disable:false, label: item.name});
    });

    var flag = true;
    if (strList.length > 1)
    {
        for (let i=0;i<strList.length;i++)
        {
            if (infoStr.string == strList[i].label)
            {
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

function info2Str(info:IUSBConfigInfo, infoStr:IUSBConfigInfoStr):void{

    infoStr.string = strList[info.string].label;

    if (info.selfpower){
        infoStr.selfpower = selfPowerList[0].label;
    }
    else{
        infoStr.selfpower = selfPowerList[1].label;
    }

    if (info.remotewakeup){
        infoStr.remotewakeup = remotewakeupList[0].label;
    } else {
        infoStr.remotewakeup = remotewakeupList[1].label;
    }

    infoStr.power = num2str(info.power, 10);
}

function str2Info(infoStr:IUSBConfigInfoStr, info:IUSBConfigInfo):void{
    var _power = str2num(infoStr.power);
    info.power = (!isNaN(_power) && (_power <= 500) && (_power >= 0)) ?  _power : info.power;

    info.selfpower = infoStr.selfpower == "Self Power" ? true : false;
    info.remotewakeup = infoStr.remotewakeup == "Remote Wakeup" ? true : false;

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

const onRemotewakeup:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.remotewakeup = remotewakeupList[index].label;
    check();
}

const onSelfpower:Pvl.IOnList = (index:number, list?:Array<Pvl.IList>):void => {
    infoStr.selfpower = selfPowerList[index].label;
    check();
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
.usb-config-info {
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

.usb-config-info-1{
    width: 100%;;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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