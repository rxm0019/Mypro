/**
 * 菜单管理 - 菜单编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysMenuEdit = avalon.define({
    $id: "sysMenuEdit"
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var parentId = GetQueryString("parentId");
        var parentName = GetQueryString("parentName");

        // 表单赋值
        var form = layui.form;
        form.val('sysMenuEdit_form', {
            id: id,
            parentId: parentId,
            parentName: parentName
        });

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            onMenuLoad(id);
        }
        avalon.scan();
    });
});

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
 * 菜单事件：保存菜单信息
 * @param $callBack
 */
function onMenuSave($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        // 成功验证后
        var param = field; //表单的元素

        var url = $.config.services.system + "/sysMenu/edit.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysMenu/add.do";
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
    form.on('submit(sysMenuEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysMenuEdit_submit").trigger('click');
}

