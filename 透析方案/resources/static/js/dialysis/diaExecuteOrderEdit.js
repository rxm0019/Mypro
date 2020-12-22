/**
 * diaExecuteOrderEdit.jsp的js文件，包括查询，编辑操作
 * @author anders
 * @date 2020-08-24
 * @version 1.0
 */
var diaExecuteOrderEdit = avalon.define({
    $id: "diaExecuteOrderEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,doctors: []    //开嘱医生
    ,diaRecordId: ''  //透析记录id
    ,executeOrderId: ''  //执行医嘱id
    ,orderMainData: []  //医嘱字典数据
    ,orderSelectShow: true   //显示医嘱内容下拉框
    ,readonly: {readonly: true}   //只读
    ,textShow: true    //显示库存等信息
    ,disabled: {disabled: false}   //医嘱内容为检验时，禁用对应的控件
    ,showCycleWeekDiv: false     //循环周期为固定日期时显示每周的日期选择
    ,showOthers: true     //当医嘱类别为检验时，隐藏使用途径中某些内容
    ,showAsterisk: true   //控制使用途径中的*，是否显示，默认显示
    ,showPrice: false   //显示价格，默认否
    ,agoToday: 0        //计算距今第几周
    ,orderSubTypeData: []    //药疗分类数据
    ,customEdit: 'N'   //是否用户自定义编辑  默认否
    ,orderDictId: ''       //初始化的医嘱字典id
    ,clickOrderType: ''   //选中的医嘱类别
    ,dosage: 0        //单次剂量  计算总量
    ,frequency: 0     //频次     计算总量bizCode的值
    ,usageDays: 0     //天数
    ,totalDosage: 0   //总量
    ,takeTotal: ''    //总量取整
    ,salesUnit: ''     //销售单位
    ,basicUnit: ''     //基本单位
    ,conversionRel2Sales: 0  //销售单位比例
    ,conversionRel2Basic: 0  //基本单位比例
    ,allowSplitDispense: 'N' //是否允许拆分发药
    ,subDisabled: {disabled: false}  //子医嘱禁用
    ,subShow: true           //子医嘱不显示， 默认显示
    ,frequencyVal: ''        //对应字典的频率val
    ,type: ''                //物料类别  药品 耗材 检验 诊疗
    ,stockCount: 0             //库存量
    ,parentExecuteOrderId: ''
    ,orderName: ''              //医嘱内容
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var laydate=layui.laydate;
        laydate.render({
            elem: '#establishDate'
            ,type: 'date'
            ,value: new Date()
        });
        var id=GetQueryString("id");  //接收变量
        diaExecuteOrderEdit.executeOrderId = id;
        diaExecuteOrderEdit.diaRecordId = GetQueryString('diaRecordId');   //患者id
        diaExecuteOrderEdit.category = GetQueryString('category');   //医嘱类别
        diaExecuteOrderEdit.parentExecuteOrderId = GetQueryString('parentExecuteOrderId');   //父长期医嘱id
        diaExecuteOrderEdit.orderSubTypeData = baseFuncInfo.getSysDictByCode('MedicalTherapy');     //从字典获取药疗分类数据，联动使用
        doctors();      //获取开嘱医生列表
        monitorOrderContent();   // 医嘱内容下拉列表监听
        getCheckBoxStatus();    //自定义编辑框监听
        monitorOrderType();        //医嘱字典下拉框监听
        getSysHospitalList();      //获取中心管理列表
        initFrequencySelect();     //初始化频率下拉框
        monitorOrderSubType();    //监听药疗分类
        monitorInput();      //监听输入框值变化，计算总量
        monitorFrequency();   //监听频率下拉框
        $('#testTypeDiv').css('display','none');    //隐藏检验类型控件
        $('#orderSubTypeDiv').css('display', 'none');  //初始化隐藏药疗分类
        $('#stockCountDiv').css('display', 'none');
        $('#orderContent').attr('lay-verify', 'required');
        if (isNotEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
            diaExecuteOrderEdit.frequencyVal = GetQueryString('frequency');
            diaExecuteOrderEdit.usageDays = GetQueryString('usageDays');
            $('#frequency').val(diaExecuteOrderEdit.frequencyVal);
            $('#usageDays').val(diaExecuteOrderEdit.usageDays);
            $('#channel').val(GetQueryString('channel'));
            diaExecuteOrderEdit.subDisabled = {disabled: true};
            diaExecuteOrderEdit.disabled = {disabled: true};
            diaExecuteOrderEdit.subShow = false;
        }

        //获取实体信息
        getInfo(id,function(data){
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
            if (isNotEmpty(id)) {
                backFun(data);
            }
            getOrderMainList();   //获取医嘱内容下拉列表
        });

        var form = layui.form;
        form.verify({
            validateDay: function (value, item) {
                var reg = /^[1-9]\d*$/;
                if (value != null && value !== '' && !reg.test(value)) {
                    return "只能填写正整数";
                }
            }
        })

        avalon.scan();
    });
});

