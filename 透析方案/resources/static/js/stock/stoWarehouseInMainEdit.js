/**
 * 入库管理的js文件，包括查询，编辑操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/10
 */
var stoWarehouseInMainEdit = avalon.define({
    $id: "stoWarehouseInMainEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    purchaseTrue: false, // 采购入库固定值False
    inventoryProfitTrue: false, // 盘盈入库固定值False
    fixedField: {readonly: false}, // 固定栏位只读设置
    dynamicField: {readonly: false}, // 动态栏位只读设置
    warehousingType: GetQueryString("type"), // 入库类型：0-采购入库 | 1-销售退货入库 | 2-盘盈入库 | 3-调拨入库 | 4-其他入库
    warehousingStatus: [{'name':'全部','value':''},{'name':'待入库','value':'0'},{'name':'已入库','value':'1'},{'name':'已关闭','value':'2'}],
    materielType: [{'name':'药品','value':'1'},{'name':'耗材','value':'2'}],
    purchase: $.constant.WarehouseInType.PURCHASE === GetQueryString("type"), // 采购入库
    sale: $.constant.WarehouseInType.SALE === GetQueryString("type"), // 销售退货入库
    inventoryProfit: $.constant.WarehouseInType.INVENTORY_PROFIT === GetQueryString("type"), // 盘盈入库
    allocation: $.constant.WarehouseInType.ALLOCATION === GetQueryString("type"), // 调拨入库
    other: $.constant.WarehouseInType.OTHER === GetQueryString("type"), // 其他入库
    warehouseList: [], // 仓库下拉值
    warehouseInMainId: GetQueryString("id"), // 入库主表ID
    orderInNo: '', // 入库单编号
    allocationDeliveryList: [], // 调拨出库单下拉列表
    layEvent: GetQueryString("layEvent"), // 按钮事件
    showOrderOutNo: false, // 显示调拨出库单编号（仅调拨入库时用），默认不显示
    orderOutNoStr: '', // 调拨出库单显示值
    sign: true, // 调拨入库添加物料按钮显示与隐藏
    warehouseInStatus: GetQueryString("status"), // 入库状态
    detailList: [], // 物料明细列表（调拨入库）
    materielDetailList: [], // 物料明细列表
    bussOrderNo: '', // 采购单编号 or 盘点单编号
});

/**
 * 调拨入库单列表监听
 */
