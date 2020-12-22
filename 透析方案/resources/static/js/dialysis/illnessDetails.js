/**
 * 医护交班
 * @author Care
 * @date 2020-10-10
 * @version 1.0
 */
var illnessDetails = avalon.define({
    $id: "illnessDetails",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    scheduleShift: '',//班次
    pathType: '',//并发症　　
    shiftDateLog: '',//交班日志日期
    shiftDateLogEnd:'',//交班日志结束日期
    examineItemsNos: [],//
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        //初始化表单元素,日期时间选择器
        /*var laydate = layui.laydate;
        laydate.render({
            elem: '#shiftDateLog'
            , type: 'date'
            , value: new Date()
        });*/
        illnessDetails.scheduleShift = GetQueryString("scheduleShift");  //接收变量
        illnessDetails.pathType = GetQueryString("pathType");  //接收变量
        illnessDetails.shiftDateLog = GetQueryString("shiftDateLog");  //接收变量
        illnessDetails.shiftDateLogEnd = GetQueryString("shiftDateLogEnd");  //接收变量
        if(illnessDetails.shiftDateLog=="" && illnessDetails.shiftDateLogEnd==""){
            //日期范围选择
            layui.laydate.render({
                elem: '#shiftDate'
                ,range: '~' //或 range: '~' 来自定义分割字符
                //,value: illnessDetails.shiftDateLog +" ~ "+ illnessDetails.shiftDateLogEnd
                ,done: function(value, date, endDate){
                    var startDateStr = date.year +"-"+ date.month+"-"+date.date
                    illnessDetails.shiftDateLog = layui.util.toDateString(startDateStr, "yyyy-MM-dd")
                    var endDateStr = endDate.year +"-"+ endDate.month+"-"+endDate.date
                    illnessDetails.shiftDateLogEnd = layui.util.toDateString(endDateStr, "yyyy-MM-dd")
                }
                /*,change: function(value, date, endDate){
                }*/
            });
        }else{
            //日期范围选择
            layui.laydate.render({
                elem: '#shiftDate'
                ,range: '~' //或 range: '~' 来自定义分割字符
                ,value: illnessDetails.shiftDateLog +" ~ "+ illnessDetails.shiftDateLogEnd
                ,done: function(value, date, endDate){
                    var startDateStr = date.year +"-"+ date.month+"-"+date.date
                    illnessDetails.shiftDateLog = layui.util.toDateString(startDateStr, "yyyy-MM-dd")
                    var endDateStr = endDate.year +"-"+ endDate.month+"-"+endDate.date
                    illnessDetails.shiftDateLogEnd = layui.util.toDateString(endDateStr, "yyyy-MM-dd")
                }
                /*,change: function(value, date, endDate){
                }*/
            });
        }

        getUnusualType()
        avalon.scan();
    });
});

/**
 * 全天
 */
function clickWholeDay(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    illnessDetails.scheduleShift = '';
    getUnusualType();
}

/**
 * 上午
 */
function clickAm(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    illnessDetails.scheduleShift = $.constant.Shift.AM;
    getUnusualType();
}

/**
 * 下午
 */
function clickPm(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    illnessDetails.scheduleShift = $.constant.Shift.PM;
    getUnusualType();
}

/**
 * 晚上
 */
function clickNight(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    illnessDetails.scheduleShift = $.constant.Shift.NIGHT;
    getUnusualType();
}

/**
 * 搜索按钮事件
 */
function searchOrder() {
    //illnessDetails.shiftDateLog = $('#shiftDateLog').val();
    getUnusualType();
}
function getUnusualType() {
    var dataDictList = getSysDictMap("UnusualType");
    var dataList = [];
    $.each(dataDictList, function (index, item) {
        dataList.push(item.value);
    });
    illnessDetails.examineItemsNos = dataList;
    var param = {
        "dialysisDate": illnessDetails.shiftDateLog,
        "dialysisDateEnd": illnessDetails.shiftDateLogEnd,
        "scheduleShift": illnessDetails.scheduleShift,
        "statisticsType": illnessDetails.pathType,
        "examineItemsNos": illnessDetails.examineItemsNos,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaStatistics/getDynamicColumn.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var columnList = [];
            columnList.push({
                field: "patientName", title: "姓名", width: 100, align: 'center'
            })
            $.each(data.statisticalDatas, function (index, item) {
                for (var key in item) {
                    if (isNotEmpty(item[key]) && key != "patientName") {
                        item[key] = "异常";
                    }
                }
            });
            $.each(illnessDetails.examineItemsNos, function (index, item) {
                $.each(data.statisticalDatas, function (index2, item2) {
                    
                    for (var key2 in item2) {
                        if (isEmpty(item2[item])) {
                            item2[item] = "-";
                        }
                    }
                });
            });

            $.each(illnessDetails.examineItemsNos, function (index, item) {
                columnList.push({
                    field: item, title: getSysDictName("UnusualType", item), width: 100, align: 'center'
                })
            })
            _layuiTable({
                elem: '#unusualList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'unusualList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: data.statisticalDatas,
                    cols: [columnList]
                },
            });
        }
    });
}


/**
 * 并发症导出excel
 */
function onExportExcel(){
    var param = {
        "dialysisDate": illnessDetails.shiftDateLog,
        "dialysisDateEnd": illnessDetails.shiftDateLogEnd,
        "scheduleShift": illnessDetails.scheduleShift,
        "statisticsType": illnessDetails.pathType,
        "examineItemsNos": illnessDetails.examineItemsNos,
    };
    var url = $.config.services.dialysis + "/diaStatistics/exportUnusualList.do";    //导导出通路类型 - 导管列表
    var title = "导出并发症列表.xlsx";
    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}









