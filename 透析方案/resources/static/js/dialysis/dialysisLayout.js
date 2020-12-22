/**
 * 透析管理 - Layout共用布局
 * @author: Allen
 * @version: 1.0
 * @date: 2020/09/04
 */

var dialysisLayout = avalon.define({
    $id: "dialysisLayout",
    config: {
        // 医保平台处方单状态
        receivableStatus: $.constant.ReceivableStatus,
        // 透析记录状态显示及标记颜色
        recordStatusLabel: {
            SIGNED: { label: "签到", color: "rgb(118, 192, 187)" }, // 已签到/待接诊
            RECEIVED: { label: "接诊", color: "rgb(251, 123, 123)" }, // 已接诊/待评估
            FILED: { label: "归档", color: "#1E9FFF" } // 归档
        }
    },
    baseFuncInfo: baseFuncInfo, //底层基本方法
    serverTime: new Date(),
    menuList: [], // 菜单列表
    patientList: {  // 患者列表
        rawData: [], // 患者列表数据（请求结果）
        data: [], // 患者列表数据（前端条件过滤/排序）
        errorMsg: ''
    },
    currentPageHref: '', // 当前子页面链接
    currentPageCallback: { // 当前页面回调方法
        // 保存按钮回调：可用于保存子页面操作 function() { ... }
        onSave: null,
        // 获取预计透析时长回调：可获取预计透析时长 function() { return {dialysisTime: 0}; }
        onGetPlanDialysisTime: null,
        // 获取实际透析时长回调：可获取实际透析时长 function() { return {dialysisTimeHour: 0, dialysisTimeMin: 0}; }
        onGetRelDialysisTime: null,
    },
    withSaveBriefAuth: baseFuncInfo.authorityTag('dialysisLayout#saveBrief'), // 是否有保存透析（上下机）时间权限
    currentPatient: { // 当前选中患者信息
        patientId: "", // 患者ID
        patientName: "", // 姓名
        recordOptions: [], // 可选透析记录选项
        isPatientSign: false, // 患者是否已签到
        diaRecordId: "", // 选中透析记录ID
        recordStatus: "", // 选中透析记录 - 透析记录状态
        receivableStatus: "", // 选中透析记录 - 医保结算平台处方单状态
        isRecordFiled: false, // 选中透析记录 - 是否已归档
        prescriptionItemCount: 0, // 处方明细数量
        baseSaveStatus:"",//透析治疗
        hasAssess:false,//透前评估
        hasExecuteOrder:false,//执行医嘱
        hasMonitorRecord:false,//监测记录
        hasUnusualRecord:false,//异常监测记录
        courseRecord:"",//病程记录
        hasCrossCheck:false,//交叉核对
        summarySaveStatus:"",//透后小结
        hasPrescriptionItem:false,//处方明细
        disinfectSaveStatus:"",//透析消毒
        hasEduTeach:false,//宣教
    },
    refreshPageFlag: false, // 用于弹窗完成后刷新整个页面（如透析历史中有删除时，需刷新）
});

layui.use(['index'], function () {
    avalon.ready(function () {
        // 获取请求参数
        var requestUrl = window.location.href;
        dialysisLayout.currentPageHref = GetUrlQueryString(requestUrl, "href");
        dialysisLayout.currentPatient.patientId = GetUrlQueryString(requestUrl, "patientId");
        dialysisLayout.currentPatient.diaRecordId = GetUrlQueryString(requestUrl, "diaRecordId");
        var searchParams = {
            dialysisDate: GetUrlQueryString(requestUrl, "qDialysisDate"),
            scheduleShift: GetUrlQueryString(requestUrl, "qScheduleShift"),
            regionSettingId: GetUrlQueryString(requestUrl, "qRegionSettingId"),
            patientName: GetUrlQueryString(requestUrl, "qPatientName")
        };

        // 患者列表默认显示已签到列表
        layui.form.val("dialysisLayout_searchOrder", { patientStatus: "sign|true", patientOrder: "signNum|true" });

        // 初始化页签菜单
        initTabMenu();
        // 初始化搜索框
        initSearch(searchParams);
        // 初始化患者列表
        initPatientList(searchParams);
        // 初始化透析简要信息表单
        initBriedForm();

        // 根据参数，初始化选中功能页签选中效果
        var firstPageHref = dialysisLayout.menuList.length > 0 ? dialysisLayout.menuList[0].menuUrl : "";
        dialysisLayout.currentPageHref = dialysisLayout.currentPageHref || firstPageHref;
        $(".layui-tab-dis-sub .layui-tab-title").find("li").removeClass("layui-this");
        $(".layui-tab-dis-sub .layui-tab-title li[data-href='" + dialysisLayout.currentPageHref + "']").addClass("layui-this");
        // 重新渲染头部导航
        onBreadcrumbsChange();

        avalon.scan();
    });
});

/**
 * 初始化页签菜单
 */
