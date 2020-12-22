/**
 * orderQuery.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 医嘱查询
 * @Author anders
 * @version: 1.0
 * @Date 2020/10/27
 */
var orderQuery = avalon.define({
    $id: "orderQuery",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList:[]     //区名
    ,category: '0'         //默认选中长期医嘱
    ,scheduleShift: ''     //班次
    ,scheduleShiftList:  []
    ,showPatientSide: false          //默认不显示患者侧标栏
    ,patientList: {  // 患者列表
        data: [], // 患者列表数据
        errorMsg: ''
    }
    ,currentPatient: { // 当前选中患者信息
        patientId: '', // 患者ID
        patientPhoto: '', // 照片
        patientName: '', // 姓名
        patientRecordNo: '', // 病历号
        gender: '', // 性别
        age: '', // 年龄
        patientPhoto: ''  //患者头像
    }
    ,serverTime: new Date()  //服务器返回的时间
    ,currentDate: ''     //当前日期，打印用
    ,queryMode: '0'      //查询模式   0--所有患者   1--单个患者
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var laydate = layui.laydate;
        orderQuery.currentDate = layui.util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');

        var shiftArr = getSysDictByCode('Shift', false);   //班次，字典数据
        shiftArr.unshift({name: '全天', value: ''});             //把全天添加到班次中
        orderQuery.scheduleShiftList = shiftArr;

        //所有的入口事件写在这里...
        laydate.render({
            elem: "#establishDate_begin"
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
        });

        laydate.render({
            elem: "#establishDate_end"
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
        });


        getHospital();  //获取医院
        monitorOrderTypeSelect();   //类型下拉监听
        monitorQueryMode();         //查询模式监听
        monitorCategoryRadio();    //医嘱类别监听
        $($('.tab-item')[0]).trigger('click');
        avalon.scan();
    });
});

/**
 * 选中患者信息时，更新患者概览信息
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);

    // 设置患者列表项选中样式
    $(".patient-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");

    // 更新当前患者概览信息
    orderQuery.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    orderQuery.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    orderQuery.currentPatient.patientRecordNo = dropdownItemObj.attr("data-patient-record-no");
    orderQuery.currentPatient.gender = getSysDictName($.dictType.sex, dropdownItemObj.attr("data-gender"));
    orderQuery.currentPatient.age = dropdownItemObj.attr("data-age");
    orderQuery.currentPatient.patientPhoto = dropdownItemObj.attr("data-patient-photo");

    getList();
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    orderQuery.currentPatient.patientId = '';  //每次查询，清空上次点击的患者
    var patientName = $('#patName').val();
    var param = {
        patientName: patientName,
        establishDateBegin: $('#establishDate_begin').val() || '',
        establishDateEnd: $('#establishDate_end').val() || '',
        category: orderQuery.category
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/getOrderQueryPatientList.do",
        data: param,
        dataType: "json",
        async: false,
        success: function(res) {
            orderQuery.serverTime = new Date(res.ts);
        },
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {
                    var age = getUserAge(orderQuery.serverTime, item.birthday);

                    item.age = (age <= 0 ? "-" : age);
                    if ($.constant.gender.MALE === item.gender) {
                        item.sexPic = '/static/svg/male.svg';
                    } else if($.constant.gender.FEMALE === item.gender){
                        item.sexPic = '/static/svg/female.svg';
                    }
                    item.gerder = getSysDictName($.dictType.sex, item.gender);
                    var infectionStatus = getSysDictShortName("InfectionMark", item.infectionStatus);
                    item.infectionStatus = isEmpty(infectionStatus) ? [] : infectionStatus.split(",");
                });
                orderQuery.patientList.data = data;
                orderQuery.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = orderQuery.currentPatient.patientId;
                if (isEmpty(selectedPatientId) && orderQuery.patientList.data.length > 0) {
                    selectedPatientId = orderQuery.patientList.data[0].patientId;
                }
                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");

            } else {
                orderQuery.patientList.data = [];
                orderQuery.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            orderQuery.patientList.data = [];
            orderQuery.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 监听医嘱类别单选按钮
 */
