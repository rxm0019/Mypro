/**
 * 菜单管理
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var menuTreeObj; // 菜单树对象
var sysMenuList = avalon.define({
    $id: "sysMenuList",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    menuId: "", // 记录点击的菜单ID
    menuName: "" // 记录点击的菜单名称
});

layui.use(['index'], function () {
    avalon.ready(function () {
        // 加载菜单树
        onMenuTreeLoad();
        avalon.scan();
    });
});

/**
 * 菜单树事件：加载菜单树
 * @param id
 */
function onMenuTreeLoad(selectMenuId) {
    // 树控件的基本设定
    var setting = {
        id: 'id',
        pId: 'parentId',
        name: 'menuName',
        done: function (treeObj) {
            // 若有，则设置默认的选中菜单节点
            if (isNotEmpty(selectMenuId)) {
                var node = treeObj.getNodeByParam("id", selectMenuId, null);
                if (node != null) {
                    treeObj.selectNode(node);
                }
            }
        },
        view: {
            addHoverDom: onMenuTreeAddHoverDom, // 用于当鼠标移动到节点上时，显示用户自定义控件
            removeHoverDom: onMenuTreeRemoveHoverDom,  // 用于当鼠标移出节点时，隐藏用户自定义控件
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
            onDrop: onMenuTreeNodeDrop, // 拖拽操作结束事件
            beforeRemove: beforeMenuTreeNodeRemove,   // 删除事件
            beforeClick: beforeMenuTreeNodeClick // 单击节点事件
        }
    };

    // 设置左侧树的基本属性
    var initMenuTreeOption = {
        title: "菜单管理", // div树的标题
        initZtree: function (obj) { // 初始化树方法
            _ajax({
                type: "POST",
                url: $.config.services.system + "/sysMenu/list.do",
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
    _initLeftZtree($("#sysMenuList_menuTree"), initMenuTreeOption);
}

/**
 * 菜单树事件：当鼠标移动到节点上时，显示增加按钮
 * @param treeId
 * @param treeNode
 */
function onMenuTreeAddHoverDom(treeId, treeNode) {
    var addBtnId = "addBtn_" + treeNode.tId;
    if (treeNode.editNameFlag || $("#" + addBtnId).length > 0) { return; }

    // 树节点标签后，添加增加按钮
    $("#" + treeNode.tId + "_span")
        .after("<span class='button add' id='" + addBtnId + "' title='增加' onfocus='this.blur();'></span>")

    // 增加按钮绑定点击事件：点击可添加子菜单
    var addBtnObj = $("#" + addBtnId);
    if (addBtnObj) {
        addBtnObj.bind("click", function () {
            onMenuAddSub(treeNode.id, treeNode.menuName);
            return false;
        });
    }
}

/**
 * 菜单树事件：当鼠标移出节点时，移除增加按钮
 * @param treeId
 * @param treeNode
 */
function onMenuTreeRemoveHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
}

/**
 * 菜单树事件：当节点拖拽结束，对拖拽的同级节点进行排序
 * @param event
 * @param treeId
 * @param treeNodes
 * @param targetNode
 * @param moveType
 * @param isCopy
 */
function onMenuTreeNodeDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
    // 获取拖动节点的同级节点列表及其父节点
    var moveNode = treeNodes[0];
    var parentNode = moveNode.getParentNode();
    var parentMenuId = "";
    var peerNodes = [];
    if (parentNode != null) {
        parentMenuId = parentNode.id;
        peerNodes = parentNode.children;
    } else {
        // 返回根节点集合
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        peerNodes = treeObj.getNodesByFilter(function (node) {
            return node.level == 0
        });
    }

    // 菜单节点排序
    if (peerNodes != undefined && peerNodes.length > 0) {
        var menuIds = [];
        $.each(peerNodes, function (i, item) {
            menuIds.push(item.id);
        });
        onMenuSort(menuIds, parentMenuId);
    }
}

/**
 * 菜单树事件：当节点删除时，调用API删除菜单节点
 * @param treeId
 * @param treeNode
 * @returns {boolean}
 */
function beforeMenuTreeNodeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    onMenuDelete(treeNode.id, function () {
        // 成功删除后移除树节点
        zTree.removeNode(treeNode);
    });
    return false;
}

/**
 * 菜单树事件：当点击节点时，调用API加载菜单节点信息
 * @param treeId
 * @param treeNode
 * @param clickFlag
 * @returns {boolean}
 */
function beforeMenuTreeNodeClick(treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if (zTree.isSelectedNode(treeNode)) {
        zTree.cancelSelectedNode(treeNode);
    } else {
        // 更新当前选中菜单信息
        sysMenuList.menuId = treeNode.id;
        sysMenuList.menuName = treeNode.menuName;
        // 选中菜单
        zTree.selectNode(treeNode);
        // 加载菜单信息
        onMenuLoad(treeNode.id);
        onMenuKeyListLoad(treeNode.id);
    }
    return false;
}

/**
 * 菜单事件：根据菜单ID，加载菜单信息
 * @param menuId
 */
function onMenuLoad(menuId) {
    var param = {
        "menuId": menuId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysMenu/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var form = layui.form;
            form.val('sysMenuEdit_form', data);
        }
    });
}

