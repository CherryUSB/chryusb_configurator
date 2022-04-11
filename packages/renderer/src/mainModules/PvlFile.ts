/****
    ******************************************************************************
    * @file          PvlFile.ts
    * @brief         file operations
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
import * as fs from 'fs';
import * as pathM from "path";

/* interface -----------------------------------------------------------------*/
export interface IPvlFile{
    save(data?:string): [boolean,number?];
    saveForce(data?:string): [boolean, number?];

    saveAs(
        openSaveDialog:()=>Promise<string | undefined>,
        data?:string,
        ): Promise<[boolean,number?]>;

    saveAsForce(
        openSaveDialog?:()=>Promise<string | undefined>,
        data?:string
        ): Promise<[boolean,number?]>;

    rename(name:string, suffix:string): [boolean, number?];

    update(): [boolean,number?];
    isChanged():[boolean, (string|number)?];
    isSaved():boolean;

    get data():string;
    set data(data:string);
}

export declare const enum PvlFileError {
    PathNotExist = 1,
    ReadError = 2,
    WriteError = 3,
    FileChange = 4,
    Cancel = 5,
    RenameError = 6,
    FirstSave = 7,
}

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
function withNullAsUndefined<T>(x: T | null): T | undefined {
    return x === null ? undefined : x;
}
/* class ---------------------------------------------------------------------*/
export class PvlFile implements IPvlFile{
    public name: string;
    public path: string;
    public suffix: string;
    public dir: string;
    public change: boolean = false;
    public saved: boolean = false;

    private hash: number = 0;
    private newHash: number = 0;
    private internaldata: string = "";

    public static path2Info(path:string):[string, string, string, string]
    {
        var basename = pathM.basename(path);
        var suffix = pathM.extname(path);
        var pos = basename.lastIndexOf('.');
        if (suffix.indexOf('.') === 0)
        {
            suffix = suffix.substring(1);
        }

        if (pos < 0){
            return [
                pathM.dirname(path),
                path,
                suffix,
                path
            ];
        } else {
            return [
                pathM.dirname(path),
                basename.substring(0, pos),
                suffix,
                path
            ];
        }
    }

    public static info2Path(dir:string, name:string, suffix:string):string{
        return pathM.join(dir, name + '.' + suffix);
    }

    constructor(path:string){
        [this.dir, this.name, this.suffix, this.path] = PvlFile.path2Info(path);
    }

    public get data(): string {
        return this.internaldata
    }
    public set data(data: string) {
        this.newHash = PvlFile.getHash(data);
        this.internaldata = data;

        // if (this.newHash != this.hash){
            this.saved = false;
        // } else {
        //     this.saved = true;
        // }
    }

    public static getHash(data:string):number{
        var hash = 0, i, char;
        if (data.length === 0){
            return 0;
        }
        for (i=0;i<data.length;i++){
            char = data.charCodeAt(i);
            hash = ((hash<<5) - hash) + char;
            hash |= 0;
        }
        return hash;
    }

    public static getNewData(path:string):string|undefined{
        try{
            return fs.readFileSync(path, 'utf-8');
        }
        catch(err){
            console.log(err);
            return undefined;
        }
    }

    /**
     * 当文件路径不存在或读取出现错误,视为文件变化
     * @returns 变化返回true和错误代号或新内容, 否则返回false
     */
    public isChanged(): [boolean, (string|number)?] {
        var isExist = fs.existsSync(this.path);
        var hash = 0;
        var ndata:string|undefined = undefined;

        if (isExist === false){
            var dirExist = fs.existsSync(this.dir)
            if (dirExist){
                return [true, 7];
            }
            return [true, 1];
        }

        ndata = PvlFile.getNewData(this.path);

        if (typeof ndata === 'undefined'){
            return [true, 2];
        }

        hash = PvlFile.getHash(ndata);

        if (hash != this.hash){
            this.change = true;
            return [true, ndata];
        }
        else {
            this.change = false;
            return [false];
        }
    }

    /**
     * 重命名文件
     * @param name 文件名
     * @param suffix 文件后缀名
     * @returns 失败返回false和错误代号, 成功返回true
     */
    public rename(name: string, suffix: string): [boolean, (number | undefined)?] {
        var isExist = fs.existsSync(this.path);

        if (isExist === false){
            this.change = true;
            return [false, 1];
        }

        try {
            var newPath = PvlFile.info2Path(this.dir, name, suffix);
            fs.renameSync(this.path, newPath);
            this.name = name;
            this.suffix = suffix;
            this.path = newPath;
            return [true];
        } catch (err) {
            console.log(err);
            return [false, 6];
        }
    }

    /**
     *  文件是否已保存
     * @returns 
     */
    public isSaved(): boolean {
        this.newHash = PvlFile.getHash(this.internaldata);
        if (this.newHash != this.hash){
            this.saved = false;
            return false;
        }
        else{
            this.saved = true;
            return true;
        }
    }

