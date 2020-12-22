/**
 * 用户管理 - 重设密码
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/06
 */
var sysUserReset = avalon.define({
    $id: "sysUserReset",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var loginId = GetQueryString("loginId");

        // 表单赋值
        var form = layui.form;
        form.val('sysUserReset_form', {
            id: id,
            loginId: loginId
        });

        avalon.scan();
    });
});

/**
 * 用户事件：重设密码
 * @param $callBack
 */
function onResetPwd($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        var param = {
            userId: field.id,
            userPwd: $.base64.encode(field.password),
        };
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysUser/resetPwd.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callBack === 'function' && $callBack(data); //返回一个回调事件
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
    form.on('submit(sysUserReset_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysUserReset_submit").trigger('click');
}