/**
 * 获取实体后的回调
 */
function backFun(data) {
    diaExecuteOrderEdit.customEdit = data.customEdit;
    diaExecuteOrderEdit.clickOrderType = data.orderType;
    diaExecuteOrderEdit.category = data.category;
    diaExecuteOrderEdit.diaRecordId = data.diaRecordId;
    if (data.customEdit === 'Y') {  //判断是否为用户自定义编辑
        $("#customEdit").attr("checked", "checked");
        $('#orderContentInput').val(data.orderContent);
    } else {
        $("#customEdit").removeAttr("checked");
        diaExecuteOrderEdit.orderDictId = data.orderDictId;
    }

    /** 频率，单次剂量，使用天数赋值，用于计算总量（取整） **/
    diaExecuteOrderEdit.frequency = $('#frequency').find("option:selected").attr("bizCode");
    diaExecuteOrderEdit.dosage = data.dosage;
    diaExecuteOrderEdit.usageDays = data.usageDays;
    diaExecuteOrderEdit.totalDosage = data.totalDosage;
    diaExecuteOrderEdit.orderName = data.orderContent;
    // var total = data.dosage * diaExecuteOrderEdit.frequency * data.usageDays;
    // diaExecuteOrderEdit.totalDosage = Math.ceil(total);

    /** 单位赋值 **/
    // $('.unit').html(data.basicUnit);

    if (data.orderType === '5') {  //医嘱类别为其他， 不显示星号
        diaExecuteOrderEdit.showAsterisk = false;
        diaExecuteOrderEdit.readonly = {readonly: false};
        diaExecuteOrderEdit.textShow = false;
        $("#orderContent").removeAttr('lay-verify');
        $("#orderContentInput").attr('lay-verify', 'required');
        $('#dosage').removeAttr('lay-verify');
        $('#frequency').removeAttr('lay-verify');
        $('#usageDays').removeAttr('lay-verify');
        $('#totalDosage').removeAttr('lay-verify');
        $('#channel').removeAttr('lay-verify');    //移除必填属性
        $('#orderContentInput').val(data.orderContent);
    } else {
        diaExecuteOrderEdit.showAsterisk = true;
        if (data.customEdit === 'N') {
            diaExecuteOrderEdit.readonly = {readonly: true};
            diaExecuteOrderEdit.textShow = true;
            diaExecuteOrderEdit.orderDictId = data.orderDictId;
        } else {
            diaExecuteOrderEdit.readonly = {readonly: false};
            diaExecuteOrderEdit.textShow = false;
            $('#orderContentInput').val(data.orderContent);
        }
        $("#orderContentInput").removeAttr('lay-verify');
        $("#orderContent").attr('lay-verify', 'required');
        $('#dosage').attr('lay-verify', 'required|number');
        $('#frequency').attr('lay-verify', 'required');
        $('#totalDosage').attr('lay-verify', 'required');
        $('#usageDays').attr('lay-verify', 'required|validateDay');
        $('#channel').attr('lay-verify', 'required');   //添加必填属性
    }
    if (data.orderType === '1') {
        $('#orderSubTypeDiv').css('display', 'block');
        // $('#stockCountDiv').css('display', 'block');
        initOrderSubTypeSelect();   //初始化药疗分类下拉框
        $('#orderSubType').val(data.orderSubType);
    }
    if (data.orderType === '3') { //医嘱类别为检验
        $('#channel').removeAttr('lay-verify');    //移除必填属性
        $('#testType').attr('lay-verify', 'required');
        $('#testTypeDiv').css('display','block');
        initTestTypeSelect();   //初始化检验类型下拉框
        $('#testType').val(data.testType);
        diaExecuteOrderEdit.disabled = {disabled: true};
        diaExecuteOrderEdit.showOthers = false;
    }
    if (data.orderType === '2') {   //医嘱类别为诊疗
        $('#channel').removeAttr('lay-verify');
        $('#channelAsterisk').css('display', 'none');
    }
    if (isNotEmpty(data.parentExecuteOrderId)) {   //子医嘱，频率、使用天数固定
        diaExecuteOrderEdit.parentExecuteOrderId = data.parentExecuteOrderId;
        diaExecuteOrderEdit.disabled = {disabled: true};
        diaExecuteOrderEdit.subDisabled = {disabled: true};
        diaExecuteOrderEdit.subShow = false;
        diaExecuteOrderEdit.frequencyVal = data.frequency;
    }
    var form = layui.form;
    form.render();
}

