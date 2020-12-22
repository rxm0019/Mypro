/**
 * 医嘱字典
 * @author: Rain
 * @version: 1.0
 * @date: 2020/08/21
 */
var basOrderMainList = avalon.define({
    $id: "basOrderMainList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    OrderType: [] //医嘱类别下拉选
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getOrderType();//获取医嘱类别下拉选
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 获取医嘱类别下拉选
 */
function getOrderType() {
    var list = getSysDictByCode("OrderType", true);
    for (var i in list) {
        //排除其他
        if (list[i].name != "其他") {
            basOrderMainList.OrderType.push(list[i]);
        }
    }
    layui.form.render();
}

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#basOrderMainList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'basOrderMainList_search'  //指定的lay-filter
        , conds: [
            {field: 'orderName', title: '医嘱名称：', type: 'input'}
            , {field: 'orderType', title: '医嘱类别：', type: 'select', data: basOrderMainList.OrderType}
            , {field: 'dataStatus', title: '状态：', type: 'select', data: getSysDictByCode("sys_status", true)}
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
            table.reload('basOrderMainList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#basOrderMainList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'basOrderMainList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/basOrderMain/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'orderName', title: '医嘱名称', align: 'center'
                }
                , {
                    field: 'singleDose', title: '剂量', align: 'center'
                }
                , {
                    field: 'route', title: '用药途径', align: 'center',
                    templet: function (d) {
                        return baseFuncInfo.getSysDictName('Route', d.route);
                    }
                }
                , {field: 'manufactor', title: '生产厂家', align: 'center'}
                , {
                    field: 'orderType', title: '医嘱类别', align: 'center',
                    templet: function (d) {
                        return baseFuncInfo.getSysDictName('OrderType', d.orderType);
                    }
                }
                , {
                    field: 'dataStatus', title: '状态', align: 'center'
                    , templet: function (d) {
                        return baseFuncInfo.getSysDictName('sys_status', d.dataStatus);
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 200, align: 'center'
                    , toolbar: '#basOrderMainList_bar'
                }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { // 修改 or 详情
                //do something
                if (isNotEmpty(data.orderMainId)) {
                    saveOrEdit(data.orderMainId, layEvent, (layEvent === 'edit' ? false : true));
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.orderMainId)) {
                        var ids = [];
                        ids.push(data.orderMainId);
                        del(ids);
                    }
                });
            } else if (layEvent === 'pack') { //打包

                onPack(data.orderMainId, data.orderName, data.orderType, data.specifications, data.unit);
            }
        }
    });
}

/**
 * 打包
 */
function onPack(id, name, type, specifications, unit) {
    var title = "打包详情";
    var url = $.config.server + "/base/basOrderDetailList?orderMainId=" + id + "&orderName=" + name + "&orderType=" + type
        + "&specifications=" + specifications + "&unit=" + unit;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件

    _layerOpen({
        url: encodeURI(url),
        width: 1400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 760,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: true, // true：查看 | false：编辑
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var table = layui.table; //获取layui的table模块
            table.reload('basOrderMainList_table'); //重新刷新table
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id, layEvent, readonly) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.server + "/base/basOrderMainEdit";
    } else {  //修改
        if (layEvent === "edit") {
            title = "编辑";
            url = $.config.server + "/base/basOrderMainEdit?id=" + id + "&layEvent=" + layEvent;
        }
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 560,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        readonly: readonly, // true：查看 | false：编辑
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
                    table.reload('basOrderMainList_table'); //重新刷新table
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
        url: $.config.services.platform + "/basOrderMain/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('basOrderMainList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('basOrderMainList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据`
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.orderMainId);
            });
            del(ids);
        });
    }
}

