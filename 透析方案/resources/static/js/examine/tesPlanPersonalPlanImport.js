/**
 * tesPlanPersonalPlanImport.jsp的js文件，包括查询，编辑操作
 */
/* 检验计划中心计划导入js
* @Author wahmh
* @Date 2020-10-7
* */
var tesPlanPersonalPlanImport = avalon.define({
    $id: "tesPlanPersonalPlanImport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: ""//患者id
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        var id = GetQueryString("patientId");  //接收变量
        tesPlanPersonalPlanImport.patientId = id;
        //获取实体信息
        getInfo(id, function (data) {
            //在回调函数中，做其它操作，比如获取下拉列表数据，获取其它信息
            //...
        });
        avalon.scan();
    });
});

/**
 * 获取实体
 * @param id
 * @param $callback 成功验证后的回调函数，
 * 可做其它操作，比如获取下拉列表数据，获取其它信息
 */
function getInfo(id, $callback) {
    //获取layui的table模块
    var table = layui.table;
    _layuiTable({
        elem: '#tesPlanPersonalPlanImport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'tesPlanPersonalPlanImport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            url: $.config.services.dialysis + "/tesPlan/getCenterPlanList.do", // ajax的url必须加上getRootPath()方法
            where: {"patientId": id}, //接口的参数。如：where: {token: 'sasasas', id: 123}
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
            ]]
        },
    });
}

/**
 * 关闭弹窗
 * @param $callBack  成功修改后的回调函数，比如可用作于修改后查询列表
 */
function save($callback) {  //菜单保存操作
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('tesPlanPersonalPlanImport_table'); //test即为基础参数id对应的值
    var data = checkStatus.data; //获取选中行的数据
    var ids = [];
    if (data.length == 0) {
        warningToast("请至少选择一条记录");
        return false;
    } else {
        //    从中心导入
        //    获取选中的中心计划的TesPlanId
        $.each(data, function (i, item) {
            ids.push(item.testPlanId);
        });
        var param = {
            "ids": ids.join(","),
            "patientId": tesPlanPersonalPlanImport.patientId
        };
        _ajax({
            type: "POST",
            url: $.config.services.dialysis + "/tesPlan/importPlanToPersonal.do",
            data: param,  //必须字符串后台才能接收list,
            //loading:false,  //是否ajax启用等待旋转框，默认是true
            dataType: "json",
            done: function (data) {
                typeof $callback === 'function' && $callback(data); //返回一个回调事件
            }
        });

    }
}



