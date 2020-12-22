/**
 * 透后小结
 * @author Care
 * @date 2020-09-20
 * @version 1.0
 */
var diaSummaryEdit = avalon.define({
    $id: "diaSummaryEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    summaryTemplateType: $.constant.medicalHistoryTemplateType.SUMMARY, // 透后小结模板类型
    formula: {}, // 中心配置公式缓存
    diaRecordId: "", // 透析记录ID（传参）
    formReadonly: false, // 表单只读状态
    dialyzerChangeDisabled: true, // 禁用“透析器更换”
    pipingChangeDisabled: true, // 禁用“管路更换”
    dialysateIntakeDisabled: true, // 禁用“透中摄入”
    diaSummary: null, // 透后小结信息
    diaBase: { // 透析治疗信息
        beforeWeight: null, // 透前体重
        additionalWeight: null, // 附加体重
        targetDehydration: null, // 目标脱水量
        isHdfMode: false, // 是否是HDF透析模式
        withCatheter: false, // 血管通路是否包含“导管类”
        withPuncture: false, // 血管通路是否包含“穿刺类”
    },
    lastDiaMonitorRecord: { // 最后一笔监测记录信息
        totalMoreDehydration: null, // 累计脱水量
        systolicPressure: null, // 收缩压
        diastolicPressure: null, // 舒张压
        pulse: null // 脉搏
    },
    options: {
        fallAssess: getSysDictByCode($.dictType.FallAssess), // 坠床
        catheterDrop: getSysDictByCode($.dictType.CatheterDrop), // 导管脱出
        diaCoagulation: getSysDictByCode($.dictType.DiaCoagulation), // 透析器凝血
        bloodClotting: getSysDictByCode($.dictType.BloodClotting), // 透析管路凝血
        dialysateIntakeType: getSysDictByCode($.dictType.DialysateIntakeType), // 透中摄入类型
        gaitWatch: getSysDictByCode($.dictType.GaitWatch), // 步态观察
        hemostasis: getSysDictByCode($.dictType.Hemostasis), // 止血方式
        hemostasisTime: getSysDictByCode($.dictType.HemostasisTime), // 止血时间
        fistulaNoise: getSysDictByCode($.dictType.FistulaNoise), // 杂音
        fistulaTremor: getSysDictByCode($.dictType.FistulaTremor), // 震颤
        sealingMethod: getSysDictByCode($.dictType.SealingPipe), // 封管方式
        drugSealing: getSysDictByCode($.dictType.DrugSealing), // 封管用药
        nurseList: [], // 护士选项列表
        doctorList: [], // 医生选项列表
    }
});

layui.use(['index', 'formSelects'], function () {
    avalon.ready(function () {
        // 获取URL参数并更新页面参数
        diaSummaryEdit.diaRecordId = GetQueryString("diaRecordId");
        // 表单只读：布局页传入只读（透析记录已归档） || 无保存权限
        diaSummaryEdit.formReadonly = GetQueryString("readonly") == "Y" || !baseFuncInfo.authorityTag('diaSummaryEdit#edit');


        // 初始化表单
        initFormVerify();
        initForm();

        getInfo(diaSummaryEdit.diaRecordId); // 获取透析小结相关数据
        getNurseOptions();// 获取护士选项
        getDoctorOptions(); // 获取医生选项

        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段数值范围校验
        fieldNotInRange: function (value, item) {
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
                return fieldName + "只能输入" + minValue + "~" + maxValue + "的值";
            }
        }
    });
}

/**
 * 初始化表单
 * @param readonly
 */
