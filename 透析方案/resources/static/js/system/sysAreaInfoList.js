/**
 * 区域数据表
 * @author: Gerald
 * @version: 1.0
 * @date: 2020/08/30
 */
var treeObj;
var areaInfoList = avalon.define({
    $id: "sysAreaInfoList",
    id:"",  //记录点击的区域id
    areaName:"",  //记录点击的区域name
    areaCode:"",   //记录区域代码
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

//获取树结点列表
function getList(id){

    // 树控件的基本设定
    var setting = {
        id: 'id',
        pId: 'parentId',
        name: 'areaName',
        done: function (treeObj) {
            // 若有，则设置默认的选中菜单节点
            if(isNotEmpty(id)){
                var node = treeObj.getNodeByParam("id",id,null);
                if(node!=null){
                    treeObj.selectNode(node);
                }
            }
        },
        view: {
            addHoverDom: onTreeAddHoverDom, // 用于当鼠标移动到节点上时，显示用户自定义控件
            removeHoverDom: onTreeRemoveHoverDom,  // 用于当鼠标移出节点时，隐藏用户自定义控件
            selectedMulti: false  // 设置是否允许同时选中多个节点。默认值: true
        },
        edit: {
            enable: true,
            showRemoveBtn: true, // 设置是否显示删除按钮。[setting.edit.enable = true 时生效]
            showRenameBtn: false, // 设置是否显示编辑名称按钮。[setting.edit.enable = true 时生效]
            drag: {
                prev: true,
                next: true,
                inner: true // 拖拽到目标节点时，设置是不允许成为目标节点的子节点
            }
        },
        callback: {
            onDrop: onTreeNodeDrop, // 拖拽操作结束事件
            beforeRemove: beforeTreeNodeRemove,   // 删除事件
            beforeClick: beforeTreeNodeClick // 单击节点事件
        }
    };

    // 设置左侧树的基本属性
    var initTreeOption = {
        title: "行政区域管理", // div树的标题
        initZtree: function (obj) { // 初始化树方法
            _ajax({
                type: "POST",
                url:$.config.services.system+"/sysAreaInfo/getLists.do",
                data: {},
                done: function (data) {
                    // 初始化树,加载左侧树直接用方法的提供的obj
                    menuTreeObj = _initZtree(obj, setting, data);
                    console.log(menuTreeObj);
                }
            });
        }
    };
    // 初始化菜单树
    _initLeftZtree($("#left_tree"), initTreeOption);
}




/**
 * 增加，修改菜单事件
 * type:
 *   1新增节点，增加父节点时候id为空，其它时候，id为父节点
 *   2编辑 id为需要编辑的菜单id
 */
function saveOrEdit(type,id,name,areaCode,readonly){
    var url="";
    var title="";
    if(type===1){
        //增加节点
        if(isEmpty(id)){  //id为空,新增操作
            title="新增一级节点";
            url=$.config.server + "/system/sysAreaInfoEdit?type="+type;
        }else{  //编辑
            title="新增子节点";
            url=$.config.server + "/system/sysAreaInfoEdit?id="+id+"&parentName="+name+"&parentCode="+areaCode+"&type="+type;
        }
    }else if(type===2){
        //编辑
        if(isNotEmpty(id)){  //id为空,新增操作
            title="编辑";
            url=$.config.server + "/system/sysAreaInfoEdit?id="+id+"&areaCode="+areaCode+"&type="+type;
        }
    }
    //sysLayerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:400,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly:readonly,  //弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功",500);
                    var id=isEmpty(data.id)?"":data.id;
                    getList(data.id);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


function  getInfo(id){
    var param={
        "id":id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system+"/sysAreaInfo/getInfo.do",
        data:param,
        dataType: "json",
        done:function(data){
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('sysAreaInfoEdit_form',data);
            $("#oldAreaCode").val(data.areaCode)
        }
    });
}

//验证表单
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(sysAreaInfoEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#sysAreaInfoEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callBack){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        param['oldAreaCode']=$("#oldAreaCode").val()
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system+"/sysAreaInfo/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                successToast("修改成功");
                var node = treeObj.getNodeByParam("id",field.id,null);
                if(node!=undefined&&node!=null){
                    //同时改树上面的菜单名称
                    node.menuName=field.menuName;
                    treeObj.updateNode(node);
                }
                if($callBack!=undefined)
                    $callBack(data);
            }
        });
    });
}

