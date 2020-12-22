/**
 * 添加采购申请的js文件
 * @author: Carl
 * @version: 1.0
 * @date: 2020/11/20
 */
var purApplyEdit = avalon.define({
    $id: "purApplyEdit"
    ,baseFuncInfo: baseFuncInfo//底层基本方法
    ,fixedField: {readonly: false} // 固定栏位只读设置
    ,dynamicField: {readonly: false} // 动态栏位只读设置
    ,materielType: [{name:'全部', value:''}, {name:'药品', value:'1'}, {name:'耗材', value:'2'}] // 物料类型
    ,purchaseMaterial:[] //物料列表
    ,noneIdTips:{placeholder:"系统自动生成",disabled:"disabled"}
    ,layEvent :""

});


layui.use(['index','table'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        var id = GetQueryString("id");  // 申请单号
        purApplyEdit.layEvent = GetQueryString("layEvent"); // 接收变量layEvent,用于判断窗口事件,添加或编辑
        purApplyEdit.fixedField = {readonly: true};

        if (purApplyEdit.layEvent === 'add' ) {
            purApplyEdit.noneIdTips = {placeholder:"系统自动生成",disabled:"disabled"}
        }else  if (purApplyEdit.layEvent === 'edit' ) {
            purApplyEdit.noneIdTips = {readonly: true}

        }

        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            getPurchaseMaterial(purApplyEdit.layEvent == 'details' ? true : false);
        });

        avalon.scan();
    });
});



/**
 * 渲染物料列表
 */
