/**
 * patPageFrontDryWeightEdit.jsp的js文件，包括查询，编辑操作
 */
var patPageFrontDryWeightEdit = avalon.define({
    $id: "patPageFrontDryWeightEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    adjustType: '',
    patientId: ''

});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;
        laydate.render({
            elem: '#adjustDate'
            , type: 'date'
            , trigger: 'click'
            ,value:new Date()
        });
        var id = GetQueryString("id");  //接收变量
        var adjustType = GetQueryString("adjustType");
        var patientId = GetQueryString("patientId");
        patPageFrontDryWeightEdit.adjustType = adjustType;
        patPageFrontDryWeightEdit.patientId = patientId;
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
            "pageFrontId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patPageFront/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.adjustDate = util.toDateString(data.adjustDate, "yyyy-MM-dd");
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                form.val('patPageFrontEdit_form', data);
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
    form.verify({

        weight: function (value, item) {
            var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
            if (isNotEmpty(value) && (!reg.test(value) || (value <= 0 || value > 200))) {
                return "体重取值范围(0,200],可输入两位小数";
            }
        }
    })
    form.on('submit(patPageFrontDryWeightEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patPageFrontDryWeightEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //获取到的patientId不为空 为新增操作 需要携带调整类型和病人id
        if (!isEmpty(patPageFrontDryWeightEdit.patientId)) {
            var key = 'patientId';
            var value = patPageFrontDryWeightEdit.patientId
            param[key] = value;
            var adjustTypeKey = 'adjustType';
            var adjustValue = patPageFrontDryWeightEdit.adjustType
            param[adjustTypeKey] = adjustValue
        }
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patPageFront/saveOrEdit.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



