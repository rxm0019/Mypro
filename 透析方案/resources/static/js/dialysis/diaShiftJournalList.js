/**
 * 交班记录查询的js文件
 * 重点:执行导出是把界面显示的数据直接传入后台，故当界面的字段改变后，导出程序也应做相应改变（特别是字段名的改变）
 * @author: Freya
 * @version: 1.0
 * @date: 2020/10/20
 */
var diaShiftJournalList = avalon.define({
    $id: "diaShiftJournalList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    shiftDate: new Date(),//交班日期
    sumCatheter: 0,//导管例
    sumPuncture: 0,//穿刺例
    dialuSum: 0,//透析人数
    outCount: 0,//转出人数
    inCount: 0,//转入人数
    lienCount:0,//留治人数
    deathCount: 0,//死亡人数
    machineFailureList: [],//透析器故障列表
    catheterList:[],//导管
    punctureList:[],//穿刺
    diaInstanceList:[],//透析例次
    unusualList:[],//并发症
    catheterOrpuncture:[],//导管或穿刺
    shiftJournalList:[],//交班日志
    sumTotalList:[],//患者情况统计
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        /*交班日志*/
        getHandoverLog();//获取统计信息
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#diaShiftJournalList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'diaShiftJournalList_search'  //指定的lay-filter
        ,conds:[
            {field: 'shiftDate', title: '查询日期：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件
            getHandoverLog();
        }
    });
}
/**
 * 查询列表事件
 */
function getMachineFailure(){
    var param = {
        createTime_begin:$("input[name='shiftDate_begin']").val(),
        createTime_end:$("input[name='shiftDate_end']").val(),
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaMachineFailure/list.do",
        data: param,
        dataType: "json",
        done: function (data) {
            diaShiftJournalList.machineFailureList = data;
            getMachineFailureList(diaShiftJournalList.machineFailureList);
        }
    });
}

/**
 * 查询透析器故障列表
 */
function getMachineFailureList(machineFailureList) {
    var param = {};
    //获取layui的table模块
    var table = layui.table;
    //获取layui的util模块
    var util = layui.util;
    _layuiTable({
        elem: '#diaMachineFailureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'diaMachineFailureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            data: machineFailureList,
            page: false,
            cols: [[ //表头
                {field: 'deviceName', title: '设备名称',align:'center'}
                , {field: 'deviceType',title: '设备类型',align:'center'
                    ,templet: function(d){
                        return getSysDictName("deviceType",d.deviceType);
                    }}
                , {field: 'deviceNo',title: '机号',align:'center'}
                , {field: 'occurrenceStage',title: '故障发生阶段',align:'center'}
                , {field: 'faultTips',title: '故障提示信息及代码',align:'left'}
                , {field: 'faultDescribe', title: '故障描述',align:'left'}
                , {field: 'troubleshooting', title: '故障是否排除',align:'center'}
                , {fixed: 'right', title: '操作',  align: 'center'
                    , toolbar: '#diaMachineFailureList_bar'}
            ]]
        },
        //监听工具条事件
        tool: function (obj, filter) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === 'delete') { //删除
                layer.confirm('确定删除所选记录吗？', function (index) {
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.machineFailureId)){
                        var ids=[];
                        ids.push(data.machineFailureId);
                        del(ids,obj);
                    }
                });
            }
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids,obj){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/diaMachineFailure/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功");
            var index = obj.tr.index();//行下标
            diaShiftJournalList.machineFailureList.splice(index,1);
            var table=layui.table;
            table.reload("diaMachineFailureList_table",{
                data:diaShiftJournalList.machineFailureList  // 将新数据重新载入表格
            })
        }
    });
}

/**
 * 统计交班信息
 */
