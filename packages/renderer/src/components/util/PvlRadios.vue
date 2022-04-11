<template>
    <div class="radio"
        v-for="(item,index) in props.radios"
        :key="index"
        :index="index"
        :checked="item.checked"
        :disable="item.disable"
        :style="GetStyle(index)"
        @click="RadioClick(index)">
        <span :class="GetIcon(index)"></span>
        <div class="radio-label">{{item.label}}</div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlRadios.vue
    * @brief         radios
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.03.28
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
    * 1.0|Egahp|2022.03.28|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import { onMounted, computed, Ref, ref, reactive, watch} from 'vue';
import theme from '../../theme';
import {Pvl} from "../../Pvl";


/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props {
    disable?:boolean,
    radio:number,
    radios:Array<Pvl.IRadio>
}

let props = withDefaults(defineProps<Props>(),{
    disable:false,
    radio:0,
    radios:()=><Array<Pvl.IRadio>>[]
})

watch(
    ()=>props.radio,
    (nval,oval)=>{
        currentRadio.value = nval;
        lastRadio.value = oval;
    }
)

watch(
    ()=>props.radios,
    (nval)=>{
        radios = nval;
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:'onRadios',radio:number, radios?:Array<Pvl.IRadio>): void
}

const emit = defineEmits<Emit>()

/* data ----------------------------------------------------------------------*/
let lastRadio:Ref<number> = ref(props.radio);
let currentRadio:Ref<number>= ref(props.radio);
let radios:Array<Pvl.IRadio> = reactive(props.radios);

/* methods -------------------------------------------------------------------*/
function RadioClick(index:number):void{
    if ((props.disable == false) && ((typeof props.radios[index].disable ==='undefined') || (props.radios[index].disable == false))){
        lastRadio.value = currentRadio.value;
        if (lastRadio.value < radios.length){
            radios[lastRadio.value].checked = false;
            radios[index].checked = true;
            currentRadio.value = index;
        }
        emit("onRadios", index, radios)
    }
}

/* computed ------------------------------------------------------------------*/
const GetStyle = computed((index:number):any=>{
    return function(index:number):any{
        if (radios[index].checked)
        {
            if ((props.disable == false) && ((typeof props.radios[index].disable ==='undefined') || (props.radios[index].disable == false))){
                return{
                    "--color":theme.Get("text",1),
                    "--hcolor":theme.Get("text",1),
                    "--acolor":theme.Get("text",0),
                    "--border":theme.Get("border",0),
                    "--background":theme.Get("primary",0),
                    "--hbackground":theme.Get("primary",0),
                    "--abackground":theme.Get("primary",2)
                }
            }
            else
            {
                return{
                    "--color":theme.Get("text",2),
                    "--hcolor":theme.Get("text",2),
                    "--acolor":theme.Get("text",2),
                    "--border":theme.Get("border",2),
                    "--background":theme.Get("primary",2),
                    "--hbackground":theme.Get("primary",2),
                    "--abackground":theme.Get("primary",2)
                }
            }
        }
        else{
            if ((props.disable == false) && ((typeof props.radios[index].disable ==='undefined') || (props.radios[index].disable == false))){
                return{
                    "--color":theme.Get("text",0),
                    "--hcolor":theme.Get("text",1),
                    "--acolor":theme.Get("text",0),
                    "--border":theme.Get("border",0),
                    "--background":theme.Get("background",1),
                    "--hbackground":theme.Get("primary",0),
                    "--abackground":theme.Get("primary",2)
                }
            }
            else
            {
                return{
                    "--color":theme.Get("text",2),
                    "--hcolor":theme.Get("text",2),
                    "--acolor":theme.Get("text",2),
                    "--border":theme.Get("border",2),
                    "--background":theme.Get("background",1),
                    "--hbackground":theme.Get("background",1),
                    "--abackground":theme.Get("background",1)
                }
            }
        }
    }
})

const GetIcon = computed((index:number):any=>{
    return (index:number):any =>{
        if (typeof props.radios[index].icon !== 'undefined'){
            if (props.radios[index].icon === 'none'){
                return "mdi icon-size mdi-focus-field icon-blank";
            }
            else{
                return "mdi icon-size " + props.radios[index].icon;
            }
        }
        else {
            return "";
        }
    }
})

/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.icon-size{
    font-size: 14px;
    line-height: 20px;
    margin-right: 2px;
}

.icon-blank{
    color:transparent
}

.radio{
    display: flex;
    justify-content: center;
    padding: 0px 10px;

    width: 50px;
    height: 20px;
    line-height: 22px;
    font-size: 14px;
    text-align: center;
    user-select: none;

    transition: ease-in 100ms;

    --color:var(--text0);
    --border:var(--border0);
    --background:var(--background1);

    border: 1px solid var(--border);
    color: var(--color);
    background: var(--background);
}

.radio:hover{
    --hcolor:var(--text1);
    --hbackground:var(--primary0);
    color: var(--hcolor);
    background: var(--hbackground);
}

.radio:active{
    --acolor:var(--text0);
    --abackground:var(--primary2);
    color: var(--acolor);
    background: var(--abackground);
}

.radio-label
{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

</style>