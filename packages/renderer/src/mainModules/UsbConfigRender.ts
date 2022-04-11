/****
    *********************../../../main/PvlDialog************************************
    * @file          UsbConfigRender.ts
    * @brief         use in renderer
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.03.29
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
    * 1.0|Egahp|2022.03.29|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/
import { ipcRenderer, protocol } from "electron";
import * as fs from "fs";
import * as json from "jsonc-parser";
import i18n from "../lang";
import { Pvl } from "../Pvl";
import { PvlFile } from "./PvlFile";
import { PvlTreeNode, PvlTree } from "../components/util/PvlTreeJson";
import { IUSBAlternateInfo, IUSBAssociateInfo, IUSBConfigGroupInfo, IUSBConfigInfo, IUSBBaseInfo, IUSBEndpointInfo, IUSBGroupInfo, IUSBInterfaceInfo, IUSBSpecificInfo, IUSBStringInfo, IUSBDeviceInfo } from "./usbDescriptor";
import { num2str, str2num } from '../pages/usbConfigPages/usbConfigUtil';

/* interface -----------------------------------------------------------------*/
export interface IUsbConfigDialogMessage {
    title?: string,
    message: string,
    type?: string,
    buttons?: string[],
    cancelId?: number
}

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
function withNullAsUndefined<T>(x: T | null): T | undefined {
    return x === null ? undefined : x;
}

export const openBase = async (): Promise<string | undefined> => {
    var title = i18n.global.tm("usbconfig.file.openbase").toString();
    var name = i18n.global.tm("usbconfig.file.basename").toString();

    const result = await ipcRenderer.invoke("usbconfig-basefile-open", { title, name })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })

    if (openCheck(result)) {
        return result[0]
    }
    else {
        return result;
    }
}

export const open = async (): Promise<string[] | undefined> => {
    var title = i18n.global.tm("usbconfig.file.openfile").toString();
    var name = i18n.global.tm("usbconfig.file.filename").toString();
    const result = await ipcRenderer.invoke("usbconfig-file-open", { title, name })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    return result;
}

export const openCheck = (paths: string | string[] | null | undefined): boolean => {
    if (typeof withNullAsUndefined(paths) === "undefined") {
        return false;
    }
    else {
        return true;
    }
}

export const saveBaseAs = async (): Promise<string | undefined> => {
    var title = i18n.global.tm("usbconfig.file.savebase").toString();
    var name = i18n.global.tm("usbconfig.file.basename").toString();
    const result = await ipcRenderer.invoke("usbconfig-basefile-saveas", { title, name })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    return result;
}

export const saveCAs = async (): Promise<string | undefined> => {
    var title = i18n.global.tm("usbconfig.file.savec").toString();
    var name = i18n.global.tm("usbconfig.file.cname").toString();
    const result = await ipcRenderer.invoke("usbconfig-c-saveas", { title, name })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    return result;
}

export const saveAs = async (): Promise<string | undefined> => {
    var title = i18n.global.tm("usbconfig.file.savefile").toString();
    var name = i18n.global.tm("usbconfig.file.filename").toString();
    const result = await ipcRenderer.invoke("usbconfig-file-saveas", { title, name })
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    return result;
}

export const messageBox = async (options: IUsbConfigDialogMessage): Promise<number | void> => {
    const result = await ipcRenderer.invoke("usbconfig-message", options)
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    return result;
}

const printError = function (err: json.ParseError): string {
    const errname: string = i18n.global.tm("usbconfig.jsonerror." + err.error.toString()).toString()
    const offset: string = err.offset.toString();
    const error =
        i18n.global.tm("usbconfig.jsonerror.error0") +
        offset +
        i18n.global.tm("usbconfig.jsonerror.error1") +
        errname +
        i18n.global.tm("usbconfig.jsonerror.error2")

    return error;
}

const printErrors = function (errs: json.ParseError[], LogE: (msg: string) => void): void {
    errs.forEach(item => {
        LogE(printError(item));
    });
}

const parseTree = function (jsonData: string): [boolean, json.Node | undefined, json.ParseError[]] {
    const parseOptions: json.ParseOptions = {
        disallowComments: false,
        allowTrailingComma: true,
        allowEmptyContent: false
    }

    let errors: json.ParseError[] | undefined = [];
    let tree = json.parseTree(jsonData, errors, parseOptions);

    if (errors.length == 0) {
        return [true, tree, errors];
    }
    else {
        return [false, tree, errors];
    }
}

const praseJsonTree = function (json_tree_str: string, log: UsbConfigLog): [boolean, json.Node | undefined] {
    const [result, tree, errors] = parseTree(json_tree_str);
    if (result) {
        // log.i(i18n.global.tm("usbconfig.file.parseok").toString())
        return [true, tree];
    }
    else {
        printErrors(errors, log.e)

        return [false, undefined];
    }
}

const getTreeStyle = function (label: string): [string, string] {
    const map: { [key: string]: [string, string] } = {
        "Device": ["#1976D2", 'mdi-vector-link'],
        "Alternate": ["#1976D2", 'mdi-vector-link'],
        "Associate": ["#546E7A", 'mdi-merge'],
        "Config": ["#00796B", 'mdi-cog-outline'],
        "Endpoint": ["#E64A19", 'mdi-image-filter-tilt-shift'],
        "Group": ["#3949AB", 'mdi-format-list-group'],
        "Interface": ["#EC407A", 'mdi-transit-connection-variant'],
        "Specific": ["#388E3C", 'mdi-lightbulb-question-outline'],
        "String": ["#43A047", 'mdi-message-text-outline'],
        "undefined": ["", '']
    }

    let pos = label.lastIndexOf('.');
    if (pos > 0) {
        var name = label.substring(0, pos);
    }
    name = label;

    var res = map[name];
    if (res) {
        return res;
    }
    else {
        return map["undefined"]
    }
}