function initForm() {
    var readonly = diaSummaryEdit.formReadonly;

    // 设定透析（简要信息）保存回调事件：可用于保存子页面操作
    if (!readonly && baseFuncInfo.authorityTag('diaSummaryEdit#edit')) {
        // 设定透析（简要信息）保存回调事件：可用于保存子页面操作
        if (window.parent.setSaveCallback) {
            window.parent.setSaveCallback(function () {
                saveDiaSummary();
            });
        }

        // 设置获取实际透析时长回调事件：父页面可获取实际透析时长
        if (window.parent.setGetRelDialysisTimeCallback) {
            window.parent.setGetRelDialysisTimeCallback(function () {
                var formData = layui.form.val("diaSummaryEdit_form");
                return {dialysisTimeHour: formData.dialysisTimeHour, dialysisTimeMin: formData.dialysisTimeMin};
            });
        }
    }

    // 实际透析时长：改变时，重新设置实际结束时间
    $(".layui-form[lay-filter='diaSummaryEdit_form'] input[name='dialysisTimeHour']," +
        " .layui-form[lay-filter='diaSummaryEdit_form'] input[name='dialysisTimeMin']").change(function () {
        var formData = layui.form.val("diaSummaryEdit_form");

        if (!isNaN(formData.dialysisTimeHour) && !isNaN(formData.dialysisTimeMin)) {
            var dialysisTimeHour = Number(formData.dialysisTimeHour) || 0;
            var dialysisTimeMin = Number(formData.dialysisTimeMin) || 0;

            // 根据透析时长重新计算小时数和分钟数
            var differMinute = dialysisTimeHour * 60 + dialysisTimeMin;
            var hours = Math.floor(differMinute / 60);
            var minutes = Math.floor(differMinute - (hours * 60));
            layui.form.val("diaSummaryEdit_form", {
                dialysisTimeHour: hours,
                dialysisTimeMin: minutes,
            });

            // 重新设置实际结束时间
            if (window.parent.resetDownDateByDialysisTime) {
                window.parent.resetDownDateByDialysisTime(hours, minutes);
            }
        }
    });
    // 透后体重、透中摄入改变时，重新实际脱水量
    $(".layui-form[lay-filter='diaSummaryEdit_form'] input[name='afterPlanWeight']," +
        ".layui-form[lay-filter='diaSummaryEdit_form'] input[name='dialysateIntakeType']").change(function () {
        recalculateActualDehydration();
    });
    // 实际脱水量改变时，重新计算差(脱水量)
    $(".layui-form[lay-filter='diaSummaryEdit_form'] input[name='actualDehydration']").change(function () {
        recalculateDifferDehydration();
    });

    // Todo 禁用“已更换敷料”复选框

    // 透析器凝血与透析器更换联动：【透析器更换】默认禁用，当【透析器凝血】非无时，才启用
    layui.form.on('select(diaCoagulation)', function (obj) {
        var diaCoagulation = obj.value;
        resetDialyzerChangeDisabled(diaCoagulation);
    });

    // 透析管路凝血与管路更换联动：【管路更换】默认禁用，当【透析管路凝血】非无时，才启用
    layui.form.on('select(bloodClotting)', function (obj) {
        var bloodClotting = obj.value;
        resetPipingChangeDisabled(bloodClotting);
    });

    // 透中摄入类型与透中摄入联动：【透中摄入类型】默认无发生，当【透中摄入类型】有发生时，才启用
    layui.form.on('select(dialysateIntakeType)', function (obj) {
        var dialysateIntakeType = obj.value;
        resetDialysateIntakeDisabled(dialysateIntakeType);
    });

    // 步态观察与陪同者联动：步行平稳(默认),如非默认:步态不稳/轮椅辅助,带出”陪同者”(下拉选项)
    layui.form.on('select(gaitWatch)', function (obj) {
        var gaitWatch = obj.value;
        resetAccompanyUserHide(gaitWatch);
    });

    // 责任护士：启用/禁用
    if (readonly) {
        layui.formSelects.disabled('principalNurse');
    } else {
        layui.formSelects.undisabled('principalNurse');
    }
}

/**
 * 陪同者显示/隐藏：【步态观察】与【陪同者】联动
 * @param gaitWatch
 */
function resetAccompanyUserHide(gaitWatch) {
    var gaitWatchBizCode = getSysDictBizCode($.dictType.GaitWatch, gaitWatch);
    var isShow = gaitWatchBizCode === $.constant.YesOrNo.YES;

    var editFormTarget = $(".layui-form[lay-filter='diaSummaryEdit_form']");
    if (isShow) {
        editFormTarget.find(".form-item-accompany-user").removeClass("layui-hide");
    } else {
        editFormTarget.find(".form-item-accompany-user").addClass("layui-hide");
        layui.form.val("diaSummaryEdit_form", {accompanyUser: ""});
    }
}

/**
 * 透析器更换启用/禁用：【透析器凝血】与【透析器更换】联动
 * @param diaCoagulation
 */
