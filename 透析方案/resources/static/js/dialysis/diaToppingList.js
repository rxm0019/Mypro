/*
* 今日就诊页面 js
* @author wahmh
* @date 2020-10-14
* */
var diaToppingList = avalon.define({
    $id: "diaToppingList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    scheduleShiftOptions: [], // 班次选项
    regionOptions: [], // 区组选项
    dialysisDate: "", // 透析日期（缓存上一次查询的日期）
    toppingList: [], // 就诊列表
    serverTime: new Date(), // 服务器时间
    dialysisIntervalId: -1, // 透析时钟定时器ID

    // 根据患者标签颜色Code获取患者标签颜色
    getPatientTags: function (jsonPatientTags) {
        var patientTags = isEmpty(jsonPatientTags) ? [] : JSON.parse(jsonPatientTags);
        return patientTags;
    },
    // 根据患者标签颜色Code获取患者标签颜色
    getAnticoagulantName: function (anticoagulantCode) {
        var anticoagulantName = getSysDictName($.dictType.Anticoagulant, anticoagulantCode);
        return anticoagulantName;
    },
    // 根据透析方式Code获取透析方式名称
    getDialysisModeName: function (dialysisModeCode) {
        var dialysisMode = getSysDictName($.dictType.DialysisMode, dialysisModeCode);
        return dialysisMode;
    },
    // 根据患者标签颜色Code获取患者标签颜色
    getPatientTagColor: function (tagColorCode) {
        var tagColor = getSysDictBizCode($.dictType.patientTagsColor, tagColorCode);
        return tagColor;
    },
    // 置顶
    onTopping: function (patientId) {
        onUpdateTopping(patientId, true);
    },
    // 恢复置顶
    onToppingRecovery: function (patientId) {
        onUpdateTopping(patientId, false);
    },
    // 制定医嘱
    onToMakeOrder: function (patientId, diaRecordId) {
        openDialysisLayoutPage("/dialysis/diaExecuteOrderList", patientId, diaRecordId);
    },
    // 修改处方
    onToUpdateOrder: function (patientId, diaRecordId) {
        openDialysisLayoutPage("/dialysis/diaBaseList", patientId, diaRecordId);
    },
    // 透析检测
    onToMonitor: function (patientId, diaRecordId) {
        openDialysisLayoutPage("/dialysis/diaMonitorRecordList", patientId, diaRecordId);
    }
});

