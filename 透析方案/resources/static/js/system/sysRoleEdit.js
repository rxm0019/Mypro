/**
 * 角色管理 - 角色编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/06
 */
var menuTreeObj; // 菜单树对象
var sysRoleEdit = avalon.define({
    $id: "sysRoleEdit",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    id: "",
    selectedMenuList: []
});

// 加载layui的模块，index模块是基础模块，也可添加其它
layui.use(['index'], function () {
    avalon.ready(function () {
        var util = layui.util;
        var form = layui.form;

        // 获取URL参数
        sysRoleEdit.id = GetQueryString("id");

        // 注册角色权限树搜索事件
        util.fixbar({});
        form.on('submit(sysOpenTree_search)', function (data) {
            menuTreeObj.searchTree(data.field.searchnName);
        });

        // 获取实体信息
        onRoleLoad(sysRoleEdit.id, function (data) {
            // 若为修改时，查询权限关联表里已有的权限
            sysRoleEdit.selectedMenuList = data.menuIds;
            onMenuTreeLoad(); // 初始化菜单树
        });

        avalon.scan();
    });
});

/**
 * 角色事件：根据角色ID，加载角色信息
 * @param roleId
 * @param $callback 成功验证后的回调函数
 */
function onRoleLoad(roleId, $callback) {
    if (isEmpty(roleId)) {
        // 新增
        typeof $callback === 'function' && $callback({});
        return;
    }

    // 编辑
    var param = {
        "roleId": roleId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            // 表单初始赋值
            layui.form.val('sysRoleEdit_form', data);
            typeof $callback === 'function' && $callback(data);
        }
    });
}

/**
 * 角色事件：保存操作
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function onRoleSave($callback) {
    // 对表单验证，若验证成功则保存
    verifyRoleEditForm(function (field) {
        // 获取全部勾选的角色权限
        var nodes = menuTreeObj.getCheckedList();
        var menuIds = [];
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
                menuIds.push(nodes[i].id);
            }
        }

        // 获取请求参数：角色基本信息和分配的角色权限
        var param = {
            "id": sysRoleEdit.id,
            "roleCode": field.roleCode, // 角色代码
            "roleName": field.roleName, // 角色名称
            "remark": field.remark, // 角色描述
            "dataStatus": field.dataStatus, // 角色状态
            "menuIds": menuIds // 分配角色权限
        };
        // 获取请求URL
        var url = $.config.services.system + "/sysRole/edit.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysRole/add.do";
        }
        // 异步请求
        _ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(param),
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data);
            }
        });
    });
}

/**
 * 菜单树事件：加载菜单树
 */
function onMenuTreeLoad() {
    var param = {};
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/selectMenuTree.do",
        data: param,
        done: function (data) {
            // ztree树参数设置
            var setting = {
                id: 'id',
                pId: 'parentId',
                name: 'menuName',
                checkbox: true,
                done: function (treeObj) {
                    // 回显勾选的菜单列表
                    if (sysRoleEdit.selectedMenuList != null && sysRoleEdit.selectedMenuList.length > 0) {
                        $.each(data, function (dataIndex, dataItem) {
                            var isSelected = $.inArray(dataItem.id, sysRoleEdit.selectedMenuList) >= 0;
                            if (isSelected) {
                                var node = treeObj.getNodeByParam("id", dataItem.id, null);
                                if (node != null) {
                                    treeObj.checkNode(node, true, false); // 加载勾选
                                    treeObj.selectNode(node); // 选中展开
                                }
                            }
                        });
                    }

                    // 折叠所有
                    treeObj.expandAll(false);
                }
            };

            // 加载ztree树
            menuTreeObj = _initZtree($("#sysOpenTree"), setting, data);
        }
    });
}

/**
 * 验证表单
 * @param $callback
 */
function verifyRoleEditForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(sysRoleEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysRoleEdit_submit").trigger('click');
}

