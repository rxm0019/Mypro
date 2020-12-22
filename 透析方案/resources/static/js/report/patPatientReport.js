/**
 * 报表查询 - 患者列表
 * @Author Allen
 * @version: 1.0
 * @Date 2020/10/31
 */
var patPatientReport = avalon.define({
    $id: "patPatientReport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serverTime: new Date()
});
layui.use(['index'], function () {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();

        getPatientList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patPatientReport_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'patPatientReport_search',  //指定的lay-filter
        conds: [
            {field: 'hospitalNo', title: '中心：', type:'select', data: getHospitalOptions(), value: baseFuncInfo.userInfoData.loginHospitalNo},
            {field: 'patientName', title: '姓名：', type: 'input'},
            {field: 'mobilePhone', title: '个人手机：', type: 'input'},
            {field: 'patientRecordNo', title: '病历号：', type: 'input'},
            {field: 'customerType', title: '客户类型：', type: 'select', data: getSysDictByCode($.dictType.customerType, true)},
        ],
        done: function(filter, field) {
            getPatientList(field);
        },
        search: function (data) {
            // 重新查询Table
            layui.table.reload('patPatientReport_table', {
                where: data.field
            });
        }
    });
}

/**
 * 获取病区选项列表
 * @returns {Array}
 */
function getHospitalOptions() {
    var hospitalOptions = [];
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        dataType: "json",
        async: false,
        done: function(data) {
            if (data != null && data != "") {
                for (var i = 0;i < data.length; i++) {
                    hospitalOptions.push({value: data[i].hospitalNo, name: data[i].hospitalName});
                }
            }
        }
    });
    return hospitalOptions;
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("patPatientReport_search");
    return $.extend({
        patientName: '',
        mobilePhone: '',
        patientRecordNo: '',
        customerType: ''
    }, searchParam)
}

/**
 * 查询列表事件
 */
function getPatientList(param) {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patPatientReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPatientReport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patReport/getPatientReportList.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { fixed: 'left', field: 'hospitalName', title: '中心', minWidth: 120 },
                { fixed: 'left', field: 'patientRecordNo', title: '病历号', minWidth: 120 },
                { fixed: 'left', field: 'patientName', title: '姓名', align: 'center', minWidth: 100 },
                { field: 'gender', title: '性别', align: 'center', templet: function (row) { return getSysDictName($.dictType.sex, row.gender); } },
                {
                    field: 'patientAge', title: '年龄', align: 'center',
                    templet: function (row) {
                        var age = getUserAge(patPatientReport.serverTime, row.birthday);
                        return (age <= 0 ? "" : age);
                    }
                },
                { field: 'idCardType', title: '证件类型', align: 'center', minWidth: 100, templet: function (row) { return getSysDictName($.dictType.idCardType, row.idCardType); } },
                { field: 'idCardNo', title: '证件号码', minWidth: 180 },
                { field: 'mobilePhone', title: '个人手机', minWidth: 120 },
                { field: 'customerType', title: '客户类型', align: 'center', minWidth: 100, templet: function (row) { return getSysDictName($.dictType.customerType, row.customerType); } },
                {
                    field: 'infectionStatus', title: '感染状况', minWidth: 180,
                    templet: function (row) {
                        var infectionStatus = getSysDictName($.dictType.infectionMark, row.infectionStatus);
                        return infectionStatus.split(',').join("，");
                    }
                },
                {
                    field: 'patientTags', title: '标签', minWidth: 250,
                    templet: function (row) {
                        var patientTags = isNotEmpty(row.patientTags) ? JSON.parse(row.patientTags) : [];
                        var tagHtml = "";
                        for (var i = 0; i < patientTags.length; i++) {
                            var patientTag = patientTags[i];
                            var tagColor = getSysDictBizCode($.dictType.patientTagsColor, patientTag.tagColor);
                            tagHtml += "<span style='color: " + tagColor + "' class='patient-tag'>" + patientTag.tagContent + "</span>";
                        }
                        return tagHtml;
                    }
                },
                { field: 'principalNurseName', title: '主责护士', align: 'center', minWidth: 100 },
                {
                    field: 'lastDialysisTime', title: '最后透析日期', align: 'center', minWidth: 120,
                    templet: function (row) {
                        return isEmpty(row.lastDialysisDate) ? '' : util.toDateString(row.lastDialysisDate, "yyyy-MM-dd");
                    }
                },
                {
                    field: 'nextScheduleDate', title: '预计下次透析日期', align: 'center', minWidth: 150,
                    templet: function (row) {
                        var result = "";
                        if (isNotEmpty(row.nextScheduleDate)) {
                            var nextScheduleDate = util.toDateString(row.nextScheduleDate, "yyyy-MM-dd");
                            var nextScheduleShift = getSysDictName($.dictType.shift, row.nextScheduleShift);
                            result = nextScheduleDate + (isEmpty(nextScheduleShift) ? "" : "(" + nextScheduleShift + ")");
                        }
                        return result;
                    }
                }
            ]],
            done: function (res, curr, count) {
                patPatientReport.serverTime = new Date(res.ts);
            }
        }
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    var params = getSearchParam();
    params.patientIds = getCheckedPatientIds();

    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportPatientReportList.do",
        data: params,
        fileName: '患者列表.xlsx'
    });
}

/**
 * 获取选中的患者ID
 * @returns {Array}
 */
function getCheckedPatientIds() {
    var patientIds = [];
    var patientListCheckStatus = layui.table.checkStatus('patPatientReport_table');
    var checkedPatientList = patientListCheckStatus.data; //获取选中行的数据
    if (checkedPatientList.length > 0) {
        $.each(checkedPatientList, function (index, item) {
            patientIds.push(item.patientId);
        });
    }
    return patientIds;
}

