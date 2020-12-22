/**
 * testItemReportList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 检验检查--检验报告趋势图
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/05
 */
var tesArrangeEchart = avalon.define({
    $id: "tesArrangeEchart",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',
    applyDateBegin:'',
    applyDateEnd:'',
    examineItemsList:[],//检验项
    examineItemsNos:[],//检验项id

});
layui.use(['index','formSelects'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        var applyDateBegin = GetQueryString("applyDateBegin");  //接收变量
        var applyDateEnd = GetQueryString("applyDateEnd");  //接收变量
        var examineItemsNos = GetQueryString("examineItemsNos");  //接收变量
        if(isNotEmpty(applyDateBegin) && isNotEmpty(applyDateEnd)){
            tesArrangeEchart.applyDateBegin = applyDateBegin;
            tesArrangeEchart.applyDateEnd = applyDateEnd;
        }
        if(isNotEmpty(id)){
            tesArrangeEchart.patientId = id;
        }else {
            warningToast("请选择患者");
            return false;
        }
        if(isNotEmpty(examineItemsNos)){
            var ids = examineItemsNos.split(",");
            for(var j=0;j<ids.length;j++){
                tesArrangeEchart.examineItemsNos.push(ids[j]);
            }
            getEchartList();
        }
        initSearch(); //初始化搜索框
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    var laydate = layui.laydate;
    var form=layui.form;
    var util=layui.util;
    laydate.render({
        elem: '#applyDateBegin'
        , type: 'date'
    });
    laydate.render({
        elem: '#applyDateEnd'
        , type: 'date'
    });
    //刷新表单
    form.render();
    //表单初始赋值
    var date_end =  new Date();
    var date = new Date();
    var date_begin = date.setMonth(date.getMonth()-1);
    if(isEmpty(tesArrangeEchart.applyDateBegin)){
        form.val('tesArrangeEchart_search', {
            applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
            applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd")
        });
    }else {
        form.val('tesArrangeEchart_search', {
            applyDateBegin:tesArrangeEchart.applyDateBegin,
            applyDateEnd:tesArrangeEchart.applyDateEnd
        });
    }

    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getBacExamineItemsList.do",
        data:{},  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            var formSelects=layui.formSelects; //调用layui的form模块
            tesArrangeEchart.examineItemsList.pushArray(data);
            formSelects.btns('examineItemsNo',['remove']);
            formSelects.data('examineItemsNo', 'local', {
                arr:tesArrangeEchart.examineItemsList
            });
            if(tesArrangeEchart.examineItemsNos.length>0){
                layui.formSelects.value('examineItemsNo',tesArrangeEchart.examineItemsNos); //下拉框赋值
            }
            form.val('tesArrangeEchart_search', {
                examineItemsNo:tesArrangeEchart.examineItemsNos.toString()
            });
        }
    });

    //监听搜索
    form.on('submit(tesArrangeEchart_search_search)', function (data) {
        var field = data.field;
        //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
        getEchartList(field);
    });
}

/**
 * 趋势图数据
 */
function getEchartList(param) {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    if(param == null){
        if(isNotEmpty(tesArrangeEchart.applyDateBegin) && isNotEmpty(tesArrangeEchart.applyDateBegin)){
            param = {
                applyDateBegin:tesArrangeEchart.applyDateBegin,
                applyDateEnd:tesArrangeEchart.applyDateEnd
            };
        }else {
            var date_end =  new Date();
            var date = new Date();
            var date_begin = date.setMonth(date.getMonth()-1);
            param = {
                applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
                applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd"),
            };
        }

        if(tesArrangeEchart.examineItemsNos.length>0){
            param.examineItemsNo = tesArrangeEchart.examineItemsNos.toString();
        }
    }
    param.patientId = tesArrangeEchart.patientId;

    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getEchartList.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(res){
            var strHtml = "";
            var data = res.data;
            var formulaMap = res.formulaMap;
            //获取配置公式
            var formula = {};
            try {
                formula = eval(res.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + res.formula, e);
            }

            for(var i=0;i<data.length;i++){
                strHtml += '<div style="height:300px;margin: 10px;padding: 10px;border: 1px solid rgb(204, 204, 204);border-radius: 7px;"' +
                    'id=echart' + i + '></div>'
            }
            $("#echarts").html(strHtml);

            for(var i=0;i<data.length;i++){
                var map = data[i];
                var id = "echart" + i;
                var myechart = echarts.init(document.getElementById(id));

                // 若配置项需公式计算，则根据中心设定的公式获取计算值
                if (formula != null) {
                    getFormulaData(map,formulaMap,formula);
                } else {
                    console.error("公式不存在或格式错误。");
                }

                var xAxis = map.xAxis;
                var series = map.series;
                var pieces = [];
                var markLine = [];
                if(map.lte >0){
                    var obj1 = {
                        lte: map.gt,
                        color: 'rgb(255, 184, 0)'
                    };
                    var obj2 =  {
                        gt: map.gt,
                        lte: map.lte,
                        color: 'rgb(118, 192, 187)'
                    };
                    var obj3 =  {
                        gt: map.lte,
                        color: 'rgb(251, 123, 123)'
                    };
                    pieces.push(obj1);
                    pieces.push(obj2);
                    pieces.push(obj3);

                    var obj4 =  {
                        yAxis: map.gt
                    };
                    var obj5 =  {
                        yAxis: map.lte
                    };
                    markLine.push(obj4);
                    markLine.push(obj5);
                }
                var visualMap = null;
                if(pieces.length>0){
                    visualMap = {
                        top: 10,
                        right: -10,
                        pieces: pieces,
                        outOfRange: {
                            color: '#EFEFEF'
                        }
                    }
                }
                myechart.setOption({
                    title: {
                        text: map.title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} ' + map.type
                        },
                        axisLine: {onZero: false}
                    },
                    // dataZoom: [{},
                    //     {
                    //         type: 'inside'
                    //     }],
                    visualMap: visualMap,
                    series: {
                        name: map.title,
                        type: 'line',
                        data: series,
                        markLine: {
                            silent: true,
                            data: markLine
                        }
                    }
                });

                resize(id,myechart);

            }
        }
    });
}

