<template>
    <div>
        <!-- 标题栏 -->
        <div class="title-panel">
            <PvlDropDown @on-list="fileOnList" :list="title_dropdown_list[0]">{{ $tm("usbconfig.title.button.file") }}</PvlDropDown>
            <PvlDropDown @on-list="projectOnList" :list="title_dropdown_list[1]">{{ $tm("usbconfig.title.button.project") }}</PvlDropDown>
            <PvlDropDown @on-list="viewOnList" :list="title_dropdown_list[2]">{{ $tm("usbconfig.title.button.view") }}</PvlDropDown>
            <PvlDropDown @on-list="compileOnList" :list="title_dropdown_list[3]">{{ $tm("usbconfig.title.button.compile") }}</PvlDropDown>
            <PvlDropDown @on-list="helpOnList" :list="title_dropdown_list[4]">{{ $tm("usbconfig.title.button.help") }}</PvlDropDown>
            <PvlDropDown @on-list="aboutOnList" :list="title_dropdown_list[5]">{{ $tm("usbconfig.title.button.about") }}</PvlDropDown>
        </div>

        <!-- 主容器 -->
        <div class="main-panel" v-on:mousemove="r.MouseMove">
            <!-- 树形图容器 -->
            <div class="left-panel" :style="{ width: r.react.size[0] + 'px' }">
                <div class="panel file-panel" @wheel="XScroll" ref="scrolldom">
                    <PvlRadios :radio="fileIndex" :radios="fileRadios" @onRadios="OnFileRadios">
                        <PvlBtn class="mdi mdi-close" @click="FileClose"></PvlBtn>
                    </PvlRadios>
                </div>
                <div class="panel tree-panel">
                    <PvlTree :tree="treeView" :index="0" @on-select="TreeSelect"></PvlTree>
                </div>
            </div>

            <!-- 调整栏 -->
            <div
                class="panel-hresize"
                v-on:mousedown="r.MouseDown($event,0)"
                :style="{ background: r.react.sel[0] ? 'var(--primary0)' : 'var(--background1)', left: r.react.size[0] + 'px' }"
            ></div>

            <!-- 配置容器 -->
            <div class="right-panel" :style="{ left: r.react.size[0] + 3 + 'px' }">
                <!-- 按键容器 -->
                <div class="panel button-panel" :style="{ height: r.react.size[1] + 'px' }">

                    <BUSBGroup @click="BUSBGroupClick" v-show="false ||  (fileRadios.length > 1) && (fileIndex >= 1) && BUSBGroupShow "></BUSBGroup>

                    <BUSB v-show="false || ((fileRadios.length > 0) && (fileIndex === 0)) || ((fileIndex >= 1) && BUSBShow)" :title="BUSBTitle" @click="BUSBClick"></BUSB>

                </div>

                <!-- 调整栏 -->
                <div
                    class="panel-vresize"
                    v-on:mousedown="r.MouseDown($event,1)"
                    :style="{ background: r.react.sel[1] ? 'var(--primary0)' : 'var(--background1)', top: r.react.size[1] + 20 + 'px' }"
                ></div>

                <!-- 配置容器 -->
                <div
                    class="panel config-panel"
                    :style="{ top: r.react.size[1]+ 30 + 'px', bottom: r.react.size[2] + 30 + 'px' }">

                    <CUSBSpecificInfo v-show="false || (fileRadios.length > 1) && (fileIndex >= 1) && CUSBSpecificInfoShow"
                        :info="CUSBSpecificInfoView" @update="CUSBSpecificInfoUpdate"></CUSBSpecificInfo>

                    <CUSBAssociateInfo v-show="false || (fileRadios.length > 1) && (fileIndex >= 1) && CUSBAssociateInfoShow"
                        :info="CUSBAssociateInfoView" @update="CUSBAssociateInfoUpdate" :ifs="CUSBAssociateInfoIFs" :strs="CUSBBaseInfoView.string"></CUSBAssociateInfo>

                    <CUSBEndpointInfo v-show="false || (fileRadios.length > 1) && (fileIndex >= 1) && CUSBEndpointInfoShow"
                        :info="CUSBEndpointInfoView" @update="CUSBEndpointInfoUpdate"
                        :usb="CUSBBaseInfoView.device.usb"></CUSBEndpointInfo>

                    <CUSBAlternateInfo v-show="false ||  (fileRadios.length > 1) && (fileIndex >= 1) && CUSBAlternateInfoShow"
                        :info="CUSBAlternateInfoView" @update="CUSBAlternateInfoUpdate" :strs="CUSBBaseInfoView.string"></CUSBAlternateInfo>

                    <CUSBConfigGroupInfo v-show="false || (fileRadios.length > 0) && (fileIndex === 0) && CUSBConfigGroupInfoShow"
                        v-model:info="CUSBConfigGroupinfoView.path" @update="CUSBConfigGroupInfoUpdate"></CUSBConfigGroupInfo>

                    <CUSBStringInfo v-show="false || (fileRadios.length > 0) && (fileIndex === 0) && CUSBStringInfoShow" 
                        :info="CUSBStringInfoView" @update="CUSBStringInfoUpdate"></CUSBStringInfo>

                    <CUSBConfigInfo v-show="false || (fileRadios.length > 0) && (fileIndex === 0) && CUSBConfigInfoShow" 
                        :info="CUSBConfigInfoView" @update="CUSBConfigInfoUpdate" :strs="CUSBBaseInfoView.string"></CUSBConfigInfo>

                    <CUSBDeviceInfo  v-show="false || (fileRadios.length > 0) && (fileIndex === 0) && CUSBDeviceInfoShow" 
                        :info="CUSBDeviceInfoView" @update="CUSBDeviceInfoUpdate"></CUSBDeviceInfo>
                </div>

                <!-- 调整栏 -->
                <div
                    class="panel-vresize"
                    v-on:mousedown="r.MouseDown($event,2)"
                    :style="{ background: r.react.sel[2] ? 'var(--primary0)' : 'var(--background1)', bottom: r.react.size[2] + 20 + 'px' }"
                ></div>

                <!-- 信息容器 -->
                <div class="panel message-panel" :style="{ height: r.react.size[2] + 'px' }">
                    <PvlLog ref="log"></PvlLog>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
