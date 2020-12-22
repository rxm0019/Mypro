/**
 * 透析治疗--透析信息
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var diaBaseList = avalon.define({
    $id: "diaBaseList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    illnessTemplateType: $.constant.medicalHistoryTemplateType.ILLNESS, // 病情模板类型
    serverTime: new Date(),
    formula: {}, // 中心配置公式缓存
    formReadonly: { // 表单只读状态
        schedule: true, // 排班表单
        illness: true, // 透前病情表单（排除24小时尿量 + 病情）
        illnessPlus: true, // 透前病情-24小时尿量 + 病情
        scheme: true, // 透析处方表单
    },
    options: { // 选项
        scheduleShift: baseFuncInfo.getSysDictByCode($.dictType.shift), // 班次
        bedList: [], // 床位
        dialysisMode: baseFuncInfo.getSysDictByCode($.dictType.DialysisMode), // 透析方式
        dialyzer: baseFuncInfo.getSysDictByCode($.dictType.Dialyzer), // 透析器/血滤器
        irrigator: baseFuncInfo.getSysDictByCode($.dictType.Irrigator), // 灌流器
        anticoagulant: baseFuncInfo.getSysDictByCode($.dictType.Anticoagulant), // 抗凝剂
        anticoagulantUnit: baseFuncInfo.getSysDictByCode($.dictType.AnticoagulantUnit), // 抗凝剂
        substituteMode: baseFuncInfo.getSysDictByCode($.dictType.SubstituteMode), // 置换方式
        vascularRoads: [], // 血管通路
    },
    patientInfo: { // 患者信息
        patientId: "", // 患者ID（传参）
        diaRecordId: "", // 透析记录ID（传参）
        dialysisDate: "", // 透析日期
        patientName: "", // 姓名
        gender: "", // 性别
        age: "", // 年龄
        dialysisTimes: "", // 透析次数
        regionSettingId: "", // 区域ID
        regionName: "", // 区域名称
        allergicDrugStatus: "", // 过敏药物状态
        allergicDrugStatusName: "", // 过敏药物状态名称
        allergicDrugDetails: "", // 过敏药物代码（多笔，用逗号分隔）
        allergicDrugDetailDatas: [], // 过敏药物显示数据
        allergicHistory: "", // 过敏史
        diseaseDiagnosis: [], // 疾病诊断
        diseaseDiagnosisDatas: [], // 疾病诊断显示数据
        patientTag: [], // 患者标签
        dosageFirstUnitName: "", // 抗凝剂首剂单位
        /**
         * 透前病情更多（上一次的透析病情）
         * {
         *      dialysisMode: "", // 透析方式
         *      beforeWeight: "", // 透前体重
         *      targetDehydration: "", // 目标脱水量
         *      depositDehydration: "", // 存水
         *      illness: "", // 病情
         *      afterRealWeight: "", // 实际透后体重
         *      machineDehydration: "", // 机显脱水量
         *      relReplacementFluidTotal: "", // 实际置换液总量
         * }
         */
        lastDialysisIllness: null,
    },
});
layui.use(['index', 'formSelects'], function() {
    avalon.ready(function () {
        // 获取URL参数
        var patientId = GetQueryString("patientId");
        var diaRecordId = GetQueryString("diaRecordId");
        var readonly = GetQueryString("readonly") == "Y";

        // 更新页面参数
        diaBaseList.patientInfo.patientId = patientId;
        diaBaseList.patientInfo.diaRecordId = diaRecordId;

        // 初始化表单
        initFormVerify();
        initForm(readonly);
        // 获取透析治疗信息
        onLoadDialysisInfo();

        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 床位必填校验
        bedNumberIdRequired: function(value, item) {
            if (isEmpty(value.trim())) {
                return "床位不能为空";
            }
        },
        // 字段必填校验
        fieldRequired: function(value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name") || "";
            if (isEmpty(value.trim())) {
                return fieldName + "不能为空";
            }
        },
        // 字段数值范围校验
        fieldNotInRange: function(value, item) {
            var target = $(item);
            var fieldName = target.attr("data-field-name");
            var minValue = Number(target.attr("data-min-value")) || 0;
            var maxValue = Number(target.attr("data-max-value")) || 0;
            var isInteger = target.attr("data-integer") == "true";

            if (value.trim() === "") {
                return;
            }

            // 判断输入是否是数值
            if (isInteger) {
                if (!(/^\d+$/).test(value.trim())) {
                    return fieldName + "只能填数字，且数值为整数";
                }
            } else {
                if (!(/^\d+\.?\d{0,2}$/).test(value)) {
                    return fieldName + "只能填数字，且小数不能超过两位";
                }
            }

            // 判断输入是否是有效的数值
            if (value.trim() < minValue || value.trim() > maxValue) {
                return fieldName + "只能输入" + minValue +"~" + maxValue + "的值";
            }
        }
    });
}

/**
 * 初始化表单
 * @param readonly
 */
function initForm(readonly) {
    // 班次选项改变时，重新加载床号选项
    layui.form.on('select(scheduleShift)', function (obj) {
        var scheduleShift = obj.value;
        reloadBedNumberOption(scheduleShift, "");
    });
    // 床号选项改变时，显示区域名称
    layui.formSelects.on('bedNumberId', function (id, vals, val) {
        if (JSON.stringify(val) !== '{}') {
            diaBaseList.patientInfo.regionSettingId = val.regionSettingId;
            diaBaseList.patientInfo.regionName = val.regionName;
        }
        return true;
    });

    // 透析方式选项改变时，联动透析器/灌流器/血滤器/置换液板块，并可选择提取方案信息
    layui.form.on('select(dialysisMode)', function (obj) {
        var dialysisMode = obj.value;
        // 透析方式选项改变时，联动透析器/灌流器/血滤器/置换液板块
        onLinkageApparatus(dialysisMode);
        // 选择是否提取方案信息
        if (dialysisMode) {
            var dialysisModeName = getSysDictName($.dictType.DialysisMode, dialysisMode);
            layer.confirm('确定提取【' + dialysisModeName + '】方案信息吗？', function(index) {
                onGetDialysisScheme(dialysisMode);
            });
        }
    });

    // 血管通路选项改变时，验证不能选中同种类型的血管通路
    layui.formSelects.on('vascularAccessId', function (id, vals, val) {
        if (isNotEmpty(vals) && isNotEmpty(val)) {
            if (val.value !== vals[0].value && val.channelGroup === vals[0].channelGroup) {
                warningToast("请不要重复选择导管或穿刺");
                return false;
            }
        }
    });

    // 首推剂量的单位选项改变时，自动生成追加剂量单位
    layui.form.on('select(dosageFirstUnit)', function (obj) {
        var unitName = getSysDictBizCode($.dictType.AnticoagulantUnit, obj.value);
        diaBaseList.patientInfo.dosageFirstUnitName = unitName;
    });

    if (readonly) {
        // 若只读，则所有表单设置为只读状态
        diaBaseList.formReadonly.schedule = true; // 排班表单
        diaBaseList.formReadonly.patientTag = true; // 患者标签按钮
        diaBaseList.formReadonly.illness = true; // 透前病情表单（排除24小时尿量 + 病情）
        diaBaseList.formReadonly.illnessPlus = true; // 透前病情-24小时尿量 + 病情
        diaBaseList.formReadonly.scheme = true; // 透析处方表单
    } else {
        // 否则，根据用户权限设置表单只读状态
        var canSaveSchedule = baseFuncInfo.authorityTag('diaBaseList#saveSchedule'); // 可保存患者排班信息
        var canSaveIllness = baseFuncInfo.authorityTag('diaBaseList#saveIllness'); // 可保存透前病情
        var canSaveBase = baseFuncInfo.authorityTag('diaBaseList#saveBase'); // 可保存透析治疗信息（含排班、过敏情况、诊断、透前病情、透析处方）
        diaBaseList.formReadonly.schedule = !(canSaveSchedule || canSaveBase); // 排班表单
        diaBaseList.formReadonly.illness = !(canSaveIllness || canSaveBase); // 透前病情表单（排除24小时尿量 + 病情）
        diaBaseList.formReadonly.illnessPlus = !canSaveBase; // 透前病情-24小时尿量 + 病情
        diaBaseList.formReadonly.scheme = !canSaveBase; // 透析处方表单

        // 若可保存透析治疗信息，则还需设定父页面回调事件
        if (canSaveBase) {
            // 设定透析（简要信息）保存回调事件：可用于保存子页面操作
            if (window.parent.setSaveCallback) {
                window.parent.setSaveCallback(function () {
                    verifyForm("diaBaseSchedule_submit", function () {
                        verifyForm("diaBaseIllness_submit", function () {
                            verifyForm("diaBaseScheme_submit", function () {
                                onSaveDialysisBase();
                            });
                        });
                    });
                });
            }

            // 设置获取预计透析时长回调事件：父页面可获取预计透析时长
            if (canSaveBase && window.parent.setGetPlanDialysisTimeCallback) {
                window.parent.setGetPlanDialysisTimeCallback(function () {
                    var formData = layui.form.val("diaBaseScheme_form");
                    return { dialysisTime: formData.dialysisTime };
                });
            }
        }
    }

    // 透前病情 - 更多：鼠标移入时显示上一次的透析病情，鼠标移除时隐藏
    $("#btnIllnessMore").mouseover(function () {
        var targetOffset = $(this).offset();
        var targetHeight = $(this).height();
        var newTop = targetOffset.top + targetHeight + 10;
        var newLeft = Math.max(targetOffset.left - 700 * 0.2, 10);

        $("#lastDialysisIllness").css("top", newTop + "px");
        $("#lastDialysisIllness").css("left", newLeft + "px");
        $("#lastDialysisIllness").removeClass("layui-hide");
    });
    $("#btnIllnessMore").mouseout(function () {
        $("#lastDialysisIllness").addClass("layui-hide");
    });

    // 透析处方 - 干体重图表：鼠标移入时显示上一次的透析病情，鼠标移除时隐藏
    $("#iconDryWeightChart").mouseover(function () {
        var targetOffset = $(this).offset();
        $("#patientDryWeightChart").css("top", (targetOffset.top - 300) + "px");
        $("#patientDryWeightChart").css("left", (targetOffset.left + 50) + "px");
        $("#patientDryWeightChart").removeClass("layui-hide");
    });
    $("#iconDryWeightChart").mouseout(function () {
        $("#patientDryWeightChart").addClass("layui-hide");
    });
    // 透析处方 - 预计透析时长：改变时，重新设置预计结束时间
    // 透析时长：改变时，重新设置预计结束时间
    $(".layui-form[lay-filter='diaBaseScheme_form'] input[name='dialysisTime']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='dialysisTimeMinute']").change(function () {
        var formData = layui.form.val("diaBaseScheme_form");
        if (!isNaN(formData.dialysisTime) && !isNaN(formData.dialysisTimeMinute)) {
            var dialysisTime = Number(formData.dialysisTime) || 0;
            var dialysisTimeMinute = Number(formData.dialysisTimeMinute) || 0;
            // 根据透析时长重新计算小时数和分钟数
            var differMinute = dialysisTime * 60 + dialysisTimeMinute;
            var hours = Math.floor(differMinute / 60);
            var minutes = Math.floor(differMinute - (hours * 60));
            layui.form.val("diaBaseScheme_form", {
                dialysisTime: hours,
                dialysisTimeMinute: minutes,
            });
            debugger
            // // 重新设置预计实际结束时间
            if (window.parent.resetPlanLeaveDialysisTime) {
                window.parent.resetPlanLeaveDialysisTime(hours,minutes);
            }
        }
    });
    // 透前病情（透前体重、附加体重）、透析处方（回血量、干体重、处方脱水量）改变时，重新计算目标脱水量
    $(".layui-form[lay-filter='diaBaseIllness_form'] input[name='beforeWeight']," +
        " .layui-form[lay-filter='diaBaseIllness_form'] input[name='additionalWeight']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='bloodReturning']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='dryWeight']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='parameterDehydration']").change(function () {
        recalculateTargetDehydration();
    });
    // 透前病情（透前体重、附加体重）、透析处方（回血量、干体重、目标脱水量）改变时，重新计算存（脱水量）
    $(".layui-form[lay-filter='diaBaseIllness_form'] input[name='beforeWeight']," +
        " .layui-form[lay-filter='diaBaseIllness_form'] input[name='additionalWeight']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='bloodReturning']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='dryWeight']," +
        " .layui-form[lay-filter='diaBaseScheme_form'] input[name='targetDehydration']").change(function () {
        recalculateDepositDehydration()
    });

    // 床位：启用/禁用
    if (diaBaseList.formReadonly.schedule) {
        layui.formSelects.disabled('bedNumberId');
    } else {
        layui.formSelects.undisabled('bedNumberId');
    }

    // 血管通路：启用/禁用
    if (diaBaseList.formReadonly.scheme) {
        layui.formSelects.disabled('vascularAccessId');
    } else {
        layui.formSelects.undisabled('vascularAccessId');
    }

    // 重新渲染表单
    layui.form.render('select');
}

/**
 * 加载床号选项
 * @param scheduleShift
 * @param selectedBedNumberId 已选中的床号ID
 */
function reloadBedNumberOption(scheduleShift, selectedBedNumberId) {
    var dialysisDate = diaBaseList.patientInfo.dialysisDate;

    // 清空床号选项
    layui.formSelects.data('bedNumberId', 'local', { arr: [] });
    layui.formSelects.value('bedNumberId', [""], true);
    diaBaseList.patientInfo.regionSettingId = "";
    diaBaseList.patientInfo.regionName = "";
    // 若透析日期或排班为空，则不加载选项
    if (isEmpty(dialysisDate) || isEmpty(scheduleShift)) {  return; }

    var param = {
        "dialysisDate": dialysisDate,
        "scheduleShift": scheduleShift
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaBase/listBedNumberOption.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var bedNumberOptions = data || []; // 床号选项
            // 绑定选项：床位（追加显示感染标记、追加当前排班已排床的患者）
            $.each(bedNumberOptions, function (index, item) {
                if (isNotEmpty(item.infectionMark)) {
                    var infectionMarkDesc = getSysDictShortName($.dictType.infectionMark, item.infectionMark);
                    if (isNotEmpty(infectionMarkDesc)) {
                        item.name += " (" + infectionMarkDesc.split(",").join("，") + ")";
                    }
                }
                if (isNotEmpty(item.patientName)) {
                    item.name += " (" + item.patientName + ")";
                }
            });

            // 更新床号选项
            layui.formSelects.data('bedNumberId', 'local', { arr: bedNumberOptions });
            // 更新选中值
            layui.formSelects.value('bedNumberId', [selectedBedNumberId], true);
            // 更新区域显示
            if (isNotEmpty(selectedBedNumberId)) {
                $.each(bedNumberOptions, function (index, item) {
                    if (item.value == selectedBedNumberId) {
                        diaBaseList.patientInfo.regionSettingId = item.regionSettingId;
                        diaBaseList.patientInfo.regionName = item.regionName;
                        return true;
                    }
                });
            }
        }
    });
}

