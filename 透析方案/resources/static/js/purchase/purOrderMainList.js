/**
 * purOrderMainList.ftl的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/04
 */
var purOrderMainList = avalon.define({
    $id: "purOrderMainList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    reportFinance: true // 上报财务，默认true
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        isReportFinance(); // 是否上报财务
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#purOrderMainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'purOrderMainList_search'  //指定的lay-filter
        , conds: [
            {field: 'purchaseOrderNo', title: '采购单编号：', type: 'input'}
            , {field: 'supplierInfoId', title: '供应商名称：', type: 'input'}
            , {field: 'materielNameOrNo' ,title: '物料编码或名称：',type: 'input'}
            , {field: 'createTimeText', title: '采购日期：', type: 'date_range'}
            , {field: 'orderStatus', title: '订单状态：', type: 'select', data: getSysDictByCode("POStatus", true)}
            , {field: 'reportingStatus', title: '上报状态：', type: 'select', data: getSysDictByCode("POReportingStatus", true)}
            , {field: 'purchaseStatus', title: '采购状态：', type: 'select', data: getSysDictByCode("POPurchaseStatus", true)}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('purOrderMainList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    var form = layui.form;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#purOrderMainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'purOrderMainList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purOrderMain/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {
                    templet: "#checkAll",
                    title: "<input type='checkbox' name='checkAll' lay-skin='primary' lay-filter='checkAll'> ",
                    width: 48,
                    fixed: 'left'
                }
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'purchaseOrderNo', title: '采购单编号', align:'center', width: 150}
                , {field: 'supplierInfoText', title: '供应商名称'}
                , {field: 'totalPrice', title: '采购总价格', align:'right', width: 120}
                , {field: 'createTimeText', title: '采购日期', align:'center', width: 120}
                , {field: 'orderStatusText', title: '订单状态', align:'center', width: 100}
                , {field: 'b2bSupplier', title: '是否B2B供应商', align:'center', width: 130}
                , {field: 'reportingStatusText', title: '上报状态', align:'center', width: 100}
                , {field: 'purchaseStatusText', title: '采购状态', align:'center', width: 100}
                , {
                    fixed: 'right', title: '操作', width: 215, align: 'left'
                    , toolbar: '#purOrderMainList_bar'
                }
            ]]
            ,done: function (res, curr, count) {
                // 全选、全不选
                form.on("checkbox(checkAll)", function () {
                    var status = $(this).prop("checked");
                    $.each($("input[name='checkOne']"), function () {
                        $(this).prop("checked", status);
                    });
                    form.render();
                });
            }
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { // 编辑
                if (isNotEmpty(data.orderMainId)) {
                    edit(data.orderMainId, layEvent, data.orderStatus, data.importFlag);
                }
            } else if (layEvent === 'detail' || layEvent === 'approval') { // 详情或审批
                if (isNotEmpty(data.orderMainId)) {
                    detailOrApproval(data.orderMainId, layEvent, data.purchaseStatus, data.orderStatus);
                }
            } else if (layEvent === 'report') { // 上报财务
                layer.confirm('确定上报所选记录吗？', function (index) {
                    layer.close(index);
                    if (isNotEmpty(data.orderMainId)) {
                        var ids = [];
                        ids.push(data.orderMainId);
                        report(ids);
                    }
                });
            } else if (layEvent === 'execution') { // 执行采购
                layer.confirm('确定执行所选记录吗？', function (index) {
                    layer.close(index);

                    if (isNotEmpty(data.orderMainId)) {
                        execution(data.orderMainId);
                    }
                });
            } else if (layEvent === 'send') { // 发送B2B
                layer.confirm('确定发送所选记录吗？', function (index) {
                    layer.close(index);

                    if (isNotEmpty(data.orderMainId)) {
                        send(data.orderMainId);
                    }
                });
            } else if (layEvent === 'apply') { // 申请入库
                layer.confirm('确定入库所选记录吗？', function (index) {
                    layer.close(index);

                    if (isNotEmpty(data.orderMainId)) {
                        var ids = [];
                        ids.push(data.orderMainId + '@' + data.supplierInfoId);
                        apply(ids);
                    }
                });
            }
        }
    });
}

/**
 * 添加采购订单
 */
