/**
 * 角色管理
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysRoleList = avalon.define({
    $id: "sysRoleList",
    baseFuncInfo: baseFuncInfo //底层基本方法
});

layui.use(['index'], function () {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();

        // 查询列表
        getRoleList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysRoleList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'sysRoleList_search',  //指定的lay-filter
        conds: [
            { field: 'roleName', title: '角色名称：', type: 'input' },
            { field: 'roleCode', title: '角色代码：', type: 'input' },
            { field: 'dataStatus', title: '状态：', type: 'select', data: getSysDictByCode($.dictType.sysStatus, true) },
        ],
        search: function (data) {
            var field = data.field;
            layui.table.reload('sysRoleList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getRoleList() {
    var param = {};
    _layuiTable({
        elem: '#sysRoleList_table',
        filter: 'sysRoleList_table',
        // 执行渲染table配置
        render: {
            height: 'full-180',
            url: $.config.services.system + "/sysRole/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'roleName', title: '角色名称', align: 'center' },
                { field: 'roleCode', title: '角色代码', align: 'center' },
                { field: 'remark', title: '描述', align: 'left' },
                {
                    field: 'dataStatus', title: '状态', align: 'center', width: 80,
                    templet: function (row) {
                        return getSysDictName($.dictType.sysStatus, row.dataStatus);
                    }
                },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#sysRoleList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                if (isNotEmpty(data.id)) {
                    onRoleEdit(data.id);
                }
            } else if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选数据吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.id)) {
                        var roleIds = [data.id];
                        onRoleDelete(roleIds);
                    }
                });
            }
        }
    });
}

/**
 * 批量删除
 */
function onRoleBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysRoleList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var roleIds = [];
            $.each(data, function (i, item) {
                roleIds.push(item.id);
            });
            onRoleDelete(roleIds);
        });
    }
}

/**
 * 角色：删除
 * @param roleIds
 */
function onRoleDelete(roleIds) {
    var param = {
        "roleIds": roleIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('sysRoleList_table'); //重新刷新table
        }
    });
}

/**
 * 角色：打开弹窗，可添加角色
 * @returns {boolean}
 */
function onRoleAdd() {
    var title = "新增";
    var url = $.config.server + "/system/sysRoleEdit";
    openSysRoleEditWin(title, url, false);
}

/**
 * 角色：打开弹窗，可编辑角色
 * @param roleId
 */
function onRoleEdit(roleId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysRoleEdit?id=" + roleId;
    openSysRoleEditWin(title, url, false);
}

/**
 * 打开系统菜单编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openSysRoleEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 700, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onRoleSave(
                // 成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layui.table.reload('sysRoleList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

