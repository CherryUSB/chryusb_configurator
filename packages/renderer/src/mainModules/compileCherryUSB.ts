/****
    ******************************************************************************
    * @file          compileCherryUSB.ts
    * @brief         编译模块
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.10
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
    * 1.0|Egahp|2022.04.10|创建文件
    *****************************************************************************
    */

import { isUint16, isUint8, num2str, str2num } from "../pages/usbConfigPages/usbConfigUtil";
import { EUSBClass, EUSBEndpointDir_IN, EUSBEndpointType, openBase, saveAs, saveCAs, UsbConfigFile, UsbConfigLog } from "./UsbConfigRender";
import { IUSBBaseInfo, IUSBGroupInfo } from "./usbDescriptor";
import * as path from 'path'
import * as fs from 'fs'
import { PvlFile } from "./PvlFile";
import { Pvl } from "../Pvl";

/* import --------------------------------------------------------------------*/

/* interface -----------------------------------------------------------------*/

/* data ----------------------------------------------------------------------*/
const file_header = 
`/**
  *
  * Licensed to the Apache Software Foundation (ASF) under one or more
  * contributor license agreements.  See the NOTICE file distributed with
  * this work for additional information regarding copyright ownership.  The
  * ASF licenses this file to you under the Apache License, Version 2.0 (the
  * "License"); you may not use this file except in compliance with the
  * License.  You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
  * License for the specific language governing permissions and limitations
  * under the License.
  *
  */


#ifndef WBVAL
#define WBVAL(x) (unsigned char)((x) & 0xFF), (unsigned char)(((x) >> 8) & 0xFF)
#endif`

const file_footer = "/*******************************************************END OF FILE*************/\n"

const descriptor_header = 
`
/*!< USBD Descriptor */
const unsigned char usbd_descriptor[] = {`
const descriptor_footer = `\n};`


/* methods -------------------------------------------------------------------*/
function isNumber(num:any):boolean{
    if(typeof num === "number"){
        if(isNaN(num)){
            return false;
        }
        return true;
    }
    return false;
}

function marco_str(marco:EKV):string{
    return marco.prefix + ' ' + marco.name + ' ' + marco.value;
}



/* class ---------------------------------------------------------------------*/
interface EKV{
    prefix:string,
    name:string,
    value:string
}

export class compileCherryUSB{
    private log:UsbConfigLog;
    public baseInfo:IUSBBaseInfo;
    public data:string|undefined;

    constructor(baseInfo:IUSBBaseInfo, log:UsbConfigLog){
        this.baseInfo = baseInfo;
        this.log = log;
    }

