/**
 * 设置盘点窗口
 * @author: Rain
 * @version: 1.0
 * @date: 2020/09/05
 */
var stoInventorySetCheckList = avalon.define({
    $id: "stoInventorySetCheckList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    dataList: [{"name": "药品", "value": "1"}, {"name": "耗材", "value": "2"}],
    hide: true
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var hide = GetQueryString("hide");
        if (hide == "true") {
            stoInventorySetCheckList.hide = false;
        } else {
            stoInventorySetCheckList.hide = true;
        }
        initSearch(); //初始化搜索框
        getList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#stoInventorySetCheckList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'stoInventorySetCheckList_search'  //指定的lay-filter
        , conds: [
            {field: 'type', type: 'radio', value: "1", data: stoInventorySetCheckList.dataList},
            {field: 'materielNo', title: '编码或名称：', type: 'input'}
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
            table.reload('stoInventorySetCheckList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList() {
    var inventoryNo = GetQueryString("inventoryNo");
    var houseNo = GetQueryString("houseNo");
    var param = {
        "inventoryNo": inventoryNo,
        "houseNo": houseNo,
        "type": "1"
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#stoInventorySetCheckList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'stoInventorySetCheckList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-125', //table的高度，页面最大高度减去差值
            url: $.config.services.pharmacy + "/stoInventoryMain/findList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox', hide: !stoInventorySetCheckList.hide}  //开启修改框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'houseName', title: '仓库', align: 'center',width:100}
                , {field: 'materielNo', title: '编码', align: 'center'}
                , {field: 'materielName', title: '名称', align: 'center'}
                , {field: 'batchNo', title: '批次号', align: 'center'}
                , {
                    field: 'expirationDate', title: '到期日期', align: 'center',width:140,
                    templet: function (d) {
                        return util.toDateString(d.expirationDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'specifications', title: '规格', align: 'center',width:140}
                , {
                    fixed: 'right',
                    title: '操作',
                    width: 100,
                    align: 'center',
                    hide: !stoInventorySetCheckList.hide,
                    toolbar: '#stoInventorySetCheckList_bar'
                }
            ]]
        }, //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.inventoryDetailId)) {
                        var ids = [];
                        ids.push(data.inventoryDetailId);
                        del(ids);
                    }
                });
            }
        }
    });
}


/**
 * 关闭弹窗
 * @param supplierId
 * @param drugInfoIds
 * @param $callback
 */
function save($callback) {  //菜单保存操作
    //对表单验证
    verify_form(function (field) {
        //成功验证后
        var param = field
        var url = $.config.services.pharmacy + "/stoInventoryMain/insert.do";
        //可以继续添加需要上传的参数
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: url,
            data: param,
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    });
}


/**
 * 验证表单
 * @param $callback 成功验证后的回调函数
 */
function verify_form($callback) {

    //监听提交,先定义个隐藏的按钮
    var form = layui.form; //调用layui的form模块
    form.on('submit(stoInventorySetCheck_submit)', function (data) {
        //通过表单验证后
        var table = layui.table; //获取layui的table模块
        var checkStatus = table.checkStatus('stoInventorySetCheckList_table'); //test即为基础参数id对应的值
        var data = checkStatus.data; //获取选中行的数据
        var materielNoList = [];
        var batchNoList = [];
        var stockCountList = [];
        var stockLockCountList = [];
        if (data.length == 0) {
            warningToast("请选择一条记录");
            return false;
        } else {
            $.each(data, function (i, item) {
                materielNoList.push(item.materielNo);
                batchNoList.push(item.batchNo);
                stockCountList.push(item.stockCount);
                stockLockCountList.push(item.stockLockCount);
            });
        }

        var inventoryNo = GetQueryString("inventoryNo")
        var field = {
            "inventoryNo": inventoryNo,
            "materielNoList": materielNoList,
            "batchNoList": batchNoList,
            "stockCountList": stockCountList,
            "stockLockCountList": stockLockCountList
        };
        

        typeof $callback === 'function' && $callback(field); //返回一个回调事件
    });
    $("#stoInventorySetCheck_submit").trigger('click');
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('stoInventorySetCheckList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确定删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.inventoryDetailId);
            });
            del(ids);
        });
    }
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
        url: $.config.services.pharmacy + "/stoInventoryMain/deleteCheck.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('stoInventorySetCheckList_table'); //重新刷新table
        }
    });
}

function checkAdd() {
    var title = "新增盘点物料";
    var houseNo = GetQueryString("houseNo");
    var inventoryNo = GetQueryString("inventoryNo")
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: $.config.server + "/stock/stoInventoryInsertCheckList?inventoryNo=" + inventoryNo + "&houseNo=" + houseNo,  //弹框自定义的url，会默认采取type=2
        width: 1300, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 700,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        btn: ['确定', '全部', '取消'], // btnType=0时设置才生效
        done: function (index, iframeWin) {
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("操作成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoInventorySetCheckList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        },
        btn2: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var ids = iframeWin.saveAll(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("操作成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('stoInventorySetCheckList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}