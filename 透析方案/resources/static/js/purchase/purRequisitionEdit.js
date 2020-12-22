/**
 * 采购申请的js文件，包括生成预算，编辑预算数量等操作
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/08/24
 */
var purRequisitionEdit = avalon.define({
    $id: "purRequisitionEdit"
    ,baseFuncInfo: baseFuncInfo//底层基本方法
    ,fixedField: {readonly: false} // 固定栏位只读设置
    ,dynamicField: {readonly: false} // 动态栏位只读设置
    ,budgetFormula: 0.3 // 默认预算系数
    ,budgetType: '0' // 预算类型，默认值为有物料编码
    ,requisitionNo: GetQueryString("requisitionNo") // 申请单号
    ,radioType: '0' // 单选按钮类型：0有物料编码|1无物料编码
    ,materielType: [{name:'全部', value:''}, {name:'药品', value:'1'}, {name:'耗材', value:'2'}] // 物料类型
    ,withMaterialNoList: [] // 有物料编码预算List
    ,noneMaterialNoList: [] // 无物料编码预算List
    ,dataField: {} // 搜索条件
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var id = GetQueryString("id");  // 申请单号

        $('#purRequisitionEdit_form').attr('style', '');
        var layEvent = GetQueryString("layEvent"); // 接收变量layEvent
        purRequisitionEdit.fixedField = {readonly: true};
        if (layEvent === 'detail' || layEvent === 'approval') { // 详情或核准
            purRequisitionEdit.dynamicField = {readonly: true};
            // 隐藏预算和搜索栏区域的内容
            $('.search-form').hide();
        }

        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });

        // 监听预算类型
        var form = layui.form;
        form.on('radio(radio)', function (data) {
            purRequisitionEdit.budgetType = data.value;
            if (data.value != purRequisitionEdit.radioType) {
                $('#purRequisitionList_search').hide();
                $('div[lay-id="purBudgetInfoList_table"]').hide();
            } else {
                $('#purRequisitionList_search').show();
                $('div[lay-id="purBudgetInfoList_table"]').show();
            }
        });

        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#purRequisitionList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'purRequisitionList_search'  //指定的lay-filter
        ,conds:[
            {field: 'materielType', title: '物料类别：', type: 'select', width: 50, data: purRequisitionEdit.materielType}
            ,{field: 'materielNoOrName', title: '编码或名称：',type:'input'}
            ,{field: 'specifications', title: '规格：',type:'input'}
        ]
        ,done:function(filter,data){
            // 修改搜索按钮样式
            $('button[lay-filter="purRequisitionList_search_search"]').attr('class', 'layui-btn layui-btn-dismain layui-btn-dis-seach');

            // 追加导出按钮
            var appendHTML = '<button class="layui-btn layui-btn-dismain" onclick="exportExcel()">   导 出   </button>';
            $('button[lay-filter="purRequisitionList_search_search"]').parent().append(appendHTML);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            getBudgetData(purRequisitionEdit.budgetType, data.field);
            purRequisitionEdit.dataField = data.field;
        }
    });
}

/**
 * 根据预算类型进行生成预算数据
 */
function generateBudget() {
    // 校验
    var coefficient = $.trim(purRequisitionEdit.budgetFormula);
    if (isNotEmpty(coefficient) && isNumber(coefficient)) {
        initSearch(); // 初始化搜索工具栏

        var param = {
            requisitionNo: purRequisitionEdit.requisitionNo,
            budgetType: purRequisitionEdit.budgetType,
            budgetFormula: coefficient
        };

        _ajax({
            type: "POST",
            loading: false,
            url: $.config.services.pharmacy + "/purBudgetInfo/generateBudget.do",
            data: param,
            dataType: "json",
            done: function (budgetType) {
                getBudgetData(budgetType);
                $('#purRequisitionList_search').show();
            }
        });
    } else {
        var msg = '';
        var error = [];
        if (isEmpty(coefficient)) {
            msg = '患者新增系数不能为空';
        } else if (!isNumber(coefficient)) {
            msg = '不是有效的数字';
        }
        error = [
            '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + coefficient + '</span>' + msg)
        ].join('');
        errorToast(error);
    }
}

/**
 * 查询列表事件（有物料编码）
 */