/**
 * 加载透析信息
 */
function onLoadDialysisInfo() {
    var param = {
        "diaRecordId": diaBaseList.patientInfo.diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaBase/getDialysisInfo.do",
        data: param,
        dataType: "json",
        success: function(res) {
            diaBaseList.serverTime = new Date(res.ts);
        },
        done: function (data) {
            var isFiled = data.isFiled; // 透析记录是否已归档
            var dialysisDate = data.dialysisDate; // 透析日期
            var patientSchedule = data.patientSchedule; // 透析信息 - 患者排班
            var dialysisDiagnosis = data.dialysisDiagnosis; // 透析信息 - 疾病诊断
            var dialysisBase = data.dialysisBase; // 透析信息 - 过敏情况 + 透前病情 + 透析处方
            var lastDialysisIllness = data.lastDialysisIllness; // 透析信息 - 透前病情更多（上一次的透前病情）
            var scheduleScheme = data.scheduleScheme; // 排班中设定的透析方式对应的患者透析方案
            var patientInfo = data.patientInfo; // 患者信息 - 基本信息
            var patientDisease = data.patientDisease; // 患者信息 - 过敏情况
            var patientDiagnosis = data.patientDiagnosis; // 患者信息 - 疾病诊断
            var patientTagList = data.patientTagList; // 患者信息 - 患者标签
            var vascularRoads = data.vascularRoads; // 患者信息 - 血管通路
            var lastDryWeightList = data.lastDryWeightList; // 患者信息 - 最后n次干体重调整记录
            var unSavedByDoctor = (dialysisBase == null || $.constant.YesOrNo.YES != dialysisBase.saveStatus); // 透析治疗（医生）未保存过

            // 0. 获取中心配置公式
            try {
                diaBaseList.formula = eval(data.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + data.formula, e);
            }

            // 1. 绑定选项 -- 血管通路
            layui.formSelects.data('vascularAccessId', 'local', { arr: getVascularRoadOptions(vascularRoads) });

            // 2. 更新：基本资料
            diaBaseList.patientInfo.dialysisDate = dialysisDate;
            // 2.1 更新：基本资料 - 患者基本信息
            if (patientInfo) {
                diaBaseList.patientInfo.patientName = patientInfo.patientName;
                diaBaseList.patientInfo.gender = getSysDictName($.dictType.sex, patientInfo.gender);
                diaBaseList.patientInfo.age = getUserAge(diaBaseList.serverTime, patientInfo.birthday);
                diaBaseList.patientInfo.dialysisTimes = patientInfo.dialysisTimes;
            }
            // 2.2 更新：基本资料 - 排班信息
            var selectedBedNumberId = "";
            if (patientSchedule) {
                selectedBedNumberId = patientSchedule.bedNumberId;
                layui.form.val("diaBaseSchedule_form", patientSchedule);
            }
            // 2.3 更新：基本资料 - 床号选项并选中床号
            var scheduleShift = layui.form.val("diaBaseSchedule_form").scheduleShift;
            reloadBedNumberOption(scheduleShift, selectedBedNumberId);

            // 2.3 更新：基本资料 - 过敏情况/疾病诊断：若“透析记录未归档 && 透析治疗信息未保存过 && 有保存透析处方表单的权限”，则默认带出患者过敏情况、疾病诊断；
            //     否则带出透析记录关联的过敏情况、疾病诊断
            if (!isFiled && unSavedByDoctor && !diaBaseList.formReadonly.scheme) {
                window.parent.showTabBadgeDot(true);
                // 更新：基本资料 - 过敏情况
                refreshAllergicStatus(patientDisease);
                // 更新：基本资料 - 疾病诊断
                refreshDiseaseDiagnosis(patientDiagnosis);
            } else {
                window.parent.showTabBadgeDot(false);
                // 更新：基本资料 - 过敏情况
                refreshAllergicStatus(dialysisBase);
                // 更新：基本资料 - 疾病诊断
                refreshDiseaseDiagnosis(dialysisDiagnosis);
            }
            // 2.4 更新：基本资料 - 患者标签
            refreshPatientTags(patientTagList);

            // 3. 更新：透前病情表单
            if (dialysisBase) {
                layui.form.val("diaBaseIllness_form", dialysisBase);
            }
            // 透前病情更多（上一次的透析病情）
            if (lastDialysisIllness) {
                // 标签如透析方式HDF则增加”前次实际置换液总量(L)”
                var dialysisModeBizCode = getSysDictBizCode($.dictType.DialysisMode, lastDialysisIllness.dialysisMode);
                lastDialysisIllness.isLastHdf = (dialysisModeBizCode == $.constant.DialysisMode.HDF);

                diaBaseList.patientInfo.lastDialysisIllness = lastDialysisIllness;
            }

            // 4. 更新：透析处方表单，若“透析记录未归档 && 透析治疗信息未保存过 && 有保存透析处方表单的权限”，则默认带出预设处方
            if (!isFiled && unSavedByDoctor && !diaBaseList.formReadonly.scheme) {
                // 预设透析处方默认值
                layui.form.val("diaBaseScheme_form", {
                    dialysatePrescribeSodium: 140, // 处方钠默认140
                    dryWeight: patientInfo ? patientInfo.dryWeight : "", // 干体重
                });
                // 预设透析处方
                if (scheduleScheme) {
                    // 若存在则预设使用排班中设定的透析方式对应的患者透析方案
                    layui.form.val("diaBaseScheme_form", scheduleScheme);
                    // 根据透析方式联动透析器/灌流器/血滤器/置换液板块
                    onLinkageApparatus(scheduleScheme.dialysisMode);
                    // 抗凝剂追加单位初始化
                    diaBaseList.patientInfo.dosageFirstUnitName = getSysDictBizCode($.dictType.AnticoagulantUnit, scheduleScheme.dosageFirstUnit);
                } else if (patientSchedule) {
                    // 预设患者排班中的透析方式
                    layui.form.val("diaBaseScheme_form", {dialysisMode: patientSchedule.dialysisMode});
                    // 根据透析方式联动透析器/灌流器/血滤器/置换液板块
                    onLinkageApparatus(patientSchedule.dialysisMode);
                }
                // 预设使用第一笔启用的血管通路
                $.each(vascularRoads, function (index, item) {
                    if (item.dataStatus == $.constant.DataStatus.ENABLED) {
                        layui.formSelects.value('vascularAccessId', [item.vascularRoadId], true);
                        return false;
                    }
                });
                // 重新计算目标脱水量、存（脱水量）
                recalculateTargetDehydration();
                recalculateDepositDehydration();
            } else {
                // 使用透析记录对应的透析处方绑定表单
                layui.form.val("diaBaseScheme_form", dialysisBase);
                // 血管通路选项绑值
                layui.formSelects.value('vascularAccessId', (dialysisBase.vascularAccessId || "").split(","), true);
                // 根据透析方式联动透析器/灌流器/血滤器/置换液板块
                onLinkageApparatus(dialysisBase.dialysisMode);
                // 抗凝剂追加单位初始化
                diaBaseList.patientInfo.dosageFirstUnitName = getSysDictBizCode($.dictType.AnticoagulantUnit, dialysisBase.dosageFirstUnit);
            }

            // 5. 初始化干体重历史信息图表
            initDryWeightHistoryChart(lastDryWeightList);
        }
    });
}

