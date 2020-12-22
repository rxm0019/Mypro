/**
 * purOrderMainEdit.ftl的js文件，包括查询，编辑操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/04
 */
var purOrderMainEdit = avalon.define({
    $id: "purOrderMainEdit",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    readonly: {readonly: true}, // 固定栏位只读设置
    prepayment: {readonly: true}, // 预付款比率只读设置
    columnShow: true, // 操作列显示与隐藏，true显示|false隐藏
    btnDelete: false, // 操作列删除按钮，默认false不显示
    btnClose: false, // 操作列关闭按钮，默认false不显示
    importFlag: GetQueryString("importFlag"), // 0系统生成 | 1手动导入
    orderStatus: GetQueryString("orderStatus"), // 订单状态
    purchaseStatus: GetQueryString("purchaseStatus"), // 采购状态
    detailList: [], // 物料明细List
    orderMainId: GetQueryString("id"), // 采购订单ID
    layEvent: GetQueryString("layEvent"), // 按钮事件标识符
    editValue: 0, // 被编辑的值
    settlementTypeStr: '', // 结算方式
    paymentTypeStr: '', // 付款方式
    supplierId: '' // 供应商ID
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        $('#purOrderMainEdit_form').attr('style', '');
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        if (layEvent === 'detail' || layEvent === 'approval') { // 详情或审批
            $('input[type="radio"]').prop('disabled', true);
            $('select').prop('disabled', true);
            purOrderMainEdit.btnClose = true; // 显示关闭按钮（可通过 purOrderMainEdit.columnShow = false 隐藏关闭按钮）

            // 审批环节不显示操作列
            if (layEvent === 'approval') {
                purOrderMainEdit.columnShow = false;
            }

            // 详情页面，采购状态已入库时不显示操作列
            if (layEvent === 'detail' && purOrderMainEdit.purchaseStatus === $.constant.POStatus.WAREHOUSING) {
                purOrderMainEdit.columnShow = false;
            }

            // 非采购完成状态下不显示操作列
            if (purOrderMainEdit.purchaseStatus !== $.constant.POPurchaseStatus.PURCHASE_COMPLETED) {
                purOrderMainEdit.columnShow = false;
            }

            // 订单状态已入库时，不显示操作列
            if (purOrderMainEdit.orderStatus === $.constant.POStatus.WAREHOUSING) {
                purOrderMainEdit.columnShow = false;
            }
        } else if (layEvent === 'edit') { // 编辑
            $('input[type="radio"]').prop('disabled', true);
            purOrderMainEdit.prepayment = { readonly: false }

            if (purOrderMainEdit.importFlag === $.constant.ImportFlag.SYSTEM_GENERATION) {
                $('#stoWarehouseInDetailList_tool').hide();
            } else if (purOrderMainEdit.importFlag === $.constant.ImportFlag.MANUAL_IMPORT) {
                // 订单待审批状态下，编辑时显示删除按钮
                if (purOrderMainEdit.orderStatus === $.constant.POStatus.PENDING_APPROVAL) {
                    purOrderMainEdit.btnDelete = true;
                }
            }
        }

        var id = GetQueryString("id");  //接收变量
        if (isNotEmpty(id)) {
            // 获取采购订单明细内容
            getDetailList(id);

            //获取实体信息
            getInfo(id, function (data) {
                //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
                //...
            });
        }

        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    var param = {
        "orderMainId": id
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.pharmacy + "/purOrderMain/getInfo.do",
        data: param,
        dataType: "json",
        done: function (data) {
            //表单初始赋值
            var form = layui.form; //调用layui的form模块
            purOrderMainEdit.supplierId = data.supplierInfoId;
            purOrderMainEdit.settlementTypeStr = data.settlementType;
            purOrderMainEdit.paymentTypeStr = data.paymentType;
            form.val('purOrderMainEdit_form', data);
            typeof $callback === 'function' && $callback(data); //返回一个回调事件

            // 获取采购订单明细
            getPODetail(id, purOrderMainEdit.columnShow, data.purchaseOrderNo);
        }
    });
}

/**
 * 获取采购订单明细
 */