function getListWithMaterialNo(budgetType, readonly) {
    var cols;
    if (readonly) {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielTypeText', title: '物料类别',align:'center'}
            ,{field: 'materielNo', title: '物料编码',align:'center'}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格'}
            ,{field: 'purchaseCountSuggest', title: '建议采购数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '实际采购数量',align:'right'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'purchaseUnit', title: '采购单位',align:'center', templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                }}
        ]];
    } else {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielTypeText', title: '物料类别',align:'center'}
            ,{field: 'materielNo', title: '物料编码',align:'center'}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格'}
            ,{field: 'purchaseCountSuggest', title: '建议采购数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '实际采购数量',align:'right',edit:'text'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'purchaseUnit', title: '采购单位',align:'center', templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                }}
            ,{fixed: 'right',title: '操作',width: 140, align:'center',toolbar: '#purBudgetInfoList_bar'}
        ]];
    }

    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#purBudgetInfoList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'purBudgetInfoList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-400', //table的高度，页面最大高度减去差值
            cols: cols,
            data: purRequisitionEdit.withMaterialNoList,
            page: false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            done: function(res, curr, count) {
                purRequisitionEdit.radioType = '0';
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.budgetInfoId)){
                        var ids=[];
                        ids.push(data.budgetInfoId);
                        del(ids, budgetType, purRequisitionEdit.dataField);
                    }
                });
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(purBudgetInfoList_table)', function (obj) {
        var value = obj.value; // 得到修改后的值
        var data = obj.data; // 得到所在行所有键值
        var field = obj.field; // 得到字段
        var error = [];
        var msg = '';

        // 判断数据类型
        if (isNotEmpty($.trim(value)) && isNumber($.trim(value))) {
            if (Math.abs(value) > 99999999999) {
                msg = '超出上限值';
                error = [
                    '<cite>' + RtnCode.DATA_VALID_ERROR.reasonPhrase + '：</cite><br/>' + ('<span style="color: red">' + Math.abs($.trim(value)) + '</span>' + msg)
                ].join('');
                errorToast(error);
            } else {
                if ($.trim(value) > 0) {
                    editPurchaseQuantity(data);
                } else {
                    msg = '请录入大于0的数字或删除此记录';
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
 * 编辑采购数量（预算类型为有物料编码）
 * @param data 所在行所有键值
 */
function editPurchaseQuantity(data) {
    var param = {
        purchaseCountActual: Math.abs($.trim(data.purchaseCountActual)),
        budgetInfoId: data.budgetInfoId
    };
    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + '/purBudgetInfo/editPurchaseQuantityWithMaterielNo.do',
        data: param,  //必须字符串后台才能接收list,
        loading: false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function () {
            successToast("采购数量已变更");
            var table = layui.table; //获取layui的table模块
            table.reload('purBudgetInfoList_table'); //重新刷新table
        }
    });
}

/**
 * 查询列表事件（无物料编码）
 */
function getListNoneMaterialNo(budgetType, readonly) {
    var cols;
    if (readonly) {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'showName', title: '预算显示名称'}
            ,{field: 'purchaseCountSuggest', title: '建议采购数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '实际采购数量',align:'right'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'unit', title: '单位',align:'center', templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.unit);
                }}
        ]]
    } else {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'showName', title: '预算显示名称'}
            ,{field: 'purchaseCountSuggest', title: '建议采购数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '实际采购数量',align:'right'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'unit', title: '单位',align:'center', templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.unit);
                }}
            ,{fixed: 'right',title: '操作',width: 140, align:'center',toolbar: '#purBudgetInfoList_bar'}
        ]]
    }

    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#purBudgetInfoList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'purBudgetInfoList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-310', //table的高度，页面最大高度减去差值
            cols: cols,
            data: purRequisitionEdit.noneMaterialNoList,
            page: false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            done: function(res, curr, count) {
                purRequisitionEdit.radioType = '1';
            }
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'set'){ // 设置（弹窗修改采购数量）
                if(isNotEmpty(data.showName)){
                    setPurchaseQuantity(data.showName, data.materielType, purRequisitionEdit.requisitionNo, data.budgetInfoId, data.budgetType, data.stockCount);
                }
            }else if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.budgetInfoId)){
                        var ids=[];
                        ids.push(data.budgetInfoId);
                        del(ids, budgetType, purRequisitionEdit.dataField);
                    }
                });
            }
        }
    });
}

/**
 * 弹窗设置采购数量
 * @param showName
 * @param materielType
 * @param requisitionNo
 * @param budgetInfoId
 * @param budgetType
 * @param stockCount
 */
