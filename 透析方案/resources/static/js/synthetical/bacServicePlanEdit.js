/**
 * 设备维护计划-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/10
 */
var bacServicePlanEdit = avalon.define({
    $id: "bacServicePlanEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceList:[],//设备列表
    deviceType:'',//设备类型
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false} // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量id
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent

        if (layEvent === 'detail') {
            bacServicePlanEdit.readonly = {readonly: true};
            bacServicePlanEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
        }
        if(layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#firstService'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        bacServicePlanEdit.deviceType=GetQueryString("deviceType");  //接收变量设备类型

        getDeviceList(bacServicePlanEdit.deviceType,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //获取实体信息
            getInfo(id,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        //下拉框联动
        var form = layui.form;
        form.on('select(deviceType)', function(data){
            bacServicePlanEdit.deviceType = data.value;
            getDeviceList(data.value,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        form.on('select(servicePlanType)', function (data) {
            if (isEmpty(layEvent)) {
                var deviceType = bacServicePlanEdit.deviceType;
                var servicePlanType = data.value;
                var deviceId = $('[name=deviceId]').val();
                if (isNotEmpty(deviceType) && isNotEmpty(servicePlanType) && isNotEmpty(deviceId)) {
                    var prams = {
                        "deviceType": deviceType,
                        "servicePlanType": servicePlanType,
                        "deviceId": deviceId
                    }
                    getFirstService(prams);
                }
            }
        })
        form.on('select(deviceId)', function (data) {
            if (isEmpty(layEvent)) {
                var deviceType = bacServicePlanEdit.deviceType;
                var servicePlanType = $('[name=servicePlanType]').val();
                var deviceId = data.value;
                if (isNotEmpty(deviceType) && isNotEmpty(servicePlanType) && isNotEmpty(deviceId)) {
                    var prams = {
                        "deviceType": deviceType,
                        "servicePlanType": servicePlanType,
                        "deviceId": deviceId
                    }
                    getFirstService(prams);
                }
            }
        })
        avalon.scan();
    });
});

/**
 * 获取首次维护日期
 */
function getFirstService(prams) {
    if (isNotEmpty(prams)) {
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacServicePlan/getFirstService.do",
            data: prams,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                if (isNotEmpty(data)) {
                    form.val('bacServicePlanEdit_form', {firstService: util.toDateString(data.firstService, "yyyy-MM-dd")});
                    form.render()
                }
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function  getInfo(id,$callback){
    if(isEmpty(id)){
        //新增
        //表单初始赋值
        var form=layui.form; //调用layui的form模块
        //初始化表单元素,日期时间选择器
        var util=layui.util;
        var dataarr = {};
        var nowDate = new Date();
        dataarr.firstService=util.toDateString(nowDate,"yyyy-MM-dd");//首次维护日期默认为当前日期
        dataarr.advanceDay="1";//提醒天数默认为1
        form.val('bacServicePlanEdit_form', dataarr);
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "servicePlanId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacServicePlan/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){

                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.firstService = isNotEmpty(data.firstService) ? util.toDateString(data.firstService, "yyyy-MM-dd") : "";
                data.lastService = isNotEmpty(data.lastService) ? util.toDateString(data.lastService, "yyyy-MM-dd") : "";
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                data.updateTime = isNotEmpty(data.updateTime) ? util.toDateString(data.updateTime, "yyyy-MM-dd") : "";
                form.val('bacServicePlanEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

//获取设备列表
function getDeviceList(deviceType,$callback){
    var param = {
        deviceType:deviceType
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacDevice/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacServicePlanEdit.deviceList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
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
    form.on('submit(bacServicePlanEdit_submit)', function(data){
        //检验只能输入正整数
        var numberReg = /^[+]{0,1}(\d+)$/;
        if(isNotEmpty(data.field.advanceDay) && !numberReg.test(data.field.advanceDay)){
            errorToast("提醒天数只能输入正整数！");
        }else{
            //通过表单验证后
            var field = data.field; //获取提交的字段
            typeof $callback === 'function' && $callback(field); //返回一个回调事件
        }
    });
    $("#bacServicePlanEdit_submit").trigger('click');
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
        //判断是否存在主键ID，不存在执行新增否则为编辑
        var url = '';
        if(param.servicePlanId.length == 0){
            url = $.config.services.logistics + "/bacServicePlan/save.do";
        }else{
            url = $.config.services.logistics + "/bacServicePlan/edit.do";
        }
        //可以继续添加需要上传的参数
        //设备类型
        param.deviceType = bacServicePlanEdit.deviceType;
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data:param,
            dataType: "json",
            done:function(data){
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}



