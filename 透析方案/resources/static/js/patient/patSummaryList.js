/**
 * 患者管理 - 阶段小结
 * @Author swn
 * @version: 1.0
 * @Date 2020/8/20
 */
var patSummaryList = avalon.define({
    $id: "patSummaryList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    formReadonly: true, // 表单只读状态
    isEditMode: false, // 是否是编辑模式：true-编辑模式，false-详情模式
    patientId: "", // 患者ID（传参）
    patSummarys: [], // 阶段小结列表
    patSummary: {}, // 当前选中的阶段小结实体
    addSummaryId: "", // 添加后返回的阶段小结ID
    options: { // 选项
        anticoagulant: getSysDictByCode($.dictType.Anticoagulant), // 抗凝方式,
        anticoagulantUnit: getSysDictByCode($.dictType.AnticoagulantUnit), // 抗凝方式单位,
        assess: [ // 评估选项
            { name: "达标", value: "Y" },
            { name: "不达标", value: "N" },
        ],
        assessGroup: [
            { value: "renalAnemiaAssess", name: "1. 肾性贫血评估", fields: ["hemoglobin", "hematocrit", "platelet", "reticulocyte", "totalIronBindingForce", "transferrinSaturation", "serumIron", "serumFerritin"] },
            { value: "ckdMbdAssess", name: "2. CKD-MBD评估", fields: ["preDialysisCalcium", "preDialysisPhosphorus", "ipth", "calciumPhosphorusProduct"] },
            { value: "nutritionalAssess", name: "3. 营养评估", fields: ["albumin"] },
            { value: "bloodFatAssess", name: "4. 血脂评估", fields: ["cholesterol", "triglyceride", "lowDensityLipoprotein", "highDensityLipoprotein"] },
            { value: "bloodSugarAssess", name: "5. 血糖评估", fields: ["fastingBloodGlucose"] },
            { value: "potassiumSodiumAssess", name: "6. 钾钠评估", fields: ["preDialysisPotassium", "postDialysisPotassium", "preDialysisSodium", "postDialysisSodium"] },
            { value: "dialysisAdequacyAssess", name: "7. 透析充分性评估", fields: ["ktv", "urr", "preDialysisUreaNitrogen", "postDialysisUreaNitrogen", "preDialysisCreatinine", "postDialysisCreatinine"] },
            { value: "otherAssess", name: "8. 其他化验评估", fields: ["alt", "ast", "preDialysisCarbonDioxide", "postDialysisCarbonDioxide"] },
            { value: "inspectAssess", name: "9. 辅助检查", fields: ["chestFilm", "ecg", "ultrasonicCardiography", "auxiliaryOther"] },
        ],
    }
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 初始化年份选择控件
        layui.laydate.render({
            elem: '#yearSearch', type:'year', format: 'yyyy 年',
            done: function(value, date) {
                // 年份改变时重新查询Table
                var yearSearch = parseInt(value) || "";
                layui.table.reload('patSummaryList_table', {
                    where: { year: yearSearch, patientId: patSummaryList.patientId }
                });
            }
        });
        // 默认年份选择当前年
        $('#yearSearch').val(layui.util.toDateString(new Date(), "yyyy 年"));
        // 设置表单只读
        setFormReadonly(true);
        // 初始化表单验证方法
        initFormVerify();

        // 获取请求参数
        patSummaryList.patientId = GetQueryString("patientId");

        // 初始化阶段小结Table
        var field = { year: parseInt($('#yearSearch').val()) || "", patientId: patSummaryList.patientId };
        initSummaryListTable(field);

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
 * 设置表单是否只读
 * @param formReadonly true / false
 */
function setFormReadonly(formReadonly) {
    patSummaryList.formReadonly = formReadonly;
}

/**
 * 查询列表事件
 */
function initSummaryListTable(field) {
    _layuiTable({
        elem: '#patSummaryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patSummaryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-140', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patSummary/listAll.do", // ajax的url必须加上getRootPath()方法
            where: field, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                { field: 'summaryId', hide: true, templet: function (d) { return d.summaryId; } }, // templet用于占位，layui自动存值到td上
                { field: 'year', align: 'center', templet: function (d) { return getSummaryTitle(d); } }
            ]],
            done: function (res, curr, count) {
                patSummaryList.patSummarys = res.bizData;
                if (res.bizData != null && res.bizData.length > 0) {
                    // 默认选中新增的阶段小结
                    if (isNotEmpty(patSummaryList.addSummaryId)) {
                        var addSummaryId = patSummaryList.addSummaryId;
                        patSummaryList.addSummaryId = "";
                        patSummaryList.isEditMode = true;
                        $('.layui-table-view[lay-id="patSummaryList_table"] .layui-table-main table tbody td[data-field="summaryId"][data-content="' + addSummaryId + '"]').closest("tr[data-index]").click();
                    } else {
                        // 默认选中第一笔
                        patSummaryList.isEditMode = false;
                        $('.layui-table-view[lay-id="patSummaryList_table"] .layui-table-box .layui-table-main table tbody tr[data-index="0"]').click();
                    }
                } else {
                    // 设置并显示当前显示阶段小结内容
                    patSummaryList.patSummary = null;
                    renderCurrentPatSummary(false);
                }

                // 隐藏表头
                $('th').hide();//表头隐藏的样式
                $('.layui-table-page').css('margin-top', '40px');//页码部分的高度调整
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {

        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    layui.table.on('row(patSummaryList_table)', function(obj) {
        // 标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');

        getSummaryInfo(obj.data.summaryId, patSummaryList.isEditMode);
    });
}

/**
 * 打开阶段小结模板管理页面
 */
function onOpenSummaryTemplateWin(){
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patSummaryTemplate?patientId=" + patSummaryList.patientId,  // 弹框自定义的url，会默认采取type=2
        width: 1200, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "阶段小结模板", // 弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.saveSummaryTemplate(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打开打印弹窗
 */
function onOpenSummaryPrintWin() {
    if (isEmpty(patSummaryList.patSummary.summaryId)) {
        warningToast("请选择需要打印的阶段小结内容");
        return false;
    }

    var url = $.config.server + "/patient/patSummaryPrint?summaryId=" + patSummaryList.patSummary.summaryId;
    _layerOpen({
        openInParent: true,
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 800, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 1000,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 显示当前阶段小结内容
 * @param isEdit true：编辑模式，false：详情模式
 */
function renderCurrentPatSummary(isEdit) {
    if (patSummaryList.patSummary) {
        var data = JSON.parse(JSON.stringify(patSummaryList.patSummary));

        // 获取阶段小结名称
        data.summaryTitle = getSummaryTitle(data);
        // 获取透析方式显示
        data.dialysisModeWithTimesVal = getDialysisModeWithTimesVal(data.dialysisModeWithTimes);
        // 重新渲染表单
        layui.form.val('patSummaryEdit_form', data);
        layui.form.render();

        // 编辑模式 && 若干体重为空，则表示为未保存过，需自动获取最新透析概要
        if (isEdit && isEmpty(data.dryWeight)) {
            getDiaRecordLately();
        }
    } else {
        $("#patSummaryEdit_form")[0].reset();
        layui.form.render();
    }

    if (isEdit) {
        // 编辑模式：隐藏“详情模式”，显示“编辑模式”
        patSummaryList.isEditMode = true;
        setFormReadonly(false);
    } else {
        // 详情模式：显示“详情模式”，隐藏“编辑模式”
        patSummaryList.isEditMode = false;
        setFormReadonly(true);
    }
    layui.form.render();
}

/**
 * 打开新增页面
 */
function onOpenAddSummaryWin() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patSummaryEdit?patientId=" + patSummaryList.patientId,  //弹框自定义的url，会默认采取type=2
        width: 500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 420,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "新增", //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success(year, summaryId) {
                    // 更新当前选中阶段小结
                    patSummaryList.addSummaryId = summaryId;

                    successToast("保存成功");
                    // 重新刷新table
                    $('#yearSearch').val(year);
                    layui.table.reload('patSummaryList_table', {
                        where: { year: year, patientId: patSummaryList.patientId }
                    });
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 打开导入评估值页面
 */
function onOpenImportAssessWin() {
    _layerOpen({
        openInParent: true,
        url: $.config.server + "/patient/patSummaryImportAssess?patientId=" + patSummaryList.patientId,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 620,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "从化验记录导入评估值", //弹框标题
        btn: ["导入", "取消"],
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.onImportAssess(
                //成功保存之后的操作，刷新页面
                function success(assessGroups, allImportData) {
                    var formData = {};
                    if (assessGroups && allImportData) {
                        $.each(patSummaryList.options.assessGroup, function (index, item) {
                            var isCheckedGroup = assessGroups.indexOf(item.value) >= 0; // 选中的评估组
                            if (isCheckedGroup == false) { return true; }

                            // 将选中的评估组中包含的属性，从导入数据中复制到表单数据对象
                            $.each(item.fields, function (fieldIndex, fieldCode) {
                                if (fieldCode in allImportData) {
                                    formData[fieldCode] = allImportData[fieldCode];
                                }

                            });
                        });
                    }

                    if (JSON.stringify(formData) === "{}") {
                        warningToast("无可用的导入评估值");
                    } else {
                        // 重新赋值表单
                        layui.form.val("patSummaryEdit_form", formData);

                        successToast("导入成功");
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                }
            );
        }
    });
}

/**
 * 重新获取阶段小结信息
 */
function getSummaryInfo(summaryId, isEditMode) {
    var param = {
        summaryId: summaryId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummary/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            patSummaryList.patSummary = data;
            renderCurrentPatSummary(isEditMode);
        }
    });
}

/**
 * 获取最近一条患者透析记录
 */
function getDiaRecordLately() {
    if (!patSummaryList.patSummary) {
        warningToast("请选择阶段小结内容");
    }

    var beginDate;
    var endDate;
    if (patSummaryList.patSummary.summaryType == $.constant.SummaryType.MONTH) { // 月份
        var year = Number(patSummaryList.patSummary.year);
        var month = Number(patSummaryList.patSummary.monthOrQuarter) - 1;
        beginDate = new Date(year, month);
        endDate = new Date(year, month + 1, 0);
    } else { // 季度
        var year = Number(patSummaryList.patSummary.year);
        var endMonth = Number(patSummaryList.patSummary.monthOrQuarter) * 3 - 1;
        beginDate = new Date(year, endMonth - 2);
        endDate = new Date(year, endMonth);
    }

    var param = {
        patientId: patSummaryList.patientId,
        beginDate: layui.util.toDateString(beginDate, "yyyy-MM-dd"),
        endDate: layui.util.toDateString(endDate, "yyyy-MM-dd")
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummary/getDiaRecordLately.do",
        data: param,
        dataType: "json",
        done: function (data) {
            if (data) {
                successToast("获取最新透析概要成功");
                data.dialysisModeWithTimesVal = getDialysisModeWithTimesVal(data.dialysisModeWithTimes);
                layui.form.val('patSummaryEdit_form', data);
                layui.form.render();
            } else {
                warningToast("该患者暂无最新透析概要");
            }
        }
    });
}

/**
 * 查询患者模板
 */
function getPatSummaryTemplate() {
    var param = {
        patientId: patSummaryList.patientId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummaryTemplate/getTemplateByPatientId.do", // ajax的url必须加上getRootPath()方法
        data: param,
        dataType: "json",
        done: function (data) {
            if (isEmpty(data.summaryTemplateId)) {
                warningToast("该患者暂未添加模板");
            } else {
                var oldPatSummary = patSummaryList.patSummary;
                data.summaryId = oldPatSummary.summaryId;
                data.patientId = oldPatSummary.patientId;
                data.year = oldPatSummary.year;
                data.summaryType = oldPatSummary.summaryType;
                data.monthOrQuarter = oldPatSummary.monthOrQuarter;

                // 设置并显示当前显示阶段小结内容
                patSummaryList.patSummary = data;
                renderCurrentPatSummary(patSummaryList.isEditMode);
            }
        }
    });
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
 * 保存阶段小结
 */
function saveSummary() {  //菜单保存操作
    // 对表单验证
    onVerifySummaryEditForm(function (field) {
        //成功验证后
        var param = field; //表单的元素
        param.summaryId = patSummaryList.patSummary.summaryId;
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis + "/patSummary/editInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                successToast("保存成功");
                setTimeout(function () {
                    getSummaryInfo(patSummaryList.patSummary.summaryId, false);
                }, 1000);
            }
        });
    });
}

/**
 * 删除阶段小结（当前）
 * @returns {boolean}
 */
function deleteSummary() {
    var summaryId = patSummaryList.patSummary.summaryId;
    if (isEmpty(summaryId)) {
        warningToast("请选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            deleteSummarys([summaryId]);
        });
    }
}

/**
 * 删除阶段小结（多笔）
 * @param ids
 */
function deleteSummarys(summaryIds) {
    var param = {
        "summaryIds": summaryIds
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patSummary/delete.do",
        data: param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            layui.table.reload('patSummaryList_table'); //重新刷新table
        }
    });
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
