/**
 * 用户管理 - 用户编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/06
 */
var sysUserEdit = avalon.define({
    $id: "sysUserEdit",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
    readonly: false,
    sexOptions: [], // 性别选项
    titleOptions: [], // 职称选项
    userTypeOptions: [], // 职称选项
    dataStatusOptions: [], // 状态选项
    roleOptions: [], // 角色选项
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var readonly = GetQueryString("readonly");

        // 更新页面参数
        sysUserEdit.readonly = (readonly == "Y");
        sysUserEdit.sexOptions = baseFuncInfo.getSysDictByCode($.dictType.sex);
        sysUserEdit.titleOptions = baseFuncInfo.getSysDictByCode($.dictType.title);
        sysUserEdit.userTypeOptions = baseFuncInfo.getSysDictByCode($.dictType.userType);
        sysUserEdit.dataStatusOptions = baseFuncInfo.getSysDictByCode($.dictType.sysStatus);
        sysUserEdit.roleOptions = getRoleOptions();

        // 表单赋值
        var form = layui.form;
        form.val('sysUserEdit_form', {
            id: id
        });

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            getUserInfo(id);
        }
        avalon.scan();
    });
});

/**
 * 获取角色列表
 * @returns {Array}
 */
function getRoleOptions() {
    var dicts = [];
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysRole/getLists.do",
        dataType: "json",
        async: false,
        done: function(data) {
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
 * 用户事件：根据用户ID，加载用户信息
 * @param userId
 */
function getUserInfo(userId) {
    var param = {
        "userId": userId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var form = layui.form;
            // 更新常规表单
            form.val('sysUserEdit_form', data);
            // 更新角色选中表单
            if (data.sysUserRoleList) {
                $.each(data.sysUserRoleList, function (index, item) {
                    var roleObj = $('input[type="checkbox"][name="roleId"][value="' + item.roleId + '"]');
                    if (roleObj && roleObj.length) {
                        roleObj[0].checked = true;
                    }
                });
            }
            form.render();
        }
    });
}

/**
 * 用户事件：保存用户信息
 * @param $callBack
 */
function onUserSave($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        // 获取选中角色
        var roleIds = [];
        $("input[name='roleId']").each(function() {
            if ($(this).is(":checked")) {
                roleIds.push($(this).val());
            }
        });

        // 获取表单元素
        var param = field;
        param.roleIds = roleIds;

        var url = $.config.services.system + "/sysUser/edit.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysUser/add.do";
        }
        _ajax({
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数
            data: JSON.stringify(param),
            dataType: "json",
            done: function (data) {
                if ($callBack != undefined) {
                    $callBack(data);
                }
            }
        });
    });
}

/**
 * 验证表单
 * @param $callback
 */
function verifyForm($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(sysUserEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysUserEdit_submit").trigger('click');
}
