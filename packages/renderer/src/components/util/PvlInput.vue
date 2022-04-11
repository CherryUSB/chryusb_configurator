<template>
    <div class="pvl-input" :style="GetStyle">
        <div class="pvl-input-title"><slot></slot></div>
        <input class="pvl-input-core" 
            type="text" 
            spellcheck="false"
            :readonly="props.disable"
            :placeholder="props.placeholder"
            :value="text"
            @input="onInput($event)"
            @blur="onBlur"
            @focus="onFocus"
            @keydown.enter="onEnter"
            ref="inputdom"
            >
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlInput.vue
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
import { computed, ref, watch } from 'vue';

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props
{
    disable?: boolean,
    val:string,
    placeholder?:string,
    immediate?:boolean,
}

const props = withDefaults(defineProps<Props>(),{
    disable:false,
    val:"",
    placeholder:"",
    immediate:false,
})

watch(
    ()=>props.val,
    (nval)=>{
        text.value = nval;
    }
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"update:val", val:string):void,
    (event:"onChange"):void
}

const emit = defineEmits<Emit>();
/* data ----------------------------------------------------------------------*/
const inputdom:any = ref(null);
let text = ref(props.val);
let sel = ref(false);

/* methods -------------------------------------------------------------------*/
function blur():void {
    if (inputdom.value){
        inputdom.value.blur();
    }
}

const onInput = (event:any):void => {
    text.value = event.target.value;

    if (props.immediate){
        emit('update:val', text.value);
        emit('onChange');
    }
}

const onBlur = ():void => {
    emit('update:val', text.value);
    emit('onChange');
    sel.value = false;
}

const onFocus = ():void => {
    if(!props.disable)
    {
        sel.value = true;
    }
}

const onEnter = ():void => {
    blur();
}
/* computed ------------------------------------------------------------------*/
const GetStyle = computed(():any=>{
    if (props.disable){
        return {
            "--color":"var(--text2)",
            "--border":"var(--border2)",
            "--tbackground":"var(--background1)",
        }
    }

    if (sel.value)
    {
        return {
            "--color":"var(--text1)",
            "--border":"var(--primary0)",
            "--tbackground":"var(--primary0)",
        }
    }
    else{
        return {
            "--color":"var(--text0)",
            "--border":"var(--border0)",
            "--tbackground":"var(--background1)",
        }
    }
})
/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/

</script>

<style scoped>
.pvl-input{
    display: flex;

    width: 200px;
    height: 30px;
    line-height: 34px;

    --color:var(--text0);
    --border:var(--border0);
    --background:var(--background1);
    --tbackground: var(--primary0);

    border: 1px solid var(--border);
    color: var(--color);
    background: var(--background1);

    transition: ease-in 100ms;
}

.pvl-input-title{
    padding: 0px 5px;
    width: 90px;

    font-size: inherit;
    line-height: inherit;
    text-align: center;

    border-right: 1px solid var(--border);
    color: var(--color);
    background: var(--tbackground);
}

.pvl-input-core{
    padding: 0px 5px;
    width: 90px;

    text-align: center;
    font-size: inherit;
    font-family:inherit;

    cursor:text;
    outline-style: none;
    border: none;

    caret-color: var(--text0);
    color: var(--color);
    background: var(--background0);
}

.pvl-input-core::selection {
    background: var(--text2);
}


</style>