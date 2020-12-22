/**
 * 患者管理 - 患者列表
 * @Author Allen
 * @version: 1.0
 * @Date 2020/8/20
 */
var patPatientInfoList = avalon.define({
    $id: "patPatientInfoList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serverTime: new Date()
});
layui.use(['index'], function () {
    avalon.ready(function () {
        // 初始化搜索框
        initSearch();

        getPatientList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#patPatientInfoList_search', //指定搜索框表单的元素选择器（推荐id选择器）
        filter: 'patPatientInfoList_search',  //指定的lay-filter
        conds: [
            {field: 'patientName', title: '姓名：', type: 'input'},
            {field: 'mobilePhone', title: '个人手机：', type: 'input'},
            {field: 'patientRecordNo', title: '病历号：', type: 'input'},
            {field: 'customerType', title: '客户类型：', type: 'select', data: getSysDictByCode($.dictType.customerType, true)},
        ],
        search: function (data) {
            // 重新查询Table
            layui.table.reload('patPatientInfoList_table', {
                where: data.field
            });
        }
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = getRequestParam("patPatientInfoList_search");
    return $.extend({
        patientName: '',
        mobilePhone: '',
        patientRecordNo: '',
        customerType: ''
    }, searchParam)
}

/**
 * 查询列表事件
 */
function getPatientList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#patPatientInfoList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'patPatientInfoList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patPatientInfo/list.do",
            where: param,
            cols: [[ //表头
                { fixed: 'left', type: 'checkbox' },  // 开启编辑框
                { fixed: 'left', field: 'patientRecordNo', title: '病历号', minWidth: 120 },
                { fixed: 'left', field: 'patientName', title: '姓名', align: 'center', minWidth: 100 },
                { field: 'gender', title: '性别', align: 'center', templet: function (row) { return getSysDictName($.dictType.sex, row.gender); } },
                {
                    field: 'patientAge', title: '年龄', align: 'center',
                    templet: function (row) {
                        var age = getUserAge(patPatientInfoList.serverTime, row.birthday);
                        return (age <= 0 ? "" : age);
                    }
                },
                { field: 'idCardType', title: '证件类型', align: 'center', minWidth: 100, templet: function (row) { return getSysDictName($.dictType.idCardType, row.idCardType); } },
                { field: 'idCardNo', title: '证件号码', minWidth: 180 },
                { field: 'mobilePhone', title: '个人手机', minWidth: 120 },
                { field: 'customerType', title: '客户类型', align: 'center', minWidth: 100, templet: function (row) { return getSysDictName($.dictType.customerType, row.customerType); } },
                {
                    field: 'infectionStatus', title: '感染状况', minWidth: 180,
                    templet: function (row) {
                        var infectionStatus = getSysDictName($.dictType.infectionMark, row.infectionStatus);
                        return infectionStatus.split(',').join("，");
                    }
                },
                {
                    field: 'patientTags', title: '标签', minWidth: 250,
                    templet: function (row) {
                        var patientTags = isNotEmpty(row.patientTags) ? JSON.parse(row.patientTags) : [];
                        var tagHtml = "";
                        for (var i = 0; i < patientTags.length; i++) {
                            var patientTag = patientTags[i];
                            var tagColor = getSysDictBizCode($.dictType.patientTagsColor, patientTag.tagColor);
                            tagHtml += "<span style='color: " + tagColor + "' class='patient-tag'>" + patientTag.tagContent + "</span>";
                        }
                        return tagHtml;
                    }
                },
                { field: 'principalNurseName', title: '主责护士', align: 'center', minWidth: 100 },
                {
                    field: 'lastDialysisTime', title: '最后透析日期', align: 'center', minWidth: 120,
                    templet: function (row) {
                        return isEmpty(row.lastDialysisDate) ? '' : util.toDateString(row.lastDialysisDate, "yyyy-MM-dd");
                    }
                },
                {
                    field: 'nextScheduleDate', title: '预计下次透析日期', align: 'center', minWidth: 150,
                    templet: function (row) {
                        var result = "";
                        if (isNotEmpty(row.nextScheduleDate)) {
                            var nextScheduleDate = util.toDateString(row.nextScheduleDate, "yyyy-MM-dd");
                            var nextScheduleShift = getSysDictName($.dictType.shift, row.nextScheduleShift);
                            result = nextScheduleDate + (isEmpty(nextScheduleShift) ? "" : "(" + nextScheduleShift + ")");
                        }
                        return result;
                    }
                },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#patPatientInfoList_bar' }
            ]],
            done: function (res, curr, count) {
                patPatientInfoList.serverTime = new Date(res.ts);
            }
        },
        // 监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (isNotEmpty(data.patientId)) {
                if (layEvent === 'edit') { //编辑
                    onPatientEdit(data.patientId);
                } else if (layEvent === 'manage') { //管理
                    onPatientManage(data.patientId);
                }
            }
        }
    });
}

