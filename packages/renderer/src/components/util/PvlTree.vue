<template>
    <div class="pvl-tree-panel">
        <div
            class="pvl-tree-item"
            v-for="(item, index) in tree"
            :key="index"
            :style="GetStyle(index)"
            @click="treeItemSelect(index)"
            v-show="item.show"
            >
            <span  class="pvl-tree-item-color" :style="GetColor(index)"></span>
            <span @mousedown="treeItemShowChildren(index)" :class="GetCheck(index)"></span>
            <span :class="GetIcon(index)"></span>
            <span class="pvl-tree-item-label">{{item.label}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
/****
    ******************************************************************************
    * @file          PvlTree.vue
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.01
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
    * 1.0|Egahp|2022.04.01|创建文件
    *****************************************************************************
    */



/* import --------------------------------------------------------------------*/
import { computed, reactive, watch, Ref, ref } from 'vue';
import { PvlTreeNode} from './PvlTreeJson'

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
interface Props {
    disable?:boolean,
    index:number,
    tree: Array<PvlTreeNode>
};

let props = withDefaults(defineProps<Props>(),{
    disable:false,
    index:0,
    tree:()=><Array<PvlTreeNode>>[]
})

watch(
    ()=>props.tree,
    (nval)=>{
        tree = nval;
    },
    {deep:true}
)

watch(
    ()=>props.index,
    (nval,oval)=>{
        currentIndex.value = nval;
        lastIndex.value = oval;
    }
)

/* emits ---------------------------------------------------------------------*/
interface Emit {
    (event: 'onSelect', index:number, select?:boolean, radios?:Array<PvlTreeNode>):void
}

const emit = defineEmits<Emit>()

/* data ----------------------------------------------------------------------*/
let lastIndex:Ref<number> = ref(props.index);
let currentIndex:Ref<number> = ref(props.index);
let tree:Array<PvlTreeNode> = reactive(props.tree);

const checkClassStr = "mdi mdi-chevron-right pvl-tree-item-check ";
const iconClassStr = "mdi pvl-tree-item-icon "

/* methods -------------------------------------------------------------------*/
function treeItemSelect(index:number):void{
    if (props.disable == false)
    {
        lastIndex.value = currentIndex.value;
        if (lastIndex.value < tree.length)
        {
            if (lastIndex.value == index){
                tree[index].checked = !tree[index].checked;
                emit('onSelect', index, tree[index].checked, tree);
            } else {
                tree[lastIndex.value].checked = false;
                tree[index].checked = true;
                currentIndex.value = index;
                emit('onSelect', index, true, tree);
            }
        }
        else
        {
            tree[index].checked = true;
            currentIndex.value = index;
            emit('onSelect', index, true, tree);
        }
    }
}

/**
 * 用于开启或关闭子项的显示
 * @param index 
 */
/*!< TODO 记忆历史 */
function treeItemShowChildren(index:number):void{
    let idx = index + 1;

    tree[index].chShow = !tree[index].chShow;

    /*!< 被点击的是最后一个元素,或者下一个元素深度不大于点击的元素 */
    if ((idx >= tree.length) || (tree[idx].depth <= tree[index].depth))
    {
        /*!< 说明无子项 */
        return;
    }

    let depth = tree[index].depth;

    let stopIdx = idx;
    for (; stopIdx<tree.length-1; stopIdx++)
    {
        if(depth >= tree[stopIdx+1].depth)
        {
            break;
        }
    }

    for (let i = idx; i <= stopIdx; i++)
    {
        if (tree[index].chShow)
        {
            tree[i].chShow = true;
            tree[i].show = true;
        }
        else
        {
            tree[i].chShow = false;
            tree[i].show = false;
        }
    }
}
/* computed ------------------------------------------------------------------*/
const GetStyle = computed((index:number):any=>{
    return function(index:number):any{
        let margin = (tree[index].depth - 1) * 20;
        if (tree[index].checked)
        {
            if (props.disable == false)
            {
                return{
                    'margin-left': margin + 'px',
                    "--color":"var(--text1)",
                    "--hcolor":"var(--text1)",
                    "--acolor":"var(--text0)",
                    "--border":"var(--border0)",
                    "--background":"var(--primary0)",
                    "--hbackground":"var(--primary0)",
                    "--abackground":"var(--primary2)"
                }
            }
            else{
                return{
                    'margin-left': margin + 'px',
                    "--color":"var(--text2)",
                    "--hcolor":"var(--text2)",
                    "--acolor":"var(--text2)",
                    "--border":"var(--border0)",
                    "--background":"var(--primary2)",
                    "--hbackground":"var(--primary2)",
                    "--abackground":"var(--primary2)"
                }
            }
        }
        else{
            if (props.disable == false)
            {
                return{
                    'margin-left': margin + 'px',
                    "--color":"var(--text0)",
                    "--hcolor":"var(--text1)",
                    "--acolor":"var(--text0)",
                    "--border":"var(--border0)",
                    "--background":"var(--background1)",
                    "--hbackground":"var(--primary0)",
                    "--abackground":"var(--primary2)"
                }
            }
            else{
                return{
                    'margin-left': margin + 'px',
                    "--color":"var(--text2)",
                    "--hcolor":"var(--text2)",
                    "--acolor":"var(--text2)",
                    "--border":"var(--border0)",
                    "--background":"var(--background1)",
                    "--hbackground":"var(--background1)",
                    "--abackground":"var(--background1)"
                }
            }
        }
    }
})

const GetCheck = computed((index:number):any=>{
    return (index:number):any =>{
        if (tree[index].chShow)
        {
            return checkClassStr + 'mdi-rotate-90';
        }
        else{
            return checkClassStr;
        }
    }
})

const GetColor = computed((index:number):any=>{
    return (index:number):any =>{
        var color = tree[index].color;
        return {
            "background": color
        }
    }
})

const GetIcon = computed((index:number):any=>{
    return (index:number):any =>{
        return iconClassStr + tree[index].icon;
    }
})
/* life ----------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>

.pvl-tree-item-color{
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    margin: 5px;
    width: 14px;
    border: 1px solid var(--border0);
}

.pvl-tree-item-check{
    position: absolute;
    top: 0px;
    left: 1px;
    bottom: 0px;
    margin: 0px;

    font-size: 24px;
    line-height: 40px;
}

.pvl-tree-item-icon{
    position: absolute;
    left: 25px;
    font-size: 28px;
}

.pvl-tree-item-label{
    position: absolute;
    left: 56px;
}

.pvl-tree-item{
    position: relative;
    padding: 0px 20px;
    height: 40px;

    line-height: 42px;
    font-size: 20px;
    text-align: left;

    --color:var(--text0);
    --border:var(--border0);
    --background:var(--background1);

    color: var(--color);
    border: 1px solid var(--border);
    background: var(--background);

    transition: ease-in 100ms;
}

.pvl-tree-item:hover{
    --hcolor:var(--text1);
    --hbackground:var(--primary0);
    color: var(--hcolor);
    background: var(--hbackground);
}

.pvl-tree-item:active{
    --acolor:var(--text0);
    --abackground:var(--primary2);
    color: var(--acolor);
    background: var(--abackground);
}

.pvl-tree-panel{
    position: absolute;
    /* display: flex; */
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    flex-direction: column;

    background: var(--background0);

    overflow-y: scroll;
    overflow-x: hidden;
}



.pvl-tree-panel::-webkit-scrollbar{
    width: 10px;
    background-color: var(--background1);
}
.pvl-tree-panel::-webkit-scrollbar-track {
    background-color: var(--background0);
}

.pvl-tree-panel::-webkit-scrollbar-thumb{
    background-color: var(--background1);
    border-top: 10px solid var(--background0);
    border-bottom: 10px solid var(--background0);
}

.pvl-tree-panel:hover::-webkit-scrollbar-thumb{
    background-color: var(--primary0);
}



</style>