/**
 * tDeptList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var tDeptList = avalon.define({
    $id: "tDeptList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getList();
        avalon.scan();
    });
});

//获取树结点列表
function getList(id) {
    //设置左侧树的基本属性
    var opt = {
        title: "部门架构", //div树的标题
        initZtree: initZtree //初始化树方法
    };
    //加载ztree左侧树
    _initLeftZtree($("#left_tree"), opt);

    // 初始化树方法,obj：代表当前树对象
    function initZtree(obj) {
        var param = {};
        // 渲染表格
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            contentType: 'application/json;charset=utf-8', //设置请求头信息
            url: $.config.services.system + "/tDept/getLists.do",
            data: JSON.stringify(param),  //必须字符串
            done: function (data) {
                var setting = {
                    /*
                     * @param id:编号
                     * @param pId:编号的父节点
                     * @param pId:编号的名字
                     * */
                    id: 'uuid', //新增自定义参数，同ztree的data.simpleData.idKey
                    pId: 'parent', //新增自定义参数，同ztree的data.simpleData.pIdKey
                    name: 'deptName',  //新增自定义参数，同ztree的data.key.name
                    //radio:true //新增自定义参数，开启radio
                    //checkbox:true, //新增自定义参数，开启checkbox
                    done: function (treeObj) {
                        //新增自定义函数,完成初始化加载后的事件，比如可做一些反勾选操作
                        if (isNotEmpty(id)) {
                            var node = treeObj.getNodeByParam("uuid", id, null);
                            if (node != null) {
                                treeObj.selectNode(node);//选择刚刚添加的节点
                            }
                        }
                    },

                    //其它具体参数请参考ztree文档
                    view: {
                        addHoverDom: addHoverDom, //用于当鼠标移动到节点上时，显示用户自定义控件
                        removeHoverDom: removeHoverDom,  //用于当鼠标移出节点时，隐藏用户自定义控件
                        selectedMulti: false  //设置是否允许同时选中多个节点。默认值: true
                    },
                    edit: {
                        enable: true,
                        showRemoveBtn: true, //设置是否显示删除按钮。[setting.edit.enable = true 时生效]
                        showRenameBtn: false, //设置是否显示编辑名称按钮。[setting.edit.enable = true 时生效]
                        drag: {
                            prev: true,
                            next: true,
                            inner: false //拖拽到目标节点时，设置是不允许成为目标节点的子节点
                        }
                    },
                    callback: {
                        beforeDrop: beforeDrop, //拖拽释放之后事件
                        onDrop: onDrop, //拖拽操作结束事件
                        beforeRemove: beforeRemove,   //删除事件
                        beforeClick: zTreeBeforeClick //单击节点事件
                    }
                };
                //初始化树,加载左侧树直接用方法的提供的obj
                treeObj = _initZtree(obj, setting, data);
            }
        });
    }
}
/**
 * 增加节点事件
 * type:
 *   1新增节点，增加父节点时候id为空，其它时候，id为父节点
 *   2编辑 id为需要编辑的组织id
 */
function saveOrEdit(type, org, readonly) {
    var url = "";
    var title = "";
    if (type === 1) {
        //增加节点
        if (isEmpty(org)) {  //id为空,新增一级节点操作,
            title = "新增一级节点";
            //验证监舍是否存在
            url = $.config.server + "/system/tDeptEdit";
        }
        else {  //新增子节点
            title = "新增子节点";
            //传父亲的信息
            url = $.config.server + "/system/tDeptEdit?pid=" + org.uuid + "&pname=" + org.deptName;
        }
    }
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 350,  //弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  //弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, //弹框标题
        done: function (index, iframeWin) {

            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(data) {
                    var id = isEmpty(data.uuid) ? "" : data.uuid;
                    getList(id);//添加完重新加载树，传id表示选中添加的节点
                    getInfo(id);//加载刚刚添加的节点信息
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    successToast("保存成功", 500);
                }
            );
        }
    });


}

//验证表单
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(tDeptList_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段tOrgEdit_submit
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#tDeptList_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callBack) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.system + "/tDept/saveOrEdit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("修改成功", 500);
                var node = treeObj.getNodeByParam("uuid", field.uuid, null);
                if (node != undefined && node != null) {
                    //修改树的节点名
                    node.deptName = data.deptName;
                    treeObj.updateNode(node);
                }
                if ($callBack != undefined)
                    $callBack(data);
            }
        });

    });
}

/*
* 获取选择的节点信息
* @param id
* */
function getInfo(id) {
    var param = {
        "uuid": id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/tDept/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var form = layui.form; //调用layui的form模块
            form.val("tDeptList_form",data);
        }
    });
}

/**
 * 菜单删除
 * @param id  该组织id
 * @param parentid  该组织的父节点，用于展开节点
 */
function orgDel(id, $callback) {
    layer.confirm('确认要删除吗？', function (index) {
        var param = {
            "uuid": id
        };

        _ajax({
            type: "POST",
            url: $.config.services.system + "/tDept/delete.do",
            data: param,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data);
                successToast("删除成功", 500);
            }
        });
    });
}
//ztree事件：单击节点事件
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if (zTree.isSelectedNode(treeNode)) {
        zTree.cancelSelectedNode(treeNode);
    } else {
        // tOrgList.orgid = treeNode.uuid;
        // tOrgList.orgpId = treeNode.parent;
        // tOrgList.orgname = treeNode.orgName;
        zTree.selectNode(treeNode);
        // 加载节点信息
        getInfo(treeNode.uuid);
    }
    return false;
}

//ztree事件：拖拽释放之后执行
function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
    var moveNode = treeNodes[0];
    if (moveNode.level === targetNode.level) {
        if (moveNode.parentTId == targetNode.parentTId) {
            return true;
        }
    }
    warningToast("只能在本节点同级中排序");
    return false;
}

//ztree事件：拖拽操作结束事件
function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
    var moveNode = treeNodes[0];
    var pnode = moveNode.getParentNode();
    var peerNodes = [];
    if (pnode != null) {
        peerNodes = pnode.children;
    } else {
        //返回根节点集合
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        peerNodes = treeObj.getNodesByFilter(function (node) {
            return node.level == 0
        });
    }
    if (peerNodes != undefined && peerNodes.length > 0) {
        var ids = [];
        $.each(peerNodes, function (i, item) {
            ids.push(item.uuid);
        });
        //排序功能
        //menuSort(ids);
    }
}

//ztree事件：删除事件
function beforeRemove(treeId, treeNode) {

    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    orgDel(treeNode.uuid, function () {
        //成功删除后
        zTree.removeNode(treeNode);
        var form = layui.form; //调用layui的form模块
        //清空已删除节点的信息
        form.val("tDeptList_form", "");

    });
    return false;
}

//ztree事件：增加按钮事件
function addHoverDom(treeId, treeNode) {

    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='增加' onfocus='this.blur();'></span>";
    if (treeNode.type == 4) {
        //不添加 添加按钮
    } else {
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            saveOrEdit(1, treeNode);
            return false;
        });
    }
}

//ztree事件：解除增加事件
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
}



