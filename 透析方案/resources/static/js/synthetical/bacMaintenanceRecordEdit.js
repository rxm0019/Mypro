/**
 * 维修记录-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/19
 */
var bacMaintenanceRecordEdit = avalon.define({
    $id: "bacMaintenanceRecordEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceList:[],//设备列表
    deviceType:'',//设备类型
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
    malfunction:'',//故障
    engineer:'',//工程师
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail') {
            bacMaintenanceRecordEdit.readonly = {readonly: true};
            bacMaintenanceRecordEdit.disabled = {disabled: true};
            $('input[type="checkbox"]').prop('disabled', true);
        }
        if(layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#startDate'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#endDate'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#maintenanceDate'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        bacMaintenanceRecordEdit.deviceType=GetQueryString("deviceType");  //接收变量设备类型
        getDeviceList(bacMaintenanceRecordEdit.deviceType,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //获取实体信息
            getInfo(id,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        //下拉框联动
        form=layui.form;
        form.on('select(deviceType)', function(data){
            bacMaintenanceRecordEdit.deviceType = data.value;
            getDeviceList(data.value,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        //复选框监听，只能单选
        form.on('checkbox(malfunction)', function(data){
            bacMaintenanceRecordEdit.malfunction = data.value;
            $("input:checkbox[name='malfunction']").each(function () {
                if($(this).val() == bacMaintenanceRecordEdit.malfunction){
                    $(this).prop("checked", true);
                }else{
                    $(this).prop("checked", false);
                }
            });
            $("#malfunction").val();//重新渲染复选框
            form.render();
        });
        form.on('checkbox(engineer)', function(data){
            bacMaintenanceRecordEdit.engineer = data.value;
            $("input:checkbox[name='engineer']").each(function () {
                if($(this).val() == bacMaintenanceRecordEdit.engineer){
                    $(this).prop("checked", true);
                }else{
                    $(this).prop("checked", false);
                }
            });
            $("#engineer").val();//重新渲染复选框
            form.render();
        });
        avalon.scan();
    });
});

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
            bacMaintenanceRecordEdit.deviceList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
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
        var form=layui.form; //调用layui的form模块
        var util=layui.util;
        var data = {
            maintenanceDate:util.toDateString(new Date(),"yyyy-MM-dd")
            ,startDate:util.toDateString(new Date(),"HH:mm:ss")
            ,endDate:util.toDateString(new Date(),"HH:mm:ss")
            ,manHour:'0'
            ,maintenanceUser:baseFuncInfo.userInfoData.username
        }
        form.val('bacMaintenanceRecordEdit_form', data);
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "maintenanceRecordId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacMaintenanceRecord/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;

                data.startDate = isNotEmpty(data.startDate) ? util.toDateString(data.startDate, "HH:mm:ss") : "";
                data.endDate = isNotEmpty(data.endDate) ? util.toDateString(data.endDate, "HH:mm:ss") : "";
                data.maintenanceDate = isNotEmpty(data.maintenanceDate) ? util.toDateString(data.maintenanceDate, "yyyy-MM-dd") : "";
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                data.updateTime = isNotEmpty(data.updateTime) ? util.toDateString(data.updateTime, "yyyy-MM-dd") : "";
                data.deviceType=bacMaintenanceRecordEdit.deviceType;
                $("input:checkbox[name='malfunction']").each(function () {
                    var val=$(this).val();
                    if (val === data.malfunction){
                        $(this).prop("checked", true);
                    }else{
                        $(this).prop("checked", false);
                    }
                });
                $("input:checkbox[name='engineer']").each(function () {
                    var val=$(this).val();
                    if (val === data.engineer){
                        $(this).prop("checked", true);
                    }else{
                        $(this).prop("checked", false);
                    }
                });
                form.val('bacMaintenanceRecordEdit_form', data);
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}
/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(bacMaintenanceRecordEdit_submit)', function(data){
        //正数正则表达式（整数或小数）
        var numberReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if(isNotEmpty(data.field.manHour) && !numberReg.test(data.field.manHour)){
            errorToast("总工时只能输入正数！");
        }else{
            //通过表单验证后
            var field = data.field; //获取提交的字段
            typeof $callback === 'function' && $callback(field); //返回一个回调事件
        }
    });
    $("#bacMaintenanceRecordEdit_submit").trigger('click');
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
        param.startDate=param.maintenanceDate+" "+param.startDate;
        param.endDate=param.maintenanceDate+" "+param.endDate;
        var url = "";
        if(param.maintenanceRecordId.length == 0){
            url = $.config.services.logistics + "/bacMaintenanceRecord/save.do";
        }else{
            url = $.config.services.logistics + "/bacMaintenanceRecord/edit.do";
        }
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

    //将checke拼接为"value1,value2,value3"
    function GetCheckboxValues(Name) {
        var result = [];
        $("[id='" + Name + "']:checkbox").each(function () {
            if ($(this).is(":checked")) {
                result.push($(this).attr("value"));
            }
        });
        return result.join(",");
    };
}