/**
 * 计算总量（取整）
 */
function takeTotalFun() {
    if (diaExecuteOrderEdit.conversionRel2Basic === 0 || diaExecuteOrderEdit.conversionRel2Sales === 0) {
        if (isEmpty(diaExecuteOrderEdit.allowSplitDispense) || diaExecuteOrderEdit.allowSplitDispense === 'N') {
            diaExecuteOrderEdit.takeTotal = '';
            return;
        }
    }

    if (diaExecuteOrderEdit.allowSplitDispense === 'Y') {  //允许拆分发药
        diaExecuteOrderEdit.takeTotal = diaExecuteOrderEdit.totalDosage + diaExecuteOrderEdit.basicUnit;
        return;
    }
    var value = diaExecuteOrderEdit.totalDosage * (diaExecuteOrderEdit.conversionRel2Sales / diaExecuteOrderEdit.conversionRel2Basic);
    if (value % 1 === 0) {
        diaExecuteOrderEdit.takeTotal = value + diaExecuteOrderEdit.salesUnit;
    } else {
        $('#takeTotal').css('color', '#ff0000');
        diaExecuteOrderEdit.takeTotal = Math.ceil(value) + diaExecuteOrderEdit.salesUnit + '余' + (Math.ceil(value) * diaExecuteOrderEdit.conversionRel2Basic - diaExecuteOrderEdit.totalDosage) + diaExecuteOrderEdit.basicUnit;
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
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    }else{
        //编辑
        var param={
            "executeOrderId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/diaExecuteOrder/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.establishDate=util.toDateString(data.establishDate,"yyyy-MM-dd");
                form.val('diaExecuteOrderEdit_form', data);
                form.render();
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取中心管理列表
 */
function getSysHospitalList() {
    var util = layui.util;
    _ajax({
        type: "POST",
        loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        dataType: "json",
        done:function(data){
            if (data.isPrice === 'Y') {  //显示价格
                diaExecuteOrderEdit.showPrice = true;
            }
        }
    });
}

/**
 * 获取制定人（医生角色）
 */
function doctors() {
    _ajax({
        type: "POST",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        dataType: "json",
        async: false,
        done: function (data) {
            diaExecuteOrderEdit.doctors=data;
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(diaExecuteOrderEdit.orderId)) {
                $('#executeOrderDoctor').val(doctorId);
            }
            var form = layui.form;
            form.render('select');
        }
    });
}

/**
 * 获取医嘱内容列表
 */
function getOrderMainList() {
    _ajax({
        type: "POST",
        loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis+"/patOrder/getOrderMainList.do",
        // data:param,
        dataType: "json",
        done:function(data){
            diaExecuteOrderEdit.orderMainData = data;
            initOrderSelect(data, '', '');
        }
    });
}

/**
 * 初始化药疗分类下拉框
 */
function initOrderSubTypeSelect() {
    var data = diaExecuteOrderEdit.orderSubTypeData;
    $("select[name='orderSubType']").empty();
    //医嘱内容赋值
    var html = "<option value=''></option>";
    $(data).each(function (i, item) {
        html += "<option value='" + item.value + "'>" + item.name + "</option>";
    });
    //把遍历的数据放到select表里面
    $("select[name='orderSubType']").append(html);
    var form = layui.form;
    form.render('select');
}

/**
 * 初始化医嘱内容下拉框
 */
function initOrderSelect(data, clickOrderType, clickMedicalType) {
    var tempData = [];
    if (isNotEmpty(clickOrderType) && isNotEmpty(clickMedicalType)) {   //判断选中
        data.forEach(function (item, i) {
            if (item.orderType === clickOrderType && item.medicalTherapy === clickMedicalType) {
                tempData.push(item);
            }
        })
    } else if (isNotEmpty(clickOrderType)) {
        data.forEach(function (item, i) {
            if (item.orderType === clickOrderType) {
                tempData.push(item);
            }
        })
    } else {
        tempData = data;
    }
    $("select[name='orderContent']").empty();
    //医嘱内容赋值
    var html = "<option value=''></option>";
    var checkId = '';
    var orderName = '';
    var str = '';
    var stockUnit = '';
    $(tempData).each(function (i, item) {
        var orderContent = item.orderName;
        if (isNotEmpty(item.specifications)) {
            orderContent += '#' + item.specifications;
        }
        if (isNotEmpty(item.manufactor)) {
            orderContent += '#' + item.manufactor;
        }
        if(isNotEmpty(diaExecuteOrderEdit.orderDictId)) {    //获取医嘱信息，给医嘱内容赋值
            if (item.orderMainId === diaExecuteOrderEdit.orderDictId) {
                checkId = item.orderMainId;
                orderName = item.orderName;
                diaExecuteOrderEdit.salesUnit = getSysDictName('purSalesBaseUnit', item.salesUnit);     //销售单位
                diaExecuteOrderEdit.basicUnit = getSysDictName('purSalesBaseUnit', item.basicUnit);    //基本单位
                diaExecuteOrderEdit.conversionRel2Sales = item.conversionRel2Sales;  //销售单位比例
                diaExecuteOrderEdit.conversionRel2Basic = item.conversionRel2Basic;  //基本单位比例
                diaExecuteOrderEdit.allowSplitDispense = item.allowSplitDispense;   //是否允许拆分发药
                diaExecuteOrderEdit.type = item.type;
                if (item.orderType === '1') {
                    takeTotalFun();
                }
                if (item.type === '1' || item.type === '2') {   //药品  耗材  存在库存量
                    $('#stockCountDiv').css('display', 'block');
                }
                // diaExecuteOrderEdit.orderDictId = '';
                str = item.stockCount;
                stockUnit = getSysDictName('purSalesBaseUnit', item.stockUnit);
            }
        }
        html += "<option value='" + item.orderMainId + "'>" + orderContent + "</option>";
    });
    //把遍历的数据放到select表里面
    $("select[name='orderContent']").append(html);
    $('#orderContent').val(checkId);
    $('#stockCount').val(str + stockUnit);
    var form = layui.form;
    form.render('select');
    $('select[id="orderContent"]').next().find('.layui-select-title input').val(orderName);

}

/**
 * 初始化检验类型下拉框
 */
function initTestTypeSelect() {
    $("select[name='testType']").empty();
    //医嘱内容赋值
    var html = "<option value=''></option>";
    var data = baseFuncInfo.getSysDictByCode('SampleType');
    $(data).each(function (i, item) {
        html += "<option value='" + item.value + "'>" + item.name + "</option>";
    });
    //把遍历的数据放到select表里面
    $("select[name='testType']").append(html);
    var form = layui.form;
    form.render('select');
}

/**
 * 初始化频率下拉框
 */
function initFrequencySelect() {
    $("select[name='frequency']").empty();
    //医嘱内容赋值
    var html = "<option value=''></option>";
    var data = baseFuncInfo.getSysDictByCode('OrderFrequency');
    $(data).each(function (i, item) {
        html += "<option bizCode='" + item.dictBizCode + "' value='" + item.value + "'>" + item.name + "</option>";
    });
    //把遍历的数据放到select表里面
    $("select[name='frequency']").append(html);
    if (isNotEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
        $('#frequency').val(diaExecuteOrderEdit.frequencyVal);
    }
    var form = layui.form;
    form.render('select');
}

/**
 * 监听医嘱类别下拉
 */
function monitorOrderType() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('select(orderType)', function(data){
            var orderType = data.elem.value;
            diaExecuteOrderEdit.clickOrderType = orderType;
            diaExecuteOrderEdit.basicUnit = '';
            diaExecuteOrderEdit.takeTotal = '';
            diaExecuteOrderEdit.totalDosage = '';
            diaExecuteOrderEdit.dosage = '';
            $('#channel').attr('lay-verify', 'required');   //添加必填属性
            if (orderType === '1') {  //判断医嘱类别是否为药疗
                $('#orderSubTypeDiv').css('display', 'block');
                // $('#stockCountDiv').css('display', 'block');
                $('#takeTotal').css('display', 'block');
                initOrderSubTypeSelect();   //初始化药疗分类下拉框
            } else {
                $('#orderSubTypeDiv').css('display', 'none');
                // $('#stockCountDiv').css('display', 'none');
                $('#takeTotal').css('display', 'none');
            }

            if (orderType === '3') {  //判断医嘱类别是否为检验
                $('#testTypeDiv').css('display','block');
                $('#stockCountDiv').css('display', 'none');
                initTestTypeSelect();   //初始化检验类型下拉框
                diaExecuteOrderEdit.disabled = {disabled: true};
                diaExecuteOrderEdit.showOthers = false;
                $('#totalDosage').val('1');
                $('#dosage').val('');
                $('#frequency').val('');
                $('#usageDays').val('');
                $('#channel').removeAttr('lay-verify');    //移除必填属性
                $('#testType').attr('lay-verify', 'required');
            } else {
                if (isEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
                    diaExecuteOrderEdit.disabled = {disabled: false};
                }
                diaExecuteOrderEdit.showOthers = true;
                $('#totalDosage').val('');
                $('#dosage').val('');
                $('#usageDays').val('');
                $('#testType').removeAttr('lay-verify');
                $('#testTypeDiv').css('display','none');
                $('#stockCountDiv').css('display', 'block');
                initFrequencySelect();
            }
            if (orderType === '5') {  //医嘱类别为其他， 不显示星号
                diaExecuteOrderEdit.showAsterisk = false;
                diaExecuteOrderEdit.readonly = {readonly: false};
                diaExecuteOrderEdit.textShow = false;
                diaExecuteOrderEdit.customEdit = 'N';
                diaExecuteOrderEdit.type = '';
                $("#orderContent").removeAttr('lay-verify');
                $("#orderContentInput").attr('lay-verify', 'required');
                $('#dosage').removeAttr('lay-verify');
                $('#frequency').removeAttr('lay-verify');
                $('#usageDays').removeAttr('lay-verify');
                $('#channel').removeAttr('lay-verify');    //移除必填属性
                $('#totalDosage').removeAttr('lay-verify');
                $('#orderDictId').val('');   //医嘱类别为其他， 手动填写医嘱内容，没有医嘱字典id，
                $('#stockCountDiv').css('display', 'none');
            } else {
                diaExecuteOrderEdit.showAsterisk = true;
                if (diaExecuteOrderEdit.customEdit === 'N') {
                    diaExecuteOrderEdit.readonly = {readonly: true};
                    diaExecuteOrderEdit.textShow = true;
                }
                $("#orderContentInput").removeAttr('lay-verify');
                $("#orderContent").attr('lay-verify', 'required');
                $('#dosage').attr('lay-verify', 'required|number');
                $('#frequency').attr('lay-verify', 'required');
                $('#usageDays').attr('lay-verify', 'required|validateDay');
                $('#stockCountDiv').css('display', 'block');
            }
            if (orderType === '2') {  //医嘱类别为诊疗
                $('#channel').removeAttr('lay-verify');
                $('#channelAsterisk').css('display', 'none');
            } else {
                $('#channelAsterisk').css('display', 'inline-block');
            }
            if (diaExecuteOrderEdit.customEdit === 'N') {
                initOrderSelect(diaExecuteOrderEdit.orderMainData, orderType, '');
            }
            if(isNotEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
                $('#usageDays').val(diaExecuteOrderEdit.usageDays);
            } else {
                if (orderType === '1') {
                    $('#usageDays').val('1');
                    diaExecuteOrderEdit.usageDays = 1;
                }
                $('#channel').val('');
            }
            $('#specifications').val('');
            $('#basicUnit').val('');
            $('#manufactor').val('');
            $('#stockCount').val('');
            form.render();      //重新渲染
            monitorInput();    //重新监听输入框
        });

    });
}

