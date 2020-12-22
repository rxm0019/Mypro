/**
 * 今日医嘱  包括列表查询、排序、导出基础操作
 * @author anders
 * @date 2020-09-04
 * @version 1.0
 */
var todayOrderList = avalon.define({
    $id: "todayOrderList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,dialysisDate_begin: ''   //开始时间
    ,dialysisDate_end: ''   //结束时间
    ,scheduleShift: ''      //班次
    ,currentUserId: ''      //
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
        patientPhoto: ''   //头像
    }
    ,serverTime: new Date()
    ,showPatientSide: false
    ,currentDate: ''     //当前日期，打印用
    ,queryMode: '0'      //查询模式  0-明细  1-统计
    ,scheduleShiftList: []
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var laydate = layui.laydate;
        var util = layui.util;
        todayOrderList.currentDate = util.toDateString(new Date(), 'yyyy/MM/dd HH:mm:ss');

        var shiftArr = getSysDictByCode('Shift', false);  //班次   字典数据
        shiftArr.unshift({name: '全天', value: ''});               //把全天添加到班次中
        todayOrderList.scheduleShiftList = shiftArr;

        //默认设置透析日期为当天
        todayOrderList.dialysisDate_begin = util.toDateString(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        todayOrderList.dialysisDate_end = util.toDateString(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
        laydate.render({
            elem: "#dialysisDate_begin"
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
            ,done:function (value, date) {
                todayOrderList.dialysisDate_begin = isNotEmpty(value) ? (value + ' 00:00:00') : value;
            }
        });
        laydate.render({
            elem: "#dialysisDate_end"
            ,type: 'date'
            ,trigger: 'click'
            ,value: new Date()
            ,done: function (value, date) {
                todayOrderList.dialysisDate_end = isNotEmpty(value) ?  (value + ' 23:59:59') : value;
            }
        });

        todayOrderList.currentUserId = baseFuncInfo.userInfoData.userid;

        monitorQueryMode();   //查询模式监听
        getRegionId();
        monitorOrderType();
        $($('.tab-item')[1]).trigger('click');
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
    todayOrderList.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    todayOrderList.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    todayOrderList.currentPatient.patientRecordNo = dropdownItemObj.attr("data-patient-record-no");
    todayOrderList.currentPatient.gender = getSysDictName($.dictType.sex, dropdownItemObj.attr("data-gender"));
    todayOrderList.currentPatient.age = dropdownItemObj.attr("data-age");
    todayOrderList.currentPatient.patientPhoto = dropdownItemObj.attr("data-patient-photo");
    // $($('.tab-item')[1]).trigger('click');
    var orderContent = $('#orderContent').val() || '';
    var patientName = $('#patientName').val() || '';
    var orderType = $('#orderType').val() || '';
    var orderSubType = $('#orderSubType').val() || '';
    var regionId =  $("select[name='regionId']").val() || '';
    getList(orderContent, patientName, orderType, orderSubType, regionId);
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    todayOrderList.currentPatient.patientId = '';  //每次查询，清空上次点击的患者
    var patientName = $('#patientName').val();
    var param = {
        patientName: patientName,
        dialysisDateBegin: $('#dialysisDate_begin').val() || '',
        dialysisDateEnd: $('#dialysisDate_end').val() || ''
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/getTodayOrderPatientList.do",
        data: param,
        dataType: "json",
        async: false,
        success: function(res) {
            todayOrderList.serverTime = new Date(res.ts);
        },
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {
                    var age = getUserAge(todayOrderList.serverTime, item.birthday);

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
                todayOrderList.patientList.data = data;
                todayOrderList.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = todayOrderList.currentPatient.patientId;
                if (isEmpty(selectedPatientId) && todayOrderList.patientList.data.length > 0) {
                    selectedPatientId = todayOrderList.patientList.data[0].patientId;
                }
                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");

            } else {
                todayOrderList.patientList.data = [];
                todayOrderList.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            todayOrderList.patientList.data = [];
            todayOrderList.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}


/**
 * 获取区组下拉列表
 */
function getRegionId() {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaExecuteOrder/getRegionId.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var htmlStr ='<option value="">全部</option>';
            $.each(data,function(i,item){
                htmlStr+='<option value="'+item.regionSettingId+'">'+item.regionName+'</option>';
            });
            $("select[name='regionId']").html(htmlStr);
            //刷新表单渲染
            form.render();
        }
    });
}

/**
 * 搜索按钮事件
 */
function searchOrder(obj) {
    if (isNotEmpty(todayOrderList.dialysisDate_end) && todayOrderList.dialysisDate_begin > todayOrderList.dialysisDate_end) {
        warningToast('开始时间不能大于结束时间');
        return false;
    }
    var orderContent = $('#orderContent').val();
    var patientName = $('#patientName').val();
    var orderType = $('#orderType').val();
    var orderSubType = $('#orderSubType').val();
    var regionId =  $("select[name='regionId']").val();
    if (todayOrderList.queryMode === '0') {
        if (obj) {
            getPatientList();  //获取患者
        }
        getList(orderContent, patientName, orderType, orderSubType, regionId);
    } else if (todayOrderList.queryMode === '1') {
        getStatisticsList(orderContent, orderType, orderSubType, regionId);
    }
}

/**
 * 获取今日医嘱列表
 */
function getList(orderContent, patientName, orderType, orderSubType, regionSettingId) {
    var param = {
        currentUserId: todayOrderList.currentUserId,
        dialysisDate_begin: todayOrderList.dialysisDate_begin,
        dialysisDate_end: todayOrderList.dialysisDate_end,
        scheduleShift: todayOrderList.scheduleShift,
        orderContent: orderContent,
        patientName: patientName,
        orderType: orderType,
        orderSubType: orderSubType,
        regionSettingId: regionSettingId,
        patientId: todayOrderList.currentPatient.patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    todayOrderList.currentDate = util.toDateString(new Date(), 'yyyy/MM/dd HH:mm:ss');
    var height =  todayOrderList.showPatientSide ? 'full-185' : 'full-160';
    _layuiTable({
        elem: '#todayOrderList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'todayOrderList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:height, //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaExecuteOrder/getTodayOrderList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'patientRecordNo', title: '病历号', align: 'center',hide:todayOrderList.showPatientSide}
                ,{field: 'patientName', title: '姓名',hide:todayOrderList.showPatientSide, align: "center"}
                ,{field: 'bedNo', title: '床号', align: 'center',hide:todayOrderList.showPatientSide}
                ,{field: 'dialysisDate', title: '透析日期', align: 'center'
                    ,templet: function (d) {
                        return util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }}
                ,{field: 'scheduleShift', title: '班次', align: 'center'
                    ,templet:function (d) {
                        return getSysDictName('Shift', d.scheduleShift);
                    }}
                ,{field: 'orderType', title: '医嘱类型', align: 'center'
                    ,templet:function (d) {
                        return getSysDictName('OrderType', d.orderType);
                    }}
                ,{field: 'orderSubType', title: '子类型', align: 'center'
                    ,templet:function (d) {
                        return getSysDictName('MedicalTherapy', d.orderSubType);
                    }}
                ,{field: 'orderContent', title: '医嘱', align: 'center', width: 250
                    , templet: function (d) {
                        return d.orderContent;
                    }
                }
                ,{field: 'executeOrderDate', title: '执行时间', align: 'center',width:100
                    ,templet: function (d) {
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED) {
                            return '';
                        } else {
                            return util.toDateString(d.executeOrderDate, 'HH:mm');
                        }
                    }
                }
                ,{field: 'executeOrderDoctorName', title: '开嘱医生', align: 'center',width:100}
                ,{field: 'executeOrderNurseName', title: '执行护士', align: 'center',width:100
                    , templet: function (d) {
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED) {
                            return '';
                        } else {
                            return d.executeOrderNurseName;
                        }
                    }
                }
                ,{field: 'checkOrderNurseName', title: '核对护士', align: 'center',width:100
                    , templet: function (d) {
                        var html = '<div>' + d.checkOrderNurseName + '</div><div>' + util.toDateString(d.checkOrderDate, "HH:mm") + '</div>';
                        if (d.orderStatus === $.constant.orderStatus.NOT_COMMIT || d.orderStatus === $.constant.orderStatus.SUBMITTED || d.orderStatus === $.constant.orderStatus.EXECUTED) {
                            return '';
                        } else{
                            return d.checkOrderNurseName;
                        }
                    }
                }
            ]]
        }
    });
}

