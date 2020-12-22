/**
 * diaStatisticsList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var diaStatisticsList = avalon.define({
    $id: "diaStatisticsList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientStatistics: { // 患者统计项配置
        items: [ // 患者统计项
            {title: "患者总数", valueCode: "patientTotal", value: 0, css:{ backgroundColor: "#59cac3", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-patient.png)'}},
            {title: "透析人数", valueCode: "patientDialysis", value: 0, css:{ backgroundColor: "#62a5fe", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-dialysis.png)'}},
            {title: "并发症患者数", valueCode: "patientUnusual", value: 0, css:{ backgroundColor: "#ffb461", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-unusual.png)'}},
            {title: "完成宣教人数", valueCode: "patientTeach", value: 0, css:{ backgroundColor: "#89aaf4", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-edu.png)'}},
            {title: "新增患者数", valueCode: "patientIncrease", value: 0, css:{ backgroundColor: "#57deb6", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-increase.png)'}},
            {title: "转归患者数", valueCode: "patientOutIn", value: 0, css:{ backgroundColor: "#4c98fd", backgroundImage: 'url(' + $.config.server + '/static/images/icon-index-outin.png)'}},
        ]
    },
    dialysisStatistics: { // 透析流程统计项配置
        circlPath: "M 60 60 m 0 -50 a 50 50 0 1 1 0 110 a 50 50 0 1 1 0 -110", // 圆环svg路径
        circlLength: 2* 3.14 * 60, // 圆周长：2*π*r
        items: [  // 透析流程统计项
            {title: "签到", valueCode: "dialysisSign", totalValue: 0, value: 0, color: "#59CAC3"},
            {title: "接诊", valueCode: "dialysisRecept", totalValue: 0, value: 0, color: "#62A5FE"},
            {title: "评估", valueCode: "dialysisEstimate", totalValue: 0, value: 0, color: "#FFB461"},
            {title: "执行医嘱", valueCode: "dialysisExecuteOrder", totalValue: 0, value: 0, color: "#89AAF4"},
            {title: "安全查对", valueCode: "dialysisCheck", totalValue: 0, value: 0, color: "#57DEB6"},
            {title: "透析监测", valueCode: "dialysisMonitor", totalValue: 0, value: 0, color: "#4C98FD"},
            {title: "透析结束", valueCode: "dialysisFinish", totalValue: 0, value: 0, color: "#59CAC3"},
            {title: "透析总结", valueCode: "dialysisSummary", totalValue: 0, value: 0, color: "#62A5FE"},
            {title: "透析消毒", valueCode: "dialysisDisinfect", totalValue: 0, value: 0, color: "#FFB461"},
            {title: "归档", valueCode: "dialysisFiled", totalValue: 0, value: 0, color: "#59cac3"},
        ],
    },
    shiftRecord: {
        type: "ToMe", // 交班记录类型 - ToMe: @我，FromMe：我@
        toMeRecords: [],
        fromMeRecords: [],
    }
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
        elem: '#diaStatisticsList_search',
        filter: 'diaStatisticsList_search',
        conds: [
            {field: 'dialysisDate', title: '日期：', type: 'date'},
            {field: 'scheduleShift', title: '班次：', type: 'select', data: getSysDictByCode("Shift", true)},
            {field: 'regionSettingId', title: '区组：', type: 'select', data: getRegionOptions()}
        ],
        done: function(filter, data) {
            getStatisticsInfo(data.field);
        },
        search: function (data) {
            // 按条件统计
            var searchData = data.field;
            getStatisticsInfo(searchData);
        }
    });
}

/**
 * “@我”点击事件
 */
function onShiftRecordListWithToMe() {
    diaStatisticsList.shiftRecord.type = "ToMe";
    onRefreshShiftRecordList(diaStatisticsList.shiftRecord.toMeRecords);
}

/**
 * “我@”点击事件
 */
function onShiftRecordListWithFromMe() {
    diaStatisticsList.shiftRecord.type = "FromMe";
    onRefreshShiftRecordList(diaStatisticsList.shiftRecord.fromMeRecords);
}

/**
 * 获取病区选项列表
 * @returns {Array}
 */