/**
 * 监听药疗分类
 */
function monitorOrderSubType() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('select(orderSubType)', function(data){
            var orderSubType = data.elem.value;
            diaExecuteOrderEdit.clickMedicalType = orderSubType;
            if (diaExecuteOrderEdit.customEdit === 'N') {   //勾选自定义， 不用初始化医嘱内容
                initOrderSelect(diaExecuteOrderEdit.orderMainData, $('#orderType').val(), orderSubType);
            }

            form.render('select');      //重新渲染
        });
    });
}

/**
 * 监听医嘱内容下拉选择事件
 */
function monitorOrderContent() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('select(orderContent)', function(data){
            var orderMainId = data.elem.value;
            var orderName = '';
            diaExecuteOrderEdit.totalDosage = '';
            diaExecuteOrderEdit.dosage = '';
            // $('#usageDays').val('');
            diaExecuteOrderEdit.orderMainData.forEach(function (item, i) {
                if (item.orderMainId == orderMainId) {
                    orderName = item.orderName;
                    diaExecuteOrderEdit.orderName = orderName;
                    diaExecuteOrderEdit.type = item. type;
                    if (item.orderType === '1') {  //显示药疗分类
                        initOrderSubTypeSelect();
                        $('#orderSubTypeDiv').css('display', 'block');
                        // $('#stockCountDiv').css('display', 'block');
                        $('#takeTotal').css('display', 'block');
                        diaExecuteOrderEdit.salesUnit = getSysDictName('purSalesBaseUnit', item.salesUnit);     //销售单位
                        diaExecuteOrderEdit.basicUnit = getSysDictName('purSalesBaseUnit', item.basicUnit);    //基本单位
                        diaExecuteOrderEdit.conversionRel2Sales = item.conversionRel2Sales;  //销售单位比例
                        diaExecuteOrderEdit.conversionRel2Basic = item.conversionRel2Basic;  //基本单位比例
                        diaExecuteOrderEdit.allowSplitDispense = item.allowSplitDispense;    //是否允许拆分发药
                        $('#basicUnit').val(getSysDictName('purSalesBaseUnit', item.basicUnit));
                        if (isEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
                            $('#usageDays').val('1');
                            diaExecuteOrderEdit.usageDays = 1;
                        }
                    } else {
                        $('#orderSubTypeDiv').css('display', 'none');
                        // $('#stockCountDiv').css('display', 'none');
                        $('#takeTotal').css('display', 'none');
                        $('#basicUnit').val(item.unit);
                    }

                    if (item.orderType === '3') {  //判断医嘱类别是否为检验
                        $('#testTypeDiv').css('display','block');
                        initTestTypeSelect();   //初始化检验类型下拉框
                        diaExecuteOrderEdit.disabled = {disabled: true};
                        diaExecuteOrderEdit.showOthers = false;
                        $('#stockCountDiv').css('display', 'none');
                        $('#totalDosage').val('1');
                        $('#dosage').val('');
                        $('#frequency').val('');
                        $('#usageDays').val('');
                        $('#channel').removeAttr('lay-verify');    //移除必填属性
                        $('#testType').attr('lay-verify', 'required');
                    } else {
                        if (isEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
                            diaExecuteOrderEdit.disabled = {disabled: false};
                        }
                        diaExecuteOrderEdit.showOthers = true;

                        $('#stockCountDiv').css('display', 'block');

                        $('#totalDosage').val('');
                        $('#testType').removeAttr('lay-verify');
                        $('#testTypeDiv').css('display','none');
                        initFrequencySelect();
                    }

                    $('#orderDictId').val(item.orderMainId);
                    $('#orderType').val(item.orderType);
                    $('#orderSubType').val(item.medicalTherapy);
                    $('#specifications').val(item.specifications);
                    var str = isEmpty(item.stockCount) ? 0 : item.stockCount;
                    $('#stockCount').val(str + getSysDictName('purSalesBaseUnit', item.stockUnit));
                    $('#manufactor').val(item.manufactor);
                    var price = isEmpty(item.salesPrice) ? '' : ('￥' + item.salesPrice);
                    $('#salesPrice').val(price);
                    // $('.unit').html(item.basicUnit);
                    $('#channel').val(item.route);
                    $('#dosage').val(item.singleDose);
                    if (isEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {
                        $('#frequency').val(item.frequency);
                    } else {
                        $('#frequency').val(diaExecuteOrderEdit.frequencyVal);
                    }
                    diaExecuteOrderEdit.dosage = item.singleDose;
                    diaExecuteOrderEdit.frequency = $('#frequency').find("option:selected").attr("bizCode");
                    if (isNotEmpty(diaExecuteOrderEdit.dosage) && isNotEmpty(diaExecuteOrderEdit.frequency) && isNotEmpty(diaExecuteOrderEdit.usageDays)) {
                        var total = diaExecuteOrderEdit.dosage * parseFloat(diaExecuteOrderEdit.frequency) * diaExecuteOrderEdit.usageDays;
                        diaExecuteOrderEdit.totalDosage = Math.ceil(total);
                        takeTotalFun();
                    }
                }
            });
            monitorInput();    //重新监听输入框
            form.render('select');      //重新渲染
            $('select[id="orderContent"]').next().find('.layui-select-title input').val(orderName);
        });
    });
}

