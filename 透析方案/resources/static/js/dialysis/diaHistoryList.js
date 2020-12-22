/**
 * 透析历史记录
 * @author: Care
 * @version: 1.0
 * @date: 2020/10/05
 */
var diaHistoryList = avalon.define({
    $id: "diaHistoryList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '',//患者id
    hasDeleteRecord: false, // 判断是否有删除透析历史
});
layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        diaHistoryList.patientId = GetQueryString("patientId");  //接收变量
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList(diaHistoryList.patientId);  //查询列表
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch() {
    _initSearch({
        elem: '#diaHistoryList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        , filter: 'diaHistoryList_search'  //指定的lay-filter
        , conds: [
            {field: 'dialysisDate', title: '日期：', type: 'date_range'}
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
            table.reload('diaHistoryList_table', {
                where: field
            });
        }
    });
}

/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        patientId: patientId
    };
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaHistoryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaHistoryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            height: 'full-100', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/diaRecord/getDialysisHistory.do", // ajax的url必须加上getRootPath()方法
            where: param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                { fixed: 'left', type: 'numbers', title: '序号', width: 60 },  //序号
                {
                    fixed: 'left', field: 'dialysisDate', title: '日期', width: 120, align: 'center',
                    templet: function (d) {
                        return isEmpty(d.dialysisDate) ? "" : util.toDateString(d.dialysisDate, "yyyy-MM-dd");
                    }
                },
                {
                    field: 'upDate', title: '上机时间', width: 180, align: 'center',
                    templet: function (d) {
                        return isEmpty(d.upDate) ? "" : util.toDateString(d.upDate, "yyyy-MM-dd HH:mm:ss");
                    }
                },
                {
                    field: 'dialysisMode', title: '透析方式', width: 120, align: 'center',
                    templet: function (d) {
                        return getSysDictName($.dictType.DialysisMode, d.dialysisMode);
                    }
                },
                {
                    field: 'replaceDoctor', title: '体重&nbsp;&nbsp;kg<br/>（干/透前/透后/实际透后）', minWidth: 200, align: 'center',
                    templet: function (d) {
                        var dryWeight = isEmpty(d.dryWeight) ? "--" : d.dryWeight; // 干体重
                        var beforeWeight = isEmpty(d.beforeWeight) ? "--" : d.beforeWeight; // 透前体重
                        var afterPlanWeight = isEmpty(d.afterPlanWeight) ? "--" : d.afterPlanWeight; // 透后体重
                        var afterRealWeight = isEmpty(d.afterRealWeight) ? "--" : d.afterRealWeight; // 实际透后体重
                        return dryWeight + " / " + beforeWeight + " / " + afterPlanWeight + " / " + afterRealWeight;
                    }
                },
                {
                    title: '脱水&nbsp;&nbsp;L<br/>（目标/实际/机显）', width: 180, align: 'center',
                    templet: function (d) {
                        var targetDehydration = isEmpty(d.targetDehydration) ? "--" : d.targetDehydration; // 目标脱水量
                        var actualDehydration = isEmpty(d.actualDehydration) ? "--" : d.actualDehydration; // 实际脱水量
                        var machineDehydration = isEmpty(d.machineDehydration) ? "--" : d.machineDehydration; // 机显脱水量
                        return targetDehydration + " / " + actualDehydration + " / " + machineDehydration;
                    }
                },
                {
                    title: '收缩压/舒张压&nbsp;&nbsp;mmHg<br/>（透前 ~ 透后）', minWidth: 200, align: 'center',
                    templet: function (d) {
                        var beforeSystolicPressure = isEmpty(d.beforeSystolicPressure) ? "--" : d.beforeSystolicPressure; // 透前收缩压
                        var beforeDiastolicPressure = isEmpty(d.beforeDiastolicPressure) ? "--" : d.beforeDiastolicPressure; // 透前舒张压
                        var afterSystolicPressure = isEmpty(d.afterSystolicPressure) ? "--" : d.afterSystolicPressure; // 透后收缩压
                        var afterDiastolicPressure = isEmpty(d.afterDiastolicPressure) ? "--" : d.afterDiastolicPressure; // 透后舒张压
                        return beforeSystolicPressure + " / " + beforeDiastolicPressure + "&nbsp;&nbsp;~&nbsp;&nbsp;" + afterSystolicPressure + " / " + afterDiastolicPressure;
                    }
                },
                {
                    field: 'pulse', title: '脉搏&nbsp;&nbsp;次/分<br/>（透前 ~ 透后）', minWidth: 150, align: 'center',
                    templet: function (d) {
                        var beforePulse = isEmpty(d.beforePulse) ? "--" : d.beforePulse; // 透前脉搏
                        var afterPulse = isEmpty(d.afterPulse) ? "--" : d.afterPulse; // 透后脉搏
                        return beforePulse + "&nbsp;&nbsp;~&nbsp;&nbsp;" + afterPulse;
                    }
                },
                {
                    field: 'anticoagulant', title: '抗凝剂', width: 150,
                    templet: function (d) {
                        return getSysDictName($.dictType.Anticoagulant, d.anticoagulant);
                    }
                },
                {
                    field: 'diaCoagulation', title: '透析器凝血', width: 100, align: 'center',
                    templet: function (d) {
                        return getSysDictName($.dictType.DiaCoagulation, d.diaCoagulation);
                    }
                },
                { fixed: 'right', title: '操作', align: 'center', toolbar: '#diaHistoryList_bar' }
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter,layer) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象

            if (layEvent === 'detail') { //详情
                //跳转到透析治疗页面
                var dialysisTime = util.toDateString(data.dialysisDate, "yyyy-MM-dd");
                diaHistoryList.baseFuncInfo.openDialysisLayoutPage({
                    patientId: data.patientId,
                    diaRecordId: data.diaRecordId,
                    query: {
                        dialysisDate: dialysisTime, // 透析日期
                        scheduleShift: "", // 班次
                        regionSettingId: "", // 区组
                        patientName: "" // 姓名
                    }
                });

                // 关闭弹窗
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //如果设定了yes回调，需进行手工关闭
            } else if (layEvent === 'delete') { // 删除
                // 删除透析记录前需用户确认是否删除
                layui.layer.confirm('确定删除该笔透析记录吗？<br/>删除透析记录，透析治疗、透前评估、执行医嘱、监测记录、病程记录、交叉核对、透后小结、处方明细、透析消毒等内容都将被删除。', function (index) {
                    layui.layer.close(index);
                    onRecordDelete(data.diaRecordId);
                });
            }
        }
    });
}

/**
 * 透析记录删除
 * @param diaRecordId
 */
function onRecordDelete(diaRecordId) {
    var param = {
        "diaRecordId": diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaRecord/delete.do",
        data: param,
        dataType: "json",
        done: function (data) {
            // 标记有删除过透析记录，父页面需刷新
            if (window.parent.setRefreshPageFlag) {
                window.parent.setRefreshPageFlag(true);
            }

            successToast("删除成功");
            layui.table.reload('diaHistoryList_table'); //重新刷新table
        }
    });
}

/**
 * 判断是否有删除过透析记录（给父页面调用）
 * @returns {boolean}
 */
function hasDeleteRecord() {
    return diaHistoryList.hasDeleteRecord;
}
