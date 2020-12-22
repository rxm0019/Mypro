/**
 * 设备消毒-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/25
 */
var bacDeviceSterilizeEdit = avalon.define({
    $id: "bacDeviceSterilizeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
    deviceType:'',//设备类型
    deviceList:[],//设备列表
    deviceTypeList:getDeviceTypeList(),//设备类型
    createBy: "", //创建人
    createTime: "" //创建时间
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        bacDeviceSterilizeEdit.deviceType = GetQueryString("deviceType"); // 接收变量deviceType
        if (layEvent === 'detail') {
            bacDeviceSterilizeEdit.readonly = {readonly: true};
            bacDeviceSterilizeEdit.disabled = {disabled: true};
        }
        if(layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#sterilizeDate'
                ,type: 'date'
                ,trigger: 'click'
            });
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
        }
        if(!isEmpty(id)){
            getDeviceList(bacDeviceSterilizeEdit.deviceType,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            });
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        //下拉框联动
        form=layui.form;
        form.on('select(deviceType)', function(data){
            bacDeviceSterilizeEdit.deviceType = data.value;
            getDeviceList(data.value,function(data){
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        });
        var form=layui.form; //调用layui的form模块
        var util=layui.util;
        var data = {};
        if(isEmpty(id)){
            data = {
                sterilizeDate:util.toDateString(new Date(),"yyyy-MM-dd")
                ,startDate:util.toDateString(new Date(),"HH:mm:ss")
                ,endDate:util.toDateString(new Date(),"HH:mm:ss")
                ,operatorUser:baseFuncInfo.userInfoData.username
            }
        }
        form.val('bacDeviceSterilizeEdit_form', data);
        avalon.scan();
    });
});

//获取设备类型列表，排除水处理机以及透析机
function getDeviceTypeList(){
    //透析机
    var tmp = baseFuncInfo.getSysDictByCode("DialyzerType");
    var dialyzer = "";
    $.each(tmp,function(index, item){
        if(item.value !=""){
            dialyzer = item.value;
        }
    });
    //水机
    var tmp = baseFuncInfo.getSysDictByCode("MachineWater");
    var machineWater = "";
    $.each(tmp,function(index, item){
        if(item.value !=""){
            machineWater = item.value;
        }
    })
    var dicts=[];
    //全部设备类型
    var tmp = baseFuncInfo.getSysDictByCode("deviceType");
    dicts = tmp.filter(function (val) {
        if(val.value != machineWater && val.value != dialyzer){
            return val;
        }
    });
    return dicts;
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
            bacDeviceSterilizeEdit.deviceList = data;
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
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "deviceSterilizeId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacDeviceSterilize/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.sterilizeDate = isNotEmpty(data.sterilizeDate) ? util.toDateString(data.sterilizeDate, "yyyy-MM-dd") : "";
                data.startDate = isNotEmpty(data.startDate) ? util.toDateString(data.startDate, "HH:mm:ss") : "";
                data.endDate = isNotEmpty(data.endDate) ? util.toDateString(data.endDate, "HH:mm:ss") : "";
                data.deviceType=bacDeviceSterilizeEdit.deviceType;
                bacDeviceSterilizeEdit.createBy = data.createBy;
                bacDeviceSterilizeEdit.createTime =  data.createTime ;
                form.val('bacDeviceSterilizeEdit_form', data);
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
    form.on('submit(bacDeviceSterilizeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        field.createBy = bacDeviceSterilizeEdit.createBy;
        field.createTime = layui.util.toDateString(bacDeviceSterilizeEdit.createTime);
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacDeviceSterilizeEdit_submit").trigger('click');
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
        if(param.deviceSterilizeId.length == 0){
            url = $.config.services.logistics + "/bacDeviceSterilize/save.do";
        }else{
            url = $.config.services.logistics + "/bacDeviceSterilize/edit.do";
        }
        //可以继续添加需要上传的参数
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



