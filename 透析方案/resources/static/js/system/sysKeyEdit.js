/**
 * 菜单管理 - 菜单按钮编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysKeyEdit = avalon.define({
    $id: "sysKeyEdit",
    keySort: "1",
    readonly: false
});
layui.use(['index', 'common'], function () {
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var menuId = GetQueryString("menuId");
        var menuName = GetQueryString("menuName");
        var readonly = GetQueryString("readonly");

        // 更新页面参数
        sysKeyEdit.readonly = (readonly == "Y");

        // 表单赋值
        var form = layui.form;
        form.val('sysKeyEdit_form', {
            id: id,
            menuId: menuId,
            menuName: menuName
        });

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            onMenuKeyLoad(id);
        }
        avalon.scan();
    });
});

/**
 * 菜单按钮事件：根据菜单按钮ID，加载菜单按钮信息
 * @param keyId
 */
function onMenuKeyLoad(keyId) {
    var param = {
        "keyId": keyId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysMenu/getKeyInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var form = layui.form;
            form.val('sysKeyEdit_form', data);
        }
    });
}

/**
 * 菜单按钮事件：保存菜单按钮信息
 * @param $callBack
 */
function onMenuKeySave($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        // 成功验证后
        var param = field; //表单的元素

        var url = $.config.services.system + "/sysMenu/editKey.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysMenu/addKey.do";
        }
        _ajax({
            type: "POST",
            url: url,
            data: param,
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
    form.on('submit(sysKeyEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysKeyEdit_submit").trigger('click');
}


