/****
    ******************************************************************************
    * @file          usbDescriptor.ts
    * @brief         简述
    * @author        Egahp
    *                2687434412@qq.com
    * @version       1.0
    * @date          2022.04.03
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
    * 1.0|Egahp|2022.04.03|创建文件
    *****************************************************************************
    */


/* import --------------------------------------------------------------------*/

/* interface -----------------------------------------------------------------*/

/*!< chry base */

/*!< 字符串描述符 */
export interface IUSBStringInfo{
    name:string,
    value:string
}

/*!< chry 分组文件地址描述 */
export type IUSBConfigGroupInfo = string;

/*!< 配置描述符 */
export interface IUSBConfigInfo{
    string:number,
    selfpower:boolean,
    remotewakeup:boolean,
    power:number,
    group:IUSBConfigGroupInfo[]
}

export interface IUSBDeviceInfo {
    usb:number,
    class:number,
    subclass:number,
    protocol:number,
    ep0size:number,
    pid:number,
    vid:number,
    version:number
}

/*!< 设备描述符 */
export interface IUSBBaseInfo {
    device:IUSBDeviceInfo,
    string:IUSBStringInfo[],
    config:IUSBConfigInfo[]
}


/*!< chry */
/*!< 端点描述符 */
export interface IUSBEndpointInfo{
    address:number,
    direction:boolean,
    type:number,
    size:number,
    interval:number
}

export interface IUSBSpecificInfo{
    type:number
}

/*!< MSC 类特定描述符 */
export interface IUSBSpecificMSCInfo{
    type:number
}

/*!< CDC ACM类特定描述符 */
export interface IUSBSpecificCDCACMInfo{
    type:number
}

export interface IUSBSpecificCDCACMDATAInfo{
    type:number
}

/*!< HID类特定描述符 */
export interface IUSBSpecificHIDInfo{
    type:number,
}

/*!< UAC10CTRL类特定描述符 */
export interface IUSBSpecificUAC10CTRLInfo{
    type:number,
    uac_input:[],
    uac_output:[],
    uac_unit:[]
}

/*!< UAC10STREAM类特定描述符 */
export interface IUSBSpecificUACS10STREAMInfo{
    type:number
}


/*!< 接口复用描述符 */
export interface IUSBAlternateInfo{
    string:number,
    class:number,
    subclass:number,
    protocol:number,
    endpoint:IUSBEndpointInfo[],
    specific?:IUSBSpecificMSCInfo|IUSBSpecificCDCACMInfo|IUSBSpecificHIDInfo
}

/*!< 接口描述符 */
export interface IUSBInterfaceInfo{
    alternate: IUSBAlternateInfo[]
}

/*!< IAD描述符 */
export interface IUSBAssociateInfo{
    string:number,
    class:number,
    subclass:number,
    protocol:number,
    first:number,
    count:number
}

/*!< chry 分组描述符 */
export interface IUSBGroupInfo {
    associate?: IUSBAssociateInfo
    interface: IUSBInterfaceInfo[]
}

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/

/* class ---------------------------------------------------------------------*/

/* export --------------------------------------------------------------------*/



/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