/**
 * 重新加载患者标签
 */
function onLoadPatientTags() {
    var param = {
        "patientId": diaBaseList.patientInfo.patientId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaBase/getPatientTag.do",
        data: param,
        dataType: "json",
        done: function (data) {
            refreshPatientTags(data);
        }
    });
}

/**
 * 获取血管通路选项
 * @param vascularRoads
 * @returns {Array}
 */
function getVascularRoadOptions(vascularRoads) {
    var vascularRoadOptions = [];
    $.each(vascularRoads, function (index, item) {
        var channelGroup = getSysDictBizCode($.dictType.ChannelType, item.vascularRoadType); // 通路种类：穿刺/导管
        var channelTypeName = getSysDictName($.dictType.ChannelType, item.vascularRoadType); // 通路类型名称
        var channelPlaceName = getSysDictName($.dictType.ChannelPlace, item.vascularRoadPlace); // 通路部位名称
        vascularRoadOptions.push({
            channelGroup: channelGroup,
            name: channelTypeName + "--" + channelPlaceName,
            value: item.vascularRoadId,
            disabled: item.dataStatus == $.constant.DataStatus.DISABLED
        });
    });
    return vascularRoadOptions;
}

/**
 * 更新患者标签
 * @param patientTags
 */
function refreshPatientTags(patientTags) {
    if (patientTags) {
        var showDatas = [];
        var dictPatientTagsColor = getSysDictMap($.dictType.patientTagsColor);
        $.each(patientTags, function (index, item) {
            var dictItem = dictPatientTagsColor[item.tagColor];
            var color = dictItem ? dictItem.dictBizCode : "rgb(251, 123, 123)";
            showDatas.push({tagName: item.tagContent, color: color});
        });
        diaBaseList.patientInfo.patientTag = showDatas;
    }
}