function resetDialyzerChangeDisabled(diaCoagulation) {
    var isEnable = false;
    if (!diaSummaryEdit.formReadonly) {
        // 若不是只读，还需判断【透析器凝血】的值：当【透析器凝血】非无时，才启用
        var diaCoagulationBizCode = getSysDictBizCode($.dictType.DiaCoagulation, diaCoagulation);
        isEnable = diaCoagulationBizCode === $.constant.YesOrNo.YES;
    }

    if (!isEnable) {
        diaSummaryEdit.dialyzerChangeDisabled = true;
        layui.form.val("diaSummaryEdit_form", {dialyzerChange: ""});
    } else {
        diaSummaryEdit.dialyzerChangeDisabled = false;
    }
    layui.form.render('select');
}

/**
 * 管路更换启用/禁用：【透析管路凝血】与【管路更换】联动
 * @param bloodClotting
 */
function resetPipingChangeDisabled(bloodClotting) {
    var isEnable = false;
    if (!diaSummaryEdit.formReadonly) {
        // 若不是只读，还需判断【透析管路凝血】的值：当【透析管路凝血】非无时，才启用
        var bloodClottingBizCode = getSysDictBizCode($.dictType.BloodClotting, bloodClotting);
        isEnable = bloodClottingBizCode === $.constant.YesOrNo.YES;
    }

    if (!isEnable) {
        diaSummaryEdit.pipingChangeDisabled = true;
        layui.form.val("diaSummaryEdit_form", {pipingChange: ""});
    } else {
        diaSummaryEdit.pipingChangeDisabled = false;
    }
    layui.form.render('select');
}

/**
 * 透中摄入启用/禁用：【透中摄入类型】与【透中摄入】联动
 * @param bloodClotting
 */
function resetDialysateIntakeDisabled(dialysateIntakeType) {
    var isEnable = false;
    if (!diaSummaryEdit.formReadonly) {
        // 若不是只读，还需判断【透中摄入类型】的值：当【透中摄入类型】有发生时，才启用
        var dialysateIntakeTypeBizCode = getSysDictBizCode($.dictType.DialysateIntakeType, dialysateIntakeType);
        isEnable = dialysateIntakeTypeBizCode === $.constant.YesOrNo.YES;
    }

    if (!isEnable) {
        diaSummaryEdit.dialysateIntakeDisabled = true;
        layui.form.val("diaSummaryEdit_form", {dialysateIntake: ""});

        // 重新计算实际脱水量
        recalculateActualDehydration();
    } else {
        diaSummaryEdit.dialysateIntakeDisabled = false;
    }
    layui.form.render('select');
}

/**
 * 小结- 提取模板
 */
function onImportSummaryTemplate() {
    baseFuncInfo.onImportFromContentTemplate("提取模板", diaSummaryEdit.summaryTemplateType, function (data) {
        layui.form.val("diaSummaryEdit_form", {summary: data.templateContent});
        successToast("导入成功");
    });
}

/**
 * 小结- 保存模板
 */
function onSaveSummaryTemplate() {
    var summaryContent = layui.form.val("diaSummaryEdit_form").summary;
    if (isEmpty(summaryContent)) {
        return warningToast("请填写小结内容");
    } else {
        baseFuncInfo.onExportContentTemplate("保存模板", diaSummaryEdit.summaryTemplateType, summaryContent, function (data) {
            successToast("保存成功");
        });
    }
}

/**
 * 生成小结
 */
