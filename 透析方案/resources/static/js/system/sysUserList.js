/**
 * 用户管理
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysUserList = avalon.define({
    $id: "sysUserList",
    baseFuncInfo: baseFuncInfo //底层基本方法
});

layui.use(['index'], function() {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();
        // 查询列表
        getUserList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysUserList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'sysUserList_search',  //指定的lay-filter
        conds: [
            { field: 'loginId', title: '登陆账号：', type: 'input' },
            { field: 'userName', title: '用户姓名：', type: 'input' },
            { field: 'sex', title: '用户性别：', type: 'select', data: getSysDictByCode($.dictType.sex, true) },
            { field: 'userType', title: '用户类型：', type: 'select', data: getSysDictByCode($.dictType.userType, true) },
            { field: 'roleId', title: '用户角色：', type: 'select', data: getRoleOptions() },
            { field: 'dataStatus', title: '状态：', type: 'select', data: getSysDictByCode($.dictType.sysStatus, true) },
        ],
        search: function (data) {
            var field = data.field;
            layui.table.reload('sysUserList_table', {
                where: field
            });
        }
    });
}

/**
 * 获取角色列表
 * @returns {Array}
 */
function getRoleOptions() {
    var dicts = [];
    dicts.push({value: "", name: "全部"});
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/getLists.do",
        dataType: "json",
        async: false,
        done: function(data){
            if (data != null && data != "") {
                for (var i = 0;i < data.length; i++) {
                    dicts.push({value: data[i].id, name: data[i].roleName});
                }
            }
        }
    });
    return dicts;
}

/**
 * 查询列表事件
 */
function getUserList() {
    var param = { };// "isArchiveQuery": "true"
    _layuiTable({
        elem: '#sysUserList_table',
        filter: 'sysUserList_table',
        // 执行渲染table配置
        render: {
            height: 'full-180',
            url: $.config.services.system + "/sysUser/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'loginId', title: '登陆账号', align: 'center', minWidth: 100 },
                { field: 'userName', title: '用户姓名', align: 'center', minWidth: 100 },
                {
                    field: 'sex', title: '性别', align: 'center',
                    templet: function(row){
                        return getSysDictName($.dictType.sex, row.sex);
                    }
                },
                {
                    field: 'title', title: '职称', align: 'center', minWidth: 100,
                    templet: function(row){
                        return getSysDictName($.dictType.title, row.title);
                    }
                },
                { field: 'mobile', title: '手机号码', align: 'center', minWidth: 120 },
                {
                    field: 'userType', title: '用户类型', align: 'center', minWidth: 100,
                    templet: function(row){
                        return getSysDictName($.dictType.userType, row.userType);
                    }
                },
                {
                    field: 'roleName', title: '用户角色', align: 'left', width: 200,
                    templet: function (row) {
                        var roleDesc = (row.roleName || "").split(",").join("，");
                        return roleDesc;
                    }
                },
                {
                    field: 'dataStatus', title: '状态', align: 'center', width: 80,
                    templet: function (row) {
                        return getSysDictName($.dictType.sysStatus, row.dataStatus);
                    }
                },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#sysUserList_bar' }
            ]]
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; // 获得当前行数据
            var layEvent = obj.event; // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; // 获得当前行 tr 的DOM对象
            if (isNotEmpty(data.id)) {
                if (layEvent === 'detail') { //详情
                    onUserDetail(data.id);
                } else if (layEvent === 'resetPwd') { //重设密码
                    openResetPwdWin(data.id, data.loginId);
                } else if (layEvent === 'edit') { //编辑
                    onUserEdit(data.id);
                } else if (layEvent === 'authority') { //权限
                    openUserAuthorityWin(data.id, data.hospitalRole);
                } else if (layEvent === 'delete') { //删除
                    layer.confirm('确定删除所选数据吗？', function (index) {
                        layer.close(index);
                        var userIds = [data.id];
                        onUserDelete(userIds);
                    });
                }
            }
        }
    });
}

/**
 * 菜单按钮：打开弹窗，可查看菜单按钮详情
 * @param keyId
 */
function onUserDetail(userId) {
    var title = "详情";
    var url = $.config.server + "/system/sysUserEdit?id=" + userId + "&readonly=Y";
    openUserEditWin(title, url, true);
}

/**
 * 用户：打开弹窗，可添加用户
 * @returns {boolean}
 */
function onUserAdd() {
    var title = "新增";
    var url = $.config.server + "/system/sysUserEdit";
    openUserEditWin(title, url, false);
}

/**
 * 用户：打开弹窗，可编辑用户
 * @param roleId
 */
function onUserEdit(userId) {
    var title = "编辑";
    var url = $.config.server + "/system/sysUserEdit?id=" + userId;
    openUserEditWin(title, url, false);
}

/**
 * 用户：批量删除
 */
function onUserBatchDelete() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysUserList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条数据");
        return false;
    } else {
        layer.confirm('确定删除所选数据吗？', function (index) {
            layer.close(index);
            var userIds = [];
            $.each(data, function (i, item) {
                userIds.push(item.id);
            });
            onUserDelete(userIds);
        });
    }
}

/**
 * 用户：删除
 * @param roleIds
 */
function onUserDelete(userIds) {
    var param = {
        "userIds": userIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('sysUserList_table'); //重新刷新table
        }
    });
}

/**
 * 打开重设密码弹窗
 * @param userId
 * @param loginId
 */
function openResetPwdWin(userId, loginId) {
    var url = $.config.server + "/system/sysUserReset?id=" + userId + "&loginId=" + loginId;
    var title = "重设密码";
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 460, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 320,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function(index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onResetPwd(
                function success() {
                    successToast("修改成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打开用户编辑弹窗
 * @param title
 * @param url
 * @param readonly
 */
function openUserEditWin(title, url, readonly) {
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 700, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 450,  // 弹框自定义的高度，方法会自动判断是否超过高度
        readonly: readonly,  // 弹框自定义参数，用于是否只能查看,默认是false，true代表只能查看,done事件不执行
        title: title, // 弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onUserSave(
                // 成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layui.table.reload('sysUserList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打开用户权限设定弹窗
 * @param userId
 */
function openUserAuthorityWin(userId, hospitalRole) {
    var url = $.config.server + "/system/sysUserAuthority?id=" + userId + "&hospitalRole=" + hospitalRole;
    var title = "权限设置";
    _layerOpen({
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 400, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 370,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: title, // 弹框标题
        done: function(index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onAuthoritySave(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("修改成功");
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭

                    // 重新刷新table
                    layui.table.reload('sysUserList_table');
                }
            );
        }
    });
}