function getPODetail(id, columnShow, purchaseOrderNo) {
    var cols;
    if (!columnShow) {
        cols = [[{title: '商品清单', colspan: 9}],[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielNo', title: '物料编码',align:'center',width:120}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格',width:120}
            ,{field: 'purchaseUnit', title: '采购单位',align:'center',width:100, templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                }}
            ,{field: 'purchaseCount', title: '数量',align:'right',width:100}
            ,{field: 'warehouseInCountSurplus', title: '可剩余入库采购数量',align:'right',width:160}
            ,{field: 'purchasePrice', title: '单价',align:'right',width:100}
            ,{field: 'totalPrice', title: '总价',align:'right',width:100}
        ]];
    } else {
        cols = [[{title: '商品清单', colspan: 10}],[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielNo', title: '物料编码',align:'center',width:120}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格',width:120}
            ,{field: 'purchaseUnit', title: '采购单位',align:'center',width:100, templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                }}
            ,{field: 'purchaseCount', title: '数量',align:'right',width:100}
            ,{field: 'warehouseInCountSurplus', title: '可剩余入库采购数量',align:'right',width:160}
            ,{field: 'purchasePrice', title: '单价',align:'right',width:100}
            ,{field: 'totalPrice', title: '总价',align:'right',width:100}
            ,{fixed: 'right',title: '操作',width: 140, align:'center',toolbar: '#purOrderDetailEdit_bar'}
        ]];
    }

    if (purOrderMainEdit.layEvent === 'edit') { // 编辑模式
        if (purOrderMainEdit.importFlag === $.constant.ImportFlag.SYSTEM_GENERATION) {
            cols = [[{title: '商品清单', colspan: 9}],[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'materielNo', title: '物料编码',align:'center',width:120}
                ,{field: 'materielName', title: '物料名称'}
                ,{field: 'specifications', title: '规格',width:120}
                ,{field: 'purchaseUnit', title: '采购单位',align:'center',width:100, templet: function(d) {
                        return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                    }}
                ,{field: 'purchaseCount', title: '数量',align:'right',width:100}
                ,{field: 'warehouseInCountSurplus', title: '可剩余入库采购数量',align:'right',width:160}
                ,{field: 'purchasePrice', title: '单价',align:'right',width:100}
                ,{field: 'totalPrice', title: '总价',align:'right',width:100}
            ]];
        } else if (purOrderMainEdit.importFlag === $.constant.ImportFlag.MANUAL_IMPORT) {
            cols = [[{title: '商品清单', colspan: 10}],[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'materielNo', title: '物料编码',align:'center',width:120}
                ,{field: 'materielName', title: '物料名称'}
                ,{field: 'specifications', title: '规格',width:120}
                ,{field: 'purchaseUnit', title: '采购单位',align:'center',width:100, templet: function(d) {
                        return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                    }}
                ,{field: 'purchaseCount', title: '数量',align:'right',width:100, edit:'text'} // 开始编辑框
                ,{field: 'warehouseInCountSurplus', title: '可剩余入库采购数量',align:'right',width:160}
                ,{field: 'purchasePrice', title: '单价',align:'right',width:100}
                ,{field: 'totalPrice', title: '总价',align:'right',width:100}
                ,{fixed: 'right',title: '操作',width: 140, align:'center',toolbar: '#purOrderDetailEdit_bar'}
            ]];
        }
    }

    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#purOrderDetailEdit_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'purOrderDetailEdit_table', //必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height: 'full-220', //table的高度，页面最大高度减去差值
            cols: cols,
            data: purOrderMainEdit.detailList,
            page: false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            done: function (res, curr, count) {
                $.each(res.bizData, function (idx, obj) {
                    if (typeof(obj.quantity) === 'object' && purOrderMainEdit.purchaseStatus === $.constant.POPurchaseStatus.PURCHASE_COMPLETED) {
                        // 清空采购数量、价格
                        var zero = '<div class="layui-table-cell" style="color:red;width:85px">0</div>';
                        $('tr[data-index="' + idx + '"] > td[data-field="purchaseCount"] > div').html(zero);
                        $('tr[data-index="' + idx + '"] > td[data-field="warehouseInCountSurplus"] > div').html('<div class="layui-table-cell" style="color: red;width: 145px">0</div>');
                        $('tr[data-index="' + idx + '"] > td[data-field="purchasePrice"] > div').html(zero);
                        $('tr[data-index="' + idx + '"] > td[data-field="totalPrice"] > div').html(zero);

                        // 移除关闭按钮
                        $('tr[data-index="' + idx + '"] > td[data-field="9"] > div > a').remove();
                    }
                });
            }
        }
        //监听工具条事件
        ,tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            var rowIndex =  $(tr).attr("data-index");
            if(layEvent === 'close'){ // 关闭
                layer.confirm('此操作会同步删除当前物料的剩余入库明细，确定关闭所选记录吗？', function(index){
                    layer.close(index);

                    if(isNotEmpty(data.orderDetailId)){
                        close(purchaseOrderNo, data.materielNo, data.orderMainId);
                    }
                });
            } else if (layEvent === 'delete') { // 删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    layer.close(index);

                    if (isNotEmpty(data.orderDetailId)){
                        var ids = [];
                        ids.push(data.orderDetailId);
                        del(ids, rowIndex);
                    } else { // 添加物料过来的数据中还没有入库明细ID
                        getSelectList().splice(rowIndex, 1); // 从List中删除
                        table.reload('purOrderDetailEdit_table', {
                            data: getSelectList()
                        }); //重新刷新table
                    }

                    parent.layui.table.reload('purOrderMainList_table'); // 重新父table
                });
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(purOrderDetailEdit_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段
        var error = [];
        var msg = '';
        var rowIndex =  $(obj.tr).attr("data-index"); // 被编辑的行索引
        purOrderMainEdit.editValue = value;

        // 判断数据类型
        if (isNotEmpty($.trim(value)) && isNumber($.trim(value))) {
            if (Math.abs(value) > 99999999999) {
                msg = '超出上限值';
                error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + msg)
                ].join('');
                errorToast(error);

                // 恢复之前单元格的值
                var tr = obj.tr;
                var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                $(tr).find("td[data-field='" + field + "'] input").val(oldText);
            } else {
                if ($.trim(value) >= 0) {
                    if (typeof(value) === 'string' && value.indexOf('.') != -1) {
                        msg = '不允许录入小数';
                        error = [
                            '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + (msg)
                        ].join('');
                        errorToast(error);

                        // 恢复之前单元格的值
                        var tr = obj.tr;
                        var oldText = $(tr).find("td[data-field='" + field + "'] div").text();
                        $(tr).find("td[data-field='" + field + "'] input").val(oldText);
                    } else {
                        // 执行编辑采购数量逻辑
                        editPurchaseQuantity(data, value, rowIndex);
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
 * 获取采购订单明细内容
 */
function getDetailList(id) {
    var param = {
        orderMainId: id
    };
    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.pharmacy + "/purOrderDetail/list.do",
        data: param,
        dataType: 'json',
        async: false, // 异步设置为false，防止页面加载无数据
        done: function (data) {
            purOrderMainEdit.detailList = data;
        }
    });
}

/**
 * 关闭，停止采购单中某些物料入库，或结束采购订单
 * @param purchaseOrderNo
 * @param materielNo
 * @param orderMainId
 */
function close(purchaseOrderNo, materielNo, orderMainId) {
    var param = {
        bussOrderNo: purchaseOrderNo,
        materielNo: materielNo,
        orderMainId: orderMainId
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderDetail/close.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("关闭成功");
            layui.table.reload('purOrderDetailEdit_table'); //重新刷新table
            parent.layui.table.reload('purOrderMainList_table'); //重新父table
        }
    });
}

