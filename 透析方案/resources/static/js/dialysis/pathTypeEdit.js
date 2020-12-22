/**
 * 医护交班
 * @author Care
 * @date 2020-10-10
 * @version 1.0
 */
var pathTypeEdit = avalon.define({
    $id: "pathTypeEdit",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    scheduleShift: '',//班次
    pathType: '',//通路类型　　0-导管　　1-代表穿刺
    shiftDateLog: '',//交班日志日期
    shiftDateLogEnd:'',//交班日志结束日期
    pathTypeShow: true,//导管或穿刺ｔａｂｌｅ显示
});

layui.use(['index'], function () {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        debugger
        pathTypeEdit.scheduleShift = GetQueryString("scheduleShift");  //接收变量
        pathTypeEdit.pathType = GetQueryString("pathType");  //接收变量
        pathTypeEdit.shiftDateLog = GetQueryString("shiftDateLog");  //接收变量
        pathTypeEdit.shiftDateLogEnd = GetQueryString("shiftDateLogEnd");  //接收变量
        if(pathTypeEdit.shiftDateLog == "" && pathTypeEdit.shiftDateLogEnd == ""){
            //日期范围选择
            layui.laydate.render({
                elem: '#shiftDate'
                ,range: '~' //或 range: '~' 来自定义分割字符
                //,value: pathTypeEdit.shiftDateLog +" ~ "+ pathTypeEdit.shiftDateLogEnd
                ,done: function(value, date, endDate){
                    var startDateStr = date.year +"-"+ date.month+"-"+date.date
                    pathTypeEdit.shiftDateLog = layui.util.toDateString(startDateStr, "yyyy-MM-dd")
                    var endDateStr = endDate.year +"-"+ endDate.month+"-"+endDate.date
                    pathTypeEdit.shiftDateLogEnd = layui.util.toDateString(endDateStr, "yyyy-MM-dd")
                }
                /*,change: function(value, date, endDate){
                }*/
            });
        }else{
            //日期范围选择
            layui.laydate.render({
                elem: '#shiftDate'
                ,range: '~' //或 range: '~' 来自定义分割字符
                ,value: pathTypeEdit.shiftDateLog +" ~ "+ pathTypeEdit.shiftDateLogEnd
                ,done: function(value, date, endDate){
                    var startDateStr = date.year +"-"+ date.month+"-"+date.date
                    pathTypeEdit.shiftDateLog = layui.util.toDateString(startDateStr, "yyyy-MM-dd")
                    var endDateStr = endDate.year +"-"+ endDate.month+"-"+endDate.date
                    pathTypeEdit.shiftDateLogEnd = layui.util.toDateString(endDateStr, "yyyy-MM-dd")
                }
                /*,change: function(value, date, endDate){
                }*/
            });
        }


        queryMode();
        pathTypeEdit.pathType === "CatheterAssess" ? $("input[value=CatheterAssess]+div").click() : $("input[value=PunctureAssess]+div").click();
        avalon.scan();
    });
});

function queryMode() {
    var form = layui.form;
    form.on('radio(pathType)', function (data) {
        pathTypeEdit.pathType = data.value;//被点击的radio的value值
        if(pathTypeEdit.pathType === "CatheterAssess"){
            pathTypeEdit.pathTypeShow = true;
            getCatheterType()
        }else if (pathTypeEdit.pathType === "PunctureAssess"){
            pathTypeEdit.pathTypeShow = false;
            getPunctureType()
        }
    })
}
/**
 * 全天
 */
function clickWholeDay(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    pathTypeEdit.scheduleShift = '';
    if(pathTypeEdit.pathType === "CatheterAssess"){
        getCatheterType();
    }else if(pathTypeEdit.pathType === "PunctureAssess"){
        getPunctureType();
    }
}

/**
 * 上午
 */
function clickAm(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    pathTypeEdit.scheduleShift = $.constant.Shift.AM;
    if(pathTypeEdit.pathType === "CatheterAssess"){
        getCatheterType();
    }else if(pathTypeEdit.pathType === "PunctureAssess"){
        getPunctureType();
    }
}

/**
 * 下午
 */
function clickPm(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    pathTypeEdit.scheduleShift = $.constant.Shift.PM;
    if(pathTypeEdit.pathType === "CatheterAssess"){
        getCatheterType();
    }else if(pathTypeEdit.pathType === "PunctureAssess"){
        getPunctureType();
    }
}

/**
 * 晚上
 */