function getHandoverLog() {
    diaShiftJournalList.dialuSum = 0;
    diaShiftJournalList.outCount = 0;
    diaShiftJournalList.inCount = 0;
    diaShiftJournalList.deathCount = 0;
    diaShiftJournalList.lienCount = 0;
    diaShiftJournalList.catheterList = [];
    diaShiftJournalList.punctureList = [];
    diaShiftJournalList.sumTotalList = [];
    diaShiftJournalList.catheterOrpuncture = [];
    var param = {
        shiftDate_begin:$("input[name='shiftDate_begin']").val(),
        shiftDate_end:$("input[name='shiftDate_end']").val(),
    };
    _ajax({
        type: "POST",
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        url: $.config.services.dialysis + "/diaShiftJournal/getInfoList.do",
        data: param,
        dataType: "json",
        done: function (data) {
            var dialyList = [];//透析人数
            if (isNotEmpty(data.diaStatisticsLists) && data.diaStatisticsLists.length > 0) {
                var catheterList = [];//导管
                var punctureList = [];//穿刺
                var diaInstanceList = [];//透析例次
                var unusualList = [];//并发症
                var catheterOrpuncture = [];//导管或穿刺
                var deathLIst = [];//死亡记录
                var outInList = [];//转归记录
                
                $.each(data.diaStatisticsLists, function (index, item) {
                    if (isNotEmpty(item) && item.statisticsType == "Dialysis") {//透析患者
                        dialyList.push(item.patientId);
                    }else if (isNotEmpty(item) && item.statisticsType == "CatheterAssess") {//血管通路-导管
                        catheterList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "PunctureAssess") {//血管通路-穿刺
                        punctureList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "DialysisCases") {//透析方式例次
                        diaInstanceList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "Unusual") {//并发症统计
                        unusualList.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "VascularCases") {//导管/穿刺
                        catheterOrpuncture.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "Death") {//死亡记录
                        deathLIst.push(item);
                    } else if (isNotEmpty(item) && item.statisticsType == "OutIn") {//转归记录
                        outInList.push(item);
                    }
                });
                diaShiftJournalList.dialuSum = data.shiftoverStatistics.patientDialysis;
                diaShiftJournalList.outCount = data.shiftoverStatistics.patientOut;
                diaShiftJournalList.inCount = data.shiftoverStatistics.patientIn;
                diaShiftJournalList.deathCount = data.shiftoverStatistics.patientDeath;
                diaShiftJournalList.lienCount = data.shiftoverStatistics.patientRuji;
                diaShiftJournalList.sumTotalList.push({
                    dialuSum:diaShiftJournalList.dialuSum,
                    outCount:diaShiftJournalList.outCount,
                    inCount:diaShiftJournalList.inCount,
                    deathCount:diaShiftJournalList.deathCount,
                    lienCount:diaShiftJournalList.lienCount
                });

                getCatheterList(catheterList);
                getPunctureList(punctureList);
                getItemlList(diaInstanceList,"DialysisCases");
                getItemlList(unusualList,"Unusual");
                getCatheterOrpuncture(catheterOrpuncture);
            }
            //交班日志
            getshiftJournalList(data.shiftJournalList);
            diaShiftJournalList.shiftJournalList = data.shiftJournalList;
            //透析机故障列表
            getMachineFailure();
        }
    });
}
/**
 * 数组去除重复
 */
function unique(headerList) {
    return Array.from(new Set(headerList))
}
/**
 * 导管
 * @param catheterList
 */
function getCatheterList(catheterList) {
    var catheterType = "导管";
    var skinTotal = 0;
    var secretionTotal = 0;
    var feverTotal = 0;
    var dropTotal = 0;
    var arterySideTotal = 0;
    var veinSideTotal = 0;
    var catheterTotal = catheterList.length;
    var columnList = [];
    $.each(catheterList, function (index, item) {
        if (isNotEmpty(item) && item.statisticsSubType == "skin") {
            skinTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "secretion") {
            secretionTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "fever") {
            feverTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "drop") {
            dropTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "arterySide") {
            arterySideTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "veinSide") {
            veinSideTotal++;
        }
    });
    var dataArr = [];
    var dataObj = {
        catheterType: catheterType,
        skinTotal: skinTotal,
        secretionTotal: secretionTotal,
        feverTotal: feverTotal,
        dropTotal: dropTotal,
        arterySideTotal: arterySideTotal,
        veinSideTotal: veinSideTotal,
        catheterTotal: catheterTotal
    }
    dataArr.push(dataObj);
    diaShiftJournalList.catheterList.push(dataObj);
    columnList.push({field: 'catheterType', title: "通路类型",align: 'center'});
    columnList.push({field: 'skinTotal', title: "皮肤周围",align: 'center'});
    columnList.push({field: 'secretionTotal', title: "分泌物",align: 'center'});
    columnList.push({field: 'feverTotal', title: "发烧",align: 'center'});
    columnList.push({field: 'dropTotal', title: "导管脱出", align: 'center'});
    columnList.push({field: 'arterySideTotal', title: "动脉端",align: 'center'});
    columnList.push({field: 'veinSideTotal', title: "静脉端",align: 'center'});
    columnList.push({
        field: 'catheterTotal', title: "总计",align: 'center', templet: function (d) {
            return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(0)">' + d.catheterTotal + '</a>';
        }
    });
    _layuiTable({
        elem: '#catheterList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'catheterList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: dataArr,
            cols: [columnList]
        },
    });

}

/**
 * 穿刺
 * @param punctureList
 */
