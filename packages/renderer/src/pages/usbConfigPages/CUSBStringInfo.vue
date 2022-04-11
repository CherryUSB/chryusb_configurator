<template>
    <div class="usb-string-info">
            <PvlInput @on-change="check" v-model:val="info.name">STR NAME</PvlInput>
            <PvlInput @on-change="check" v-model:val="info.value">{{info.name.toUpperCase()}}</PvlInput>
    </div>
</template>
<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBStringInfo.vue
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
import {ref,Ref, reactive, onMounted, watch, nextTick} from 'vue'
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import PvlInput from '../../components/util/PvlInput.vue';
import {num2str, str2num, isUint8, isUint16} from './usbConfigUtil';
import {IUSBBaseInfo, IUSBStringInfo} from '../../mainModules/usbDescriptor'

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props {
    info:IUSBStringInfo
}

const props = withDefaults(defineProps<Props>(),{
    info: ()=>{
        return <IUSBStringInfo>{
            name:"noName",
            value:""
        }
    }
})

watch(
    ()=>props.info,
    (nval:IUSBStringInfo)=>{
        info = nval;
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBStringInfo):void
    (event:"update"):void
}
const emit = defineEmits<Emit>()
/* data ----------------------------------------------------------------------*/
let info = reactive(props.info)
/* methods -------------------------------------------------------------------*/
const check = ():void => {
    nextTick(()=>{
        if(info.value.length>128){
            info.value = props.info.value
        }
        else{
            emit("update:info", info);
            emit("update");
        }
    })
}
/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/

</script>

<style scoped>

.usb-string-info{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: center;
    align-content: center;
}


.dropdown {
    margin: 5px;
}

.pvl-input{
    margin: 5px;
    width: 90%;
}

.pvl-input :deep(input){
    min-width: 100px;
    width: inherit;
}

.pvl-input :deep(.pvl-input-title){
    width: 240px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown :deep(.button){
    font-size: 16px;
    line-height: 32px;
    height: 30px;
    width: 180px;
}


</style>