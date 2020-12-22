/**
 * 透析消毒
 * @author Care
 * @date 2020-09-10
 * @version 1.0
 */
var diaDisinfectEdit = avalon.define({
    $id: "diaDisinfectEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    diaRecordId: "", // 透析记录ID（传参）
    formReadonly: false, // 表单只读状态
    bedNo: '', // 床号
    diaDisinfect: null,
    options: {
        nurseList: [], // 护士选项列表
        disinfectOrderList: baseFuncInfo.getSysDictByCode($.dictType.DisinfectOrder), // 消毒程序选项列表
        sheetChangeList: baseFuncInfo.getSysDictByCode($.dictType.SheetChange), // 床单更换选项列表
        disinfectSurfaceList: baseFuncInfo.getSysDictByCode($.dictType.DisinfectSurface), // 表面消毒方法选项列表
    }
});
layui.use(['index'], function () {
    avalon.ready(function () {
        // 获取URL参数并更新页面参数
        diaDisinfectEdit.diaRecordId = GetQueryString("diaRecordId");
        // 表单只读：布局页传入只读（透析记录已归档） || 无保存权限
        diaDisinfectEdit.formReadonly = GetQueryString("readonly") == "Y" || !baseFuncInfo.authorityTag('diaDisinfectEdit#saveOrEdit');

        // 初始化表单
        initFormVerify();
        initForm();

        getNurseOptions(); // 获取护士选项
        getDisinfectInfo(diaDisinfectEdit.diaRecordId); // 获取透析消毒信息

        avalon.scan();
    });
});

/**
 * 初始化表单验证方法
 */
function initFormVerify() {
    layui.form.verify({
        // 字段必填校验
        fieldRequired: function (value, item) {
            var target = $(item);
            return fieldRequired(value, target.attr("data-field-name"));
        },
        // 字段数值范围校验
        fieldNotInRange: function (value, item) {
            var target = $(item);
            return fieldNotInRange(value, {
                fieldName: target.attr("data-field-name"), // 字段名
                minValue: target.attr("data-min-value"),  // 最小值
                maxValue: target.attr("data-max-value"), // 最大值
                isInteger: target.attr("data-integer"), // 是否是整数
            });
        }
    });
}

/**
 * 初始化表单
 * @param readonly
 */
function initForm() {
    var readonly = diaDisinfectEdit.formReadonly;

    // 设定透析（简要信息）保存回调事件：可用于保存子页面操作
    if (!readonly && baseFuncInfo.authorityTag('diaDisinfectEdit#saveOrEdit')) {
        if (window.parent.setSaveCallback) {
            window.parent.setSaveCallback(function () {
                saveDiaDisinfect();
            });
        }
    }

    // 初始化表单元素,日期时间选择器： 开始时间 / 结束时间
    var laydate = layui.laydate;
    laydate.render({
        elem: '#diaDisinfectEdit_form input[name="startTime"]',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        trigger: 'click'
    });
    laydate.render({
        elem: '#diaDisinfectEdit_form input[name="endTime"]',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        trigger: 'click'
    });

    // 消毒程序与残余测试联动：【消毒程序】 为“次氯酸钠”则带出”残余测试”字段
    layui.form.on('select(disinfectOrder)', function (obj) {
        var disinfectOrder = obj.value;
        resetResidualTestHide(disinfectOrder);

        // 获取消毒程序默认消毒时长（字典默认值，单位分组）
        var defaultDisinfectMin = getSysDictDefaultValue($.dictType.DisinfectOrder, disinfectOrder);
        if (isNotEmpty(defaultDisinfectMin) && !isNaN(defaultDisinfectMin)) {
            resetDisinfectTime(0, defaultDisinfectMin); // 重新设置消毒时长
        }
    });

    // 结束时间：改变时，重新设置消毒时长
    $(".layui-form[lay-filter='diaDisinfectEdit_form'] input[name='endTime']").change(function () {
        onStartTimeOrEndTimeChange();
    });

    // 消毒时长：改变时，重新设置结束时间
    $(".layui-form[lay-filter='diaDisinfectEdit_form'] input[name='disinfectHour']," +
        " .layui-form[lay-filter='diaDisinfectEdit_form'] input[name='disinfectMin']").change(function () {
        var formData = layui.form.val("diaDisinfectEdit_form");
        if (!isNaN(formData.disinfectHour) && !isNaN(formData.disinfectMin)) {
            resetDisinfectTime(formData.disinfectHour, formData.disinfectMin); // 重新设置消毒时长
            resetEndTime(); // 消毒时长改变时，重新设置结束时间
        }
    });

    layui.form.render('select');
}

/**
 * 透析开始时间或结束时间改变时，重新设置消毒时长
 */
function onStartTimeOrEndTimeChange() {
    var formData = layui.form.val("diaDisinfectEdit_form");
    var startTime = new Date(formData.startTime).getTime();
    var endTime = new Date(formData.endTime).getTime();
    if (!isNaN(startTime) && !isNaN(endTime)) {
        var differMinute = Math.floor((endTime - startTime) / (60 * 1000));
        resetDisinfectTime(0, differMinute); // 重新设置消毒时长
    }
}

/**
 * 开始时间-获取时间
 */