function initTabMenu() {
    // 渲染页签功能
    dialysisLayout.menuList = baseFuncInfo.getMenusForDialysis();
    layui.element.render('tab', 'dialysisLayout_progressTab');

    // 页签点击事件
    $(".layui-tab-dis-sub .layui-tab-title").on("click", "li[data-href]", function () {
        // 标记菜单项选中
        $(".layui-tab-dis-sub .layui-tab-title").find("li").removeClass("layui-this");
        $(".layui-tab-dis-sub .layui-tab-title li[data-href='" + dialysisLayout.currentPageHref + "']").addClass("layui-this");

        // 更新当前功能页面链接
        dialysisLayout.currentPageHref = $(this).attr("data-href");

        // 刷新功能页面
        onRefreshFunctionPage();
        // 重新渲染头部导航
        onBreadcrumbsChange();
    });
}

/**
 * 刷新功能页面
 */
function onRefreshFunctionPage() {
    //清空保存的标记点  归档无标记点
    refluseDot();

    // 清空回调事件
    dialysisLayout.currentPageCallback.onSave = null;
    dialysisLayout.currentPageCallback.onGetPlanDialysisTime = null;
    dialysisLayout.currentPageCallback.onGetRelDialysisTime = null;

    layui.use(['form', 'laydate', 'formSelects'], function () {
        var form = layui.form;

        // 获取页面参数
        var pageHref = dialysisLayout.currentPageHref;
        var patientId = dialysisLayout.currentPatient.patientId;
        var diaRecordId = dialysisLayout.currentPatient.diaRecordId;
        // 只读状态（记录已归档时，只读）
        var readonly = dialysisLayout.currentPatient.isRecordFiled ? "Y" : "N";
        var searchData = form.val("dialysisLayout_search");

        // 更新当前iframe地址
        var newSrc = $.config.server + "/dialysis/dialysisLayout#?href=" + pageHref + "&patientId=" + patientId
            + "&diaRecordId=" + diaRecordId + "&qDialysisDate=" + searchData.dialysisDate + "&qScheduleShift=" + searchData.scheduleShift
            + "&qRegionSettingId=" + searchData.regionSettingId + "&qPatientName=" + searchData.patientName;
        $(window.parent.document).find("#LAY_app_body .layadmin-tabsbody-item.layui-show iframe").attr("src", newSrc);

        // 更新嵌套iframe地址
        var newSubSrc = $.config.server + pageHref + "?patientId=" + patientId + "&diaRecordId=" + diaRecordId + "&readonly=" + readonly;
        $("#dialysisAppBodyIframe").attr("src", newSubSrc);
    });
}

/**
 * 刷新红点
 */
function refluseDot(){
    if(dialysisLayout.currentPatient.isRecordFiled == $.constant.dialysisRecordStatus.FILED || !dialysisLayout.currentPatient.isPatientSign){
        $(".dialysis-layout-body .layui-tab-dis-sub .layui-tab-title li .layui-badge-dot").addClass("layui-hide"); // 清空标记点
    }else {
        if(dialysisLayout.currentPatient.baseSaveStatus == "Y"){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaBaseList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaBaseList'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.hasAssess){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaAssessList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaAssessList'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.hasExecuteOrder){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaExecuteOrderList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaExecuteOrderList'] .layui-badge-dot").removeClass("layui-hide");
        }
        //异常检测和检测记录都算
        if(dialysisLayout.currentPatient.hasMonitorRecord || dialysisLayout.currentPatient.hasUnusualRecord){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaMonitorRecordList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaMonitorRecordList'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(isNotEmpty(dialysisLayout.currentPatient.courseRecord)){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/patient/diaRecordEdit'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/patient/diaRecordEdit'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.hasCrossCheck){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaCrossCheckEdit'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaCrossCheckEdit'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.summarySaveStatus == "Y"){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaSummaryEdit'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaSummaryEdit'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.hasPrescriptionItem){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaPrescriptionItemList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaPrescriptionItemList'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.disinfectSaveStatus == "Y"){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaDisinfectEdit'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaDisinfectEdit'] .layui-badge-dot").removeClass("layui-hide");
        }
        if(dialysisLayout.currentPatient.hasEduTeach){
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaEduTeachList'] .layui-badge-dot").addClass("layui-hide");
        }else {
            $(".layui-tab-dis-sub .layui-tab-title li[data-href='/dialysis/diaEduTeachList'] .layui-badge-dot").removeClass("layui-hide");
        }
    }
}

/**
 * 选中菜单改变时，重新渲染头部导航
 */
function onBreadcrumbsChange() {
    setTimeout(function () {
        var selectedAObj = $(".layui-tab-dis-sub .layui-tab-title li.layui-this");
        if (selectedAObj.length > 0) {
            var appendBreadcrumbs = [selectedAObj.text()];
            dialysisLayout.baseFuncInfo.resetBreadcrumbs(appendBreadcrumbs);
        }
    }, 200);
}

/**
 * 初始化搜索框
 */
function initSearch(searchParams) {
    _initSearch({
        elem: '#dialysisLayout_search',
        filter: 'dialysisLayout_search',
        conds: [
            {field: 'dialysisDate', title: '透析日期：', type: 'date', value: searchParams.dialysisDate},
            {field: 'scheduleShift', title: '班次：', type: 'select', data: getSysDictByCode("Shift", true), value: searchParams.scheduleShift},
            {field: 'regionSettingId', title: '区组：', type: 'select', data: getRegionOptions(), value: searchParams.regionSettingId},
            {field: 'patientName', title: '姓名：', type: 'input', value: searchParams.patientName}
        ],
        search: function (data) {
            // 清空当前选中患者简要信息
            dialysisLayout.currentPatient = $.extend(dialysisLayout.currentPatient, {
                patientId: '',
                patientName: ''
            });

            // 按条件查患者列表
            var searchData = data.field;
            getPatientList(searchData);
        }
    });
}

