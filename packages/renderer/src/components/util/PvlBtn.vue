<template>
    <div class="button" @click="Click" @mousedown="MouseDown" @mouseup="MouseUp" :style="GetStyle">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlBtn.vue
    * @brief         button
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
import { computed } from 'vue';
import theme from '../../theme';
import { Pvl } from '../../Pvl';
/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props {
    disable?: boolean
}

let props = withDefaults(defineProps<Props>(), {
    disable: false
})
/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event: 'click'): void,
    (event: 'mousedown'): void,
    (event: 'mouseup'): void,
    (event: 'disableClick'): void,
    (event: 'disableMousedown'): void,
    (event: 'disableMouseup'): void
}

const emit = defineEmits<Emit>()
/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
function Click(): void {
    if (props.disable == false) {
        emit("click");
    }
    else {
        emit("disableClick");
    }
}

function MouseDown(): void {
    if (props.disable == false){
        emit("mousedown");
    }
    else{
        emit("disableMousedown")
    }
}

function MouseUp(): void {
    if (props.disable == false){
        emit("mouseup");
    }
    else{
        emit("disableMouseup")
    }
}

/* computed ------------------------------------------------------------------*/
const GetStyle = computed((): any => {
    if (props.disable == false) {
        return {
            "--color": theme.Get("text", 0),
            "--hcolor": theme.Get("text", 1),
            "--acolor": theme.Get("text", 0),
            "--border": theme.Get("border", 0),
            "--background": theme.Get("background", 1),
            "--hbackground": theme.Get("primary", 0),
            "--abackground": theme.Get("primary", 2)
        }
    }
    else {
        return {
            "--color": theme.Get("text", 2),
            "--hcolor": theme.Get("text", 2),
            "--acolor": theme.Get("text", 2),
            "--border": theme.Get("border", 2),
            "--background": theme.Get("background", 1),
            "--hbackground": theme.Get("background", 1),
            "--abackground": theme.Get("background", 1)
        }
    }
})
/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/

</script>

<style scoped>
.button {
    padding: 0px 10px;

    width: 50px;
    height: 20px;
    line-height: 24px;
    font-size: 14px;
    text-align: center;
    user-select: none;

    transition: ease-in 100ms;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    --color: var(--text0);
    --border: var(--border0);
    --background: var(--background1);

    border: 1px solid var(--border);
    color: var(--color);
    background: var(--background);
}

.button:hover {
    --hcolor: var(--text1);
    --hbackground: var(--primary0);
    color: var(--hcolor);
    background: var(--hbackground);
}

.button:active {
    --acolor: var(--text0);
    --abackground: var(--primary2);
    color: var(--acolor);
    background: var(--abackground);
}
</style>