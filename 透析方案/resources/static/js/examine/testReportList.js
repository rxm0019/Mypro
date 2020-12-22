/**
 * testReportList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 检验检查--化验记录
 * @Author xcj
 * @version: 1.0
 * @Date 2020/9/28
 */
var testReportList = avalon.define({
    $id: "testReportList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId:'',
    sampleCode:'',//条码
    mechanism:'',//检验机构
    applyId:'',
    testType:'',//检验类型
    applyDate:null,
    hasData:false,
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        if(isNotEmpty(id)){
            testReportList.patientId = id;
        }else {
            warningToast("请选择患者");
            return false;
        }
        initSearch(); //初始化搜索框
        getSampleList();  //查询列表
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
    form.val('testReportList_search', {
        applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
        applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd")
    });
    //监听搜索
    form.on('submit(testReportList_search_search)', function (data) {
        var field = data.field;
        var table = layui.table; //获取layui的table模块
        //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
        table.reload('tesApplySampleList_table',{
            where:field
        });
    });
}

/**
 * 查询列表事件--标本列表
 * 一个条码对应一个标本，一个标本可对应多个检验项目
 */
function getSampleList() {
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;

    var date_end =  new Date();
    var date = new Date();
    var date_begin = date.setMonth(date.getMonth()-1);
    var param = {
        applyDateBegin:util.toDateString(date_begin,"yyyy-MM-dd"),
        applyDateEnd:util.toDateString(date_end,"yyyy-MM-dd"),
        patientId:testReportList.patientId
    };
    _layuiTable({
        elem: '#tesApplySampleList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'tesApplySampleList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-100', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/tesApplySample/getSampleList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'applyDate', title: '申请日期',align:'center',width:110,templet: function(d){
                        return util.toDateString(d.applyDate,"yyyy-MM-dd");
                }},
                {field: 'checkoutName', align:'center',title: '检验项目名称'},
                {field: 'testType', title: '类型',width:70 , align:'center',templet: function(d){
                        return getSysDictName($.dictType.SampleType,d.testType);
                }}
            ]],
            done: function (res, curr, count) { //查询完成默认选择第一行数据
                $(".layui-table-view[lay-id='tesApplySampleList_table'] .layui-table-body tr[data-index = '0' ]").click()
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(tesApplySampleList_table)', function(obj){
        var data = obj.data;
        if(data!=null){
            if(isNotEmpty(data.sampleCode)){
                debugger
                getReportList(data.sampleCode);
                testReportList.sampleCode = data.sampleCode;
                testReportList.mechanism = data.mechanism;
                testReportList.applyId = data.applyId;
                testReportList.applyDate = data.applyDate;
                testReportList.testType = data.testType;
            }
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });

}

/**
 * 查询列表事件--检验报告数据
 */
function getReportList(sampleCode) {
    var param = {
        sampleCode:sampleCode
    };
    _layuiTable({
        elem: '#testReportList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'testReportList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-100', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/testReport/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'itemNameCn', title: '检查项名称', align:'center'}
                ,{field: 'reportValue', title: '检验值', align:'center',width:120}
                ,{field: 'reportSign', title: '检验结果', align:'center',width:120}
                ,{field: 'units', title: '检验单位', align:'center',width:120}
                ,{field: 'referencerange', title: '参考值范围', align:'center'}
            ]]
            , done: function (res, curr, count){
                if(res.bizData!=null && res.bizData.length>0){
                    var assess = res.bizData[0].assess;
                    $("#assess").val(assess);
                    testReportList.hasData = true;
                }
            }
        }
    });
}

/**
 * 获取检验结果
 */
function getSampleCodeResule(){
    var param={
        sampleCode:testReportList.sampleCode,
        mechanism:testReportList.mechanism
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/testReport/getSampleCodeResule.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("获取成功");
            var table = layui.table; //获取layui的table模块
            table.reload('testReportList_table'); //重新刷新table
        }
    });
}


/**
 * 编辑
 * @returns {boolean}
 */
function edit() {
    if(isEmpty(testReportList.sampleCode)){
        warningToast("请选择检验项目");
        return false;
    }
    saveOrEdit(testReportList.sampleCode);
}

/**
 * 获取单个实体
 */
function saveOrEdit(sampleCode){
    var url="";
    var title="";
    var util=layui.util;

    debugger
    title="编辑";
    url=$.config.server + "/examine/tesArrangeEdit?sampleCode="+sampleCode+"&patientId="+testReportList.patientId
        +"&applyId="+testReportList.applyId+"&applyDate="+testReportList.applyDate
        +"&mechanism="+testReportList.mechanism+"&testType="+testReportList.testType;

    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true,
        url:url,  //弹框自定义的url，会默认采取type=2
        width:900, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:800,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin, layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('testReportList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}


/**
 * 删除
 */
function delArrange(){
    var table = layui.table; //获取layui的table模块
    var util=layui.util;
    if(isEmpty(testReportList.sampleCode)){
        warningToast("请选择检验项目");
        return false;
    }else{
        if(testReportList.hasData){
            layer.confirm('确定删除所选记录的化验数据？', function(index){
                var param={
                    patientId:testReportList.patientId,
                    sampleCode:testReportList.sampleCode
                };
                _ajax({
                    type: "POST",
                    url: $.config.services.dialysis + "/testReport/delete.do",
                    data:param,  //必须字符串后台才能接收list,
                    //loading:false,  //是否ajax启用等待旋转框，默认是true
                    dataType: "json",
                    done: function(data){
                        if(data>0){
                            successToast("删除成功");
                            var table = layui.table; //获取layui的table模块
                            table.reload('testReportList_table'); //重新刷新table
                        }else{
                            successToast("暂无数据可删");
                        }
                    }
                });
            });
        }else {
            warningToast("暂无数据可删");
            return false;
        }
    }
}