/**
 * 初始化患者列表
 */
function initPatientList(searchParams) {
    layui.form.on('select(dialysisLayout_patientStatusSelect)', function(data) {
        // 患者筛选状态改变时，重新筛选患者列表
        dialysisLayout.patientList.data = [];
        dialysisLayout.patientList.data = filterPatientList(dialysisLayout.patientList.rawData);
    });
    layui.form.on('select(dialysisLayout_patientOrderSelect)', function(data) {
        // 患者排序规则改变时，重新筛选患者列表
        dialysisLayout.patientList.data = [];
        dialysisLayout.patientList.data = filterPatientList(dialysisLayout.patientList.rawData);
    });

    // 查询患者列表事件
    getPatientList(searchParams);
}

/**
 * 初始化透析简要信息表单
 */
function initBriedForm() {
    // 初始化表单元素,日期时间选择器
    var laydate = layui.laydate;
    laydate.render({
        elem: '#dialysisLayout_briefForm input[name="dialysisDate"]', type: 'date', format: 'yyyy-MM-dd', trigger: 'click',
        done: function(value, date, endDate) {
            // 透析日期改变时，重新获取透析记录选项
            onRefreshRecordOptions();
        }
    });
    laydate.render({
        elem: '#dialysisLayout_briefForm input[name="upDate"]', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', trigger: 'click',
        done: function(value, date) {
            var upDate = value;

            // 上机时间改变时，获取预计透析时长，重新计算“预计结束时间”
            if (typeof dialysisLayout.currentPageCallback.onGetPlanDialysisTime === 'function') {
                // 调用子页面的回调方法获取预计透析时长
                var returnResult = dialysisLayout.currentPageCallback.onGetPlanDialysisTime();
                if (returnResult) {
                    var dialysisTimeHour = returnResult.dialysisTime;
                    resetDownPlanDateByDialysisTime(dialysisTimeHour, upDate);
                }
            }

            // 上机时间改变时，获取实际透析时长，重新计算“实际结束时间”
            if (typeof dialysisLayout.currentPageCallback.onGetRelDialysisTime === 'function') {
                // 调用子页面的回调方法获取实际透析时长
                var returnResult = dialysisLayout.currentPageCallback.onGetRelDialysisTime();
                if (returnResult) {
                    resetDownDateByDialysisTime(returnResult.dialysisTimeHour, returnResult.dialysisTimeMin, upDate);
                }
            }
        }
    });
    laydate.render({ elem: '#dialysisLayout_briefForm input[name="downPlanDate"]', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', trigger: 'click' });
    laydate.render({ elem: '#dialysisLayout_briefForm input[name="downDate"]', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss', trigger: 'click', });

    // 透析记录选项改变时，重新设置透析简要信息表单
    layui.form.on('select(dialysisLayout_diaRecordIdSelect)', function(data) {
        var selectedIndex = data.elem.options.selectedIndex;
        var diaRecord = dialysisLayout.currentPatient.recordOptions[selectedIndex];
        onResetDialysisBriefForm(diaRecord);
    });
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
 * 查询患者列表事件
 * @param searchData
 */
function getPatientList(searchData) {
    dialysisLayout.patientList.data = [];

    var param = isNotEmpty(searchData) ? searchData : {};
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/getPatientOptions.do",
        data: param,
        dataType: "json",
        success: function(res) {
            dialysisLayout.serverTime = new Date(res.ts);
        },
        done: function(data) {
            // 回显查询的透析日期
            layui.form.val("dialysisLayout_search", {dialysisDate: data.dialysisDate});

            // 重新渲染患者选项列表
            var patientList = data.patientList;
            if (patientList != null && patientList.length > 0) {
                // 数据列表显示转化
                $.each(patientList, function(index, item) {
                    // 显示：年龄/感染状态/透析方式
                    var age = getUserAge(dialysisLayout.serverTime, item.birthday);
                    var infectionStatus = getSysDictShortName("InfectionMark", item.infectionStatus);
                    var dialysisMode = getSysDictName("DialysisMode", item.dialysisMode);
                    item.age = (age <= 0 ? "-" : age);
                    item.infectionStatus = isEmpty(infectionStatus) ? [] : infectionStatus.split(",");
                    item.dialysisMode = dialysisMode;

                    // 患者性别
                    if ($.constant.gender.MALE === item.gender) {
                        item.sexPic = '/static/svg/male.svg';
                    } else if($.constant.gender.FEMALE === item.gender){
                        item.sexPic = '/static/svg/female.svg';
                    }

                    // 显示：透析记录状态
                    var recordStatusConfig = null;
                    if (item.recordStatus === $.constant.dialysisRecordStatus.SIGNED) {
                        recordStatusConfig = dialysisLayout.config.recordStatusLabel.SIGNED;
                    } else if (item.recordStatus === $.constant.dialysisRecordStatus.RECEIVED) {
                        recordStatusConfig = dialysisLayout.config.recordStatusLabel.RECEIVED;
                    } else if (item.recordStatus === $.constant.dialysisRecordStatus.FILED) {
                        recordStatusConfig = dialysisLayout.config.recordStatusLabel.FILED;
                    }
                    if (recordStatusConfig) {
                        item.recordStatus = recordStatusConfig.label;
                        item.recordStatusColor = recordStatusConfig.color;
                    } else {
                        item.recordStatus = "";
                        item.recordStatusColor = "";
                    }
                });

                // 患者列表按条件过滤并渲染
                dialysisLayout.patientList.rawData = patientList;
                dialysisLayout.patientList.data = filterPatientList(patientList);
                dialysisLayout.patientList.errorMsg = "";

                // 设置默认选中患者（若没有则默认选中第一笔）
                var selectedPatientId = dialysisLayout.currentPatient.patientId;
                if ((isEmpty(selectedPatientId) || $(".dialysis-dropdown-item[data-patient-id='" + selectedPatientId + "']").length == 0)
                        && dialysisLayout.patientList.data.length > 0) {
                    selectedPatientId = dialysisLayout.patientList.data[0].patientId;
                }
                $(".dialysis-dropdown-item[data-patient-id='" + selectedPatientId + "']").trigger("click");
                // 滚动定位至选中元素
                var targetDropdownItem = $(".dialysis-layout-side .layui-side-scroll .dialysis-dropdown-item.selected");
                if (targetDropdownItem.length > 0) {
                    var scrollTop = targetDropdownItem.position().top;
                    $(".dialysis-layout-side .layui-side-scroll").scrollTop(scrollTop);
                }
            } else {
                dialysisLayout.patientList.rawData = [];
                dialysisLayout.patientList.data = [];
                dialysisLayout.patientList.errorMsg = "查无数据";
            }
        },
        error: function (error) {
            var res = error.responseJSON || {};
            var status = error.status;

            dialysisLayout.patientList.data = [];
            dialysisLayout.patientList.errorMsg = getRequestErrorMsg(res, status);
        }
    });
}

/**
 * 患者列表（前端）过滤、排序
 */
function filterPatientList(rawData) {
    var searchOrder = layui.form.val("dialysisLayout_searchOrder");

    // 状态过滤
    var filterData = [];
    if (searchOrder.patientStatus == "sign|true") {
        // 已签到
        $.each(rawData, function(index, item) {
            if (item.sign) {
                filterData.push(item);
            }
        });
    } else if (searchOrder.patientStatus == "sign|false") {
        // 未签到（过滤已排班的）
        $.each(rawData, function(index, item) {
            if (!item.sign && isNotEmpty(item.patientScheduleId)) {
                filterData.push(item);
            }
        });
    } else if (searchOrder.patientStatus == "top|true") {
        // 已关注
        $.each(rawData, function(index, item) {
            if (item.top) {
                filterData.push(item);
            }
        });
    } else {
        // 所有患者
        filterData = rawData.slice(0);
    }

    // 字段排序
    var patientOrder = searchOrder.patientOrder.split("|");
    var sortedData = [];
    if (patientOrder.length >= 2) {
        if (patientOrder[0] == "signNum") {
            var isDesc = (patientOrder[1] == "false");
            sortedData = filterData.sort(function(item1, item2) {
                var signNum1 = parseInt(item1.signNum);
                var signNum2 = parseInt(item2.signNum);
                if (isNaN(signNum1) && isNaN(signNum2)) {
                    return 0;
                } else if (isNaN(signNum1)) {
                    return 1;
                } else if (isNaN(signNum2)) {
                    return -1;
                } else {
                    return (isDesc ? signNum2 - signNum1 : signNum1 - signNum2);
                }
            });
        } else if (patientOrder[0] == "bedNo") {
            sortedData = filterData.sort(function(item1, item2) {
                return (item1.bedNo || "").localeCompare(item2.bedNo, 'zh-CN');
            });
            sortedData = (patientOrder[1] == "false") ? sortedData.reverse() : sortedData;
        }
    } else {
        sortedData = filterData;
    }

    return sortedData;
}

/**
 * 选中患者信息时，更新患者概览信息
 * @param obj
 */
function onSelectedPatientInfo(obj) {
    var dropdownItemObj = $(obj);

    // 设置患者列表项选中样式
    $(".dialysis-dropdown-item").removeClass("selected");
    dropdownItemObj.addClass("selected");

    // 更新当前患者概览信息
    dialysisLayout.currentPatient.patientId = dropdownItemObj.attr("data-patient-id");
    dialysisLayout.currentPatient.patientName = dropdownItemObj.attr("data-patient-name");

    // 初始化表单元素,日期时间选择器
    var dialysisDate = dropdownItemObj.attr("data-dialysis-date") || "";
    layui.form.val("dialysisLayout_briefForm", {
        dialysisDate: dialysisDate
    });
    // 透析日期改变时，重新获取透析记录选项

    onRefreshRecordOptions();
}

/**
 * 按钮功能 - 加透
 */
function onAddDialysis() {
    // 定义签到保存方法
    var formField = layui.form.val("dialysisLayout_briefForm");
    var executeSave = function () {
        var param = {
            patientId: dialysisLayout.currentPatient.patientId,
            dialysisDate: formField.dialysisDate
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/addRecord.do",
            data: param,
            dataType: "json",
            done: function(data) {
                successToast("加透成功");

                // 重新获取透析记录选项
                setTimeout(function () {
                    dialysisLayout.currentPatient.diaRecordId = "";
                    onRefreshRecordOptions();
                }, 500);
            }
        });
    };

    // 加透前验证记录状态
    if (!dialysisLayout.currentPatient.isPatientSign) {
        warningToast("当前患者未签到！");
        return;
    } else if (dialysisLayout.currentPatient.isRecordFiled) {
        warningToast("当前透析记录已归档！");
        return;
    }

    // 加透前需用户确认是否加透
    layer.confirm('确定加透吗？', function (index) {
        layer.close(index);
        // 执行保存方法
        executeSave();
    });
}

/**
 * 按钮功能 - 应收单上传
 */
function onUploadReceivableDoc() {
    if (!dialysisLayout.currentPatient.isPatientSign) {
        warningToast("当前患者未签到！");
        return;
    }
    if (dialysisLayout.currentPatient.isRecordFiled) {
        warningToast("当前透析记录已归档！");
        return;
    }
    if (dialysisLayout.currentPatient.prescriptionItemCount <= 0) {
        warningToast("暂无可上传的应收单明细！");
        return;
    }
    if (dialysisLayout.currentPatient.receivableStatus == $.constant.ReceivableStatus.ARCHIVED) {
        warningToast("应收单已归档！");
        return;
    }
    if (dialysisLayout.currentPatient.receivableStatus == $.constant.ReceivableStatus.CHARGE) {
        warningToast("应收单已收费！");
        return;
    }

    //定义上传应收单操作
    var uploadReceivables = function () {
        var param = {
            diaRecordId: dialysisLayout.currentPatient.diaRecordId
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaPrescriptionItem/uploadReceivables.do",
            data: param,
            dataType: "json",
            done: function(data) {
                successToast("应收单上传成功！");
            }
        });
    };

    // 应收单上传前需用户确认是否上传
    layer.confirm('确定上传应收单吗？', function (index) {
        layer.close(index);
        uploadReceivables();
    });
}

/**
 * 按钮功能 - 自动排床
 */
function onAutoScheduleBed() {
    if (!dialysisLayout.currentPatient.isPatientSign) {
        warningToast("当前患者未签到！");
        return;
    }
    if (dialysisLayout.currentPatient.isRecordFiled) {
        warningToast("当前透析记录已归档！");
        return;
    }

    // TODO
    console.log("自动排床");
}

/**
 * 按钮功能 - 归档/取消归档
 */
function onSaveRecordFiled(isFiled) {
    // 定义归档操作
    var executeSave = function () {
        var param = {
            diaRecordId: dialysisLayout.currentPatient.diaRecordId,
            isFiled: isFiled
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/saveRecordFiled.do",
            data: param,
            dataType: "json",
            done: function(data) {
                successToast(isFiled ? "归档成功" : "取消归档成功");

                // 刷新患者列表状态
                setTimeout(function () {
                    var searchData = layui.form.val("dialysisLayout_search");
                    getPatientList(searchData);
                }, 500);
            }
        });
    };

    if (isFiled) {
        // 归档前验证记录状态
        if (!dialysisLayout.currentPatient.isPatientSign) {
            warningToast("当前患者未签到！");
            return;
        } else if (dialysisLayout.currentPatient.isRecordFiled) {
            warningToast("当前透析记录已归档！");
            return;
        }

        // 归档前需用户确认是否归档
        layer.confirm('确定归档所选透析记录吗？归档后不可修改透析记录。', function (index) {
            layer.close(index);
            executeSave();
        });
    } else {
        // 取消归档前验证记录状态
        if (!dialysisLayout.currentPatient.isPatientSign) {
            warningToast("当前患者未签到！");
            return;
        }
        if (!dialysisLayout.currentPatient.isRecordFiled) {
            warningToast("当前透析记录未归档！");
            return;
        }

        // 取消归档前需用户确认是否取消归档
        layer.confirm('确定取消归档所选透析记录吗？取消归档后可修改透析记录。', function (index) {
            layer.close(index);
            executeSave();
        });
    }
}