/****
    ******************************************************************************
    * @file          UsbConfig.vue
    * @brief         简述
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
import { Ref, reactive, onMounted, ref, provide, onBeforeUnmount } from "vue";
import theme from "../theme";
import i18n from "../lang";
import {ipcRenderer, shell} from "electron";
import {UsbConfigResize, messageBox, open, openBase, openCheck, 
    UsbConfigLog, UsbConfigFile , saveBaseAs, saveAs, EUSBClass, EUSBEndpointDir_IN, EUSBEndpointType} from "../mainModules/UsbConfigRender";
import { Pvl } from "../Pvl";
import { IUSBAlternateInfo, IUSBAssociateInfo, IUSBConfigGroupInfo, IUSBConfigInfo, IUSBBaseInfo, IUSBEndpointInfo, IUSBGroupInfo, IUSBSpecificInfo, IUSBStringInfo, IUSBDeviceInfo } from "../mainModules/usbDescriptor";
import {PvlTreeNode, PvlTree as PvlTreeInst } from "../components/util/PvlTreeJson";
import PvlLog from "../components/util/PvlLog.vue";
import PvlBtn from "../components/util/PvlBtn.vue";
import PvlTree from "../components/util/PvlTree.vue";
import PvlRadios from "../components/util/PvlRadios.vue";
import PvlDropDown from "../components/util/PvlDropDown.vue";

import CUSBDeviceInfo from "./usbConfigPages/CUSBDeviceInfo.vue";
import CUSBConfigInfo from "./usbConfigPages/CUSBConfigInfo.vue";
import CUSBStringInfo from "./usbConfigPages/CUSBStringInfo.vue";
import CUSBConfigGroupInfo from "./usbConfigPages/CUSBConfigGroupInfo.vue";
import BUSB from "./usbConfigPages/BUSB.vue";
import CUSBAlternateInfo from "./usbConfigPages/CUSBAlternateInfo.vue";
import CUSBEndpointInfo from "./usbConfigPages/CUSBEndpointInfo.vue";
import BUSBGroup from "./usbConfigPages/BUSBGroup.vue";
import CUSBAssociateInfo from "./usbConfigPages/CUSBAssociateInfo.vue";
import CUSBSpecificInfo from "./usbConfigPages/CUSBSpecificInfo.vue";

import {compileCherryUSB} from "../mainModules/compileCherryUSB";



const init_treePanel_w = 500;
const init_buttonPanel_h = 200;
const init_messagePanel_h = 200;


/**
 * i18n 语端获取
 */
const tm = i18n.global.tm;

/* declare -------------------------------------------------------------------*/