function monitorCategoryRadio() {
    var form = layui.form;
    form.on('radio(category)', function(data){
        var value = data.value;//被点击的radio的value值
        orderQuery.category = value;
        if (orderQuery.queryMode === '0') {  //所有患者
            getList();
        } else if (orderQuery.queryMode === '1') {  //单个患者
            getPatientList();
        }
    });
}

/**
 * 监听查询模式单选按钮
 */
function monitorQueryMode() {
    var form = layui.form;
    form.on('radio(queryMode)', function (data) {
        var value = data.value;
        orderQuery.queryMode = value;
        if (value === '0') {   //所有患者
            //先清空当前患者信息
            orderQuery.currentPatient.patientId = '';
            orderQuery.currentPatient.patientPhoto = '';
            orderQuery.currentPatient.patientName = '';
            orderQuery.currentPatient.patientRecordNo = '';
            orderQuery.currentPatient.gender = '';
            orderQuery.currentPatient.age = '';

            orderQuery.showPatientSide = false;    //隐藏患者侧边栏

            $('.order-layui-body').css('width', 'calc(100% - 22px)');
            $('.order-layui-body').css('left', '10px');
            $($('.tab-item')[0]).trigger('click');
        } else if (value === '1') {   //单个患者
            getPatientList();
            orderQuery.showPatientSide = true;     //显示患者侧边栏

            $('.order-layui-body').css('width', 'calc(100% - 200px - 10px - 22px)');
            $('.order-layui-body').css('left', 'calc(200px + 10px + 10px)');
            // 设置默认选中患者（若没有则默认选中第一笔）
            var selectedPatientId = orderQuery.currentPatient.patientId;
            if (isEmpty(selectedPatientId) && orderQuery.patientList.data.length > 0) {
                selectedPatientId = orderQuery.patientList.data[0].patientId;
            }
            $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
        }
    })
}

/**
 * 监听类型下拉
 */
function monitorOrderTypeSelect() {
    layui.use('form', function() {
        var form = layui.form;
        form.on('select(orderType)', function (data) {
            var orderType = data.elem.value;
            if (orderType === '1' || orderType === '') {  //药疗
                $('#orderSubTypeDiv').css('display', 'inline-block');
            } else {
                $('select[name="orderSubType"]').val('');     //清空子类型下拉列表选中的值
                $('#orderSubTypeDiv').css('display', 'none');
            }
            form.render('select');
        });
    });
}

/**
 * 班次点击事件
 */
function clickScheduleShift(obj) {
    $(obj).parent().find('.tab-item').removeClass('selected');
    $(obj).addClass('selected');
    var shiftValue = $(obj).attr('value');    //点击的班次对应的字典数据
    if (isEmpty(shiftValue)) {           //全天
        orderQuery.scheduleShift = '';
    } else if (shiftValue === $.constant.Shift.AM) {   //上午
        orderQuery.scheduleShift = $.constant.Shift.AM;
    } else if (shiftValue === $.constant.Shift.PM) {   //下午
        orderQuery.scheduleShift = $.constant.Shift.PM;
    } else if (shiftValue === $.constant.Shift.NIGHT) {   //晚上
        orderQuery.scheduleShift = $.constant.Shift.NIGHT;
    }
    getList();
}

/**
 * 获取区名和区名下的医护人员下拉列表
 */
function getHospital() {
    var param = {
    }
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        async: false,
        done: function(data){
            if(data.length>0){
                orderQuery.SysHospitalList.pushArray(data);
                //清空数据，重新绑定值
                var htmlHospital ='';
                $.each(orderQuery.SysHospitalList,function(i,item){
                    htmlHospital+='<option value="'+item.hospitalNo+'">'+item.hospitalName+'</option>';
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(baseFuncInfo.userInfoData.hospitalNo);

                var form=layui.form;
                //刷新表单渲染
                form.render();
            }
        }
    });
}

/**
 * 搜索按钮点击
 */