stoWarehouseInMainEdit.$watch('orderOutNoStr', function (id) {
    if (id !== '') {
        // 获取物料明细列表（调拨入库）
        getDetailList(id);

        var util = layui.util;
        var table = layui.table;

        _layuiTable({
            elem: '#stoWarehouseInDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter: 'stoWarehouseInDetailList_table', //必填，指定的lay-filter的名字
            //执行渲染table配置
            render:{
                height: 'full-180', //table的高度，页面最大高度减去差值
                cols: [[ //表头
                    {type: 'numbers', title: '序号',width:60,fixed: 'left'}  //序号
                    ,{field: 'materielType', title: '物料类别',align:'center',fixed: 'left', width:90
                        ,templet: function(d){
                            return stoWarehouseInMainEdit.materielType.filter(x => x.value == d.materielType)[0].name;
                        }}
                    ,{field: 'materielNo', title: '物料编码',align:'center',fixed: 'left', width:150}
                    ,{field: 'materielName', title: '物料名称',align:'left',fixed: 'left', width:250}
                    ,{field: 'specifications', title: '规格',align:'left', width:150}
                    ,{field: 'manufactor', title: '厂家',align:'left', width:300}
                    ,{field: 'basicUnit', title: '单位',align:'center', width:60, templet: function(d) {
                            return getSysDictName($.dictType.purSalesBaseUnit, d.basicUnit);
                        }}
                    ,{field: 'warehouseInCountTemp', title: '* 入库数量',align:'right', width:100, templet:'#warehouseOutCount'}
                    ,{field: 'warehouseInCount', hide: true}
                    ,{field: 'warehouseInCountSurplus', title: '可剩余入库数量',align:'right', width:130}
                    ,{field: 'batchNo', title: '* 批次号',align:'center', width:150
                        ,templet: function(d){
                            return isEmpty(d.batchNo) ? '<span style="color: red">保存后自动生成</span>' : d.batchNo;
                        }}
                    ,{field: 'manufactureDate', title: '生产日期',align:'center', width:120
                        ,templet: function(d){
                            return util.toDateString(d.manufactureDate, 'yyyy-MM-dd');
                        }}
                    ,{field: 'qualityGuaranteePeriod', hide: true}
                    ,{field: 'manufactureDateTemp', hide: true}
                    ,{field: 'expirationDate', title: '到期日期',align:'center', width:120
                        ,templet: function(d){
                            return d.expirationDate === -62135798400000 ? '<span style="color: red">保存后自动计算</span>' : util.toDateString(d.expirationDate, 'yyyy-MM-dd');
                        }}
                    ,{field: 'storageRoom', title: '* 仓库',align:'center', style:'overflow: visible', width:150, templet: '#storageOutRoom'}
                    ,{field: 'storageRoomTemp', hide: true}
                    ,{field: 'remarks', title: '备注', width:352,edit:'text'}
                    ,{fixed: 'right',title: '操作',width: 70, align:'center' ,toolbar: '#stoWarehouseInDetailList_bar'}
                ]],
                data: stoWarehouseInMainEdit.detailList,
                page: false,
                limit: Number.MAX_VALUE, // 数据表格默认全部显示
                done: function (res, curr, count) {
                    // 初始化入库数量、日期控件、下拉控件的值，并监听
                    $.each(res.bizData, function(i, obj) {
                        // 入库数量
                        var quantity = '#quantity_' + obj.warehouseOutId;
                        $(quantity).val(Math.abs(obj.warehouseInCount) - obj.warehouseInCountSurplus);
                        $(quantity).on('blur', function(e) {
                            var currentValue = e.currentTarget.value; // 实时调整的数量
                            if ('' + currentValue.indexOf('-') != -1 || !isNumber(currentValue)) {
                                $('#quantity_' + obj.warehouseOutId).val(obj.warehouseInCountTemp); // 还原初始数量
                            } else if (isNumber(currentValue) && (currentValue > obj.warehouseInCount) && obj.warehouseInCount != 0) {
                                if (obj.warehouseInCount > 0) {
                                    errorToast('超出入库数量范围');
                                    $('#quantity_' + obj.warehouseOutId).val(obj.warehouseInCountTemp); // 还原初始数量
                                } else {
                                    obj.warehouseInCount = -currentValue;
                                    obj.warehouseInCountTemp = currentValue;
                                }
                            } else {
                                // 可剩余入库数量 = 入库数量 - 实时调整的数量
                                if (obj.warehouseInCount > 0) {
                                    var warehouseInCountSurplus = obj.warehouseInCount - currentValue;
                                    obj.warehouseInCountSurplus = warehouseInCountSurplus < 0 ? 0 : warehouseInCountSurplus;
                                } else {
                                    obj.warehouseInCount = -currentValue;
                                    obj.warehouseInCountSurplus = 0;
                                }
                                obj.warehouseInCountTemp = currentValue;
                            }
                            var dataKey = $('tr[data-index="' + i + '"] td[data-field="warehouseInCountSurplus"]').attr("data-key");
                            $('tr[data-index="' + i + '"] td[data-field="warehouseInCountSurplus"]').html('<div class="layui-table-cell laytable-cell-'+dataKey+'">' + obj.warehouseInCountSurplus + '</div>');
                        });

                        // 生产日期
                        layui.laydate.render({
                            elem: '#input_' + obj.warehouseOutId,
                            type: 'date',
                            trigger: 'click',
                            value: util.toDateString(obj.manufactureDate, 'yyyy-MM-dd'),
                            done: function(value, date, endDate) {
                                obj.manufactureDateTemp = value;
                            }
                        });

                        // 仓库
                        $('#select_' + obj.warehouseOutId).val(obj.storageRoom);
                        layui.form.on('select(storageRoom_' + obj.warehouseOutId + ')', function(data) {
                            obj.storageRoomTemp = data.value;
                        });
                    });

                    layui.form.render();
                }
            },
            //监听工具条事件
            tool:function(obj,filter){
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === 'delete'){ //删除
                    obj.del(); // 页面级别删除，不需要提醒
                }
            }
        });
    } else { // 选择全部
        _layuiTable({
            elem: '#stoWarehouseInDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
            filter: 'stoWarehouseInDetailList_table', //必填，指定的lay-filter的名字
            //执行渲染table配置
            render:{
                height: 'full-180', //table的高度，页面最大高度减去差值
                data: [],
                cols: [[ //表头
                    {type: 'numbers', title: '序号',width:60,fixed: 'left'}  //序号
                    ,{field: 'materielType', title: '物料类别',align:'center',fixed: 'left', width:90}
                    ,{field: 'materielNo', title: '物料编码',align:'center',fixed: 'left', width:150}
                    ,{field: 'materielName', title: '物料名称',align:'left',fixed: 'left', width:250}
                    ,{field: 'specifications', title: '规格',align:'left', width:150}
                    ,{field: 'manufactor', title: '厂家',align:'left', width:300}
                    ,{field: 'basicUnit', title: '单位',align:'center', width:60}
                    ,{field: 'warehouseInCount', title: '* 入库数量',align:'right', width:100}
                    ,{field: 'warehouseInCountSurplus', title: '可剩余入库数量',align:'right', width:130}
                    ,{field: 'batchNo', title: '* 批次号',align:'center', width:150}
                    ,{field: 'manufactureDate', title: '* 生产日期',align:'center', width:120}
                    ,{field: 'expirationDate', title: '到期日期',align:'center', width:120}
                    ,{field: 'storageRoom', title: '* 仓库',align:'center', width:150}
                    ,{field: 'remarks', title: '备注', width:352}
                    ,{fixed: 'right',title: '操作',width: 70, align:'center'}
                ]],
                page: false
            }
        });
    }
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("id");  //接收变量
        //初始化表单元素,日期时间选择器
        var laydate = layui.laydate;

        stoWarehouseInMainEdit.fixedField = {readonly: true};
        $('#stoWarehouseInMainEdit_form').attr('style', '');

        // 显示调拨出库单编号（仅调拨入库时用），默认不显示
        if (stoWarehouseInMainEdit.layEvent === 'detail') { // 详情
            stoWarehouseInMainEdit.dynamicField = {readonly: true};

            if (stoWarehouseInMainEdit.warehousingType !== $.constant.WarehouseInType.ALLOCATION) {
                stoWarehouseInMainEdit.sale = false;
                stoWarehouseInMainEdit.other = false;
                stoWarehouseInMainEdit.inventoryProfit = false;
                stoWarehouseInMainEdit.purchase = false;

                if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE) {
                    stoWarehouseInMainEdit.purchaseTrue = true;
                }
                if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {
                    stoWarehouseInMainEdit.inventoryProfitTrue = true;
                }
            }
            stoWarehouseInMainEdit.allocation = true;
            stoWarehouseInMainEdit.sign = false;
            stoWarehouseInMainEdit.showOrderOutNo = true;
        } else if (stoWarehouseInMainEdit.layEvent === 'set') { // 设置
            laydate.render({
                elem: '#createTime'
                , type: 'date'
                , trigger: 'click'
            });
            if (stoWarehouseInMainEdit.warehousingType !== $.constant.WarehouseInType.ALLOCATION) {
                stoWarehouseInMainEdit.allocation = true;
                stoWarehouseInMainEdit.sale = false;
                stoWarehouseInMainEdit.other = false;
                stoWarehouseInMainEdit.inventoryProfit = false;
                stoWarehouseInMainEdit.purchase = false;

                if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE) {
                    stoWarehouseInMainEdit.purchaseTrue = true;
                }
                if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {
                    stoWarehouseInMainEdit.inventoryProfitTrue = true;
                }
            }
            stoWarehouseInMainEdit.showOrderOutNo = true;
        } else {
            if (stoWarehouseInMainEdit.layEvent === null) { // 新增
                laydate.render({
                    elem: '#createTime'
                    , type: 'date'
                    , trigger: 'click'
                });
                if (stoWarehouseInMainEdit.warehousingType !== $.constant.WarehouseInType.ALLOCATION) {
                    stoWarehouseInMainEdit.allocation = true;
                    stoWarehouseInMainEdit.showOrderOutNo = true;
                    stoWarehouseInMainEdit.sale = false;
                    stoWarehouseInMainEdit.other = false;
                } else {
                    stoWarehouseInMainEdit.allocation = false;
                    getAllocationDeliveryList();
                }
            }
        }

        // 获取仓库下拉值
        getWarehouseList();

        //获取实体信息
        getInfo(id, function (data) {


        });

        // 调拨出库单下拉事件
        var form = layui.form;
        form.on('select(orderOutNoStr)', function (data) {
            stoWarehouseInMainEdit.orderOutNoStr = data.value;
            form.val("stoWarehouseInMainEdit_form", {
                orderOutNoStr: data.value
            });
            form.render();
        });

        // 获取物料明细列表
        getMaterielDetailList(id);

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
    if (isEmpty(id)) { // 新增
        //表单初始赋值
        var form = layui.form;
        var util = layui.util;

        var data = {
            createTime: util.toDateString(new Date(), "yyyy-MM-dd"),
            createByText: baseFuncInfo.userInfoData.username,
            warehouseInDate: util.toDateString(new Date(), "yyyy-MM-dd")
        }

        var warehousingType = stoWarehouseInMainEdit.warehousingType; // 入库类型
        if (warehousingType === $.constant.WarehouseInType.SALE) {
            data.typeText = '销售退货入库';
        } else if (warehousingType === $.constant.WarehouseInType.ALLOCATION) {
            data.typeText = '调拨入库';
        } else if (warehousingType === $.constant.WarehouseInType.OTHER) {
            data.typeText = '其他入库';
        }

        form.val('stoWarehouseInMainEdit_form', data);

        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            "warehouseInMainId": id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoWarehouseInMain/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form;
                var util = layui.util;

                var warehousingType = stoWarehouseInMainEdit.warehousingType;
                if (warehousingType !== $.constant.WarehouseInType.PURCHASE && warehousingType !== $.constant.WarehouseInType.INVENTORY_PROFIT) {
                    data.remark = data.remarks;
                }
                if (isNotEmpty(data.warehouseInDate)) {
                    data.warehouseInDate = layui.util.toDateString(data.warehouseInDate, "yyyy-MM-dd");
                }
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                if (stoWarehouseInMainEdit.warehouseInStatus === $.constant.WarehouseInStatus.SUBMIT) {
                    data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                } else {
                    data.updateTime = ' ';
                }
                form.val('stoWarehouseInMainEdit_form', data);
                stoWarehouseInMainEdit.orderInNo = data.orderInNo;
                stoWarehouseInMainEdit.bussOrderNo = data.bussOrderNo;
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }

    // 适应各类型入库的明细项显示高度
    var listHeight = (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE || stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) ? 215 : 180;
    getList(listHeight);
}

