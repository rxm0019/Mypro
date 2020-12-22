/**
 * 报表查询 - 并发症及处理查询
 * @Author Allen
 * @version: 1.0
 * @Date 2020/10/31
 */
var diaUnusualReport = avalon.define({
    $id: "diaUnusualReport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#diaUnusualReport_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'diaUnusualReport_search',  //指定的lay-filter
        conds: [
            {field: 'hospitalNo', title: '中心：', type:'select', data: getHospitalOptions(), value: baseFuncInfo.userInfoData.loginHospitalNo},
            {field: 'patientName', title: '姓名：', type: 'input'},
            {field: 'patientRecordNo', title: '病历号：', type: 'input'},
            {field: 'dialysisDate', title: '透析日期：', type: 'date_range'},
            {field: 'unusualType', title: '并发类型：', type:'select', data: getSysDictByCode($.dictType.UnusualType, true)},
        ],
        done: function (filter, field) {
            getList(field);
        },
        search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('diaUnusualReport_table', {
                where: {
                    hospitalNo: field.hospitalNo,
                    patientName: field.patientName,
                    patientRecordNo: field.patientRecordNo,
                    dialysisDateBegin: field.dialysisDate_begin,
                    dialysisDateEnd: field.dialysisDate_end,
                    unusualType: field.unusualType,
                }
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
 * 查询列表事件
 */
function getList(param) {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaUnusualReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaUnusualReport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-110', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patReport/getUnusualReportList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                { type: 'numbers', title: '序号', width: 60 },  // 序号
                { field: 'hospitalName', title: '中心', minWidth: 120 },
                {
                    field: 'dialysisDate', title: '透析日期', align: 'center', minWidth: 120,
                    templet: function (row) {
                        return isEmpty(row.dialysisDate) ? '' : util.toDateString(row.dialysisDate, "yyyy-MM-dd");
                    }
                },
                { field: 'patientRecordNo', title: '病历号', minWidth: 120 },
                { field: 'patientName', title: '姓名', align: 'center', minWidth: 100 },
                {
                    field: 'monitorTime', title: '记录时间', align: 'center', minWidth: 90,
                    templet: function (row) {
                        return isEmpty(row.monitorTime) ? '' : util.toDateString(row.monitorTime, "HH:mm");
                    }
                },
                {
                    field: 'unusualDetails', title: '病症及体征', align: 'left', minWidth: 200,
                    templet: function (row) {
                        var unusualDetails = row.unusualDetails.split(",");
                        var html = "";
                        $.each(unusualDetails, function (index, item) {
                            html += '<div>' +
                                    '<span class="layui-badge-dot layui-bg-black"></span>' +
                                    '<span style="font-size: 14px; margin-left: 5px">'+ getSysDictName($.dictType.UnusualDetails, item) + '</span>' +
                                '</div>';
                        });
                        return html;
                    }
                },
                {
                    field: 'handleDetails', title: '处理', align: 'left', minWidth: 200,
                    templet: function (row) {
                        var handleDetails = row.handleDetails.split(",");
                        var html = "";
                        $.each(handleDetails, function (index, item) {
                            html += '<div>' +
                                '<span class="layui-badge-dot layui-bg-black"></span>' +
                                '<span style="font-size: 14px; margin-left: 5px">'+ getSysDictName($.dictType.HandleDetails, item) + '</span>' +
                                '</div>';
                        });
                        return html;
                    }
                },
                {field: 'recorder', title: '记录人', align: 'center', minWidth: 90}
            ]]
        },
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    var searchParam = layui.form.val("diaUnusualReport_search");
    var params = {
        hospitalNo: searchParam.hospitalNo,
        patientName: searchParam.patientName,
        patientRecordNo: searchParam.patientRecordNo,
        dialysisDateBegin: searchParam.dialysisDate_begin,
        dialysisDateEnd: searchParam.dialysisDate_end,
        unusualType: searchParam.unusualType,
    };

    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportUnusualReportList.do",
        data: params,
        fileName: '并发症及处理列表.xlsx'
    });
}


