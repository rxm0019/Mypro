/**
 * 已有物料列表窗口
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/11
 */
var basSupplierManagementDetailList = avalon.define({
    $id: "basSupplierManagementDetailList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var supplierId = GetQueryString("supplierId");
        initSearch(); //初始化搜索框
        getList(supplierId);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#basSupplierManagementDetailList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basSupplierManagementDetailList_search'  //指定的lay-filter
        , conds: [
            {field: 'materielNo', title: '编号或名称：', type: 'input'}
            , {field: 'specifications', title: '规格：', type: 'input'}
            , {field: 'materielType', title: '物料类别：', type: 'select', data: getSysDictByCode("materielType", true)}
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
            table.reload('basSupplierManagementDetailList_table', {
                where: field
            });
        }
    });
}


/**
 * 查询列表事件
 */
function getList(supplierId) {
    var param = {
        "supplierId": supplierId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basSupplierManagementDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basSupplierManagementDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basSupplierManagement/detailList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'materielType', title: '物料类别', align: 'center'
                    , templet: function (d) {
                        if (d.materielType !== null) {
                            return getSysDictName("materielType", d.materielType);
                        } else {
                            return "";
                        }
                    }
                }
                , {field: 'materielNo', title: '物料编码', align: 'center'}
                , {field: 'materielName', title: '物料名称'}
                , {field: 'specifications', title: '规格', align: 'center'}
                ,{field:'price',title:'采购价格',align:'right'}
                , {field: 'manufactor', title: '厂家'}
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#basSupplierManagementDetailList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.materielSupplierRid)) {
                        var ids = [];
                        ids.push(data.materielSupplierRid);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/basSupplierManagement/deleteDetail.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basSupplierManagementDetailList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basSupplierManagementDetailList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.materielSupplierRid);
            });
            del(ids);
        });
    }
}

function onInsert() {
    var title = "新增物料";
    var supplierId = GetQueryString("supplierId");
    var url = $.config.server + "/base/basSupplierManagementInsertList?supplierId=" + supplierId;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件

    _layerOpen({
        url: url,
        width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
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
                    table.reload('basSupplierManagementDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}