/**
 * 患者管理 - 阶段小结模板管理
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/20
 */
var patSummaryTemplate = avalon.define({
    $id: "patSummaryTemplate",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    formReadonly: false, // 表单只读状态
    patientId: "", // 患者ID（传参）
    patSummaryTemplate: [], // 表单实体
    options: { // 选项
        anticoagulant: getSysDictByCode($.dictType.Anticoagulant), // 抗凝方式,
        anticoagulantUnit: getSysDictByCode($.dictType.AnticoagulantUnit), // 抗凝方式单位,
        assess: [ // 评估选项
            { name: "达标", value: "Y" },
            { name: "不达标", value: "N" },
        ]
    }
});
layui.use(['index'], function() {
    avalon.ready(function () {
        // 获取请求参数
        patSummaryTemplate.patientId = GetQueryString("patientId");
        // 初始化表单验证方法
        initFormVerify();

        // 查询患者模板
        getPatSummaryTemplate();

        avalon.scan();
    });
});

layui.use(['dropdown'], function () {
    var dropdown = layui.dropdown;
    dropdown.suite("[lay-filter='dialysisModeWithTimesId']", {
        template: "#dialysisModeWithTimesOptionsTemp",
        success: function ($dom) {
        }
    });
});
/**
 * 透析方式表单：点击时弹窗下拉选单
 */
