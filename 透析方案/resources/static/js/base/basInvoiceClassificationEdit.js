/**
 * basInvoiceClassificationEdit.ftl的js文件，包括查询，编辑操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/06
 */
var basInvoiceClassificationEdit = avalon.define({
    $id: "basInvoiceClassificationEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,readonly: {readonly: false} // 文本框设置只读
    ,classificationName: {readonly: false} // 归类名称
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            basInvoiceClassificationEdit.readonly = {readonly: true};
            basInvoiceClassificationEdit.classificationName = {readonly: true};
            $('input[type="radio"]').prop('disabled', true);
        } else if (layEvent === 'edit') {
            basInvoiceClassificationEdit.classificationName = {readonly: true};
        }
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "invoiceClassificationId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basInvoiceClassification/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                form.val('basInvoiceClassificationEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(basInvoiceClassificationEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        if (isNotEmpty(field.orderNo) && !(/(^[0-9]\d*$)/.test(field.orderNo))) {
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite> ' + ('排序号只能录入大于等于零的数字')
            ].join('');
            errorToast(error);
            return false;
        }
        if (parseInt(field.orderNo) > 2147483647) {
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite> ' + ('排序号超出栏位定义的最大值')
            ].join('');
            errorToast(error);
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#basInvoiceClassificationEdit_submit").trigger('click');
}

/**
 * 添加
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basInvoiceClassification/save.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 编辑
 * @param $callback
 */
function edit($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.platform + "/basInvoiceClassification/edit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

