/**
 * 患者管理 - 患者画像
 * @Author Allen
 * @version: 1.0
 * @Date 2020/09/29
 */
var evaluationGroupDatas = {
    "Hyperkalemia": [ // 高血钾
        // 电解质检查-透前钾
        {title: "K", code: "K", desc: "钾", relatedItems: [{title: "透前钾", code: "KB"}]}
    ],
    "Anemia": [ // 贫血
        {title: "HB", code: "HB", desc: "血红蛋白", relatedItems: [{title: "血红蛋白", code: "Hb"}]},
        {title: "MCV", code: "MCV", desc: "平均红细胞体积", relatedItems: [{title: "平均红细胞体积", code: "MCV"}]},
        {title: "TSAT", code: "TSAT", desc: "转铁蛋白饱和度", relatedItems: [{title: "转铁蛋白饱和度", code: "TSAT"}]},
        {title: "SF", code: "SF", desc: "血清铁蛋白", relatedItems: [{title: "血清铁蛋白", code: "SF"}]}
    ],
    "Nutrition": [ // 营养
        {title: "Alb", code: "Alb", desc: "白蛋白", relatedItems: [{title: "白蛋白", code: "Alb"}]},
        {title: "TP", code: "TP", desc: "血清总蛋白", relatedItems: [{title: "血清总蛋白", code: "TP"}]},
        {
            title: "Cr", code: "Cr", desc: "肌酐",
            relatedItems: [
                {title: "透前肌酐", code: "CrB"},
                {title: "透后肌酐", code: "CrA"}
            ]
        },
        {title: "Chol", code: "Chol", desc: "总胆固醇", relatedItems: [{title: "总胆固醇", code: "Chol"}]},
        {title: "Leptin", code: "Leptin", desc: "瘦素", relatedItems: [{title: "瘦素", code: "Leptin"}]}
    ],
    "DialysisAdequacy": [ // 透析充分性
        {
            title: "URR", code: "URR", desc: "URR",
            relatedItems: [
                {title: "透前尿素", code: "UREAB", query: true, show: false},
                {title: "透后尿素", code: "UREAA", query: true, show: false},
                {
                    title: "URR", code: "URR", query: false, show: true, formulaKey: "getUrrValue",
                    getFormulaData: function (dataItem) {
                        var formulaData = {
                            ureaB: dataItem["UREAB"], // 透前尿素
                            ureaA: dataItem["UREAA"], // 透后尿素
                        };
                        return formulaData;
                    }
                }
            ]
        },
        {
            title: "KT/V", code: "KT/V", desc: "KT/V",
            relatedItems: [
                {title: "透前尿素", code: "UREAB", query: true, show: false},
                {title: "透后尿素", code: "UREAA", query: true, show: false},
                {title: "透析时长", code: "DialysisHours", query: true, show: false},
                {title: "实际脱水量", code: "ActualDehydration", query: true, show: false},
                {title: "透后体重", code: "WeightA", query: true, show: false},
                {
                    title: "KT/V", code: "KTV", query: false, show: true, formulaKey: "getKtvValue",
                    getFormulaData: function (dataItem) {
                        var formulaData = {
                            ureaB: dataItem["UREAB"], // 透前尿素
                            ureaA: dataItem["UREAA"], // 透后尿素
                            dialysisHours: dataItem["DialysisHours"], // 透析时长
                            actualDehydration: dataItem["ActualDehydration"], // 实际脱水量
                            weightA: dataItem["WeightA"], // 透后体重
                        };
                        return formulaData;
                    }
                }
            ]
        },
        {title: "β2", code: "β2", desc: "β2微球蛋白", relatedItems: [{title: "β2微球蛋白", code: "Beta2"}]}
    ],
    "CKD-MBD": [ // CKD-MBD
        {title: "iPTH", code: "iPTH", desc: "全段甲状旁腺素", relatedItems: [{title: "全段甲状旁腺素", code: "iPTH"}]},
        {title: "Ca", code: "Ca", desc: "钙", relatedItems: [{title: "透前钙", code: "CaB"}]},
        {title: "P", code: "P", desc: "无机磷", relatedItems: [{title: "透前磷", code: "PB"}]},
        {title: "ALP", code: "ALP", desc: "碱性磷酸酶", relatedItems: [{title: "碱性磷酸酶", code: "ALP"}]}
    ],
    "Inflame": [ // 发炎
        {title: "WBC", code: "WBC", desc: "白细胞计数", relatedItems: [{title: "白细胞计数", code: "WBC"}]},
        {title: "CRP", code: "CRP", desc: "C反应蛋白", relatedItems: [{title: "C反应蛋白", code: "CRP"}]},
        {title: "SF", code: "SF", desc: "血清铁蛋白", relatedItems: [{title: "血清铁蛋白", code: "SF"}]}
    ],
    "LiverFunction": [ // 肝功能
        {title: "AST", code: "AST", desc: "天门冬氨酸氨基转移酶", relatedItems: [{title: "天门冬氨酸氨基转移酶", code: "AST"}]},
        {title: "ALT", code: "ALT", desc: "丙氨酸氨基转移酶", relatedItems: [{title: "丙氨酸氨基转移酶", code: "ALT"}]}
    ],
    "CapacityControl": [ // 容量控制
        {title: "CTR", code: "CTR", desc: "心胸比值", relatedItems: [{title: "心胸比值", code: "CTR"}]},
        {title: "干体重", code: "DryWeight", desc: "干体重", relatedItems: [{title: "干体重", code: "dryWeight"}]},
        {
            title: "透后血压", code: "AfterBloodPressure", desc: "透后血压",
            relatedItems: [
                {title: "透后血压", code: "afterBloodPressure", query: true, show: false},
                {title: "收缩压", code: "systolicPressure", query: false, show: true},
                {title: "舒张压", code: "diastolicPressure", query: false, show: true}
            ]
        }
    ],
    "BloodBlucoseControl": [ // 血糖控制
        {title: "HbA1C", code: "HbA1C", desc: "糖化血红蛋白", relatedItems: [{title: "糖化血红蛋白", code: "HbA1C", query: true, show: true}]},
        {
            title: "血糖", code: "BloodSugar", desc: "空腹血糖",
            relatedItems: [
                {title: "空腹血糖", code: "AC"},
                {title: "饭后血糖", code: "PC"}
            ]
        }
    ]
};

