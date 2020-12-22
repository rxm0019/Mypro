/**
 * 入库管理的js文件，包括列表查询、审批、增加、设置等操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/10
 */
var stoWarehouseInMainList = avalon.define({
    $id: "stoWarehouseInMainList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    warehousingType: GetQueryString("type"), // 入库类型：0-采购入库 | 1-销售退货入库 | 2-盘盈入库 | 3-调拨入库 | 4-其他入库
    warehousingStatus: [{'name':'全部','value':''},{'name':'待入库','value':'0'},{'name':'已入库','value':'1'},{'name':'已关闭','value':'2'}],
    purchase: $.constant.WarehouseInType.PURCHASE === GetQueryString("type"), // 采购入库
    sale: $.constant.WarehouseInType.SALE === GetQueryString("type"), // 销售退货入库
    inventoryProfit: $.constant.WarehouseInType.INVENTORY_PROFIT === GetQueryString("type"), // 盘盈入库
    allocation: $.constant.WarehouseInType.ALLOCATION === GetQueryString("type"), // 调拨入库
    other: $.constant.WarehouseInType.OTHER === GetQueryString("type") // 其他入库
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        initSearch(stoWarehouseInMainList.warehousingType); //初始化搜索框
        getList(stoWarehouseInMainList.warehousingType);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(warehousingType) {
    var conds = [];
    var bussOrderNoText = '';
    if (warehousingType === $.constant.WarehouseInType.PURCHASE || warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {
        bussOrderNoText = warehousingType === $.constant.WarehouseInType.PURCHASE ? '采购单编号：' : '盘点单编号：';
        conds = [
            {field: 'orderInNo', title: '入库单编号：', type: 'input'}
            , {field: 'bussOrderNo', title: bussOrderNoText, type: 'input'}
            , {
                field: 'status', type: 'select', title: '入库状态：'
                , data: stoWarehouseInMainList.warehousingStatus
            }
            , {field: 'createTime', title: '入库日期：', type: 'date_range'}
        ];
    } else if (warehousingType === $.constant.WarehouseInType.SALE || warehousingType === $.constant.WarehouseInType.ALLOCATION || warehousingType === $.constant.WarehouseInType.OTHER) {
        conds = [
            {field: 'orderInNo', title: '入库单编号：', type: 'input'}
            , {
                field: 'status', type: 'select', title: '入库状态：'
                , data: stoWarehouseInMainList.warehousingStatus
            }
            , {field: 'createTime', title: '入库日期：', type: 'date_range'}
        ];
    }

    _initSearch({
        elem: '#stoWarehouseInMainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'stoWarehouseInMainList_search'  //指定的lay-filter
        , conds: conds
        , done: function (filter, data) {}
        , search: function (data) {
            var field = data.field;
            field.createTimeBegin = $('input[name="createTime_begin"]').val();
            field.createTimeEnd = $('input[name="createTime_end"]').val();
            var table = layui.table; //获取layui的table模块
            table.reload('stoWarehouseInMainList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(warehousingType) {
    var cols;
    var width;
    var bussOrderNoText = '';
    var field = {};
    if (warehousingType === $.constant.WarehouseInType.PURCHASE || warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {
        width = warehousingType === $.constant.WarehouseInType.PURCHASE ? 140 : 190;
        bussOrderNoText = warehousingType === $.constant.WarehouseInType.PURCHASE ? '采购单编号' : '盘点单编号';
        field = warehousingType === $.constant.WarehouseInType.PURCHASE ? {field: 'supplierName', title: '供应商名称'} : {field: 'remarks', title: '摘要'};
        cols = [[ //表头
            {
                templet: "#checkAll",
                title: "<input type='checkbox' name='checkAll' lay-skin='primary' lay-filter='checkAll'> ",
                width: 48,
                fixed: 'left'
            }
            , {type: 'numbers', title: '序号', width: 60}  //序号
            , {field: 'orderInNo', title: '入库单编号', align: 'center', width: 170}
            , {field: 'bussOrderNo', title: bussOrderNoText, align: 'center', width: 170}
            , field
            , {
                field: 'warehouseInDate', title: '入库日期', align: 'center', width: 120
                , templet: function (d) {
                    if(isNotEmpty(d.warehouseInDate)){
                        return util.toDateString(d.warehouseInDate, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            }
            , {field: 'createByText', title: '操作人', align: 'center', width: 100}
            , {field: 'status', title: '入库状态', align: 'center', width: 100
                ,templet: function(d){
                    return stoWarehouseInMainList.warehousingStatus.filter(x => x.value == d.status)[0].name;
                }}
            , {
                fixed: 'right', title: '操作', width: width, align: 'left'
                , toolbar: '#stoWarehouseInMainList_bar'
            }
        ]];
    } else if (warehousingType === $.constant.WarehouseInType.SALE || warehousingType === $.constant.WarehouseInType.ALLOCATION || warehousingType === $.constant.WarehouseInType.OTHER) {
        cols = [[ //表头
            {
                templet: "#checkAll",
                title: "<input type='checkbox' name='checkAll' lay-skin='primary' lay-filter='checkAll'> ",
                width: 48,
                fixed: 'left'
            }
            , {type: 'numbers', title: '序号', width: 60}  //序号
            , {field: 'orderInNo', title: '入库单编号', align: 'center', width: 170}
            , {field: 'remarks', title: '摘要'}
            , {
                field: 'warehouseInDate', title: '入库日期', align: 'center', width: 120
                , templet: function (d) {
                    if(isNotEmpty(d.warehouseInDate)){
                        return util.toDateString(d.warehouseInDate, "yyyy-MM-dd");
                    }else{
                        return "";
                    }

                }
            }
            , {field: 'createByText', title: '操作人', align: 'center', width: 100}
            , {field: 'status', title: '入库状态', align: 'center', width: 100
                ,templet: function(d){
                    return stoWarehouseInMainList.warehousingStatus.filter(x => x.value == d.status)[0].name;
                }}
            , {
                fixed: 'right', title: '操作', width: 190, align: 'left'
                , toolbar: '#stoWarehouseInMainList_bar'
            }
        ]];
    }

    var param = {
        type: stoWarehouseInMainList.warehousingType
    };
    //获取layui的table模块
    var table = layui.table;
    var form = layui.form;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#stoWarehouseInMainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'stoWarehouseInMainList_table', //必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoWarehouseInMain/list.do",
            where: param,
            cols: cols,
            done: function (res, curr, count) {
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
            if (layEvent === 'set' || layEvent === 'detail') { // 设置或详情
                if (isNotEmpty(data.warehouseInMainId)) {
                    setOrDetail(data.warehouseInMainId, warehousingType, layEvent, (layEvent === 'set' ? false : true), data.status);
                }
            } else if (layEvent === 'close') { // 关闭
                if (isNotEmpty(data.warehouseInMainId)) {
                    var ids = [];
                    ids.push(data.warehouseInMainId);
                    close(ids);
                }
            } else if (layEvent === 'apply') { // 审批入库
                layer.confirm('确定入库所选记录吗？', function (index) {
                    layer.close(index);

                    if (isNotEmpty(data.warehouseInMainId)) {
                        var ids = [];
                        ids.push(data.warehouseInMainId + '@' + stoWarehouseInMainList.warehousingType);
                        apply(ids);
                    }
                });
            } else if (layEvent === 'deAudit') { // 反审核
                if (isNotEmpty(data.orderInNo)) {
                    layer.confirm('确定反审核 <span style="color: blue;">' + data.orderInNo + '</span> 的入库记录吗？', function (index) {
                        layer.close(index);
                        deAudit(data.orderInNo, stoWarehouseInMainList.warehousingType, data.bussOrderNo);
                    });
                } else {
                    layer.alert('获取入库单编号失败');
                }
            }
        }
    });
}

/**
 * 设置、详情按钮弹窗
 */
function setOrDetail(id, warehousingType, layEvent, readonly, warehouseInStatus) {
    var title = layEvent === 'detail' ? '详情' : '设置';
    var url = $.config.server + "/stock/stoWarehouseInMainEdit?id=" + id + '&type=' + warehousingType + '&layEvent=' + layEvent + '&status=' + warehouseInStatus;

    if (isEmpty(id)) {  //id为空,新增操作
        title = '新增';
        url = $.config.server + '/stock/stoWarehouseInMainEdit?type=' + warehousingType + '&status=' + warehouseInStatus;
        readonly = false;
    }

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoWarehouseInMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 审批入库
 * @param ids
 */
function apply(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseInMain/apply.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("入库成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoWarehouseInMainList_table'); //重新刷新table
        }
    });
}

/**
 * 批量审批入库
 */
function batchApply() {
    var ids = [];
    $.each($("input[name='checkOne']:checked"), function (i, obj) {
        var id = $(this).attr("data-id");
        ids.push(id + '@' + stoWarehouseInMainList.warehousingType);
    });

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
 * 反审核
 * @param orderInNo 入库单编号
 * @param warehousingType 入库类型
 * @param bussOrderNo 业务单据编号
 */
function deAudit(orderInNo, warehousingType, bussOrderNo) {
    var param = {
        dataSource: $.constant.DeAuditDataSource.IN, // 入库
        type: $.constant.DeAuditDataSource.IN + warehousingType, // 反审核类型
        orderNo: orderInNo, // 单据编号
        bussOrderNo: bussOrderNo // 业务单据编号
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseInMain/deAudit.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("反审核成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoWarehouseInMainList_table'); //重新刷新table
        }
    });
}

/**
 * 关闭入库单
 * @param id
 */
function close(id) {
    _layerOpen({
        url: $.config.server + '/stock/stoCloseEdit?id=' + id,
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 425,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: '关闭', //弹框标题
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("关闭成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoWarehouseInMainList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 导出Excel
 */
function exportExcel() {
    var fileName = '';
    if (stoWarehouseInMainList.purchase) {
        fileName = '采购入库列表';
    } else if (stoWarehouseInMainList.sale) {
        fileName = '销售退货入库列表';
    } else if (stoWarehouseInMainList.inventoryProfit) {
        fileName = '盘盈入库列表';
    } else if (stoWarehouseInMainList.allocation) {
        fileName = '调拨入库列表';
    } else if (stoWarehouseInMainList.other) {
        fileName = '其他入库列表';
    }

    _downloadFile({
        url: $.config.services.pharmacy + '/stoWarehouseInMain/export.do',
        data: getSearchParam(),
        fileName: fileName + '.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {*}
 */
function getSearchParam() {
    var fm = layui.form.val('stoWarehouseInMainList_search');
    return $.extend({
        orderInNo: fm.orderInNo,
        bussOrderNo: fm.bussOrderNo,
        status: fm.status,
        createTimeBegin: $('input[name="createTime_begin"]').val(),
        createTimeEnd: $('input[name="createTime_end"]').val(),
        type: stoWarehouseInMainList.warehousingType,
    }, getRequestParam("stoWarehouseInMainList_search"));
}
