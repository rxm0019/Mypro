/**
 * 库存查询
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/14
 */
var stoStockInfoList = avalon.define({
    $id: "stoStockInfoList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    materielType: [{name: '', value: ''}, {name: '药品', value: '1'}, {name: '耗材', value: '2'}], //搜索栏下拉框
    stoType: [{name: '即时', value: "true"}, {name: '月初', value: "false"}], //单选
    currentTable: 'stoStockInfoListDetail_table',   //当前tab使用的table
    category: true, //true-详情 false-总览
    type: "true",   //控制单选的值
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var form = layui.form;
        var $ = layui.jquery;
        // 单选监听
        form.on('radio(stoType)', function (data) {
            if (data.value == "true") {
                $("#monthDate_begin").parent().parent().parent().addClass("layui-hide")
                stoStockInfoList.type = "true"
                var param =  layui.form.val("stoStockInfoList_search")
                getList("true",param)
            } else {
                $("#monthDate_begin").parent().parent().parent().removeClass("layui-hide")
                stoStockInfoList.type = "false"
                var param =  layui.form.val("stoStockInfoList_search")
                getList("false",param)
            }
        })
        // tab监听
        tabEvent();
        initSearch(); //初始化搜索框
        getList("true");  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {

    _initSearch({
        elem: '#stoStockInfoList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'stoStockInfoList_search'  //指定的lay-filter
        , conds: [
            {field: 'materielType', title: '物料类别：', type: 'select', data: stoStockInfoList.materielType}
            , {field: 'materielNo', title: '编码或名称：', type: 'input'}
            , {field: 'stoType', type: 'radio', data: stoStockInfoList.stoType, value: "true"}
            , {field: 'monthDate', title: '日期：', type: 'date_range'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            layui.jquery("#monthDate_begin").parent().parent().parent().addClass("layui-hide")
            var util = layui.util;
            var date = new Date();
            var startDate = new Date(date.getMonth() == 0 ? date.getFullYear()-1 + "-12-01" : date.getFullYear() +"-" + date.getMonth() +"-01");
            var endDate = new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-01");
            console.log("startDate", endDate)
            layui.form.val("stoStockInfoList_search", {monthDate_begin: util.toDateString(startDate, "yyyy-MM-dd")});
            layui.form.val("stoStockInfoList_search", {monthDate_end: util.toDateString(endDate, "yyyy-MM-dd")});
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload(stoStockInfoList.currentTable, {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(stoType, field) {
    var param = {
        category: stoStockInfoList.category,
        stoType: stoType
    };
    if (field != undefined && field != null) {
        param = field;
        param.category = stoStockInfoList.category;
    }
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    var cols = [[ //表头
        {type: 'numbers', title: '序号', width: 60}  //序号
        , {
            field: 'materielNo', title: '物料编码',
            templet: function (d) {
                return getStyle(d, d.materielNo);
            }
        }
        , {
            field: 'materielName', title: '物料名称',
            templet: function (d) {
                return getStyle(d, d.materielName);
            }
        }
        , {
            field: 'materielType', title: '物料类别', align: 'center', width: 120,
            templet: function (d) {
                return getStyle(d, d.materielType, "materielType");
            }
        }
        , {
            field: 'specifications', title: '规格', align: 'center',
            templet: function (d) {
                return getStyle(d, d.specifications);
            }
        }
        , {
            field: 'manufactor', title: '厂家',
            templet: function (d) {
                return getStyle(d, d.manufactor);
            }
        }
        , {
            field: 'basicUnit', title: '单位', align: 'center', width: 100,
            templet: function (d) {
                return getStyle(d, d.basicUnit,"basicUnit");
            }
        }
        , {
            field: 'stockCount', title: '实际数量', align: 'right', width: 120,
            templet: function (d) {
                return getStyle(d, d.stockCount);
            }
        }
        , {
            field: 'stockLockCount', title: '锁库数量', align: 'right', width: 120,
            templet: function (d) {
                return getStyle(d, d.stockLockCount);
            }
        }
    ]]

    if (!stoStockInfoList.category) {
        var thisCols = [
            {
                field: 'inventoryCap',
                title: "库存上限",
                align: 'center', width: 100,
                templet: function (d) {
                    return getStyle(d, d.inventoryCap);
                }
            }
            , {
                field: 'inventoryFloor',
                title: "库存下限",
                align: 'center',
                width: 100,
                templet: function (d) {
                    return getStyle(d, d.inventoryFloor);
                }
            }
        ]
        cols[0] = cols[0].concat(thisCols);
    } else {
        var otherCols = [
            {
                field: 'batchNo', title: '批次号',
                templet: function (d) {
                    return getStyle(d, d.batchNo);
                }
            }
            , {
                field: 'houseName', title: '仓库', align: 'center', width: 120,
                templet: function (d) {
                    return getStyle(d, d.houseName);
                }
            }
            , {
                field: 'expirationDate',
                title: '失效日期',
                align: 'center',
                width: 110,
                //hide: !stoStockInfoList.category,
                templet: function (d) {
                    return getStyle(d, d.expirationDate, "expirationDate");
                }
            }
        ]
        cols[0] = cols[0].concat(otherCols);
    }

    _layuiTable({
        elem: '#' + stoStockInfoList.currentTable, //必填，指定原始表格元素选择器（推荐id选择器）
        filter: stoStockInfoList.currentTable, ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoStockInfo/list.do",
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: cols
        }
    });
}

/**
 * 监听tab
 */
function tabEvent() {
    layui.use('element', function () {
        var element = layui.element;
        //监听Tab切换，以改变地址hash值
        element.on('tab(stockInfoTab)', function () {
            var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id
            if (tabId === 'stoStockInfoListDetail') {
                stoStockInfoList.currentTable = 'stoStockInfoListDetail_table';
                stoStockInfoList.category = true;
            } else if (tabId === 'stoStockInfoListOverview') {
                stoStockInfoList.currentTable = 'stoStockInfoListOverview_table';
                stoStockInfoList.category = false;
            }
            var param =  layui.form.val("stoStockInfoList_search")
            getList(stoStockInfoList.type,param);
        });
    });
}

/**
 * 将快要过期的物料/低于或高于安全库存的物料 显示为红色
 */
function getStyle(data, value, type) {
    //现将数据格式化
    if (type === "materielType") {
        value = value === "1" ? "药品" : "耗材";
    } else if (type === "expirationDate") {
        value = layui.util.toDateString(value, "yyyy-MM-dd");
    }else if(type === "basicUnit"){
        value = getSysDictName($.dictType.purSalesBaseUnit,value)
    }

    //快要过期的物料
    if (stoStockInfoList.category) {
        if (data.residueDate <= 14) {

            return '<span style="color: red;">' + value + '</span>'
        }
    } else { // 低于或高于安全库存的物料
        if (data.stockCount > data.inventoryCap || data.stockCount < data.inventoryFloor) {
            return '<span style="color: red;">' + value + '</span>'
        }
    }
    return value
}

/**
 * 导出excel
 */
function onExportExcel() {
    _downloadFile({
        url: $.config.services.pharmacy + "/stoStockInfo/export.do",
        data: getSearchParam(),
        fileName: '库存查询.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam =  layui.form.val("stoStockInfoList_search")
    searchParam.category = stoStockInfoList.category;
    var data = {
        materielNo: '',
        materielName: '',
        materielType: '',
        specifications: '',
        supplierName: '',
        basicUnit: '',
        stockCount: '',
        stockLockCount: '',
    };
    if (stoStockInfoList.category) {
        data.batchNo = '';
        data.houseNam = '';
        data.expirationDate = '';
    } else {
        data.inventoryFloor = '';
        data.inventoryCp = '';
    }
    return $.extend(data, searchParam)
}