/* props ---------------------------------------------------------------------*/
function TreeSelect(index:number, select?:boolean, radios?:Array<PvlTreeNode>):void {
    CUSBStringInfoShow.value = false;
    CUSBDeviceInfoShow.value = false;
    CUSBConfigInfoShow.value = false;
    CUSBConfigGroupInfoShow.value = false;
    CUSBAlternateInfoShow.value = false;
    CUSBEndpointInfoShow.value = false;
    CUSBAssociateInfoShow.value = false;
    CUSBSpecificInfoShow.value = false;
    BUSBGroupShow.value = false;
    BUSBShow.value = false;

    if (select == false)
    {
        BUSBIndex = ButtonIndex.ProjectInit;
        BUSBTitle.value = "初始化工程, 重置描述符";
        BUSBGroupShow.value = true;
    }
    else{

        let path = files[fileIndex.value].view[index].path;

        switch(path[0])
        {
            case "device":{
                CUSBDeviceInfoView.usb = CUSBBaseInfoView.device.usb;
                CUSBDeviceInfoView.ep0size = CUSBBaseInfoView.device.ep0size;
                CUSBDeviceInfoView.class = CUSBBaseInfoView.device.class;
                CUSBDeviceInfoView.subclass = CUSBBaseInfoView.device.subclass;
                CUSBDeviceInfoView.protocol = CUSBBaseInfoView.device.protocol;
                CUSBDeviceInfoView.pid = CUSBBaseInfoView.device.pid;
                CUSBDeviceInfoView.vid = CUSBBaseInfoView.device.vid;
                CUSBDeviceInfoView.version = CUSBBaseInfoView.device.version;
                CUSBDeviceInfoShow.value = true;
                BUSBIndex = ButtonIndex.ProjectInit;
                BUSBTitle.value = "初始化工程, 重置描述符";
                break;
            }
            case "string":{
                if (path.length === 2){
                    CUSBStringInfoIndex = path[1] as number;
                    CUSBStringInfoView.name = CUSBBaseInfoView.string[CUSBStringInfoIndex].name;
                    CUSBStringInfoView.value = CUSBBaseInfoView.string[CUSBStringInfoIndex].value;
                    CUSBStringInfoShow.value = true;
                    BUSBIndex = ButtonIndex.StringDel;
                    BUSBTitle.value = "删除字符串描述符";
                } else {
                    BUSBIndex = ButtonIndex.StringAdd;
                    BUSBTitle.value = "添加字符串描述符";
                }
                break;
            }
            case "config":{
                if (path.length === 2)
                {
                    CUSBConfigInfoIndex = path[1] as number;
                    CUSBConfigInfoView.string = CUSBBaseInfoView.config[CUSBConfigInfoIndex].string;
                    CUSBConfigInfoView.selfpower = CUSBBaseInfoView.config[CUSBConfigInfoIndex].selfpower;
                    CUSBConfigInfoView.remotewakeup = CUSBBaseInfoView.config[CUSBConfigInfoIndex].remotewakeup;
                    CUSBConfigInfoView.power = CUSBBaseInfoView.config[CUSBConfigInfoIndex].power;
                    CUSBConfigInfoShow.value = true;
                    BUSBIndex = ButtonIndex.ConfigDel;
                    BUSBTitle.value = "删除配置描述符";
                } else if (path[2]=='group') {
                    CUSBConfigInfoIndex = path[1] as number;
                    if(path.length == 4){
                        CUSBConfigGroupInfoIndex = path[3] as number;
                        CUSBConfigGroupinfoView.path = CUSBBaseInfoView.config[CUSBConfigInfoIndex].group[CUSBConfigGroupInfoIndex];
                        CUSBConfigGroupInfoShow.value = true;
                        BUSBIndex = ButtonIndex.ConfigGroupDel;
                        BUSBTitle.value = "删除分组配置";
                    } else {
                        BUSBIndex = ButtonIndex.ConfigGroupAdd;
                        BUSBTitle.value = "添加分组配置";
                    }
                } else {
                    BUSBIndex = ButtonIndex.ConfigAdd;
                    BUSBTitle.value = "添加配置描述符";
                }
                break;
            }
            case "interface":{
                
                if (path.length === 2){
                    CUSBInterfaceInfoIndex = path[1] as number;
                    CUSBInterfaceInfoShow.value = true;
                    BUSBIndex = ButtonIndex.InterfaceDel;
                    BUSBTitle.value = "删除接口描述符";
                    BUSBShow.value = true;

                } else if (path[2] === 'alternate'){
                    CUSBInterfaceInfoIndex = path[1] as number;
                    if (path.length === 4){
                        CUSBAlternateInfoIndex = path[3] as number;
                        
                        CUSBAlternateInfoView.string = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].string;
                        CUSBAlternateInfoView.class = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].class;
                        CUSBAlternateInfoView.subclass = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].subclass;
                        CUSBAlternateInfoView.protocol = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].protocol;
                        CUSBAlternateInfoShow.value = true;
                        BUSBIndex = ButtonIndex.AlternateDel;
                        BUSBTitle.value = "删除接口复用描述符";
                        BUSBShow.value = true;
                    } else if (path[4] === 'specific' || path[4] === 'endpoint'){
                        CUSBAlternateInfoIndex = path[3] as number;

                        if (path[4] === 'specific'){
                            if (path.length === 5){
                                CUSBSpecificInfoShow.value = true;
                                CUSBSpecificInfoView.type = (CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].specific as IUSBSpecificInfo).type
                                BUSBIndex = ButtonIndex.SpecificDel;
                                BUSBTitle.value = "删除特定描述符";
                                BUSBShow.value = true;
                            }

                        } else if (path[4] === 'endpoint'){
                            if (path.length === 6){
                                CUSBEndpointInfoIndex = path[5] as number;
                                CUSBEndpointInfoView.address = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].endpoint[CUSBEndpointInfoIndex].address;
                                CUSBEndpointInfoView.direction = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].endpoint[CUSBEndpointInfoIndex].direction;
                                CUSBEndpointInfoView.type = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].endpoint[CUSBEndpointInfoIndex].type;
                                CUSBEndpointInfoView.size = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].endpoint[CUSBEndpointInfoIndex].size;
                                CUSBEndpointInfoView.interval = CUSBGroupInfoViews[fileIndex.value-1].interface[CUSBInterfaceInfoIndex].alternate[CUSBAlternateInfoIndex].endpoint[CUSBEndpointInfoIndex].interval;
                                CUSBEndpointInfoShow.value = true;
                                BUSBIndex = ButtonIndex.EndpointDel;
                                BUSBTitle.value = "删除端点描述符";
                                BUSBShow.value = true;
                            } else {
                                BUSBIndex = ButtonIndex.EndpointAdd;
                                BUSBTitle.value = "添加端点描述符";
                                BUSBShow.value = true;
                            }

                        }
                    } else {
                        BUSBIndex = ButtonIndex.AlternateAdd;
                        BUSBTitle.value = "添加接口复用描述符";
                        BUSBShow.value = true;
                    }
                } else {
                    BUSBIndex = ButtonIndex.InterfaceAdd;
                    BUSBTitle.value = "添加接口描述符";
                    BUSBShow.value = true;
                }
                break;
            }

            case "associate":{
                if(typeof CUSBGroupInfoViews[fileIndex.value-1].associate != 'undefined'){
                    CUSBAssociateInfoIFs.value = CUSBGroupInfoViews[fileIndex.value-1].interface.length;
                    CUSBAssociateInfoView.string = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).string;
                    CUSBAssociateInfoView.first = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).first;
                    CUSBAssociateInfoView.count = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).count;
                    CUSBAssociateInfoView.class = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).class;
                    CUSBAssociateInfoView.subclass = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).subclass;
                    CUSBAssociateInfoView.protocol = (CUSBGroupInfoViews[fileIndex.value-1].associate as IUSBAssociateInfo).protocol;
                    CUSBAssociateInfoShow.value = true;
                    BUSBIndex = ButtonIndex.AssociateDel;
                    BUSBTitle.value = "删除接口关联描述符";
                    BUSBShow.value = true;
                }
                break;
            }
        }
    }


    // console.log(index + " " + select);
}
/* emits ---------------------------------------------------------------------*/

/* expose --------------------------------------------------------------------*/
// provide("logMsg", logMsg);

/* data ----------------------------------------------------------------------*/
enum ButtonIndex {
    ProjectInit = 0,
    StringAdd = 1,
    StringDel = 2,
    ConfigAdd = 3,
    ConfigDel = 4,
    ConfigGroupAdd = 5,
    ConfigGroupDel = 6,
    AssociateAdd = 7,
    AssociateDel = 8,
    InterfaceAdd = 9,
    InterfaceDel = 10,
    AlternateAdd = 11,
    AlternateDel = 12,
    SpecificAdd = 13,
    SpecificDel = 14,
    EndpointAdd = 15,
    EndpointDel = 16
}

/**
 * 窗口调整栏
 */
let r = new UsbConfigResize(reactive({
    sel:<[boolean,boolean,boolean]> [false,false,false],
    size:<[number,number,number]> [init_treePanel_w,init_buttonPanel_h, init_messagePanel_h]
}))

/**
 * 标题下拉菜单
 */
