/**
 * recentInspectionItemList.js的js文件，查看近期检验项目
 * @author anders
 * @date 2020-10-21
 * @version 1.0
 */
var recentInspectionItemList = avalon.define({
    $id: "recentInspectionItemList",
    baseFuncInfo: baseFuncInfo, //底层基本方法
    patientId: '',     //患者id
    diaRecordId: ''    //透析记录id
});

layui.use(['index'],function(){
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        recentInspectionItemList.patientId = GetQueryString('patientId') || '';
        recentInspectionItemList.diaRecordId = GetQueryString('diaRecordId') || '';

        getList();
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    var param = {
        patientId: recentInspectionItemList.patientId
    }
    //个人计划表格
    _layuiTable({
        elem: '#recentInspectionItemList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'recentInspectionItemList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            url: $.config.services.dialysis + "/tesPlan/recentTestPlanList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'orderName', title: '检验项目'}
                , {field: 'testTimes', title: '检验频次',align:'center',
                    templet: function (d) {
                        return getSysDictName("TestFrequency", d.testTimes);
                    }
                }
                , {field: 'lastDate', title: '上次检验时间', align: 'center'
                    , templet: function (d) {
                        if (isEmpty(d.lastDate)) {
                            return "";
                        }
                        return util.toDateString(d.lastDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'nextDate', title: '下次检验时间', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.nextDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'isRecent', title: '近期状态', align: 'center',
                    templet: function (d) {
                        // 0-近期检验项目，1-非近期
                        var html = '<div style="color: #ff0000;">近期</div>';
                        if (d.isRecent === '1') {
                            html = '<div>非近期</div>';
                        }
                        return html;
                    }
                }
                , {field: 'dataStatus', title: '状态', align: 'center',
                    templet: function (d) {
                        // 0-启用，1-停用，2-删除
                        return d.dataStatus === '0' ? '启用' : '停用';
                    }
                }
                , {fixed: 'right', title: '操作', width: 200, align: 'center'
                    , toolbar: '#recentInspectionItemList_bar'
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
                if (isNotEmpty(data.testPlanId)) {
                    add(data.testPlanId, data.orderMainId);
                }
            } else if (layEvent === 'change') {
                //    检验变更
                var ids = data.testPlanId;
                var title = "检验变更";
                var url = $.config.server + "/examine/tesPlanPersonalPlanChange?tesPlanId=" + ids + "&patientId=" + recentInspectionItemList.patientId;
                //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
                _layerOpen({
                    openInParent: true,
                    url: url,  //弹框自定义的url，会默认采取type=2
                    width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
                    height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
                    title: title, //弹框标题
                    done: function (index, iframeWin, layer) {
                        /**
                         * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
                         * 利用iframeWin可以执行弹框的方法，比如save方法
                         */
                        var ids = iframeWin.save(
                            //成功保存之后的操作，刷新页面
                            function success() {
                                successToast("保存成功");
                                var table = layui.table; //获取layui的table模块
                                table.reload('recentInspectionItemList_table'); //重新刷新table
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                            }
                        );
                    }
                });
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.testPlanId)) {
                        var ids = [];
                        ids.push(data.testPlanId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 添加-编辑检验计划
 */
function add(tesPlanId,orderMainId) {
    var title = "";
    var url = "";
    if (isEmpty(tesPlanId)) {
        title = "新增"
        url = $.config.server + "/examine/tesPlanPersonalPlanEdit?patientId=" + recentInspectionItemList.patientId;
    } else {
        title = "编辑"
        url = $.config.server + "/examine/tesPlanPersonalPlanEdit?patientId=" + recentInspectionItemList.patientId + "&tesPlanId=" + tesPlanId+"&orderMainId"+orderMainId;
    }

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('recentInspectionItemList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
* 检验变更记录
*
*/
function changeRecord() {
    var title = "记录";
    var url = $.config.server + "/examine/tesPlanPersonalPlanChangeRecord?patientId=" + recentInspectionItemList.patientId;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 800,
        height: 500,
        readonly: true,
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
                    table.reload('recentInspectionItemList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
* 当前的病人的检验项目批量修改下次检验时间
*
*/
function changePlan() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('recentInspectionItemList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    var idc = [];
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        $.each(data, function (i, item) {
            idc.push(item.testPlanId);
        });
    }
    var ids = idc.join(",");
    var title = "检验变更";
    var url = $.config.server + "/examine/tesPlanPersonalPlanChange?patientId=" + recentInspectionItemList.patientId + "&tesPlanId=" + ids;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin, layer) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('recentInspectionItemList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件 个人计划
 * @param ids
 */
function del(ids) {
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesPlan/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('recentInspectionItemList_table'); //重新刷新table
        }
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback){  //
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('recentInspectionItemList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data == null || data.length == 0) {
        warningToast("请至少选择一条记录");
        return;
    }
    var executeOrderList = [];
    var isRecentArr = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if ('1' === item.dataStatus) {   //判断选择是数据是否为“停用”状态
            warningToast('请选择启用状态的数据');
            return;
        }
        // if ('1' === item.isRecent) {   //非近期检验项目
        //     warningToast('请选择近期检验的项目');
        //     return;
        // }
        isRecentArr.push(item.isRecent);

        var order = {};
        order.orderDictId = item.orderMainId;  //医嘱id
        order.diaRecordId = recentInspectionItemList.diaRecordId;  //透析记录id
        order.orderContent = item.orderName;
        executeOrderList.push(order);
    }

    //保存事件
    var saveFun = function () {
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/diaExecuteOrder/recentItemAddToOrder.do",
            data: JSON.stringify(executeOrderList),  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });
    }

    if (isRecentArr.indexOf('1') > -1) {   //选择的项目包含非近期检验项目，做出提示
        layer.confirm('所选数据包含非近期检验项目，确定保存吗？', function (index) {
            // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
            layer.close(index);
            saveFun();
        });
    } else {
        saveFun();
    }

}



