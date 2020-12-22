/**
 * 修改采购数量
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/24
 */
var setPurchaseQuantityList = avalon.define({
    $id: "setPurchaseQuantityList",
    baseFuncInfo: baseFuncInfo//底层基本方法
    ,showName: GetQueryString("showName") // 预算显示名称
    ,materielType: GetQueryString("materielType") // 物料类别：0药品|1耗材
    ,budgetType: GetQueryString("budgetType") // 预算类型：0有物料编码|1无物料编码
    ,requisitionNo: GetQueryString("requisitionNo") // 采购申请单号
    ,budgetInfoId: GetQueryString("budgetInfoId") // 采购预算记录ID
    ,stockCount: GetQueryString("stockCount") // 现有库存数量
    ,editValue: 0 // 被编辑的值
    ,editAfterValue: 0 // 采购数量汇总的值
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var param = {
        showName: setPurchaseQuantityList.showName,
        materielType: setPurchaseQuantityList.materielType,
        requisitionNo: setPurchaseQuantityList.requisitionNo
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#setPurchaseQuantityList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'setPurchaseQuantityList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-20', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + '/purBudgetInfo/getMaterielList.do',
            where: param,
            cols: [[ //表头
                {type: 'numbers', title: '序号', width:60, align:'center' }  //序号
                ,{field: 'specifications', title: '规格'}
                ,{field: 'materielNo', title: '物料编码', align:'center'}
                ,{field: 'materielName', title: '物料名称'}
                ,{field: 'supplierName', title: '供应商名称'}
                ,{field: 'purchaseQuantity', title: '采购数量', edit: 'text', align:'right'}
                ,{field: 'basicUnit', title: '单位', align:'center', templet: function(d) {
                        return getSysDictName($.dictType.purSalesBaseUnit, d.basicUnit);
                    }}
                ,{field: 'purchaseQuantityReal', title: '实际采购数量', align:'right'}
                ,{field: 'purchaseUnit', title: '采购单位', align:'center', templet: function(d) {
                        return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                    }}
            ]],
            page: false
        }
    });

    // 监听单元格编辑操作
    table.on('edit(setPurchaseQuantityList_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段
        var error = [];
        var msg = '';
        var rowIndex =  $(obj.tr).attr("data-index"); // 被编辑的行索引
        setPurchaseQuantityList.editValue = value;

        // 判断数据类型
        if (isNotEmpty($.trim(value)) && isNumber($.trim(value))) {
            if (Math.abs(value) > 99999999999) {
                msg = '超出上限值';
                error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + msg)
                ].join('');
                errorToast(error);
            } else {
                if ($.trim(value) >= 0) {
                    // 1、验证是否需要更新采购数量
                    if (checkQuantity(data, value, rowIndex)) {
                        // 2、执行更新逻辑
                        editPurchaseQuantity(data, value, setPurchaseQuantityList.editAfterValue);
                    }
                } else {
                    msg = '请录入大于或等于0的数字';
                    error = [
                        '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + (msg)
                    ].join('');
                    errorToast(error);

                    // 恢复之前单元格的值
                    var tr = obj.tr;
                    var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                    $(tr).find("td[data-field='" + field + "'] input").val(oldText);
                }
            }
        } else {
            msg = '';
            if (isEmpty($.trim(value))) {
                msg = '采购数量不能为空';
            } else {
                msg = '不是有效的数字';
            }

            error = [
                '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + $.trim(value) + '</span>' + msg)
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
 * 验证是否需要更新采购数量
 * @param data 所在行所有键值
 * @param value 调整后的采购数量
 * @returns {boolean}
 */
function checkQuantity(data, value, rowIndex) {
    var materielNo = data.materielNo;
    var conversionRel1Purchase = data.conversionRel1Purchase;
    var conversionRel1Sales = data.conversionRel1Sales;
    var conversionRel2Sales = data.conversionRel2Sales;
    var conversionRel2Basic = data.conversionRel2Basic;
    var purchaseUnit = data.purchaseUnit;
    var salesUnit = data.salesUnit;
    var basicUnit = data.basicUnit;
    var purchaseQuantity = value / conversionRel2Basic * conversionRel2Sales / conversionRel1Sales * conversionRel1Purchase;
    var calc = (conversionRel1Sales / conversionRel1Purchase) * (conversionRel2Basic / conversionRel2Sales);
    var rep=/[\.]/; // 正则表达式判断是否有小数点：true有|false无
    if (rep.test(purchaseQuantity)) {
        layer.alert('物料 <span style="color:blue;font-weight:bold">' + materielNo + '</span> 转换比例为：' + '<br>'
            + conversionRel1Purchase + purchaseUnit + conversionRel1Sales + salesUnit + '，'
            + conversionRel2Sales + salesUnit + conversionRel2Basic + basicUnit + '，即'
            + calc + basicUnit + '/1' + purchaseUnit+ '<br/>目前录入采购数量为'
            + value + basicUnit + '，请调整采购数量');
        return false;
    }

    // 获取编辑后最新的采购数量，并汇总
    $.each($('td[data-field="purchaseQuantity"]'), function (i, obj) {
        if (i == rowIndex) {
            setPurchaseQuantityList.editAfterValue += parseInt(setPurchaseQuantityList.editValue);
        } else {
            setPurchaseQuantityList.editAfterValue += parseInt($(obj).text());
        }
    });

    return true;
}

/**
 * 编辑采购数量（预算类型为无物料编码）
 * @param data 所在行所有键值
 */
function editPurchaseQuantity(data, value, editAfterValue) {
    var conversionRel1Purchase = data.conversionRel1Purchase;
    var conversionRel1Sales = data.conversionRel1Sales;
    var conversionRel2Sales = data.conversionRel2Sales;
    var conversionRel2Basic = data.conversionRel2Basic;
    var calcPurchaseCountSuggest = value / conversionRel2Basic * conversionRel2Sales / conversionRel1Sales * conversionRel1Purchase;
    var calcStockCount = data.stockQuantity / conversionRel2Basic * conversionRel2Sales / conversionRel1Sales * conversionRel1Purchase;

    var param = {
        materielNo: data.materielNo,
        materielName: data.materielName,
        specifications: data.specifications,
        purchaseQuantity: data.purchaseQuantity,
        purchaseUnit: data.purchaseUnit,
        calcPurchaseCountSuggest: Math.ceil(calcPurchaseCountSuggest),
        calcStockCount: Math.ceil(calcStockCount),
        requisitionNo: setPurchaseQuantityList.requisitionNo,
        budgetInfoId: setPurchaseQuantityList.budgetInfoId,
        materielType: setPurchaseQuantityList.materielType,
        budgetType: setPurchaseQuantityList.budgetType,
        totalQuantity: editAfterValue,
        supplierId: data.supplierInfoId
    };

    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + '/purBudgetInfo/editPurchaseQuantity.do',
        data: param,  //必须字符串后台才能接收list,
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function () {
            successToast("采购数量已变更");
            setPurchaseQuantityList.editValue = 0;
            setPurchaseQuantityList.editAfterValue = 0;
            var table = layui.table; //获取layui的table模块
            table.reload('setPurchaseQuantityList_table'); //重新刷新table
            parent.refresh(setPurchaseQuantityList.budgetType) //重新刷新父table
        }
    });
}