/**
 * 患者新增事件
 */
function onPatientAdd() {
    var url = $.config.server + "/patient/patPatientInfoEdit";
    openPatientInfoEditWin("新增", url, 1);
}

/**
 * 患者编辑事件
 */
function onPatientEdit(patientId) {
    var url = $.config.server + "/patient/patPatientInfoEdit?id=" + patientId;
    openPatientInfoEditWin("编辑", url, 2);
}

/**
 * 患者管理事件
 */
function onPatientManage(patientId) {
    // 打开患者管理页面
    var searchData = getSearchParam();
    baseFuncInfo.openPatientLayoutPage({
        patientId: patientId,
        query: {
            patientName: searchData.patientName,
            mobilePhone: searchData.mobilePhone,
            patientRecordNo: searchData.patientRecordNo,
            customerType: searchData.customerType
        }
    });
}

/**
 * 导出excel
 */
function onExportExcel() {
    var params = getSearchParam();
    params.patientIds = getCheckedPatientIds();

    _downloadFile({
        url: $.config.services.dialysis + "/patPatientInfo/export.do",
        data: params,
        fileName: '患者列表.xlsx'
    });
}

/**
 * 打开患者编辑弹窗
 * @param title
 * @param url
 * @param opType 1：新增；2：编辑
 */
function openPatientInfoEditWin(title, url, opType) {
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1200, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patPatientInfoList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }, opType
            );
        }
    });
}

/**
 * 打印二维码弹窗
 */
function onPatientPrint() {
    // 按查询条件进行打印
    var params = getSearchParam("patPatientInfoList_search");
    // 获取选中的患者ID
    var patientIds = getCheckedPatientIds();
    // 打开打印预览弹窗
    var winUrl = $.config.server + "/patient/patPatientInfoQrCode?patientName=" + params.patientName
        + "&mobilePhone=" + params.mobilePhone + "&patientRecordNo=" + params.patientRecordNo + "&customerType=" + params.customerType
        + "&patientIds=" + patientIds.join(",");
    openPatientInfoQrCodeWin(winUrl, 710, 842);
}

/**
 * 打开打印二维码弹窗
 * @param winUrl
 * @param width
 * @param height
 */
function openPatientInfoQrCodeWin(winUrl, width, height) {
    _layerOpen({
        url: winUrl,
        width: width, // 弹框自定义的宽度，方法会自动判断是否超过宽度
        height: height,  // 弹框自定义的高度，方法会自动判断是否超过高度
        title: "打印二维码", // 弹框标题
        btn: ["打印", "取消"],
        done: function (index, iframeWin) {
            var ids = iframeWin.onPrint();
        }
    });
}

/**
 * 获取选中的患者ID
 * @returns {Array}
 */
function getCheckedPatientIds() {
    var patientIds = [];
    var patientListCheckStatus = layui.table.checkStatus('patPatientInfoList_table');
    var checkedPatientList = patientListCheckStatus.data; //获取选中行的数据
    if (checkedPatientList.length > 0) {
        $.each(checkedPatientList, function (index, item) {
            patientIds.push(item.patientId);
        });
    }
    return patientIds;
}