function searchFun() {
    getPatientList();  //获取患者数据
    if (orderQuery.queryMode === '0') {  //所有患者
        getList();
    }
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    orderQuery.currentDate = layui.util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');
    var param = {
        establishDateBegin: $('#establishDate_begin').val(),
        establishDateEnd: $('#establishDate_end').val(),
        hospitalNo: $('#hospitalNo').val(),
        scheduleShift: orderQuery.scheduleShift,
        orderContent: $('#orderContent').val(),
        establishUserName: $('#establishUserName').val(),          //长期医嘱和开药处方使用的开嘱医生字段
        executeOrderDoctorName: $('#establishUserName').val(),     //执行医嘱使用的开嘱医生字段
        orderType: $('#orderType').val(),
        orderSubType: $('#orderSubType').val(),
        patientId: orderQuery.currentPatient.patientId
    };

    var height = orderQuery.queryMode === '0' ? 'full-170' : 'full-200';   //表格高度

    //定义执行医嘱列表事件
    var executeOrderTable = function() {
        _layuiTable({
            elem: '#orderQuery_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter:'orderQuery_table', ////必填，指定的lay-filter的名字
            //执行渲染table配置
            render:{
                height:height, //table的高度，页面最大高度减去差值
                url:  $.config.services.dialysis + "/patReport/getExecuteOrderList.do", // ajax的url必须加上getRootPath()方法
                where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
                cols: [[ //表头
                    {fixed: 'left',type:'checkbox'}  //开启编辑框
                    ,{field: 'patientRecordNo', title: '病历号', align: 'center', hide: orderQuery.queryMode==='1'}
                    ,{field: 'patientName', title: '姓名',align:'center', hide: orderQuery.queryMode==='1'}
                    ,{field: 'dialysisDate', title: '透析日期',align:'center'
                        ,templet: function(d){
                            if (isEmpty(d.orderStatus)) {
                                return '';
                            }
                            return util.toDateString(d.dialysisDate, 'yyyy-MM-dd');
                        }}
                    ,{field: 'submitOrderDate', title: '提交时间',align:'center',templet: function(d){
                            if (isNotEmpty(d.orderStatus) && d.orderStatus !== $.constant.orderStatus.NOT_COMMIT) {
                                return util.toDateString(d.submitOrderDate, "HH:mm");
                            }
                            return '';
                        }}
                    ,{field: 'orderType', title: '类别',align:'center'
                        ,templet: function (d) {
                            return getSysDictName('OrderType', d.orderType);
                        }
                    }
                    ,{field: 'orderContent', title: '医嘱内容',align:'left', width: 500
                        ,templet: function (d) {
                            if (isNotEmpty(d.specifications) && isNotEmpty(d.channel) && isNotEmpty(d.frequency)) {
                                return d.orderContent + '#' + d.specifications + '#' + getSysDictName('Route', d.channel) + '#' + getSysDictName('OrderFrequency', d.frequency);
                            } else {
                                return d.orderContent;
                            }
                        }
                    }
                    ,{field: 'executeOrderDoctorName', title: '医生签名',align:'center'}
                    ,{field: 'executeOrderNurseName ', title: '执行护士',align:'center'
                        ,templet: function (d) {
                            if (isNotEmpty(d.orderStatus) && d.orderStatus !== $.constant.orderStatus.NOT_COMMIT && d.orderStatus !== $.constant.orderStatus.SUBMITTED) {
                                return d.executeOrderNurseName;
                            }
                            return '';
                        }
                    }
                    ,{field: 'executeOrderDate', title: '执行时间',align:'center'
                        ,templet:function (d) {
                            if (isNotEmpty(d.orderStatus) && (d.orderStatus === $.constant.orderStatus.EXECUTED || d.orderStatus === $.constant.orderStatus.CHECKED || d.orderStatus === $.constant.orderStatus.CANCEL_CHECKED)) {
                                return util.toDateString(d.executeOrderDate, 'HH:mm');
                            }
                            return '';
                    }}
                ]]
            }
        });
    }

    //定义长期医嘱和开药处方列表事件
    var otherOrderTable = function() {
        param.category = orderQuery.category;   //医嘱类别
        _layuiTable({
            elem: '#orderQuery_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter:'orderQuery_table', ////必填，指定的lay-filter的名字
            //执行渲染table配置
            render:{
                height:height, //table的高度，页面最大高度减去差值
                url:  $.config.services.dialysis + "/patReport/getStandingOrderList.do", // ajax的url必须加上getRootPath()方法
                where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
                cols: [[ //表头
                    {fixed: 'left',type:'checkbox'}  //开启编辑框
                    ,{field: 'patientRecordNo', title: '病历号', align: 'center', hide: orderQuery.queryMode==='1'}
                    ,{field: 'patientName', title: '姓名',align:'center', hide: orderQuery.queryMode==='1'}
                    ,{field: 'orderType', title: '类别',align:'center'
                        ,templet: function (d) {
                            return getSysDictName('OrderType', d.orderType);
                        }
                    }
                    ,{field: 'orderContent', title: '医嘱内容',align:'left', width: 500
                        ,templet: function (d) {
                            if (isNotEmpty(d.specifications) && isNotEmpty(d.channel) && isNotEmpty(d.frequency)) {
                                return d.orderContent + '#' + d.specifications + '#' + getSysDictName('Route', d.channel) + '#' + getSysDictName('OrderFrequency', d.frequency);
                            } else {
                                return d.orderContent;
                            }
                        }
                    }
                    ,{field: 'totalDosage', title: '数量',align:'center'}
                    ,{field: 'basicUnit', title: '单位',align:'center'}
                    ,{field: 'dataStatus', title: '状态',align:'center'
                        ,templet:function (d) {
                            return d.dataStatus === '0' ? '在用' : '停用';
                        }
                    }
                    ,{field: 'establishDate', title: '开嘱日期',align:'center'
                        ,templet: function (d) {
                            return util.toDateString(d.establishDate, 'yyyy-MM-dd');
                        }
                    }
                    ,{field: 'establishUserName', title: '开嘱医生',align:'center'}
                ]]
            }
        });
    }

    if (orderQuery.category === '1') {
        executeOrderTable();
    } else {
        otherOrderTable();
    }
}