layui.use(['index', 'util', 'laydate', 'formSelects'], function () {
    avalon.ready(function () {
        //初始化搜索框
        initSearch();

        // 点击“更多”按钮时，展开置顶/恢复下拉框
        $(".dialysis-topping-list").on("click", ".dialysis-topping-item .btn-more .layui-nav-item > a", function () {
            $(this).closest(".layui-nav-item").find(".layui-nav-child").toggleClass("layui-show");
        });
        $(".dialysis-topping-list").on("blur", ".dialysis-topping-item .layui-nav-item", function () {
            var target = $(this).find(".layui-nav-child");
            setTimeout(function () {
                target.removeClass("layui-show");
            }, 200);
        });

        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    // 获取班次选项
    diaToppingList.scheduleShiftOptions = getSysDictByCode($.dictType.shift, false);
    // 获取区组选项
    diaToppingList.regionOptions = getRegionOptions();
    layui.form.render('select');

    // 渲染日期表单
    layui.laydate.render({elem: '#dialysisDate', type: "date"});
    // 班次选项点击事件
    $(".schedule-shift-options").on("click", ".tab-item", function () {
        $(".schedule-shift-options .tab-item").removeClass("selected");
        $(this).addClass("selected");

        // 切换班次时重新加载列表
        getAllToppingList();
    });

    // 触发选中"全天"选项
    $(".schedule-shift-options .tab-item[data-value='']").trigger("click");
}

/**
 * 获取病区选项列表
 * @returns {Array}
 */
function getRegionOptions() {
    var wardOptions = [];
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
 * 查询列表事件
 */
function getAllToppingList() {
    // 调用前清空显示
    diaToppingList.toppingList = [];
    window.clearInterval(diaToppingList.dialysisIntervalId);
    diaToppingList.dialysisIntervalId = -1;

    // 获取查询参数
    var selectedShiftTab = $(".schedule-shift-options .tab-item.selected");
    var isTopByMe = false;
    var scheduleShift = "";
    if (selectedShiftTab) {
        var isShift = selectedShiftTab.attr("data-shift") == "true";
        var value = selectedShiftTab.attr("data-value");
        scheduleShift = (isShift ? value : ""); // 班次
        isTopByMe = (isShift ? false : true);
    }
    var searchForm = layui.form.val("diaToppingList_search");
    var param = {
        dialysisDate: searchForm.dialysisDate, // 透析日期
        topByMe: isTopByMe, // 是否查我的置顶
        keyWord: searchForm.keyWord, //搜索关键字（用户名或者病历号）
        scheduleShift: scheduleShift, // 班次
        regionSettingId: searchForm.regionSettingId // 区组
    };

    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaTopping/getAllToppingList.do",
        data: param,
        dataType: "json",
        success: function (res) {
            diaToppingList.serverTime = new Date(res.ts);
        },
        done: function (data) {
            // 回显查询的透析日期
            diaToppingList.dialysisDate = data.dialysisDate;
            layui.form.val("diaToppingList_search", {dialysisDate: data.dialysisDate});
            // 重新渲染就诊列表
            diaToppingList.toppingList = data.toppingList;
            // 开启定时刷新透析时钟
            diaToppingList.dialysisIntervalId = window.setInterval(onRefreshDialysisClock, 1000);
        }
    });
}

/**
 * 刷新透析时钟
 */
function onRefreshDialysisClock() {
    // 更新服务器时间（加1秒）
    diaToppingList.serverTime = new Date(diaToppingList.serverTime.getTime() + 1000 * 1);

    // 获取需计算透析时间的项，并更新显示透析时间状态
    var util = layui.util;
    var serverTime = diaToppingList.serverTime.getTime();
    $(".dialysis-topping-list .dialysis-topping-item.with-clock").each(function (index, item) {
        var upDate = parseInt($(item).attr("data-up-date")) || 0; // 上机时间
        var downPlanDate = parseInt($(item).attr("data-down-plan-date")) || 0; // 预计下机时间
        var dialysisTime = parseInt($(item).attr("data-dialysis-time")) || 0; // 透析时长

        if (upDate > 0 && downPlanDate > 0) {
            if (dialysisTime > 0 || serverTime > downPlanDate) {
                // 无透析时长 或者 透析时长>0 或者 服务器时间>预计下机时间，则提示“透析已结束”，并移除时钟计算
                $(item).find(".clock").html("透析已结束");
                $(item).removeClass("with-clock");
            } else if (serverTime < upDate) { // 服务器时间 < 上机时间，则提示“透析未开始”
                $(item).find(".clock").html("透析未开始");
            } else {
                // 透析剩余时长 = 预计下机时间 - 服务器时间
                var dialysisRestSecond = Math.floor((downPlanDate - serverTime) / 1000);
                var hours = Math.floor(dialysisRestSecond / 3600);
                var minutes = Math.floor((dialysisRestSecond - (hours * 3600)) / 60);
                var seconds = dialysisRestSecond - (hours * 3600) - (minutes * 60);
                var restTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                $(item).find(".clock").html(restTime);
            }
        } else {
            // 无上机时间/预计下机时间时，提示“透析未开始”，并移除时钟计算
            $(item).find(".clock").html("透析未开始");
            $(item).removeClass("with-clock");
        }
    });

    // 若无需计算透析时间的项，清空透析时钟定时器ID
    var restClockCount = $(".dialysis-topping-list .dialysis-topping-item.with-clock");
    if (restClockCount.length == 0) {
        window.clearInterval(diaToppingList.dialysisIntervalId);
        diaToppingList.dialysisIntervalId = -1;
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
 * 修改患者置顶操作
 * @param patientId
 * @param isTopping
 */
function onUpdateTopping(patientId, isTopping) {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaTopping/updateTopping.do",
        data: {
            dialysisDate: diaToppingList.dialysisDate,
            patientId: patientId,
            isTopping: isTopping
        },
        dataType: "json",
        done: function (data) {
            // 置顶成功后重新拉去数据
            getAllToppingList();
        }
    });
}

function openDialysisLayoutPage(pageHref, patientId, diaRecordId) {
    baseFuncInfo.openDialysisLayoutPage({
        pageHref: pageHref,
        patientId: patientId, // 患者ID
        diaRecordId: diaRecordId,
        query: {
            dialysisDate: diaToppingList.dialysisDate, // 透析日期
        }
    })
}