/**
 * 菜单事件：打开弹窗，可添加一级菜单
 */
function onMenuAdd() {
    var title = "添加一级菜单";
    var url = $.config.server + "/system/sysMenuEdit";
    openSysMenuEditWin(title, url, false);
}

/**
 * 菜单事件：打开弹窗，可添加子菜单
 * @param parentId
 * @param parentName
 */
function onMenuAddSub(parentId, parentName) {
    var title = "添加子菜单";
    var url = $.config.server + "/system/sysMenuEdit?parentId=" + parentId + "&parentName=" + parentName;
    openSysMenuEditWin(title, url, false);
}

/**
 * 菜单事件：打开弹窗，可添加菜单及其按钮
 * @returns {boolean}
 */
function onMenuAddWithKeys() {
    if (isEmpty(sysMenuList.menuId)) {
        warningToast("请至少选择一个父菜单");
        return false;
    }

    var title = "自动生成菜单(按钮权限也自动生成)";
    var url = $.config.server + "/system/sysMenuAuto?parentId=" + sysMenuList.menuId + "&parentName=" + sysMenuList.menuName;
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 820, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 600,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onMenuWithKeysSave(
                // 成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功", 500);
                    var selectMenuId = isEmpty(sysMenuList.menuId) ? "" : sysMenuList.menuId;
                    onMenuTreeLoad(selectMenuId);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 菜单事件：删除菜单
 * @param menuId
 * @param $callback
 */
function onMenuDelete(menuId, $callback) {
    layer.confirm('确定要删除吗？', function (index) {
        var param = {
            "menuId": menuId
        };
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysMenu/delete.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data);
                successToast("菜单删除成功", 500);
            }
        });
    });
}

/**
 * 菜单事件：对某一上级菜单下的菜单进行排序
 * @param menuIds
 * @param parentMenuId
 * @returns {boolean}
 */
function onMenuSort(menuIds, parentMenuId) {
    if (isEmpty(menuIds) || menuIds.length == 0) {
        return false;
    }

    var param = {
        menuIds: menuIds,
        parentMenuId: parentMenuId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysMenu/sort.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("排序成功");
        }
    });
}

/**
 * 菜单事件：保存菜单信息
 * @param $callBack
 */
