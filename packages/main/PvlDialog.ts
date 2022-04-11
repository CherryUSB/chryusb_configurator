/****
    ******************************************************************************
    * @file          PvlDialog.ts
    * @brief         Dialog
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
import { dialog, BrowserWindow, FileFilter, MessageBoxOptions, MessageBoxReturnValue, OpenDialogOptions, OpenDialogReturnValue, SaveDialogOptions, SaveDialogReturnValue } from 'electron';

/* interface -----------------------------------------------------------------*/
export interface IPvlDialogOptions 
{
	defaultPath?: string;
    title?: string;
	buttonLabel?: string;
    filters?: FileFilter[];
    multiSelections?: boolean;
}

interface IinternalPvlDialogOptions extends IPvlDialogOptions
{
    pickFolders?: boolean;
	pickFiles?: boolean;
}

export interface IPvlDialog {
    pickFile(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>;
    pickFolder(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>;
    pickFileFolder(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>;
    saveAs(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string | undefined>;

    showMessageBox(options:MessageBoxOptions, window?:BrowserWindow): Promise<MessageBoxReturnValue>;
    showSaveDialog(options:SaveDialogOptions, window?:BrowserWindow): Promise<SaveDialogReturnValue>;
    showOpenDialog(options:OpenDialogOptions, window?:BrowserWindow): Promise<OpenDialogReturnValue>;
}

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/

/* class ---------------------------------------------------------------------*/
export class PvlDialog implements IPvlDialog {

    pickFile(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>{
        return this.doPick({ ...options, pickFiles:true, title: (options.title  || "Open File")}, window);
    }

    pickFolder(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>{
        return this.doPick({ ...options, pickFolders:true, title: (options.title  || "Open Folder")}, window);
    }

    pickFileFolder(options:IPvlDialogOptions, window?:BrowserWindow): Promise<string[] | undefined>{
        return this.doPick({ ...options, pickFiles:true, pickFolders:true, title: (options.title  || "Open")}, window);
    }

    saveAs(options: IPvlDialogOptions, window?: BrowserWindow): Promise<string | undefined> {
        return this.doSaveAs({ ...options, title: (options.title || "Save As")}, window);
    }

    private withNullAsUndefined<T>(x: T | null): T | undefined {
        return x === null ? undefined : x;
    }

    private withUndefinedAsNull<T>(x: T | undefined): T | null {
        return typeof x === 'undefined' ? null : x;
    }

    private async doPick(options:IinternalPvlDialogOptions, window?: BrowserWindow): Promise<string[] | undefined> {
        const dialogOptions: OpenDialogOptions = {
			title: options.title,
			buttonLabel: options.buttonLabel,
			filters: options.filters
		};

        dialogOptions.defaultPath = options.defaultPath;

        if (typeof options.pickFiles === 'boolean' || typeof options.pickFolders === 'boolean') {
			dialogOptions.properties = undefined; // let it override based on the booleans

			if (options.pickFiles && options.pickFolders) {
                if (typeof options.multiSelections === 'boolean'){
                    if (options.multiSelections){
                        dialogOptions.properties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
                    }
                    else{
                        dialogOptions.properties = ['openDirectory', 'openFile', 'createDirectory'];
                    }
                }
                else{
                    dialogOptions.properties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
                }
			}
		}

        if (!dialogOptions.properties) {
            if (typeof options.multiSelections === 'boolean'){
                if (options.multiSelections){
                    dialogOptions.properties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
                }
                else{
                    dialogOptions.properties = [options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
                }
            }
            else{
                dialogOptions.properties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
            }
			
		}

        // Show Dialog
		const windowToUse = window || BrowserWindow.getFocusedWindow();

		const result = await this.showOpenDialog(dialogOptions, this.withNullAsUndefined(windowToUse));
		if (result && result.filePaths && result.filePaths.length > 0) {
			return result.filePaths;
		}

		return;
    }

    private async doSaveAs(options: IPvlDialogOptions, window?: BrowserWindow): Promise<string | undefined> {
        const dialogOptions:SaveDialogOptions = {
            title: options.title,
            buttonLabel: options.buttonLabel,
            filters: options.filters
        };

        dialogOptions.defaultPath = options.defaultPath;

        dialogOptions.properties = ['showHiddenFiles','showOverwriteConfirmation','createDirectory'];

        const windowToUse = window || BrowserWindow.getFocusedWindow();

        const result = await this.showSaveDialog(dialogOptions, this.withNullAsUndefined(windowToUse));

        if (result && result.filePath){
            return result.filePath;
        }

        return undefined;
    }

    showMessageBox(options:MessageBoxOptions, window?:BrowserWindow): Promise<MessageBoxReturnValue>{
        const windowToUse = window || this.withNullAsUndefined(BrowserWindow.getFocusedWindow());

        if (typeof windowToUse !== "undefined"){
            return dialog.showMessageBox(windowToUse, options);
        } else {
            return dialog.showMessageBox(options);
        }
    }

    showSaveDialog(options:SaveDialogOptions, window?:BrowserWindow): Promise<SaveDialogReturnValue>{
        if (window){
            return dialog.showSaveDialog(window, options);
        } else {
            return dialog.showSaveDialog(options);
        }
    }

    showOpenDialog(options:OpenDialogOptions, window?:BrowserWindow): Promise<OpenDialogReturnValue>{
        if (window){
            return dialog.showOpenDialog(window, options);
        } else {
            return dialog.showOpenDialog(options);
        }
    }
}
/* export --------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