function setPurchaseQuantity(showName, materielType, requisitionNo, budgetInfoId, budgetType, stockCount) {
    var title = "设置采购数量";
    var url = $.config.server + "/purchase/setPurchaseQuantity?showName=" + showName + '&materielType=' + materielType
        + '&requisitionNo=' + requisitionNo + '&budgetInfoId=' + budgetInfoId + '&budgetType=' + budgetType
        + '&stockCount=' + stockCount;

    _layerOpen({
        url: url,
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 860,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: true, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            var table = layui.table; //获取layui的table模块
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    });
}

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        typeof $callback === 'function' && $callback({}); //返回一个回调事件
    } else {
        //编辑
        var param = {
            requisitionId: id
        };
        _ajax({
            type: "POST",
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purRequisition/getInfo.do",
            data: param,
            dataType: "json",
            done: function (data) {
                //表单初始赋值
                var form = layui.form; //调用layui的form模块
                //初始化表单元素,日期时间选择器
                var util = layui.util;
                data.createTime = util.toDateString(data.createTime, "yyyy-MM-dd");
                data.updateTime = util.toDateString(data.updateTime, "yyyy-MM-dd");
                form.val('purRequisitionEdit_form', data);

                // 获取当前申请单号对应的预算数据，有数据则显示列表
                if (isNotEmpty(data.requisitionNo)) {
                    _ajax({
                        type: "POST",
                        loading: false,
                        url: $.config.services.pharmacy + "/purBudgetInfo/list.do",
                        data: { requisitionNo: data.requisitionNo },
                        dataType: "json",
                        done: function (purBudgetInfo) {
                            if (purBudgetInfo.length > 0) {
                                initSearch(); // 初始化搜索工具栏

                                var budgetType = purBudgetInfo[0].budgetType;
                                purRequisitionEdit.budgetType = budgetType;
                                purRequisitionEdit.radioType = budgetType;

                                // 获取预算数据
                                getBudgetData(budgetType);

                                form.render();
                            }
                        }
                    });
                }

                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }
}

/**
 * 获取预算数据
 * @param budgetType
 * @param field
 */
function getBudgetData(budgetType, field) {
    var param = {
        requisitionNo: purRequisitionEdit.requisitionNo,
        budgetType: budgetType
    }

    if (isNotEmpty(field)) {
        param = $.extend(param, {
            materielType: field.materielType,
            materielNoOrName: field.materielNoOrName,
            specifications: field.specifications
        });
    }

    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.pharmacy + "/purBudgetInfo/list.do",
        data: param,
        dataType: 'json',
        done: function (data) {
            if (budgetType === '0') {
                purRequisitionEdit.withMaterialNoList = data;
                getListWithMaterialNo(budgetType, purRequisitionEdit.dynamicField.readonly);
            } else {
                purRequisitionEdit.noneMaterialNoList = data;
                getListNoneMaterialNo(budgetType, purRequisitionEdit.dynamicField.readonly);
            }
        }
    });
}

/**
 * 数据验证
 * @param field
 * @returns {boolean}
 */
function validation(field) {
    var str = '';
    var msg = '超出栏位定义的最大值';

    // 患者新增系数
    var budgetFormula = field.budgetFormula;
    if (parseFloat(budgetFormula) > 9999999.99) {
        str += '患者新增系数' + msg + '<br>';
    }

    if (str !== '') {
        var error = [
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
    form.on('submit(purRequisitionEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        if (!validation(field)) {
            return false;
        }
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#purRequisitionEdit_submit").trigger('click');
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field; //表单的元素
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.pharmacy + "/purRequisition/editPurRequisition.do",
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}

/**
 * 删除事件
 * @param ids
 * @param budgetType
 * @param field
 */
function del(ids, budgetType, field) {
    var param = {
        "ids": ids
    };

    _ajax({
        type: "POST",
        url: $.config.services.pharmacy + "/purBudgetInfo/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            getBudgetData(budgetType, field);
        }
    });
}

/**
 * 导出Excel
 */
function exportExcel() {
    var typeName = purRequisitionEdit.radioType === '0'? '有物料编号' : '无物料编号';

    _downloadFile({
        url: $.config.services.pharmacy + '/purBudgetInfo/export.do',
        data: getSearchParam(),
        fileName: '预算列表_' + typeName + '_' + purRequisitionEdit.requisitionNo + '.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {*}
 */
function getSearchParam() {
    var fm = layui.form.val('purRequisitionList_search');
    return $.extend({
        materielType: fm.materielType,
        materielNoOrName: fm.materielNoOrName,
        specifications: fm.specifications,
        budgetType: purRequisitionEdit.radioType,
        requisitionNo: purRequisitionEdit.requisitionNo
    }, getRequestParam("purRequisitionList_search"));
}

/**
 * 导入预算
 */
function importBudget() {
    var budgetType = purRequisitionEdit.budgetType;
    var budgetTypeText = budgetType === $.constant.BudgetType.WITH_MATERIAL_CODE ? '有物料编码' : '无物料编码';
    layer.confirm('当前所选预算类型为“<span style="color:blue">' + budgetTypeText + '</span>”，确定继续？', function(index){
        layer.close(index);
        baseFuncInfo.batchImp('purRequisition', 'pharmacy', budgetType + '@' + purRequisitionEdit.requisitionNo);
    });
}

/**
 * 刷新
 */
function refresh(budgetType) {
    initSearch(); // 初始化搜索工具栏
    getBudgetData(budgetType);
    $('#purRequisitionList_search').show();
}