/**
 * 更新过敏情况
 * @param data {
 *      allergicDrugStatus: "", // 过敏药物 - 状态（Y-有，N-无，U-不详）
 *      allergicDrugDetails: "", // 过敏药物 - 详情
 *      allergicHistory: "", // 过敏史
 * }
 */
function refreshAllergicStatus(data) {
    // 缓存过敏情况相关信息
    diaBaseList.patientInfo.allergicDrugStatus = data ? data.allergicDrugStatus : "";
    diaBaseList.patientInfo.allergicDrugDetails = data ? data.allergicDrugDetails : "";
    diaBaseList.patientInfo.allergicHistory = data ? data.allergicHistory : "";

    // 根据过敏药物状态、过敏药物详情显示过敏药物标签
    if (diaBaseList.patientInfo.allergicDrugStatus == $.constant.AllergicDrugStatus.YES) {
        var dictAllergicDrug = getSysDictMap($.dictType.AllergicDrug); // 过敏药物字典
        var allergicDrugCodes = diaBaseList.patientInfo.allergicDrugDetails.split(","); // 过敏药物代号数组
        var showDatas = [];
        $.each(allergicDrugCodes, function (index, item) {
            var dictItem = dictAllergicDrug[item]; // 过敏药物对应的字典项
            if (dictItem) {
                showDatas.push({
                    shortName: dictItem.shortName || "过", // 标记简称
                    color: dictItem.dictBizCode || "rgb(251, 123, 123)", // 标记颜色
                    allergyName: dictItem.name || "" // 过敏药物名称
                });
            }
        });

        diaBaseList.patientInfo.allergicDrugStatusName = "";
        diaBaseList.patientInfo.allergicDrugDetailDatas = showDatas;
    } else if (diaBaseList.patientInfo.allergicDrugStatus == $.constant.AllergicDrugStatus.NO) {
        diaBaseList.patientInfo.allergicDrugStatusName = "无";
    } else if (diaBaseList.patientInfo.allergicDrugStatus == $.constant.AllergicDrugStatus.UNKNOWN) {
        diaBaseList.patientInfo.allergicDrugStatusName = "不详";
    }
}