function clickNight(obj) {
    $(obj).parent().find('.tab-style').removeClass('tab-click');
    $(obj).addClass('tab-click');
    pathTypeEdit.scheduleShift = $.constant.Shift.NIGHT;
    if(pathTypeEdit.pathType === "CatheterAssess"){
        getCatheterType();
    }else if(pathTypeEdit.pathType === "PunctureAssess"){
        getPunctureType();
    }
}

/**
 * 搜索按钮事件
 */
function searchOrder() {
    //pathTypeEdit.shiftDateLog = $('#shiftDateLog').val();
    if(pathTypeEdit.pathType === "CatheterAssess"){
        getCatheterType();
    }else if(pathTypeEdit.pathType === "PunctureAssess"){
        getPunctureType();
    }
}

/**
 * 导管
 */
function getCatheterType() {
    var param = {
        scheduleShift: pathTypeEdit.scheduleShift,
        dialysisDate: pathTypeEdit.shiftDateLog,
        dialysisDateEnd:pathTypeEdit.shiftDateLogEnd,
        statisticsType: pathTypeEdit.pathType,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaStatistics/getPathType.do",
        data: param,
        dataType: "json",
        done: function (data) {
            _layuiTable({
                elem: '#catheterList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'catheterList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: data.unusualList, //接口的参数。如：where: {token: 'sasasas', id: 123}
                    cols: [[
                        {
                            field: 'patientName', title: '姓名', width: 210, align: 'center'

                        }
                        , {
                            field: 'skin', title: '皮肤周围', width: 210, align: 'center', templet: function (d) {
                                var a = d.statisticSubTypeAll.indexOf("skin")
                                if (d.statisticSubTypeAll.indexOf("skin") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'secretion', title: '分泌物', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("secretion") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'fever', title: '发烧', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("fever") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'drop', title: '导管脱出', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("drop") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'arterySide', title: '动脉端', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("arterySide") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'veinSide', title: '静脉端', width: 210, align: 'center', templet: function (d) {
                                if (d.statisticSubTypeAll.indexOf("veinSide") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }

                    ]]
                },
            })
        }
    })
}

/**
 * 穿刺
 */
function getPunctureType() {
    var param = {
        scheduleShift: pathTypeEdit.scheduleShift,
        dialysisDate: pathTypeEdit.shiftDateLog,
        dialysisDateEnd:pathTypeEdit.shiftDateLogEnd,
        statisticsType: pathTypeEdit.pathType,
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaStatistics/getPathType.do",
        data: param,
        dataType: "json",
        done: function (data) {
            _layuiTable({
                elem: '#punctureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'punctureList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: data.unusualList, //接口的参数。如：where: {token: 'sasasas', id: 123}
                    cols: [[
                        {
                            field: 'patientName', title: '姓名', width: 210, align: 'center'

                        }
                        , {
                            field: 'skin', title: '皮肤周围', width: 210, align: 'center', templet: function (d) {
                                var a = d.statisticSubTypeAll.indexOf("skin")
                                if (d.statisticSubTypeAll.indexOf("skin") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'swelling', title: '红肿', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("swelling") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'oozingBlood', title: '渗血', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("oozingBlood") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'tremor', title: '震颤', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("tremor") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'noise', title: '杂音', width: 210, align: 'center', templet: function (d) {

                                if (d.statisticSubTypeAll.indexOf("noise") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }
                        , {
                            field: 'arteryTimes', title: '穿刺次数', width: 210, align: 'center', templet: function (d) {
                                if (d.statisticSubTypeAll.indexOf("arteryTimes") === -1 || d.statisticSubTypeAll.indexOf("veinTimes") === -1) {
                                    return "-";
                                } else {
                                    return "异常"
                                }
                            }

                        }

                    ]]
                },
            })
        }
    })
}

/**
 * 导管或穿刺导出excel
 */
function onExportExcel(){
    var param = {
        scheduleShift: pathTypeEdit.scheduleShift,
        dialysisDate: pathTypeEdit.shiftDateLog,
        dialysisDateEnd:pathTypeEdit.shiftDateLogEnd,
        statisticsType: pathTypeEdit.pathType,
    };

    var url = $.config.services.dialysis + "/diaStatistics/exportCatheterList.do";    //导导出通路类型 - 导管列表
    var title = "导出通路类型 - 导管列表.xlsx";
    if(pathTypeEdit.pathType === "PunctureAssess"){
        var url = $.config.services.dialysis + "/diaStatistics/exportPunctureList.do";    //导出通路类型 - 穿刺列表
        var title = "导出通路类型 - 穿刺列表.xlsx";
    }
    _downloadFile({
        url: url,
        data: param,
        fileName: title
    });
}