$("#dialysisModeWithTimesId").click(function () {
    // 计算弹框宽度
    var offsetWidth = document.getElementById("dialysisModeWithTimesId").offsetWidth - 20 + "px";

    // 获取透析方式（次数）值
    var formData = layui.form.val("patSummaryEdit_form");
    var dialysisModeWithTimes = isNotEmpty(formData.dialysisModeWithTimes) ? JSON.parse(formData.dialysisModeWithTimes) : [];
    var dialysisModeWithTime = {};
    $.each(dialysisModeWithTimes, function (index, item) {
        dialysisModeWithTime[item.dialysisMode] = item.dialysisTimes;
    });

    // 拼接透析方式（次数）弹框内容
    var html = '';
    var dialysisModeDict = baseFuncInfo.getSysDictByCode($.dictType.DialysisMode);
    $.each(dialysisModeDict, function (index, item) {
        var isChecked = (item.value in dialysisModeWithTime);
        var times = (isChecked ? dialysisModeWithTime[item.value] : "");
        var checkModeBox = '<input type="checkbox" lay-skin="primary" lay-verify="checkbox" lay-verify-msg="透析方式" name="dialysisMode" ' +
            'value="' + item.value + '" title="'+ item.name + '" ' + (isChecked ? 'checked' : '') + '>';
        var inputTimesBox = '<input type="text" name="modeWithTimes" value="' + times + '">';

        html += '<div class="layui-row" style="width: ' + offsetWidth + '">' +
            '   <div class="layui-col-sm12 layui-col-md12 layui-col-lg12">\n' +
            '       <div class="disui-form-flex">' +
            '           <div style="width: 40%; line-height: 38px;">' +
            checkModeBox +
            '           </div>' +
            inputTimesBox +
            '           <span>次</span>' +
            '       </div>' +
            '   </div>' +
            '</div>';
    });
    $("#dialysisModeWithTimesOption").html(html);
    layui.form.render('checkbox');
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
 * 查询患者模板
 */
function getPatSummaryTemplate() {
    var param = {
        patientId: patSummaryTemplate.patientId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummaryTemplate/getTemplateByPatientId.do", // ajax的url必须加上getRootPath()方法
        data: param,
        dataType: "json",
        done: function (data) {
            patSummaryTemplate.patSummaryTemplate = data;
            renderCurrentPatSummaryTemplate();
        }
    });
}

/**
 * 显示当前显示阶段小结模板内容
 */
function renderCurrentPatSummaryTemplate() {
    if (patSummaryTemplate.patSummaryTemplate) {
        var data = JSON.parse(JSON.stringify(patSummaryTemplate.patSummaryTemplate));

        // 获取透析方式显示
        data.dialysisModeWithTimesVal = getDialysisModeWithTimesVal(data.dialysisModeWithTimes);

        layui.form.val('patSummaryEdit_form', data);
        layui.form.render();
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function onVerifySummaryEditForm($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(patSummaryEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#patSummaryEdit_submit").trigger('click');
}

/**
 * 保存阶段小结模板
 */
function saveSummaryTemplate($callback) {  //菜单保存操作
    // 对表单验证
    onVerifySummaryEditForm(function (field) {
        var param = field; //表单的元素
        param.patientId = patSummaryTemplate.patientId;
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/patSummaryTemplate/editInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 取消编辑透析方式
 */
function onCancelDialysisModeWithTimes() {
    layui.dropdown.hide("[lay-filter='dialysisModeWithTimesId']");
}

/**
 * 确定编辑透析方式
 * @returns {boolean}
 */
function onSaveDialysisModeWithTimes() {
    var target = $("#dialysisModeWithTimesOption");

    // 验证是否有勾选透析方式
    if (target.find("input:checkbox[name='dialysisMode']:checked").length == 0) {
        warningToast("请勾选透析方式");
        return false;
    }

    // 验证勾选透析方式是否有对应填写次数，并处理显示和保存值
    var withErrors = false;
    var dialysisModeWithTimes = [];
    var dialysisModeWithTimesVals = [];
    $(target.find(".layui-row")).each(function (index, rowTarget) {
        var checkModeBox = $(rowTarget).find("input:checkbox[name='dialysisMode']");
        var inputTimesBox = $(rowTarget).find("input[name='modeWithTimes']");
        var isChecked = checkModeBox.is(":checked");
        var dialysisModeName = checkModeBox.attr("title");
        var dialysisMode = checkModeBox.val();
        var dialysisTimes = inputTimesBox.val();

        // 未选中则继续下一行
        if (!isChecked) { return true; }

        if (isEmpty(dialysisTimes)) {
            warningToast("请填写已勾选的透析方式次数");
            withErrors = true;
            return false;
        } else {
            var errorMsg = fieldNotInRange(dialysisTimes, { fieldName: "透析方式次数", minValue: 1, maxValue: 999, isInteger: true });
            if (isNotEmpty(errorMsg)) {
                warningToast(errorMsg);
                withErrors = true;
                return false;
            } else {
                dialysisModeWithTimes.push({dialysisMode: dialysisMode, dialysisTimes: dialysisTimes});
                dialysisModeWithTimesVals.push(dialysisModeName + "（" + dialysisTimes + "次）");
            }
        }
    });

    // 若验证成功，则回显表单数据
    if (!withErrors) {
        layui.form.val("patSummaryEdit_form", {
            dialysisModeWithTimesVal: dialysisModeWithTimesVals.join("，"),
            dialysisModeWithTimes: JSON.stringify(dialysisModeWithTimes)
        });
        layui.dropdown.hide("[lay-filter='dialysisModeWithTimesId']");
    }
}

/**
 * 获取透析方式显示内容
 * @param jsonDialysisModeWithTimes [
 *     {
 *         dialysisMode: "", // 透析方式Code
 *         dialysisTimes: 4 // 透析次数
 *     },
 *     ...
 * ]
 * @returns {string}
 */
function getDialysisModeWithTimesVal(jsonDialysisModeWithTimes) {
    var dialysisModeWithTimesDesc = "";
    if (isNotEmpty(jsonDialysisModeWithTimes)) {
        var dialysisModeWithTimes = JSON.parse(jsonDialysisModeWithTimes);
        var dialysisModeWithTimesVals = [];
        $.each(dialysisModeWithTimes, function (i, item) {
            var dictName = getSysDictName("DialysisMode", item.dialysisMode);
            var times = isNotEmpty(item.dialysisTimes) ? item.dialysisTimes : 0;
            if (isNotEmpty(dictName)) {
                dialysisModeWithTimesVals.push(dictName + "（" + times + "次）");
            }
        });
        dialysisModeWithTimesDesc = dialysisModeWithTimesVals.join("，");
    }
    return dialysisModeWithTimesDesc;
}
