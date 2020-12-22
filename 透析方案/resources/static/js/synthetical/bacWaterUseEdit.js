/**
 * 水机每日登记-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/17
 */
var bacWaterUseEdit = avalon.define({
    $id: "bacWaterUseEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceList:[],//水机列表
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id=GetQueryString("id");  //接收变量
        var layEvent=GetQueryString("layEvent");  //接收变量layEvent
        if (layEvent == 'detail') {
            bacWaterUseEdit.readonly = {readonly: true};
            bacWaterUseEdit.disabled = {disabled: true};
        }
        if(layEvent != 'detail'){
            //初始化表单元素,日期时间选择器
            var laydate=layui.laydate;
            laydate.render({
                elem: '#registerDate'
                ,type: 'date'
                ,trigger: 'click'
            });
        }
        getDeviceList(function(data){
        });
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        var form=layui.form; //调用layui的form模块
        var util=layui.util;
        var data = {};
        if(isEmpty(id)){
            data = {
                registerDate:util.toDateString(new Date(),"yyyy-MM-dd")
                ,registerUser:baseFuncInfo.userInfoData.username
            }
        }
        form.val('bacWaterUseEdit_form', data);
        avalon.scan();
    });
});

//获取水机列表
function getDeviceList($callback){
    //水机
    var tmp = baseFuncInfo.getSysDictByCode("MachineWater");
    var machineWater = "";
    $.each(tmp,function(index, item){
        if(item.value !=""){
            machineWater = item.value;
        }
    })
    var param = {
        deviceType:machineWater//设备类型为水机
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.logistics + "/bacDevice/getLists.do",
        data:param,
        dataType: "json",
        done:function(data){
            bacWaterUseEdit.deviceList = data;
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
            "waterUseId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacWaterUse/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.registerDate = isNotEmpty(data.registerDate) ? util.toDateString(data.registerDate, "yyyy-MM-dd") : "";
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                data.updateTime = isNotEmpty(data.updateTime) ? util.toDateString(data.updateTime, "yyyy-MM-dd") : "";
                form.val('bacWaterUseEdit_form', data);
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
    form.on('submit(bacWaterUseEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        dis_verify_form(field,$callback)
        // typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacWaterUseEdit_submit").trigger('click');
}
//正数正则表达式（整数或小数）
var numberReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
function dis_verify_form(field,$callback) {
    var errMsg = [];
    if(isNotEmpty(field.waterQuality) && !numberReg.test(field.waterQuality)){
        errMsg.push("（自来水）水质只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.hydraulicPressure) && !numberReg.test(field.hydraulicPressure)){
        errMsg.push("（自来水）压力只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.rawPump) && !numberReg.test(field.rawPump)){
        errMsg.push("（自来水）原水泵只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.sandFiltration) && !numberReg.test(field.sandFiltration)){
        errMsg.push("（前置）沙滤只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.resin) && !numberReg.test(field.resin)){
        errMsg.push("（前置）树脂只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.addSalt) && !numberReg.test(field.addSalt)){
        errMsg.push("（前置）加盐量只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.activatedCarbon) && !numberReg.test(field.activatedCarbon)){
        errMsg.push("（前置）活性炭只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.filterAfter) && !numberReg.test(field.filterAfter)){
        errMsg.push("（前置）滤芯后只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.softWaterHardness) && !numberReg.test(field.softWaterHardness)){
        errMsg.push("（前置）软硬程度只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.uhr) && !numberReg.test(field.uhr)){
        errMsg.push("（前置）总氯只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.waterQualityOne) && !numberReg.test(field.waterQualityOne)){
        errMsg.push("（一段）水质只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.pureWaterFlow) && !numberReg.test(field.pureWaterFlow)){
        errMsg.push("（一段）纯水流量只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.thickWaterFlow) && !numberReg.test(field.thickWaterFlow)){
        errMsg.push("（一段）浓水流量只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.inHydraulicPressure) && !numberReg.test(field.inHydraulicPressure)){
        errMsg.push("（一段）进水压只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.outHydraulicPressure) && !numberReg.test(field.outHydraulicPressure)){
        errMsg.push("（一段）出水压只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.waterQualityTwo) && !numberReg.test(field.waterQualityTwo)){
        errMsg.push("（二段）水质只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.pureWaterTwo) && !numberReg.test(field.pureWaterTwo)){
        errMsg.push("（二段）纯水流量只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.thickWaterTwo) && !numberReg.test(field.thickWaterTwo)){
        errMsg.push("（二段）浓水流量只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.inHydraulicTwo) && !numberReg.test(field.inHydraulicTwo)){
        errMsg.push("（二段）进水压只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.outHydraulicTwo) && !numberReg.test(field.outHydraulicTwo)){
        errMsg.push("（二段）出水压只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.ph) && !numberReg.test(field.ph)){
        errMsg.push("（二段）PH值只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.intoWater) && !numberReg.test(field.intoWater)){
        errMsg.push("（输送压）进水压只能输入正数（整数或小数），");
    }
    if(isNotEmpty(field.returnWater) && !numberReg.test(field.returnWater)){
        errMsg.push("（输送压）回水压只能输入正数（整数或小数），");
    }
    if(errMsg.length > 0){
        errorToast(errMsg.toString().substring(0,errMsg.toString().length-1));
        return false;
    }
    typeof $callback === 'function' && $callback(field); //返回一个回调事件
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
        if(param.waterUseId.length == 0){
            url = $.config.services.logistics + "/bacWaterUse/save.do";
        }else{
            url = $.config.services.logistics + "/bacWaterUse/edit.do";
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