function generateSummary() {
    // 获取表单值
    var object = layui.form.val("diaSummaryEdit_form");
    // 获取下拉选单等的选中值名称
    var formTarget = $(".layui-form[lay-filter='diaSummaryEdit_form']");
    var measuringPartDesc = formTarget.find("input[name='measuringPart']:checked").attr("title");
    var fallAssessDesc = formTarget.find("select[name='fallAssess'] option:selected").text();
    var catheterDropDesc = formTarget.find("select[name='catheterDrop'] option:selected").text();
    var diaCoagulationDesc = formTarget.find("select[name='diaCoagulation'] option:selected").text();
    var dialyzerChangeDesc = formTarget.find("select[name='dialyzerChange'] option:selected").text();
    var bloodClottingDesc = formTarget.find("select[name='bloodClotting'] option:selected").text();
    var pipingChangeDesc = formTarget.find("select[name='pipingChange'] option:selected").text();
    var dialysateIntakeTypeDesc = formTarget.find("select[name='dialysateIntakeType'] option:selected").text();
    var gaitWatchDesc = formTarget.find("select[name='gaitWatch'] option:selected").text();
    var feverDesc = formTarget.find("select[name='fever'] option:selected").text();
    var accompanyUserDesc = formTarget.find("select[name='accompanyUser'] option:selected").text();
    var hemostasisDesc = formTarget.find("select[name='hemostasis'] option:selected").text();
    var hemostasisTimeDesc = formTarget.find("select[name='hemostasisTime'] option:selected").text();
    var fistulaNoiseDesc = formTarget.find("select[name='fistulaNoise'] option:selected").text();
    var fistulaTremorDesc = formTarget.find("select[name='fistulaTremor'] option:selected").text();
    var sealingMethodDesc = formTarget.find("select[name='sealingMethod'] option:selected").text();
    var dressingChangeDesc = (object.dressingChange == $.constant.YesOrNo.YES ? "是" : "否");
    var drugSealingDesc = formTarget.find("select[name='drugSealing'] option:selected").text();

    // 拼接透后小结内容
    var html = "";
    html += "透后体重：" + object.afterPlanWeight + "kg；" + "实际透后体重：" + object.afterRealWeight + "kg；" + "实际脱水量：" + object.actualDehydration + "L；差：" + object.differDehydration + "L；" + "\n";
    html += "机显脱水量：" + object.machineDehydration + "L；" + "实际预冲量：" + object.actualPreload + "ml；" + "实际透析时长：" + object.dialysisTimeHour + "时" + object.dialysisTimeMin + "分；" + "脉搏：" + object.pulse + "次/分；" + "\n";
    html += "收缩压：" + object.systolicPressure + "mmHg；" + "舒张压：" + object.diastolicPressure + "mmHg；" + "测量部位：" + measuringPartDesc + "；" + "\n";
    html += "实际置换液：" + object.relReplacementFluidTotal + "L；" + "\n";
    html += "坠床：" + fallAssessDesc + "；" + "导管脱出：" + catheterDropDesc + "；" + "透析器凝血：" + diaCoagulationDesc + "；" + "透析器更换：" + dialyzerChangeDesc + "；" + "\n";
    html += "透析管路凝血：" + bloodClottingDesc + "；" + "管路更换：" + pipingChangeDesc + "；" + "透中摄入：" + dialysateIntakeTypeDesc + "；" + "透中摄入：" + object.dialysateIntake + "kg；" + "\n";
    html += "发热：" + feverDesc + "；" + "步态观察：" + gaitWatchDesc + "；" + "陪同者：" + accompanyUserDesc + "；" + "\n";
    if (diaSummaryEdit.diaBase.withPuncture) { // 血管通路是否包含“穿刺类”
        html += "止血方式：" + hemostasisDesc + "；" + "止血时间：" + hemostasisTimeDesc + "；" + "杂音：" + fistulaNoiseDesc + "；" + "震颤：" + fistulaTremorDesc + "；" + "\n";
        html += "其他：" + object.fistulaOther + "\n"
    }
    if (diaSummaryEdit.diaBase.withCatheter) { // 血管通路是否包含“导管类”
        html += "封管方式：" + sealingMethodDesc + "；" + "官腔容量：" + "A" + object.capacityA + "ml；" + "V" + object.capacityV + "cm；" + "是否已更换敷料：" + dressingChangeDesc + "；" + "封管用药：" + drugSealingDesc + "；" + "\n";
    }
    layui.form.val("diaSummaryEdit_form", {summary: html});
}

/**
 * 获取透析小结相关数据
 * @param diaRecordId
 */