function add() {
    _layerOpen({
        url: $.config.server + '/base/bindSuppliers?flag=addPO',
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '选择供应商', //弹框标题
        done: function (index, iframeWin) {
            iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast('添加成功');
                    layui.table.reload('purOrderMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 *
 * @param id
 * @param layEvent
 * @param orderStatus
 * @param importFlag
 */
function edit(id, layEvent, orderStatus, importFlag) {
    var url = $.config.server + '/purchase/purOrderMainEdit?id=' + id + '&layEvent=' + layEvent + '&orderStatus=' + orderStatus + '&importFlag=' + importFlag;
    _layerOpen({
        url: url,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '编辑', //弹框标题
        done: function (index, iframeWin) {
            iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast('保存成功');
                    layui.table.reload('purOrderMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 详情或审批
 * @param id
 * @param layEvent
 * @param purchaseStatus
 * @param orderStatus
 */
function detailOrApproval(id, layEvent, purchaseStatus, orderStatus) {
    var title = layEvent === 'detail' ? '详情' : '审批';
    var btnArr = layEvent === 'detail' ? ['确定'] : ['核准', '取消'];
    var url = $.config.server + "/purchase/purOrderMainEdit?id=" + id + "&layEvent=" + layEvent + '&purchaseStatus=' + purchaseStatus + '&orderStatus=' + orderStatus;

    _layerOpen({
        url: url,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: true, // true：查看 | false：编辑
        btnFlag: 'approvalAndDetail',
        btnType: 0, // 0：采用自定义 | 1：不采用
        btnArr: btnArr, // btnType=0时设置才生效
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('purOrderMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        yes: function (index, iframeWin) {
            if (layEvent === 'approval') {
                // 验证是否存在订单的明细记录，不存在则审批不通过
                _ajax({
                    type: "POST",
                    url: $.config.services.pharmacy + "/purOrderDetail/list.do",
                    data: { orderMainId: id },  //必须字符串后台才能接收list,
                    //loading:false,  //是否ajax启用等待旋转框，默认是true
                    dataType: "json",
                    done: function (data) {
                        if (isNotEmpty(data)) {
                            var ids = [];
                            ids.push(id);
                            approval(ids);
                        } else {
                            errorToast('审批不通过：无采购明细项，请进行编辑添加！');
                        }
                    }
                });
            }
        }
    });
}

/**
 * 审批
 * @param ids
 */
function approval(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderMain/approval.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("审批成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 是否需要上报财务，由中心设置
 */
function isReportFinance() {
    _ajax({
        type: "POST",
        url: $.config.services.system + "/sysHospital/hospitalList.do",
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if (data.isUpload !== 'Y') {
                purOrderMainList.reportFinance = false;
            }
        }
    });
}

/**
 * 上报财务
 * @param ids
 */
function report(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderMain/report.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if (data === '1') {
                successToast("上报财务成功");
            } else {
                errorToast(data);
            }
            layui.table.reload('purOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 执行采购
 * @param id
 */
function execution(id) {
    var param = {
        "id": id
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderMain/execution.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("执行采购成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 发送B2B
 * @param id
 */
function send(id) {
    var param = {
        "id": id
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderMain/send.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("发送B2B成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 申请入库
 * @param ids
 */
function apply(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderMain/apply.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("操作成功");
            var table = layui.table; //获取layui的table模块
            table.reload('purOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 导出Excel
 * @returns {boolean}
 */
function exportExcel() {
    // var ids = [];
    // $.each($("input[name='checkOne']:checked"), function (i, obj) {
    //     ids[i] = $(this).attr("data-id") + '@' + $(this).attr("data-purchaseOrderNo");
    // });
    //
    // if (Array.from(new Set(ids)).length != 1) {
    //     warningToast("请选择一条记录");
    //     return false;
    // } else {
    //     var orderMainId = ids[0].split('@')[0];
    //     var purchaseOrderNo = ids[0].split('@')[1];

        _downloadFile({
            url: $.config.services.pharmacy + '/purOrderMain/export.do',
            // data: {
            //     orderMainId: orderMainId
            // },
            data: getSearchParam(),
            fileName: '采购订单.xlsx'
        });
    // }
}

/**
 * 获取查询参数
 * @returns {*}
 */
function getSearchParam(){
    var searchParam = layui.form.val("purOrderMainList_search");
    return $.extend({
        purchaseOrderNo: '',
    }, searchParam)
}


/**
 * 批量申请入库
 */
function Apply4Warehousing() {
    var flag = false;
    var ids = [];
    var not = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        var id = $(this).attr("data-id"); // 采购订单ID
        var supplierId = $(this).attr("data-supplierId"); // 供应商ID
        var purchaseOrderNo = $(this).attr("data-purchaseOrderNo"); // 采购订单编号
        var orderStatus = $(this).attr("data-orderStatus"); // 订单状态
        var reportingStatus = $(this).attr("data-reportingStatus"); // 上报状态
        var purchaseStatus = $(this).attr("data-purchaseStatus"); // 采购状态

        if (orderStatus === $.constant.POStatus.UN_WAREHOUSING && (reportingStatus === $.constant.POReportingStatus.REPORTED || !purOrderMainList.reportFinance) && purchaseStatus === $.constant.POPurchaseStatus.PURCHASING) {
            ids.push(id + '@' + supplierId);
        } else {
            not.push(purchaseOrderNo);
            flag = true;
        }
    });

    if (flag) {
        layer.alert('采购单编号：' + Array.from(new Set(not)) + ' 未上报财务，或者未发送B2B');
        return false;
    }

    if (ids.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定入库所选记录吗？', function (index) {
            layer.close(index);
            apply(Array.from(new Set(ids)));
        });
    }
}

/**
 * 批量上报财务
 */
function Report2Finance() {
    var flag = false;
    var ids = [];
    var not = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        var id = $(this).attr("data-id"); // 采购订单ID
        var supplierId = $(this).attr("data-supplierId"); // 供应商ID
        var purchaseOrderNo = $(this).attr("data-purchaseOrderNo"); // 采购订单编号
        var orderStatus = $(this).attr("data-orderStatus"); // 订单状态
        var reportingStatus = $(this).attr("data-reportingStatus"); // 上报状态
        var purchaseStatus = $(this).attr("data-purchaseStatus"); // 采购状态
        var b2bSupplier = $(this).attr("data-b2bSupplier"); // B2B供应商

        if ((reportingStatus === $.constant.POReportingStatus.TO_BE_REPORTED || !purOrderMainList.reportFinance) && b2bSupplier === $.constant.b2bSupplier.N) {
            ids.push(id);
        } else {
            not.push(purchaseOrderNo);
            flag = true;
        }
    });

    if (flag) {
        layer.alert('采购单编号：' + Array.from(new Set(not)) + ' 已经上报财务；或者供应商是B2B供应商，不需要上报');
        return false;
    }

    if (ids.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定上报所选记录吗？', function (index) {
            layer.close(index);
            report(Array.from(new Set(ids)));
        });
    }
}

/**
 * 刷新
 */
function refresh() {
    layui.table.reload('purOrderMainList_table');
}