/**
 * 按钮功能 - 刷新：重新获取透析记录选项（多笔）
 */
function onRefreshRecordOptions() {
    // 清空表单
    layui.form.val("dialysisLayout_briefForm", {
        diaRecordId: "",
        upDate: "",
        downPlanDate: "",
        downDate: ""
    });
    dialysisLayout.currentPatient.recordOptions = [];
    dialysisLayout.currentPatient.isPatientSign = false;
    dialysisLayout.currentPatient.recordStatus = "";
    dialysisLayout.currentPatient.receivableStatus = "";
    dialysisLayout.currentPatient.isRecordFiled = false;
    dialysisLayout.currentPatient.prescriptionItemCount = 0;

    dialysisLayout.currentPatient.baseSaveStatus = "";
    dialysisLayout.currentPatient.hasAssess = false;
    dialysisLayout.currentPatient.hasExecuteOrder = false;
    dialysisLayout.currentPatient.hasMonitorRecord = false;
    dialysisLayout.currentPatient.hasUnusualRecord = false;
    dialysisLayout.currentPatient.courseRecord = "";
    dialysisLayout.currentPatient.hasCrossCheck = false;
    dialysisLayout.currentPatient.summarySaveStatus = "";
    dialysisLayout.currentPatient.hasPrescriptionItem = false;
    dialysisLayout.currentPatient.disinfectSaveStatus = "";
    dialysisLayout.currentPatient.hasEduTeach = false;
    layui.form.render();

    var formField = layui.form.val("dialysisLayout_briefForm");
    var param = {
        patientId: dialysisLayout.currentPatient.patientId,
        dialysisDate: formField.dialysisDate
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/listRecordOptions.do",
        data: param,
        dataType: "json",
        done: function(data) {
            if (data != null && data.length > 0) {
                // 获取透析记录选项
                dialysisLayout.currentPatient.recordOptions = data;
                dialysisLayout.currentPatient.isPatientSign = true;
                layui.form.render();

                // 默认选中最后一笔透析记录选项
                var diaRecord = dialysisLayout.currentPatient.recordOptions[data.length - 1];
                if (dialysisLayout.currentPatient.diaRecordId) {
                    // 若有选择的透析记录ID，则选择该笔透析记录
                    $.each(dialysisLayout.currentPatient.recordOptions, function (index, item) {
                        if (item.diaRecordId == dialysisLayout.currentPatient.diaRecordId) {
                            diaRecord = item;
                            return false;
                        }
                    });
                }
                onResetDialysisBriefForm(diaRecord);
            }else {
                refluseDot();//刷新红点
            }
        }
    });
}

