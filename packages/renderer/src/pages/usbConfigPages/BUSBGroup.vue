<template>
    <div class="busb-group">
        <PvlBtn @click="Click(EUSBClass.UNKNOWN)">添加 IAD 接口关联描述符</PvlBtn>
        <PvlBtn @click="Click(EUSBClass.MSC)">初始化为 MSC</PvlBtn>
        <PvlBtn @click="Click(EUSBClass.HID)">初始化为 HID</PvlBtn>
        <PvlBtn @click="Click(EUSBClass.CDC_ACM)">初始化为 CDC ACM</PvlBtn>
        <PvlBtn :disable="true" @click="Click(EUSBClass.UNKNOWN)">初始化为 UAC 1.0</PvlBtn>
        <PvlBtn :disable="true" @click="Click(EUSBClass.UNKNOWN)">初始化为 UAC 2.0</PvlBtn>
        <PvlBtn :disable="true" @click="Click(EUSBClass.UNKNOWN)">初始化为 UVC</PvlBtn>
    </div>
</template>


<script setup lang="ts">
/****
    ******************************************************************************
    * @file          BUSBGroup.vue
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
import PvlBtn from '../../components/util/PvlBtn.vue';
import {EUSBClass} from '../../mainModules/UsbConfigRender';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event: 'click', index:EUSBClass): void;
}

const emit = defineEmits<Emit>()
/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
const Click = (index:EUSBClass):void=>{
    emit("click",index);
}
/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.busb-group{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: center;
    align-content: center;
}

.button{
    margin: 5px;
    width: 80%;
    height: 30px;
    font-size: 16px;
    line-height: 32px;
}
</style>