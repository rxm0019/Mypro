/**
 * patOrderEdit.jsp的js文件，包括查询，编辑操作
 * @author anders
 * @date 2020-08-24
 * @version 1.0
 */
var patOrderEdit = avalon.define({
    $id: "patOrderEdit",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,patientId: ''
    ,doctors: []    //开嘱医生
    ,orderId: ''
    ,orderMainData: []  //医嘱字典数据
    ,orderSelectShow: true   //显示医嘱内容下拉框
    ,readonly: {readonly: true}   //只读
    ,textShow: true    //显示库存等信息
    ,disabled: {disabled: false}   //医嘱内容为检验时，禁用对应的控件
    ,showCycleWeekDiv: false     //循环周期为固定日期时显示每周的日期选择
    ,cycleEveryTimesReadonly: {readonly:true}  //每隔几次，显示设置为只读
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
    ,allowSplitDispense: 'N'  //是否允许拆分发药，N--否  Y--是  默认N
    ,subDisabled: {disabled: false}  //子医嘱禁用
    ,subShow: true           //子医嘱不显示， 默认显示
    ,frequencyVal: ''        //对应字典的频率val
    ,serverTime: new Date()   //服务器时间
    ,orderName: ''             //医嘱内容
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
        laydate.render({
            elem: '#startDate'
            ,type: 'date'
            ,value: new Date()
        });
        laydate.render({
            elem: '#endDate'
            ,type: 'date'
        });
        var id=GetQueryString("orderId");  //接收变量
        patOrderEdit.orderId = id;
        patOrderEdit.patientId = GetQueryString('patientId');   //患者id
        patOrderEdit.category = GetQueryString('category');   //医嘱类别
        patOrderEdit.parentOrderId = GetQueryString('parentOrderId');   //父长期医嘱id
        patOrderEdit.orderSubTypeData = baseFuncInfo.getSysDictByCode('MedicalTherapy');     //从字典获取药疗分类数据，联动使用
        doctors();      //获取开嘱医生列表
        monitorOrderContent();   // 医嘱内容下拉列表监听
        getCheckBoxStatus();    //自定义编辑框监听
        monitorOrderType();        //医嘱字典下拉框监听
        monitorCycleTypeRadio();    //循环周期单选按钮监听
        getSysHospitalList();      //获取中心管理列表
        initFrequencySelect();     //初始化频率下拉框
        monitorOrderSubType();    //监听药疗分类
        monitorInput();      //监听输入框值变化，计算总量
        monitorFrequency();   //监听频率下拉框
        $('#testTypeDiv').css('display','none');    //隐藏检验类型控件
        $('#orderSubTypeDiv').css('display', 'none');  //初始化隐藏药疗分类
        $('#orderContent').attr('lay-verify', 'required');
        if (isNotEmpty(patOrderEdit.parentOrderId)) {
            patOrderEdit.frequencyVal = GetQueryString('frequency');
            patOrderEdit.usageDays = GetQueryString('usageDays');
            $('#frequency').val(patOrderEdit.frequencyVal);
            $('#usageDays').val(patOrderEdit.usageDays);
            $('#channel').val(GetQueryString('channel'));
            patOrderEdit.subDisabled = {disabled: true};
            patOrderEdit.disabled = {disabled: true};
            patOrderEdit.subShow = false;
            $('#startDate').removeAttr('lay-required');
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
    patOrderEdit.customEdit = data.customEdit;
    patOrderEdit.clickOrderType = data.orderType;
    if (data.customEdit === 'Y') {  //判断是否为用户自定义编辑
        $("#customEdit").attr("checked", "checked");
        $('#orderContentInput').val(data.orderContent);
    } else {
        $("#customEdit").removeAttr("checked");
        patOrderEdit.orderDictId = data.orderDictId;
    }

    /** 频率，单次剂量，使用天数赋值，用于计算总量（取整） **/
    patOrderEdit.frequency = $('#frequency').find("option:selected").attr("bizCode");
    patOrderEdit.dosage = data.dosage;
    patOrderEdit.usageDays = data.usageDays;
    patOrderEdit.totalDosage = data.totalDosage;
    patOrderEdit.orderName = data.orderContent;
    // var total = data.dosage * patOrderEdit.frequency * data.usageDays;
    // patOrderEdit.totalDosage = Math.ceil(total);

    /** 单位赋值 **/
    // $('.unit').html(data.basicUnit);

    if (data.orderType === '5') {  //医嘱类别为其他， 不显示星号
        patOrderEdit.showAsterisk = false;
        patOrderEdit.readonly = {readonly: false};
        patOrderEdit.textShow = false;
        $("#orderContent").removeAttr('lay-verify');
        $("#orderContentInput").attr('lay-verify', 'required');
        $('#dosage').removeAttr('lay-verify');
        $('#frequency').removeAttr('lay-verify');
        $('#usageDays').removeAttr('lay-verify');
        $('#totalDosage').removeAttr('lay-verify');
        $('#channel').removeAttr('lay-verify');    //移除必填属性
        $('#orderContentInput').val(data.orderContent);
    } else {
        patOrderEdit.showAsterisk = true;
        if (data.customEdit === 'N') {
            patOrderEdit.readonly = {readonly: true};
            patOrderEdit.textShow = true;
            patOrderEdit.orderDictId = data.orderDictId;
        } else {
            patOrderEdit.readonly = {readonly: false};
            patOrderEdit.textShow = false;
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
        patOrderEdit.disabled = {disabled: true};
        patOrderEdit.showOthers = false;
        patOrderEdit.totalDosage = 1;
    }
    if (data.orderType === '2') {   //医嘱类别为诊疗
        $('#channel').removeAttr('lay-verify');
        $('#channelAsterisk').css('display', 'none');
    }
    if (isNotEmpty(data.parentOrderId)) {   //子医嘱，频率、使用天数固定
        patOrderEdit.parentOrderId = data.parentOrderId;
        patOrderEdit.disabled = {disabled: true};
        patOrderEdit.subDisabled = {disabled: true};
        patOrderEdit.subShow = false;
        patOrderEdit.frequencyVal = data.frequency;
        $('#startDate').removeAttr('lay-required');
    }
    var form = layui.form;
    form.render();
}

/**
 * 计算总量（取整）
 */
function takeTotalFun() {
    if (patOrderEdit.conversionRel2Basic === 0 || patOrderEdit.conversionRel2Sales === 0) {
        if (isEmpty(patOrderEdit.allowSplitDispense) || patOrderEdit.allowSplitDispense === 'N') {
            patOrderEdit.takeTotal = '';
            return;
        }
    }

    if (patOrderEdit.allowSplitDispense === 'Y') {  //允许拆分发药
        patOrderEdit.takeTotal = patOrderEdit.totalDosage + patOrderEdit.basicUnit;
        return;
    }

    var value = patOrderEdit.totalDosage * (patOrderEdit.conversionRel2Sales / patOrderEdit.conversionRel2Basic);
    if (value % 1 === 0) {
        patOrderEdit.takeTotal = value + patOrderEdit.salesUnit;
    } else {
        $('#takeTotal').css('color', '#ff0000');
        patOrderEdit.takeTotal = Math.ceil(value) + patOrderEdit.salesUnit + '余' + (Math.ceil(value) * patOrderEdit.conversionRel2Basic - patOrderEdit.totalDosage) + patOrderEdit.basicUnit;
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
            "orderId":id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patOrder/getInfo.do",
            data:param,
            dataType: "json",
            done:function(data){
                //表单初始赋值
                var form=layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util=layui.util;
                data.establishDate=util.toDateString(data.establishDate,"yyyy-MM-dd");
                data.startDate=util.toDateString(data.startDate,"yyyy-MM-dd");
                if (data.endDate < 0) {
                    data.endDate = '';
                } else {
                    data.endDate=util.toDateString(data.endDate,"yyyy-MM-dd");
                }
                if (data.cycleType === '2') {
                    patOrderEdit.cycleEveryTimesReadonly = {readonly:false};
                }
                form.val('patOrderEdit_form', data);
                if (data.cycleType === '1') {  //判断是否为固定日期
                    patOrderEdit.showCycleWeekDiv = true;     //固定日期，显示复选框
                    var arr = data.cycleWeekDays.split(',');
                    $.each(arr, function(key, value) {
                        $("input[name='cycleWeekDays'][value='"+value+"']").prop("checked", true);
                    });
                    $("input[name='cycleWeekType'][value='"+data.cycleWeekType+"']").prop("checked", true);
                }
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
        success: function(res) {
            patOrderEdit.serverTime = new Date(res.ts);
        },
        done:function(data){
            if (data.isPrice === 'Y') {  //显示价格
                patOrderEdit.showPrice = true;
            }
            var openingDate = isEmpty(data.openingDate) ? '' : util.toDateString(data.openingDate,"yyyy/MM/dd");   //启用日期
            TodayInfo(openingDate);
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
            patOrderEdit.doctors=data;
            var doctorId = '';
            data.forEach(function (item, i) {
                if (item.id == baseFuncInfo.userInfoData.userid) {
                    doctorId = item.id;
                }
            })
            if (isEmpty(patOrderEdit.orderId)) {
                $('#establishUserId').val(doctorId);
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
            patOrderEdit.orderMainData = data;
            initOrderSelect(data, '', '');
        }
    });
}

/**
 * 初始化药疗分类下拉框
 */
function initOrderSubTypeSelect() {
    var data = patOrderEdit.orderSubTypeData;
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
        if(isNotEmpty(patOrderEdit.orderDictId)) {    //获取医嘱信息，给医嘱内容赋值
            if (item.orderMainId === patOrderEdit.orderDictId) {
                checkId = item.orderMainId;
                orderName = item.orderName;
                patOrderEdit.salesUnit = getSysDictName('purSalesBaseUnit', item.salesUnit);     //销售单位
                patOrderEdit.basicUnit = getSysDictName('purSalesBaseUnit', item.basicUnit);    //基本单位
                patOrderEdit.conversionRel2Sales = item.conversionRel2Sales;  //销售单位比例
                patOrderEdit.conversionRel2Basic = item.conversionRel2Basic;  //基本单位比例
                patOrderEdit.allowSplitDispense = item.allowSplitDispense;    //是否允许拆分发药
                if (item.orderType === '1') {
                    takeTotalFun();
                }
                // patOrderEdit.orderDictId = '';
                str = item.stockCount || 0;
                stockUnit = getSysDictName('purSalesBaseUnit', item.stockUnit);
                if (item.type === '1' || item.type === '2') {   //药品   耗材  显示库存
                    $('#stockCountDiv').css('display', 'block');
                }
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
    if (isNotEmpty(patOrderEdit.parentOrderId)) {
        $('#frequency').val(patOrderEdit.frequencyVal);
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
            patOrderEdit.clickOrderType = orderType;
            patOrderEdit.basicUnit = '';
            patOrderEdit.takeTotal = '';
            patOrderEdit.totalDosage = '';
            patOrderEdit.dosage = '';
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
                initTestTypeSelect();   //初始化检验类型下拉框
                patOrderEdit.disabled = {disabled: true};
                patOrderEdit.showOthers = false;
                $('#stockCountDiv').css('display', 'none');
                $('#totalDosage').val('1');
                $('#dosage').val('');
                $('#frequency').val('');
                $('#usageDays').val('');
                $('#channel').removeAttr('lay-verify');    //移除必填属性
                $('#testType').attr('lay-verify', 'required');
            } else {
                if (isEmpty(patOrderEdit.parentOrderId)) {
                    patOrderEdit.disabled = {disabled: false};
                }
                patOrderEdit.showOthers = true;
                $('#totalDosage').val('');
                $('#dosage').val('');
                $('#usageDays').val('');
                $('#testType').removeAttr('lay-verify');
                $('#testTypeDiv').css('display','none');
                $('#stockCountDiv').css('display', 'block');
                initFrequencySelect();
            }
            if (orderType === '5') {  //医嘱类别为其他， 不显示星号
                patOrderEdit.showAsterisk = false;
                patOrderEdit.readonly = {readonly: false};
                patOrderEdit.textShow = false;
                patOrderEdit.customEdit = 'N';
                $('#stockCountDiv').css('display', 'none');
                $("#orderContent").removeAttr('lay-verify');
                $("#orderContentInput").attr('lay-verify', 'required');
                $('#dosage').removeAttr('lay-verify');
                $('#frequency').removeAttr('lay-verify');
                $('#usageDays').removeAttr('lay-verify');
                $('#channel').removeAttr('lay-verify');    //移除必填属性
                $('#totalDosage').removeAttr('lay-verify');
                $('#orderDictId').val('');   //医嘱类别为其他， 手动填写医嘱内容，没有医嘱字典id，
            } else {
                patOrderEdit.showAsterisk = true;
                if (patOrderEdit.customEdit === 'N') {
                    patOrderEdit.readonly = {readonly: true};
                    patOrderEdit.textShow = true;
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
            if (patOrderEdit.customEdit === 'N') {
                initOrderSelect(patOrderEdit.orderMainData, orderType, '');
            }
            if(isNotEmpty(patOrderEdit.parentOrderId)) {
                $('#usageDays').val(patOrderEdit.usageDays);
            } else {
                if (orderType === '1' || orderType === '2') {   //药疗和诊疗的天数默认为1
                    $('#usageDays').val('1');
                    patOrderEdit.usageDays = 1;
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
            patOrderEdit.clickMedicalType = orderSubType;
            if (patOrderEdit.customEdit === 'N') {   //勾选自定义， 不用初始化医嘱内容
                initOrderSelect(patOrderEdit.orderMainData, $('#orderType').val(), orderSubType);
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
            patOrderEdit.totalDosage = '';
            patOrderEdit.dosage = '';
            // $('#usageDays').val('');
            patOrderEdit.orderMainData.forEach(function (item, i) {
                if (item.orderMainId == orderMainId) {
                    orderName = item.orderName;
                    patOrderEdit.orderName = orderName;
                    if (item.type === '1' || item.type === '2') {   //药品  耗材  显示库存
                        $('#stockCountDiv').css('display', 'block');
                    } else {
                        $('#stockCountDiv').css('display', 'none');
                    }
                    if (item.orderType === '1') {  //显示药疗分类
                        initOrderSubTypeSelect();
                        $('#orderSubTypeDiv').css('display', 'block');
                        // $('#stockCountDiv').css('display', 'block');
                        $('#takeTotal').css('display', 'block');
                        $('#basicUnit').val(getSysDictName('purSalesBaseUnit', item.basicUnit));
                        patOrderEdit.salesUnit = getSysDictName('purSalesBaseUnit', item.salesUnit);     //销售单位
                        patOrderEdit.basicUnit = getSysDictName('purSalesBaseUnit', item.basicUnit);    //基本单位
                        patOrderEdit.conversionRel2Sales = item.conversionRel2Sales;  //销售单位比例
                        patOrderEdit.conversionRel2Basic = item.conversionRel2Basic;  //基本单位比例
                        patOrderEdit.allowSplitDispense = item.allowSplitDispense;    //是否允许拆分发药
                        if (isEmpty(patOrderEdit.parentOrderId)) {
                            $('#usageDays').val('1');
                            patOrderEdit.usageDays = 1;
                        }
                        $('#basicUnit').val(getSysDictName('purSalesBaseUnit', item.basicUnit));
                    } else {
                        $('#orderSubTypeDiv').css('display', 'none');
                        // $('#stockCountDiv').css('display', 'none');
                        $('#takeTotal').css('display', 'none');
                        $('#basicUnit').val(item.unit);
                    }

                    if (item.orderType === '3') {  //判断医嘱类别是否为检验
                        $('#testTypeDiv').css('display','block');
                        initTestTypeSelect();   //初始化检验类型下拉框
                        patOrderEdit.disabled = {disabled: true};
                        patOrderEdit.showOthers = false;
                        $('#totalDosage').val('1');
                        $('#dosage').val('');
                        $('#frequency').val('');
                        $('#usageDays').val('');
                        $('#channel').removeAttr('lay-verify');    //移除必填属性
                        $('#testType').attr('lay-verify', 'required');
                    } else {
                        if (isEmpty(patOrderEdit.parentOrderId)) {
                            patOrderEdit.disabled = {disabled: false};
                        }
                        patOrderEdit.showOthers = true;
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
                    if (isEmpty(patOrderEdit.parentOrderId)) {
                        $('#frequency').val(item.frequency);
                    } else {
                        $('#frequency').val(patOrderEdit.frequencyVal);
                    }
                    patOrderEdit.dosage = item.singleDose;
                    patOrderEdit.frequency = $('#frequency').find("option:selected").attr("bizCode");
                    if (isNotEmpty(patOrderEdit.dosage) && isNotEmpty(patOrderEdit.frequency) && isNotEmpty(patOrderEdit.usageDays)) {
                        var total = patOrderEdit.dosage * parseFloat(patOrderEdit.frequency) * patOrderEdit.usageDays;
                        patOrderEdit.totalDosage = Math.ceil(total);
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
                patOrderEdit.readonly = {readonly: false};
                patOrderEdit.textShow = false;
                patOrderEdit.customEdit = 'Y';
                $("#orderContent").removeAttr('lay-verify');
                $("#orderContentInput").attr('lay-verify', 'required');
                $('#specifications').val('');
                $('#basicUnit').val('');
                $('#manufactor').val('');
                $('#salesPrice').val('');
            } else {
                patOrderEdit.readonly = {readonly: true};
                patOrderEdit.textShow = true;
                patOrderEdit.customEdit = 'N';
                $("#orderContentInput").removeAttr('lay-verify');
                $("#orderContent").attr('lay-verify', 'required');
                initOrderSelect(patOrderEdit.orderMainData, '', '');
            }
            form.render('select');
        });
    });
}

/**
 * 监听循环周期单选按钮
 */
function monitorCycleTypeRadio() {
    layui.use('form', function () {
       var form = layui.form;
        form.on('radio(cycleType)', function(data){
            var value = data.value;
           if (value === '1') {   //判断循环周期单选按钮选择的是否为固定日期
               patOrderEdit.showCycleWeekDiv = true;
           } else {
               patOrderEdit.showCycleWeekDiv = false;
           }

           if (value === '2') {
               patOrderEdit.cycleEveryTimesReadonly = {readonly:false};
               $('#cycleEveryTimes').attr('lay-verify', 'required|number');
           } else {
               patOrderEdit.cycleEveryTimesReadonly = {readonly:true};
               $('#cycleEveryTimes').removeAttr('lay-verify');
               $('#cycleEveryTimes').val('');
           }
           form.render('radio');
           form.render('checkbox');
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
            patOrderEdit.frequency = value;
            var total = patOrderEdit.dosage * value * patOrderEdit.usageDays;
            patOrderEdit.totalDosage = Math.ceil(total);
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
                patOrderEdit.dosage = value;
                if (isNotEmpty(patOrderEdit.frequency)) {
                    var total = value * parseFloat(patOrderEdit.frequency) * patOrderEdit.usageDays;
                    patOrderEdit.totalDosage = Math.ceil(total);
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
                patOrderEdit.usageDays = value;
                if (isNotEmpty(patOrderEdit.frequency)) {
                    var total = patOrderEdit.dosage * parseFloat(patOrderEdit.frequency) * value;
                    patOrderEdit.totalDosage = Math.ceil(total);
                    takeTotalFun();
                }
            }
        }
    })
}

/**
 * 计算指定启用日期距今第几周
 * @param start
 * @returns {boolean}
 * @constructor
 */
function TodayInfo(start) {
    var WEEKLEN = 7, // 一周7天为常量
        oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
        weekLeave, // 指定日期当天所在周剩余天数
        weekStart, // 指定日期start是星期几
        today, // 今天
        dateDiff, // 今天与指定日期差
        sDate;
    sDate = new Date(start.replace("-", "/"));
    weekStart = sDate.getDay();
    weekStart = weekStart === 0 ? 7 : weekStart; // JS中周日的索引为0，这里转换为7，方便计算

    weekLeave = WEEKLEN - weekStart;
    today = patOrderEdit.serverTime;
    today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
    dateDiff = today - sDate;
    if (dateDiff < 0) {
        patOrderEdit.agoToday = 0;
        return false;
    }
    dateDiff = parseInt(dateDiff / oneDay);
    var week = Math.ceil((dateDiff - weekLeave) / WEEKLEN) + 1;
    patOrderEdit.agoToday = week;
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback){
    //监听提交,先定义个隐藏的按钮
    var form=layui.form; //调用layui的form模块
    form.on('submit(patOrderEdit_submit)', function(data){
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patOrderEdit_submit").trigger('click');
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
        if(param.cycleType === '1') {  //循环周期为固定日期
            var arr_box = [];
            $('input[type=checkbox]:checked').each(function() {
                arr_box.push($(this).val());
            });
            param.cycleWeekDays = arr_box.toString();
        }
        param.patientId = patOrderEdit.patientId;
        param.category = patOrderEdit.category;
        param.customEdit = patOrderEdit.customEdit;
        if (isNotEmpty(patOrderEdit.parentOrderId)) {   //传来的父长期医嘱ID不为空 ，  则视添加子医嘱
            param.parentOrderId = patOrderEdit.parentOrderId;
            param.frequency = patOrderEdit.frequencyVal;
            param.usageDays = patOrderEdit.usageDays;
            param.channel = '';
        }

        if (isNotEmpty(param.endDate) && param.startDate > param.endDate) {
            warningToast('开始日期不能大于结束日期');
            return false;
        }

        if (patOrderEdit.clickOrderType === '5' || patOrderEdit.customEdit === 'Y'){  //医嘱类别为其他 || 自定义编辑， 获取input的医嘱内容，否则获取下拉框的医嘱内容
            param.orderContent = $('#orderContentInput').val();
        }else {
            param.orderContent = patOrderEdit.orderName;
        }
        var url = $.config.services.dialysis + "/patOrder/save.do";
        if (isNotEmpty(param.orderId)) {
            url = $.config.services.dialysis + "/patOrder/edit.do"
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



