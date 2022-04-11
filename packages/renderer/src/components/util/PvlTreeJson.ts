/****
    ******************************************************************************
    * @file          PvlTreeJson.ts
    * @brief         json operations
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
import * as json from "jsonc-parser"
import i18n from "../../lang";
/* interface -----------------------------------------------------------------*/

/* data ----------------------------------------------------------------------*/

/* methods -------------------------------------------------------------------*/
export interface PvlTreeNode {
    show:boolean;
    chShow:boolean;
    checked:boolean;
    color:string;
    icon:string;
    label:string;
    depth:number;
    path:json.JSONPath;
};

export class PvlTree {
    public json_tree:json.Node;
    public view: Array<PvlTreeNode>;
    private getColorIcon:(label:string)=>[string,string];

    constructor(reactive:any, json_tree:json.Node, getColorIcon:(label:string)=>[string,string])
    {
        this.view = reactive;
        this.json_tree = json_tree
        this.getColorIcon = getColorIcon;
        this.parseNode(this.json_tree);
    }

    /**
     * 更新树
     * @param json_tree json 树
     */
    public update(json_tree?:json.Node){
        if (json_tree){
            this.json_tree = json_tree;
        }

        this.view.splice(0, this.view.length);
        this.parseNode(this.json_tree);
    }

    private addViewItem(show:boolean, checked:boolean, color:string, icon:string, label:string, path:json.JSONPath):void
    {
        let node:PvlTreeNode = 
        {
            show:show,
            chShow:true,
            checked:checked,
            color:color,
            icon:icon,
            label:label,
            depth:path.length,
            path:path
        };
        this.view.push(node);
    }

    private parseNode(node:json.Node):void
    {
        /*!< property 节点有children属性， 并且0是属性的键, 1是属性的值 */
        if(node.type === 'property')
        {
            let key = (node.children as json.Node[])[0];
            let val = (node.children as json.Node[])[1];

            /*!< 叶子节点 */
            if (val.type !== 'object' && val.type !== 'array'){
                /*!< 叶子节点不再进行递归，并且数据不由树显示 */
            }
            else{
                let path = json.getNodePath(val);
                let label:string = key.value;
                if(!(label.length === 0)){
                    label = label.trim().toLowerCase().replace(label[0], label[0].toUpperCase());
                }
                let [color, icon] = this.getColorIcon(label);
                this.addViewItem(true,false,color,icon,label,path);
                this.parseNode(val);
            }
        }
        else if (node.type ===  'object')
        {
            if (typeof node.children === 'undefined'){
                console.log("children undefined");
                return;
            }

            for (let idx = 0; idx < node.children?.length; idx++){
                this.parseNode(node.children[idx]);
            }
        }
        else if (node.type === 'array')
        {
            let nodeLabel:string = "";
            let color:string = "";
            let icon:string = "";

            if (typeof node.parent === 'undefined'){
                console.log("parent undefined");
                return;
            }

            if(node.parent.type === 'property'){
                nodeLabel = (node.parent.children as json.Node[])[0].value;
                if(!(nodeLabel.length === 0)){
                    nodeLabel = nodeLabel.trim().toLowerCase().replace(nodeLabel[0], nodeLabel[0].toUpperCase());
                }
                [color, icon] = this.getColorIcon(nodeLabel);
            }
            else{
                if(!(nodeLabel.length === 0)){
                    nodeLabel = nodeLabel.trim().toLowerCase().replace(nodeLabel[0], nodeLabel[0].toUpperCase());
                }
            }

            for (let idx = 0; idx < (node.children as json.Node[]).length; idx++)
            {
                let path = json.getNodePath((node.children as json.Node[])[idx]);
                let label = nodeLabel + '.' + idx;

                this.addViewItem(true,false,color,icon,label,path);
                this.parseNode((node.children as json.Node[])[idx]);
            }
        }
        else{
        }
    }
}


/* class ---------------------------------------------------------------------*/

/* export --------------------------------------------------------------------*/


/************************ (C) COPYRIGHT 2021 Egahp *****END OF FILE************/