/**
 * 患者照片加载错误时，设置默认图片
 * @param target
 */
function onPatientPhotoError(target) {
    var gender = $(target).attr("data-gender");
    baseFuncInfo.onPatientPhotoError(target, gender);
}

/**
 * 导出医嘱查询excel
 */
function exportOrderExcel() {
    var param = {
        establishDateBegin: $('#establishDate_begin').val(),
        establishDateEnd: $('#establishDate_end').val(),
        hospitalNo: $('#hospitalNo').val(),
        scheduleShift: orderQuery.scheduleShift,
        orderContent: $('#orderContent').val(),
        establishUserName: $('#establishUserName').val(),          //长期医嘱和开药处方使用的开嘱医生字段
        executeOrderDoctorName: $('#establishUserName').val(),     //执行医嘱使用的开嘱医生字段
        orderType: $('#orderType').val(),
        orderSubType: $('#orderSubType').val(),
        patientId: orderQuery.currentPatient.patientId
    }

    var url = $.config.services.dialysis + "/patReport/exportExecuteOrderExcel.do";    //导出执行医嘱列表
    var title = "医嘱查询列表.xlsx";

    if (orderQuery.category !== '1') {   //不是执行医嘱，添加医嘱类别
        param.category = orderQuery.category;   //医嘱类别
        url =  $.config.services.dialysis + "/patReport/exportOtherOrderExcel.do";   //导出长期医嘱或开药处方
        title = "医嘱查询列表.xlsx";
    }

    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}

/**
 * 医嘱查询报表打印
 */
function printOrderWord() {
    var billTitle = '';
    if (orderQuery.category === '0') {
        billTitle = '长期医嘱打印单';
    } else if (orderQuery.category === '1') {
        billTitle = '透析医嘱打印单';
    } else if (orderQuery.category === '2') {
        billTitle = '开药处方医嘱打印单';
    }

    //获取表格中的数据
    var tableData = layui.table.cache["orderQuery_table"];

    if (tableData.length === 0) {
        warningToast('没有需要打印的数据');
        return;
    }

    var sessionKey = guid();
    sessionStorage.setItem(sessionKey, JSON.stringify(tableData));

    _layerOpen({
        url: $.config.server + "/report/orderQueryPrint?queryMode=" + orderQuery.queryMode + '&billTitle=' + billTitle + '&sessionKey=' + sessionKey + '&category=' + orderQuery.category,
        width: 750, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 842,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "医嘱打印单", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}