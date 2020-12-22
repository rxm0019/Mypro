/**
 * 诊断维护
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/26
 */
var basDiagnoseTypeList = avalon.define({
    $id: "basDiagnoseTypeList",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    diagnoseTypeId: "", // 记录点击的类别ID
    diagnoseTypeName: "", // 记录点击的类别名称
    basDiagnoseTypeList:[]//诊断类别列表
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
         initSearch(); //初始化搜索框
         onTypeTreeLoad();
         avalon.scan();
    });
});

/**
 * 诊断类别树事件：加载诊断类别树
 * @param id
 */
function onTypeTreeLoad(selectTypeId) {
    // 树控件的基本设定
    var setting = {
        id: 'diagnoseTypeId',
        pId: 'parentTypeId',
        name: 'diagnoseTypeName',
        done: function (treeObj) {
            // 若有，则设置默认的选中类别节点
            if (isNotEmpty(selectTypeId)) {
                var node = treeObj.getNodeByParam("diagnoseTypeId", selectTypeId, null);
                if (node != null) {
                    treeObj.selectNode(node);
                }
            }
        },
        view: {
            addHoverDom: onTypeTreeAddHoverDom, // 用于当鼠标移动到节点上时，显示用户自定义控件
            removeHoverDom: onTypeTreeRemoveHoverDom,  // 用于当鼠标移出节点时，隐藏用户自定义控件
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
            beforeRemove: beforeTypeTreeNodeRemove,   // 删除事件
            beforeClick: beforeTypeTreeNodeClick // 单击节点事件
        }
    };

    // 设置左侧树的基本属性
    var initTypeTreeOption = {
        title: "诊断类别", // div树的标题
        initZtree: function (obj) { // 初始化树方法
            _ajax({
                type: "POST",
                url: $.config.services.platform + "/basDiagnoseType/listAll.do",
                data: {},
                done: function (data) {
                    // 初始化树,加载左侧树直接用方法的提供的obj
                    basDiagnoseTypeList.basDiagnoseTypeList = data;
                    menuTreeObj = _initZtree(obj, setting, data);
                    console.log(menuTreeObj);
                }
            });
        }
    };
    // 初始化类别树
    _initLeftZtree($("#basDiagnoseTypeList_typeTree"), initTypeTreeOption);
}

/**
 * 树事件：当鼠标移动到节点上时，显示增加按钮
 * @param treeId
 * @param treeNode
 */
function onTypeTreeAddHoverDom(treeId, treeNode) {
    var addBtnId = "addBtn_" + treeNode.tId;
    if (treeNode.editNameFlag || $("#" + addBtnId).length > 0) { return; }

    // 树节点标签后，添加增加按钮
    $("#" + treeNode.tId + "_span")
        .after("<span class='button add' id='" + addBtnId + "' title='增加' onfocus='this.blur();'></span>")

    // 增加按钮绑定点击事件：点击可添加子诊断类别
    var addBtnObj = $("#" + addBtnId);
    if (addBtnObj) {
        addBtnObj.bind("click", function () {
            onTypeAddSub(treeNode.diagnoseTypeId, treeNode.diagnoseTypeName);
            return false;
        });
    }
}

/**
 * 树事件：当鼠标移出节点时，移除增加按钮
 * @param treeId
 * @param treeNode
 */
function onTypeTreeRemoveHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
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
            ids.push(item.diagnoseTypeId);
        });
        //排序功能
        menuSort(ids,parentId);
    }
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
        url: $.config.services.platform + "/basDiagnoseType/sort.do",
        data:param,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("排序成功");
        }
    });
}
/**
 * 树事件：当节点删除时，调用API删除类别节点
 * @param treeId
 * @param treeNode
 * @returns {boolean}
 */
function beforeTypeTreeNodeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    var keyIds = [];
    keyIds.push(treeNode.diagnoseTypeId);
    onTypeDelete(keyIds, function () {
        // 成功删除后移除树节点
        zTree.removeNode(treeNode);
        //删除节点为已选定节点，表单与诊断项目重新赋值
        if(treeNode.diagnoseTypeId==basDiagnoseTypeList.diagnoseTypeId){
            onTypeLoad(treeNode.diagnoseTypeId);
            onTypeKeyListLoad(treeNode.diagnoseTypeId);
        }
    });
    return false;
}
/**
 * 事件：删除诊断类别
 * @param menuId
 * @param $callback
 */