/**
 * 刷新透析记录状态（单笔）
 */
function onRefreshRecordOption() {
    var param = {
        diaRecordId: dialysisLayout.currentPatient.diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/getRecordOption.do",
        data: param,
        dataType: "json",
        done: function(data) {
            $.each(dialysisLayout.currentPatient.recordOptions, function (index, item) {
                if (item.diaRecordId == data.diaRecordId) {
                    // 更新缓存的透析记录选项
                    item = data;
                    // 重新设置透析简要信息表单
                    onResetDialysisBriefForm(item, true);
                    return false;
                }
            });
        }
    });
}

/**
 * 按钮功能 - 病历信息：打开病历信息
 */
function onOpenPatientLayout() {
    baseFuncInfo.openPatientLayoutPage({
        patientId: dialysisLayout.currentPatient.patientId
    });
}

/**
 * 按钮功能 - 检查检验：打开检查检验
 */
function onOpenTesApply(){
    baseFuncInfo.openPatientLayoutPage({
        pageHref: "/examine/tesApplyList",
        patientId: dialysisLayout.currentPatient.patientId,
    })
}

/**
 * 按钮功能 - 病历信息：打开患者画像
 */
function onOpenPatientPortrait() {
    var url = $.config.server + "/patient/patPortrait?patientId=" + dialysisLayout.currentPatient.patientId;
    var title = "患者画像";
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: [],
        done: function (index, iframeWin,layer) {

        }
    });
}

