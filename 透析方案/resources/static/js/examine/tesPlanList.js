/**
 * tesPlanList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
/* 检验计划列表js
* @Author wahmh
* @Date 2020-10-7
* */
var tesPlanList = avalon.define({
    $id: "tesPlanList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: ''//当前患者ID
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //initSearch(); //初始化搜索框
        tesPlanList.patientId = GetQueryString("patientId");
        getList();  //查询列表
        avalon.scan();
    });
});

/*
* 从中心计划导入
* */
function importFromCenter() {
    var title = "中心计划";
    var url = $.config.server + "/examine/tesPlanPersonalPlanImport?patientId=" + tesPlanList.patientId;
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
                    successToast("导入成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('tesPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/*
* 检验变更记录
* */
function changeRecord() {
    var title = "记录";
    var url = $.config.server + "/examine/tesPlanPersonalPlanChangeRecord?patientId=" + tesPlanList.patientId;
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
                    table.reload('tesPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/*
* 当前的病人的检验项目批量修改下次检验时间
* */
function changePlan() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('tesPlanList_table'); //test即为基础参数id对应的值
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
    var url = $.config.server + "/examine/tesPlanPersonalPlanChange?patientId=" + tesPlanList.patientId + "&tesPlanId=" + ids;
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
                    table.reload('tesPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/*
* 初始化tab选项
* */
layui.use('element', function () {
    var element = layui.element;
    element.tabChange('tesPlanTab', 'personalPlan');
});

/**
 * 查询列表事件
 */
function getList() {
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    //个人计划表格
    _layuiTable({
        elem: '#tesPlanList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'tesPlanList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            url: $.config.services.dialysis + "/tesPlan/list.do", // ajax的url必须加上getRootPath()方法
            where: {"patientId": tesPlanList.patientId, "planType": "1"}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left', type: 'checkbox'}  //开启编辑框
                , {type: 'numbers', title: '序号', width: 60}  //序号
                , {
                    field: 'orderName', title: '检验项目'

                }
                , {
                    field: 'testTimes', title: '检验频次',
                    templet: function (d) {
                        return getSysDictName("TestFrequency", d.testTimes);
                    }
                }
                , {
                    field: 'lastDate', title: '上次检验时间', align: 'center'
                    , templet: function (d) {
                        if (isEmpty(d.lastDate)) {
                            return "";
                        }
                        return util.toDateString(d.lastDate, "yyyy-MM-dd");
                    }
                }
                , {
                    field: 'nextDate', title: '下次检验时间', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.nextDate, "yyyy-MM-dd");
                    }
                }
                , {
                    field: 'dataStatus', title: '状态', align: 'center',
                    templet: function (d) {
                        // var str = d.dataStatus === '0' ? '启用': '停用';
                        // return getSysDictName('ChannelStatus',d.dataStatus);
                        // 0-启用，1-停用，2-删除
                        return d.dataStatus === $.constant.TestPlan.OPEN ? '启用' : '停用';
                    }
                }
                , {
                    fixed: 'right', title: '操作', width: 300, align: 'center'
                    , toolbar: '#tesPlanList_bar'
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
                var url = $.config.server + "/examine/tesPlanPersonalPlanChange?tesPlanId=" + ids + "&patientId=" + tesPlanList.patientId;
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
                                table.reload('tesPlanList_table'); //重新刷新table
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                            }
                        );
                    }
                });
            } else if (layEvent === 'del') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
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
    //中心计划表格
    _layuiTable({
        elem: '#centerPlanList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'centerPlanList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            url: $.config.services.dialysis + "/tesPlan/list.do", // ajax的url必须加上getRootPath()方法
            where: {"patientId": tesPlanList.patientId, "planType": "0"}, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'orderName', title: '检验项目'}
                , {
                    field: 'testTimes', title: '检验频次',
                    templet: function (d) {
                        return getSysDictName("TestFrequency", d.testTimes);
                    }
                }
                , {
                    field: 'dataStatus', title: '状态', align: 'center',
                    templet: function (d) {
                        // var str = d.dataStatus === '0' ? '启用': '停用';
                        // return getSysDictName('ChannelStatus',d.dataStatus);
                        // 0-启用，1-停用，2-删除
                        return d.dataStatus === '0' ? '启用' : '停用';
                    }
                },
                {
                    field: 'remarks', title: '备注'
                }
                , {
                    fixed: 'right', title: '操作', width: 300, align: 'center'
                    , toolbar: '#centerPlanList_bar'
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
                    centerAdd(data.testPlanId, data.orderMainId);
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确认删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.testPlanId)) {
                        var ids = [];
                        ids.push(data.testPlanId);
                        centerDel(ids);
                    }
                });
            }
        }
    });
}

/*
* 获取检验项目名称
* */
function getInspectionName(orderMainId) {
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/tesPlan/getInspectionName.do",
        data: {"orderMainId": orderMainId},  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
        }
    });
}

/**
 * 中心计划-添加检验计划
 */
function centerAdd(tesPlanId, orderMainId) {
    var title = "";
    var url = "";
    if (isEmpty(tesPlanId)) {
        title = "新增"
        url = $.config.server + "/examine/tesPlanCenterPlanEdit?patientId=" + tesPlanList.patientId;
    } else {
        title = "编辑"
        url = $.config.server + "/examine/tesPlanCenterPlanEdit?patientId=" + tesPlanList.patientId + "&tesPlanId=" + tesPlanId + "&orderMainId" + orderMainId;
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
                    table.reload('centerPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 个人计划-添加-编辑检验计划
 */
function add(tesPlanId, orderMainId) {
    var title = "";
    var url = "";
    if (isEmpty(tesPlanId)) {
        title = "新增"
        url = $.config.server + "/examine/tesPlanPersonalPlanEdit?patientId=" + tesPlanList.patientId;
    } else {
        title = "编辑"
        url = $.config.server + "/examine/tesPlanPersonalPlanEdit?patientId=" + tesPlanList.patientId + "&tesPlanId=" + tesPlanId + "&orderMainId" + orderMainId;
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
                    table.reload('tesPlanList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件 中心计划
 * @param ids
 */
function centerDel(ids) {
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
            table.reload('centerPlanList_table'); //重新刷新table
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
            table.reload('tesPlanList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('tesPlanList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确认删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.testPlanId);
            });
            del(ids);
        });
    }
}