function getRegionOptions() {
    var wardOptions = [];
    wardOptions.push({value: "", name: "全部"});
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/getRegionOptions.do",
        dataType: "json",
        async: false,
        done: function(data) {
            if (data != null && data != "") {
                for (var i = 0;i < data.length; i++) {
                    wardOptions.push({value: data[i].regionSettingId, name: data[i].wardName + data[i].regionName});
                }
            }
        }
    });
    return wardOptions;
}

/**
 * 获取首页统计信息
 * @param field
 */
function getStatisticsInfo(field) {
    // 清空页面显示
    diaStatisticsList.shiftRecord.toMeRecords = [];
    diaStatisticsList.shiftRecord.fromMeRecords = [];
    onRefreshPatientStatistics();
    onRefreshDialysisStatistics();
    // 刷新并发症统计图表
    onRefreshUnusualStatisticsCharts([]);
    onRefreshShiftRecordList([]);

    var param = isNotEmpty(field) ? field : {};
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaStatistics/getStatisticsInfo.do",
        dataType: "json",
        data: param,
        done: function(data) {
            // 更新交班记录数据
            var currentUserId = baseFuncInfo.userInfoData.userid;
            if (data.shiftRecords) {
                $.each(data.shiftRecords, function (index, item) {
                    var shiftDate = item.shiftDate || "";
                    var shiftId = item.doctorShiftId || "";
                    var shiftDoctorName = item.shiftDoctorName || "";
                    var remarks = item.remarks || "";
                    if (item.shiftDoctor == currentUserId) { // 我@：交班医生是当前登录者
                        // 接班人姓名数组转换
                        var replaceDoctorIds = (item.replaceDoctor || "").split(",");
                        var replaceDoctorUsers = isEmpty(item.replaceDoctorName) ? [] : JSON.parse(item.replaceDoctorName);
                        replaceDoctorUsers = replaceDoctorUsers.sort(function (a, b) {
                            var aIndex = replaceDoctorIds.indexOf(a.userId);
                            var bIndex = replaceDoctorIds.indexOf(b.userId);
                            return aIndex - bIndex;

                        });
                        var replaceDoctorNames = [];
                        $.each(replaceDoctorUsers, function (index, item) {
                            replaceDoctorNames.push(item.userName);
                        });

                        diaStatisticsList.shiftRecord.fromMeRecords.push({
                            shiftId: shiftId,
                            shiftDate: shiftDate,
                            shiftUserName: replaceDoctorNames.join("、"),
                            shiftContent: remarks
                        });
                    } else { // @我：接班医生包含当前登录者
                        diaStatisticsList.shiftRecord.toMeRecords.push({
                            shiftId: shiftId,
                            shiftDate: shiftDate,
                            shiftUserName: shiftDoctorName,
                            shiftContent: remarks
                        });
                    }
                })
            }

            // 更新查询的透析日期
            layui.form.val("diaStatisticsList_search", {dialysisDate: data.dialysisDate});
            // 更新患者统计项
            onRefreshPatientStatistics(data.homeStatistics);
            // 更新透析流程统计项
            onRefreshDialysisStatistics(data.homeStatistics);
            // 刷新并发症统计图表
            onRefreshUnusualStatisticsCharts(data.unusualStatistics);
            // 更新交班记录
            if (diaStatisticsList.shiftRecord.type == "ToMe") {
                onRefreshShiftRecordList(diaStatisticsList.shiftRecord.toMeRecords);
            } else {
                diaStatisticsList.shiftRecord.type = "FromMe";
                onRefreshShiftRecordList(diaStatisticsList.shiftRecord.fromMeRecords);
            }
        }
    });
}

/**
 * 更新患者统计项
 * @param homeStatistics
 */
function onRefreshPatientStatistics(homeStatistics) {
    if (homeStatistics) {
        $.each(diaStatisticsList.patientStatistics.items, function (index, item) {
            var value = homeStatistics[item.valueCode];
            item.value = (isNaN(value) ? 0 : value) || 0;
        });
    } else {
        $.each(diaStatisticsList.patientStatistics.items, function (index, item) {
            item.value = 0;
        });
    }
}

/**
 * 更新透析流程统计项
 * @param homeStatistics
 */