/**
 * 重新设置透析简要信息表单
 * @param diaRecord
 * @param isRefreshPage 默认true
 */
function onResetDialysisBriefForm(diaRecord, isRefreshPage) {
    // 设置选中的透析记录ID
    dialysisLayout.currentPatient.diaRecordId = diaRecord.diaRecordId; // 选中透析记录ID
    dialysisLayout.currentPatient.recordStatus = diaRecord.recordStatus; // 选中透析记录 - 透析记录状态
    dialysisLayout.currentPatient.receivableStatus = diaRecord.receivableStatus; // 选中透析记录 - 医保结算平台处方单状态
    dialysisLayout.currentPatient.isRecordFiled = (diaRecord.recordStatus === $.constant.dialysisRecordStatus.FILED); // 选中透析记录 - 是否已归档
    dialysisLayout.currentPatient.prescriptionItemCount = parseInt(diaRecord.prescriptionItemCount) || 0; // 选中透析记录 - 是否已归档
    dialysisLayout.currentPatient.baseSaveStatus = diaRecord.baseSaveStatus;
    dialysisLayout.currentPatient.hasAssess = diaRecord.hasAssess;
    dialysisLayout.currentPatient.hasExecuteOrder = diaRecord.hasExecuteOrder;
    dialysisLayout.currentPatient.hasMonitorRecord = diaRecord.hasMonitorRecord;
    dialysisLayout.currentPatient.hasUnusualRecord = diaRecord.hasUnusualRecord;
    dialysisLayout.currentPatient.courseRecord = diaRecord.courseRecord;
    dialysisLayout.currentPatient.hasCrossCheck = diaRecord.hasCrossCheck;
    dialysisLayout.currentPatient.summarySaveStatus = diaRecord.summarySaveStatus;
    dialysisLayout.currentPatient.hasPrescriptionItem = diaRecord.hasPrescriptionItem;
    dialysisLayout.currentPatient.disinfectSaveStatus = diaRecord.disinfectSaveStatus;
    dialysisLayout.currentPatient.hasEduTeach = diaRecord.hasEduTeach;

    // 更新透析简要信息表单
    var util = layui.util;
    layui.form.val("dialysisLayout_briefForm", {
        diaRecordId: diaRecord.diaRecordId,
        dialysisDate: isEmpty(diaRecord.dialysisDate) ? "" : util.toDateString(diaRecord.dialysisDate, "yyyy-MM-dd"),
        upDate: isEmpty(diaRecord.upDate) ? "" : util.toDateString(diaRecord.upDate, "yyyy-MM-dd HH:mm:ss"),
        downPlanDate: isEmpty(diaRecord.downPlanDate) ? "" : util.toDateString(diaRecord.downPlanDate, "yyyy-MM-dd HH:mm:ss"),
        downDate: isEmpty(diaRecord.downDate) ? "" : util.toDateString(diaRecord.downDate, "yyyy-MM-dd HH:mm:ss"),
    });

    // 刷新功能页面
    if (isRefreshPage != false) {
        onRefreshFunctionPage();
    }
}

