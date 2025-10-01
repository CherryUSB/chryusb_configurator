
const en = {
    lang:"English",
    usbconfig:{
        title:{
            button:{
                file:"file",
                project:"project",
                view:"view",
                compile:"compile",
                help:"help",
                about:"about"
            },
            dropdown:{
                file0:"Create New File",
                file1:"Open a file",
                file2:"Close a file",
                file3:"Save a file",
                file4:"Save As...",
                file5:"Save ALL",
                file6:"Exit",
                project0:"Create a new project",
                project1:"Open Project",
                project2:"Close Project",
                project3:"Save a project",
                project4:"Save As...",
                view0:"Dark mode",
                view1:"Light mode",
                view2:"High Contrast Dark",
                view3:"high Contrast Light",
                compile0:"Generate CherryUSB style descriptors",
                compile1:"Generate STM32 style descriptors",
                compile2:"Generate ESP32 style descriptors",
                help0:"Documentation tutorials",
                help1:"Video tutorials",
                help2:"GITHUB",
                about0:"Contact us",
                about1:"Donate to us",
                about2:"Software Instructions"
            }
        },
        file:{
            basename:"CherryUSB project file",
            filename:"CherryUSB description file",
            cname:"C name",
            savebase:"savebase",
            savefile:"savefile",
            savec:"save C file",
            openbase:"openbas",
            openfile:"openfile",
            fileok:"fileOK",
            filefaild:"fileFAILD",
            filecancel:"fileCANCEL",
            parseok:"parseOK"
        },
        jsonerror:{
            error0:"syntax error at character [",
            error1:"] error type: ",
            error2:"",
            "0":"Success",
            "1":"Invalid identifier",
            "2":"Invalid number format",
            "3":"Missing attribute name",
            "4":"Missing attribute value",
            "5":"Missing ':'",
            "6":"Misisng ','",
            "7":"Misisng '}'",
            "8":"Misisng ']'",
            "9":"Misisng 'EOF'",
            "10":"Illegal comment",
            "11":"Extra multi-line comment terminator",
            "12":"Extra '\'' or '\"'",
            "13":"Extra decimal point",
            "14":"Illegal unicode character",
            "15":"Illegal escape character",
            "16":"Illegal character"
        },
        group:{
            add_iad_desc: "Add IAD",
            init_as_msc: "Init as MSC",
            init_as_hid: "Init as HID",
            init_as_cdc: "Init as CDC ACM",
            init_as_uac1: "Init as UAC 1.0",
            init_as_uac2: "Init as UAC 2.0",
            init_as_uvc: "Init as UVC"
        }
    },
    dialogs: {
        buttons: {
            ok: "OK",
            save_close: "Save and close",
            close_no_save: "Close without saving",
            cancel: "Cancel"
        },
        init_project: {
            title: "Initialize project",
            msg: "Are you sure you want to init project? The descriptor will be reset",
        },
        unsaved_file: {
            title: "Unsaved file",
            msg: "Are you sure you want to close the file? You haven't saved it yet...",
        },
        init_packet_interface: {
            title:"Initialize packet interface",
            msg: "Initialize as CDC ACM serial communication device.\nA packet file is used to describe a group of functional classes. Do not combine multiple classes in a single packet file.\nAre you sure you want to initialize? The descriptor will be reset.",
        },

    }
}

export default en