/**
 * 入库明细
 */
function getList(listHeight) {
    var cols;
    if (stoWarehouseInMainEdit.warehouseInStatus === $.constant.WarehouseInStatus.SUBMIT || stoWarehouseInMainEdit.warehouseInStatus === $.constant.WarehouseInStatus.CLOSE) {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60,fixed: 'left'}  //序号
            ,{field: 'materielType', title: '物料类别',align:'center',fixed: 'left', width:90
                ,templet: function(d){
                    return stoWarehouseInMainEdit.materielType.filter(x => x.value == d.materielType)[0].name;
                }}
            ,{field: 'materielNo', title: '物料编码',align:'center',fixed: 'left', width:150}
            ,{field: 'materielName', title: '物料名称',align:'left',fixed: 'left', width:250}
            ,{field: 'specifications', title: '规格',align:'left', width:150}
            ,{field: 'manufactor', title: '厂家',align:'left', width:300}
            ,{field: 'basicUnit', title: '单位',align:'center', width:60, templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.basicUnit);
                }}
            ,{field: 'warehouseInCountTemp', title: '入库数量',align:'right', width:100, templet:function (d){
                    if( isEmpty(d.warehouseInCount) ){
                        return 0
                    }else{
                        return d.warehouseInCount
                    }
                }}
            ,{field: 'warehouseInCount', hide: true}
            ,{field: 'warehouseInCountSurplus', title: '可剩余入库数量',align:'right', width:130}
            ,{field: 'batchNo', title: '批次号',align:'center', width:150
                ,templet: function(d){
                    return d.batchNo;
                }}

            //,{field: 'manufactureDate', title: '* 生产日期',align:'center', width:120, templet:'#manufactureDate'}
            ,{field: 'manufactureDate', title: '生产日期',align:'center', width:120
                ,templet: function(d){
                    return (d.expirationDate === -62135798400000 || d.expirationDate == null) ? '' : util.toDateString(d.expirationDate, 'yyyy-MM-dd');
                }}

            ,{field: 'qualityGuaranteePeriod', hide: true}
            ,{field: 'manufactureDateTemp', hide: true}
            // ,{field: 'expirationDate', title: '到期日期',align:'center', width:120
            //     ,templet: function(d){
            //         return (d.expirationDate === -62135798400000 || d.expirationDate == null) ? '<span style="color: red">保存后自动计算</span>' : util.toDateString(d.expirationDate, 'yyyy-MM-dd');
            //     }}

            ,{field: 'expirationDate', title: '到期日期',align:'center', width:120
                ,templet: function(d){
                    return (d.expirationDate === -62135798400000 || d.expirationDate == null) ? '' : util.toDateString(d.expirationDate, 'yyyy-MM-dd');
                }}

            // ,{field: 'storageRoom', title: '* 仓库',align:'center', width:150, templet: '#storageRoom'}
            ,{field: 'storageRoom', title: '* 仓库',align:'center', style:'overflow: visible', width:150, templet: function (d){
                    for (var item of stoWarehouseInMainEdit.warehouseList) {
                        if(item.warehouseId == d.storageRoom ){
                            return item.houseName
                        }
                    }
                }}
            ,{field: 'storageRoomTemp', hide: true}
            ,{field: 'remarks', title: '备注', width:352}
        ]];
    } else {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60,fixed: 'left'}  //序号
            ,{field: 'materielType', title: '物料类别',align:'center',fixed: 'left', width:90
                ,templet: function(d){
                    return stoWarehouseInMainEdit.materielType.filter(x => x.value == d.materielType)[0].name;
                }}
            ,{field: 'materielNo', title: '物料编码',align:'center',fixed: 'left', width:150}
            ,{field: 'materielName', title: '物料名称',align:'left',fixed: 'left', width:250}
            ,{field: 'specifications', title: '规格',align:'left', width:150}
            ,{field: 'manufactor', title: '厂家',align:'left', width:300}
            ,{field: 'basicUnit', title: '单位',align:'center', width:60, templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.basicUnit);
                }}
            ,{field: 'warehouseInCountTemp', title: '* 入库数量',align:'right', width:100, templet:'#warehouseInCount'}
            ,{field: 'warehouseInCount', hide: true}
            ,{field: 'warehouseInCountSurplus', title: '可剩余入库数量',align:'right', width:130}
            // ,{field: 'batchNo', title: '* 批次号',align:'center', width:150
            //     ,templet: function(d){
            //         if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.OTHER) { // 其他入库
            //             return '<input class="layui-input" type="text" maxlength="32" name="batchNo" style="height:100%;padding-right:5px;"  lay-filter="batchNo_' + d.LAY_TABLE_INDEX + '" value="'+d.batchNo+'" id="batchNo_' + d.LAY_TABLE_INDEX + '">';
            //         } else {
            //             return isEmpty(d.batchNo) ? '<span style="color: red">保存后自动生成</span>' : d.batchNo;
            //         }
            //     }}
            ,{field: 'batchNo', title: '* 批次号',align:'center', width:180
                ,templet: function(d){

                    return '<input class="layui-input" type="text" maxlength="32" name="batchNo" placeholder="留空保存后自动生成" style="height:100%;padding-right:5px;"  lay-filter="batchNo_' + d.LAY_TABLE_INDEX + '" value="'+ (d.batchNo ?? "") +'" id="batchNo_' + d.LAY_TABLE_INDEX + '">';
                }
            }

            ,{field: 'manufactureDate', title: '* 生产日期',align:'center', width:120, templet:'#manufactureDate'}
            ,{field: 'qualityGuaranteePeriod', hide: true}
            ,{field: 'manufactureDateTemp', hide: true}
            ,{field: 'expirationDate', title: '* 到期日期',align:'center',  width:120, templet:'#expirationDate'}
            //,{field: 'expirationDate', title: '到期日期',align:'center', width:120
            // ,templet: function(d){
            //     return (d.expirationDate === -62135798400000 || d.expirationDate == null) ? '<span style="color: red">保存后自动计算</span>' : util.toDateString(d.expirationDate, 'yyyy-MM-dd');
            // }}
            ,{field: 'storageRoom', title: '* 仓库',align:'center', style:'overflow: visible', width:150, templet: '#storageRoom'}
            ,{field: 'storageRoomTemp', hide: true}
            ,{field: 'remarks', title: '备注', width:352,edit:'text'}
            ,{fixed: 'right',title: '操作',width: 70, align:'center' ,toolbar: '#stoWarehouseInDetailList_bar'}
        ]];
    }

    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#stoWarehouseInDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'stoWarehouseInDetailList_table', //必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-' + listHeight, //table的高度，页面最大高度减去差值
            cols: cols,
            data: stoWarehouseInMainEdit.materielDetailList,
            page: false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            done: function (res, curr, count) {
                // 初始化入库数量、日期控件、下拉控件的值，并监听
                $.each(res.bizData, function(i, obj) {
                    // 入库数量
                    var quantity = '#quantity_' + obj.warehouseInDetailId;
                    $(quantity).val(Math.abs(obj.warehouseInCount) - obj.warehouseInCountSurplus);
                    $(quantity).on('blur', function(e) {
                        var currentValue = e.currentTarget.value; // 实时调整的数量
                        if ('' + currentValue.indexOf('-') != -1 || !isNumber(currentValue)) {
                            $('#quantity_' + obj.warehouseInDetailId).val(obj.warehouseInCountTemp); // 还原初始数量
                        } else if (isNumber(currentValue) && (currentValue > obj.warehouseInCount) && obj.warehouseInCount != 0) {
                            if (obj.warehouseInCount > 0) {
                                errorToast('超出入库数量范围');
                                $('#quantity_' + obj.warehouseInDetailId).val(obj.warehouseInCountTemp); // 还原初始数量
                            } else {
                                obj.warehouseInCount = -currentValue;
                                obj.warehouseInCountTemp = currentValue;
                            }
                        } else {
                            // 可剩余入库数量 = 入库数量 - 实时调整的数量
                            if (obj.warehouseInCount > 0) {
                                var warehouseInCountSurplus = obj.warehouseInCount - currentValue;
                                obj.warehouseInCountSurplus = warehouseInCountSurplus < 0 ? 0 : warehouseInCountSurplus;
                            } else {
                                obj.warehouseInCount = -currentValue;
                                obj.warehouseInCountSurplus = 0;
                            }
                            obj.warehouseInCountTemp = currentValue;
                        }
                        $('tr[data-index="' + i + '"] td[data-field="warehouseInCountSurplus"]').html('<div class="layui-table-cell laytable-cell-2-0-9">' + obj.warehouseInCountSurplus + '</div>');
                    });

                    // 生产日期
                    layui.laydate.render({
                        elem: '#input_' + obj.warehouseInDetailId,
                        type: 'date',
                        trigger: 'click',
                        value: (obj.manufactureDate === -62135798400000 || obj.manufactureDate == null) ? '' : util.toDateString(obj.manufactureDate, 'yyyy-MM-dd'),
                        done: function(value, date, endDate) {
                            obj.manufactureDateTemp = value;
                            var  expirationDateText = addMonth(value,obj.qualityGuaranteePeriod);
                            obj.expirationDate = expirationDateText;
                            $('#expirationDate_' + obj.warehouseInDetailId).val(expirationDateText);
                        }
                    });

                    // 到期日期
                    layui.laydate.render({
                        elem: '#expirationDate_' + obj.warehouseInDetailId,
                        type: 'date',
                        trigger: 'click',
                        value: (obj.expirationDate === -62135798400000 || obj.expirationDate == null) ? '' : util.toDateString(obj.expirationDate, 'yyyy-MM-dd'),
                        done: function(value, date, endDate) {
                            obj.expirationDate = value;
                            var manufactureDateText = subtractMonth(value,obj.qualityGuaranteePeriod);
                            obj.manufactureDateTemp = manufactureDateText;
                            obj.manufactureDate = manufactureDateText;
                            $('#input_' + obj.warehouseInDetailId).val(manufactureDateText)
                        }
                    });

                    // 仓库
                    $('#select_' + obj.warehouseInDetailId).val(obj.storageRoom);
                    layui.form.on('select(storageRoom_' + obj.warehouseInDetailId + ')', function(data) {
                        obj.storageRoomTemp = data.value;
                    });

                    //批次号
                    $('#batchNo_' + obj.LAY_TABLE_INDEX).on("change",function (event){
                        obj.batchNo = $(this).val();
                    })
                });

                layui.form.render();
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'delete') { //删除
                var rowIndex =  $(tr).attr("data-index");

                var length = stoWarehouseInMainEdit.materielDetailList.length;
                if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE && length === 1) {
                    layer.confirm('入库单明细仅剩 1 条，关闭后则订单的入库状态变更为“已关闭”，确定关闭所选记录吗？', function(index) {
                        layer.close(index);

                        var ids=[];
                        ids.push(data.warehouseInDetailId);
                        del(ids, rowIndex, data.warehouseInMainId, stoWarehouseInMainEdit.bussOrderNo);
                    });
                } else {
                    var msg = '删除';
                    if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE) {
                        msg = '关闭';
                    }
                    layer.confirm('确定' + msg + '所选记录吗？', function(index){
                        layer.close(index);

                        if (isNotEmpty(data.warehouseInDetailId)){
                            var ids=[];
                            ids.push(data.warehouseInDetailId);
                            del(ids, rowIndex);
                        } else { // 添加物料过来的数据中还没有入库明细ID
                            getSelectList().splice(rowIndex, 1); // 从List中删除
                            table.reload('stoWarehouseInDetailList_table', {
                                data: getSelectList()
                            }); //重新刷新table
                        }
                    });
                }
            }
        }
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(stoWarehouseInMainEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#stoWarehouseInMainEdit_submit").trigger('click');
}