/* class ---------------------------------------------------------------------*/
export class UsbConfigLog {
    public i: (msg: string) => void;
    public w: (msg: string) => void;
    public e: (msg: string) => void;
    public c: () => void;

    constructor(i: (msg: string) => void, w: (msg: string) => void, e: (msg: string) => void, c: () => void) {
        this.i = i;
        this.w = w;
        this.e = e;
        this.c = c;
    }
}


export class UsbConfigResize {
    public react: {
        sel: [boolean, boolean, boolean],
        size: [number, number, number]
    };

    private pos: { x: number, y: number } = { x: 0, y: 0 };
    private panel: { w: number, h: number } = { w: 1024, h: 720 };

    constructor(react: any) {
        this.react = react;
    }

    MouseDown = (event: any, index: number): void => {
        this.pos;
        switch (index) {
            case 0: {
                if ((event.buttons & 0x01) == 0x01) {
                    this.react.sel[0] = true;
                    this.pos.x = event.clientX;
                    this.pos.y = event.clientY;
                }
                break;
            }
            case 1: {
                if ((event.buttons & 0x01) == 0x01) {
                    this.react.sel[1] = true;
                    this.pos.x = event.clientX;
                    this.pos.y = event.clientY;
                }
                break;
            }
            case 2: {
                if ((event.buttons & 0x01) == 0x01) {
                    this.react.sel[2] = true;
                    this.pos.x = event.clientX;
                    this.pos.y = event.clientY;
                }
                break;
            }
        }
    }

    private Resize0Check = (): void => {
        if (this.react.size[0] < 300) {
            this.react.size[0] = 300;
        } else if (this.panel.w - this.react.size[0] < 350) {
            this.react.size[0] = this.panel.w - 350;
        }
    }

    private Resize1Check = (): void => {
        if (this.react.size[1] < 200) {
            this.react.size[1] = 200;
        }
        if (this.panel.h - this.react.size[1] - this.react.size[2] < 320) {
            this.react.size[1] = this.panel.h - 320 - this.react.size[2];
        }
    }

    private Resize2Check = (): void => {
        if (this.react.size[2] < 200) {
            this.react.size[2] = 200;
        }
        if (this.panel.h - this.react.size[1] - this.react.size[2] < 320) {
            this.react.size[2] = this.panel.h - 320 - this.react.size[1];
        }
    }

    private WinResizeCheck = (): void => {
        this.Resize0Check();

        if (this.react.size[2] < 200) {
            this.react.size[2] = 200;
        }

        if (this.react.size[1] < 200) {
            this.react.size[1] = 200;
        }

        if (this.panel.h - this.react.size[1] - this.react.size[2] < 320) {
            if (this.react.size[2] > 200) {
                this.react.size[2] = this.panel.h - 320 - this.react.size[1];
            } else if (this.react.size[1] > 200) {
                this.react.size[1] = this.panel.h - 320 - 200;
            }
        }
    }

    MouseUp = (): void => {
        if (this.react.sel[0]) {
            this.Resize0Check();
        }
        else if (this.react.sel[1]) {
            this.Resize1Check();
        }
        else if (this.react.sel[2]) {
            this.Resize2Check();
        }

        this.react.sel[0] = false;
        this.react.sel[1] = false;
        this.react.sel[2] = false;
    }

    MouseMove = (event: any): void => {
        if ((event.buttons & 0x01) == 0x01) {
            if (this.react.sel[0]) {
                this.react.size[0] += event.clientX - this.pos.x;
                this.Resize0Check();
                this.pos.x = event.clientX;
                this.pos.y = event.clientY;
            }
            else if (this.react.sel[1]) {
                this.react.size[1] += event.clientY - this.pos.y;
                this.Resize1Check();
                this.pos.x = event.clientX;
                this.pos.y = event.clientY;
            }
            else if (this.react.sel[2]) {
                this.react.size[2] -= event.clientY - this.pos.y;
                this.Resize2Check();
                this.pos.x = event.clientX;
                this.pos.y = event.clientY;
            }
        }
        else {
            this.react.sel[0] = false;
            this.react.sel[1] = false;
            this.react.sel[2] = false;
        }
    }

    WindowResize = (): void => {
        this.react.size[0] += document.documentElement.clientWidth - this.panel.w;
        this.panel.w = document.documentElement.clientWidth;
        this.panel.h = document.documentElement.clientHeight;
        this.WinResizeCheck()
    }
}


export enum EUSBClass {
    UNKNOWN = 0,
    MSC = 1,
    HID = 2,
    CDC_ACM = 3,
    CDC_ACM_DATA = 4,
    CDC_ECM = 5,
    CDC_ECM_DATA = 6,
    UAC_10_CTRL = 7,
    UAC_10_STREAM = 8,
    UAC_20_CTRL = 9,
    UAC_20_STREAM = 10
}

export const EUSBEndpointDir_OUT = false;
export const EUSBEndpointDir_IN = true;


export enum EUSBEndpointType {
    CTRL = 0,
    ISOC = 1,
    BULK = 2,
    INTR = 3
}



export class UsbConfigFile {

    /*!< reactive */
    public radio: Pvl.IRadio;
    public view: Array<PvlTreeNode>;

    /*!< extends */
    private file: PvlFile;
    public tree: PvlTree;

    /*!< file */
    private i_dir: string;
    private i_name: string;
    private i_path: string;
    private i_suffix: string;
    private i_data: string;

    /*!< tree */
    private i_json_tree: json.Node;

    private log: UsbConfigLog;
    private openSaveDialog: () => Promise<string | undefined>;

    public gropuInfo: IUSBGroupInfo | undefined;
    public baseInfo: IUSBBaseInfo | undefined;