/**
 * 获取统计列表
 */
function getStatisticsList(orderContent, orderType, orderSubType, regionSettingId) {
    var param = {
        currentUserId: todayOrderList.currentUserId,
        dialysisDate_begin: todayOrderList.dialysisDate_begin,
        dialysisDate_end: todayOrderList.dialysisDate_end,
        scheduleShift: todayOrderList.scheduleShift,
        orderContent: orderContent,
        orderType: orderType,
        orderSubType: orderSubType,
        regionSettingId: regionSettingId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#statistics_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'statistics_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            // height:'full-120', //table的高度，页面最大高度减去差值
            page: false,
            url: $.config.services.dialysis + "/diaExecuteOrder/getStatisticsList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'regionName', title: '区间', align: 'center'}
                ,{field: 'scheduleShift', title: '班次', align: 'center', width: 100
                    ,templet:function (d) {
                        return getSysDictName('Shift', d.scheduleShift);
                    }}
                ,{field: 'type', title: '物料类别', align: 'center', width: 100
                    ,templet:function (d) {
                        return getSysDictName('materielType', d.type);
                    }}
                ,{field: 'materielName', title: '名称', align: 'center', width: 350}
                ,{field: 'specifications', title: '规格', align: 'center'}
                ,{field: 'manufactor', title: '厂家'}
                ,{field: 'totalDosage', title: '数量', align: 'center',width:100
                    , templet: function (d) {
                        if (isEmpty(d.totalDosage)) {
                            return '';
                        }
                        return d.totalDosage + getSysDictName('purSalesBaseUnit', d.basicUnit);
                    }
                }
            ]]
        }
    });
}