function getInfo(diaRecordId) {
    var param = {
        "diaRecordId": diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaSummary/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var isFiled = data.isFiled; // 透析记录是否已归档
            var diaSummary = data.diaSummary; // 透后小结信息
            var diaBase = data.diaBase; // 透析基本信息
            var withPuncture = data.withPuncture; // 血管通路是否包含“穿刺类”
            var withCatheter = data.withCatheter; // 血管通路是否包含“导管类”
            var patVascularConduits = data.patVascularConduits; // 血管通路包含导管时，导管概况信息
            var lastDiaMonitorRecord = data.lastDiaMonitorRecord; // 最后一笔监测记录信息
            var unSaved = (diaSummary == null || $.constant.YesOrNo.YES != diaSummary.saveStatus); // 透后小结未保存过
            var formTarget = $(".layui-form[lay-filter='diaSummaryEdit_form']");

            // 0. 获取中心配置公式
            try {
                diaSummaryEdit.formula = eval(data.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + data.formula, e);
            }

            // 2. 更新透后小结表单
            if (diaSummary) {
                diaSummaryEdit.diaSummary = diaSummary;
                layui.form.val("diaSummaryEdit_form", diaSummary);

                // 更新“已更换敷料”选中值
                if (diaSummary.dressingChange != $.constant.YesOrNo.YES) {
                    layui.form.val("diaSummaryEdit_form", {dressingChange: ""});
                }

                // 更新责任护士选中值
                if (isNotEmpty(diaSummaryEdit.diaSummary.principalNurse)) {
                    var principalNurseArr = diaSummaryEdit.diaSummary.principalNurse.split(',');
                    layui.formSelects.value('principalNurse', principalNurseArr, true);
                }
            }
            // 2.1 若血管通路包含“穿刺类”，则显示穿刺评估；否则隐藏穿刺评估
            diaSummaryEdit.diaBase.withPuncture = withPuncture; // 血管通路是否包含“穿刺类”
            if (withPuncture) {
                formTarget.find(".fillet-groud-puncture").removeClass("layui-hide");
            } else {
                formTarget.find(".fillet-groud-puncture").addClass("layui-hide");
            }
            // 2.2 若血管通路包含“导管类”，则显示导管评估；否则隐藏导管评估
            diaSummaryEdit.diaBase.withCatheter = withCatheter; // 血管通路是否包含“导管类”
            if (withCatheter) {
                formTarget.find(".fillet-groud-catheter").removeClass("layui-hide");

                //  （若“透析记录未归档 && 透后小结未保存过”）血管通路类型”导管类”,自动默认带出  封管方式/管腔容量:A___ml/V___ml
                if (!isFiled && unSaved && patVascularConduits) {
                    layui.form.val("diaSummaryEdit_form", {
                        sealingMethod: patVascularConduits.sealingPipe, // 封管方式
                        capacityA: patVascularConduits.arteryVolume, // 管腔容量A
                        capacityV: patVascularConduits.veinVolume, // 管腔容量V
                    });
                }
            } else {
                formTarget.find(".fillet-groud-catheter").addClass("layui-hide");
            }

            // 3. 更新透析基本信息
            if (diaBase) {
                // 【置换液】模块HDF才显示
                var dialysisModeBizCode = getSysDictBizCode($.dictType.DialysisMode, diaBase.dialysisMode);
                diaSummaryEdit.diaBase.isHdfMode = (dialysisModeBizCode == $.constant.DialysisMode.HDF); // 是否是HDF透析模式
                if (diaSummaryEdit.diaBase.isHdfMode) {
                    formTarget.find(".form-item-rel-replacement-fluid-total").removeClass("layui-hide");
                } else {
                    formTarget.find(".form-item-rel-replacement-fluid-total").addClass("layui-hide");
                    layui.form.val("diaSummaryEdit_form", {relReplacementFluidTotal: ""});
                }

                // 从透析治疗信息中，缓存公式用到值
                diaSummaryEdit.diaBase.beforeWeight = diaBase.beforeWeight; // 透前体重
                diaSummaryEdit.diaBase.additionalWeight = diaBase.additionalWeight; // 附加体重
                diaSummaryEdit.diaBase.targetDehydration = diaBase.targetDehydration; // 目标脱水量
            }

            // 4. 从最后一笔监测记录中，缓存公式用到值
            if (lastDiaMonitorRecord) {
                diaSummaryEdit.lastDiaMonitorRecord.totalMoreDehydration = lastDiaMonitorRecord.totalMoreDehydration; // 累计脱水量
                diaSummaryEdit.lastDiaMonitorRecord.systolicPressure = lastDiaMonitorRecord.systolicPressure; // 收缩压
                diaSummaryEdit.lastDiaMonitorRecord.diastolicPressure = lastDiaMonitorRecord.diastolicPressure; // 舒张压
                diaSummaryEdit.lastDiaMonitorRecord.pulse = lastDiaMonitorRecord.pulse; // 脉搏
            }

            // 5. 【透后体重】来源监测记录最后一条数据，透前体重-累计脱水量=透后体重
            if (!isFiled && unSaved && diaSummaryEdit.diaBase.beforeWeight != null && !isNaN(diaSummaryEdit.diaBase.beforeWeight)) {
                var beforeWeight = diaSummaryEdit.diaBase.beforeWeight;
                var totalMoreDehydration = Number(diaSummaryEdit.lastDiaMonitorRecord.totalMoreDehydration) || 0; // 累计脱水量(单位ml)
                var afterPlanWeight = (beforeWeight - (totalMoreDehydration / 1000)).toFixed(2);
                layui.form.val("diaSummaryEdit_form", {afterPlanWeight: afterPlanWeight});
            }

            // 6. 若“透析记录未归档 && 透后小结未保存过”，则默认计算差(脱水量)、实际脱水量
            if (!isFiled && unSaved) {
                // 重新计算实际脱水量
                recalculateActualDehydration();
                // 重新计算差(脱水量)
                recalculateDifferDehydration();
                window.parent.showTabBadgeDot(true);
            } else {
                window.parent.showTabBadgeDot(false);
            }

            // 7. 表单其他状态更新
            var editForm = layui.form.val("diaSummaryEdit_form");
            // 7.1 【透析器更换】默认禁用，当【透析器凝血】非无时，才启用
            resetDialyzerChangeDisabled(editForm.diaCoagulation);
            // 7.2 【管路更换】默认禁用，当【透析管路凝血】非无时，才启用
            resetPipingChangeDisabled(editForm.bloodClotting);
            // 7.3 【透中摄入】默认禁用，当【透中摄入】有发生时，才启用
            resetDialysateIntakeDisabled(editForm.dialysateIntake);
            // 7.4 【步态观察】步行平稳(默认),如非默认:步态不稳/轮椅辅助,带出”陪同者”(下拉选项)
            resetAccompanyUserHide(editForm.gaitWatch);
        }
    });
}