    constructor(
        path: string,
        radio: Pvl.IRadio,
        view: Array<PvlTreeNode>,
        log: UsbConfigLog,
        openSaveDialog: () => Promise<string | undefined>,
        groupInfo?: IUSBGroupInfo,
        baseInfo?: IUSBBaseInfo) {
        this.radio = radio;

        if (groupInfo) {
            this.gropuInfo = groupInfo;
        }

        if (baseInfo) {
            this.baseInfo = baseInfo;
        }

        this.file = new PvlFile(path);
        this.view = view;
        this.tree = new PvlTree(view, {} as json.Node, getTreeStyle)

        this.i_path = this.file.path;
        this.i_dir = this.file.dir;
        this.i_name = this.file.name;
        this.i_suffix = this.file.suffix;
        this.i_data = this.file.data;
        this.i_json_tree = {} as json.Node;

        this.radio.label = this.name + '.' + this.suffix;
        this.radio.icon = this.file.saved ? "" : "mdi-content-save";

        this.log = log;
        this.openSaveDialog = openSaveDialog;
    }

    public get data(): string {
        this.i_data = this.file.data;
        return this.i_data;
    }
    public set data(data: string) {
        this.i_data = data;
        this.file.data = data;
        this.radio.icon = "mdi-content-save";
    }

    public get dir(): string {
        this.i_dir = this.file.dir;
        return this.i_dir;
    }
    public get name(): string {
        this.i_name = this.file.name
        return this.i_name;
    }
    public get suffix(): string {
        this.i_suffix = this.file.suffix;
        return this.i_suffix;
    }
    public get path(): string {
        this.i_path = this.file.path;
        return this.i_path;
    }

    private updateInfo(): void {
        this.i_path = this.file.path;
        this.i_dir = this.file.dir;
        this.i_name = this.file.name;
        this.i_suffix = this.file.suffix;
        this.radio.label = this.name + '.' + this.suffix;
        this.radio.icon = this.file.saved ? "" : "mdi-content-save";
    }

    public updateGroupInfo(): void {
        var node : json.Node | undefined;
        if (this.gropuInfo){
            node = json.findNodeAtLocation(this.i_json_tree, ['associate']);
            let associate = node ? json.getNodeValue(node) : undefined;
            if (associate){
                this.gropuInfo.associate = {
                    string: associate.string,
                    class: str2num(associate.class),
                    subclass: str2num(associate.subclass),
                    protocol: str2num(associate.protocol),
                    first: associate.first,
                    count: associate.count
                }
            }

            node = json.findNodeAtLocation(this.i_json_tree, ['interface']);
            var arr = node ? json.getNodeValue(node) : [];

            (this.gropuInfo as IUSBGroupInfo).interface.splice(0, (this.gropuInfo as IUSBGroupInfo).interface.length);
            if (arr.length > 0){
                arr.forEach((item :IUSBInterfaceInfo, idx:number) => {
                    (this.gropuInfo as IUSBGroupInfo).interface.push({
                        alternate:[]
                    });

                    if(item.alternate.length>0){
                        item.alternate.forEach((sitem:any,sidx:number)=>{
                            (this.gropuInfo as IUSBGroupInfo).interface[idx].alternate.push({
                                string:sitem.string,
                                class: str2num(sitem.class),
                                subclass: str2num(sitem.subclass),
                                protocol: str2num(sitem.protocol),
                                endpoint:[]
                            })

                            if (sitem.specific){
                                (this.gropuInfo as IUSBGroupInfo).interface[idx].alternate[sidx].specific = {
                                    type:sitem.specific.type
                                }
                            }

                            const map: { [key: string]: number } = {
                                "ctrl": 0,
                                "isoc": 1,
                                "bulk": 2,
                                "intr": 3,
                            }

                            sitem.endpoint.forEach((ssitem:any)=>{
                                (this.gropuInfo as IUSBGroupInfo).interface[idx].alternate[sidx].endpoint.push({
                                    address:ssitem.address,
                                    direction: ssitem.direction === 'in' ? EUSBEndpointDir_IN : EUSBEndpointDir_OUT,
                                    type: ('ctrlisocbulkintr'.search(ssitem.type) > 0) ? map[ssitem.type] : 0,
                                    size:ssitem.size,
                                    interval:ssitem.interval
                                })
                            })

                        })
                    }
                    else{
                        // (this.gropuInfo as IUSBGroupInfo).interface[idx].alternate.push({
                        //     string:0,
                        //     class:0,
                        //     subclass:0,
                        //     protocol:0,
                        //     endpoint:[]
                        // });
                    }

                });
            } else {
                // this.gropuInfo.interface.push({
                //     alternate:[]
                // });
                
                // this.gropuInfo.interface[0].alternate.push({
                //     string:0,
                //     class:0,
                //     subclass:0,
                //     protocol:0,
                //     endpoint:[]
                // });
            }
        }
    }

