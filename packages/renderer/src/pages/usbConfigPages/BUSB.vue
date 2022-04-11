<template>
    <div class="busb-device-info">
        <PvlBtn @click="Click">{{props.title}}</PvlBtn>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          BUSB.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.07
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
    * 1.0|Egahp|2022.04.07|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import PvlBtn from '../../components/util/PvlBtn.vue';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props{
    title:string
}

const props = withDefaults(defineProps<Props>(),{
    title:"BUTTON"
})

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event: 'click'): void
}

const emit = defineEmits<Emit>()
/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
const Click = ():void=>{
    emit("click");
}
/* computed ------------------------------------------------------------------*/

/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.busb-device-info{
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