/**
 * 阶段小结-打印
 * patSummaryPrint.jsp的js文件，包括查询，编辑操作
 */
var patSummaryPrint = avalon.define({
    $id: "patSummaryPrint",
    summaryId: "", // 阶段小结ID（传参）
    options: { // 选项
        assess: [ // 评估选项
            { name: "达标", value: "Y" },
            { name: "不达标", value: "N" },
        ],
    },
    serverTime: new Date(), // 服务器时间
    patPatientInfo: {}, // 患者信息
    patSummary: {}, // 阶段小结信息
});
layui.use(['index'], function() {
    avalon.ready(function () {
        // 获取请求参数
        patSummaryPrint.summaryId = GetQueryString("summaryId");

        var util = layui.util;
        getSummaryInfo(patSummaryPrint.summaryId, function (data) {
            if (data) {
                // 转换患者信息
                data.patPatientInfo.gender = getSysDictName($.dictType.sex, data.patPatientInfo.gender);
                data.patPatientInfo.birthday = getUserAge(patSummaryPrint.serverTime, data.patPatientInfo.birthday);
                data.patPatientInfo.nowTime = util.toDateString(patSummaryPrint.serverTime, "yyyy-MM-dd HH:mm:ss");
                patSummaryPrint.patPatientInfo = data.patPatientInfo;

                // 转换阶段小结信息
                var dialysisModeWithTimes = data.dialysisModeWithTimes;
                var dialysisModeTotalNum = 0;
                var dialysisModes = [];
                if (isNotEmpty(dialysisModeWithTimes)) {
                    dialysisModes = JSON.parse(dialysisModeWithTimes);
                    $.each(dialysisModes, function (i, item) {
                        var dictName = getSysDictName($.dictType.DialysisMode, item.dialysisMode);
                        if (isNotEmpty(dictName)) {
                            item.dialysisModeName = dictName;
                            dialysisModeTotalNum += Number(item.dialysisTimes) || 0;
                        }
                    });
                }
                data.summaryTitle = getSummaryTitle(data) + "阶段小结";
                data.antiMode = getSysDictName($.dictType.Anticoagulant, data.antiMode);
                data.dialysisModes = dialysisModes;
                data.dialysisModeTotalNum = dialysisModeTotalNum;
                data.createTime = isNotEmpty(data.createTime) ? util.toDateString(data.createTime, "yyyy-MM-dd") : "";
                patSummaryPrint.patSummary = data;
            } else {
                warningToast("阶段小结内容不存在");
            }
        });
    });
});

/**
 * 获取阶段小结信息
 * @param summaryId
 * @param $callback
 */
function getSummaryInfo(summaryId, $callback) {
    var param = { summaryId: summaryId };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummary/getInfo.do",
        data: param,
        dataType: "json",
        success: function(res) {
            patSummaryPrint.serverTime = new Date(res.ts);
        },
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}

/**
 * 获取阶段小结名称
 * @param data
 * @returns {string}
 */
function getSummaryTitle(data) {
    var str = data.year + "年";
    if (data.summaryType == $.constant.SummaryType.MONTH) {
        var monthDesc = ("0" + data.monthOrQuarter);
        monthDesc = monthDesc.substr(monthDesc.length - 2, 2);
        str += monthDesc + "月";
    } else {
        str += "第" + data.monthOrQuarter + "季度";
    }
    return str;
}
