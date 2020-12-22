/**
 * 字典类别管理 - 编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysDictEdit = avalon.define({
    $id: "sysDictEdit",
    readonly: false
});

layui.use(['index'],function(){
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var readonly = GetQueryString("readonly");

        // 更新页面参数
        sysDictEdit.readonly = (readonly == "Y");

        // 编辑时，需自动带出实体信息
        if (isNotEmpty(id)) {
            getDictInfo(id);
        }
        avalon.scan();
    });
});

/**
 * 字典类别事件：根据字典类别ID，加载字典类别信息
 * @param dictId
 */
function getDictInfo(dictId) {
    var param = {
        "dictId": dictId
    };
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysDict/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            layui.form.val('sysDictEdit_form', data);
        }
    });
}

/**
 * 字典类别事件：保字典类别信息
 * @param $callBack
 */
function onDictSave($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        // 获取表单元素
        var param = field;

        var url = $.config.services.system + "/sysDict/edit.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysDict/add.do";
        }
        _ajax({
            type: "POST",
            url: url,
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
    form.on('submit(sysDictEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysDictEdit_submit").trigger('click');
}