/**
 * 保存入库明细
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {

        //成功验证后
        var warehousingType = stoWarehouseInMainEdit.warehousingType;
        var remarks;
        if (warehousingType === $.constant.WarehouseInType.PURCHASE || warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) {
            remarks = field.remarks;
        } else {
            remarks = field.remark;
        }

        var table = layui.table; //获取layui的table模块
        var stoWarehouseInDetailList = isNotEmpty(table.cache.stoWarehouseInDetailList_table) ? table.cache.stoWarehouseInDetailList_table : [];
        // 手动录入批次号赋值处理
        if (warehousingType === $.constant.WarehouseInType.OTHER) { // 其他入库
            $.each(stoWarehouseInDetailList, function (i, obj) {
                var batchNo = $('#batchNo_' + obj.LAY_TABLE_INDEX).val();
                if (isNotEmpty(batchNo)) {
                    stoWarehouseInDetailList[i].batchNo = batchNo; // 手动录入的批次号
                }
            });
        }

        // 日期空值处理（复制粘贴会导致日期控件赋值失败）
        $.each(stoWarehouseInDetailList, function (i, obj) {
            var manufactureDateTemp = $('#input_' + obj.warehouseInDetailId).val();
            if (isNotEmpty(manufactureDateTemp)) {
                stoWarehouseInDetailList[i].manufactureDateTemp = manufactureDateTemp; // 手动录入的批次号
            }
        });

        if (warehousingType === $.constant.WarehouseInType.ALLOCATION) { // 调拨入库
            var hasRecords = false;
            $.each(stoWarehouseInDetailList, function (i, obj) {
                if (stoWarehouseInDetailList[i].length === undefined) { // 有明细记录
                    hasRecords = true;
                }
            });
            if (!hasRecords && isEmpty(field.warehouseInMainId)) {
                errorToast('无调拨入库明细数据，保存失败');
                return false;
            }
        }

        var param = {
            warehousingType: warehousingType,
            warehouseInMainId: field.warehouseInMainId,
            mainRemarks: remarks,
            stoWarehouseInDetailList: stoWarehouseInDetailList,
            warehouseInDate: field.warehouseInDate,
            orderOutNoStr:stoWarehouseInMainEdit.orderOutNoStr //出库单编号
        }

        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/stoWarehouseInMain/saveOrEdit.do",
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
 * 获取仓库下拉值
 */