/**
 * 监听自定义编辑复选框
 */
function getCheckBoxStatus() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('checkbox(customEdit)', function(data){
            var check = data.elem.checked;
            $('#orderSubTypeDiv').css('display', 'none');
            $('#orderType').val('');
            if (check) {
                diaExecuteOrderEdit.readonly = {readonly: false};
                diaExecuteOrderEdit.textShow = false;
                diaExecuteOrderEdit.customEdit = 'Y';
                diaExecuteOrderEdit.type = '';
                $("#orderContent").removeAttr('lay-verify');
                $("#orderContentInput").attr('lay-verify', 'required');
                $('#specifications').val('');
                $('#basicUnit').val('');
                $('#manufactor').val('');
                $('#salesPrice').val('');
            } else {
                diaExecuteOrderEdit.readonly = {readonly: true};
                diaExecuteOrderEdit.textShow = true;
                diaExecuteOrderEdit.customEdit = 'N';
                $("#orderContentInput").removeAttr('lay-verify');
                $("#orderContent").attr('lay-verify', 'required');
                initOrderSelect(diaExecuteOrderEdit.orderMainData, '', '');
            }
            form.render('select');
        });
    });
}

/**
 * 监听频率下拉框
 */
function monitorFrequency() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('select(frequency)', function(data){
            var value = $(data.elem).find("option:selected").attr("bizCode");
            diaExecuteOrderEdit.frequency = value;
            var total = diaExecuteOrderEdit.dosage * value * diaExecuteOrderEdit.usageDays;
            diaExecuteOrderEdit.totalDosage = Math.ceil(total);
            takeTotalFun();
            form.render('select','frequency');      //重新渲染
        });
    });
}