function getPunctureList(punctureList) {
    var punctureType = "穿刺";
    var skinTotal = 0;
    var swellingTotal = 0;
    var oozingBloodTotal = 0;
    var tremorTotal = 0;
    var noiseTotal = 0;
    var avTotal = 0;
    var punctureTotal = punctureList.length;
    var columnList = [];
    $.each(punctureList, function (index, item) {
        if (isNotEmpty(item) && item.statisticsSubType == "skin") {
            skinTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "swelling") {
            swellingTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "oozingBlood") {
            oozingBloodTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "tremor") {
            tremorTotal++;
        } else if (isNotEmpty(item) && item.statisticsSubType == "noise") {
            noiseTotal++;
        } else if (isNotEmpty(item) && (item.statisticsSubType == "arteryTimes" || item.statisticsSubType == "veinTimes")) {//vrteryTimes
            avTotal++;
        }
    });
    var dataArr = [];
    var dataObj = {
        punctureType: punctureType,
        skinTotal: skinTotal,
        swellingTotal: swellingTotal,
        oozingBloodTotal: oozingBloodTotal,
        tremorTotal: tremorTotal,
        noiseTotal: noiseTotal,
        avTotal: avTotal,
        punctureTotal: punctureTotal
    }
    dataArr.push(dataObj);
    diaShiftJournalList.punctureList.push(dataObj);
    columnList.push({field: 'punctureType', title: "通路类型",align: 'center'});
    columnList.push({field: 'skinTotal', title: "皮肤周围",align: 'center'});
    columnList.push({field: 'swellingTotal', title: "红肿",align: 'center'});
    columnList.push({field: 'oozingBloodTotal', title: "渗血",align: 'center'});
    columnList.push({field: 'tremorTotal', title: "震颤",align: 'center'});
    columnList.push({field: 'noiseTotal', title: "杂音", align: 'center'});
    columnList.push({field: 'avTotal', title: "穿刺次数",align: 'center'});
    columnList.push({
        field: 'punctureTotal', title: "总计", align: 'center', templet: function (d) {
            return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(1)">' + d.punctureTotal + '</a>';
        }
    });
    _layuiTable({
        elem: '#punctureList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter: 'punctureList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render: {
            page: false,
            data: dataArr,
            cols: [columnList]
        },
    });

}

/**
 * 跳转
 */
function openSoliPeonNum(code) {
    var shiftDate_begin = $("input[name='shiftDate_begin']").val();
    var shiftDate_end = $("input[name='shiftDate_end']").val();
    if(shiftDate_begin == ""){
        shiftDate_begin = layui.util.toDateString(new Date(), "yyyy-MM-dd")
    }
    if(shiftDate_end == ""){
        shiftDate_end = layui.util.toDateString(new Date(), "yyyy-MM-dd")
    }
    var url = "";
    var title = "";
    var pathType = "";
    if (code == 0) {
        pathType = "CatheterAssess";
    }
    if (code == 1) {
        pathType = "PunctureAssess";
    }
    if (code == 2) {
        pathType = "Unusual";
        title = "并发症明细";
        /*var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭*/
        url = $.config.server + "/dialysis/illnessDetails?pathType=" + pathType + "&shiftDateLog="+shiftDate_begin +"&scheduleShift=&shiftDateLogEnd="+shiftDate_end+"";
    } else {
        title = "通路类型明细";
        /*var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭*/
        url = $.config.server + "/dialysis/pathTypeEdit?pathType=" + pathType + "&shiftDateLog="+shiftDate_begin +"&scheduleShift=&shiftDateLogEnd="+shiftDate_end+"";
    }

    top.layui.index.openTabsPage(url, title)//这里要注意的是parent的层级关系
}

/**
 * 并发症与透析例次
 * @param itemList
 */
function getItemlList(itemList,type) {
    var list = [];
    //获取字典数据
    if(type == "Unusual"){
        list = getSysDictByCode("UnusualType",true);//并发症
    }else{
        list = getSysDictByCode("DialysisMode",true);//透析方式
    }
    var objList = [];
    $.each(list, function (index, objItem) {
        if(isNotEmpty(objItem.value)){
            var obj = {
                key: objItem.value,
                name: objItem.name,
                count: 0
            }
            objList.push(obj);
        }
    });
    if (isNotEmpty(itemList) && itemList.length > 0) {
        //根据统计子类型计算数据笔数
        $.each(itemList, function (index, item) {
            $.each(objList, function (index2, item2) {
                if (item.statisticsSubType == item2.key) {
                    item2.count++;
                }
            })
        });
        //数据封装
        var dataList = [];
        var obj = {};
        var sumCount = 0;
        $.each(objList, function (index2, item2) {
            var key = item2.key;
            var value = item2.count;
            sumCount += item2.count
            obj[key] = value;
        });
        dataList.push(obj);
        if(type == "Unusual"){
            diaShiftJournalList.unusualList=objList;//并发症
            diaShiftJournalList.unusualList.push({
                key: 'sumCount',
                name: '总计',
                count: sumCount
            });
        }else{
            diaShiftJournalList.diaInstanceList=objList;//透析例次
            diaShiftJournalList.diaInstanceList.push({
                key: 'sumCount',
                name: '总计',
                count: sumCount
            });
        }
        //table数据显示
        var columnList = [];
        $.each(objList, function (index, item) {
            if(item.key !='sumCount'){
                columnList.push({field: item.key, title: item.name,minWidth: 150,align: 'center'});
            }
        });
        columnList.push({

            field: "", title: "总计", width: 100, align: 'center', templet: function (d) {
                if(type == "Unusual") {
                    return '<a style="color: dodgerblue;cursor:pointer;" onclick="openSoliPeonNum(2)">' + sumCount + '</a>';
                }else{
                    return '<a>' + sumCount + '</a>';
                }
            }
        });
        if(type == "Unusual"){
            _layuiTable({
                elem: '#complicaList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'complicaList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: dataList,
                    cols: [columnList]
                },
            });
        }else{
            _layuiTable({
                elem: '#dialysisRoutineList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter: 'dialysisRoutineList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render: {
                    page: false,
                    data: dataList,
                    cols: [columnList]
                },
            });
        }
    }
}

