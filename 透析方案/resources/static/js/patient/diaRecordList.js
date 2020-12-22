/**
 * 患者管理　－－　病程记录
 * @author Care
 * @date 2020-09-02
 * @version 1.0
 */
var diaRecordList = avalon.define({
    $id: "diaRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    templateType: $.constant.medicalHistoryTemplateType, // 模板类型
    serverTime: new Date(),
    formReadonly: true, // 表单只读状态
    isEditMode: false, // 是否是编辑模式：true-编辑模式，false-详情模式
    patientId: "", // 患者ID（传参）
    options: { // 选项
        doctors: [], // 记录人选项
        diaRecords: [], // 透析记录选项
    },
    diaRecordList: [], // 病程记录列表
    currentDiaRecord: { // 当前选中的病程记录实体
        isAddCourse: false, // 是否是添加病程
        diaRecordId: "", // 透析记录ID
        patientName: "", // 患者姓名
        sex: "", // 患者性别
        age: "", // 患者年龄
        dialysisDate: "", // 透析日期
        courseRecordUser: "", // 记录人
        upDate: "", // 上机时间
        diseaseDiagnosis: [], // 疾病诊断
        diaUnusualRecords: [], // 异常情况
        courseRecord: "", // 病程内容
    },
});
layui.use(['index', 'laydate'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        // 初始化透析日期选择控件
        layui.laydate.render({
            elem: '#dialysisDate', type: 'date', trigger: 'click', value: "", done: function (value) {
                getDiaRecordOptions(value);
            }
        });
        // 透析记录选项切换时，自动带出对应的透析记录选项
        layui.form.on('select(diaRecordId)', function (obj) {
            if (isNotEmpty(obj.value)) {
                getRecordInfo(diaRecordId, true, true);
            }
        });

        // 初始化搜索框
        initSearch();
        // 设置表单只读
        setFormReadonly(true);
        // 初始化表单验证方法
        initFormVerify();

        // 获取请求参数
        diaRecordList.patientId = GetQueryString("patientId");
        // 获取记录人选项
        getDoctorOptions();
        // 获取病程记录列表
        getRecordList(diaRecordList.patientId);

        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#diaRecordList_search', // 指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'diaRecordList_search',  // 指定的lay-filter
        conds: [
            { field: 'dialysisDate', title: '透析日期：', type: 'date_range' }
        ],
        done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        },
        search: function (data) {
            layui.table.reload('diaRecordList_table', {
                where: data.field
            });
        }
    });
}

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
    });
}

/**
 * 设置表单是否只读
 * @param formReadonly true / false
 */
function setFormReadonly(formReadonly) {
    diaRecordList.formReadonly = formReadonly;
}

/**
 * 查询病程记录列表事件
 */
function getRecordList(patientId) {
    var param = {
        "patientId": patientId,
    };
    var table = layui.table;
    var util = layui.util;
    _layuiTable({
        elem: '#diaRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-145', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaRecord/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: {
                layout: ['prev', 'page', 'next', 'count', 'limit']
            },
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'},  //开启编辑框
                {
                    field: 'dialysisDate', title: '透析日期', align: 'center',
                    templet: function (d) {
                        return util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }
                },
                {field: 'courseRecordUserName', title: '记录人'}
            ]],
            done: function (res, curr, count) {
                diaRecordList.diaRecordList = res.bizData;

                diaRecordList.isEditMode = false;
                if (res.bizData != null && res.bizData.length > 0) {
                    // 默认选中第一笔
                    $('.layui-table-view[lay-id="diaRecordList_table"] .layui-table-box .layui-table-main table tbody tr[data-index="0"]').click();
                } else {
                    resetCurrentDiaRecord(null, false);
                    renderCurrentDiaRecord(false);
                }
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(diaRecordList_table)', function (obj) {
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        getRecordInfo(obj.data.diaRecordId, diaRecordList.isEditMode, false);
    });
}

/**
 * 重新获取透析记录信息
 * @param diaRecordId
 * @param isEditMode
 * @param isAddCourse 是否是添加病程
 */
function getRecordInfo(diaRecordId, isEditMode, isAddCourse) {
    var param = {
        diaRecordId: diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/getDiaRecord.do",
        data: param,
        dataType: "json",
        success: function(res) {
            diaRecordList.serverTime = new Date(res.ts);
        },
        done: function (data) {
            resetCurrentDiaRecord(data, isAddCourse);
            renderCurrentDiaRecord(isEditMode);
        }
    });
}

/**
 * 重置当前透析记录信息
 * @param data
 */