/**
 * 更新疾病诊断
 * @param dialysisDiagnosis [
 *      {
 *          diagnosisType: "", // 诊断类型
 *          icdCode: "", // ICD代码
 *          diagnoseDetailName: "", // 诊断名称
 *      },
 *      ...
 * ]
 */
function refreshDiseaseDiagnosis(diseaseDiagnosis) {
    // 建立诊断类型分组Map
    var descDataMap = {}; // 疾病诊断显示数据Map
    var descData = []; // 疾病诊断显示数据：[ {diagnosisType: "", diagnosisTypeName: "", diagnosis: []}, ... ]
    var dictDiagnosisType = getSysDictByCode($.dictType.DiagnosisType, false);
    $.each(dictDiagnosisType, function (index, item) {
        var descDataItem = {diagnosisType: item.value, shortName: item.shortName, color: item.dictBizCode, diagnosis: []};
        descDataMap[descDataItem.diagnosisType] = descDataItem;
        descData.push(descDataItem);
    });

    // 将诊断数据按诊断类型分组存放
    if (diseaseDiagnosis) {
        var saveDatas = [];
        $.each(diseaseDiagnosis, function (index, item) {
            if (descDataMap[item.diagnosisType]) {
                var descDataItem = descDataMap[item.diagnosisType];
                saveDatas.push({diagnosisItemNo: item.diagnosisItemNo, diagnosisType: item.diagnosisType});
                descDataItem.diagnosis.push({
                    shortName: descDataItem.shortName,
                    color: descDataItem.color,
                    icdCode: item.icdCode,
                    diagnoseDetailName: item.diagnoseDetailName
                });
            }
        });
        diaBaseList.patientInfo.diseaseDiagnosis = saveDatas;
    }

    // 汇总诊断数据
    var result = [];
    $.each(descData, function (index, item) {
        result = result.concat(item.diagnosis);
    });
    diaBaseList.patientInfo.diseaseDiagnosisDatas = result;
}

