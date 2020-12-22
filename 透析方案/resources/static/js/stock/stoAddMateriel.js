/**
 * 添加物料列表窗口
 * @author: Sinjar
 * @version: 1.0
 * @date: 2020/09/15
 */
var stoAddMaterielList = avalon.define({
    $id: "stoAddMaterielList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    materielType: [{name: '全部', value: ''}, {name: '药品', value: '1'}, {name: '耗材', value: '2'}],
    warehousingType: GetQueryString("type"), // 入库类型：0-采购入库 | 1-销售退货入库 | 2-盘盈入库 | 3-调拨入库 | 4-其他入库
    warehouseInMainId: GetQueryString("id"), // 入库主表ID
    orderMainId: GetQueryString("orderMainId"), // 采购单主表ID
    materielDetailList: [], // 物料明细列表
    openStockcount:GetQueryString("openStockcount") == "true",//是否开启库存统计
    supplierId: GetQueryString("supplierId") // 供应商ID
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getMaterielDetailList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#stoAddMaterielList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'stoAddMaterielList_search'  //指定的lay-filter
        , conds: [
            {field: 'materielType', title: '物料类别：', type: 'select', data: stoAddMaterielList.materielType}
            , {field: 'materielNoOrName', title: '编号或名称：', type: 'input'}
            , {field: 'specifications', title: '规格：', type: 'input'}
        ]
        , done: function (filter, data) {
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        , search: function (data) {
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            getMaterielDetailList(data.field);
        }
    });
}

/**
 * 获取物料明细列表
 * @param field
 */
function getMaterielDetailList(field) {
    field = $.extend({
        supplierId: stoAddMaterielList.supplierId
    }, field);

    if (stoAddMaterielList.openStockcount) {
        field = $.extend({
            openStockCount: stoAddMaterielList.openStockcount
        }, field);
    }

    var appendUrl = '';
    if (isNotEmpty(stoAddMaterielList.warehouseInMainId)) {
        appendUrl = '?warehouseInMainId=' + stoAddMaterielList.warehouseInMainId;
    } else if (isNotEmpty(stoAddMaterielList.orderMainId)) {
        appendUrl = '?orderMainId=' + stoAddMaterielList.orderMainId;
    }

    _ajax({
        type: 'POST',
        loading: true,
        url: $.config.services.platform + '/basSupplierManagement/getMaterielList.do' + appendUrl,
        data: field,
        dataType: 'json',
        done: function (data) {
            // 过滤已选择的物料
            var list = parent.getSelectList();
            $.each(list, function (i, items) {
                $.each(data, function (index, item) {
                    if (index < data.length) {
                        if (isNotEmpty(stoAddMaterielList.warehouseInMainId)) {
                            if (item.materielType == items.materielType && item.materielNo == items.materielNo && item.houseName == items.houseName
                                && item.batchNo == items.batchNo) {
                                data.splice(index, 1);
                            }
                        } else if (isNotEmpty(stoAddMaterielList.orderMainId)) {
                            if (item.materielNo == items.materielNo) {
                                data.splice(index, 1);
                            }
                        }else{
                            if (item.materielNo == items.materielNo) {
                                data.splice(index, 1);
                            }
                        }
                    }
                });
            });

            stoAddMaterielList.materielDetailList = data;

            getList();
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;

    var cols = [[ //表头
        {fixed: 'left', type: 'checkbox'}  //开启修改框
        , {type: 'numbers', title: '序号', width: 60}  //序号
        , {
            field: 'materielType', title: '物料类别', align: 'center'
            , templet: function (d) {
                return stoAddMaterielList.materielType.filter(x => x.value == d.materielType)[0].name;
            }
        }
        , {field: 'materielNo', title: '物料编码', align: 'center'}
        , {field: 'materielName', title: '物料名称'}
        , {field: 'specifications', title: '规格', align: 'center'}
        , {field: 'manufactor', title: '厂家'}
    ]];
    if(stoAddMaterielList.openStockcount){
        cols = [[ //表头
            {fixed: 'left', type: 'checkbox'}  //开启修改框
            , {type: 'numbers', title: '序号', width: 60}  //序号
            , {
                field: 'materielType', title: '物料类别', align: 'center'
                , templet: function (d) {
                    return stoAddMaterielList.materielType.filter(x => x.value == d.materielType)[0].name;
                }
            }
            , {field: 'materielNo', title: '物料编码', align: 'center'}
            , {field: 'materielName', title: '物料名称'}
            , {field: 'specifications', title: '规格', align: 'center'}
            , {field: 'stockCount', title:'现有库存',align:'right'}
            , {field: 'manufactor', title: '厂家'}
        ]]
    }

    _layuiTable({
        elem: '#stoAddMaterielList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'stoAddMaterielList_table', //必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            data: stoAddMaterielList.materielDetailList,
            cols:cols
        }
    });
}

/**
 * 保存
 * @param $callback
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        // 成功验证后，调用父页面方法传回数据
        parent.getAddList(field);
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
}

/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {
    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(stoAddMateriel_submit)', function (data) {
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('stoAddMaterielList_table');
        var data = checkStatus.data; //获取选中行的数据
        if (data.length == 0) {
            warningToast("请至少选择一条记录");
            return false;
        }

        typeof $callback === 'function' && $callback(data); //返回一个回调事件
    });
    $("#stoAddMateriel_submit").trigger('click');
}