    /**
     * 更新整个分组描述符到文件缓存
     */
    public applyGroupInfo(): void {
        var edits: json.Edit[] = [];
        var data:string = "{}";

        if (this.gropuInfo){
            if (this.gropuInfo.associate){
                edits = json.modify(data, ['associate','string'], this.gropuInfo.associate.string,{});
                data = json.applyEdits(data, edits);
                edits = json.modify(data, ['associate','class'], num2str(this.gropuInfo.associate.class,16,2),{});
                data = json.applyEdits(data, edits);
                edits = json.modify(data, ['associate','subclass'], num2str(this.gropuInfo.associate.subclass,16,2),{});
                data = json.applyEdits(data, edits);
                edits = json.modify(data, ['associate','protocol'], num2str(this.gropuInfo.associate.protocol,16,2),{});
                data = json.applyEdits(data, edits);
                edits = json.modify(data, ['associate','first'], this.gropuInfo.associate.first,{});
                data = json.applyEdits(data, edits);
                edits = json.modify(data, ['associate','count'], this.gropuInfo.associate.count,{});
                data = json.applyEdits(data, edits);
            }

            edits = json.modify(data, ['interface'], [], {});
            data = json.applyEdits(data, edits);

            this.gropuInfo.interface.forEach((item:IUSBInterfaceInfo, idx:number)=>{
                edits = json.modify(data, ['interface', idx], {alternate:[]}, {});
                data = json.applyEdits(data, edits);

                item.alternate.forEach((sitem:IUSBAlternateInfo, sidx:number)=>{
                    edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'string'], sitem.string,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'class'], num2str(sitem.class,16,2),{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'subclass'], num2str(sitem.subclass,16,2),{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'protocol'], num2str(sitem.protocol,16,2),{});
                    data = json.applyEdits(data,edits);

                    if(sitem.specific){
                        switch (sitem.specific.type){
                            case EUSBClass.MSC:
                            case EUSBClass.HID:
                            case EUSBClass.CDC_ACM:
                            case EUSBClass.CDC_ACM_DATA:{
                                edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'specific', 'type'], sitem.specific.type,{});
                                data = json.applyEdits(data,edits);
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    }

                    const map = ['ctrl','isoc','bulk','intr'];

                    edits = json.modify(data, ['interface',idx,'alternate',sidx,'endpoint'], [], {});
                    data = json.applyEdits(data,edits);
                    sitem.endpoint.forEach((ssitem:IUSBEndpointInfo, ssidx:number)=>{
                        edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'endpoint', ssidx, 'address'],ssitem.address,{});
                        data = json.applyEdits(data,edits);
                        edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'endpoint', ssidx, 'direction'],ssitem.direction == EUSBEndpointDir_IN ? 'in' : 'out',{});
                        data = json.applyEdits(data,edits);
                        edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'endpoint', ssidx, 'type'],map[ssitem.type],{});
                        data = json.applyEdits(data,edits);
                        edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'endpoint', ssidx, 'size'],ssitem.size,{});
                        data = json.applyEdits(data,edits);
                        edits = json.modify(data, ['interface', idx, 'alternate', sidx, 'endpoint', ssidx, 'interval'],ssitem.interval,{});
                        data = json.applyEdits(data,edits);
                        /*!< TODO endpoint refresh */
                        /*!< TODO endpoint sync address */
                    })
                })

            })

            var format = json.format(data,undefined,{
                tabSize:4,
                insertSpaces:true,
                insertFinalNewline:true
            })
            var formatData = json.applyEdits(data,format);
            this.data = formatData;

            let [result, tree] = praseJsonTree(this.i_data, this.log);
            if (!result) {
                this.log.e("修改后解析失败 " + this.i_name + '.' + this.i_suffix);
                return;
            }
            this.i_json_tree = tree as json.Node;
            this.tree.update(this.i_json_tree);
            this.updateGroupInfo();
        }
    }

    public applyAssociateInfo(info:IUSBAssociateInfo):void {
        if (this.gropuInfo){
            if (this.gropuInfo.associate){
                this.gropuInfo.associate.string = info.string;
                this.gropuInfo.associate.class = info.class;
                this.gropuInfo.associate.subclass = info.subclass;
                this.gropuInfo.associate.protocol = info.protocol;
                this.gropuInfo.associate.first = info.first;
                this.gropuInfo.associate.count = info.count;
                this.applyGroupInfo();
            }
        }
    }

    public applyAlternateInfo(info:IUSBAlternateInfo, ifIndex:number, index:number): void {
        if (this.gropuInfo){
            if (this.gropuInfo.interface.length > ifIndex){
                if (this.gropuInfo.interface[ifIndex].alternate.length > index){
                    this.gropuInfo.interface[ifIndex].alternate[index].string = info.string;
                    this.gropuInfo.interface[ifIndex].alternate[index].class = info.class;
                    this.gropuInfo.interface[ifIndex].alternate[index].subclass = info.subclass;
                    this.gropuInfo.interface[ifIndex].alternate[index].protocol = info.protocol;
                    this.applyGroupInfo();
                }
            }
        }
    }

    public applyEndpointInfo(info:IUSBEndpointInfo, ifIndex:number, alIndex:number, index:number):void {
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if(this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    if(this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint.length > index){
                        
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint[index].direction = info.direction;
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint[index].type = info.type;
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint[index].address = info.address;
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint[index].size = info.size;
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint[index].interval = info.interval;
                        this.applyGroupInfo();
                    }
                }
            }
        }
    }

    public applySpecificInfo(info:IUSBSpecificInfo, ifIndex:number, alIndex:number):void {
        if (this.gropuInfo){
            if (this.gropuInfo.interface.length > ifIndex){
                if (this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    if (this.gropuInfo.interface[ifIndex].alternate[alIndex].specific){
                        (this.gropuInfo.interface[ifIndex].alternate[alIndex].specific as IUSBSpecificInfo).type = info.type;
                        this.applyGroupInfo();
                    }
                }
            }
        }
    }

    public addAssociateInfo():void {
        if (this.gropuInfo){
            if (!this.gropuInfo.associate){
                this.gropuInfo.associate = {
                    string:0,
                    class:0,
                    subclass:0,
                    protocol:0,
                    first:0,
                    count:0
                }
            }
            this.applyGroupInfo();
        }
    }

    public deleteAssociateInfo():void {
        if (this.gropuInfo){
            if (this.gropuInfo.associate){
                this.gropuInfo.associate = undefined;
                this.applyGroupInfo();
            }
        }
    }

    public addInterfaceInfo():void {
        if (this.gropuInfo){
            this.gropuInfo.interface.push({
                alternate:[]
            })
            console.log(this.gropuInfo.interface);
            this.applyGroupInfo();
        }
    }

    public deleteInterfaceInfo(index:number):void {
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > index){
                this.gropuInfo.interface.splice(index,1);
                console.log(this.gropuInfo.interface);
                this.applyGroupInfo();
            }
        }
    }

    public addAlternateInfo(ifIndex:number):void {
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                this.gropuInfo.interface[ifIndex].alternate.push({
                    string:0,
                    class:0,
                    subclass:0,
                    protocol:0,
                    specific:undefined,
                    endpoint:[]
                })
                this.applyGroupInfo();
            }
        }
    }

    public deleteAlternateInfo(ifIndex:number, index:number):void{
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if(this.gropuInfo.interface[ifIndex].alternate.length > index){
                    this.gropuInfo.interface[ifIndex].alternate.splice(index,1);
                    this.applyGroupInfo();
                }
            }
        }
    }

    public addEndpointInfo(ifIndex:number, alIndex:number):void{
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if(this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint.push({
                        address:0,
                        direction:EUSBEndpointDir_IN,
                        type:EUSBEndpointType.INTR,
                        size:64,
                        interval:1
                    })
                    this.applyGroupInfo();
                }
            }
        }
    }

    public deleteEndpointInfo(ifIndex:number, alIndex:number, index:number):void{
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if(this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    if(this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint.length > index){
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].endpoint.splice(index,1);
                        this.applyGroupInfo();
                    }
                }
            }
        }
    }

    public addSpecificInfo(ifIndex:number, alIndex:number, type:EUSBClass):void {
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if (this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    switch(type){
                        case EUSBClass.MSC:
                        case EUSBClass.HID:
                        case EUSBClass.CDC_ACM:
                        case EUSBClass.CDC_ACM_DATA:{
                            this.gropuInfo.interface[ifIndex].alternate[alIndex].specific = {
                                type:type
                            }
                            this.applyGroupInfo();
                            break;
                        }
                        default:{
                            break;
                        }
                        
                    }
                }
            }
        }
    }

    public deleteSpecificinfo(ifIndex:number, alIndex:number):void {
        if (this.gropuInfo){
            if(this.gropuInfo.interface.length > ifIndex){
                if (this.gropuInfo.interface[ifIndex].alternate.length > alIndex){
                    if (this.gropuInfo.interface[ifIndex].alternate[alIndex].specific){
                        this.gropuInfo.interface[ifIndex].alternate[alIndex].specific = undefined;
                        this.applyGroupInfo();
                    }
                }
            }
        }
    }




    public initGroupInfo(type:EUSBClass): void {
        var edits: json.Edit[] = [];
        var data:string = "{}";

        if (this.gropuInfo){
            

            switch(type){
                case EUSBClass.MSC:{
                    edits = json.modify(data, ['interface'], [], {});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'string'], 0,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'class'], "0x08",{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'subclass'], "0x06",{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'protocol'], "0x50",{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'specific', 'type'], type ,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface',0,'alternate',0,'endpoint'], [], {});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'address'],0x01,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'direction'],'out',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'type'],'bulk',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'interval'],0,{});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'address'],0x02,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'direction'],'in',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'type'],'bulk',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'interval'],0,{});
                    data = json.applyEdits(data,edits);
                    break;
                }

                case EUSBClass.HID:{
                    edits = json.modify(data, ['interface'], [], {});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'string'], 0,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'class'], '0x03',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'subclass'], '0x00',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'protocol'], '0x00',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'specific', 'type'], type ,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface',0,'alternate',0,'endpoint'], [], {});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'address'],0x01,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'direction'],'out',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'type'],'intr',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'interval'],1,{});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'address'],0x02,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'direction'],'in',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'type'],'intr',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 1, 'interval'],1,{});
                    data = json.applyEdits(data,edits);
                    break;
                }

                case EUSBClass.CDC_ACM:
                case EUSBClass.CDC_ACM_DATA:{

                    edits = json.modify(data, ['associate','string'], 0,{});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['associate','class'], '0x02',{});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['associate','subclass'], '0x02',{});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['associate','protocol'], '0x01',{});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['associate','first'], 0,{});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['associate','count'], 2,{});
                    data = json.applyEdits(data, edits);
                    
                    edits = json.modify(data, ['interface'], [], {});
                    data = json.applyEdits(data, edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'string'], 0,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'class'], '0x02',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'subclass'], '0x02',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'protocol'], '0x01',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'specific', 'type'], EUSBClass.CDC_ACM ,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0,'alternate',0,'endpoint'], [], {});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'address'],0x01,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'direction'],'out',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'type'],'intr',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 0, 'alternate', 0, 'endpoint', 0, 'interval'],1,{});
                    data = json.applyEdits(data,edits);
                    
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'string'], 0,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'class'], '0x0a',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'subclass'], '0x00',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'protocol'], '0x00',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'specific', 'type'], EUSBClass.CDC_ACM_DATA ,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1,'alternate',0,'endpoint'], [], {});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 0, 'address'],0x02,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 0, 'direction'],'out',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 0, 'type'],'bulk',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 0, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 0, 'interval'],0,{});
                    data = json.applyEdits(data,edits);

                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 1, 'address'],0x03,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 1, 'direction'],'in',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 1, 'type'],'bulk',{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 1, 'size'],64,{});
                    data = json.applyEdits(data,edits);
                    edits = json.modify(data, ['interface', 1, 'alternate', 0, 'endpoint', 1, 'interval'],0,{});
                    data = json.applyEdits(data,edits);
                    break;
                }
            }

            var format = json.format(data,undefined,{
                tabSize:4,
                insertSpaces:true,
                insertFinalNewline:true
            })
            var formatData = json.applyEdits(data,format);
            this.data = formatData;

            let [result, tree] = praseJsonTree(this.i_data, this.log);
            if (!result) {
                this.log.e("修改后解析失败 " + this.i_name + '.' + this.i_suffix);
                return;
            }
            this.i_json_tree = tree as json.Node;
            this.tree.update(this.i_json_tree);
            this.updateGroupInfo();
        }
    }

    /**
     * 从json树中更新数据到device info中
     */
    public updateBaseInfo(): void {
        var node : json.Node | undefined;
        if (this.baseInfo)
        {
            node = json.findNodeAtLocation(this.i_json_tree,['device','usb']);
            this.baseInfo.device.usb = node ? json.getNodeValue(node) : 1.1;
            node = json.findNodeAtLocation(this.i_json_tree,['device',"class"]);
            this.baseInfo.device.class = node ? str2num(json.getNodeValue(node)) : 0;
            node = json.findNodeAtLocation(this.i_json_tree,['device',"subclass"]);
            this.baseInfo.device.subclass = node ? str2num(json.getNodeValue(node)) : 0;
            node = json.findNodeAtLocation(this.i_json_tree,['device',"protocol"]);
            this.baseInfo.device.protocol = node ? str2num(json.getNodeValue(node)) : 0;
            node = json.findNodeAtLocation(this.i_json_tree,['device','ep0size']);
            this.baseInfo.device.ep0size = node ? json.getNodeValue(node) : 64;
            node = json.findNodeAtLocation(this.i_json_tree,['device',"pid"]);
            this.baseInfo.device.pid = node ? str2num(json.getNodeValue(node)) : 0;
            node = json.findNodeAtLocation(this.i_json_tree,['device',"vid"]);
            this.baseInfo.device.vid = node ? str2num(json.getNodeValue(node)) : 0;
            node = json.findNodeAtLocation(this.i_json_tree,['device','version']);
            this.baseInfo.device.version = node ? json.getNodeValue(node) : 1;


            node = json.findNodeAtLocation(this.i_json_tree,['config']);
            var carr:IUSBConfigInfo[] = (node ? json.getNodeValue(node) : []);

            if (carr.length > 0){
                (this.baseInfo as IUSBBaseInfo).config.splice(0,(this.baseInfo as IUSBBaseInfo).config.length);
                carr.forEach((item,idx)=>{
                    (this.baseInfo as IUSBBaseInfo).config.push({
                        string:item.string,
                        selfpower:item.selfpower,
                        remotewakeup:item.remotewakeup,
                        power:item.power,
                        group:[]
                    });

                    item.group.forEach((sitem)=>{
                        (this.baseInfo as IUSBBaseInfo).config[idx].group.push(sitem);
                    })
                })
            }
            else{
                (this.baseInfo as IUSBBaseInfo).config.splice(0, (this.baseInfo as IUSBBaseInfo).config.length);
                (this.baseInfo as IUSBBaseInfo).config.push({
                    string:0,
                    selfpower:false,
                    remotewakeup:true,
                    power:500,
                    group:[]
                });
            }

            node = json.findNodeAtLocation(this.i_json_tree,["string"]);
            var arr = node ? json.getNodeValue(node) : [];

            (this.baseInfo as IUSBBaseInfo).string.splice(0,(this.baseInfo as IUSBBaseInfo).string.length);
            arr.forEach((item:any)=>{
                (this.baseInfo as IUSBBaseInfo).string.push({
                    name:item.name,
                    value:item.value
                });
            })
        }
    }

    /**
     * 更新整个设备描述符到文件缓存
     * @returns 
     */
    public applyBaseInfo(): void {
        var edits: json.Edit[] = [];
        var data:string = "{}";

        if (this.baseInfo) {
            edits = json.modify(data, ['device','usb'], this.baseInfo.device.usb, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','class'], num2str(this.baseInfo.device.class, 16, 2), {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','subclass'], num2str(this.baseInfo.device.subclass, 16, 2), {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','protocol'], num2str(this.baseInfo.device.protocol, 16, 2), {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','ep0size'], this.baseInfo.device.ep0size, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','pid'], num2str(this.baseInfo.device.pid, 16, 4), {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','vid'], num2str(this.baseInfo.device.vid, 16, 4), {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','version'], this.baseInfo.device.version, {});
            data = json.applyEdits(data,edits);

            edits = json.modify(data, ['config'], [], {});
            data = json.applyEdits(data,edits);
            this.baseInfo.config.forEach((item:IUSBConfigInfo, idx:number) => {
                edits = json.modify(data, ['config', idx, 'string'], item.string, {});
                data = json.applyEdits(data,edits);
                edits = json.modify(data, ['config', idx, 'selfpower'], item.selfpower, {});
                data = json.applyEdits(data,edits);
                edits = json.modify(data,['config',idx, 'remotewakeup'], item.remotewakeup, {});
                data = json.applyEdits(data,edits);
                edits = json.modify(data,['config',idx,'power'],item.power,{});
                data = json.applyEdits(data,edits);
                edits = json.modify(data,['config',idx,'group'],item.group,{});
                data = json.applyEdits(data,edits);
            })

            edits = json.modify(data, ['string'], [], {});
            data = json.applyEdits(data,edits);
            this.baseInfo.string.forEach((item:IUSBStringInfo, idx:number) => {
                edits = json.modify(data, ['string', idx], item, {});
                data = json.applyEdits(data,edits);
            })

            var format = json.format(data,undefined,{
                tabSize:4,
                insertSpaces:true,
                insertFinalNewline:true
            })
            var formatData = json.applyEdits(data,format);
            this.data = formatData;

            let [result, tree] = praseJsonTree(this.i_data, this.log);
            if (!result) {
                this.log.e("修改后解析失败 " + this.i_name + '.' + this.i_suffix);
                return;
            }
            this.i_json_tree = tree as json.Node;
            this.tree.update(this.i_json_tree);
            this.updateBaseInfo();
        }
    }

    public applyDeviceInfo(info:IUSBDeviceInfo):void {
        if (this.baseInfo){
            this.baseInfo.device.usb = info.usb;
            this.baseInfo.device.ep0size = info.ep0size;
            this.baseInfo.device.class = info.class;
            this.baseInfo.device.subclass = info.subclass;
            this.baseInfo.device.protocol = info.protocol;
            this.baseInfo.device.pid = info.pid;
            this.baseInfo.device.vid = info.vid;
            this.baseInfo.device.version = info.version;
            this.applyBaseInfo();
        }
    }

    /**
     * 更新修改的字符串描述符到文件缓存
     * @param info 
     * @param index 
     */
    public applyStringInfo(info:IUSBStringInfo, index:number): void {
        if (this.baseInfo){
            if (this.baseInfo.string.length > index){
                this.baseInfo.string[index].name = info.name;
                this.baseInfo.string[index].value = info.value;
                this.applyBaseInfo();
            }
        }
    }

    /**
     * 更新修改的配置描述符到文件缓存
     * @param info 
     * @param index 
     */
    public applyConfigInfo(info:IUSBConfigInfo, index:number): void {
        if (this.baseInfo){
            if (this.baseInfo.config.length > index){
                this.baseInfo.config[index].string = info.string;
                this.baseInfo.config[index].selfpower = info.selfpower;
                this.baseInfo.config[index].remotewakeup = info.remotewakeup;
                this.baseInfo.config[index].power = info.power;
                this.applyBaseInfo();
            }
        }
    }

    /**
     * 更新修改的配置组描述符到文件缓存
     * @param info 
     * @param cfgIndex 
     * @param index 
     */
    public applyConfigGroupInfo(info:IUSBConfigGroupInfo, cfgIndex:number, index:number): void {
        if (this.baseInfo){
            if (this.baseInfo.config.length > cfgIndex)
            {
                if (this.baseInfo.config[cfgIndex].group.length > index){
                    this.baseInfo.config[cfgIndex].group[index] = info;
                    this.applyBaseInfo();
                }
            }
        }
    }

    /**
     * 初始化整个设备描述符到文件缓存
     * @returns 
     */
    public initBaseInfo():void {
        var edits: json.Edit[] = [];
        var data:string = "{}";

        if (this.baseInfo) {
            edits = json.modify(data, ['device','usb'], 1.1, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','class'], "0x00", {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','subclass'], "0x00", {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','protocol'], "0x00", {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','ep0size'], 64, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','pid'], "0xffff", {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','vid'], "0xffff", {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['device','version'], 1, {});
            data = json.applyEdits(data,edits);

            edits = json.modify(data, ['config', 0, 'string'], 0, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['config', 0, 'selfpower'], false, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data,['config',0, 'remotewakeup'], true, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data,['config',0,'power'],500,{});
            data = json.applyEdits(data,edits);
            edits = json.modify(data,['config',0,'group'],[],{});
            data = json.applyEdits(data,edits);

            edits = json.modify(data, ['string', 0], {name:"manufacturer",value:"Your Manufacturer"}, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['string', 1], {name:"product",value:"Your Product"}, {});
            data = json.applyEdits(data,edits);
            edits = json.modify(data, ['string', 2], {name:"serial number",value:"Your Serial Number"}, {});
            data = json.applyEdits(data,edits);


            var format = json.format(data,undefined,{
                tabSize:4,
                insertSpaces:true,
                insertFinalNewline:true
            })
            var formatData = json.applyEdits(data,format);
            this.data = formatData;

            let [result, tree] = praseJsonTree(this.i_data, this.log);
            if (!result) {
                this.log.e("初始化解析失败 " + this.i_name + '.' + this.i_suffix);
                return;
            }

            this.i_json_tree = tree as json.Node;

            this.tree.update(this.i_json_tree);
            this.updateBaseInfo();
        }
    }

    public addStringInfo(info?:IUSBStringInfo): void{
        if (this.baseInfo){
            if (info){
                this.baseInfo.string.push(info);
            } else {
                this.baseInfo.string.push({name:"new string name", value:"new string value"})
            }
            this.applyBaseInfo();
        }
    }

    public deleteStringInfo(index:number):void{
        if (this.baseInfo){
            if (this.baseInfo.string.length > index){
                this.baseInfo.string.splice(index,1);
                this.applyBaseInfo();
            }
        }
    }

    public addConfigInfo(info?:IUSBConfigInfo):void{
        if (this.baseInfo){
            if (info){
                this.baseInfo.config.push(info);
            } else {
                this.baseInfo.config.push({
                    string:0,
                    selfpower:false,
                    remotewakeup:true,
                    power:500,
                    group:[]
                })
            }
            this.applyBaseInfo();
        }
    }

    public deleteConfigInfo(index:number):void{
        if (this.baseInfo){
            if (this.baseInfo.config.length > index){
                this.baseInfo.config.splice(index,1);
                this.applyBaseInfo();
            }
        }
    }

    public addConfigGroupInfo(info:IUSBConfigGroupInfo, cfgIndex:number):void{
        if (this.baseInfo){
            if(this.baseInfo.config.length> cfgIndex){
                this.baseInfo.config[cfgIndex].group.push(info);
                this.applyBaseInfo();
            }
        }
    }

    public deleteConfigGroupInfo(cfgIndex:number, index:number):void{
        if (this.baseInfo){
            if (this.baseInfo.config.length > cfgIndex){
                if(this.baseInfo.config[cfgIndex].group.length > index){
                    this.baseInfo.config[cfgIndex].group.splice(index, 1);
                    this.applyBaseInfo();
                }
            }
        }
    }


    /**
     * 从文件更新数据, 会覆盖当前内容，同时更新tree
     * @returns 
     */
    public update(): boolean {
        let [success, error] = this.file.update();

        if (success) {
            this.i_data = this.file.data;
            this.log.i("读取文件成功 " + this.i_name + '.' + this.i_suffix);
            this.radio.icon = "";

            let [result, tree] = praseJsonTree(this.i_data, this.log);
            if (!result) {
                this.log.e("解析文件失败 " + this.i_name + '.' + this.i_suffix);
                return false;
            }
            this.i_json_tree = tree as json.Node;
            this.tree.update(this.i_json_tree);
            this.updateBaseInfo();
            this.updateGroupInfo();
        }
        else {
            this.log.e("读取文件失败, 错误代码 [" + error?.toString() + "] " + this.i_path);
        }
        return success;
    }

    public async saveFirst(): Promise<boolean> {
        var [success, error] = this.file.saveFirst();

        if (success) {
            this.radio.icon = "";
            this.log.i("创建文件成功 " + this.i_name + '.' + this.i_suffix);
        }
        else {
            switch (error) {
                case 1: {
                    return this.saveAs();
                    break;
                }
                case 2: {
                    this.log.e("保存文件失败, 读取出错 " + this.i_path);
                    break;
                }
                case 3: {
                    this.log.e("创建文件失败, 写入出错 " + this.i_path);
                    break;
                }
                default: {
                    this.log.e("创建文件失败, 未知错误 " + this.i_path);
                    break;
                }
            }
        }

        return success;
    }

    public async save(data?: string): Promise<boolean> {
        if (typeof data === 'string') {
            this.data = data;
        }
        var [success, error] = this.file.save(data);

        if (success) {
            this.log.i("保存文件成功 " + this.i_name + '.' + this.i_suffix);
            this.radio.icon = "";
        }
        else {
            console.log(error);
            switch (error) {
                case 1: {
                    return this.saveAs(data);
                    break;
                }
                case 2: {
                    this.log.e("保存文件失败, 读取出错 " + this.i_path);
                    break;
                }
                case 3: {
                    this.log.e("保存文件失败, 写入出错 " + this.i_path);
                    break;
                }
                case 4: {
                    this.log.w("保存文件失败, 文件在外部被更改 " + this.i_path);
                    var id = await messageBox({
                        title: "选择文件操作",
                        message: "文件在外部被更改, 请选择要保留的更改",
                        buttons: ["保留外部更改", "保留软件更改"],
                        cancelId: 0
                    })
                    if (id === 0) {
                        return this.update();
                    }
                    else {
                        return this.saveForce(data);
                    }
                }
                case 7: {
                    return this.saveAs(data);
                    break;
                }
                default: {
                    this.log.e("保存文件失败, 未知错误 " + this.i_path);
                    break;
                }
            }
        }

        return success;
    }

    public async saveForce(data?: string): Promise<boolean> {
        if (typeof data === 'string') {
            this.data = data;
        }
        var [success, error] = this.file.saveForce(data);

        if (success) {
            this.log.i("覆盖文件成功 " + this.i_name + '.' + this.i_suffix);
            this.radio.icon = "";
        }
        else {
            switch (error) {
                case 1: {
                    return this.saveAsForce(data);
                    break;
                }
                case 2: {
                    this.log.e("覆盖文件失败, 读取出错 " + this.i_path);
                    break;
                }
                case 3: {
                    this.log.e("覆盖文件失败, 写入出错 " + this.i_path);
                    break;
                }
                case 7: {
                    return this.saveAsForce(data);
                    break;
                }
                default: {
                    this.log.e("覆盖文件失败, 未知错误 " + this.i_path);
                    break;
                }
            }
        }

        return success;
    }

    public async saveAs(data?: string): Promise<boolean> {
        if (typeof data === 'string') {
            this.data = data;
        }
        var [success, error] = await this.file.saveAs(this.openSaveDialog, data);

        if (success) {
            var nouse;
            this.radio.icon = "";
            this.updateInfo();
            this.log.i("文件另存为成功 " + this.i_name + '.' + this.i_suffix);
        }
        else {
            switch (error) {
                case 3: {
                    this.log.e("文件另存为失败, 文件路径不存在 " + this.i_path);
                    break;
                }

                case 4: {
                    this.log.w("文件另存为失败, 文件在外部被更改 " + this.i_path);
                    var id = await messageBox({
                        title: "选择文件操作",
                        message: "文件在外部被更改, 请选择要保留的更改",
                        buttons: ["保留外部更改", "保留软件更改"],
                        cancelId: 0
                    })
                    if (id === 0) {
                        var isUpdate = this.update();
                        if (isUpdate) {
                            return this.saveAsForce(data);
                        }
                        return isUpdate;
                    }
                    else {
                        return this.saveAsForce(data);
                    }
                }
                case 5: {
                    this.log.i("文件另存为操作取消 " + this.i_name + '.' + this.i_suffix);
                    break;
                }

                default: {
                    this.log.e("文件另存为失败, 未知错误 " + this.i_path);
                    break;
                }
            }
        }

        return success;
    }

    public async saveAsForce(data?: string): Promise<boolean> {
        if (typeof data === 'string') {
            this.data = data;
        }
        var [success, error] = await this.file.saveAsForce(this.openSaveDialog, data);

        if (success) {
            var nouse;
            this.log.i("文件另存为成功 " + this.i_name + '.' + this.i_suffix);
            this.radio.icon = "";
            this.updateInfo();
        }
        else {
            switch (error) {
                case 3: {
                    this.log.e("文件另存为失败, 文件路径不存在 " + this.i_path);
                    break;
                }
                case 5: {
                    this.log.i("文件另存为操作取消 " + this.i_name + '.' + this.i_suffix);
                    break;
                }

                default: {
                    this.log.e("文件另存为失败, 未知错误 " + this.i_path);
                    break;
                }
            }
        }

        return success;
    }

    public checkSaved(): boolean {
        var saved = this.file.isSaved();
        this.updateInfo();
        return saved;
    }
}

/* export --------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
