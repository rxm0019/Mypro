/**
 * 病程记录-导出
 * diaRecordExportWord.jsp的js文件
 */
var diaRecordExportWord = avalon.define({
    $id: "diaRecordExportWord",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serverTime: new Date(), // 服务器时间
    patientId: "", // 患者ID（传参）
    diaRecordIds: [], // 选中的透析记录ID（传参）
    title: '', // 标题
    courseRecordList: [], // 患者病程记录列表
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 获取请求参数
        diaRecordExportWord.patientId = GetQueryString("patientId");
        diaRecordExportWord.diaRecordIds = (GetQueryString("diaRecordIds") || "").split(",");

        // 获取该患者选中的病程记录列表
        getCourseRecordList();
    });
});

/**
 * 获取该患者选中的病程记录列表
 */
function getCourseRecordList() {
    var param = {
        patientId: diaRecordExportWord.patientId,
        diaRecordIds: diaRecordExportWord.diaRecordIds,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/onExportWord.do", // ajax的url必须加上getRootPath()方法
        data: param,  //必须字符串后台才能接收list,
        dataType: "json",
        success: function (res) {
            diaRecordExportWord.serverTime = new Date(res.ts);
        },
        done: function (data) {
            if (data && data.length > 0) {
                diaRecordExportWord.title = data[0].patientName + "的病程记录";

                $.each(data, function (index, item) {
                    item.genderName = getSysDictName($.dictType.sex, item.gender);
                    item.age = getUserAge(diaRecordExportWord.serverTime, item.birthday);
                    item.dialysisDate = layui.util.toDateString(item.dialysisDate, "yyyy-MM-dd");
                    item.upDate = layui.util.toDateString(item.upDate, "yyyy-MM-dd HH:mm:ss");

                    item.allergicDrugDesc = getAllergicDrugDesc(item); // 获取过敏药物描述
                    item.dialysisDiagnosisDescData = getDialysisDiagnosisDescData(item.dialysisDiagnosis); // 诊断记录
                    item.diaUnusualRecordsDescData = getUnusualRecordsDescData(item.diaUnusualRecords); // 异常情况
                });
            }
            diaRecordExportWord.courseRecordList = data;
        }
    });
}

/**
 * 更新过敏情况
 * @param data {
 *      allergicDrugStatus: "", // 过敏药物 - 状态（Y-有，N-无，U-不详）
 *      allergicDrugDetails: "", // 过敏药物 - 详情
 *      allergicHistory: "", // 过敏史
 * }
 */
function getAllergicDrugDesc(data) {
    var allergicDrugDesc = "";
    // 根据过敏药物状态、过敏药物详情显示过敏情况
    if (data.allergicDrugStatus == $.constant.AllergicDrugStatus.YES) {
        var dictAllergicDrug = getSysDictMap($.dictType.AllergicDrug); // 过敏药物字典
        var allergicDrugCodes = data.allergicDrugDetails.split(","); // 过敏药物代号数组
        var showDatas = [];
        $.each(allergicDrugCodes, function (index, item) {
            var dictItem = dictAllergicDrug[item]; // 过敏药物对应的字典项
            if (dictItem) {
                showDatas.push(dictItem.name);
            }
        });
        allergicDrugDesc = showDatas.join("，");
    } else if (data.allergicDrugStatus == $.constant.AllergicDrugStatus.NO) {
        allergicDrugDesc = "无";
    } else if (data.allergicDrugStatus == $.constant.AllergicDrugStatus.UNKNOWN) {
        allergicDrugDesc = "不详";
    }
    return allergicDrugDesc;
}

/**
 * 获取疾病诊断显示数据
 * @param dialysisDiagnosis [
 *      {
 *          diagnosisType: "", // 诊断类型
 *          icdCode: "", // ICD代码
 *          diagnoseDetailName: "", // 诊断名称
 *      },
 *      ...
 * ]
 */
function getDialysisDiagnosisDescData(diseaseDiagnosis) {
    var descDataMap = {}; // 疾病诊断显示数据Map
    var descData = []; // 疾病诊断显示数据：[ {diagnosisType: "", diagnosisTypeName: "", diagnosis: []}, ... ]
    var dictDiagnosisType = getSysDictByCode($.dictType.DiagnosisType, false);
    $.each(dictDiagnosisType, function (index, item) {
        var descDataItem = {diagnosisType: item.value, diagnosisTypeName: item.name, diagnosis: [], diagnosisDesc: ""};
        descDataMap[descDataItem.diagnosisType] = descDataItem;
        descData.push(descDataItem);
    });

    if (diseaseDiagnosis) {
        $.each(diseaseDiagnosis, function (index, item) {
            if (descDataMap[item.diagnosisType]) {
                var diagnosiDesc = (isEmpty(item.icdCode) ? "" : "(" + item.icdCode + ")") + item.diagnoseDetailName;
                var descDataItem = descDataMap[item.diagnosisType];
                descDataItem.diagnosis.push(diagnosiDesc);
                descDataItem.diagnosisDesc = descDataItem.diagnosis.join("，");
            }
        });
    }
    return descData;
}

/**
 * 获取异常情况显示数据
 * @param diaUnusualRecords
 * @returns {Array}
 */
function getUnusualRecordsDescData(diaUnusualRecords) {
    var descData = []
    if (diaUnusualRecords) {
        $.each(diaUnusualRecords, function (index, item) {
            // 病症及体征
            var unusualDetails = item.unusualDetails.split(",");
            var unusualDetailNames = [];
            $.each(unusualDetails, function (detailIndex, detailItem) {
                unusualDetailNames.push(getSysDictName($.dictType.UnusualDetails, detailItem));
            });

            descData.push({
                monitorTime: isEmpty(item.monitorTime) ? '' : layui.util.toDateString(item.monitorTime, "HH:mm"),
                unusualDetailNames: unusualDetailNames,
                handleDetails: item.handleDetails,
                handleResults: item.handleResults,
            });
        });
    }
    return descData;
}

/**
 * 导出word
 */
function onExportWord() {
    $("#exportWord").wordExport(diaRecordExportWord.title);
}