    public check():boolean{
        let flag:boolean = true;

        switch(this.baseInfo.device.usb){
            case 1.1:break;
            case 2.0:break;
            case 2.1:break;
            default:{
                this.log.e(`错误的设备描述符 USB Version, 应当为 [1.1 2.0 2.1] 其中一个, 实际为 [${this.baseInfo.device.usb}]`);
                flag = false;
                return false;
            }
        }

        switch(this.baseInfo.device.ep0size){
            case 64: break;
            case 8:
            case 16:
            case 32:{
                if (this.baseInfo.device.usb != 1.1){
                    this.log.e(`错误的端点0最大包长, USB 2.0 应当为 64, 实际为 [${this.baseInfo.device.ep0size}]`);
                    flag = false;
                    return false;
                }
            }
            default:{
                this.log.e(`错误的端点0最大包长, USB 1.1 版本应当为 [8 16 32 64] 其中一个, USB 2.0 应当为 64, 实际为 [${this.baseInfo.device.ep0size}]`);
                flag = false;
                return false;
            }
        }

        if (!isUint8(this.baseInfo.device.class)){
            this.log.e(`错误的设备描述符 CLASS, [${this.baseInfo.device.class}]`);
            flag = false;
            return false;
        }

        if (!isUint8(this.baseInfo.device.subclass)){
            this.log.e(`错误的设备描述符 SubCLASS, [${this.baseInfo.device.subclass}]`);
            flag = false;
            return false;
        }

        if (!isUint8(this.baseInfo.device.protocol)){
            this.log.e(`错误的设备描述符 PROTOCOL, [${this.baseInfo.device.protocol}]`);
            flag = false;
            return false;
        }

        if (!isUint16(this.baseInfo.device.pid)){
            this.log.e(`错误的设备描述符 PID, [${this.baseInfo.device.pid}]`);
            flag = false;
            return false;
        }

        if (!isUint16(this.baseInfo.device.vid)){
            this.log.e(`错误的设备描述符 VID, [${this.baseInfo.device.vid}]`);
            flag = false;
            return false;
        }

        if (!isUint8(this.baseInfo.device.version)){
            this.log.e(`错误的设备描述符 VERSION, [${this.baseInfo.device.version}]`);
            flag = false;
            return false;
        }

        /*!< 字符串描述符 */
        let string_length = this.baseInfo.string.length;

        if (string_length === 0){
            this.log.w("字符串描述符为空");
        }


        for (let i =0; i<string_length-1; i++){
            for (let j=0; j<i;j++){
                if (this.baseInfo.string[i].name == this.baseInfo.string[j].name){
                    this.log.w(`存在相同名称的字符串描述符, [${this.baseInfo.string[i].name}]`)
                }
            }
        }

        /*!< 配置描述符 */
        if (this.baseInfo.config.length <= 0){
            this.log.e("配置描述符为空")
            flag = false;
            return false;
        }

        if (this.baseInfo.config.length > 1){
            this.log.e("存在多个配置描述符, 目前仅支持一个");
            flag = false;
            return false;
        }

        this.baseInfo.config.forEach((item, index)=>{
            if(item.string > string_length || item.string <0){
                this.log.e(`错误的配置描述符 字符串, 字符串索引无效, Config [${index}]`);
                flag = false;
                return false;
            }

            if (item.power <= 0 || item.power > 500){
                this.log.e(`错误的配置描述符 POWER, 超出范围, [${item.power}]`)
                flag = false;
                return false;
            }

            if (item.group.length <= 0){
                this.log.e(`错误的配置描述符 分组长度为空`);
                flag = false;
                return false;
            }

            item.group.forEach((sitem, sindex)=>{
                if (fs.existsSync(sitem) === false){
                    this.log.e(`错误的配置描述符 分组地址不存在, [${sitem}]`);
                    flag = false;
                    return false;
                }
                
            })
        })

        if (!flag){
            return false;
        }

        let groupFiles:UsbConfigFile[] = [];
        let groupInfoViews:IUSBGroupInfo[] = [];

        this.baseInfo.config[0].group.forEach((item, index)=>{
            groupInfoViews.push({
                associate:undefined,
                interface:[]
            })

            let file = new UsbConfigFile(
                item,
                {checked:true, label:"", save:true} as Pvl.IRadio,
                [],
                this.log,
                saveAs,
                groupInfoViews[index]
            )

            var res = file.update();
            if (res){
                groupFiles.push(file);
            } else {
                this.log.e(`读取分组描述符失败, [${item}]`)
                flag = false;
                return false;
            }
        });

        if (!flag){
            return false;
        }

        groupInfoViews.forEach((item, index)=>{
            if (item.associate){
                if (item.associate.string < 0 || item.associate.string > string_length){
                    this.log.e(`错误的接口关联描述符 字符串, 字符串索引无效, [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (!isUint8(item.associate.class)){
                    this.log.e(`错误的接口关联描述符 CLASS, [${item.associate.class}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (!isUint8(item.associate.subclass)){
                    this.log.e(`错误的接口关联描述符 SubCLASS, [${item.associate.subclass}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (!isUint8(item.associate.protocol)){
                    this.log.e(`错误的接口关联描述符 PROTOCOL, [${item.associate.protocol}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                let if_length = item.interface.length;

                if (if_length <= 0){
                    this.log.e(`接口描述符为空, [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (!isNumber(item.associate.first) || item.associate.first >= if_length){
                    this.log.e(`错误的接口关联描述符 FIRST 接口索引无效 , [${item.associate.first}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (!isNumber(item.associate.count) || item.associate.count > if_length){
                    this.log.e(`错误的接口关联描述符 COUNT , [${item.associate.count}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                if (item.associate.first + item.associate.count > if_length){
                    this.log.e(`错误的接口关联描述符 COUNT 包含的接口数量超出, [${item.associate.count}], [${this.baseInfo.config[0].group[index]}]`);
                    flag = false;
                    return false;
                }

                item.interface.forEach((sitem, sindex)=>{
                    if (sitem.alternate.length <= 0){
                        this.log.e(`错误的接口描述符, Alternate 为空 , Interface [${sindex}], [${this.baseInfo.config[0].group[index]}]`);
                        flag = false;
                        return false;
                    }

                    sitem.alternate.forEach((ssitem, ssindex)=>{
                        if (ssitem.string < 0 || ssitem.string > string_length){
                            this.log.e(`错误的接口描述符 字符串, 字符串索引无效, [${this.baseInfo.config[0].group[index]}]`);
                            flag = false;
                            return false;
                        }

                        if (!isUint8(ssitem.class)){
                            this.log.e(`错误的接口描述符 CLASS, [${ssitem.class}], [${this.baseInfo.config[0].group[index]}]`);
                            flag = false;
                            return false;
                        }

                        if (!isUint8(ssitem.subclass)){
                            this.log.e(`错误的接口描述符 SubCLASS, [${ssitem.subclass}], [${this.baseInfo.config[0].group[index]}]`);
                            flag = false;
                            return false;
                        }

                        if (!isUint8(ssitem.protocol)){
                            this.log.e(`错误的接口描述符 PROTOCOL, [${ssitem.protocol}], [${this.baseInfo.config[0].group[index]}]`);
                            flag = false;
                            return false;
                        }
                        
                        let ep_length = ssitem.endpoint.length;
                        ssitem.endpoint.forEach((sssitem, sssindex)=>{
                            
                            if(!isNumber(sssitem.address) || sssitem.address <= 0 || sssitem.address >= 16){
                                if(sssitem.address >= 0x81){
                                    this.log.e(`错误的端点描述符 Address, 应当在 [1-15] 之间, 端点方向无需最高位控制, [${sssitem.address}], [${this.baseInfo.config[0].group[index]}]`)
                                    flag = false;
                                    return false;
                                }
                                this.log.e(`错误的端点描述符 Address, 应当在 [1-15] 之间, [${sssitem.address}], [${this.baseInfo.config[0].group[index]}]`)
                                flag = false;
                                return false;
                            }

                            if(!isNumber(sssitem.size) || sssitem.size <= 0 || sssitem.size >64){
                                this.log.e(`错误的端点描述符 Size, 应当在 [1-64] 之间, [${sssitem.size}], [${this.baseInfo.config[0].group[index]}]`)
                                flag = false;
                                return false;
                            }

                            switch(sssitem.type){
                                case EUSBEndpointType.CTRL:{
                                    if (sssitem.interval != 0){
                                        this.log.e(`错误的端点描述符 Interval, 控制端点应当为 0, [${sssitem.interval}], [${this.baseInfo.config[0].group[index]}]`)
                                        flag = false;
                                        return false;
                                    }
                                    break;
                                }
                                case EUSBEndpointType.ISOC:{
                                    break;
                                }
                                case EUSBEndpointType.BULK:{
                                    if (sssitem.interval != 0){
                                        this.log.e(`错误的端点描述符 Interval, BULK端点应当为 0, [${sssitem.interval}], [${this.baseInfo.config[0].group[index]}]`)
                                        flag = false;
                                        return false;
                                    }
                                    break;
                                }
                                case EUSBEndpointType.INTR:{
                                    break;
                                }
                            }

                        })
                    })
                })
            }
        })

        if (!flag){
            return false;
        }

        return true;
    }

    public async compile(): Promise<boolean>{
        this.log.c();
        this.log.i("编译检查");
        let res = this.check();
        
        if(res === true){
            this.log.i("编译检查通过");
            this.data = file_header;

            let hid_report_size:EKV[] = [];
            let hid_country_code:EKV|undefined = undefined;
            let hid_version:EKV|undefined = undefined;

            let endpoint:EKV[] = [];
            let endpoint_size:EKV[] = [];
            let endpoint_interval:EKV[] = [];

            let vid:EKV;
            let pid:EKV;
            let version:EKV;
            let length:EKV;
            let usb:EKV;
            let power:EKV;
            let langid:EKV;

            let _length = 0;

            usb = {prefix:"#define", name:"USBD_VERSION", value:""};

            usb.value = "0x0110";
            if (this.baseInfo.device.usb === 2.0){
                usb.value = "0x0200"
            } else if (this.baseInfo.device.usb === 2.1){
                usb.value = "0x0210"
            }

            vid = {prefix:"#define", name:"USBD_VID", value:num2str(this.baseInfo.device.vid, 16, 2)};
            pid = {prefix:"#define", name:"USBD_PID", value:num2str(this.baseInfo.device.pid, 16, 2)};
            version = {prefix:"#define", name:"USBD_PRODUCT_VERSION", value:num2str(this.baseInfo.device.version, 16, 4)};
            power = {prefix:"#define", name:"USBD_MAX_POWER", value:num2str(parseInt((this.baseInfo.config[0].power/2).toString()), 16, 2)}
            length = {prefix:"#define", name:"USBD_CONFIG_DESCRIPTOR_SIZE", value:"0"};
            langid = {prefix:"#define", name:"USBD_LANGID_STRING", value:"1033"};

            let groupFiles:UsbConfigFile[] = [];
            let groupInfoViews:IUSBGroupInfo[] = [];

            this.baseInfo.config[0].group.forEach((item, index)=>{
                groupInfoViews.push({
                    associate:undefined,
                    interface:[]
                })

                let file = new UsbConfigFile(
                    item,
                    {checked:true, label:"", save:true} as Pvl.IRadio,
                    [],
                    this.log,
                    saveAs,
                    groupInfoViews[index]
                )

                var res = file.update();
                if (res){
                    groupFiles.push(file);
                } else {
                    this.log.e(`读取分组描述符失败, [${item}]`)
                }
            });

            let Config_bNumInterfaces = 0;
            groupInfoViews.forEach(item => {
                Config_bNumInterfaces += item.interface.length;
            });

            let Config_bmAttributes = 0x80;
            if (this.baseInfo.config[0].selfpower){
                Config_bmAttributes = Config_bmAttributes | 0x40;
            }
            if (this.baseInfo.config[0].remotewakeup){
                Config_bmAttributes = Config_bmAttributes | 0x20;
            }

            /*!< 设备描述符 */
            if (true){
            var device_descriptor =
`   
/********************************************** Device Descriptor */
    0x12,                                       /*!< bLength */
    0x01,                                       /*!< bDescriptorType */
    WBVAL(${usb.name}),                        /*!< bcdUSB */
    ${num2str(this.baseInfo.device.class, 16, 2)},                                       /*!< bDeviceClass */
    ${num2str(this.baseInfo.device.subclass, 16, 2)},                                       /*!< bDeviceSubClass */
    ${num2str(this.baseInfo.device.protocol, 16, 2)},                                       /*!< bDeviceProtocol */
    ${num2str(this.baseInfo.device.ep0size, 16, 2)},                                       /*!< bMaxPacketSize */
    WBVAL(${vid.name}),                            /*!< idVendor */
    WBVAL(${pid.name}),                            /*!< idProduct */
    WBVAL(${version.name}),                /*!< bcdDevice */
    0x01,                                       /*!< iManufacturer */
    0x02,                                       /*!< iProduct */
    0x03,                                       /*!< iSerial */
    0x01,                                       /*!< bNumConfigurations */`
            }

            /*!< 配置描述符 */
            if (true){
            _length += 0x09;
            var config_descriptor =
`
/********************************************** Config Descriptor */
    0x09,                                       /*!< bLength */
    0x02,                                       /*!< bDescriptorType */
    WBVAL(${length.name}),         /*!< wTotalLength */
    ${num2str(Config_bNumInterfaces, 16, 2)},                                       /*!< bNumInterfaces */
    0x01,                                       /*!< bConfigurationValue */
    ${num2str(this.baseInfo.config[0].string, 16, 2)},                                       /*!< iConfiguration */
    ${num2str(Config_bmAttributes, 16, 2)},                                       /*!< bmAttributes */
    ${power.name},                             /*!< bMaxPower */`

            let interface_descriptor = "";
            let interface_count = 0;
            groupInfoViews.forEach((item, index)=>{
                let group_descriptor="";

                /*!< IAD 描述符 */
                if (item.associate){
                    _length += 0x08;
                    let associate_descriptor = 
`
/********************************************** Interface Associate Descriptor */
    0x08,                                       /*!< bLength */
    0x0b,                                       /*!< bDescriptorType */
    ${num2str(item.associate.first + interface_count, 16, 2)},                                       /*!< bFirstInterface */
    ${num2str(item.associate.count, 16, 2)},                                       /*!< bInterfaceCount */
    ${num2str(item.associate.class, 16, 2)},                                       /*!< bFunctionClass */
    ${num2str(item.associate.subclass, 16, 2)},                                       /*!< bFunctionSubClass */
    ${num2str(item.associate.protocol, 16, 2)},                                       /*!< bFunctionProtocol */
    ${num2str(item.associate.string, 16, 2)},                                       /*!< iFunction */`
                    group_descriptor = group_descriptor + associate_descriptor;
                }

                /*!< 接口描述符 */
                item.interface.forEach((sitem, sindex)=>{
                    sitem.alternate.forEach((ssitem, ssindex)=>{
                        _length += 0x09;
                        let alternate_descriptor = 
`
/********************************************** Interface ${num2str(interface_count + sindex)} Alternate ${num2str(ssindex)} Descriptor */
    0x09,                                       /*!< bLength */
    0x04,                                       /*!< bDescriptorType */
    ${num2str(interface_count + sindex, 16, 2)},                                       /*!< bInterfaceNumber */
    ${num2str(ssindex, 16, 2)},                                       /*!< bAlternateSetting */
    ${num2str(ssitem.endpoint.length, 16, 2)},                                       /*!< bNumEndpoints */
    ${num2str(ssitem.class, 16, 2)},                                       /*!< bInterfaceClass */
    ${num2str(ssitem.subclass, 16, 2)},                                       /*!< bInterfaceSubClass */
    ${num2str(ssitem.protocol, 16, 2)},                                       /*!< bInterfaceProtocol */
    ${num2str(ssitem.string, 16, 2)},                                       /*!< iInterface */`
                        group_descriptor = group_descriptor + alternate_descriptor;

                        /*!< 类特定描述符 */
                        if (ssitem.specific){
                            switch(ssitem.specific.type){
                                case EUSBClass.MSC:{
                                    let class_descriptor = 
`
/********************************************** Class Specific Descriptor of MSC */`
                                    group_descriptor = group_descriptor + class_descriptor;
                                    break;
                                }
                                case EUSBClass.HID:{
                                    hid_report_size.push({prefix:"#define", name:"USBD_IF" + (sindex+interface_count) + "_AL" + ssindex + "_HID_REPORT_DESC_SIZE",value:"2"});
                                    hid_country_code = {prefix:"#define", name:"USBD_HID_COUNTRY_CODE", value:"0"};
                                    hid_version = {prefix:"#define", name:"USBD_HID_VERSION", value:"0x0111"};
                                    _length += 0x09;
                                    let class_descriptor = 
`
/********************************************** Class Specific Descriptor of HID */
    0x09,                                       /*!< bLength */
    0x21,                                       /*!< bDescriptorType */
    WBVAL(${hid_version.name}),                    /*!< bcdHID */
    ${hid_country_code.name},                      /*!< bCountryCode */
    0x01,                                       /*!< bNumDescriptors */
    0x22,                                       /*!< bDescriptorType */
    WBVAL(${hid_report_size[hid_report_size.length-1].name}),   /*!< wItemLength */`
                                    group_descriptor = group_descriptor + class_descriptor;
                                    
                                    break;
                                }
                                case EUSBClass.CDC_ACM:{
                                    _length += (0x05 + 0x05 + 0x04 + 0x05);
                                    let class_descriptor = 
`
/********************************************** Class Specific Descriptor of CDC ACM Control */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x00,                                       /*!< bDescriptorSubtype */
    WBVAL(0x0110),                              /*!< bcdCDC */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x01,                                       /*!< bDescriptorSubtype */
    ${num2str(interface_count + sindex , 16, 2)},                                       /*!< bmCapabilities */
    ${num2str(interface_count + sindex+1, 16, 2)},                                       /*!< bDataInterface */
    0x04,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x02,                                       /*!< bDescriptorSubtype */
    0x02,                                       /*!< bmCapabilities */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x06,                                       /*!< bDescriptorSubtype */
    ${num2str(interface_count + sindex , 16, 2)},                                       /*!< bMasterInterface */
    ${num2str(interface_count + sindex+1, 16, 2)},                                       /*!< bSlaveInterface0 */`
                                    group_descriptor = group_descriptor + class_descriptor;
                                    break;
                                }
                                case EUSBClass.CDC_ACM_DATA:{
                                    let class_descriptor = 
`
/********************************************** Class Specific Descriptor of CDC ACM Data */`
                                    group_descriptor = group_descriptor + class_descriptor;
                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                        }

                        /*!< 端点描述符 */
                        ssitem.endpoint.forEach((ep, epidx)=>{
                            endpoint.push({
                                prefix:"#define", 
                                name:"USBD_IF" + (sindex+interface_count)  + "_AL" + ssindex + "_EP"+epidx+"_ADDR", 
                                value:num2str(ep.address | (ep.direction == EUSBEndpointDir_IN ? 0x80 : 0x00), 16, 2)
                            })

                            endpoint_size.push({
                                prefix:"#define", 
                                name:"USBD_IF" + (sindex+interface_count) + "_AL" + ssindex + "_EP"+epidx+"_SIZE", 
                                value:num2str(ep.size, 16, 2)
                            })

                            endpoint_interval.push({
                                prefix:"#define",
                                name:"USBD_IF" + (sindex+interface_count) + "_AL" + ssindex + "_EP"+epidx+"_INTERVAL",
                                value:num2str(ep.interval, 16, 2)
                            })

                            _length += 0x07;
                            let endpoint_descriptor =
`
/********************************************** Endpoint ${num2str(epidx)} Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    ${endpoint[endpoint.length-1].name},                      /*!< bEndpointAddress */
    ${num2str(ep.type, 16, 2)},                                       /*!< bmAttributes */
    WBVAL(${endpoint_size[endpoint.length-1].name}),               /*!< wMaxPacketSize */
    ${endpoint_interval[endpoint.length-1].name},                  /*!< bInterval */`   

                            group_descriptor = group_descriptor + endpoint_descriptor;
                        })

                    })
                })

                interface_count += item.interface.length;
                interface_descriptor = interface_descriptor + group_descriptor;
            })

            length.value = num2str(_length);
            config_descriptor = config_descriptor + interface_descriptor;
            }

            /*!< 字符串描述符 */
            if (true){
                var string_descriptor = "";
                let langid_strign_descriptor =
`
/********************************************** Language ID String Descriptor */
    0x04,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    WBVAL(${langid.name}),                  /*!< wLangID0 */`
                
                string_descriptor = string_descriptor + langid_strign_descriptor;

                this.baseInfo.string.forEach((item, index)=>{
                    let string_descriptor_one =
`
/********************************************** String ${index+1} Descriptor */
/* ${item.value} */
    ${num2str(item.value.length*2 + 2, 16, 2)},                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */`;
                    for(let i =0;i<item.value.length;i++){
                        let char = 
`
    ${num2str(item.value.charCodeAt(i), 16, 2)}, 0x00,                                 /*!< '${item.value.charAt(i)}' wcChar${i} */`

                        string_descriptor_one = string_descriptor_one + char;
                    }

                    string_descriptor = string_descriptor + string_descriptor_one;
                })
            }

            let end_descriptor = ""
            if (this.baseInfo.device.usb === 2.0 || this.baseInfo.device.usb === 2.1)
            {
                let desc = 
`
/********************************************** Device Qualifier Descriptor */
    0x0a,                                       /*!< bLength */
    0x06,                                       /*!< bDescriptorType */
    WBVAL(${usb.name}),                        /*!< bcdUSB */
    0x00,                                       /*!< bDeviceClass */
    0x00,                                       /*!< bDeviceSubClass */
    0x00,                                       /*!< bDeviceProtocol */
    0x40,                                       /*!< bMaxPacketSize0 */
    0x01,                                       /*!< bNumConfigurations */
    0x00,                                       /*!< bReserved */`
                end_descriptor = end_descriptor + desc;
            }

            end_descriptor = end_descriptor + '\n    0x00';

            let descirptor = descriptor_header + device_descriptor + config_descriptor + string_descriptor + end_descriptor +descriptor_footer;



            

            let base_marco = 
`
/*!< USBD CONFIG */
${marco_str(usb)}
${marco_str(version)}
${marco_str(vid)}
${marco_str(pid)}
${marco_str(power)}
${marco_str(langid)}
${marco_str(length)}
`   

            let ep_marco = '/*!< USBD ENDPOINT CONFIG */\n'
            for (let i=0; i<endpoint.length ;i++){
                let ep_marco_one = 
`
${marco_str(endpoint[i])}
${marco_str(endpoint_size[i])}
${marco_str(endpoint_interval[i])}
`
                ep_marco = ep_marco + ep_marco_one;
            }

            let hid_marco = "/*!< USBD HID CONFIG */\n";
            if (hid_version){
                hid_marco = hid_marco + marco_str(hid_version) + '\n';
                
            }

            if (hid_country_code){
                hid_marco = hid_marco + marco_str(hid_country_code) + '\n';
            }

            hid_report_size.forEach((item, index)=>{
                hid_marco = hid_marco + marco_str(item) + '\n';
            })

            let hid_report_descriptor = ""

            hid_report_size.forEach((item, index)=>{
                let hid_report_descriptor_one = 
`
/*!< USBD HID REPORT ${index} Descriptor */
const unsigned char usbd_hid_${index}_report_descriptor[${item.name}] = {
    0x00,
    0xC0    /* END_COLLECTION */
};\n\n\n\n`
                hid_report_descriptor = hid_report_descriptor + hid_report_descriptor_one;
            })

            this.data = file_header + "\n\n\n\n" + base_marco + "\n\n\n\n" + ep_marco + "\n\n\n\n" + hid_marco + "\n\n\n" + descirptor + "\n\n\n\n" + hid_report_descriptor + file_footer;
            

            this.log.i("编译完成");
            var file_path = await saveCAs();

            if (file_path){
                try {
                    fs.writeFileSync(file_path, this.data);
                    this.log.i("描述符文件已生成");
                    return true;
                }
                catch(err:any){
                    this.log.e(err.toString());
                    this.log.i("描述符文件未生成");
                    return false;
                }
                
            }

            this.log.i("描述符文件未生成");
            return false;
        }

        this.log.e("编译检查失败");
        return false;
    }

}
/* export --------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