function getWarehouseList() {
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basWarehouse/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoWarehouseInMainEdit.warehouseList = data;
        }
    });
}

/**
 * 获取调拨出库单下拉列表
 */
function getAllocationDeliveryList() {
    // 添加必填验证
    $('select[name="orderOutNo"]').attr('lay-verify', 'required');

    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseInMain/getLists.do",
        dataType: "json",
        async: false,
        done: function (data) {
            stoWarehouseInMainEdit.allocationDeliveryList = data;
        }
    });
}

/**
 * 添加物料
 */
function addMateriel() {
    // 验证是否已经生成入库单编号
    var orderInNo = stoWarehouseInMainEdit.orderInNo;
    if (isEmpty(orderInNo)) {
        errorToast('入库单编号未生成，请点击确定按钮');
        return false;
    }

    var title = '添加物料';
    var url = $.config.server + '/stock/stoAddMateriel?id=' + stoWarehouseInMainEdit.warehouseInMainId + '&type=' + stoWarehouseInMainEdit.warehousingType;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: false, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
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
 * 获取物料明细列表（调拨入库）
 * @param id
 */
function getDetailList(id) {
    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.pharmacy + '/stoWarehouseOutMain/' + stoWarehouseInMainEdit.warehousingType + '/detailList.do',
        data: {warehouseOutMainId: id},
        dataType: 'json',
        done: function (data) {
            stoWarehouseInMainEdit.detailList = data;

            // 将新数据重新载入表格
            layui.table.reload("stoWarehouseInDetailList_table", {
                data: stoWarehouseInMainEdit.detailList
            });
        }
    });
}

