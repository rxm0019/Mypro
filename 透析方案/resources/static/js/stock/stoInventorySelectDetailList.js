/**
 * 盘点查询详情
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/11
 */
var stoInventorySelectDetailList = avalon.define({
    $id: "stoInventorySelectDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    statusFlag: true, //控制盘点详情是否可编辑
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...

        var inventoryNo = GetQueryString("inventoryNo");
        var status = GetQueryString("status");
        // status=2表明盘点结束，不可编辑
        if (status === "2") {
            stoInventorySelectDetailList.statusFlag = false;
        } else {
            stoInventorySelectDetailList.statusFlag = true;
        }
        getList(inventoryNo);  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(inventoryNo) {
    var param = {
        inventoryNo: inventoryNo,
        status: '1' //和库存盘点的查询区分开
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#stoInventorySelectDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'stoInventorySelectDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoInventoryDetail/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'houseName', title: '仓库', align: 'center'}
                , {
                    field: "materialType", title: "物料类别", align: 'center',
                    templet: function (d) {
                        return findMaterialType(d.materialType);
                    }
                }
                , {field: 'materielNo', title: '物料编码', width: 150}
                , {field: 'materielName', title: '物料名称', width: 150}
                , {field: 'batchNo', title: '批次号', width: 150}
                , {field: 'stockCount', title: '库存数量', align: 'center'}
                , {field: 'stockLockCount', title: '锁库数量', align: 'center'}
                , {field: 'inventoryCount', title: '盘点数量', align: 'center'}
                , {field: 'differCount', title: '差量', align: 'center'}
                , {
                    field: 'basicUnit', title: '单位', align: 'center'
                    , templet: function (d) {
                        return getSysDictName($.dictType.purSalesBaseUnit, d.basicUnit);
                    }
                }
                , {
                    field: 'status', title: '状态', align: 'center',
                    templet: function (d) {
                        return getStatus(d.differAmount);
                    }
                }
                , {
                    field: 'differAmount', title: '金额', align: 'right',
                    templet: function (d) {
                        return  isNotEmpty(d.differAmount)? parseFloat(d.differAmount).toFixed(2):""
                    }
                }
                , {
                    field: 'remarks',
                    title: '异常原因',
                    width: 210,
                    edit: 'text',
                    hide: !stoInventorySelectDetailList.statusFlag
                }
                , {field: 'remarks', title: '异常原因', width: 210, hide: stoInventorySelectDetailList.statusFlag}
            ]]

        }
    });

}

/**
 * 获取状态
 */
function getStatus(differAmount) {
    var data = "";
    if (differAmount !== null && differAmount !== undefined) {
        if (differAmount > 0) {
            data = "盘盈";
        } else if (differAmount < 0) {
            data = "盘亏";
        } else {
            data = "符合";
        }
    }
    return data;
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
 * 保存
 */
function save() {
    var table = layui.table; //获取layui的table模块
    var list = table.cache.stoInventorySelectDetailList_table;
    var remarksList = [];
    var inventoryDetailIdList = [];
    var inventoryNo = list[0].inventoryNo;
    var flag = true;
    $.each(list, function (i, item) {
        if (item.inventoryCount == null || item.inventoryCount == undefined) {
            flag = false;
            return flag;
        }
        remarksList.push(item.remarks == null ? '' : item.remarks);
        inventoryDetailIdList.push(item.inventoryDetailId);
    });
    if (!flag) {
        errorToast("保存失败！盘点数量不能为空！");
        return;
    }
    var field = {
        "inventoryNo": inventoryNo,
        "remarksList": remarksList,
        "inventoryDetailIdList": inventoryDetailIdList
    };
    //可以继续添加需要上传的参数
    _ajax({
        type: "POST",
        //loading:true,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/stoInventoryDetail/saveRemarks.do",
        data: field,
        dataType: "json",
        done: function (data) {
            successToast("保存成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoInventorySelectDetailList_table'); //重新刷新table
        }
    });
}

/**
 * 盘盈盘亏处理
 */
function dispose() {
    layer.confirm('请确定数据已经保存,否则资料可能不正确', function (index) {
        var table = layui.table; //获取layui的table模块
        var stoInventoryDetailList = table.cache.stoInventorySelectDetailList_table;
        var flag = true;
        $.each(stoInventoryDetailList, function (i, item) {
            if (item.inventoryCount == null || item.inventoryCount == undefined) {
                flag = false;
                return flag;
            }
        });
        if (!flag) {
            errorToast("操作失败！盘点数量不能为空！");
            return;
        }
        var data = {
            stoInventoryDetailList: stoInventoryDetailList,
            inventoryNo: GetQueryString("inventoryNo"),
            remarks: GetQueryString("remarks")
        }

        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoInventoryDetail/dispose.do",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            done: function (data) {
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.success(index);
            }
        });
    });
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
    var inventoryNo = GetQueryString("inventoryNo");
    var searchParam = layui.form.val("stoInventorySelectDetailList_search");
    var param = $.extend({
        houseName: '',
        materialType: '',
        materielNo: '',
        materielName: '',
        batchNo: '',
        stockCount: '',
        stockLockCount: '',
        basicUnit: '',
        inventoryCount: '',
        status: '',
        differCount: '',
        differAmount: '',
        remarks: ''
    }, searchParam);
    param.inventoryNo = inventoryNo
    return param
}
