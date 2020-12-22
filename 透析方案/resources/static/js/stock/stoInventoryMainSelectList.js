/**
 * 盘点查询
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/11
 */
var stoInventoryMainSelectList = avalon.define({
    $id: "stoInventoryMainSelectList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    warehouseList: []
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        getWarehouseList();
        avalon.scan();
    });
});

/**
 * 盘盈盘亏结束后刷新table并提示
 * @param index
 */
window.success = function (index) {
    layer.close(index);
    var table = layui.table;
    table.reload('stoInventoryMainSelectList_table'); //重新刷新table
    successToast("操作成功");
};

/**
 * 获取仓库下拉值
 */
function getWarehouseList() {
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basWarehouse/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoInventoryMainSelectList.warehouseList = data;
            layui.form.render();
        }
    });
}

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#stoInventoryMainSelectList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'stoInventoryMainSelectList_search'  //指定的lay-filter
        , conds: [
            {field: 'inventoryDate', title: '盘点日期：', type: 'date_range'}
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
            table.reload('stoInventoryMainSelectList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        "status": '1'
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#stoInventoryMainSelectList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'stoInventoryMainSelectList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoInventoryMain/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {field: 'inventoryNo', title: '盘点单号', align: 'center'}
                , {
                    field: 'houseNo', title: '盘点仓库', align: 'center',
                    templet: function (d) {
                        return getHouse(d.houseNo);
                    }
                }
                , {
                    field: 'inventoryDate', title: '盘点日期', align: 'center',
                    templet: function (d) {
                        return util.toDateString(d.inventoryDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'name', title: '盘点名称', align: 'center'}
                , {
                    field: 'status', title: '盘点状态', align: 'center',
                    templet: function (d) {
                        return getStoStatus(d.status);
                    }
                }
                , {
                    title: '状态', align: 'center',
                    templet: function (d) {
                        return getStatus(d.inventoryAmount);
                    }
                }
                , {
                    field: 'inventoryAmount', title: '盘点金额', align: 'right', width: 200,
                    templet: function (d) {
                        return isNotEmpty(d.inventoryAmount) ? parseFloat(d.inventoryAmount).toFixed(2) : ""
                    }
                }

                , {
                    fixed: 'right', title: '操作', align: 'center', width: 140
                    , toolbar: '#stoInventoryMainSelectList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'detail') { //编辑
                if (isNotEmpty(data.inventoryNo)) {
                    detail(data.inventoryNo, data.remarks, data.status);
                }
            }
        }
    });
}

/**
 * 获取盘点状态
 */
function getStoStatus(status) {
    if (status === "0") {
        return "新增盘点单";
    } else if (status === "1") {
        return "盘点开始";
    } else {
        return "盘点结束";
    }
}

/**
 * 获取仓库
 */
function getHouse(houseNo) {
    var list = stoInventoryMainSelectList.warehouseList;
    var house = "";
    if (houseNo !== "" && houseNo !== null) {
        var houseNoList = houseNo.split(",");
        for (var i in list) {
            for (var j in houseNoList) {
                if (list[i].warehouseId === houseNoList[j]) {
                    house += list[i].houseName + ","
                    break;
                }
            }
        }
    }
    if (house !== "") {
        house = house.substr(0, house.length - 1);
    }
    return house;
}

/**
 * 获取盘点状态
 */
function getStatus(inventoryAmount) {
    var data = "";
    if (inventoryAmount !== null && inventoryAmount !== undefined) {
        if (inventoryAmount == 0) {
            data = "符合";
        } else if (inventoryAmount > 0) {
            data = "盘盈";
        } else {
            data = "盘亏";
        }
    }

    return data;
}

/**
 * 获取单个实体
 */
function detail(inventoryNo, remarks, status) {
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: $.config.server + "/stock/stoInventorySelectDetailList?inventoryNo=" + inventoryNo + "&remarks=" + remarks + "&status=" + status,
        width: 1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: "盘点详情", //弹框标题
        readonly: true
    });
}