/**
 * 监听类型下拉
 */
function monitorOrderType() {
    layui.use('form', function() {
        var form = layui.form;
        form.on('select(orderType)', function (data) {
            var orderType = data.elem.value;
            if (orderType === '1') {  //药疗
                $('#orderSubTypeDiv').css('display', 'inline-block');
            } else {
                $('#orderSubTypeDiv').css('display', 'none');
            }
            form.render('select');
        });
    });
}

/**
 * 我的
 */
function clickMine(obj) {
    $(obj).parent().find('.tab-item').removeClass('selected');
    $(obj).addClass('selected');
    todayOrderList.currentUserId = baseFuncInfo.userInfoData.userid;
    todayOrderList.scheduleShift = '';
    searchOrder();
}

/**
 * 班次点击事件
 */
function clickScheduleShift(obj) {
    $(obj).parent().find('.tab-item').removeClass('selected');
    $(obj).addClass('selected');
    todayOrderList.currentUserId = '';
    var shiftValue = $(obj).attr('value');    //点击的班次对应的字典数据
    if (isEmpty(shiftValue)) {           //全天
        todayOrderList.scheduleShift = '';
    } else if (shiftValue === $.constant.Shift.AM) {   //上午
        todayOrderList.scheduleShift = $.constant.Shift.AM;
    } else if (shiftValue === $.constant.Shift.PM) {   //下午
        todayOrderList.scheduleShift = $.constant.Shift.PM;
    } else if (shiftValue === $.constant.Shift.NIGHT) {   //晚上
        todayOrderList.scheduleShift = $.constant.Shift.NIGHT;
    }
    searchOrder();
}

