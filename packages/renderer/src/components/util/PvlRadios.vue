<template>
    <div class="radio"
        v-for="(item,index) in props.radios"
        :key="index"
        :index="index"
        :checked="item.checked"
        :disable="item.disable"
        :style="GetStyle(index)"
        @click="RadioClick(index)">
        <div>{{item.label}}</div>
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
import { onMounted, computed, Ref, ref, reactive} from 'vue';
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
    radios:()=>[]
})

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
    if (props.radios[index].disable == false && props.disable == false){
        lastRadio.value = currentRadio.value;
        radios[lastRadio.value].checked = false;
        radios[index].checked = true;
        currentRadio.value = index;
        emit("onRadios", index, radios)
    }
}

/* computed ------------------------------------------------------------------*/
const GetStyle = computed((index:number):any=>{
    return function(index:number):any{
        if (radios[index].checked)
        {
            if (radios[index].disable == false && props.disable == false){
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
            if (radios[index].disable == false && props.disable == false){
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

/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.radio-panel{
    /* display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; */

    /* border: 1px solid var(--border0); */
}

.radio{
    display: flex;
    justify-content: flex-start;
    padding: 0px 10px;

    width: 50px;
    height: 20px;
    line-height: 24px;
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

</style>