/**
 * 监听输入框改变
 */
function monitorInput() {
    $('#dosage').on('blur', function () {
        var value = $('#dosage').val();
        var reg = /^\d+(\.\d+)?$/;
        if (isNotEmpty(value)) {
            if (reg.test(value)) {
                diaExecuteOrderEdit.dosage = value;
                if (isNotEmpty(diaExecuteOrderEdit.frequency)) {
                    var total = value * parseFloat(diaExecuteOrderEdit.frequency) * diaExecuteOrderEdit.usageDays;
                    diaExecuteOrderEdit.totalDosage = Math.ceil(total);
                    takeTotalFun();
                }
            }
        }
    })
    $('#usageDays').on('blur', function () {
        var value = $('#usageDays').val();
        var reg = /^[1-9]\d*$/;
        if (isNotEmpty(value)) {
            if (reg.test(value)) {
                diaExecuteOrderEdit.usageDays = value;
                if (isNotEmpty(diaExecuteOrderEdit.frequency)) {
                    var total = diaExecuteOrderEdit.dosage * parseFloat(diaExecuteOrderEdit.frequency) * value;
                    diaExecuteOrderEdit.totalDosage = Math.ceil(total);
                    takeTotalFun();
                }
            }
        }
    })
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(diaExecuteOrderEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaExecuteOrderEdit_submit").trigger('click');
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
        param.diaRecordId = diaExecuteOrderEdit.diaRecordId;
        param.category = diaExecuteOrderEdit.category;
        param.customEdit = diaExecuteOrderEdit.customEdit;
        param.type = diaExecuteOrderEdit.type;
        if (isNotEmpty(diaExecuteOrderEdit.parentExecuteOrderId)) {   //传来的父长期医嘱ID不为空 ，  则视添加子医嘱
            param.parentExecuteOrderId = diaExecuteOrderEdit.parentExecuteOrderId;
            param.frequency = diaExecuteOrderEdit.frequencyVal;
            param.usageDays = diaExecuteOrderEdit.usageDays;
            param.channel = '';
        }

        if (diaExecuteOrderEdit.clickOrderType === '5' || diaExecuteOrderEdit.customEdit === 'Y'){  //医嘱类别为其他 || 自定义编辑， 获取input的医嘱内容，否则获取下拉框的医嘱内容
            param.orderContent = $('#orderContentInput').val();
        }else {
            param.orderContent = diaExecuteOrderEdit.orderName;
        }
        var url = $.config.services.dialysis + "/diaExecuteOrder/save.do";
        if (isNotEmpty(param.executeOrderId)) {
            url = $.config.services.dialysis + "/diaExecuteOrder/edit.do"
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