/**
 * 病情- 提取模板
 */
function onImportIllnessTemplate() {
    baseFuncInfo.onImportFromContentTemplate("提取模板", diaBaseList.illnessTemplateType, function (data) {
        layui.form.val("diaBaseIllness_form", {illness: data.templateContent});
        successToast("导入成功");
    });
}

/**
 * 病情- 保存模板
 */
function onSaveIllnessTemplate() {
    var illnessContent = layui.form.val("diaBaseIllness_form").illness;
    if (isEmpty(illnessContent)) {
        return warningToast("请填写病情内容");
    } else {
        baseFuncInfo.onExportContentTemplate("保存模板", diaBaseList.illnessTemplateType, illnessContent, function (templateConten) {
            successToast("保存成功");
        });
    }
}

/**
 * 验证表单
 * @param $callback
 */
function verifyForm(submitFilter, $callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; // 调用layui的form模块
    form.on('submit(' + submitFilter + ')', function(data) {
        // 通过表单验证后
        var field = data.field; // 获取提交的字段
        typeof $callback === 'function' && $callback(field); // 返回一个回调事件
    });
    $("[lay-submit][lay-filter='" + submitFilter + "']").trigger('click');
}

/**
 * 患者标签维护
 */
function onPatientTagMaintain() {
    _layerOpen({
        openInParent: true, //是否在父窗口打开弹窗，默认false
        url: $.config.server + "/dialysis/diaBaseEdit?patientId=" + diaBaseList.patientInfo.patientId,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "患者标签", //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                    onLoadPatientTags();
                }
            );
        }
    });
}

/**
 * 更新干体重
 */