/**
 * 获取实际透后体重：【实际透后体重】一般是透后去测量得到，没测量就点击【获取体重】（通过公式计算得出）
 */
function getAfterRealWeight() {
    var formData = layui.form.val("diaSummaryEdit_form");
    if (isNotEmpty(formData.afterPlanWeight) && !isNaN(formData.afterPlanWeight)) { // 透后体重不为空时
        // 根据公式计算实际透后体重
        var formulaData = {
            afterPlanWeight: formData.afterPlanWeight, // 透后体重(界面填写)
            additionalWeight: diaSummaryEdit.diaBase.additionalWeight, // 附加体重(界面填写)
        };
        var afterRealWeight = baseFuncInfo.getFormulaValue(diaSummaryEdit.formula, $.constant.FormulaKey.AfterRealWeight, formulaData);
        layui.form.val("diaSummaryEdit_form", {afterRealWeight: afterRealWeight});
    } else {
        warningToast("请填写透后体重");
    }
}

/**
 * 重新计算实际脱水量
 */
function recalculateActualDehydration() {
    var formData = layui.form.val("diaSummaryEdit_form");
    if (isNotEmpty(diaSummaryEdit.diaBase.beforeWeight) && !isNaN(diaSummaryEdit.diaBase.beforeWeight)
            && isNotEmpty(formData.afterPlanWeight) && !isNaN(formData.afterPlanWeight)) { // 透前体重与透后体重不为空时
        // 根据公式计算实际脱水量
        var formulaData = {
            beforeWeight: diaSummaryEdit.diaBase.beforeWeight, // 透前体重(界面填写)
            bloodReturning: diaSummaryEdit.diaBase.bloodReturning, // 回血量(界面填写)
            dialysateIntake: formData.dialysateIntake, // 透中摄入(界面填写)
            afterPlanWeight: formData.afterPlanWeight, // 透后体重(界面填写)
        };
        var actualDehydration = baseFuncInfo.getFormulaValue(diaSummaryEdit.formula, $.constant.FormulaKey.ActualDehydration, formulaData);
        layui.form.val("diaSummaryEdit_form", {actualDehydration: actualDehydration});
    }
}

/**
 * 重新计算差(脱水量)
 */