let title_dropdown_list: any = reactive([
    [
        { disable: true, label: tm("usbconfig.title.dropdown.file0"), icon: "mdi-file-plus-outline" },
        { disable: true, label: tm("usbconfig.title.dropdown.file1"), icon: "mdi-file-search-outline" },
        { disable: true, label: tm("usbconfig.title.dropdown.file2"), icon: "none" },
        { disable: true, label: tm("usbconfig.title.dropdown.file3"), icon: "mdi-content-save" },
        { disable: true, label: tm("usbconfig.title.dropdown.file4"), icon: "none" },
        { disable: true, label: tm("usbconfig.title.dropdown.file5"), icon: "mdi-content-save-all" },
        { disable: false, label: tm("usbconfig.title.dropdown.file6"), icon: "none" },
    ],
    [
        { disable: false, label: tm("usbconfig.title.dropdown.project0"), icon: "mdi-file-plus-outline" },
        { disable: false, label: tm("usbconfig.title.dropdown.project1"), icon: "mdi-file-search-outline" },
        { disable: true, label: tm("usbconfig.title.dropdown.project2"), icon: "none" },
        { disable: true, label: tm("usbconfig.title.dropdown.project3"), icon: "mdi-content-save" },
        { disable: true, label: tm("usbconfig.title.dropdown.project4"), icon: "none" },
    ],
    [
        { disable: true, label: tm("usbconfig.title.dropdown.view0") },
        { disable: true, label: tm("usbconfig.title.dropdown.view1") },
        { disable: true, label: tm("usbconfig.title.dropdown.view2") },
        { disable: true, label: tm("usbconfig.title.dropdown.view3") },
    ],
    [
        { disable: true, label: tm("usbconfig.title.dropdown.compile0"), icon: "mdi-fruit-cherries" },
        { disable: true, label: tm("usbconfig.title.dropdown.compile1"), icon: "none" },
        { disable: true, label: tm("usbconfig.title.dropdown.compile2"), icon: "none" },
    ],
    [
        { disable: false, label: tm("usbconfig.title.dropdown.help0"), icon: "mdi-file-document-multiple-outline" },
        { disable: false, label: tm("usbconfig.title.dropdown.help1"), icon: "mdi-animation-play-outline" },
        { disable: false, label: tm("usbconfig.title.dropdown.help2"), icon: "mdi-github" },
    ],
    [
        { disable: true, label: tm("usbconfig.title.dropdown.about0"), icon: "mdi-email-outline" },
        { disable: true, label: tm("usbconfig.title.dropdown.about1"), icon: "mdi-hand-coin-outline" },
        { disable: true, label: tm("usbconfig.title.dropdown.about2"), icon: "mdi-message-alert-outline" },
    ]
])

/*!< 当前选中的文件序号 */
let fileIndex:Ref<number> = ref(0);
/*!< 显示的文件列表 */
let fileRadios: Array<Pvl.IRadio> = reactive([])
/*!< 文件列表 */
let files: Array<UsbConfigFile> = [];
/*!< 文件内容树视图 */
let treeView: Array<PvlTreeNode> = reactive([])

/*!< 打印模块 */
let logMsg:UsbConfigLog|undefined;

let CUSBGroupInfoViews: IUSBGroupInfo[] = reactive([]);

let CUSBAssociateInfoShow = ref(false);
let CUSBAssociateInfoView: IUSBAssociateInfo = reactive({
    first:0,
    count:0,
    string:0,
    class:0,
    subclass:0,
    protocol:0
})
let CUSBAssociateInfoIFs = ref(0);

let CUSBAlternateInfoIndex = 0;
let CUSBAlternateInfoShow = ref(false);
let CUSBAlternateInfoView: IUSBAlternateInfo = reactive({
    string:0,
    class:0,
    subclass:0,
    protocol:0,
    endpoint:[]
});

let CUSBInterfaceInfoIndex = 0;
let CUSBInterfaceInfoShow = ref(false);

let CUSBEndpointInfoIndex = 0;
let CUSBEndpointInfoShow = ref(false);
let CUSBEndpointInfoView:IUSBEndpointInfo = reactive({
    direction:EUSBEndpointDir_IN,
    type:EUSBEndpointType.INTR,
    address:1,
    size:64,
    interval:1
})

let CUSBSpecificInfoShow = ref(false);
let CUSBSpecificInfoView = reactive({
    type:0
})

/*!< 这个变量与文件内部的变量进行了捆绑 */
let CUSBBaseInfoView: IUSBBaseInfo = reactive(
    {
        device:{
            usb:0,
            class:0,
            subclass:0,
            protocol:0,
            ep0size:0,
            pid:0,
            vid:0,
            version:0,
        },
        string:[],
        config:[]
    } as IUSBBaseInfo
);

let CUSBDeviceInfoView:IUSBDeviceInfo = reactive({
    usb:0,
    class:0,
    subclass:0,
    protocol:0,
    ep0size:0,
    pid:0,
    vid:0,
    version:0,
})
let CUSBDeviceInfoShow = ref(true);

let CUSBStringInfoView: IUSBStringInfo = reactive(
    {
        name:"",
        value: ""
    }
)
let CUSBStringInfoShow = ref(false);
let CUSBStringInfoIndex = 0;

let CUSBConfigInfoView: IUSBConfigInfo = reactive(
    {
        string:0,
        selfpower:false,
        remotewakeup:true,
        power:500,
        group:[]
    }
)
let CUSBConfigInfoShow = ref(false);
let CUSBConfigInfoIndex = 0;


let CUSBConfigGroupInfoShow = ref(false);
let CUSBConfigGroupinfoView = reactive({path:""});
let CUSBConfigGroupInfoIndex = 0;

let BUSBTitle:Ref<string> = ref("初始化工程, 重置描述符")
let BUSBIndex:number = 0;

let BUSBGroupShow = ref(false);
let BUSBShow = ref(false);


const log = ref<any>(null)
const scrolldom = ref<any>(null)
/* methods -------------------------------------------------------------------*/


/**
 * 取消所有文件选中状态
 */
function fileUncheckAll():void
{
    files.forEach(item => {
        item.radio.checked = false;
    });
}

/**
 * 添加一个文件到列表
 * @param file 
 */
function fileAddItem(file:UsbConfigFile)
{
    fileRadios.push(file.radio);
    files.push(file);
    fileIndex.value = files.length - 1;
}

/**
 * 从列表中删除文件
 * @param index 
 */
function fileDelItem(index:number)
{
    fileRadios.splice(index, 1);
    files.splice(index, 1);
}

/**
 * 更新工程下拉菜单
 * @param isOpenProject 
 */
