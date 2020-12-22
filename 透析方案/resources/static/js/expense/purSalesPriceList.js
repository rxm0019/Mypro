/**
 * 销售价格管理
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/28
 */
var purSalesPriceList = avalon.define({
    $id: "purSalesPriceList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        var form = layui.form;

        form.on('select(type)', function (data) {
            if (data.value === "1") {
                getList("1");  //查询列表
            } else if (data.value === "2") {
                getList("2");  //查询列表
            } else if (data.value === "3") {
                getList3("3");  //查询列表
            } else {
                getList4("4");  //查询列表
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
        elem: '#purSalesPriceList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'purSalesPriceList_search'  //指定的lay-filter
        ,conds:[
            {field: 'type', type: 'select', title: '类别：', data: getSysDictByCode("materielType")}
            , {field: 'materielNo', title: '编号或名称：', type: 'input'}
            , {field: 'updateTime', title: '更新日期：', type: 'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
            var form = layui.form;
            var type = form.val("purSalesPriceList_search").type;
            getList(type);
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('purSalesPriceList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList(type) {
    var param = {
        "type": type
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#purSalesPriceList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'purSalesPriceList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purSalesPrice/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                , {
                    field: 'type', title: '类别', align: 'center', width: 100,
                    templet: function (d) {
                        return getSysDictName("materielType", d.type)
                    }
                }
                , {field: 'materielNo', title: '编码', align: 'center'}
                , {field: 'materielName', title: '名称', align: 'center'}
                , {field: 'manufactor', title: '厂家', align: 'center'}
                , {field: 'specifications', title: '规格', align: 'center'}
                , {field: 'costPrice', title: '标准价格', align: 'right', width: 100}
                , {field: 'price', title: '采购价格', align: 'right', width: 100}
                , {
                    field: 'salesPrice', title: '销售价格', align: 'right', width: 100,
                    templet: function (d) {
                        if (d.salesPrice !== null) {
                            return d.salesPrice.toFixed(2);
                        }
                    }}
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#purSalesPriceList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.materielNo)) {
                    saveOrEdit(data.materielNo, type, data.supplierInfoId);
                }
            }
        }
    });
}

/**
 * 查询列表事件
 */
function getList3(type) {
    var param = {
        "type": type
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#purSalesPriceList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'purSalesPriceList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purSalesPrice/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'type', title: '类别', align: 'center', width: 100,
                    templet: function (d) {
                        return getSysDictName("materielType", d.type)
                    }
                }
                , {field: 'materielNo', title: '编码', align: 'right', align: 'center'}
                , {field: 'materielName', title: '名称', align: 'right', align: 'center'}
                , {field: 'specifications', title: '规格', align: 'right', align: 'center'}
                , {
                    field: 'basicUnit', title: '基本单位', align: 'right', align: 'center',
                    templet: function (d) {
                        return getSysDictName("baseUnit", d.basicUnit)
                    }
                }
                , {field: 'costPrice', title: '标准价格', align: 'right', align: 'center', width: 100}
                , {field: 'salesPrice', title: '销售价格', align: 'center', width: 100}
                , {fixed: 'right', title: '操作', align: 'center', toolbar: '#purSalesPriceList_bar'}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.materielNo)) {
                    saveOrEdit(data.materielNo, type, data.supplierInfoId);
                }
            }
        }
    });
}

/**
 * 查询列表事件
 */
function getList4(type) {
    var param = {
        "type": type
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#purSalesPriceList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'purSalesPriceList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/purSalesPrice/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'type', title: '类别', align: 'center', width: 100,
                    templet: function (d) {
                        return getSysDictName("materielType", d.type)
                    }
                }
                , {field: 'materielNo', title: '编码', align: 'right', align: 'center'}
                , {field: 'materielName', title: '名称', align: 'right', align: 'center'}
                , {field: 'costPrice', title: '标准价格', align: 'right', align: 'center', width: 100}
                , {field: 'salesPrice', title: '销售价格', align: 'center', width: 100}

                , {
                    fixed: 'right', title: '操作', align: 'center'
                    , toolbar: '#purSalesPriceList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.materielNo)) {
                    saveOrEdit(data.materielNo, type, data.supplierInfoId);
                }
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(materielNo, type, supplierInfoId) {
    var title = "编辑";
    var url = $.config.server + "/expense/purSalesPriceEdit?materielNo=" + materielNo + "&type=" + type + "&supplierInfoId=" + supplierInfoId;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('purSalesPriceList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });

}

/**
 * 导出excel
 */
function exportExcel() {
    _downloadFile({
        url: $.config.services.pharmacy + "/purSalesPrice/export.do",
        data: layui.form.val("purSalesPriceList_search"),
        fileName: '销售价格管理管理.xlsx'
    });
}

/**
 * 导入
 */
function importExcel() {
    layer.confirm('导入的Excel必须是当前功能所导出的Excel', function (index) {
        baseFuncInfo.batchImp('purSalesPrice', 'pharmacy')
        layer.close(index)
    });
}

/**
 * 导入成功之后刷新页面
 */
function refresh() {
    layui.table.reload('purSalesPriceList_table');
}