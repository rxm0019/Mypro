/**
 * tesArrangeList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 检验检查--化验整合
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/29
 */
var tesArrangeList = avalon.define({
    $id: "tesArrangeList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',
    sampleCode:'',//条码
    mechanism:'',//检验机构
    testMainId:'',//检查总类id
    applyId:'',//申请单id
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        if(isNotEmpty(id)){
            tesArrangeList.patientId = id;
        }else {
            warningToast("请选择患者");
            return false;
        }
        initSearch(); //初始化搜索框
        initTab();

        // $(".layui-fluid").on("click",function (){
        //     if( $(".layui-tab-title").hasClass("layui-tab-more")){
        //         setTimeout(function(){
        //             $(".layui-tab-title").addClass('layui-tab-more');
        //         }, 0);
        //     }
        // })

        avalon.scan();
    });
});

/**
 * 监听tab点击
 */
layui.use('element', function(){
    var element = layui.element;
    //监听Tab切换，以改变地址hash值
    element.on('tab(tabItems)', function(){
        if( $(".layui-tab-title").hasClass("layui-tab-more")) {
            setTimeout(function () {
                $(".layui-tab-title").addClass('layui-tab-more');
            }, 0);
        }

        var tabId = this.getAttribute('lay-id');   //获取选项卡的lay-id
        if (isNotEmpty(tabId)) {
            tesArrangeList.testMainId = tabId;
            getApplyTimeList();
        }
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
    form.val('tesArrangeList_search', {
        applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
        applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd")
    });
    //监听搜索
    form.on('submit(tesArrangeList_search_search)', function (data) {
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
        table.reload('tesApplyTime_table',{
            where:field
        });
    });
}

/**
 * 初始化页签（检查总项）
 */
function initTab(){
    var param={
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getTesMainList.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var html = '';
            $.each(data,function(index, item){
                if(index ==0){
                    tesArrangeList.testMainId = item.testMainId;
                    html += '<li class="layui-this" lay-id="'+ item.testMainId +'">'+ item.testName +'</li>'
                }else {
                    html += '<li lay-id="'+ item.testMainId +'">'+ item.testName +'</li>'
                }
            });
            $('#tabItems').html(html);
            form.render();
            if(isNotEmpty(tesArrangeList.testMainId)){
                getApplyTimeList();
            }
            $(window).resize();
        }
    });
}

/**
 * 获取检查总类的申请（整合)时间
 */
function getApplyTimeList() {
    //获取layui的table模块
    var table=layui.table;
    var util=layui.util;
    var date_end =  new Date();
    var date = new Date();
    var date_begin = date.setMonth(date.getMonth()-1);
    var param = {
        applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
        applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd"),
        patientId:tesArrangeList.patientId,
        testMainId:tesArrangeList.testMainId
    };
    _layuiTable({
        elem: '#tesApplyTime_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplyTime_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-100', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/testReport/getArrangeDateList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'applyDate', title: '申请日期',align:'center',templet: function(d){
                        return util.toDateString(d.applyDate,"yyyy-MM-dd HH:mm");
                    }}
            ]],
            done: function (res, curr, count) { //查询完成默认选择第一行数据
                $(".layui-table-view[lay-id='tesApplyTime_table'] .layui-table-body tr[data-index = '0' ]").click();
                if(res.bizData.length<=0){
                    getList();
                    tesArrangeList.applyId = null;
                }
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(tesApplyTime_table)', function(obj){
        var data = obj.data;
        if(data!=null){
            getList(data.applyId);
            tesArrangeList.applyId = data.applyId;
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

/**
 * 查询列表事件
 */
function getList(applyId) {
    var util=layui.util;
    var param = {
        patientId:tesArrangeList.patientId,
        testMainId:tesArrangeList.testMainId
    };
    if(isNotEmpty(applyId)){
        param.applyId = applyId;
    }

    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getArrangeList.do",
        dataType: "json",
        data:param,
        done:function(res){
            // 列表表头
            var columnList = [
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                // ,{field: 'examineItemsNo', title: '检查项编码',align:'center'}
                ,{field: 'examineItemsName', title: '检查项名称',align:'center'}
                ,{field: 'reportValue', title: '检验值',align:'center'}
                ,{field: 'reportSign', title: '检验结果',align:'center'}
                ,{field: 'units', title: '检验单位',align:'center'}
                ,{field: 'referencerange', title: '参考范围值',align:'center'}
            ];
            var listData = [];
            listData = res.data;
            var formulaMap = res.formulaMap;
            //获取配置公式
            var formula = {};
            try {
                formula = eval(res.formula);
            } catch (e) {
                console.error("公式格式错误：formula=" + res.formula, e);
            }
            if (listData.length > 0) {
                for(var i=0;i<listData.length;i++){
                    // 若配置项需公式计算，则根据中心设定的公式获取计算值
                    if (formula != null ) {
                        if(isNotEmpty(listData[i].reportValue)){
                            getFormulaData(listData[i],formulaMap,formula);
                        }
                    } else {
                        console.error("公式不存在或格式错误。");
                    }
                }
            }

            _layuiTable({
                elem: '#tesArrangeList_table', //必填，指定原始表格元素选择器（推荐id选择器）
                filter:'tesArrangeList_table', ////必填，指定的lay-filter的名字
                //执行渲染table配置
                render:{
                    height:'full-180', //table的高度，页面最大高度减去差值
                    data:listData,
                    page:false,
                    cols: [columnList]
                },
                //监听工具条事件
                tool:function(obj,filter){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                }
            });
        }
    });
}


/**
 * 检验项计算公式 返回结果
 * @param map
 * @param formula
 */
function getFormulaData(obj,formulaMap,formula){
    if (obj.examineItemsNo == "KTV") {
        var formulaData = {
            ureaB: Number(formulaMap.UREAB), // 透前尿素
            ureaA: Number(formulaMap.UREAA), // 透后尿素
            dialysisHours: Number(formulaMap.DialysisHours), // 透析时长
            actualDehydration: Number(formulaMap.ActualDehydration), // 实际脱水量
            weightA: Number(formulaMap.WeightA) // 透后体重
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getKtvValue === 'function') {
            relatedItemValue = formula.getKtvValue(formulaData);
        } else {
            console.error("公式（" + getKtvValue + "）不存在或格式错误。");
        }
        obj.reportValue = relatedItemValue;
    }
    if (obj.examineItemsNo == "URR") {
        var formulaData = {
            ureaB: Number(formulaMap.UREAB), // 透前尿素
            ureaA: Number(formulaMap.UREAA) // 透后尿素
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getUrrValue === 'function') {
            relatedItemValue = formula.getUrrValue(formulaData);
        } else {
            console.error("公式（" + getUrrValue + "）不存在或格式错误。");
        }
        obj.reportValue = relatedItemValue;
    }
    if (obj.examineItemsNo == "CaMultiplyP") {
        var formulaData = {
            alb: Number(formulaMap.ALB), // 白蛋白
            caB: Number(formulaMap.CaB), // 透前钙
            pB: Number(formulaMap.PB)    // 透前磷
        };
        // 获取显示项的值
        var relatedItemValue = -1;
        if (formula != null && typeof formula.getCaPValue === 'function') {
            relatedItemValue = formula.getCaPValue(formulaData);
        } else {
            console.error("公式（" + getCaPValue + "）不存在或格式错误。");
        }
        obj.reportValue = relatedItemValue;
    }
}

/**
 * 趋势图
 * @returns {boolean}
 */
function arrangeEchart() {
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('tesArrangeList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        var ids=[];
        $.each(data,function(i,item){
            ids.push(item.examineItemsNo);
        });
        var examineItemsNos = ids.toString();
        var title="检验报告趋势图";
        var applyDateBegin = $("input[name='applyDateBegin']").val();
        var applyDateEnd = $("input[name='applyDateEnd']").val();
        var url=$.config.server + "/examine/tesArrangeEchart?patientId="+tesArrangeList.patientId+"&applyDateBegin="+applyDateBegin
            +"&applyDateEnd="+applyDateEnd+"&examineItemsNos="+examineItemsNos;

        _layerOpen({
            openInParent: true,
            url:url,  //弹框自定义的url，会默认采取type=2
            width:1600, //弹框自定义的宽度，方法会自动判断是否超过宽度
            height:1200,  //弹框自定义的高度，方法会自动判断是否超过高度
            title:title, //弹框标题
            btn:[],
        });

    }
}