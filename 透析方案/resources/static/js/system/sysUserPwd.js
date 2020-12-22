/**
 * 用户管理 - 修改密码
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/06
 */
var sysUserPwd = avalon.define({
    $id: "sysUserPwd",
    baseFuncInfo: baseFuncInfo, // 底层基本方法
});

layui.use(['index'],function() {
    avalon.ready(function () {
        // 表单设置
        var form = layui.form;
        form.on('submit(sysUserPwd_submit)', function(data) {
            // 通过表单验证后
            onSavePwd(data.field);
        });
        avalon.scan();
    });
});

/**
 * 用户事件：保存密码
 * @param $callBack
 */
function onSavePwd(field) {
    // 对表单验证
    var param = {
        userPwd: $.base64.encode(field.userPwd),
        newPwd: $.base64.encode(field.password),
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/savePwd.do",
        data: param,
        dataType: "json",
        done: function (data) {
            successToast("修改成功");
        }
    });
}

