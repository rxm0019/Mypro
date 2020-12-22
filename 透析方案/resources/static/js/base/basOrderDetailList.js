/**
 * 医嘱字典打包
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/14
 */
var basOrderDetailList = avalon.define({
    $id: "basOrderDetailList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    readonly: {readonly: false}, // 文本框设置只读
    orderName: GetQueryString("orderName"),
    orderType: baseFuncInfo.getSysDictName('OrderType', GetQueryString("orderType")),
    specifications: GetQueryString("specifications"),
    unit: GetQueryString("unit"),
    hide: true
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        basOrderDetailList.readonly = {readonly: true};
        var orderType = GetQueryString("orderType");
        if (orderType === "1") {
            basOrderDetailList.hide = false;
        }
        //所有的入口事件写在这里...
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    var id = GetQueryString("orderMainId");  //接收变量
    var type = GetQueryString("orderType");
    var param = {
        "orderMainId": id,
        "type": type
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basOrderDetailList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basOrderDetailList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-170', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basOrderMain/detailList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'},
                {type: 'numbers', title: '序号', width: 60},  //序号
                {
                    field: 'type', title: '类别', align: 'center',
                    templet: function (d) {
                        return getSysDictName("materielType", d.type)
                    }
                },
                 {
                     field: 'materielNo', title: '编码', align: 'center'
                }
                , {
                    field: 'materielName', title: '名称', align: 'center'
                }
                , {
                    field: 'specifications', title: '规格', align: 'center'
                }
                , {
                    field: 'manufactor', title: '生产厂家', align: 'center'
                }
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#basOrderDetailList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.orderDetailId)) {
                        var ids = [];
                        ids.push(data.orderDetailId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 添加明细
 */
function insert() {
    var id = GetQueryString("orderMainId");
    var orderType = GetQueryString("orderType");
    if (orderType === "1") {
        var table = layui.table; //获取layui的table模块
        var List = table.cache.basOrderDetailList_table;
        if (List.length == 1) {
            warningToast("药疗只能打包一笔明细！")
            return
        }
    }
    var title = "添加明细";
    var url = $.config.server + "/base/basOrderDetailInsertList?id=" + id + "&orderType=" + orderType;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件

    _layerOpen({
        url: url,
        width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: false, // true：查看 | false：编辑
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
                    table.reload('basOrderDetailList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
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
        url: $.config.services.platform + "/basOrderMain/deleteDetail.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basOrderDetailList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basOrderDetailList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据`
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.orderDetailId);
            });
            del(ids);
        });
    }
}

