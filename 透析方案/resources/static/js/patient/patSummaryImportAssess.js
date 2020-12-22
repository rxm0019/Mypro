/**
 * 患者阶段小结 - 从化验记录导入评估值
 * @author: Allen
 * @version: 1.0
 * @date: 2020/11/23
 */
var patSummaryImportAssess = avalon.define({
    $id: "patSummaryImportAssess",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者id
    assessGroupOptions: [
        { value: "renalAnemiaAssess", name: "1. 肾性贫血评估" },
        { value: "ckdMbdAssess", name: "2. CKD-MBD评估" },
        { value: "nutritionalAssess", name: "3. 营养评估" },
        { value: "bloodFatAssess", name: "4. 血脂评估" },
        { value: "bloodSugarAssess", name: "5. 血糖评估" },
        { value: "potassiumSodiumAssess", name: "6. 钾钠评估" },
        { value: "dialysisAdequacyAssess", name: "7. 透析充分性评估" },
        { value: "otherAssess", name: "8. 其他化验评估" },
        { value: "inspectAssess", name: "9. 辅助检查" },
    ]
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        patSummaryImportAssess.patientId = GetQueryString("patientId");  //接收变量
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patSummaryImportAssess_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'patSummaryImportAssess_search'  //指定的lay-filter
        , conds: [
            {field: 'applyDate', title: '申请日期：', type: 'date_range'}
        ]
        , done: function (filter, field) {
            // 查询列表
            getList({
                patientId: patSummaryImportAssess.patientId,
                applyDateBegin: field.applyDate_begin,
                applyDateEnd: field.applyDate_end
            });
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('patSummaryImportAssess_table', {
                where: {
                    patientId: patSummaryImportAssess.patientId,
                    applyDateBegin: field.applyDate_begin,
                    applyDateEnd: field.applyDate_end
                }
            });
        }
    });
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
        elem: '#patSummaryImportAssess_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patSummaryImportAssess_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-220', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patSummary/listTestApplyByPatientId.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                {
                    fixed: 'left', field: 'applyDate', title: '申请日期', width: 150, align: 'center',
                    templet: function (d) {
                        return isEmpty(d.applyDate) ? "" : util.toDateString(d.applyDate, "yyyy-MM-dd HH:mm");
                    }
                },
                {
                    field: 'checkoutNames', title: '检验项目', align: 'center',
                    templet: function (d) {
                        var checkoutNames = isEmpty(d.checkoutNames) ? [] : JSON.parse(d.checkoutNames);
                        return checkoutNames.join("，");
                    }
                },
                { field: 'userName', title: '开检医生', width: 120, align: 'center' },
                { field: 'illness', title: '病情摘要', align: 'left' },
                { field: 'purpose', title: '检验目的', align: 'left' },
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter,layer) {
        }
    });
}

/**
 * 导入评估值
 */
function onImportAssess($callback) {
    // 1. 获取表单值
    // 1.1 获取选中的评估组
    var assessGroups = [];
    $("input[name='assessGroup']").each(function() {
        if ($(this).is(":checked")) {
            assessGroups.push($(this).val());
        }
    });
    // 1.2 获取选中的化验记录
    var applyIds = [];
    var applyCheckStatus = layui.table.checkStatus('patSummaryImportAssess_table');
    var checkedApplyList = applyCheckStatus.data; // 获取选中行的数据
    if (checkedApplyList.length > 0) {
        $.each(checkedApplyList, function (index, item) {
            applyIds.push(item.applyId);
        });
    }

    // 2. 表单验证
    if (assessGroups.length == 0) {
        warningToast("请选择待导入的评估组");
        return;
    }
    if (applyIds.length == 0) {
        warningToast("请选择待导入的化验记录");
        return;
    }

    // 获取选中的申请单数据
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummary/listTestReportByPatientId.do",
        data: {
            patientId: patSummaryImportAssess.patientId,
            applyIds: applyIds
        },
        dataType: "json",
        done: function (data) {
            // 1. 获取配置公式
            var formulaObj = {};
            try {
                formulaObj = eval(data.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + formula, e);
            }

            // 2. 获取报告数据（以检查项编码为Key设置检验值）
            var reportData = {};
            if (data.reportList) {
                $.each(data.reportList, function (index, item) {
                    if (isNotEmpty(item.examineItemsNo)) {
                        // 若检查项编码不为空，则以检查项编码为Key设置检验值
                        reportData[item.examineItemsNo] = item.reportValue;
                    }
                })
            }

            // 3. 获取所有待导入的数据
            var allImportData = {};
            var summaryAssessDictItems = getSysDictByCode($.dictType.PatientSummaryAssess);
            if (reportData) {
                var formulaDictItems = [];
                $.each(summaryAssessDictItems, function (index, dictItem) {
                    var reportValue = "";
                    if (isNotEmpty(dictItem.shortName)) {
                        // 使用检查项编码（字典标签名简称）获取检查报告值
                        reportValue = reportData[dictItem.shortName];
                    } else if (isNotEmpty(dictItem.dictBizCode)) {
                        // 使用公式名称（字典业务代码）获取检查报告值：后面统一计算
                        formulaDictItems.push(dictItem);
                    }

                    // 设置至导入字段
                    reportValue = isEmpty(reportValue) ? "" : reportValue;
                    allImportData[dictItem.value] = reportValue;
                });

                // 若需要公式计算则统一用配置公式计算检查报告值
                $.each(formulaDictItems, function (index, dictItem) {
                    var formulaKey = dictItem.dictBizCode;
                    var reportValue = baseFuncInfo.getFormulaValue(formulaObj, formulaKey, allImportData);

                    // 设置至导入字段
                    reportValue = isEmpty(reportValue) ? "" : reportValue;
                    allImportData[dictItem.value] = reportValue;
                });
            }

            // 返回一个回调事件
            typeof $callback === 'function' && $callback(assessGroups, allImportData);
        }
    });
}