function onRefreshDialysisStatistics(homeStatistics) {
    if (homeStatistics) {
        // 透析流程统计项值
        var totalValue = (isNaN(homeStatistics.patientDialysis) ? 0 : homeStatistics.patientDialysis);
        $.each(diaStatisticsList.dialysisStatistics.items, function (index, item) {
            var value = homeStatistics[item.valueCode];
            item.totalValue = totalValue;
            item.value = (isNaN(value) ? 0 : value) || 0;
        });
    } else {
        $.each(diaStatisticsList.dialysisStatistics.items, function (index, item) {
            item.totalValue = 0;
            item.value = 0;
        });
    }
}

/**
 * 更新交班记录
 */
function onRefreshShiftRecordList(tableData) {
    var table = layui.table;
    var util = layui.util;
    table.render({
        elem: '#shiftRecord_table',
        height: 390,
        cols: [[
            {
                field: 'shiftDate', title: '交班日期', minWidth: 100,
                templet: function (row) {
                    console.log(row);
                    return isEmpty(row.shiftDate) ? '' : util.toDateString(row.shiftDate, "yyyy-MM-dd");
                }
            },
            { field: 'shiftUserName', title: '姓名' },
            { field: 'shiftContent', title: '交班内容', align: 'left' },
            { title: '操作', align: 'center', width: 70, toolbar: '#shiftRecord_bar' },
        ]],
        data: tableData,
        even: true
    });

    //监听行工具事件
    table.on('tool(shiftRecord_table)', function(obj) {
        var data = obj.data;
        if (isNotEmpty(data.shiftId)) {
            if (obj.event === 'detail') { // 详情
                onOpenShiftDetailWin(data.shiftId);
            }
        }
    });
}

/**
 * 打开交班详情弹窗
 * @param shiftId
 */
function onOpenShiftDetailWin(shiftId) {
    _layerOpen({
        url: $.config.server + "/dialysis/diaDoctorShiftDetail?doctorShiftId=" + shiftId,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "交班记录详情", //弹框标题
        done: function (index, iframeWin) {

        }
    });
}

/**
 * 刷新并发症统计图表
 * @param unusualStatistics
 */
function onRefreshUnusualStatisticsCharts(unusualStatistics) {
    // 获取并发症类别显示
    var unusualDict = getSysDictByCode($.dictType.UnusualType, false);
    var unusualDictNames = []; // 并发症类别名称列表
    var unusualDictValues = []; // 并发症类别Code列表
    var unusualStatisticsValues = []; // 并发症类别统计值
    $.each(unusualDict, function (index, item) {
        if (item.value) {
            // unusualDictNames.push("名字" + index);
            unusualDictNames.push(item.name);
            unusualDictValues.push(item.value);
            unusualStatisticsValues.push(0);
        }
    });
    // 更新并发症类别统计值
    if (unusualStatistics) {
        $.each(unusualStatistics, function (index, item) {
            var valueIndex = unusualDictValues.indexOf(item.statisticsType);
            if (valueIndex >= 0) {
                unusualStatisticsValues[valueIndex] = item.statisticsValue;
            }
        });
    }

    // 更新图表属性
    var echartOption = {
        xAxis: {
            data: unusualDictNames,
            splitLine: {
                show: false
            },
            axisTick: {
                alignWithLabel: true
            },
            axisLabel : {//坐标轴刻度标签的相关设置。
                interval: 0,
                formatter : function(params){
                    return stringWrap(params, 4);
                }

            }
        },
        grid: {
            top: 30,
            right: 50,
            bottom: 100,
            left: 50
        },
        yAxis: {
            minInterval: 1 // 纵轴取整
        },
        dataZoom: [
            {
                show: true,
                start: 0,
                end: 100
            }
        ],
        series: [
            {
                name: 'bar',
                type: 'bar',
                label: {show: true},
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var colorList = ['#59CAC3','#62A5FE','#FFB461','#89AAF4','#57DEB6', '#4C98FD','#59CAC3','#62A5FE','#FFB461','#59cac3'];
                            return colorList[params.dataIndex];
                        }
                    }
                },
                data: unusualStatisticsValues,
                animationDelay: function (idx) {
                    return idx * 10;
                }
            }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };

    // 更新图表
    var targetItem = document.getElementById("unusual-statistics-charts");
    var echartObj = echarts.init(targetItem);
    echartObj.setOption(echartOption);

    // 盒子大小改变时，重设图表大小
    $(targetItem).resize(function () {
        echartObj.resize();
    });
}
