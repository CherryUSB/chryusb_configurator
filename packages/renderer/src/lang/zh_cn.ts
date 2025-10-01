
const zh = {
    lang:"中文简体",
    usbconfig:{
        title:{
            button:{
                file:"文件",
                project:"工程",
                view:"视图",
                compile:"编译",
                help:"帮助",
                about:"关于"
            },
            dropdown:{
                file0:"新建文件",
                file1:"打开文件",
                file2:"关闭文件",
                file3:"保存文件",
                file4:"另存为…",
                file5:"全部保存",
                file6:"退出",
                project0:"新建工程",
                project1:"打开工程",
                project2:"关闭工程",
                project3:"保存工程",
                project4:"另存为…",
                view0:"深色模式",
                view1:"浅色模式",
                view2:"高对比深色",
                view3:"高对比浅色",
                compile0:"生成 CherryUSB 风格描述符",
                compile1:"生成 STM32 风格描述符",
                compile2:"生成 ESP32 风格描述符",
                help0:"文档教程",
                help1:"视频教程",
                help2:"GITHUB 仓库",
                about0:"联系我们",
                about1:"赞助我们",
                about2:"软件说明"
            }
        },
        file:{
            basename:"CherryUSB 工程文件",
            filename:"CherryUSB 描述文件",
            cname:"C 文件",
            savebase:"保存工程文件",
            savefile:"保存描述文件",
            savec:"保存 C 文件",
            openbase:"打开工程文件",
            openfile:"打开描述文件",
            fileok:"加载文件成功",
            filefaild:"加载文件失败",
            filecancel:"未加载文件",
            parseok:"解析文件成功"
        },
        jsonerror:{
            error0:"存在语法错误位于第 [",
            error1:"] 个字符, 错误类型: ",
            error2:"",
            "0":"成功",
            "1":"无效的标识符",
            "2":"无效的数字格式",
            "3":"缺失属性名",
            "4":"缺失属性值",
            "5":"缺失 ':'",
            "6":"缺失 ','",
            "7":"缺失 '}'",
            "8":"缺失 ']'",
            "9":"缺失 'EOF'",
            "10":"非法的注释",
            "11":"多余的多行注释结束符",
            "12":"多余的 '\'' 或 '\"'",
            "13":"多余的小数点",
            "14":"非法的Unicode字符",
            "15":"非法的转义字符",
            "16":"非法的字符"
        },
        group:{
            add_iad_desc: "添加 IAD 接口关联描述符",
            init_as_msc: "初始化为 MSC",
            init_as_hid: "初始化为 HID",
            init_as_cdc: "初始化为 CDC ACM",
            init_as_uac1: "初始化为 UAC 1.0",
            init_as_uac2: "初始化为 UAC 2.0",
            init_as_uvc: "初始化为 UVC"
        }
    },
    dialogs: {
        buttons: {
            ok: "确定",
            save_close: "保存并关闭",
            close_no_save: "仅关闭不保存",
            cancel: "取消"
        },
        init_project: {
            title: "初始化工程",
            msg: "确定要初始化工程文件吗？ 将会重置描述符",
        },
        unsaved_file: {
            title: "初始化工程",
            msg: "确定要关闭文件吗? 您还没有保存文件, 请选择是否保存文件",
        },
        init_packet_interface: {
            title:"初始化分组接口",
            msg: "初始化为 CDC ACM 串行通信设备\n分组文件用于描述一组功能类, 请勿将多个类合并在一个分组文件中\n确定要初始化吗? 将会重置描述符",
        },
    }

}

export default zh