/**
 * 菜单删除
 * @param id  该菜单id
 * @param areaCode 区域代码
 * @param $callback 回调事件
 */
function menuDel(id,areaCode,$callback){
    layer.confirm('确定要删除吗？',function(index){
        var param={
            "id":id,
            "areaCode":areaCode
        };
        _ajax({
            type: "POST",
            url: $.config.services.system+"/sysAreaInfo/delete.do",
            data:param,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                typeof $callback === 'function' && $callback(data);
                successToast("删除成功");
            }
        });
    });
}

/**
 * 菜单排序
 * @param type 0上移  1下移
 * @param id 当前的菜单id
 */
function menuSort(ids,parentId) {
    if(isEmpty(ids)||ids.length==0){
        return false;
    }
    var param={
        ids:ids,
        parentId:parentId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system+"/sysAreaInfo/sort.do",
        data:param,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("排序成功");
            // var id=isEmpty(data.id)?"":data.id;
            // getlist(id);
        }
    });
}

//ztree事件：单击节点事件
function beforeTreeNodeClick(treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if(zTree.isSelectedNode(treeNode)){
        zTree.cancelSelectedNode(treeNode);
    }else {
        areaInfoList.id=treeNode.id;
        areaInfoList.areaName=treeNode.areaName;
        zTree.selectNode(treeNode);
        getInfo(treeNode.id);
        //getBtnList(treeNode.id);
    }
    return false;
}
//ztree事件：拖拽释放之后执行
function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
    var moveNode = treeNodes[0];
    // if(moveNode.level===targetNode.level){
    //     if(moveNode.parentTId==targetNode.parentTId){
    //         return true;
    //     }
    // }else{
    //     if(targetNode.level==0){
    //         warningToast("根节点");
    //     }
    // }
    //warningToast("只能在本节点同级中排序");
    return true;
}
//ztree事件：拖拽操作结束事件
function onTreeNodeDrop(event, treeId, treeNodes, targetNode, moveType, isCopy){
    var moveNode = treeNodes[0];
    var pnode =moveNode.getParentNode();
    var parentId="";
    var peerNodes=[];
    if(pnode!=null){
        peerNodes=pnode.children;
        parentId=pnode.id;
    }else{
        //返回根节点集合
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        peerNodes = treeObj.getNodesByFilter(function (node) { return node.level == 0 })
    }
    if(peerNodes!=undefined&&peerNodes.length>0){
        var ids=[];
        $.each(peerNodes,function(i,item){
            console.log(item.menuName);
            ids.push(item.id);
        });
        //排序功能
        menuSort(ids,parentId);
    }
}
//ztree事件：删除事件
function beforeTreeNodeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    menuDel(treeNode.id,treeNode.areaCode,function(){
        //成功删除后
        zTree.removeNode(treeNode);
    });
    return false;
}
//ztree事件：增加按钮事件
function onTreeAddHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='增加' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        //saveOrEdit(1,treeNode.id,treeNode.areaName,treeNode.weatherCode);
        saveOrEdit(1,treeNode.id,treeNode.areaName,treeNode.areaCode);
        return false;
    });
}
//ztree事件：解除增加事件
function onTreeRemoveHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
}

//调整数据操作
function test(){
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system+"areaInfo/test.do",
        data:{},
        dataType: "json",
        done:function(data){
            successToast("修改成功");

            if($callBack!=undefined)
                $callBack(data);
        }
    });
}
