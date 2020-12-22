/**
 * 排程管理执行结果列表查询
 * version 1.0
 * @author hhc
 * @date 2020/9/9
 */
var sysQuartzLogList = avalon.define({
    $id: "sysQuartzLogList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#sysQuartzLogList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'sysQuartzLogList_search'  //指定的lay-filter
        , conds: [
            {field: 'jobName', title: '排程功能名称：', type: 'select', data: getSysDictByCode("job_class", true)}
            , {field: 'executState', type: 'checkbox', title: '执行状态：'
                , data: [{'name': '执行中', 'value': '1'}, {'name': '成功', 'value': '2'}, {'name': '失败', 'value': '3'}]
            } //加载数据字典
            , {field: 'executTimeStart', title: '执行开始时间：', type: 'date'}
            , {field: 'executTimeEnd', title: '执行结束时间：', type: 'date'}
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
            table.reload('sysQuartzLogList_table', {
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
        elem: '#sysQuartzLogList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysQuartzLogList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/sysQuartzLog/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {
                    field: 'jobName', title: '排程功能名称', align: 'center',
                    templet: function (d) {
                        return getSysDictName('job_class', d.jobName);
                    }
                }
                , {
                    field: 'executTimeStart', title: '执行开始时间', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.executTimeStart, "yyyy-MM-dd HH:mm");
                    }
                }
                , {
                    field: 'executTimeEnd', title: '执行结束时间', align: 'center'
                    , templet: function (d) {
                        var str = d.executState;
                        if(str === '1'){
                           return '';
                        }else{
                            return util.toDateString(d.executTimeEnd, "yyyy-MM-dd HH:mm");
                        }

                    }
                }
                , {
                    field: 'executState', title: '执行状态', align: 'center', sortField: 'sql_.execut_state',
                   templet:function(d){
                        var str = d.executState;
                        if(str === '1'){
                            return "<span style='color: #007DDB;'>执行中</span>";
                        }else if(str === '2'){
                            return "执行完成";
                        }else if(str === '3'){
                            return "<span style='color: red;'>执行失败</span>";
                        }
                   }
                }
                , {field: 'description', title: '执行结果', align: 'left', sortField: 'sql_.description'}
                , {
                    fixed: 'right', title: '操作', width: 140, align: 'center'
                    , toolbar: '#sysQuartzLogList_bar'
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
                if (isNotEmpty(data.quartzLogId)) {
                    saveOrEdit(data.quartzLogId);
                }
            } else if (layEvent === 'heavyRun') { //重跑
                var title = '';
                if(data.isExecut === 'Y'){
                    title = "确定重跑此功能吗？"
                }
                    layer.confirm(title, function (index) {
                        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        if (isNotEmpty(data.quartzLogId)) {
                            var id = data.quartzLogId;
                            heavyRun(id,data.isExecut);
                        }
                    });
            }

        }
    });
}

/**
 * 重跑功能
 * @param id
 */
function heavyRun(id,status){
    var msg = '';
    var isExecut = '';
    if(status === 'Y'){
        msg = '重跑成功';
        // isExecut = 'N';
    }
    var param = {
        "quartzLogId":id,
        // "isExecut":isExecut
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/sysQuartzLog/heavyRun.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast(msg);
            var table = layui.table; //获取layui的table模块
            table.reload('sysQuartzLogList_table'); //重新刷新table
        }
    });
}


/**
 * 获取单个实体
 */
function saveOrEdit(id) {
    var url = "";
    var title = "";
    if (isEmpty(id)) {  //id为空,新增操作
        title = "新增";
        url = $.config.services.platform + "/sysQuartzLog/sysQuartzLogEdit";
    } else {  //编辑
        title = "编辑";
        url = getRootPath() + "sysQuartzLog/sysQuartzLogEdit?id=" + id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height: 500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title: title, //弹框标题
        done: function (index, iframeWin) {
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功", 500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('sysQuartzLogList_table'); //重新刷新table
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
        url: $.config.services.platform + "/sysQuartzLog/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功", 500);
            var table = layui.table; //获取layui的table模块
            table.reload('sysQuartzLogList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('sysQuartzLogList_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        layer.confirm('确认删除所选记录吗？', function (index) {
            layer.close(index);
            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.quartzLogId);
            });
            del(ids);
        });
    }
}

