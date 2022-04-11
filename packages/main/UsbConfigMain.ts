/****
    ******************************************************************************
    * @file          UsbConfigMain.ts
    * @brief         use in main
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
import { ipcMain } from "electron";
import { PvlDialog } from "./PvlDialog";
/* interface -----------------------------------------------------------------*/
export interface IUsbConfigDialogMessage{
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

/* class ---------------------------------------------------------------------*/
const UsbConfigIpcMainMount = () => {

    ipcMain.handle("usbconfig-basefile-open", async(event, arg)=>{
        const paths = await PvlDialog.prototype.pickFile({
                title: arg.title,
                filters: [{
                    name: arg.name,
                    extensions: ['chrybase']
                }],
                multiSelections: false
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            })

            return paths;
    })

    ipcMain.handle("usbconfig-file-open", async (event, arg) => {
        var paths = await PvlDialog.prototype.pickFile(
            {
                title: arg.title,
                filters: [{
                    name: arg.name,
                    extensions: ['chry']
                }]
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            })

        return paths;
    })

    ipcMain.handle("usbconfig-basefile-saveas", async(event, arg) => {
        var paths = await PvlDialog.prototype.saveAs(
            {
                title: arg.title,
                filters: [{
                    name: arg.name,
                    extensions: ['chrybase']
                }],
            })
            .then((res)=>{
                return res;
            })
            .catch((err) => {
                console.log(err);
            })

        return paths;
    })

    ipcMain.handle("usbconfig-c-saveas", async(event, arg) => {
        var paths = await PvlDialog.prototype.saveAs(
            {
                title: arg.title,
                filters: [{
                    name: arg.name,
                    extensions: ['c','cpp']
                }],
            })
            .then((res)=>{
                return res;
            })
            .catch((err) => {
                console.log(err);
            })

        return paths;
    })

    ipcMain.handle("usbconfig-file-saveas", async(event, arg) => {
        var paths = await PvlDialog.prototype.saveAs(
            {
                title: arg.title,
                filters: [{
                    name: arg.name,
                    extensions: ['chry']
                }]
            })
            .then((res)=>{
                return res;
            })
            .catch((err) => {
                console.log(err);
            })

        return paths;
    })

    ipcMain.handle("usbconfig-message", async(event, arg) => {
        if (typeof arg !== "undefined"){
            var result:number|void = await PvlDialog.prototype.showMessageBox({
                    title: arg.title || "Warning",
                    message:arg.message || "Message",
                    type: arg.type || "warning",
                    buttons: arg.buttons || undefined,
                    cancelId: arg.cancelId || 0
            })
            .then((res)=>{
                return res.response;
            })
            .catch((err)=>{
                console.log(err)
            })
        } else {
            var result = await PvlDialog.prototype.showMessageBox({
                    title: "Warning",
                    message: "Message",
                    type: "warning"
            })
            .then((res)=>{
                return res.response;
            })
            .catch((err)=>{
                console.log(err)
            })
        }

        return result;
    })

    ipcMain.on("usbconfig.close",(event)=>{
        event.sender.send("usbconfig.close");
    })

}
/* export --------------------------------------------------------------------*/
export default UsbConfigIpcMainMount 

/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