function updateTiltleProjcet(isOpenProject:boolean){
    if(isOpenProject){
        title_dropdown_list[1][0].disable = true;
        title_dropdown_list[1][1].disable = true;
        title_dropdown_list[1][2].disable = false;
        title_dropdown_list[1][3].disable = false;
        title_dropdown_list[1][4].disable = false;
        title_dropdown_list[3][0].disable = false;
    }
    else{
        title_dropdown_list[1][0].disable = false;
        title_dropdown_list[1][1].disable = false;
        title_dropdown_list[1][2].disable = true;
        title_dropdown_list[1][3].disable = true;
        title_dropdown_list[1][4].disable = true;
        title_dropdown_list[3][0].disable = true;
    }
}

/**
 * 更新文件下拉菜单
 * @param isOpenFile 
 * @param isOpenProject 
 */
function updateTitleFile(isOpenFile:boolean, isOpenProject:boolean){
    if(isOpenProject)
    {
        title_dropdown_list[0][0].disable = false;
        title_dropdown_list[0][1].disable = false;

        if(isOpenFile){
            title_dropdown_list[0][2].disable = false;
            title_dropdown_list[0][3].disable = false;
            title_dropdown_list[0][4].disable = false;
            title_dropdown_list[0][5].disable = false;
        }
        else{
            title_dropdown_list[0][2].disable = true;
            title_dropdown_list[0][3].disable = true;
            title_dropdown_list[0][4].disable = true;
            title_dropdown_list[0][5].disable = true;
        }

    }
    else{
        title_dropdown_list[0][0].disable = true;
        title_dropdown_list[0][1].disable = true;
        title_dropdown_list[0][2].disable = true;
        title_dropdown_list[0][3].disable = true;
        title_dropdown_list[0][4].disable = true;
        title_dropdown_list[0][5].disable = true;
    }
}

/**
 * 将文件的树视图显示过来
 * @param file 
 */
function updateTreeView(file?:UsbConfigFile):void
{
    treeView.splice(0,treeView.length);
    if (file){
        file.view.forEach(item => {
            item.checked = false;
            treeView.push(item);
        });
    }

    TreeSelect(0, false);
}

/**
 * 退出软件
 */
async function exit():Promise<void>{
    var sel = await messageBox({
        title:"关闭软件",
        message:"确定要退出软件吗?",
        buttons:["退出", "取消"],
        cancelId: 1
    })

    if (sel === 1){
        return ;
    }

    if (files.length === 0){
        ipcRenderer.send("main.window.close");
        return;
    }

    sel = await messageBox({
        title:"保存工程",
        message:"请选择是否保存所有工程相关文件",
        buttons:["保存", "不保存",  "取消"],
        cancelId: 2
    })

    if (sel === 2){
        return ;
    } else if (sel ===  1) {
        ipcRenderer.send("main.window.close");
        return;
    }

    /*!< 先尝试保存所有文件 */
    var i = 0;
    for (;i<files.length;i++)
    {
        var res = await files[i].save();

        if (!res){
            /*!< 任意文件保存失败就取消 */
            return;
        }
    }

    ipcRenderer.send("main.window.close");
}

var fileCloseFlag: boolean = false;
var lastFileIndex: number = 0;
/**
 * 文件列表点击事件
 * @param index 
 * @param radios 
 */
const OnFileRadios: Pvl.IOnRadios = async function (index: number, radios?: Array<Pvl.IRadio>) {
    /*!< BUG 需要修复关闭文件后当前选中的文件是那个 */
    // console.log("last    " + lastFileIndex);
    // console.log("index   " + index);
    // console.log("findex  " + fileIndex.value)

    let _fileIndex = fileIndex.value;
    let _lastFileIndex = lastFileIndex;

    if (fileIndex.value === index)
    {
        if(fileRadios.length > 0 && index > 0){
            lastFileIndex = index - 1;
            fileIndex.value = index - 1;
        }
        else {
            lastFileIndex = 0;
            fileIndex.value  = 0;
        }
    }
    else{
        fileIndex.value  = index;
    }

    // console.log("last re " + lastFileIndex);
    // console.log("len     " + fileRadios.length);

    if (fileCloseFlag == true) {
        /*!< 如果关闭的是工程文件 */
        if (index === 0){
            projectOnList(2);
            fileIndex.value = 0;
            lastFileIndex = 0;
            fileCloseFlag = false;
            updateTreeView(files[0]);
            return;
        } else {
            var saved = files[index].checkSaved();
            if (!saved){
                var sel = await messageBox({
                    title:"关闭文件",
                    message:"确定要关闭文件吗? 您还没有保存文件, 请选择是否保存文件",
                    buttons:["保存并关闭", "仅关闭不保存", "取消"],
                    cancelId: 2
                })

                if (sel === 2){
                    fileIndex.value = _fileIndex;
                    lastFileIndex = _lastFileIndex;
                    fileCloseFlag = false;
                    return;
                } else if (sel === 0){
                    /*!< 先尝试保存文件 */
                    var res = await files[index].save();
                    if (!res){
                        /*!< 保存失败取消 */
                        fileIndex.value = _fileIndex;
                        lastFileIndex = _lastFileIndex;
                        fileCloseFlag = false;
                        return;
                    }
                }

                
            } else {
                /*!< 先尝试保存文件 */
                var res = await files[index].save();
                if (!res){
                    /*!< 保存失败取消 */
                    fileIndex.value = _fileIndex;
                    lastFileIndex = _lastFileIndex;
                    fileCloseFlag = false;
                    return;
                }
            }

            fileDelItem(index);
            CUSBGroupInfoViews.splice(index-1,1);
            if (files.length === 1){
                updateTitleFile(false, true);
            }
        }

        if (lastFileIndex < fileRadios.length) {
            // console.log("1")
            fileRadios[lastFileIndex].checked = true;
        } else if (fileRadios.length > 0){
            // console.log("2")
            lastFileIndex -= 1;
            fileRadios[lastFileIndex].checked = true;
        }
    }
    else {
        lastFileIndex = index;
        TreeSelect(0, false);
    }

    updateTreeView(files[lastFileIndex]);
    fileCloseFlag = false;
}

/**
 * 文件关闭事件
 */
const FileClose = (): void => {
    fileCloseFlag = true;
}