    /**
     * 保存文件
     * 当文件路径错误, 返回false和错误代码
     * 当文件原始文件产生改变, 返回false和错误代码
     * @param data 保存的数据(可选)
     * @returns 成功返回true, 失败返回false和错误代码
     */
    public save(data?: string): [boolean, (number | undefined)?] {
        return this.saveUtil(data, false);
    }

    /**
     * 保存文件
     * 当文件路径错误, 返回false和错误代码
     * 当文件原始文件产生改变, 直接覆盖
     * @param data 保存的数据(可选)
     * @returns 成功返回true, 失败返回false和错误代码
     */
    public saveForce(data?: string): [boolean, (number | undefined)?] {
        return this.saveUtil(data, true);
    }

    public saveFirst():[boolean, (number| undefined)?]
    {
        const [isChange, ndata] = this.isChanged();
        if (isChange)
        {
            if(typeof ndata === 'number')
            {
                if (!(ndata === 7))
                {
                    return [false, ndata];
                }
            }
        }

        try {
            fs.writeFileSync(this.path, this.internaldata);

            this.hash = PvlFile.getHash(this.internaldata);
            this.saved = true;
            this.change = false;
            return [true];
        }
        catch(err:any)
        {
            console.log(err.toString());
            return [false, 3];
        }
    }

    private saveUtil(data?: string, ignoreChange?:boolean): [boolean,number?] {
        const [isChange, ndata] = this.isChanged();

        if (isChange){
            if (typeof ndata === 'number')
            {
                return [false, ndata];
            }
            else{
                if ((typeof ignoreChange === 'boolean') && (ignoreChange === false)){
                    return [false, 4];
                }
            }
        }
        
        try {
            if (typeof data === 'undefined'){
                fs.writeFileSync(this.path, this.internaldata);
            } else {
                fs.writeFileSync(this.path, data);
                this.internaldata = data;
            }

            this.hash = PvlFile.getHash(this.internaldata);
            this.saved = true;
            this.change = false;
            return [true];
        }
        catch(err:any)
        {
            console.log(err.toString());
            return [false, 3];
        }
    }

    /**
     * 文件另存为
     * 当文件路径不存在,直接保存当前数据到新文件中
     * 当文件原始文件产生改变，返回false和错误代码
     * @param options 对话框属性
     * @param data 保存的数据(可选)
     * @returns 成功返回true， 取消或写入失败返回false和错误代码
     */
    public saveAs(openSaveDialog:()=>Promise<string | undefined>, data?: string): Promise<[boolean,number?]> {
            return this.saveAsUtil(openSaveDialog, data, false);
    }

    /**
     * 文件另存为
     * 当文件路径不存在,直接保存当前数据到新文件中
     * 当文件原始文件产生改变，无视改变，仅写入当前数据到文件中
     * @param options 对话框属性
     * @param data 保存的数据(可选)
     * @returns 成功返回true， 取消或写入失败返回false和错误代码
     */
    public saveAsForce(openSaveDialog:()=>Promise<string | undefined>, data?: string): Promise<[boolean,number?]> {
            return this.saveAsUtil(openSaveDialog, data, true);
    }

    private updateInfo():void{
        var nouse;
        [this.dir, this.name, this.suffix, nouse] = PvlFile.path2Info(this.path);
    }

    private async saveAsUtil(openSaveDialog:()=>Promise<string | undefined>, data?: string, ignoreChange?:boolean): Promise<[boolean,number?]>
    {
        const [isChange, ndata] = this.isChanged();

        if (isChange){
            if (typeof ndata === 'string')
            {
                if ((typeof ignoreChange === 'boolean') && (ignoreChange === false)){
                    return [false, 4];
                }
            }
        }

        const path = await openSaveDialog();

        if (typeof path === "undefined"){
            return [false, 5];
        }

        try{
            if (typeof data === 'undefined'){
                fs.writeFileSync(path as string, this.internaldata);
            } else {
                fs.writeFileSync(path as string, data);
                this.internaldata = data;
            }

            this.hash = PvlFile.getHash(this.internaldata);
            this.path = path;
            this.updateInfo();
            this.saved = true;
            this.change = false;
            return [true];
        } catch (err:any)
        {
            console.log(err.toString());
            return [false, 3]
        }
    }

    /**
     * 更新文件
     * 重新从文件读取数据, 覆盖当前内容
     * @returns 
     */
    public update(): [boolean,number?] {
        const [isChange, ndata] = this.isChanged();

        if (isChange){
            if (typeof ndata === 'number')
            {
                return [false, ndata];
            }
            else{
                this.internaldata = ndata as string;
                this.saved = true;
                this.change = false;
                this.hash = PvlFile.getHash(this.internaldata);
                this.newHash = this.hash;
                return [true]
            }
        }

        this.change = false;
        return [true]
    }
}
/* export --------------------------------------------------------------------*/

/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