function onTypeDelete(diagnoseTypeId, $callback) {
    layer.confirm('确定要删除所选记录吗？', function (index) {
        var param = {
            "ids": diagnoseTypeId
        };
        _ajax({
            type: "POST",
            url: $.config.services.platform + "/basDiagnoseType/delete.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data);
                successToast("诊断类别删除成功");
            }
        });
    });
}
/**
 * 树事件：当点击节点时，调用API加载类别节点信息
 * @param treeId
 * @param treeNode
 * @param clickFlag
 * @returns {boolean}
 */
function beforeTypeTreeNodeClick(treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if (zTree.isSelectedNode(treeNode)) {
        zTree.cancelSelectedNode(treeNode);
    } else {
        // 更新当前选中诊断类别信息
        basDiagnoseTypeList.diagnoseTypeId = treeNode.diagnoseTypeId;
        basDiagnoseTypeList.diagnoseTypeName = treeNode.diagnoseTypeName;
        // 选中类型
        zTree.selectNode(treeNode);
        // 加载诊断类型信息
        onTypeLoad(treeNode.diagnoseTypeId,treeNode.parentTypeId);
        onTypeKeyListLoad(treeNode.diagnoseTypeId);
    }
    return false;
}
/**
 * 事件：打开弹窗，可添加一级节点
 */
function onTypeAdd() {
    var title = "添加诊断类别";
    var url = $.config.server + "/backstage/basDiagnoseTypeEdit";
    openTypeEditWin(title, url, false);
}

/**
 * 树事件：打开弹窗，可添加子节点
 * @param parentId
 * @param parentName
 */
function onTypeAddSub(parentId, parentName) {
    var title = "添加子诊断类别";
    var url = $.config.server + "/backstage/basDiagnoseTypeEdit?parentId=" + parentId + "&parentName=" + parentName;
    openTypeEditWin(title, url, false);
}
/**
 * 打开诊断类型编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openTypeEditWin(title, url, readonly) {
    //sysLayerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 460, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 400,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                // 成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功");
                    var selectMenuId = isEmpty(basDiagnoseTypeList.diagnoseTypeId) ? "" : basDiagnoseTypeList.diagnoseTypeId;
                    onTypeTreeLoad(selectMenuId);
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
/**
 * 事件：根据类别ID，加载类别信息
 * @param menuId
 */
function onTypeLoad(menuId,parentTypeId) {
    var tmp = basDiagnoseTypeList.basDiagnoseTypeList.filter(x=>x.diagnoseTypeId==parentTypeId);
    // var tmp = basDiagnoseTypeList.basDiagnoseTypeList.filter(function(x) {
    //     return x.diagnoseTypeId===parentTypeId;
    // });
    var param = {
        "diagnoseTypeId": menuId
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basDiagnoseType/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var typeName='';
            if(tmp.length>0){
                typeName = tmp[0].diagnoseTypeName;
            }
            data.typeName = typeName;
            var form = layui.form;
            form.val('basDiagnoseTypeEdit_form', data);
        }
    });
}
/**
 * 类别按钮：根据类别ID，加载诊断项目列表
 * @param menuId
 */
function onTypeKeyListLoad(diagnoseTypeId) {
    var table = layui.table;
    var diagnoseDetailName = $("input[name='diagnoseDetailName']").val();
    var param = {
        "diagnoseTypeId": diagnoseTypeId,
        "diagnoseDetailName":diagnoseDetailName
    };
    _layuiTable({
        elem: '#basDiagnoseDetailList_table', // 必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basDiagnoseDetailList_table', // 必填，指定的lay-filter的名字
        // 执行渲染table配置
        render: {
            height: 'full-240', // table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basDiagnoseDetail/list.do", // ajax的url必须加上getRootPath()方法
            where: param, // 接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'diagnoseTypeName', title: '诊断类别', align: 'center'},
                { field: 'diagnoseDetailName', title: '项目名称', align: 'center'},
                { field: 'diagnoseTypeCode', title: '项目编码', align: 'center'},
                { field: 'icdCode', title: 'ICD-10' , align: 'center'},
                { field: 'speellCode', title: '拼音代码', align: 'center' },
                { field: 'remarks', title: '备注' },
                { fixed: 'right', title: '操作', width: 180, align: 'center', toolbar: '#basDiagnoseDetailList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (layEvent === 'detail') { // 查看
                if (isNotEmpty(data.diagnoseDetailId)) {
                    onDetail(data.diagnoseDetailId);
                }
            } else if (layEvent === 'edit') { // 编辑
                if (isNotEmpty(data.diagnoseDetailId)) {
                    onDetailEdit(data.diagnoseDetailId);
                }
            } else if (layEvent === 'delete') { // 删除
                layer.confirm('确定删除所选数据吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.diagnoseDetailId)) {
                        var keyIds = [];
                        keyIds.push(data.diagnoseDetailId);
                        onTypeKeyDelete(keyIds);
                    }
                });
            }
        }
    });
}
/**
 * 事件：保存类型信息
 * @param $callBack
 */
