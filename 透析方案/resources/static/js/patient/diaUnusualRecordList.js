/**
 * diaUnusualRecordList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var diaUnusualRecordList = avalon.define({
    $id: "diaUnusualRecordList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者Id
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
         diaUnusualRecordList.patientId = GetQueryString("patientId");
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList(diaUnusualRecordList.patientId);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#diaUnusualRecordList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'diaUnusualRecordList_search'  //指定的lay-filter
        , conds: [
            {field: 'createTime', title: '透析日期:', type: 'date_range'}
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
            table.reload('diaUnusualRecordList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(id) {
    var param = {
        "patientId": id
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaUnusualRecordList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaUnusualRecordList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaUnusualRecord/listByPatientId.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                // {fixed: 'left',type:'checkbox'}  //开启编辑框
                {type: 'numbers', title: '序号', width: 60}  //序号
                , {field: 'dialysisDate', title: '透析日期', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }}
                , {field: 'monitorTime', title: '记录时间', align: 'center'
                    , templet: function (d) {
                        return util.toDateString(d.monitorTime, "HH:mm:ss");
                    }}
                , {field: 'unusualDetails', title: '病症及体征'
                    , templet: function (d) {
                        var list = d.unusualDetails.split(",");
                        var html = "";
                        $.each(list, function (index, item) {
                            html +='<div style="width: 100%; height: 29px;float: left;"><span class="layui-badge-dot layui-bg-black"></span><span style="font-size: 14px;margin-left: 5px">'+ getSysDictName("UnusualDetails", item) +'</span></div>';
                        })
                        return html
                    }}
                , {field: 'handleDetails', title: '处理'
                    , templet: function (d) {
                        var list = d.handleDetails.split(",");
                        var html = "";
                        $.each(list, function (index, item) {
                            html +='<div style="width: 100%; height: 29px;float: left;"><span class="layui-badge-dot layui-bg-black"></span><span style="font-size: 14px;margin-left: 5px">'+ getSysDictName("HandleDetails", item)+'</span></div>';
                        })
                        return html
                    }}
                , {field: 'recorder', title: '记录人', align: 'center'}

            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'edit') { //编辑
                //do something
                if (isNotEmpty(data.unusualRecordId)) {
                    saveOrEdit(data.unusualRecordId);
                }
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if (isNotEmpty(data.unusualRecordId)) {
                        var ids = [];
                        ids.push(data.unusualRecordId);
                        del(ids);
                    }
                });
            }
        }
    });
}


