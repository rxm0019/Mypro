/**
 * 库存盘点单
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/09
 */
var stoInventoryDetailList = avalon.define({
    $id: "stoInventoryDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    houseNo: '', //仓库编号
    inventoryNo: '', //盘点单号
    warehouseList:[], //仓库下拉值
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getWarehouseList();
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

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
            var list = [{name: "", value: ""}];
            for (var i in data) {
                var temp = {name: data[i].houseName, value: data[i].warehouseId}
                list.push(temp)
            }
            stoInventoryDetailList.warehouseList = list;
            layui.form.render();
        }
    });
}

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#stoInventoryDetailList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'stoInventoryDetailList_search'  //指定的lay-filter
        ,conds:[
            {field: 'houseNo', title: '仓库名称：', type: 'select', data: stoInventoryDetailList.warehouseList}
            , {field: 'materielNo', title: '编码或名称：', type: 'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('stoInventoryDetailList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#stoInventoryDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoInventoryDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoInventoryDetail/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'houseName', title: '仓库', align: 'center', width: 100}
                , {
                    field: "materialType", title: "物料类别", align: 'center', width: 100,
                    templet: function (d) {
                        return findMaterialType(d.materialType);
                    }
                }
                , {field: 'materielNo', title: '物料编码', align: 'center'}
                , {field: 'materielName', title: '物料名称', align: 'center'}
                , {field: 'batchNo', title: '批次号', align: 'center'}
                , {
                    field: 'expirationDate', title: '到期日期', align: 'center', width: 140,
                    templet: function (d) {
                        return util.toDateString(d.expirationDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'stockCount', title: '库存数量', align: 'center', width: 100}
                , {field: 'stockLockCount', title: '锁库数量', align: 'center', width: 100}
                , {field: 'basicUnit', title: '单位', align: 'center', width: 100,
                    templet: function (d) {
                        return getSysDictName($.dictType.purSalesBaseUnit,d.basicUnit);
                    }
                }
                , {field: 'inventoryCount', title: '* 盘点数量', align: 'center', edit: "text", width: 100}
            ]],
            done: function (res, curr, count) {
                if (res.bizData.length > 0) {
                    stoInventoryDetailList.houseNo = res.bizData[0].houseNo;
                    stoInventoryDetailList.inventoryNo = res.bizData[0].inventoryNo;
                }
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(stoInventoryDetailList_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段
        // 判断数据类型
        if (isNotEmpty($.trim(value)) && (isNumber($.trim(value)) && value % 1 === 0)) {
            if (Math.abs(value) > 9999999.99) {
                var error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + '超出上限值')
                ].join('');
                errorToast(error);
                // 恢复之前单元格的值
                var tr = obj.tr;
                var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                $(tr).find("td[data-field='" + field + "'] input").val(oldText);
            }
        } else {
            var msg = '';
            if (isEmpty($.trim(value))) {
                msg = '盘点数量为必填项';
            } else {
                msg = '请输入整数';
            }
            var error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + '</span>' + msg)
            ].join('');
            errorToast(error);
            // 恢复之前单元格的值
            var tr = obj.tr;
            var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
            $(tr).find("td[data-field='" + field + "'] input").val(oldText);
        }
    });
}


/**
 * 获取物料类别
 * @param materialType
 * @returns {string}
 */
function findMaterialType(materialType) {
    var data = "";
    if (materialType !== "" && materialType !== undefined) {
        data = materialType === "1" ? "药品" : "耗材"
    }
    return data
}

/**
 * 添加
 */
function add() {
    var title = "新增盘点物料";
    var houseNo = stoInventoryDetailList.houseNo;
    var inventoryNo = stoInventoryDetailList.inventoryNo;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: $.config.server + "/stock/stoInventoryInsertCheckList?inventoryNo=" + inventoryNo + "&houseNo=" + houseNo,  //弹框自定义的url，会默认采取type=2
        width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: ['确定', '全部', '取消'], // btnType=0时设置才生效
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    //锁库
                    check(inventoryNo);
                    successToast("操作成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoInventoryDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        btn2: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var ids = iframeWin.saveAll(
                //成功保存之后的操作，刷新页面
                function success() {
                    //锁库
                    check(inventoryNo);
                    successToast("操作成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoInventoryDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );

        }
    });
}

/**
 * 锁库
 * @param inventoryNo
 */
function check(inventoryNo) {
    var param = {
        "inventoryNo": inventoryNo
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoInventoryMain/setCheck.do",
        data: param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function (data) {
            successToast("操作成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoInventoryDetailList_table'); //重新刷新table
        }
    });
}


/**
 * 保存
 */
function save() {
    var table = layui.table; //获取layui的table模块
    var list = table.cache.stoInventoryDetailList_table;
    var inventoryCountList = [];
    var inventoryDetailIdList = [];
    var differCountList = [];
    var differAmountList = [];
    var inventoryNo = stoInventoryDetailList.inventoryNo;
    var flag = true;
    debugger
    if (list.length > 0) {
        $.each(list, function (i, item) {
            if(item.inventoryCount == null || item.inventoryCount==undefined){
                flag = false;
                return flag;
            }
            inventoryCountList.push(item.inventoryCount);
            inventoryDetailIdList.push(item.inventoryDetailId);

            //差量＝盘点数量－库存数量
            var differCount = item.inventoryCount - item.stockCount;
            differCountList.push(differCount);
            //金额＝差量*成本价格
            var differAmount = differCount * parseFloat(isNotEmpty(item.costPrice) ? item.costPrice : 0);
            differAmountList.push(differAmount);
        });
        if (!flag) {
            errorToast("保存失败！盘点数量不能为空！");
            return;
        }
        var field = {
            "inventoryCountList": inventoryCountList,
            "inventoryDetailIdList": inventoryDetailIdList,
            "differCountList": differCountList,
            "differAmountList": differAmountList,
            "inventoryNo": inventoryNo,
        };

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoInventoryDetail/saveInventoryCount.do",
            data: field,
            dataType: "json",
            done: function (data) {
                successToast("保存成功");
                var table = layui.table; //获取layui的table模块
                table.reload('stoInventoryDetailList_table'); //重新刷新table
            }
        });
    } else {
        warningToast("无数据可保存！");
    }
}

/**
 * 导出excel
 */
function onExportExcel() {
    layer.confirm('请确定数据已经保存，否则导出的资料可能不正确', function (index) {
        _downloadFile({
            url: $.config.services.pharmacy + "/stoInventoryDetail/export.do",
            data: getSearchParam(),
            fileName: '库存盘点.xlsx'
        });
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var searchParam = layui.form.val("stoInventoryDetailList_search");
    return $.extend({
        houseName: '',
        materialType: '',
        materielNo: '',
        materielName: '',
        batchNo: '',
        expirationDate: '',
        stockCount: '',
        stockLockCount: '',
        basicUnit: '',
        inventoryCount: ''
    }, searchParam)
}

/**
 * 导入完成后刷新页面
 */
function refresh(){
    layui.table.reload('stoInventoryDetailList_table');
}

/**
 * 导入数据
 */
function importExcel(){
    layer.confirm('导入的Excel必须是当前功能所导出的Excel', function (index) {
        baseFuncInfo.batchImp('stoInventoryDetail', 'pharmacy')
        layer.close(index)
    });
}