var patPortrait = avalon.define({
    $id: "patPortrait",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    patientId: ""
});
layui.use(['index'], function () {
    avalon.ready(function () {
        // 获取URL参数
        patPortrait.patientId = GetQueryString("patientId");
        // 初始化搜索框
        initSearch();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    // 评估项目选项
    var evaluationGroups = [
        {value: "Hyperkalemia", name: "高血钾"}, // K
        {value: "Anemia", name: "贫血"}, // HB,MCV,TSAT,SF
        {value: "Nutrition", name: "营养"}, // Alb,TP,Cr,Chol,Leptin
        {value: "DialysisAdequacy", name: "透析充分性"}, // URR,KT/V,β2
        {value: "CKD-MBD", name: "CKD-MBD"}, // iPTH,Ca,P,ALP
        {value: "Inflame", name: "发炎"}, // WBC,CRP,SF
        {value: "LiverFunction", name: "肝功能"}, // AST,ALT
        {value: "CapacityControl", name: "容量控制"}, // CTR,干体重,透后血压
        {value: "BloodBlucoseControl", name: "血糖控制"}, // HbA1C,AC,PC
    ];

    // 定义搜索回调方法
    var searchCallback = function(field) {
        // 根据选择的评估项目组，获取待显示的评估项
        var evaluationGroupData = [];
        var evaluationGroupCode = field.evaluationGroup;
        if (evaluationGroupCode in evaluationGroupDatas) {
            evaluationGroupData = evaluationGroupDatas[evaluationGroupCode];
        }
        // 切换评估项目组
        onSwitchEvaluationGroup(evaluationGroupData);
    };

    // 初始化搜索框
    _initSearch({
        elem: '#patPortrait_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'patPortrait_search',  //指定的lay-filter
        conds: [
            {field: 'evaluationGroup', title: '评估项目：', type: 'select', data: evaluationGroups, value: "Hyperkalemia"},
        ],
        done: function(filter, field){
            searchCallback(field);
        },
        search: function (data) {
            searchCallback(data.field);
        }
    });
}

/**
 * 切换评估项目组
 * @param evaluationGroupData
 */
function onSwitchEvaluationGroup(evaluationGroupData) {
    var target = $("#evaluationCharts .layui-row");
    target.empty();
    $.each(evaluationGroupData, function (index, item) {
        // 1. 添加评估项图表框
        var itemObj = $("<div>").addClass("evaluation-item").attr("data-code", item.code)
            .append("<div class=\"dis-partition-header\"><div class=\"quote\">" + item.title +"</div></div>")
            .append("<div class=\"chart-body\"></div>");
        var itemWrapperObj = $("<div>").addClass("layui-col-md6").append(itemObj);
        target.append(itemWrapperObj);

        // 2. 初始化评估项图表
        var targetItems = $("#evaluationCharts .layui-row .evaluation-item[data-code='" + item.code + "'] .chart-body");
        if (targetItems.length == 0) {
            return;
        }
        // 2.1 获取图表框元素
        var targetItem = targetItems[0];
        // 2.2 初始化图表(无数据)
        initEvaluationItemCharts(targetItem);
        // 2.3 汇总图表相关配置信息
        var queryItemCodes = []; // 待查询项编码
        var showItemCodes = []; // 待显示项编码
        var legendDatas = []; // 待显示项的图例
        var chartSeries = []; // 图表系列
        $.each(item.relatedItems, function (relatedItemIndex, relatedItem) {
            // 获取待查询项编码
            if (typeof(relatedItem.query) == "undefined" || relatedItem.query) {
                queryItemCodes.push(relatedItem.code);
            }
            // 获取待显示项编码、图例及图表配置信息
            if (typeof(relatedItem.show) == "undefined" || relatedItem.show) {
                showItemCodes.push(relatedItem.code);
                legendDatas.push(relatedItem.title);
                chartSeries.push({name: relatedItem.title, type: 'line', data: []});
            }
        });
        // 2.4 从服务器获取最近4次评估数据
        onEvaluationDatasLoad(patPortrait.patientId, queryItemCodes, showItemCodes, function (resData) {
            // 2.4.1 获取配置公式
            var formula = {};
            try {
                formula = eval(resData.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + resData.formula, e);
            }

            // 2.4.2 处理统计日期及相关评估数据
            var statisticalDates = [];
            $.each(resData.statisticalDatas, function (dataIndex, dataItem) {
                if (isNotEmpty(dataItem.statisticalDate)) {
                    statisticalDates.push(layui.util.toDateString(dataItem.statisticalDate, "yyyy-MM-dd\nHH:mm"));

                    // 获取相关项的统计值
                    $.each(item.relatedItems, function (relatedItemIndex, relatedItem) {
                        var showItemCodeIndex = showItemCodes.indexOf(relatedItem.code);
                        if (showItemCodeIndex < 0) { return true; }

                        // 获取显示项的值
                        var relatedItemValue;
                        if (relatedItem.formulaKey && typeof relatedItem.getFormulaData === 'function') {
                            // 若配置项需公式计算，则根据中心设定的公式获取计算值
                            var formulaData = relatedItem.getFormulaData(dataItem);
                            if (formula != null && typeof formula[relatedItem.formulaKey] === 'function') {
                                relatedItemValue = formula[relatedItem.formulaKey](formulaData);
                            } else {
                                console.error("公式（" + relatedItem.formulaKey + "）不存在或格式错误。");
                            }
                        } else {
                            // 否则，直接从统计数据中获取对应code值
                            relatedItemValue = isNaN(parseFloat(dataItem[relatedItem.code])) ? "" : dataItem[relatedItem.code];
                        }

                        // 显示项值放入对应的图表系列
                        chartSeries[showItemCodeIndex].data.push(relatedItemValue);
                    });
                }
            });

            // 2.4.3 处理检查项参考值
            var patientGender = resData.patientGender;
            var patientAge = resData.patientAge;
            var visualMap = null;
            if (resData.showItems) {
                $.each(resData.showItems, function (showItemIndex, showItem) {
                    var showItemCodeIndex = showItemCodes.indexOf(showItem.examineItemsNo);
                    if (showItemCodeIndex < 0) { return true; }

                    // 2.4.2.1 获取符合患者的参考值索引
                    var valueRangeIndex = 1; // 参考值默认通用
                    if (showItem.category === $.constant.examineItemCategory.WITH_SEX) {
                        // 参考值分男女：1-参考值男，2-参考值女
                        valueRangeIndex = (patientGender === $.constant.gender.FEMALE) ? 2 : 1;
                    } else if (showItem.category === $.constant.examineItemCategory.WITH_AGE) {
                        // 参考值分大人与小孩：1-参考值大人，2-参考值小孩
                        valueRangeIndex = (patientAge < 18 && patientAge > 0) ? 2 : 1;
                    } else if (showItem.category === $.constant.examineItemCategory.WITH_AGE_AND_SEX) {
                        // 参考值分大人和小孩且有男女之别：1-参考值大人（男），2-参考值大人（女），3-参考值小孩（男），4-参考值小孩（女）
                        var isChild = (patientAge < 18 && patientAge > 0);
                        if (patientGender === $.constant.gender.FEMALE) {
                            valueRangeIndex = isChild ? 4 : 2;
                        } else {
                            valueRangeIndex = isChild ? 3 : 1;
                        }
                    }

                    // 2.4.2.2 获取符合患者的参考值
                    var valueRange = {
                        normalLow: showItem["normalLow" + valueRangeIndex], // 正常低
                        normalHigh: showItem["normalHigh" + valueRangeIndex], // 正常高
                    };
                    if (valueRange.normalLow || valueRange.normalHigh) {
                        // 2.4.2.2.1 图表系列追加参考值分隔线属性
                        chartSeries[showItemCodeIndex].markLine = {
                            silent: true,
                            data: [
                                { yAxis: valueRange.normalLow },
                                { yAxis: valueRange.normalHigh },
                            ]
                        };

                        // 2.4.2.2.2 图表追加参考值区间
                        visualMap = {
                            top: 10,
                            right: 10,
                            pieces: [
                                { lte: valueRange.normalLow, color: 'rgb(255, 184, 0)' },
                                { gt: valueRange.normalLow, lte: valueRange.normalHigh, color: 'rgb(118, 192, 187)' },
                                { gt: valueRange.normalHigh, color: 'rgb(251, 123, 123)' }
                            ],
                            outOfRange: {
                                color: '#EFEFEF'
                            }
                        };
                    }
                })
            }

            // 2.4.4 重新渲染图表
            if (showItemCodes.length == 1) {
                initEvaluationItemCharts(targetItem, {
                    visualMap: visualMap,
                    xAxis: { data: statisticalDates },
                    series: chartSeries
                });
            } else {
                initEvaluationItemCharts(targetItem, {
                    legend: { data: legendDatas },
                    visualMap: visualMap,
                    xAxis: { data: statisticalDates },
                    series: chartSeries
                });
            }
        });
    });
}

/**
 * 初始化图表
 * @param targetItem
 * @param options
 */
function initEvaluationItemCharts(targetItem, options) {
    var echartObj = echarts.init(targetItem);
    echartObj.setOption($.extend({
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '30',
            left: '50',
            right: '30',
            bottom: '30'
        },
        xAxis: {
            data: []
        },
        yAxis: {
            splitLine: {
                show: false
            }
        },
        series: []
    }, options));

    // 盒子大小改变时，重设图表大小
    $(targetItem).resize(function () {
        echartObj.resize();
    });
}

/**
 * 获取最近4次评估数据
 * @param patientId
 * @param examineItemsNos
 * @param $callback
 */
function onEvaluationDatasLoad(patientId, queryItemCodes, showItemCodes, $callback) {
    var param = {
        "patientId": patientId,
        "queryItemCodes": queryItemCodes,
        "showItemCodes": showItemCodes,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patPatientInfo/getEvaluationDatas.do",
        data: param,
        dataType: "json",
        done: function (data) {
            typeof $callback === 'function' && $callback(data); //返回一个回调事件
        }
    });
}