/**
 * 所有患者
 */
function allPatient(obj) {
    //先清空当前患者信息
    todayOrderList.currentPatient.patientId = '';
    todayOrderList.currentPatient.patientPhoto = '';
    todayOrderList.currentPatient.patientName = '';
    todayOrderList.currentPatient.patientRecordNo = '';
    todayOrderList.currentPatient.gender = '';
    todayOrderList.currentPatient.age = '';

    $(obj).parent().find('.tab-item').removeClass('selected');
    $(obj).addClass('selected');
    todayOrderList.showPatientSide = false;
    $('.order-layui-body').css('width', 'calc(100% - 22px)');
    $('.order-layui-body').css('left', '10px');
    $($('.tab-item')[1]).trigger('click');
}

/**
 * 单个患者
 */
function singlePatient(obj) {
    getPatientList();  //获取患者
    $(obj).parent().find('.tab-item').removeClass('selected');
    $(obj).addClass('selected');
    todayOrderList.showPatientSide = true;
    $('.order-layui-body').css('width', 'calc(100% - 200px - 10px - 22px)');
    $('.order-layui-body').css('left', 'calc(200px + 10px + 10px)');
    // $($('.tab-item')[1]).trigger('click');
    // 设置默认选中患者（若没有则默认选中第一笔）
    var selectedPatientId = todayOrderList.currentPatient.patientId;
    if (isEmpty(selectedPatientId) && todayOrderList.patientList.data.length > 0) {
        selectedPatientId = todayOrderList.patientList.data[0].patientId;
    }
    $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
}

/**
 * 查询模式监听
 */
function monitorQueryMode() {
    var form = layui.form;
    form.on('radio(queryMode)', function(data){
        var value = data.value;//被点击的radio的value值
        if (value === '0') {      //查询模式  明细
            todayOrderList.queryMode = '0';
            $($('.tab-item')[1]).trigger('click');
        } else if (value === '1') {   //查询模式  统计
            todayOrderList.queryMode = '1';

            todayOrderList.showPatientSide = false;
            todayOrderList.currentPatient.patientId = '';
            todayOrderList.currentPatient.patientPhoto = '';
            todayOrderList.currentPatient.patientName = '';
            todayOrderList.currentPatient.patientRecordNo = '';
            todayOrderList.currentPatient.gender = '';
            todayOrderList.currentPatient.age = '';
            $('.order-layui-body').css('width', 'calc(100% - 22px)');
            $('.order-layui-body').css('left', '10px');
            $($('.tab-item')[1]).trigger('click');
        }
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    var orderContent = $('#orderContent').val();
    var patientName = $('#patientName').val();
    var orderType = $('#orderType').val();
    var orderSubType = $('#orderSubType').val();
    var regionId =  $("select[name='regionId']").val();
    var param = {
        currentUserId: todayOrderList.currentUserId,
        dialysisDate_begin: todayOrderList.dialysisDate_begin,
        dialysisDate_end: todayOrderList.dialysisDate_end,
        scheduleShift: todayOrderList.scheduleShift,
        orderContent: orderContent,
        patientName: patientName,
        orderType: orderType,
        orderSubType: orderSubType,
        regionSettingId: regionId,
        patientId: todayOrderList.currentPatient.patientId
    };
    var url = $.config.services.dialysis + "/diaExecuteOrder/exportPatientOrder.do";    //导出医嘱列表
    var title = "今日医嘱列表.xlsx";
    if (todayOrderList.queryMode === '1') {  //查询模式  统计
        url =  $.config.services.dialysis + "/diaExecuteOrder/exportStatisticsOrder.do";   //导出统计医嘱列表
        title = "今日医嘱统计列表.xlsx";
    }
    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}

/**
 * 患者照片加载错误时，设置默认图片
 * @param target
 */
function onPatientPhotoError(target) {
    var gender = $(target).attr("data-gender");
    baseFuncInfo.onPatientPhotoError(target, gender);
}