function resetCurrentDiaRecord(data, isAddCourse) {
    diaRecordList.currentDiaRecord.isAddCourse = isAddCourse; // 是否是添加病程
    if (data) {
        // 更新当前选中的病程记录实体
        diaRecordList.currentDiaRecord.diaRecordId = data.diaRecordId; // 透析记录ID
        diaRecordList.currentDiaRecord.patientName = data.patientName || ""; // 患者姓名
        diaRecordList.currentDiaRecord.sex = getSysDictName($.dictType.sex, data.gender); // 患者性别
        diaRecordList.currentDiaRecord.age = getUserAge(diaRecordList.serverTime, data.birthday); // 患者年龄
        diaRecordList.currentDiaRecord.dialysisDate = isEmpty(data.dialysisDate) ? "" : layui.util.toDateString(data.dialysisDate, "yyyy-MM-dd"); // 透析日期
        diaRecordList.currentDiaRecord.courseRecordUser = data.courseRecordUser || ""; // 记录人
        diaRecordList.currentDiaRecord.upDate = layui.util.toDateString(data.upDate, "yyyy-MM-dd HH:mm:ss"); // 上机时间
        diaRecordList.currentDiaRecord.diseaseDiagnosis = getDiseaseDiagnosisShowDatas(data.dialysisDiagnosis); // 疾病诊断
        diaRecordList.currentDiaRecord.diaUnusualRecords = data.diaUnusualRecords; // 异常情况
        diaRecordList.currentDiaRecord.courseRecord = data.courseRecord; // 病程内容
    } else {
        // 更新当前选中的病程记录实体
        diaRecordList.currentDiaRecord.diaRecordId = ""; // 透析记录ID
        diaRecordList.currentDiaRecord.patientName = ""; // 患者姓名
        diaRecordList.currentDiaRecord.sex = ""; // 患者性别
        diaRecordList.currentDiaRecord.age = ""; // 患者年龄
        diaRecordList.currentDiaRecord.dialysisDate = ""; // 透析日期
        diaRecordList.currentDiaRecord.courseRecordUser = ""; // 记录人
        diaRecordList.currentDiaRecord.upDate = ""; // 上机时间
        diaRecordList.currentDiaRecord.diseaseDiagnosis = []; // 疾病诊断
        diaRecordList.currentDiaRecord.diaUnusualRecords = []; // 异常情况
        diaRecordList.currentDiaRecord.courseRecord = ""; // 病程内容
    }
}

/**
 * 显示当前透析记录内容
 * @param isEdit true：编辑模式，false：详情模式
 */
function renderCurrentDiaRecord(isEdit) {
    // 显示异常情况
    renderUnusualRecordData(diaRecordList.currentDiaRecord.diaUnusualRecords);
    // 重新渲染表单
    layui.form.val('diaRecordList_form', {
        dialysisDate: diaRecordList.currentDiaRecord.dialysisDate,
        courseRecordUser: diaRecordList.currentDiaRecord.courseRecordUser,
        diaRecordId: diaRecordList.currentDiaRecord.diaRecordId,
        courseRecord: diaRecordList.currentDiaRecord.courseRecord
    });

    if (isEdit) {
        // 编辑模式：隐藏“详情模式”，显示“编辑模式”
        diaRecordList.isEditMode = true;
        setFormReadonly(false);
    } else {
        // 详情模式：显示“详情模式”，隐藏“编辑模式”
        diaRecordList.isEditMode = false;
        setFormReadonly(true);
    }
    layui.form.render();
}

/**
 * 获取记录人选项
 */
function getDoctorOptions() {
    _ajax({
        type: "POST",
        loading: true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.system + "/sysUser/getDoctorRoleList.do",
        data: {},
        dataType: "json",
        done: function (data) {
            diaRecordList.options.doctors = data;
            layui.form.val('diaRecordList_form', {
                courseRecordUser: diaRecordList.currentDiaRecord.courseRecordUser, // 记录人
            });
            layui.form.render();
        }
    });
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
function getDiseaseDiagnosisShowDatas(diseaseDiagnosis) {
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
        $.each(diseaseDiagnosis, function (index, item) {
            if (descDataMap[item.diagnosisType]) {
                var descDataItem = descDataMap[item.diagnosisType];
                descDataItem.diagnosis.push({
                    shortName: descDataItem.shortName,
                    color: descDataItem.color,
                    icdCode: item.icdCode,
                    diagnoseDetailName: item.diagnoseDetailName
                });
            }
        });
    }

    // 汇总诊断数据
    var result = [];
    $.each(descData, function (index, item) {
        result = result.concat(item.diagnosis);
    });
    return result;
}

/**
 * 显示异常情况
 * @param tableData
 */
function renderUnusualRecordData(tableData) {
    var table = layui.table;
    var util = layui.util;
    table.render({
        elem: '#diaUnusualRecordList_table',
        cols: [[
            {
                field: 'monitorTime', title: '记录时间', align: 'center', width: 90,
                templet: function (row) {
                    return isEmpty(row.monitorTime) ? '' : util.toDateString(row.monitorTime, "HH:mm");
                }
            },
            {
                field: 'unusualDetails', title: '病症及体征', align: 'left', style: "vertical-align: top;",
                templet: function (row) {
                    var unusualDetails = row.unusualDetails.split(",");
                    var html = "";
                    $.each(unusualDetails, function (index, item) {
                        html += '<div>' +
                            '<span class="layui-badge-dot layui-bg-black"></span>' +
                            '<span style="font-size: 14px; margin-left: 5px">'+ getSysDictName($.dictType.UnusualDetails, item) + '</span>' +
                            '</div>';
                    });
                    return html;
                }
            },
            {field: 'handleDetails', title: '处理', align: 'left', style: "vertical-align: top;"},
            {field: 'handleResults', title: '结果', align: 'left', style: "vertical-align: top;"},
        ]],
        data: tableData,
        even: true
    });
}

