/****
    ******************************************************************************
    * @file          usbConfigUtil.ts
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

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/

/* class ---------------------------------------------------------------------*/

/* export --------------------------------------------------------------------*/
export function num2str(num:number, radix?:number, n?:number):string{

    if (radix && ((radix ==8) || (radix === 16) || (radix === 10))){
        var str = num.toString(radix);
        var prefix = (radix == 8) ? "0o" : ( radix == 16 ? "0x" : '' )
    } else {
        var str = num.toString();
        var prefix = '';
    }

    if (n)
    {
        let len = str.length;
        while(len < n){
            str = "0"+str;
            len++;
        }
    }

    return prefix+str;
}

export function str2num(str:string):number{
    if (str.toLocaleLowerCase().includes('0x')){
        return parseInt(str,16);
    } else if (str.toLocaleLowerCase().includes('0o')){
        return parseInt(str,8);
    } else {
        return parseInt(str,10);
    }
}

export function isUint8(num:number):boolean{
    return !isNaN(num) && num <= 0xff && num >= 0;
}

export function isUint16(num:number):boolean{
    return !isNaN(num) && num <= 0xffff && num >= 0;
}

export function isUint32(num:number):boolean{
    return !isNaN(num) && num <= 0xffffffff && num >= 0;
}

export function isUint64(num:number):boolean{
    return !isNaN(num) && num <= 0xffffffffffffffff && num >= 0;
}


/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