function getCurrentTimeForStartTime() {
    layui.form.val("diaDisinfectEdit_form", {startTime: layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm")});
    onStartTimeOrEndTimeChange();
}

/**
 * 结束时间-获取时间
 */
function getCurrentTimeForEndTime() {
    layui.form.val("diaDisinfectEdit_form", {endTime: layui.util.toDateString(new Date(), "yyyy-MM-dd HH:mm")});
    onStartTimeOrEndTimeChange();
}

/**
 * 消毒时长改变时，重新设置结束时间
 * @param disinfectHour 消毒时长(小时)
 * @param disinfectMin 消毒时长(分钟)
 */
function resetEndTime() {
    var editForm = layui.form.val("diaDisinfectEdit_form");
    var addHours = Number(editForm.disinfectHour);
    var addMinutes = Number(editForm.disinfectMin);

    // 上机时间不为空 && 实际透析时长是数值，则重新设置预计结束时间
    if (isNotEmpty(editForm.startTime) && (!isNaN(addHours) || !isNaN(addMinutes))) {
        var tempDate = new Date(editForm.startTime);
        tempDate.setTime(tempDate.getTime() + (addHours || 0) * 60 * 60 * 1000 + (addMinutes || 0) * 60 * 1000);
        var endTime = layui.util.toDateString(tempDate, "yyyy-MM-dd HH:mm");
        layui.form.val("diaDisinfectEdit_form", {endTime: endTime});
    }
}

/**
 * 重新设置消毒时长
 * @param disinfectHour
 * @param disinfectMin
 */
function resetDisinfectTime(disinfectHour, disinfectMin) {
    disinfectHour = Number(disinfectHour) || 0;
    disinfectMin = Number(disinfectMin) || 0;

    // 根据透析时长重新计算小时数和分钟数
    var differMinute = disinfectHour * 60 + disinfectMin;
    var hours = Math.floor(differMinute / 60);
    var minutes = Math.floor(differMinute - (hours * 60));
    layui.form.val("diaDisinfectEdit_form", {
        disinfectHour: hours,
        disinfectMin: minutes,
    });
}

/**
 * 残余测试显示/隐藏：【消毒程序】与【残余测试】联动
 * @param gaitWatch
 */
function resetResidualTestHide(disinfectOrder) {
    var disinfectOrderBizCode = getSysDictBizCode($.dictType.DisinfectOrder, disinfectOrder);
    var isShow = disinfectOrderBizCode === $.constant.YesOrNo.YES;

    var editFormTarget = $(".layui-form[lay-filter='diaDisinfectEdit_form']");
    if (isShow) {
        editFormTarget.find(".form-item-residual-test").removeClass("layui-hide");
    } else {
        editFormTarget.find(".form-item-residual-test").addClass("layui-hide");
        layui.form.val("diaDisinfectEdit_form", {residualTest: ""});
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
            // 更新护士选项
            diaDisinfectEdit.options.nurseList = data;
            // 更新操作者选中护士
            if (diaDisinfectEdit.diaDisinfect) {
                layui.form.val('diaDisinfectEdit_form', {
                    disinfectUser: diaDisinfectEdit.diaDisinfect.disinfectUser // 操作者
                });
            }
            layui.form.render('select');
        }
    });
}


/**
 * 获取透析消毒信息
 * @param diaRecordId
 */
function getDisinfectInfo(diaRecordId) {
    var param = {
        "diaRecordId": diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaDisinfect/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var bedNo = data.bedNo || ""; // 床号
            var isFiled = data.isFiled; // 透析记录是否已归档
            var diaDisinfect = data.diaDisinfect; // 透析消毒信息
            var unSaved = (diaDisinfect == null || $.constant.YesOrNo.YES != diaDisinfect.saveStatus); // 透析消毒未保存过

            // 1. 更新透析消毒表单
            diaDisinfectEdit.bedNo = bedNo;
            if (diaDisinfect) {
                diaDisinfectEdit.diaDisinfect = diaDisinfect;
                diaDisinfect.startTime = diaDisinfect.startTime ? layui.util.toDateString(diaDisinfect.startTime, "yyyy-MM-dd HH:mm") : "";
                diaDisinfect.endTime = diaDisinfect.endTime ? layui.util.toDateString(diaDisinfect.endTime, "yyyy-MM-dd HH:mm") : "";
                layui.form.val("diaDisinfectEdit_form", diaDisinfect);

                // 残余测试显示/隐藏：【消毒程序】与【残余测试】联动
                resetResidualTestHide(diaDisinfect.disinfectOrder)
            }

            // 2. 若“透析记录未归档 && 透析消毒未保存过”，则显示当前页签红点
            if (!isFiled && unSaved) {
                window.parent.showTabBadgeDot(true);
                // 开始时间 默认为 上边的透析实际结束时间
                if (window.parent.getDownDate) {
                    var downDate = window.parent.getDownDate();
                    if (downDate) {
                        var newDownDate = layui.util.toDateString(downDate, "yyyy-MM-dd HH:mm");
                        layui.form.val("diaDisinfectEdit_form", {startTime: newDownDate});
                    }
                }
            } else {
                window.parent.showTabBadgeDot(false);
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
    form.on('submit(diaDisinfectEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaDisinfectEdit_submit").trigger('click');
}

/**
 * 保存透析消毒
 */
function saveDiaDisinfect() {
    verify_form(function (field) {
        var param = $.extend({}, field, {
            diaRecordId: diaDisinfectEdit.diaRecordId
        });
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaDisinfect/saveOrEdit.do",
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



