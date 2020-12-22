/**
 * tesPlanList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
/* 检验计划检验变更记录js
* @Author wahmh
* @Date 2020-10-7
* */
var tesPlanPersonalPlanChangeRecord = avalon.define({
    $id: "tesPlanPersonalPlanChangeRecord",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var patientId = GetQueryString("patientId");
        //initSearch(); //初始化搜索框
        getList(patientId);  //查询列表
        avalon.scan();
    });
});

/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId": patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#tesPlanPersonalPlanChangeRecord_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'tesPlanPersonalPlanChangeRecord_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-2',
            url: $.config.services.dialysis + "/tesPlan/getTesRefuseList.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'testName', title: '检验项目'}
                , {field: 'testTimes', title: '检验频次'}
                , {
                    field: 'lastDate', title: '上次检验时间'
                    , templet: function (d) {
                        return isEmpty(d.lastDate) ? "" : util.toDateString(d.lastDate, "yyyy-MM-dd");
                    }
                }
                , {field: 'reason', title: '缘由'}
            ]]
        },
    });
}

/**
 * 添加检验计划
 */
function add() {
    var title = "新增";
    var url = $.config.server + "/examine/tesPlanPersonalPlanEdit";
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url: url,  //弹框自定义的url，会默认采取type=2
        width: 600, //弹框自定义的宽度，方法会自动判断是否超过宽度
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
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('tesPlanPersonalPlanChangeRecord_table'); //重新刷新table
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
        url: $.config.services.dialysis + "/tesPlan/delete.do",
        data: param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function (data) {
            successToast("删除成功");
            var table = layui.table; //获取layui的table模块
            table.reload('tesPlanPersonalPlanChangeRecord_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('tesPlanPersonalPlanChangeRecord_table'); //test即为基础参数id对应的值
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