const BUSBClick = async (): Promise<void> => {
    console.log(BUSBIndex);
    switch(BUSBIndex){
        case ButtonIndex.ProjectInit:{
            var sel = await messageBox({
                title:"初始化工程",
                message:"确定要初始化工程文件吗？ 将会重置描述符",
                buttons:["确定",  "取消"],
                cancelId: 1
            })

            if (sel === 1){
                break;
            }

            files[0].initBaseInfo();
            updateTreeView(files[0]);
            break;
        };
        case ButtonIndex.StringAdd:{
            files[0].addStringInfo();
            updateTreeView(files[0]);
            break;
        };
        case ButtonIndex.StringDel:{
            files[0].deleteStringInfo(CUSBStringInfoIndex);
            updateTreeView(files[0]);
            break;
        };
        case ButtonIndex.ConfigAdd:{
            files[0].addConfigInfo()
            updateTreeView(files[0]);
            break;
        };
        case ButtonIndex.ConfigDel:{
            if (CUSBBaseInfoView.config.length > 1){
                files[0].deleteConfigInfo(CUSBConfigInfoIndex);
                updateTreeView(files[0]);
            }
            break;
        };
        case ButtonIndex.ConfigGroupAdd:{
            var filePaths = await open();
            if (filePaths){
                files[0].addConfigGroupInfo(filePaths[0], CUSBConfigInfoIndex);
                updateTreeView(files[0]);
            }
            break;
        };
        case ButtonIndex.ConfigGroupDel:{
            files[0].deleteConfigGroupInfo(CUSBConfigInfoIndex, CUSBConfigGroupInfoIndex);
            updateTreeView(files[0]);
            break;
        };
        case ButtonIndex.AssociateAdd:{
            break;
        }
        case ButtonIndex.AssociateDel:{
            files[fileIndex.value].deleteAssociateInfo();
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.InterfaceAdd:{
            files[fileIndex.value].addInterfaceInfo();
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.InterfaceDel:{
            files[fileIndex.value].deleteInterfaceInfo(CUSBInterfaceInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.AlternateAdd:{
            files[fileIndex.value].addAlternateInfo(CUSBInterfaceInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.AlternateDel:{
            files[fileIndex.value].deleteAlternateInfo(CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.SpecificAdd:{
            files[fileIndex.value].addSpecificInfo(CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex, EUSBClass.MSC);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.SpecificDel:{
            files[fileIndex.value].deleteSpecificinfo(CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.EndpointAdd:{
            files[fileIndex.value].addEndpointInfo(CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case ButtonIndex.EndpointDel:{
            files[fileIndex.value].deleteEndpointInfo(CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex, CUSBEndpointInfoIndex);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        default:{
            break;
        }
    }
}

const BUSBGroupClick = async (index:EUSBClass):Promise<void>=>{
    switch(index){
        case EUSBClass.UNKNOWN:{
            files[fileIndex.value].addAssociateInfo();
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case EUSBClass.MSC:{
            var sel = await messageBox({
                title:"初始化分组接口",
                message:"初始化为 MSC 大容量存储设备\n分组文件用于描述一组功能类, 请勿将多个类合并在一个分组文件中\n确定要初始化吗? 将会重置描述符",
                buttons:["确定",  "取消"],
                cancelId: 1
            })

            if (sel === 1){
                break;
            }

            files[fileIndex.value].initGroupInfo(index);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case EUSBClass.HID:{
            var sel = await messageBox({
                title:"初始化分组接口",
                message:"初始化为 HID 人机交互设备\n分组文件用于描述一组功能类, 请勿将多个类合并在一个分组文件中\n确定要初始化吗? 将会重置描述符",
                buttons:["确定",  "取消"],
                cancelId: 1
            })

            if (sel === 1){
                break;
            }

            files[fileIndex.value].initGroupInfo(index);
            updateTreeView(files[fileIndex.value]);
            break;
        }
        case EUSBClass.CDC_ACM:
        case EUSBClass.CDC_ACM_DATA:{
            var sel = await messageBox({
                title:"初始化分组接口",
                message:"初始化为 CDC ACM 串行通信设备\n分组文件用于描述一组功能类, 请勿将多个类合并在一个分组文件中\n确定要初始化吗? 将会重置描述符",
                buttons:["确定",  "取消"],
                cancelId: 1
            })

            if (sel === 1){
                break;
            }

            files[fileIndex.value].initGroupInfo(index);
            updateTreeView(files[fileIndex.value]);
            break;
        }

        default:{
            break;
        }
    }
}

const CUSBSpecificInfoUpdate = ():void => {
    files[fileIndex.value].applySpecificInfo(CUSBSpecificInfoView, CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex);
}

const CUSBAssociateInfoUpdate = ():void => {
    files[fileIndex.value].applyAssociateInfo(CUSBAssociateInfoView);
}

const CUSBEndpointInfoUpdate = ():void => {
    files[fileIndex.value].applyEndpointInfo(CUSBEndpointInfoView, CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex,CUSBEndpointInfoIndex);
}

const CUSBAlternateInfoUpdate = ():void => {
    files[fileIndex.value].applyAlternateInfo(CUSBAlternateInfoView, CUSBInterfaceInfoIndex, CUSBAlternateInfoIndex);
}

/**
 * 应用设备描述符修改到文件
 */
const CUSBDeviceInfoUpdate = ():void =>{
    files[0].applyDeviceInfo(CUSBDeviceInfoView);
}

/**
 * 应用字符串描述符修改到文件
 */
const CUSBStringInfoUpdate = ():void =>{
    files[0].applyStringInfo(CUSBStringInfoView, CUSBStringInfoIndex);
}

/**
 * 应用配置描述符修改到文件
 */
const CUSBConfigInfoUpdate = ():void => {
    files[0].applyConfigInfo(CUSBConfigInfoView, CUSBConfigInfoIndex);
}

/**
 * 应用组描述符(文件地址)修改到文件
 */
const CUSBConfigGroupInfoUpdate = ():void => {
    files[0].applyConfigGroupInfo(CUSBConfigGroupinfoView.path, CUSBConfigInfoIndex, CUSBConfigGroupInfoIndex)
}


/**
 * 文件下拉菜单点击事件
 * @param index 
 * @param list 
 */
const fileOnList: Pvl.IOnList = async (index:number, list?: Array<Pvl.IList>): Promise<void> => {
    switch(index){
        /*!< 新建文件 */
        case 0: {
            var filePath = await saveAs();

            if (typeof filePath === 'string')
            {
                CUSBGroupInfoViews.push({
                    associate:undefined,
                    interface:[]
                })

                var file = new UsbConfigFile(
                    filePath,
                    reactive({
                        checked:true,
                        label:"",
                        save:true
                    }),
                    reactive([]),
                    logMsg as UsbConfigLog,
                    saveAs,
                    CUSBGroupInfoViews[CUSBGroupInfoViews.length-1]);

                fileUncheckAll();
                fileAddItem(file);
                file.saveFirst();
                updateTreeView(file);
                updateTitleFile(true, true);
            }
            break;
        }
        /*!< 打开多个文件 */
        case 1: {
            var filePaths = await open();

            if (!(typeof filePaths === 'undefined'))
            {
                filePaths.forEach(item => {
                    CUSBGroupInfoViews.push({
                        associate:undefined,
                        interface:[]
                    })

                    var file = new UsbConfigFile(
                        item,
                        reactive({
                            checked:true,
                            label:"",
                            save:true
                        }), 
                        reactive([]),
                        logMsg as UsbConfigLog,
                        saveAs,
                        CUSBGroupInfoViews[CUSBGroupInfoViews.length-1]);

                    var res = file.update();
                    if (res){
                        fileUncheckAll();
                        fileAddItem(file);
                        updateTreeView(file);
                        updateTitleFile(true, true);
                    }
                });
            }
            break;
        }
        /*!< 关闭文件 */
        case 2:{
            var saved = files[fileIndex.value].checkSaved();
            if (!saved){
                var sel = await messageBox({
                    title:"关闭文件",
                    message:"确定要关闭文件吗? 您还没有保存文件, 请选择是否保存文件",
                    buttons:["保存并关闭", "仅关闭不保存", "取消"],
                    cancelId: 2
                })

                if (sel === 2){
                    return;
                } else if (sel === 0) {
                    /*!< 先尝试保存文件 */
                    var delIndex = fileIndex.value;
                    var res = await files[delIndex].save();
                    if (!res){
                        /*!< 保存失败取消 */
                        return;
                    }
                }
            } else {
                /*!< 先尝试保存文件 */
                var delIndex = fileIndex.value;
                var res = await files[delIndex].save();
                if (!res){
                    /*!< 保存失败取消 */
                    return;
                }
            }

            var delIndex = fileIndex.value;
            fileIndex.value -= 1;
            fileRadios[fileIndex.value].checked = true;
            updateTreeView(files[fileIndex.value]);
            fileDelItem(delIndex);
            CUSBGroupInfoViews.splice(delIndex-1,1);
            if (files.length === 1){
                updateTitleFile(false, true);
            }
            break;
        }
        /*!< 保存文件 */
        case 3:{
            await files[fileIndex.value].save();
            updateTreeView(files[fileIndex.value]);
            break;
        }
        /*!< 另存为 */
        case 4:{
            await files[fileIndex.value].saveAs();
            updateTreeView(files[fileIndex.value]);
            break;
        }
        /*!< 保存全部 */
        case 5:{
            /*!< 先尝试保存所有文件 */
            var i = 0;
            for (;i<files.length;i++)
            {
                var res = await files[i].save();
                if (!res){
                    /*!< 任意文件保存失败就取消 */
                    return;
                }
            }
            updateTreeView(files[fileIndex.value]);
            break;
        }
        /*!< 退出 */
        case 6:{
            await exit();
        }
    }
}

/**
 * 工程下拉菜单点击事件
 * @param index 
 * @param list 
 */
const projectOnList: Pvl.IOnList = async (index:number, list?: Array<Pvl.IList>): Promise<void> => {
    switch(index){
        /*!< 新建工程 */
        case 0: {
            var filePath = await saveBaseAs();

            if (typeof filePath === 'string')
            {
                var file = new UsbConfigFile(
                    filePath,
                    reactive({
                        checked:true,
                        label:"",
                        save:true
                    }), 
                    reactive([]),
                    logMsg as UsbConfigLog,
                    saveBaseAs,
                    undefined,
                    CUSBBaseInfoView
                    );

                fileUncheckAll();
                fileAddItem(file);
                file.initBaseInfo();
                file.saveFirst();

                updateTreeView(file);
                updateTiltleProjcet(true);
                updateTitleFile(false, true);
            }
            break;
        }
        /*!< 打开工程 */
        case 1: {
            var filePath = await openBase();

            if (typeof filePath === 'string')
            {
                var file = new UsbConfigFile(
                    filePath,
                    reactive({
                        checked:true,
                        label:"",
                        save:true
                    }), 
                    reactive([]),
                    logMsg as UsbConfigLog,
                    saveBaseAs,
                    undefined,
                    CUSBBaseInfoView
                    );

                var res = file.update();

                if (res){    
                    fileUncheckAll();
                    fileAddItem(file);
                    updateTreeView(file);
                    updateTiltleProjcet(true);
                    updateTitleFile(false, true);
                }
            }
            break;
        }
        /*!< 关闭工程 */
        case 2: {
            var sel = await messageBox({
                title:"关闭工程",
                message:"确定要关闭工程吗? 请选择是否保存并关闭所有工程相关文件",
                buttons:["保存并关闭所有文件", "仅关闭所有文件不保存",  "取消"],
                cancelId: 2
            })

            if(sel === 2){
                return;
            } else if (sel === 1) {
                /*!< 清空文件列表 */
                fileIndex.value = 0;
                fileRadios.splice(0, fileRadios.length);
                files.splice(0, files.length);
                updateTreeView();
                updateTiltleProjcet(false);
                updateTitleFile(false, false);
                return;
            }

            /*!< 先尝试保存所有文件 */
            var i = 0;
            for (;i<files.length;i++)
            {
                var res = await files[i].save();

                if (!res){
                    /*!< 任意文件保存失败就取消 */
                    return;
                }
            }

            /*!< 清空文件列表 */
            fileIndex.value = 0;
            fileRadios.splice(0, fileRadios.length);
            files.splice(0, files.length);
            updateTreeView();
            updateTiltleProjcet(false);
            updateTitleFile(false, false);
            break;
        }
        /*!< 保存工程 */
        case 3: {
            /*!< 先尝试保存所有文件 */
            var i = 0;
            for (;i<files.length;i++)
            {
                var res = await files[i].save();

                if (!res){
                    /*!< 任意文件保存失败就取消 */
                    return;
                }
            }
            updateTreeView(files[fileIndex.value]);
            break;
        }
        /*!< 另存为 */
        case 4: {
            await files[0].saveAs();
            updateTreeView(files[fileIndex.value]);
            break;
        }
    }
}

/**
 * 视图下拉菜单点击事件
 * @param index 
 * @param list 
 */
const viewOnList: Pvl.IOnList = (index:number, list?: Array<Pvl.IList>): void => {
    switch(index){
        case 0: {

        }
    }
}

/**
 * 编译下拉菜单点击事件
 * @param index 
 * @param list 
 */
const compileOnList: Pvl.IOnList = (index:number, list?: Array<Pvl.IList>): void => {
    switch(index){
        case 0: {
            let compile = new compileCherryUSB(CUSBBaseInfoView, logMsg as UsbConfigLog);
            compile.compile();
        }
    }
}

/**
 * 帮助下拉菜单点击事件
 * @param index 
 * @param list 
 */
const helpOnList: Pvl.IOnList = (index:number, list?: Array<Pvl.IList>): void => {
    switch(index){
        case 0: shell.openExternal("https:\\cherryusb.readthedocs.io\\zh_CN\\latest\\");break;
        case 1: shell.openExternal("https:\\www.bilibili.com\\video\\BV1Ef4y1t73d");break;
        case 2: shell.openExternal("https:\\github.com\\sakumisu\\CherryUSB");break;
    }
}

/**
 * 关于下拉菜单点击事件
 * @param index 
 * @param list 
 */
const aboutOnList: Pvl.IOnList = (index:number, list?: Array<Pvl.IList>): void => {
    switch(index){
        case 0: {

        }
    }
}

/*!< 日志输出 */

function LogI(msg: any): void {
    log.value.LogI(msg.toString());
}

function LogW(msg: any): void {
    log.value.LogW(msg.toString());
}

function LogE(msg: any): void {
    log.value.LogE(msg.toString());
}

function LogClean(): void {
    log.value.LogClean();
}

/**
 * 文件列表滚轮滚动
 * @param event 
 */
function XScroll(event: any): void {
    for (var i = 0; i < 10; i++) {
        scrolldom.value.scrollTo({
            behavior: "smooth",
            left: scrolldom.value.scrollLeft + event.deltaY
        })
    }
}


/* computed ------------------------------------------------------------------*/
interface hello {
    hello:string,
    name:number
}

/* life ----------------------------------------------------------------------*/
onMounted(() => {
    window.addEventListener("resize", r.WindowResize);
    window.addEventListener("mouseup", r.MouseUp);
    logMsg = new UsbConfigLog(LogI, LogW, LogE, LogClean);
    ipcRenderer.on("usbconfig.close",exit)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", r.WindowResize);
    window.removeEventListener("mouseup", r.MouseUp);
})

/************************ (C) COPYRIGHT 2021 Egahp *****END OF SCRIPT**********/
</script>

<style scoped>
.title-panel {
    position: absolute;
    display: flex;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 20px;

    font-size: 14px;
    text-align: center;
    user-select: none;

    justify-content: left;
    align-items: center;

    color: var(--text0);
    background: var(--background1);
    border-bottom: 1px solid var(--border0);
}

.title-panel :deep(.button) {
    border: none;
}

.main-panel {
    position: absolute;
    top: 21px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    color: var(--text0);
    overflow: hidden;
}

.left-panel {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
}

.right-panel {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
}

.panel-hresize {
    position: absolute;
    top: 20px;
    bottom: 20px;
    width: 3px;
    cursor: w-resize;
}

.panel-vresize {
    position: absolute;
    left: 0px;
    right: 20px;
    height: 3px;
    cursor: s-resize;
}

.panel {
    background: var(--background1);
    border: 1px solid var(--border0);
}

.file-panel {
    position: absolute;
    display: flex;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 20px;
    justify-content: flex-start;

    overflow-x: scroll;
    overflow-y: hidden;
}

.file-panel::-webkit-scrollbar {
    display: none;
}

.file-panel :deep(.radio) {
    padding-right: 0px;
    width: auto;
    min-width: 80px;
    border-top: none;
    border-bottom: none;
    border-left: none;
}

.file-panel :deep(.button) {
    margin-left: auto;
    margin-right: 2px;
    margin-top: 2px;
    padding: 0px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 16px;
    border: none;
    border-radius: 16px;
    background: transparent;
}

/* 树形图容器 */
.tree-panel {
    position: absolute;
    top: 30px;
    left: 10px;
    right: 10px;
    bottom: 10px;
}

/* 按键容器 */
.button-panel {
    position: absolute;
    display: flex;
    top: 10px;
    left: 10px;
    right: 10px;
    overflow-y: scroll;
    background: var(--background0);
}

.button-panel::-webkit-scrollbar{
    width: 10px;
    background-color: var(--background1);
}
.button-panel::-webkit-scrollbar-track {
    background-color: var(--background0);
}

.button-panel::-webkit-scrollbar-thumb{
    background-color: var(--border0);
    border-top: 10px solid var(--background0);
    border-bottom: 10px solid var(--background0);
}

.button-panel:hover::-webkit-scrollbar-thumb{
    background-color: var(--primary0);
}



.config-panel {
    position: absolute;
    left: 10px;
    right: 10px;
    overflow-y: scroll;
    background: var(--background0);
}



.config-panel::-webkit-scrollbar{
    width: 10px;
    background-color: var(--background1);
}
.config-panel::-webkit-scrollbar-track {
    background-color: var(--background0);
}

.config-panel::-webkit-scrollbar-thumb{
    background-color: var(--border0);
    border-top: 10px solid var(--background0);
    border-bottom: 10px solid var(--background0);
}

.config-panel:hover::-webkit-scrollbar-thumb{
    background-color: var(--primary0);
}

.message-panel {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
}



</style>