function onUpdateDryWeight() {
    var dryWeight = layui.form.val("diaBaseScheme_form").dryWeight;
    var url = $.config.server + "/dialysis/diaUpdateDryWeight?dryWeight=" + dryWeight + "&patientId=" + diaBaseList.patientInfo.patientId;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true, //是否在父窗口打开弹窗，默认false
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 300,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "调整干体重", //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("调整成功");
                    layer.close(index); // 如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 保存患者排班信息
 */
function onSaveDialysisSchedule() {
    verifyForm("diaBaseSchedule_submit", function () {
        var scheduleFormData = layui.form.val("diaBaseSchedule_form");
        var scheduleEdit = {
            diaRecordId: diaBaseList.patientInfo.diaRecordId,
            scheduleShift: scheduleFormData.scheduleShift,
            regionSettingId: diaBaseList.patientInfo.regionSettingId,
            bedNumberId: scheduleFormData.bedNumberId,
        };

        _ajax({
            type: "POST",
            url: $.config.services.dialysis + '/diaBase/saveDialysisSchedule.do',
            data:JSON.stringify(scheduleEdit),
            dataType: "json",
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            done: function(data) {
                successToast("保存患者排班成功");
            }
        });
    });
}

/**
 * 保存透前病情（排除24小时尿量+病情）
 */
function onSaveDialysisIllness() {
    verifyForm("diaBaseIllness_submit", function () {
        var illnessFormData = layui.form.val("diaBaseIllness_form");
        var illnessEdit = $.extend({
            diaRecordId: diaBaseList.patientInfo.diaRecordId,
        }, illnessFormData);

        _ajax({
            type: "POST",
            url: $.config.services.dialysis + '/diaBase/saveDialysisIllness.do',
            data:JSON.stringify(illnessEdit),
            dataType: "json",
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            done: function(data) {
                successToast("保存透前病情成功");
            }
        });
    });
}

/**
 * 保存透析治疗信息（含排班、过敏情况、诊断、透前病情、透析处方）
 */
function onSaveDialysisBase() {
    var scheduleFormData = layui.form.val("diaBaseSchedule_form");
    var illnessFormData = layui.form.val("diaBaseIllness_form");
    var schemeFormData = layui.form.val("diaBaseScheme_form");
    var baseEdit = {
        diaRecordId: diaBaseList.patientInfo.diaRecordId, // 透析记录ID
        allergicDrugDetails: { // 过敏情况和诊断
            allergicDrugDetails: diaBaseList.patientInfo.allergicDrugDetails, // 过敏药物
            allergicDrugStatus: diaBaseList.patientInfo.allergicDrugStatus, // 过敏药物状态
            allergicHistory: diaBaseList.patientInfo.allergicHistory, // 过敏史
            diseaseDiagnosisList: diaBaseList.patientInfo.diseaseDiagnosis, // 疾病诊断记录
        },
        dialysisSchedule: { // 排班信息
            diaRecordId: diaBaseList.patientInfo.diaRecordId,
            scheduleShift: scheduleFormData.scheduleShift,
            regionSettingId: diaBaseList.patientInfo.regionSettingId,
            bedNumberId: scheduleFormData.bedNumberId,
        },
        dialysisIllness: $.extend({ // 透前病情
            diaRecordId: diaBaseList.patientInfo.diaRecordId,
        }, illnessFormData),
        dialysisScheme: schemeFormData // 透析处方
    };

    _ajax({
        type: "POST",
        url: $.config.services.dialysis + '/diaBase/saveDialysisBase.do',
        data:JSON.stringify(baseEdit),
        dataType: "json",
        contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
        done: function(data) {
            successToast("保存成功");

            // 刷新透析记录状态（单笔）
            if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }

            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    });
}

/**
 * 提取透析方案
 * @param dialysisMode
 */
function onGetDialysisScheme(dialysisMode) {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + '/diaBase/getDialysisScheme.do',
        data: {
            patientId: diaBaseList.patientInfo.patientId,
            dialysisMode: dialysisMode,
        },
        dataType: "json",
        done: function(data) {
            if (data) {
                layui.form.val("diaBaseScheme_form", data);

                // 透析处方 - 预计透析时长：改变时，重新设置预计结束时间
                var schemeForm = layui.form.val("diaBaseScheme_form");
                if (window.parent.resetDownPlanDateByDialysisTime) {
                    window.parent.resetDownPlanDateByDialysisTime(schemeForm.dialysisTime);
                }
            } else {
                warningToast("暂无可用的透析方案");
            }
        }
    });
}

/**
 * 透析方式与透析器/灌流器/血滤器有联动效果，联动规则如下：
 * 1) HD，透析器可填写，隐藏灌流器、血滤器、置换液板块；
 * 2) 选择HDF，透析器可填写，隐藏灌流器、血滤器；
 * 3) 选择HD+HP，透析器和灌流器可填写，隐藏血滤器、置换液板块，
 * 4) 选择HP，灌流器可填写，隐藏透析器、血滤器，
 * 5) HF，血滤器可填写，隐藏透析器、灌流器。
 */
function onLinkageApparatus(dialysisMode) {
    var isFormItemShow = {
        dialyzer: true, // 透析器
        irrigator: true, // 灌流器
        filter: true, // 血滤器
        replacement: true, // 置换液板块
    };
    var dialysisModeBizCode = getSysDictBizCode($.dictType.DialysisMode, dialysisMode);
    if (dialysisModeBizCode == $.constant.DialysisMode.HD) {
        // HD、高通量HD，透析器可填写，隐藏灌流器、血滤器、置换液板块；
        isFormItemShow.irrigator = false;
        isFormItemShow.filter = false;
        isFormItemShow.replacement = false;
    } else if (dialysisModeBizCode == $.constant.DialysisMode.HDF) {
        // 选择HDF，透析器可填写，隐藏灌流器、血滤器；
        isFormItemShow.irrigator = false;
        isFormItemShow.filter = false;
    } else if (dialysisModeBizCode == $.constant.DialysisMode.HDHP) {
        // 选择HD+HP，透析器和灌流器可填写，隐藏血滤器、置换液板块，
        isFormItemShow.filter = false;
        isFormItemShow.replacement = false;
    } else if (dialysisModeBizCode == $.constant.DialysisMode.HP) {
        // 选择HP，灌流器可填写，隐藏透析器、血滤器，
        isFormItemShow.dialyzer = false;
        isFormItemShow.filter = false;
    } else if (dialysisModeBizCode == $.constant.DialysisMode.HF) {
        // HF，血滤器可填写，隐藏透析器、灌流器。
        isFormItemShow.dialyzer = false;
        isFormItemShow.irrigator = false;
    }

    var schemeFormTarget = $(".layui-form[lay-filter='diaBaseScheme_form']");
    // 显示/隐藏：表单项 - 透析器
    if (isFormItemShow.dialyzer) {
        schemeFormTarget.find(".form-item-dialyzer").removeClass("layui-hide");
    } else {
        schemeFormTarget.find(".form-item-dialyzer").addClass("layui-hide");
        layui.form.val("diaBaseScheme_form", { dialyzer: "" });
    }
    // 显示/隐藏：表单项 - 灌流器
    if (isFormItemShow.irrigator) {
        schemeFormTarget.find(".form-item-irrigator").removeClass("layui-hide");
    } else {
        schemeFormTarget.find(".form-item-irrigator").addClass("layui-hide");
        layui.form.val("diaBaseScheme_form", { irrigator: "" });
    }
    // 显示/隐藏：表单项 - 血滤器
    if (isFormItemShow.filter) {
        schemeFormTarget.find(".form-item-filter").removeClass("layui-hide");
    } else {
        schemeFormTarget.find(".form-item-filter").addClass("layui-hide");
        layui.form.val("diaBaseScheme_form", { filter: "" });
    }
    // 显示/隐藏：置换液板块
    if (isFormItemShow.replacement) {
        schemeFormTarget.find(".dialysis-replacement-box").removeClass("layui-hide");
    } else {
        schemeFormTarget.find(".dialysis-replacement-box").addClass("layui-hide");
        layui.form.val("diaBaseScheme_form", {
            substituteMode: "",
            replacementFluidTotal: "",
            replacementFluidFlowRate: ""
        });
    }
}