function recalculateDifferDehydration() {
    var formData = layui.form.val("diaSummaryEdit_form");
    if (isNotEmpty(formData.actualDehydration) && !isNaN(formData.actualDehydration)) { // 实际脱水量不为空时
        // 根据公式计算差(脱水量)
        var formulaData = {
            targetDehydration: diaSummaryEdit.diaBase.targetDehydration, // 目标脱水量(界面填写)
            actualDehydration: formData.actualDehydration, // 实际脱水量(界面填写)
        };
        var differDehydration = baseFuncInfo.getFormulaValue(diaSummaryEdit.formula, $.constant.FormulaKey.DifferDehydration, formulaData);
        layui.form.val("diaSummaryEdit_form", {differDehydration: differDehydration});
    }
}

/**
 * 获取血压：【获取血压】获取监测记录最后一条的收缩压、舒张压、脉搏
 */
function getBloodPressure() {
    if (isEmpty(diaSummaryEdit.lastDiaMonitorRecord.pulse) && isEmpty(diaSummaryEdit.lastDiaMonitorRecord.systolicPressure)
        && isEmpty(diaSummaryEdit.lastDiaMonitorRecord.diastolicPressure)) {
        warningToast("暂无监测血压记录");
    } else {
        layui.form.val("diaSummaryEdit_form", {
            pulse: diaSummaryEdit.lastDiaMonitorRecord.pulse, // 脉博
            systolicPressure: diaSummaryEdit.lastDiaMonitorRecord.systolicPressure, // 收缩压
            diastolicPressure: diaSummaryEdit.lastDiaMonitorRecord.diastolicPressure, // 舒张压
        });
    }
}

/**
 * 获取护士选项
 */
function getNurseOptions() {
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysUser/getNurseRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            // 签名 - 其他护士：更新护士选项
            diaSummaryEdit.options.nurseList = data;
            // 签名 - 其他护士：更新签名选中护士
            if (diaSummaryEdit.diaSummary) {
                layui.form.val('diaSummaryEdit_form', {
                    washpipeUser: diaSummaryEdit.diaSummary.washpipeUser, // 冲管者
                    punctureUser: diaSummaryEdit.diaSummary.punctureUser, // 穿刺者
                    bloodReceiver: diaSummaryEdit.diaSummary.bloodReceiver, // 接血者
                    rebleedingUser: diaSummaryEdit.diaSummary.rebleedingUser, // 回血者
                    inspector: diaSummaryEdit.diaSummary.inspector, // 巡视者
                    checkNurse: diaSummaryEdit.diaSummary.checkNurse // 查对护士
                });
            }

            // 签名 - 责任护士：更新责任护士选项
            var principalNurseList = [];
            $.each(data, function (index, item) {
                principalNurseList.push({
                    value: item.id,
                    name: item.userName
                });
            });
            layui.formSelects.data('principalNurse', 'local', {arr: principalNurseList});
            // 签名 - 责任护士：更新责任护士选中值
            if (diaSummaryEdit.diaSummary && isNotEmpty(diaSummaryEdit.diaSummary.principalNurse)) {
                var principalNurseArr = diaSummaryEdit.diaSummary.principalNurse.split(',');
                layui.formSelects.value('principalNurse', principalNurseArr, true);
            }
        }
    });
}

/**
 * 获取医生选项
 */
function getDoctorOptions() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            // 更新医生选项
            diaSummaryEdit.options.doctorList = data;
            // 更新医生签名选中
            if (diaSummaryEdit.diaSummary) {
                layui.form.val('diaSummaryEdit_form', {
                    doctorSign: diaSummaryEdit.diaSummary.doctorSign, // 医生签名
                });
            }
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    // 监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaSummaryEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaSummaryEdit_submit").trigger('click');
}

/**
 * 保存透后小结
 */
function saveDiaSummary() {
    verify_form(function (field) {
        var param = $.extend({}, field, {
            diaRecordId: diaSummaryEdit.diaRecordId
        });
        if (param.dressingChange != $.constant.YesOrNo.YES) {
            param.dressingChange = $.constant.YesOrNo.NO;
        }

        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaSummary/edit.do",
            data: JSON.stringify(param),
            dataType: "json",
            contentType: "application/json; charset=utf-8", //此设置后台可接受复杂参数，后台接收需要@RequestBody标签
            done: function (data) {
                successToast("保存成功");
                // 刷新当前透析记录状态
                if (window.parent.onRefreshRecordOption) { window.parent.onRefreshRecordOption(); }
                // 刷新当前页面
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        });
    });
}