/**
 * 获取物料明细列表
 * @param id
 */
function getMaterielDetailList(id) {
    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.pharmacy + "/stoWarehouseInDetail/list.do",
        data: {warehouseInMainId: id},
        dataType: 'json',
        done: function (data) {
            stoWarehouseInMainEdit.materielDetailList = data;
            var listHeight = (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE || stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.INVENTORY_PROFIT) ? 215 : 180;
            getList(listHeight);
        }
    });
}

/**
 * 子页面调用，获取返回的物料数组
 * @param ids
 */
function getAddList(data) {
    // 添加选中的物料
    $.each(data, function (i, obj) {
        // 初始化
        obj.warehouseInCountTemp = 0;
        obj.warehouseInCount = 0;
        obj.warehouseInCountSurplus = 0;
        obj.warehouseInDetailId = 'CUS' + Math.random().toString().replace('.', '');

        stoWarehouseInMainEdit.materielDetailList.push(obj);
    });

    // 将新数据重新载入表格
    var table = layui.table;
    table.reload("stoWarehouseInDetailList_table", {
        data: stoWarehouseInMainEdit.materielDetailList
    });
}

/**
 * 子页面调用，获取已选择的物料数组
 */
function getSelectList() {
    return stoWarehouseInMainEdit.materielDetailList;
}

/**
 * 删除事件
 * @param ids
 * @param index
 * @param warehouseInMainId
 * @param bussOrderNo
 */
function del(ids, index, warehouseInMainId, bussOrderNo) {
    var param = {
        "ids": ids,
        "warehouseInMainId": warehouseInMainId,
        "bussOrderNo": bussOrderNo
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/stoWarehouseInDetail/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            if (stoWarehouseInMainEdit.warehousingType === $.constant.WarehouseInType.PURCHASE) { // 采购入库类型
                successToast("关闭成功");
            } else {
                successToast("删除成功");
            }

            getSelectList().splice(index, 1); // 从List中删除
            layui.table.reload('stoWarehouseInDetailList_table', {
                data: getSelectList()
            }); //重新刷新table
        }
    });
}