function onTypeSave($callBack) {
    if (isEmpty(basDiagnoseTypeList.diagnoseTypeId)) {
        errorToast("请选择左侧类别");
        return false;
    }
    // 对表单验证
    verifyMenuEditForm(function (field) {
        // 成功验证后
        var param = field; //表单的元素
        // 可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            url: $.config.services.platform + "/basDiagnoseType/edit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("修改成功");
                var node = menuTreeObj.getNodeByParam("diagnoseTypeId", field.diagnoseTypeId, null);
                if (node != undefined && node != null) {
                    // 同时改树上面的类型名称
                    node.diagnoseTypeName = field.diagnoseTypeName;
                    menuTreeObj.updateNode(node);
                }
                if ($callBack != undefined) {
                    $callBack(data);
                }
            }
        });
    });
}
/**
 * 项目按钮：打开弹窗，可添加项目
 * @returns {boolean}
 */
function onDetailAdd() {
    if (isEmpty(basDiagnoseTypeList.diagnoseTypeId)) {
        errorToast("请选择左侧类别");
        return false;
    }
    var title = "新增";
    var url = $.config.server + "/backstage/basDiagnoseDetailEdit?diagnoseTypeId=" + basDiagnoseTypeList.diagnoseTypeId + "&diagnoseTypeName=" + basDiagnoseTypeList.diagnoseTypeName;
    openDetailEditWin(title, url, false);
}

/**
 * 项目按钮：打开弹窗，可查看项目详情
 * @param keyId
 */
function onDetail(keyId) {
    var title = "详情";
    var url = $.config.server + "/backstage/basDiagnoseDetailEdit?id=" + keyId + "&diagnoseTypeName=" + basDiagnoseTypeList.diagnoseTypeName + "&readonly=Y";
    openDetailEditWin(title, url, true);
}

/**
 * 项目按钮：打开弹窗，可编辑项目
 * @param keyId
 */
function onDetailEdit(keyId) {
    var title = "编辑";
    var url = $.config.server + "/backstage/basDiagnoseDetailEdit?id=" + keyId + "&diagnoseTypeName=" + basDiagnoseTypeList.diagnoseTypeName;
    openDetailEditWin(title, url, false);
}
/**
 * 打开诊断项目编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openDetailEditWin(title, url, readonly) {
    //sysLayerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 500, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                // 成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功");
                    onTypeKeyListLoad(basDiagnoseTypeList.diagnoseTypeId);
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}
/**
 * 批量删除诊断项目
 */
function onDetailDelete(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basDiagnoseDetailList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if(data.length == 0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确定删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.diagnoseDetailId);
            });
            onTypeKeyDelete(ids);
        });
    }
}

/**
 * 诊断项目：删除
 * @param keyIds
 */
function onTypeKeyDelete(keyIds) {
    var param = {
        "ids": keyIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basDiagnoseDetail/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("诊断项目删除成功");
            onTypeKeyListLoad(basDiagnoseTypeList.diagnoseTypeId);
        }
    });
}
/**
 * 验证表单
 * @param $callback
 */
function verifyMenuEditForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(basDiagnoseTypeEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#basDiagnoseTypeEdit_submit").trigger('click');
}

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#basDiagnoseDetailList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'basDiagnoseDetailList_search'  //指定的lay-filter
        ,conds:[
            {field: 'diagnoseDetailName', title: '项目名称：',type:'input',placeholder:'项目名称/ICD-10/拼音代码'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            onTypeKeyListLoad();
        }
    });
}

