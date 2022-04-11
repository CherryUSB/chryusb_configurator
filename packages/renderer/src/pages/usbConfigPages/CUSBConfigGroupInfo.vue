<template>
    <div class="usb-config-group-info">
        <PvlBtn @click="click">{{str}}</PvlBtn>

    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          CUSBConfigGroupInfo.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.05
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
    * 1.0|Egahp|2022.04.05|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import {ref, Ref, reactive, watch, onMounted } from 'vue';
import PvlDropDown from '../../components/util/PvlDropDown.vue';
import { open, UsbConfigFile } from '../../mainModules/UsbConfigRender';
import { IUSBConfigGroupInfo } from '../../mainModules/usbDescriptor';
import PvlBtn from '../../components/util/PvlBtn.vue';
import * as path from 'path'

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props{
    info:IUSBConfigGroupInfo,
}

const props = withDefaults(defineProps<Props>(),{
    info:"",
})

watch(
    ()=>props.info,
    (nval:string)=>{
        info.value = nval;
        str.value = path.basename(info.value);
    }
)



/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:info", info:IUSBConfigGroupInfo):void
    (event:"update"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
let info:Ref<IUSBConfigGroupInfo> = ref(props.info);
let str:Ref<string> = ref("");

/* methods -------------------------------------------------------------------*/
const click = async ():Promise<void> => {
    var filePaths = await open();

    if (filePaths){
        info.value = filePaths[0];
        str.value = path.basename(info.value);
        console.log(info.value);
        emit("update:info", info.value);
        emit("update");
    }
}

/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    str.value = path.basename(props.info);
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.usb-config-group-info{
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

.button{
    width: 80%;
    height: 30px;
    font-size: 16px;
    line-height: 32px;
}

</style>