/**
 * 添加按钮事件：清空表单，并切换成编辑模式
 */
function onAddRecord() {
    diaRecordList.options.diaRecords = [];
    resetCurrentDiaRecord(null, true);
    renderCurrentDiaRecord(true);
}

/**
 * 取消按钮事件：重新选中当前病程记录
 */
function onCancelEditRecord() {
    var selectedTr = $('.layui-table-view[lay-id="diaRecordList_table"] .layui-table-box .layui-table-main table tbody tr.layui-table-click');
    if (selectedTr.length > 0) {
        diaRecordList.isEditMode = false;
        selectedTr.click();
    } else {
        resetCurrentDiaRecord(null, false);
        renderCurrentDiaRecord(false);
    }
}

/**
 * 删除病程记录
 * @param ids
 */
function deleteCourseRecord() {
    if (isEmpty(diaRecordList.currentDiaRecord.diaRecordId)) {
        warningToast("请选择要删除的数据行");
        return false;
    }

    // 成功验证后
    var param = { diaRecordId: diaRecordList.currentDiaRecord.diaRecordId };
    layer.confirm('确定删除所选记录吗？', function (index) {
        layer.close(index);
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/deleteCourseRecord.do",
            data: param,  //必须字符串后台才能接收list,
            loading: false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function (data) {
                successToast("删除成功");
                setTimeout(function () {
                    layui.table.reload('diaRecordList_table'); //重新刷新table
                }, 1000);
            }
        });
    });
}

/**
 * 获取当天的透析记录选项
 */
function getDiaRecordOptions(dialysisDate) {
    if (isEmpty(dialysisDate)) {
        warningToast("请选择透析日期");
        return;
    } else {
        diaRecordList.options.diaRecords = [];
        layui.form.render();

        var param = {
            patientId: diaRecordList.patientId,
            dialysisDate: dialysisDate,
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/thisDayDiaRecord.do",
            data: param,
            dataType: "json",
            done: function (data) {
                if (data && data.length > 0) {
                    $.each(data, function (index, item) {
                        item.upDate = layui.util.toDateString(item.upDate, "yyyy-MM-dd HH:mm:ss");
                    });
                    diaRecordList.options.diaRecords = data;
                    layui.form.render();
                } else {
                    warningToast("该患者当天未透析");
                }

                var diaRecordId = layui.form.val("diaRecordList_form").diaRecordId;
                if (isNotEmpty(diaRecordId)) {
                    getRecordInfo(diaRecordId, true, true);
                }
            }
        });
    }
}

/**
 * 病程內容- 提取模板
 */
function onImportCourseRecordTemplate() {
    baseFuncInfo.onImportFromContentTemplate("提取模板", diaRecordList.templateType.PROGRESSCONTENT, function (data) {
        layui.form.val("diaRecordList_form", {courseRecord: data.templateContent});
        successToast("导入成功");
    });
}

/**
 * 病程內容- 保存模板
 */
function onSaveCourseRecordTemplate() {
    var courseRecordContent = layui.form.val("diaRecordList_form").courseRecord;
    if (isEmpty(courseRecordContent)) {
        return warningToast("请填写病程內容");
    } else {
        baseFuncInfo.onExportContentTemplate("保存模板", diaRecordList.templateType.PROGRESSCONTENT, courseRecordContent, function (templateConten) {
            successToast("保存成功");
        });
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(diaRecordList_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#diaRecordList_submit").trigger('click');
}

/**
 * 保存病程记录
 */
function saveCoursInfo() {
    // 对表单验证
    verify_form(function (field) {
        if (diaRecordList.currentDiaRecord.isAddCourse && isEmpty(field.diaRecordId)){
            warningToast("请选择透析信息");
            return false;
        }

        field.diaRecordId = diaRecordList.currentDiaRecord.isAddCourse ? field.diaRecordId : diaRecordList.currentDiaRecord.diaRecordId;
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/saveCourseRecord.do",
            data: field,
            dataType: "json",
            done: function (data) {
                successToast("添加成功");
                setTimeout(function () {
                    layui.table.reload('diaRecordList_table'); //重新刷新table
                }, 1000);
            }
        });
    });
}

/**
 * 导出word
 */
function exportWord() {
    var checkStatus = layui.table.checkStatus('diaRecordList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条纪录");
        return false;
    }

    var diaRecordIds = [];
    $.each(data, function (i, item) {
        diaRecordIds.push(item.diaRecordId);
    });
    var url = $.config.server + "/patient/diaRecordExportWord?diaRecordIds=" + diaRecordIds + "&patientId=" + diaRecordList.patientId;
    _layerOpen({
        openInParent: true,
        url: url,  // 弹框自定义的url，会默认采取type=2
        width: 750, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 1000,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "导出word", // 弹框标题
        btn: ["导出", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onExportWord();
        }
    });
}
