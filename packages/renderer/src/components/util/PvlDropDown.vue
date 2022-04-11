<template>
    <div class="dropdown">
        <PvlBtn :disable="props.disable" @mousedown="mainClick"><slot></slot></PvlBtn>

        <transition
            name="dropdown-transition"
            enter-active-class="animate__animated animate__faster animate__zoomIn"
            leave-active-class="animate__animated animate__faster animate__zoomOut"
            @after-leave="transitionEnd">
            <div class="dropdown-list" v-if="show" >
                <PvlBtn 
                    @mousedown="listClick(index)"
                    @disable-mousedown="listDisableClick(index)"
                    v-for="(item,index) in props.list"
                    :key="index"
                    :disable="item.disable"
                    :style="GetStyle(index)">
                    <span :class="GetIcon(index)"></span>
                    {{item.label}}
                </PvlBtn>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlDropDown.vue
    * @brief         dropdown
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.03.30
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
    * 1.0|Egahp|2022.03.30|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import {onBeforeUnmount,computed, onMounted, reactive, Ref, ref, watch} from "vue";
import theme from '../../theme';
import { Pvl } from "../../Pvl";
import PvlBtn from './PvlBtn.vue';

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props
{
    disable?: boolean,
    index?:number,
    list:Array<Pvl.IList>
}

const props = withDefaults(defineProps<Props>(),{
    disable:false,
    index:0,
    list:()=>[]
})

watch(
    ()=>props.list,
    (nval)=>{
        list = nval;
    },
    {deep:true}
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event:"onList", index:number, list?:Array<Pvl.IList>):void
}

const emit = defineEmits<Emit>()

/* data ----------------------------------------------------------------------*/
let show:Ref<boolean> = ref(false);
let clickFlag = false;
let currentIndex:Ref<number> = ref(props.index);
let lastIndex:Ref<number> = ref(props.index);
let list:Array<Pvl.IList> = reactive(props.list)


let tmpIndex = lastIndex;
let tmpList = list;
let flag = false;
/* methods -------------------------------------------------------------------*/
function listClick(index:number):void{
    if ((props.disable == false) && ((typeof props.list[index].disable ==='undefined') || (props.list[index].disable == false))){
        lastIndex.value = currentIndex.value;
        if(lastIndex.value < list.length){
            currentIndex.value = index;
        }
        tmpIndex.value = index;
        tmpList = list;
        flag = true;
        
    }
}

function transitionEnd():void{
    if (flag === true)
    {
        emit("onList", tmpIndex.value, tmpList);
        flag = false;
    }
}

function listDisableClick(index:number):void{
    clickFlag = true;
}

function mainClick():void{
    clickFlag = true;
    show.value = !show.value;
}

function mouseUp():void{
    if (clickFlag){
        clickFlag = false;
    }
    else {
        show.value = false;
    }
}
/* computed ------------------------------------------------------------------*/
const GetStyle = computed((index:number):any=>{
    return (index:number):any =>{
        if ((props.disable == false) && ((typeof props.list[index].disable ==='undefined') || (props.list[index].disable == false))){
            return {
                "--_background":theme.Get("background",2),
                "--h_background":theme.Get("primary",0),
                "--a_background":theme.Get("primary",2)
            }
        }
        else{
            return {
                "--_background":theme.Get("background",2),
                "--h_background":theme.Get("background",2),
                "--a_background":theme.Get("background",2)
            }
        }
    }
})

const GetIcon = computed((index:number):any=>{
    return (index:number):any =>{
        if (typeof props.list[index].icon !== 'undefined'){
            if (props.list[index].icon === 'none'){
                return "mdi icon-size mdi-focus-field icon-blank";
            }
            else{
                return "mdi icon-size " + props.list[index].icon;
            }
        }
        else {
            return "";
        }
    }
})

/* life ----------------------------------------------------------------------*/
onMounted(()=>{
    window.addEventListener("mouseup",mouseUp)
})

onBeforeUnmount(()=>{
    window.removeEventListener("mouseup",mouseUp)
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.icon-size{
    font-size: 18px;
}

.icon-blank{
    color:transparent
}

.dropdown .button{

}

.dropdown-list{
    position: absolute;
    left: auto;
    top: auto;
    padding: 10px 0px;
    z-index: 1;
    border: 1px solid var(--border0);
    background: var(--background2)
}
.dropdown-list .button{
    padding: 0px 30px;
    width: auto;
    height: 26px;
    line-height: 22px;
    text-align: left;
    border: none;

    --_background: var(--background2);
    background: var(--_background);
}

.dropdown-list .button:hover{
    --h_background: var(--primary0);
    background: var(--h_background);
}

.dropdown-list .button:active{
    --a_background: var(--primary2);
    background: var(--a_background);
}
</style>