/**
 * 导管或穿刺例次
 * @param catheterOrpuncture
 */
function getCatheterOrpuncture(catheterOrpuncture) {
    diaShiftJournalList.sumCatheter = 0;
    diaShiftJournalList.sumPuncture = 0;
    if (isNotEmpty(catheterOrpuncture) && catheterOrpuncture.length > 0) {
        var sumCatheter = 0;
        var sumPuncture = 0;
        $.each(catheterOrpuncture, function (index, item) {
            if (isNotEmpty(item) && item.statisticsSubType == "0") {
                sumCatheter++;
            } else if (isNotEmpty(item) && item.statisticsSubType == "1") {
                sumPuncture++;
            }
        });
        diaShiftJournalList.sumCatheter = sumCatheter;
        diaShiftJournalList.sumPuncture = sumPuncture;
        diaShiftJournalList.catheterOrpuncture.push({
            sumCatheter:sumCatheter,
            sumPuncture:sumPuncture
        });
    }
}

/**
 * 备注列表
 */
function getshiftJournalList(shiftJournalList) {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#diaShiftJournalList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaShiftJournalList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full', //table的高度，页面最大高度减去差值
            data:shiftJournalList,
            page:false,
            limit: Number.MAX_VALUE, // 数据表格默认全部显示
            cols: [[ //表头
                {field: 'shiftDate', title: '交班日期',align:'center'
                ,templet: function(d){
                    return d.shiftDate == null ? '' : util.toDateString(d.shiftDate,"yyyy-MM-dd");
                }}
                ,{field: 'shiftSchedule', title: '交班类型',align:'center'
                    ,templet: function(d){
                        return getSysDictName("Shift",d.shiftSchedule);
                    }}
                ,{field: 'remarks', title: '备注',align:'left'}
            ]]
        }
    });
}

/**
 * 导出excel
 */
function exportExcel() {
    _downloadFile({
        url: $.config.services.dialysis + "/diaShiftJournal/export.do",
        data:getSearchParam(), //此设置后台可接受复杂参数
        fileName: '交班日志列表.xlsx'
    });
}

/**
 * 获取搜索参数
 * @returns {jQuery}
 */
function getSearchParam() {
    var util=layui.util;
    $.each(diaShiftJournalList.shiftJournalList, function (index, item) {
        if (isEmpty(item.shiftDate)) {
            item.shiftDate = '';
        } else {
            item.shiftDate = util.toDateString(item.shiftDate,"yyyy-MM-dd");
        }
    });
    var searchParam = {
        sumTotalListStr:JSON.stringify(diaShiftJournalList.sumTotalList),
        catheterListStr:JSON.stringify(diaShiftJournalList.catheterList),
        punctureListStr:JSON.stringify(diaShiftJournalList.punctureList),
        machineFailureListStr:JSON.stringify(diaShiftJournalList.machineFailureList),
        diaInstanceListStr:JSON.stringify(diaShiftJournalList.diaInstanceList),
        unusualListStr:JSON.stringify(diaShiftJournalList.unusualList),
        catheterOrpunctureStr:JSON.stringify(diaShiftJournalList.catheterOrpuncture),
        shiftJournalListStr:JSON.stringify(diaShiftJournalList.shiftJournalList),
    };
    return $.extend({
        catheterListStr: '',
        punctureListStr: '',
        diaInstanceListStr: '',
        unusualListStr: '',
        catheterOrpunctureStr: '',
        sumTotalListStr: '',
        machineFailureListStr:'',
        shiftJournalListStr:'',
    }, searchParam);
}