function onMenuSave($callBack) {
    // 对表单验证
    verifyMenuEditForm(function (field) {
        // 成功验证后
        var param = field; //表单的元素
        // 可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysMenu/edit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("修改成功");
                var node = menuTreeObj.getNodeByParam("id", field.id, null);
                if (node != undefined && node != null) {
                    // 同时改树上面的菜单名称
                    node.menuName = field.menuName;
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
 * 菜单按钮：根据菜单ID，加载菜单按钮列表
 * @param menuId
 */
function onMenuKeyListLoad(menuId) {
    var table = layui.table;
    var param = {
        "menuId": menuId
    };
    _layuiTable({
        elem: '#sysMenuList_table', // 必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysMenuList_table', // 必填，指定的lay-filter的名字
        // 执行渲染table配置
        render: {
            height: 'full-240', // table的高度，页面最大高度减去差值
            url: $.config.services.system + "/sysMenu/listKey.do", // ajax的url必须加上getRootPath()方法
            where: param, // 接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'menuName', title: '菜单名称', templet: function (row) { return sysMenuList.menuName; } },
                { field: 'keyName', title: '按钮名称' },
                { field: 'keyCode', title: '按钮代码' },
                { field: 'apiUrl', title: 'API链接' },
                { fixed: 'right', title: '操作', width: 180, align: 'center', toolbar: '#sysMenuList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (layEvent === 'detail') { // 查看
                if (isNotEmpty(data.id)) {
                    onMenuKeyDetail(data.id);
                }
            } else if (layEvent === 'edit') { // 编辑
                if (isNotEmpty(data.id)) {
                    onMenuKeyEdit(data.id);
                }
            } else if (layEvent === 'delete') { // 删除
                layer.confirm('确定删除所选数据吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.id)) {
                        var keyIds = [];
                        keyIds.push(data.id);
                        onMenuKeyDelete(keyIds);
                    }
                });
            }
        }
    });
}

/**
 * 菜单按钮：打开弹窗，可添加菜单按钮
 * @returns {boolean}
 */
function onMenuKeyAdd() {
    if (isEmpty(sysMenuList.menuId)) {
        errorToast("请选择左侧菜单");
        return false;
    }

    var title = "新增";
    var url = $.config.server + "/system/sysKeyEdit?menuId=" + sysMenuList.menuId + "&menuName=" + sysMenuList.menuName;
    openSysKeyEditWin(title, url, false);
}

/**
 * 菜单按钮：打开弹窗，可查看菜单按钮详情
 * @param keyId
 */
function onMenuKeyDetail(keyId) {
    var title = "详情";
    var url = $.config.server + "/system/sysKeyEdit?id=" + keyId + "&menuName=" + sysMenuList.menuName + "&readonly=Y";
    openSysKeyEditWin(title, url, true);
}

/**
 * 菜单按钮：打开弹窗，可编辑菜单按钮
 * @param keyId
 */
function onMenuKeyEdit(keyId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysKeyEdit?id=" + keyId + "&menuName=" + sysMenuList.menuName;
    openSysKeyEditWin(title, url, false);
}

/**
 * 菜单按钮：批量删除
 */
function onMenuKeyBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysMenuList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var keyIds = [];
            $.each(data, function (i, item) {
                keyIds.push(item.id);
            });
            onMenuKeyDelete(keyIds);
        });
    }
}

/**
 * 菜单按钮：删除
 * @param keyIds
 */
function onMenuKeyDelete(keyIds) {
    var param = {
        "keyIds": keyIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysMenu/deleteKey.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("按钮删除成功", 500);
            onMenuKeyListLoad(sysMenuList.menuId);
        }
    });
}

/**
 * 打开系统菜单编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openSysMenuEditWin(title, url, readonly) {
    //sysLayerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 440, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 520,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onMenuSave(
                // 成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功", 500);
                    var selectMenuId = isEmpty(sysMenuList.menuId) ? "" : sysMenuList.menuId;
                    onMenuTreeLoad(selectMenuId);
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打开系统菜单按钮编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openSysKeyEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 400, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 400,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onMenuKeySave(
                // 成功保存之后的操作，刷新页面
                function success(data) {
                    successToast("保存成功", 500);
                    onMenuKeyListLoad(sysMenuList.menuId);
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
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
    form.on('submit(sysMenuEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysMenuEdit_submit").trigger('click');
}