/**
 * 透析简要信息 - 保存
 */
function onSaveRecord() {
    if (!dialysisLayout.currentPatient.isPatientSign) {
        warningToast("当前患者未签到！");
        return;
    }

    // 判断是否有保存透析（上下机）时间权限，若有则先保存透析（上下机）时间，再保存子页面表单
    if (dialysisLayout.withSaveBriefAuth) {
        var formField = layui.form.val("dialysisLayout_briefForm");
        var param = {
            diaRecordId: dialysisLayout.currentPatient.diaRecordId,
            upDate: formField.upDate,
            downPlanDate: formField.downPlanDate,
            downDate: formField.downDate
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/saveRecordBrief.do",
            data: param,
            dataType: "json",
            done: function(data) {
                var $callback = dialysisLayout.currentPageCallback.onSave;
                if (typeof $callback === 'function') {
                    $callback();
                } else {
                    successToast("保存成功");
                }
            }
        });
    } else {
        // 否则直接保存子页面表单
        var $callback = dialysisLayout.currentPageCallback.onSave;
        if (typeof $callback === 'function') {
            $callback();
        }
    }
}

/**
 * 透析简要信息 - 签到：患者签到事件
 */
function onSavePatientSign(isSign) {
    // 定义签到保存方法
    var formField = layui.form.val("dialysisLayout_briefForm");
    var executeSave = function () {
        var param = {
            patientId: dialysisLayout.currentPatient.patientId,
            dialysisDate: formField.dialysisDate,
            isSign: isSign
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaRecord/savePatientSign.do",
            data: param,
            dataType: "json",
            done: function(data) {
                successToast(isSign ? "签到成功" : "取消签到成功");

                // 重刷患者列表
                setTimeout(function () {
                    var searchData = layui.form.val("dialysisLayout_search");
                    getPatientList(searchData);
                }, 500);
            }
        });
    };

    if (isSign) {
        // 签到前验证记录状态
        if (dialysisLayout.currentPatient.isPatientSign) {
            warningToast("当前患者已签到！");
            return;
        }

        // 执行保存方法
        executeSave();
    } else {
        // 取消签到前验证记录状态
        if (!dialysisLayout.currentPatient.isPatientSign) {
            warningToast("当前患者未签到！");
            return;
        }
        if (dialysisLayout.currentPatient.isRecordFiled) {
            warningToast("当前透析记录已归档！");
            return;
        }

        // 取消签到前需用户确认是否取消签到
        layer.confirm('确定取消患者签到状态吗？取消签到后将删除当天透析记录。', function (index) {
            layer.close(index);
            // 执行保存方法
            executeSave();
        });
    }
}

/**
 * 设置透析（简要信息）保存回调事件：可用于保存子页面操作（用于子页面调用）
 * @param saveCallback function() { ... }
 */
function setSaveCallback(saveCallback) {
    dialysisLayout.currentPageCallback.onSave = saveCallback;
}

/**
 * 设置获取预计透析时长回调事件：可获取预计透析时长（用于子页面调用）
 * @param saveCallback function() { return {dialysisTime: 0}; }
 */
function setGetPlanDialysisTimeCallback(getCallback) {
    dialysisLayout.currentPageCallback.onGetPlanDialysisTime = getCallback;
}

/**
 * 设置获取实际透析时长回调事件：可获取实际透析时长（用于子页面调用）
 * @param saveCallback function() { return {dialysisTimeHour: 0, dialysisTimeMin: 0}; }
 */
function setGetRelDialysisTimeCallback(getCallback) {
    dialysisLayout.currentPageCallback.onGetRelDialysisTime = getCallback;
}

/**
 * 设置是否需要更新页面标记（用于子页面调用）
 * @param refreshPageFlag true/false
 */
function setRefreshPageFlag(refreshPageFlag) {
    dialysisLayout.refreshPageFlag = refreshPageFlag;
}

/**
 * 显示当前页签红点
 * @param isDotCurrent true：表示表单未保存过，显示红点；false：表示表单已保存过，隐藏红点
 */