/**
 * 初始化干体重历史信息图表
 * @param lastDryWeightList
 */
function initDryWeightHistoryChart(lastDryWeightList) {
    // 获取图表数据
    var statisticalDateArr = [];
    var dryWeightArr = [];
    if (lastDryWeightList && lastDryWeightList.length > 0) {
        $.each(lastDryWeightList, function (index, item) {
            statisticalDateArr.push(layui.util.toDateString(item.statisticalDate, "yyyy-MM-dd\nHH:mm"));
            dryWeightArr.push(item.dryWeight);
        });
    }

    // 初始化图表
    var targetItem = document.getElementById("patientDryWeightChart");
    var echartObj = echarts.init(targetItem);
    echartObj.setOption({
        title: {
            text: '透析方案干体重调整记录（最近10次）',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: statisticalDateArr,
            name: '调整日期'
        },
        yAxis: {
            type: 'value',
            name: '调整值'
        },
        grid: {
            top: '60',
            left: '30',
            right: '80',
            bottom: '10',
            containLabel: true
        },
        series: [{
            data: dryWeightArr,
            type: 'line',
            itemStyle: {normal: {label: {show: true}}}   //每个顶点显示数值
        }]
    }, true);

    // 盒子大小改变时，重设图表大小
    $(targetItem).resize(function () {
        echartObj.resize();
    });
}

/**
 * 重新计算目标脱水量
 */
function recalculateTargetDehydration() {
    var illnessData = layui.form.val("diaBaseIllness_form");
    var schemeData = layui.form.val("diaBaseScheme_form");
    if ((isNotEmpty(illnessData.beforeWeight) && !isNaN(illnessData.beforeWeight)) && (isNotEmpty(schemeData.dryWeight) && !isNaN(schemeData.dryWeight))) { // 透前体重和干体重均不为空时
        // 根据公式计算目标脱水量
        var formulaData = {
            beforeWeight: illnessData.beforeWeight, // 透前体重(界面填写)
            additionalWeight: illnessData.additionalWeight, // 附加体重(界面填写)
            bloodReturning: schemeData.bloodReturning, // 回血量(界面填写)
            dryWeight: schemeData.dryWeight, // 干体重(界面填写)
        };
        var targetDehydration = baseFuncInfo.getFormulaValue(diaBaseList.formula, $.constant.FormulaKey.TargetDehydration, formulaData);
        layui.form.val("diaBaseScheme_form", {
            // 表单目标脱水量取计算出的目标脱水量与处方脱水量(默认来自透析方案)中数值较大者
            targetDehydration: Math.max(targetDehydration, schemeData.parameterDehydration)
        });
    }
}

/**
 * 重新计算存（脱水量）
 */
function recalculateDepositDehydration() {
    var illnessData = layui.form.val("diaBaseIllness_form");
    var schemeData = layui.form.val("diaBaseScheme_form");
    if ((isNotEmpty(illnessData.beforeWeight) && !isNaN(illnessData.beforeWeight)) && (isNotEmpty(schemeData.dryWeight) && !isNaN(schemeData.dryWeight))) { // 透前体重和干体重均不为空时
        // 根据公式计算存（脱水量）
        var formulaData = {
            beforeWeight: illnessData.beforeWeight, // 透前体重(界面填写)
            additionalWeight: illnessData.additionalWeight, // 附加体重(界面填写)
            bloodReturning: schemeData.bloodReturning, // 回血量(界面填写)
            dryWeight: schemeData.dryWeight, // 干体重(界面填写)
            targetDehydration: schemeData.targetDehydration, // 目标脱水量(界面填写)
        };
        var depositDehydration = baseFuncInfo.getFormulaValue(diaBaseList.formula, $.constant.FormulaKey.DepositDehydration, formulaData);
        // 更新表单
        layui.form.val("diaBaseScheme_form", { depositDehydration: depositDehydration });
    }
}

