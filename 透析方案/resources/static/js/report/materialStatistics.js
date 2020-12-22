/**
 * 耗材统计查询
 * @author anders
 * @date 2020-11-04
 * @version 1.0
 */
var materialStatistics = avalon.define({
    $id: "materialStatistics",
    baseFuncInfo: baseFuncInfo//底层基本方法
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
    ,currentDate: ''
    ,serverTime: new Date()   //服务器时间
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        materialStatistics.currentDate = layui.util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getPatientList();
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#materialStatistics_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'materialStatistics_search'  //指定的lay-filter
        ,conds:[
            {field: 'regionId', title: '病区：',type:'select', data: materialStatistics.regionList}
            ,{field: 'dialysisDate', title: '透析时间：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            form.val(filter,{
                "dialysisDate_begin":util.toDateString(new Date(),"yyyy-MM-dd"),
            });
            form.val(filter,{
                "dialysisDate_end":util.toDateString(new Date(),"yyyy-MM-dd")
            });
            getRegionId(filter, data);
        }
        ,search:function(data){
            materialStatistics.currentDate = layui.util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            field.patientId = materialStatistics.currentPatient.patientId;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('materialStatistics_table',{
                where:field
            });
        }
    });
}

/**
 * 获取区组下拉列表
 */
function getRegionId(filter,formData) {
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
            //表单重新赋值
            form.val(filter, formData);
        }
    });
}


/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    materialStatistics.currentDate = util.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss');
    var param = {
        dialysisDate_begin: $('#dialysisDate_begin').val(),
        dialysisDate_end: $('#dialysisDate_end').val(),
        patientId: materialStatistics.currentPatient.patientId,
        regionId: $('select[name="regionId"]').val() || ''
    };
    _layuiTable({
        elem: '#materialStatistics_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'materialStatistics_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-195', //table的高度，页面最大高度减去差值
            url:  $.config.services.dialysis + "/patReport/getMaterialStatistics.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'materielNo', title: '耗材编码',align:'center'}
                ,{field: 'materielName', title: '耗材名称', width: 300}
                ,{field: 'specifications', title: '规格'}
                ,{field: 'useNumber', title: '数量',width: 80, align: 'right'}
                ,{field: 'basicUnit', title: '单位', align: 'center'
                    ,templet: function (d) {
                        return getSysDictName('purSalesBaseUnit', d.basicUnit);
                    }
                }
                ,{field: 'manufactor', title: '生产厂家', width:300}
            ]]
        }
    });
}

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
    materialStatistics.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    materialStatistics.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");
    materialStatistics.currentPatient.patientRecordNo = dropdownItemObj.attr("data-patient-record-no");
    materialStatistics.currentPatient.gender = getSysDictName($.dictType.sex, dropdownItemObj.attr("data-gender"));
    materialStatistics.currentPatient.age = dropdownItemObj.attr("data-age");
    materialStatistics.currentPatient.patientPhoto = dropdownItemObj.attr("data-patient-photo");

    getList();
}

/**
 * 查询患者列表事件
 * @param field
 */
function getPatientList() {
    materialStatistics.currentPatient.patientId = '';  //每次查询，清空上次点击的患者
    var patientName = $('#patName').val();
    var param = {
        patientName: patientName
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaOutpatient/patientList.do",
        data: param,
        dataType: "json",
        success: function(res) {
            materialStatistics.serverTime = new Date(res.ts);
        },
        done: function(data) {
            if (data != null && data.length > 0) {
                $.each(data, function(index, item) {

                    var age = getUserAge(materialStatistics.serverTime, item.birthday);
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
                materialStatistics.patientList.data = data;
                materialStatistics.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = materialStatistics.currentPatient.patientId;
                if (isEmpty(selectedPatientId) && materialStatistics.patientList.data.length > 0) {
                    selectedPatientId = materialStatistics.patientList.data[0].patientId;
                }
                $(".patient-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");

            } else {
                materialStatistics.patientList.data = [];
                materialStatistics.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            materialStatistics.patientList.data = [];
            materialStatistics.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
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

/**
 * 导出耗材统计列表
 */
function exportMaterialExcel() {
    var param = {
        dialysisDate_begin: $('#dialysisDate_begin').val(),
        dialysisDate_end: $('#dialysisDate_end').val(),
        patientId: materialStatistics.currentPatient.patientId,
        regionId: $('select[name="regionId"]').val() || ''
    }

    var url = $.config.services.dialysis + "/patReport/exportMaterialExcel.do";    //导出执行医嘱列表
    var title = "耗材统计列表.xlsx";



    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}
