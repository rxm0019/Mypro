/**
 * orderCheckDate.jsp的js文件，核对医嘱操作
 * @author anders
 * @date 2020-09-10
 * @version 1.0
 */
var orderCheckDate = avalon.define({
    $id: "orderCheckDate",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId: '',           //透析记录id
    ids: []                     //要修改的执行医嘱id
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#checkOrderDate'
            ,type: 'time'
            ,format: 'HH:mm'
            ,value: new Date()
        });

        orderCheckDate.diaRecordId = GetQueryString("diaRecordId") || '';
        var idArr = GetQueryString("ids");   //接收的参数
        if (isNotEmpty(idArr)) {
            var ids = idArr.split(',');
            orderCheckDate.ids = ids;
        }

        avalon.scan();
    });
});


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(orderCheckDate_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#orderCheckDate_submit").trigger('click');
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
        param.ids = orderCheckDate.ids;
        param.orderStatus = '3';
        param.diaRecordId = orderCheckDate.diaRecordId;
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaExecuteOrder/check.do",
            data:param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



