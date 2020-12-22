/**
 * 字典数据管理 - 编辑
 * @author: Allen
 * @version: 1.0
 * @date: 2020/08/13
 */
var sysDictDataEdit = avalon.define({
    $id: "sysDictDataEdit",
    dictOptions: [],
    readonly: false
});

layui.use(['index'], function() {
    avalon.ready(function () {
        // 获取URL参数
        var id = GetQueryString("id");
        var addDictId = GetQueryString("addDictId");
        var readonly = GetQueryString("readonly");

        // 更新页面参数
        sysDictDataEdit.readonly = (readonly == "Y");

        // 获取实体信息
        getDictDataInfo(id, addDictId, function (data) {
            // 获取字典类别
            getDictOptions();

            //表单初始赋值
            layui.form.val('sysDictDataEdit_form', data);
        });
        avalon.scan();
    });
});

/**
 * 获取字典类别
 * @returns {{name: string, value: string}[]}
 */
function getDictOptions() {
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system +"/sysDict/listDict.do",
        dataType: "json",
        async: false,
        done: function(data) {
            sysDictDataEdit.dictOptions = data;
        }
    });
}

/**
 * 字典类别事件：根据字典类别ID，加载字典类别信息
 * @param dictId
 */
function getDictDataInfo(dictDataId, addDictId, $callback) {
    if (isEmpty(dictDataId)) {
        //新增
        typeof $callback === 'function' && $callback({dictId: addDictId}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "dictDataId": dictDataId
        };
        _ajax({
            type: "POST",
            url: $.config.services.system + "/sysDictData/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 字典数据事件：保字典数据信息
 * @param $callBack
 */
function onDictDataSave($callBack) {
    // 对表单验证
    verifyForm(function (field) {
        // 获取表单元素
        var param = field;
        var url = $.config.services.system + "/sysDictData/edit.do";
        if (isEmpty(param.id)) {
            url = $.config.services.system + "/sysDictData/add.do";
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
    form.on('submit(sysDictDataEdit_submit)', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("#sysDictDataEdit_submit").trigger('click');
}

