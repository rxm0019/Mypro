/**
 * 排程管理执行设置列表
 * @author: hhc
 * @version: 1.0
 * @date: 2020/9/4
 */
var sysQuartzJobList = avalon.define({
    $id: "sysQuartzJobList",
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
        elem: '#sysQuartzJobList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'sysQuartzJobList_search'  //指定的lay-filter
        , conds: [
            {field: 'jobName', title: '排程功能名称：', type: 'select', data: getSysDictByCode("job_class", true)}
            , {
                field: 'cronType', type: 'checkbox', title: '频率类别：'
                , data: [{'name': '每天', 'value': '0'}, {'name': '周期', 'value': '1'}, {'name': '每月', 'value': '2'}]
            } //加载数据字典
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
            table.reload('sysQuartzJobList_table', {
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
        elem: '#sysQuartzJobList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'sysQuartzJobList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.platform + "/sysQuartzJob/list.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                //{fixed: 'left',type:'checkbox'}  //开启编辑框
                //,{type: 'numbers', title: '序号',width:60 }  //序号
                {
                    field: 'jobName', title: '排程功能名称', align: 'center',
                    templet: function (d) {
                        return getSysDictName('job_class', d.jobName);
                    }
                }
                , {field: 'cronName', title: '执行频率', align: 'cebter'}
                , {
                    field: 'dataStatus', title: '状态', align: 'center',
                    templet: function (d) {
                        // var str = d.dataStatus === '0' ? '启用': '停用';
                        // return getSysDictName('ChannelStatus',d.dataStatus);
                        // 0-启用，1-停用，2-删除
                        return d.dataStatus === '0' ? '启用' : '停用';
                    }
                }
                , {field: 'description', title: '说明', align: 'left'}
                , {
                    fixed: 'right', title: '操作', width: 276, align: 'center'
                    , toolbar: '#sysQuartzJobList_bar'
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
                if (isNotEmpty(data.quartzJobId)) {
                    saveOrEdit(data.quartzJobId);
                }
            }else if(layEvent === 'delete'){
                layer.confirm('确定删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.quartzJobId)){
                        var ids = [];
                        ids.push(data.quartzJobId);
                        del(ids);
                    }
                });
            } else if(layEvent === 'immediateExecution'){
                toImmediateExecution(data.jobClassName,data.jobGroup,data.hospitalNo); //立即执行排程
            } else if (layEvent === 'enable') { //启用排程功能
                var title = '';
                if (data.dataStatus === '0') {
                    title = '确定停用此功能吗？';
                } else {
                    title = '确定启用此功能吗？';
                }
                layer.confirm(title, function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.quartzJobId)) {
                        var id = data.quartzJobId;
                        enable(id, data.dataStatus);
                    }
                });
            }
        }
    });
}

/**
 * 删除
 * @param ids
 */
function del(ids){
    var param = {
        "ids": ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/sysQuartzJob/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('sysQuartzJobList_table'); //重新刷新table
        }
    });
}

/**
 * 立即执行排程
 */
function toImmediateExecution(jobClassName,jobGroup,hospitalNo) {
    var param = {
        "jobClassName":jobClassName,
        "jobGroup":jobGroup,
        "hospitalNo":hospitalNo
    };
    var url = $.config.services.platform + "/sysQuartzJob/immediateExecution.do";
    _ajax({
        type: "POST",
        url: url,
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            var table = layui.table; //获取layui的table模块
            table.reload('sysQuartzJobList_table'); //重新刷新table
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
        url = $.config.server + "/system/sysQuartzJobEdit";
    } else {  //编辑
        title = "频率调整";
        url = $.config.server + "/system/sysQuartzJobEdit?id=" + id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 800, //弹框自定义的宽度，方法会自动判断是否超过宽度
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
                    table.reload('sysQuartzJobList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 启用停用排程
 * @param ids
 */
function enable(id, status) {
    var msg = '';
    var dataStatus = '';
    if (status === '0') {
        msg = '停用成功';
        dataStatus = '1';
    } else {
        msg = '启用成功';
        dataStatus = '0';
    }
    var param = {
        "quartzJobId": id,
        "dataStatus": dataStatus
    };
    _ajax({
        type: "POST",
        url: $.config.services.platform + "/sysQuartzJob/enable.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast(msg);
            var table = layui.table; //获取layui的table模块
            table.reload('sysQuartzJobList_table'); //重新刷新table
        }
    });
}