/**
 * 图表自适应
 * @param id
 * @param myechart
 */
function resize(id,myechart){
    // 盒子大小改变时，重设图表大小
    $(document.getElementById(id)).resize(function () {
        myechart.resize();
    });
}
/**
 * 检验项计算公式 返回结果
 * @param map
 * @param formula
 */
function getFormulaData(map,formulaMap,formula){
    var examineItemsNo = map.examineItemsNo;
    var xAxis = [];
    var series = [];
    //KTV检验项 计算
    if(isNotEmpty(examineItemsNo) &&  examineItemsNo == "KTV"){
        var ureaB = formulaMap.UREAB;
        var ureaA = formulaMap.UREAA;
        var dialysisHours = formulaMap.DialysisHours;
        var actualDehydration = formulaMap.ActualDehydration;
        var weightA = formulaMap.WeightA;

        //对象属性排序
        var arr=[];
        for(var key in ureaB){
            arr.push(key)
        }
        arr = arr.sort()
        var newData={}
        for(var i in arr){
            var itemKey = arr[i]
            newData[itemKey] = ureaB[itemKey]
        }

        //通过透前尿素来判断KTV的值
        for(var key in newData){
            var formulaData = {
                ureaB: ureaB[key], // 透前尿素
                ureaA: ureaA[key], // 透后尿素
                dialysisHours: dialysisHours[key], // 透析时长
                actualDehydration: actualDehydration[key], // 实际脱水量
                weightA: weightA[key] // 透后体重
            };
            xAxis.push(key);
            // 获取显示项的值
            var relatedItemValue = -1;
            if (formula != null && typeof formula.getKtvValue === 'function') {
                relatedItemValue = formula.getKtvValue(formulaData);
            } else {
                console.error("公式（" + getKtvValue + "）不存在或格式错误。");
            }
            series.push(relatedItemValue);
        }
        map.xAxis = xAxis;
        map.series = series;
    }

    //URR检验项 计算
    if(isNotEmpty(examineItemsNo) &&  examineItemsNo == "URR"){
        var ureaB = formulaMap.UREAB;
        var ureaA = formulaMap.UREAA;

        //对象属性排序
        var arr=[];
        for(var key in ureaB){
            arr.push(key)
        }
        arr = arr.sort()
        var newData={}
        for(var i in arr){
            var itemKey = arr[i]
            newData[itemKey] = ureaB[itemKey]
        }

        //通过透前尿素来判断KTV的值
        for(var key in newData){
            var formulaData = {
                ureaB: ureaB[key], // 透前尿素
                ureaA: ureaA[key] // 透后尿素
            };
            xAxis.push(key);
            // 获取显示项的值
            var relatedItemValue = -1;
            if (formula != null && typeof formula.getUrrValue === 'function') {
                relatedItemValue = formula.getUrrValue(formulaData);
            } else {
                console.error("公式（" + getUrrValue + "）不存在或格式错误。");
            }
            series.push(relatedItemValue);
        }
        map.xAxis = xAxis;
        map.series = series;
    }

    //CaMultiplyP 钙磷乘积检验项 计算
    if(isNotEmpty(examineItemsNo) &&  examineItemsNo == "CaMultiplyP"){
        var alb = formulaMap.ALB;
        var caB = formulaMap.CaB;
        var pB = formulaMap.PB;

        //对象属性排序
        var arr=[];
        for(var key in alb){
            arr.push(key)
        }
        arr = arr.sort()
        var newData={}
        for(var i in arr){
            var itemKey = arr[i]
            newData[itemKey] = alb[itemKey]
        }

        //通过透前尿素来判断KTV的值
        for(var key in newData){
            var formulaData = {
                alb: alb[key], // 白蛋白
                caB: caB[key], // 透前钙
                pB: pB[key]    // 透前磷
            };
            xAxis.push(key);
            // 获取显示项的值
            var relatedItemValue = -1;
            if (formula != null && typeof formula.getCaPValue === 'function') {
                relatedItemValue = formula.getCaPValue(formulaData);
            } else {
                console.error("公式（" + getCaPValue + "）不存在或格式错误。");
            }
            series.push(relatedItemValue);
        }
        map.xAxis = xAxis;
        map.series = series;
    }
}