function getPurchaseMaterial(readonly) {
    debugger;
    var cols;
    if (readonly) {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielType', title: '物料类别',align:'center', templet: function(d) {
            return getSysDictName('materielType', d.materielType);
        }}
            ,{field: 'materielNo', title: '物料编码',align:'center'}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '采购数量',align:'right'}
            ,{field: 'purchaseUnit', title: '采购单位',align:'center', templet: function(d) {
                    return getSysDictName($.dictType.purSalesBaseUnit, d.purchaseUnit);
                }}
        ]];
    } else {
        cols = [[ //表头
            {type: 'numbers', title: '序号',width:60 }  //序号
            ,{field: 'materielType', title: '物料类别',align:'center', templet: function(d) {
                    return getSysDictName('materielType', d.materielType);
                }}
            ,{field: 'materielNo', title: '物料编码',align:'center'}
            ,{field: 'materielName', title: '物料名称'}
            ,{field: 'specifications', title: '规格'}
            ,{field: 'stockCount', title: '现有库存数量',align:'right'}
            ,{field: 'purchaseCountActual', title: '采购数量',align:'right',edit:'text'}
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
        elem: '#purApplyEdit_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'purApplyEdit_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            cols: cols,
            data: purApplyEdit.purchaseMaterial,
            page: false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            done: function(res, curr, count) {
                console.log(res, curr, count);
            }
        },
        //监听工具条事件
        tool:function(obj,filter){

            console.log(obj);
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            var rowIndex =  $(tr).attr("data-index");
            if(layEvent === 'delete'){ //删除
                layer.confirm('确定删除所选记录吗？', function(index){
                    //同步删除对应数据源
                    purApplyEdit.purchaseMaterial.splice(rowIndex,1);
                    layui.table.reload("purApplyEdit_table", {
                        data: purApplyEdit.purchaseMaterial
                    });
                    layer.close(index);
                });
            }
        }
    });

    // 监听单元格编辑操作
    table.on('edit(purApplyEdit_table)', function (obj) {
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
                    $(tr).find("td[data-field='" + field + "'] input").val(Math.ceil(value));
                    data.purchaseCountActual = Math.ceil(value);
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
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    if (isEmpty(id)) {
        //新增
        //设置默认值
        var data = {
            createByText:purApplyEdit.baseFuncInfo.userInfoData.username,
            createTime:layui.util.toDateString(new Date(), "yyyy-MM-dd"),
            requisitionStatusText:"新建"
        }
        layui.form.val('purApplyEdit_form', data);
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
                form.val('purApplyEdit_form', data);

                // 获取当前申请单号对应的预算数据，有数据则显示列表
                if (isNotEmpty(data.requisitionNo)) {
                    _ajax({
                        type: "POST",
                        loading: false,
                        url: $.config.services.pharmacy + "/purBudgetInfo/list.do",
                        data: { requisitionNo: data.requisitionNo },
                        dataType: "json",
                        done: function (purBudgetInfo) {
                            debugger;
                            if (purBudgetInfo.length > 0) {
                                purApplyEdit.purchaseMaterial = purBudgetInfo;
                                layui.table.reload("purApplyEdit_table", {
                                    data: purApplyEdit.purchaseMaterial
                                });
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
    debugger;
    var param = {
        requisitionNo: purApplyEdit.requisitionNo,
        budgetType: budgetType
    }

    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.pharmacy + "/purBudgetInfo/list.do",
        data: param,
        dataType: 'json',
        done: function (data) {
            purApplyEdit.purchaseMaterial = data
        }
    });
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    $.each(purApplyEdit.purchaseMaterial, function(i,obj){
        if( isEmpty(obj.purchaseCountActual)){
            errorToast("第"+(i+1)+"行，采购数量不能为空，请确认或删除此记录");
            return false;
        }
    })
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(purApplyEdit_submit)', function (data) {
        //通过表单验证后
        var field = data.field; //获取提交的字段
        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#purApplyEdit_submit").trigger('click');
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

        var purBudgetInfoList = [];
        $.each(purApplyEdit.purchaseMaterial,function (i,entity){
            debugger;
            purBudgetInfoList.push({
                budgetType:0,
                materielType:entity.materielType,
                materielNo:entity.materielNo,
                materielName:entity.materielName,
                supplierId:entity.supplierId,
                specifications:entity.specifications,
                purchaseCountActual:entity.purchaseCountActual,
                stockCount:entity.stockCount,
                purchaseUnit:entity.purchaseUnit,
            })
        })
        var url = "";
        if(purApplyEdit.layEvent == "add"){
            url = $.config.services.pharmacy + "/purRequisition/purApplyAdd.do";
        }else{
            url = $.config.services.pharmacy + "/purRequisition/purApplyEdit.do";
        }
        _ajax({
            type: "POST",
            loading: false,
            url: url,
            data: JSON.stringify({ purRequisitionEdit:param,
                purBudgetInfoList :purBudgetInfoList
            }),
            contentType:"application/json",
            dataType: "json",
            done: function (response) {
                typeof $callback === 'function' && $callback(response);
            }
        });



    });
}


function addMateriel(){
        var title = "添加物料";
        var url = $.config.server + "/stock/stoAddMateriel?openStockcount=true";
        //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
        _layerOpen({
            url: url,
            width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height: 850,  //弹框自定义的高度，方法会自动判断是否超过高度
            title: title, //弹框标题
            done: function (index, iframeWin) {
                /**
                 * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                 * 利用iframeWin可以执行弹框的方法，比如save方法
                 */
                var ids = iframeWin.save(
                    //成功保存之后的操作，刷新页面
                    function success() {
                        successToast("保存成功");
                        var table = layui.table; //获取layui的table模块
                        table.reload('stoWarehouseOutMainDetailList_table'); //重新刷新table
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                );
            }
        });
}

/*获取已选物料列表*/
function getSelectList(){
    return purApplyEdit.purchaseMaterial
}

/*获取子页面选择的物料*/
function getAddList(materialList){

    console.log(materialList);

    $.each(materialList, function (i, obj) {
        purApplyEdit.purchaseMaterial.push(obj);
    });
    layui.table.reload("purApplyEdit_table", {
        data: purApplyEdit.purchaseMaterial
    });
}


