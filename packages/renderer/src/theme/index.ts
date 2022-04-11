import dark from './dark'
import light from './light'

const theme = {
    theme:<string>'light',
    themes: {
        "dark": dark,
        "light": light
    },
    SetTheme: function(key:string):void{
        theme.theme = key
    },
    Get : function(key:string,index:number):string{
        return theme.themes[theme.theme][key][index];
    },
    GetBlock: function(key:string):string{
        return theme.themes[theme.theme][key];
    },
    GetStyle: function():any{
        return {
            "--primary0":theme.Get("primary",0),
            "--primary1":theme.Get("primary",1),
            "--primary2":theme.Get("primary",2),
            "--secondary0":theme.Get("secondary",0),
            "--secondary1":theme.Get("secondary",1),
            "--secondary2":theme.Get("secondary",2),
            "--success0":theme.Get("success",0),
            "--success1":theme.Get("success",1),
            "--success2":theme.Get("success",2),
            "--warning0":theme.Get("warning",0),
            "--warning1":theme.Get("warning",1),
            "--warning2":theme.Get("warning",2),
            "--danger0":theme.Get("danger",0),
            "--danger1":theme.Get("danger",1),
            "--danger2":theme.Get("danger",2),
            "--info0":theme.Get("info",0),
            "--info1":theme.Get("info",1),
            "--info2":theme.Get("info",2),
            "--border0":theme.Get("border",0),
            "--border1":theme.Get("border",1),
            "--border2":theme.Get("border",2),
            "--text0":theme.Get("text",0),
            "--text1":theme.Get("text",1),
            "--text2":theme.Get("text",2),
            "--background0":theme.Get("background",0),
            "--background1":theme.Get("background",1),
            "--background2":theme.Get("background",2)
        }
    }
}

export default theme;