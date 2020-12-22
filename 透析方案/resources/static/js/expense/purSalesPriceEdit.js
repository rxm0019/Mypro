/**
 * 销售价格管理明细
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/28
 */
var purSalesPriceEdit = avalon.define({
    $id: "purSalesPriceEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    , readonly: {readonly: true} // 文本框设置只读

});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var materielNo = GetQueryString("materielNo");  //接收变量
        var type = GetQueryString("type");  //接收变量
        var supplierInfoId = GetQueryString("supplierInfoId");

        //动态显示详情的列
        if (type === "1" || type === "2" || type === "4") {
            document.getElementById("basicUnit").style.display = "none";
        }
        if (type === "3" || type === "4") {
            document.getElementById("manufactor").style.display = "none";
            document.getElementById("salesUnit").style.display = "none";
            document.getElementById("supplierName").style.display = "none";
            document.getElementById("price").style.display = "none";
        }
        if (type === "4") {
            document.getElementById("specifications").style.display = "none";
        }
        //获取实体信息
        getInfo(materielNo, type, supplierInfoId, function (data) {
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
function getInfo(materielNo, type, supplierInfoId, $callback) {
    //编辑
    var param = {
        "materielNo": materielNo,
        "type": type,
        "supplierInfoId": supplierInfoId
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/purSalesPrice/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            //表单初始赋值
            var form = layui.form; //调用layui的form模块
            data.salesPrice = data.salesPrice.toFixed(2)
            if (type == "1" || type == "2") { //药品/耗材的销售单位
                data.salesUnit = getSysDictName($.dictType.purSalesBaseUnit, data.salesUnit)
            }
            if (type == "3") { //诊疗的基本单位
                data.basicUnit = getSysDictName("baseUnit", data.basicUnit)
            }
            form.val('purSalesPriceEdit_form', data);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(purSalesPriceEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        var salesPrice = parseFloat(field.salesPrice);
        field.salesPrice = salesPrice.toFixed(2)
        debugger
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#purSalesPriceEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //菜单保存操作
    //对表单验证
    verify_form(function(field){
        //成功验证后
        var param=field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purSalesPrice/edit.do",
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