function showTabBadgeDot(isDotCurrent) {
    if (isDotCurrent) {
        $(".dialysis-layout-body .layui-tab-dis-sub .layui-tab-title li.layui-this .layui-badge-dot").removeClass("layui-hide");
    }else{
        $(".dialysis-layout-body .layui-tab-dis-sub .layui-tab-title li.layui-this .layui-badge-dot").addClass("layui-hide");
    }

}

/**
 *　医护交班
 */
function onHandover() {
    var requestUrl = window.location.href;
    var dialysisDate = GetUrlQueryString(requestUrl, "qDialysisDate");
    var url = "";
    var title = "";
    title = "新增";
    url = $.config.server + "/dialysis/diaDoctorShiftEdit?patientId=" + dialysisLayout.currentPatient.patientId + "&diaRecordId=" + dialysisLayout.currentPatient.diaRecordId+ "&dialysisDate=" +dialysisDate;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1000, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: [],
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
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
 * 透析历史
 */
function onDiaHistory(){
    var url = "";
    var title = "";
    title = "透析历史";
    url = $.config.server + "/dialysis/diaHistoryList?patientId=" + dialysisLayout.currentPatient.patientId;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 600,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: [],
        done: function (index, iframeWin,layer) {

        },
        end: function () {
            // 关闭弹窗时判断，如果有删除透析历史，需要重新刷新页面
            if (dialysisLayout.refreshPageFlag) {
                window.location.reload();
            }
        }
    });

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
 * 预计透析时长改变时，重新设置预计结束时间（用于子页面调用）
 * @param dialysisTimeHour 预计透析时长(小时)
 */
function resetDownPlanDateByDialysisTime(dialysisTimeHour, upDate) {
    var addHours = Number(dialysisTimeHour);

    if (!upDate) {
        var briefForm = layui.form.val("dialysisLayout_briefForm");
        upDate = briefForm.upDate;
    }
    // 上机时间不为空 && 预计透析时长是数值，则重新设置预计结束时间
    if (isNotEmpty(upDate) && isNotEmpty(dialysisTimeHour) && !isNaN(addHours)) {
        var tempDate = new Date(upDate);
        tempDate.setTime(tempDate.getTime() + addHours * 60 * 60 * 1000);
        var downPlanDate = layui.util.toDateString(tempDate, "yyyy-MM-dd HH:mm:ss");
        layui.form.val("dialysisLayout_briefForm", { downPlanDate: downPlanDate });
    }
}

/**
 * 实际透析时长改变时，重新设置实际结束时间（用于子页面调用）
 * @param dialysisTimeHour 实际透析时长(小时)
 * @param dialysisTimeMin 实际透析时长(分钟)
 */
function resetDownDateByDialysisTime(dialysisTimeHour, dialysisTimeMin, upDate) {
    var addHours = Number(dialysisTimeHour);
    var addMinutes = Number(dialysisTimeMin);

    if (!upDate) {
        var briefForm = layui.form.val("dialysisLayout_briefForm");
        upDate = briefForm.upDate;
    }
    // 上机时间不为空 && 实际透析时长是数值，则重新设置预计结束时间
    if (isNotEmpty(upDate) && (isNotEmpty(dialysisTimeHour) || isNotEmpty(dialysisTimeMin)) && (!isNaN(addHours) || !isNaN(addMinutes))) {
        var tempDate = new Date(upDate);
        tempDate.setTime(tempDate.getTime() + (addHours || 0) * 60 * 60 * 1000 + (addMinutes || 0) * 60 * 1000);
        var downDate = layui.util.toDateString(tempDate, "yyyy-MM-dd HH:mm:ss");
        layui.form.val("dialysisLayout_briefForm", { downDate: downDate });
    }
}
/**
 * 透析时长改变时，重新设置预计下机时间
 * @param dialysisTimeHour 透析时长(小时)
 * @param dialysisTimeMin 透析时长(分钟)
 */
function resetPlanLeaveDialysisTime(dialysisTimeHour, dialysisTimeMin) {
    var addHours = Number(dialysisTimeHour);
    var addMinutes = Number(dialysisTimeMin);
        var briefForm = layui.form.val("dialysisLayout_briefForm");
        upDate = briefForm.upDate;
    // 上机时间不为空 && 实际透析时长是数值，则重新设置预计结束时间
    if (isNotEmpty(upDate) && (isNotEmpty(dialysisTimeHour) || isNotEmpty(dialysisTimeMin)) && (!isNaN(addHours) || !isNaN(addMinutes))) {
        var tempDate = new Date(upDate);
        tempDate.setTime(tempDate.getTime() + (addHours || 0) * 60 * 60 * 1000 + (addMinutes || 0) * 60 * 1000);
        var downPlanDate = layui.util.toDateString(tempDate, "yyyy-MM-dd HH:mm:ss");
        layui.form.val("dialysisLayout_briefForm", { downPlanDate: downPlanDate });
    }
}

/**
 * 获取实际结束时间（用于透析消毒子页面调用）
 */
function getDownDate() {
    return layui.form.val("dialysisLayout_briefForm").downDate;
}