/**
 * 添加物料
 */
function addMateriel() {
    var title = '添加物料';
    var url = $.config.server + '/stock/stoAddMateriel?orderMainId=' + purOrderMainEdit.orderMainId + '&supplierId=' + purOrderMainEdit.supplierId;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: false, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("添加成功");
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 子页面调用，获取已选择的物料数组
 */
function getSelectList() {
    return purOrderMainEdit.detailList;
}

/**
 * 子页面调用，获取返回的物料数组
 * @param ids
 */
function getAddList(data) {
    // 添加选中的物料
    $.each(data, function (i, obj) {
        // 初始化
        obj.purchaseCount = 0; // 数量
        obj.warehouseInCountSurplus = 0; // 可剩余入库采购数量
        obj.totalPrice = 0; // 总价
        obj.orderDetailId = 'CUS' + Math.random().toString().replace('.', '');

        purOrderMainEdit.detailList.push(obj);
    });

    // 将新数据重新载入表格
    layui.table.reload("purOrderDetailEdit_table", {
        data: purOrderMainEdit.detailList
    });
}

/**
 * 编辑采购数量逻辑
 * @param data
 * @param value
 */
function editPurchaseQuantity(data, value, rowIndex) {
    // 可剩余入库采购数量
    data.warehouseInCountSurplus = value; // 可剩余入库采购数量 = 采购数量
    $('tr[data-index="' + rowIndex + '"] td[data-field="warehouseInCountSurplus"]').html('<div class="layui-table-cell laytable-cell-1-1-6">' + data.warehouseInCountSurplus + '</div>');

    // 总价
    data.totalPrice = value * data.purchasePrice;
    $('tr[data-index="' + rowIndex + '"] td[data-field="totalPrice"]').html('<div class="layui-table-cell laytable-cell-1-1-8">' + data.totalPrice + '</div>');
}

/**
 * 数据验证
 * @param msg
 */
function validation(field) {
    var str = '';

    // 预付款比率
    var prepayment = field.prepayment;
    if (typeof(prepayment) === 'string') {
        if (parseFloat(prepayment) < 0.00) {
            str += '预付款比率不能小于0<br>';
        }
        if (parseFloat(prepayment) > 100.00) {
            str += '预付款比率不能超出100<br>';
        }
    }

    if (str !== '') {
        error = [
            '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + (str)
        ].join('');
        errorToast(error);
        return false;
    } else {
        return true;
    }
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(purOrderMainEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        if (!validation(field)) {
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#purOrderMainEdit_submit").trigger('click');
}

/**
 * 保存采购单明细内容（编辑页面下，点击确定按钮）
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var purOrderDetailList = layui.table.cache.purOrderDetailEdit_table;

        var param = {
            orderMainId: field.orderMainId,
            settlementType: field.settlementType,
            paymentType: field.paymentType,
            prepayment: field.prepayment,
            purOrderDetailList: purOrderDetailList
        }

        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purOrderDetail/saveOrEdit.do",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 删除
 * @param ids
 * @param index
 */
function del(ids, index) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purOrderDetail/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");

            getSelectList().splice(index, 1); // 从List中删除
            layui.table.reload('purOrderDetailEdit_table', {
                data: getSelectList()
            }); //重新刷新table
        }
    });
}