/**
 * 水机消毒记录-新增、编辑
 * @author: Freya
 * @version: 1.0
 * @date: 2020/08/21
 */
var bacWaterSterilizeEdit = avalon.define({
    $id: "bacWaterSterilizeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    deviceList:[],//水机列表
    readonly: {readonly: false}, // 设置只读
    disabled:{disabled: false}, // 设置只读
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getDeviceList(function(data){
        });
        var id=GetQueryString("id");  //接收变量
        var layEvent=GetQueryString("layEvent");  //接收变量layEvent
        if (layEvent == 'detail') {
            bacWaterSterilizeEdit.readonly = {readonly: true};
            bacWaterSterilizeEdit.disabled = {disabled: true};
            $('input[type="radio"]').prop('disabled', true);
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
                elem: '#sterilizeTime'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#swillTime'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#vestigitalTimeOne'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#vestigitalTimeTwo'
                ,type: 'time'
                ,trigger: 'click'
            });
            laydate.render({
                elem: '#vestigitalTimeThree'
                ,type: 'time'
                ,trigger: 'click'
            });
        }
        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
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
            bacWaterSterilizeEdit.deviceList = data;
            var form=layui.form; //调用layui的form模块
            form.render();
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}
//正数正则表达式（整数或小数）
var numberReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
//正整数正则表达式
var numberRegs = /^[+]{0,1}(\d+)$/;
var reg = RegExp(/.00/);
//监听A+B体积、瓶标浓度,过氧乙酸含量=A+B体积*瓶标浓度
function peroxyaceticAcidChange(){
    var form=layui.form;
    var abBluk = $("input[name='abBluk']").val();
    if(isNotEmpty(abBluk)){
        if(numberReg.test(abBluk)){
            //正整数保留输入的数值，小数保留两位小数
            if(numberRegs.test(abBluk)){
                $("#abBluk").val(abBluk);
            }else{
                $("#abBluk").val(parseFloat(abBluk).toFixed(2));//仅保留两位小数
            }
        }else{
            errorToast("A+B体积只能输入正数（整数或小数）！");
            $("#abBluk").val("");
        }
    }else{
        abBluk = "";
    }
    var flaskConcentration = $("input[name='flaskConcentration']").val();
    if(isNotEmpty(flaskConcentration)){
        if(numberReg.test(flaskConcentration)){
            //正整数保留输入的数值，小数保留两位小数
            if(numberRegs.test(flaskConcentration)){
                $("#flaskConcentration").val(flaskConcentration);
            }else{
                $("#flaskConcentration").val(parseFloat(flaskConcentration).toFixed(2));//仅保留两位小数
            }
        }else{
            errorToast("瓶标浓度只能输入正数（整数或小数）！");
            $("#flaskConcentration").val("");
        }
    }else{
        flaskConcentration = "";
    }
    form.render();
    if(isNotEmpty(abBluk) && isNotEmpty(flaskConcentration)){
        var peroxyaceticAcid = (parseFloat(abBluk)*parseFloat(flaskConcentration)).toFixed(2).toString();
        if(peroxyaceticAcid.match(reg)){
            peroxyaceticAcid = peroxyaceticAcid.substring(0,peroxyaceticAcid.length-3);
            $("#peroxyaceticAcid").val(peroxyaceticAcid);//渲染过氧乙酸含量文本框
        }else{
            $("#peroxyaceticAcid").val(parseFloat(peroxyaceticAcid).toFixed(2));//仅保留两位小数
        }
    }else{
        $("#peroxyaceticAcid").val("");//仅保留两位小数
    }
    form.render();
    endConcentrationChange();
}
//监听箱内纯水体积、主机内纯水体积、管道内纯水体积,溶剂体积=箱内纯水体积+主机内纯水体积+管道内纯水体积
function solventBlukChange(){
    var form=layui.form;
    var cisternBluk = $("input[name='cisternBluk']").val();
    if(isNotEmpty(cisternBluk)){
        if(numberReg.test(cisternBluk)){
            //正整数保留输入的数值，小数保留两位小数
            if(numberRegs.test(cisternBluk)){
                $("#cisternBluk").val(cisternBluk);
            }else{
                $("#cisternBluk").val(parseFloat(cisternBluk).toFixed(2));//仅保留两位小数
            }
        }else{
            errorToast("箱内纯水体积只能输入正数（整数或小数）！");
            $("#cisternBluk").val("");
        }
    }else{
        cisternBluk = 0;
    }
    var hostPureBluk = $("input[name='hostPureBluk']").val();
    if(isNotEmpty(hostPureBluk)){
        if(numberReg.test(hostPureBluk)){
            //正整数保留输入的数值，小数保留两位小数
            if(numberRegs.test(hostPureBluk)){
                $("#hostPureBluk").val(hostPureBluk);
            }else{
                $("#hostPureBluk").val(parseFloat(hostPureBluk).toFixed(2));//仅保留两位小数
            }
        }else{
            errorToast("主机内纯水体积只能输入正数（整数或小数）！");
            $("#hostPureBluk").val("");
        }
    }else{
        hostPureBluk = 0;
    }
    var pipePureBluk = $("input[name='pipePureBluk']").val();
    if(isNotEmpty(pipePureBluk)){
        if(numberReg.test(pipePureBluk)){
            //正整数保留输入的数值，小数保留两位小数
            if(numberRegs.test(pipePureBluk)){
                $("#pipePureBluk").val(pipePureBluk);
            }else{
                $("#pipePureBluk").val(parseFloat(pipePureBluk).toFixed(2));//仅保留两位小数
            }
        }else{
            errorToast("管道内纯水体积只能输入正数（整数或小数）！");
            $("#pipePureBluk").val("");
        }
    }else{
        pipePureBluk = 0;
    }
    form.render();
    if(isNotEmpty(cisternBluk) && isNotEmpty(hostPureBluk) && isNotEmpty(pipePureBluk)){
        var solventBluk = (parseFloat(cisternBluk)+parseFloat(hostPureBluk)+parseFloat(pipePureBluk)).toFixed(2).toString();
        if(solventBluk.match(reg)){
            solventBluk = solventBluk.substring(0,solventBluk.length-3);
            $("#solventBluk").val(solventBluk);
        }else{
            $("#solventBluk").val(parseFloat(solventBluk).toFixed(2));//仅保留两位小数
        }
    }else{
        $("#solventBluk").val("");
    }
    form.render();
    endConcentrationChange();
}
//监听过氧乙酸含量、溶剂体积,最终消毒液浓度=过氧乙酸含量/溶剂体积
function endConcentrationChange(){
    var form=layui.form;
    var peroxyaceticAcid = $("input[name='peroxyaceticAcid']").val();
    var solventBluk = $("input[name='solventBluk']").val();
    form.render();
    if (isNotEmpty(peroxyaceticAcid) && isNotEmpty(solventBluk) && parseFloat(solventBluk) != 0) {
        var endConcentration = (parseFloat(peroxyaceticAcid)/parseFloat(solventBluk)).toFixed(2).toString();
        if(endConcentration.match(reg)){
            endConcentration = endConcentration.substring(0,endConcentration.length-3);
            $("#endConcentration").val(endConcentration);
        }else{
            $("#endConcentration").val(parseFloat(endConcentration).toFixed(2));//仅保留两位小数
        }
    }else{
        $("#endConcentration").val("");
    }
    form.render();
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
        // 表单赋值
        var form=layui.form;
        var util=layui.util;
        form.val('bacWaterSterilizeEdit_form', {
            sterilizeDate: util.toDateString(new Date(),"yyyy-MM-dd"),
            operatorUser: baseFuncInfo.userInfoData.username
        });
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "waterSterilizeId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.logistics + "/bacWaterSterilize/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.sterilizeDate=data.sterilizeDate ==null ? '' : util.toDateString(data.sterilizeDate,"yyyy-MM-dd");
                data.sterilizeTime=data.sterilizeTime ==null ? '' : util.toDateString(data.sterilizeTime,"HH:mm:ss");
                data.swillTime=data.swillTime ==null ? '' : util.toDateString(data.swillTime,"HH:mm:ss");
                data.vestigitalTimeOne=data.vestigitalTimeOne ==null ? '' : util.toDateString(data.vestigitalTimeOne,"HH:mm:ss");
                data.vestigitalTimeTwo=data.vestigitalTimeTwo ==null ? '' : util.toDateString(data.vestigitalTimeTwo,"HH:mm:ss");
                data.vestigitalTimeThree=data.vestigitalTimeThree ==null ? '' : util.toDateString(data.vestigitalTimeThree,"HH:mm:ss");
                form.val('bacWaterSterilizeEdit_form', data);
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
    form.on('submit(bacWaterSterilizeEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        dis_verify_form(field,$callback)
        // typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#bacWaterSterilizeEdit_submit").trigger('click');
}

function dis_verify_form(field,$callback) {
    var errMsg = [];
    if(isNotEmpty(field.loopTime) && !numberRegs.test(field.loopTime)){
        errMsg.push("循环时间只能输入正整数，");
    }
    if(isNotEmpty(field.soakTime) && !numberRegs.test(field.soakTime)){
        errMsg.push("浸泡时间只能输入正整数，");
    }
    if(isNotEmpty(field.letOutTime) && !numberRegs.test(field.letOutTime)){
        errMsg.push("消毒液排放只能输入正整数，");
    }
    if(isNotEmpty(field.pureWaterSwill) && !numberRegs.test(field.pureWaterSwill)){
        errMsg.push("纯水冲洗只能输入正整数，");
    }
    if(isNotEmpty(field.vestigitalSterilizeOne) && !numberRegs.test(field.vestigitalSterilizeOne)){
        errMsg.push("消毒液残留1只能输入正整数，");
    }
    if(isNotEmpty(field.vestigitalSterilizeTwo) && !numberRegs.test(field.vestigitalSterilizeTwo)){
        errMsg.push("消毒液残留2只能输入正整数，");
    }
    if(isNotEmpty(field.vestigitalSterilizeThree) && !numberRegs.test(field.vestigitalSterilizeThree)){
        errMsg.push("消毒液残留3只能输入正整数，");
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
        if(param.waterSterilizeId.length == 0){
            url = $.config.services.logistics + "/bacWaterSterilize/save.do";
        }else{
            url = $.config.services.logistics + "/bacWaterSterilize/edit.do";
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



