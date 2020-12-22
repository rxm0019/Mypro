/**
 * dialysisReady.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 透析管理--透前准备
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/3
 */
var dialysisReady = avalon.define({
    $id: "dialysisReady",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    serviceType:"0",
    orderBy:'',//排序
});
layui.use(['index','formSelects'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getDialysisPatient();
        avalon.scan();

        //监听tab切换
        element = layui.element;
        element.on('tab(readyTab)', function(data){
            if(data.index == 0){
                //上机准备
                dialysisReady.serviceType = "0";
                //查询
                getDialysisPatient();
                dialysisReady.orderBy = "";
            }
            if(data.index == 1){
                //耗材准备
                dialysisReady.serviceType = "1";
                getDialysisMaterial();
                dialysisReady.orderBy = "";
            }
            if(data.index == 2){
                //药品准备
                dialysisReady.serviceType = "2";
                getDialysisDrugs();
                dialysisReady.orderBy = "";
            }
        });
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#dialysisReady_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'dialysisReady_search'  //指定的lay-filter
        ,conds:[
            {field: 'dialysisTime', title: '日期：',type:'date',placeholder:'yyyy-MM-dd'},
            {field: 'scheduleShift', title: '班次：',type:'select',data:getSysDictByCode("Shift",true)}, //加载数据字典
            {field: 'regionId', title: '区组：',type:'checkbox'},
            {field: 'keyWork', title: '关键词：',type:'input',placeholder:'编码/名称'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            var startTime = new Date();
            form.val(filter,{
                "dialysisTime":util.toDateString(startTime,"yyyy-MM-dd")
            });
            listRegionId(filter,data);//项目下拉框
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            if(dialysisReady.serviceType == "0"){
                table.reload('dialysisPatient_table',{
                    where:field
                });
            }
            if(dialysisReady.serviceType == "1"){
                table.reload('dialysisMaterial_table',{
                    where:field
                });
            }
            if(dialysisReady.serviceType == "2"){
                table.reload('dialysisDrugs_table',{
                    where:field
                });
            }
        }
    });
}

/**
 * 上机准备
 */
function getDialysisPatient() {

    //获取搜索值
   var param = getParam();

    _layuiTable({
        elem: '#dialysisPatient_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'dialysisPatient_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-190', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/dialysisReady/listDialysisPatient.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'patientName', title: '名称', align:'center',event: 'goPage',style:'cursor: pointer;color: dodgerblue;'}
                ,{field: 'bedNo', title: '床号', align:'center'}
                ,{field: 'dialysisMode', title: '透析方式', align:'center'}
                ,{field: 'dialyzer', title: '透析器', align:'center'}
                ,{field: 'filter', title: '血滤器', align:'center'}
                ,{field: 'irrigator', title: '灌流器', align:'center'}
                ,{field: 'dosage', title: '抗凝剂/首计/总剂量', align:'center',templet: function(d){
                    if(isNotEmpty(d.anticoagulant)){
                        return d.anticoagulant+"/"+d.firstDosage+"/"+d.totalDosage + " " + d.dosageFirstUnit;
                    }else {
                        return "";
                    }
                }}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'goPage'){ //编辑
                var  patientId = data.patientId;
                //跳转到透析治疗页面
                var dialysisTime = $("input[name='dialysisTime']").val();
                var scheduleShift =   $("select[name='scheduleShift']").val();
                dialysisReady.baseFuncInfo.openDialysisLayoutPage({
                    patientId: patientId,
                    query: {
                        dialysisDate: dialysisTime, // 透析日期
                        scheduleShift: "", // 班次
                        regionSettingId: "", // 区组
                        patientName: "" // 姓名
                    }
                })
            }
        }
    });
}



/**
 * 耗材准备
 */
function getDialysisMaterial() {
    //获取搜索值
    var param = getParam();

    _layuiTable({
        elem: '#dialysisMaterial_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'dialysisMaterial_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-190', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/dialysisReady/listDialysisMaterial.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'materielNo', title: '编码', align:'center'}
                ,{field: 'materielName', title: '耗材名称', align:'left'}
                ,{field: 'manufactor', title: '产地', align:'left'}
                ,{field: 'specifications', title: '规格', align:'center'}
                ,{field: 'total', title: '数量', align:'center', sort: true,templet: function(d){
                    return d.total + " " +d.basicUnit ;
                }}
            ]]
        }
    });
}

/**
 * 药品准备
 */
function getDialysisDrugs() {
    //获取搜索值
    var param = getParam();

    _layuiTable({
        elem: '#dialysisDrugs_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'dialysisDrugs_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-190', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/dialysisReady/listDialysisDrugs.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page:false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'materielNo', title: '编码', align:'center'}
                ,{field: 'materielName', title: '耗材名称', align:'left'}
                ,{field: 'manufactor', title: '产地', align:'left'}
                ,{field: 'specifications', title: '规格', align:'center'}
                ,{field: 'total', title: '数量', align:'center', sort: true, templet: function(d){
                    return d.total + " "+ d.basicUnit ;
                }}
            ]]
        },sortOrder:function (orderBy){
            dialysisReady.orderBy = orderBy;
        }
    });
}

/**
 * 获取搜索栏-值
 */
function getParam() {

    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    var dialysisTime = $("input[name='dialysisTime']").val();
    var scheduleShift =   $("select[name='scheduleShift']").val();
    var regionId = layui.formSelects.value('regionId', 'valStr');    //取值val字符串
    var keyWork = $("input[name='keyWork']").val();

    if(isEmpty(dialysisTime)){
        warningToast("请选择日期");
        return;
    }
    var param = {
        "dialysisTime":dialysisTime,
        "scheduleShift":scheduleShift,
        "regionId":regionId,
        "keyWork":keyWork,
        "page.orderBy": dialysisReady.orderBy
    };
    return param;
}

/**
 * 导出Excel
 */
function exportExcel(){
    var util=layui.util;
    var dialysisTime = $("input[name='dialysisTime']").val();
    if(dialysisReady.serviceType == "0"){
        var name = "上机准备_" + util.toDateString(dialysisTime,"yyyy-MM-dd");
        _downloadFile({
            url: $.config.services.dialysis + "/dialysisReady/exportDialysisPatient.do",
            data: getParam(),
            fileName: name
        });
    }
    if(dialysisReady.serviceType == "1"){
        var name = "耗材准备_" + util.toDateString(dialysisTime,"yyyy-MM-dd");
        _downloadFile({
            url: $.config.services.dialysis + "/dialysisReady/exportDialysisMaterial.do",
            data: getParam(),
            fileName: name
        });
    }
    if(dialysisReady.serviceType == "2"){
        var name = "药品准备_" + util.toDateString(dialysisTime,"yyyy-MM-dd");
        _downloadFile({
            url: $.config.services.dialysis + "/dialysisReady/exportDialysisDrugs.do",
            data: getParam(),
            fileName: name
        });
    }

}


/**
 * 获取区组下拉列表
 */
function listRegionId(filter,formData) {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/dialysisReady/listRegionId.do",
        data:param,  //必须字符串后台才能接收list,
        dataType: "json",
        done: function(data){
            var form=layui.form; //调用layui的form模块
            var formSelects=layui.formSelects; //调用layui的form模块
            formSelects.btns('regionId',['remove']);
            formSelects.data('regionId', 'local', {
                arr:data
            });
        }
    });
}