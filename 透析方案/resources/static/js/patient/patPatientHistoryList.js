/**
 * patPatientHistoryList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者管理-透析管理-干体重列表页面
 * @Author Care
 * @version: 1.0
 * @Date 2020/8/12
 */
var patPatientHistoryList = avalon.define({
    $id: "patPatientHistoryList",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    patientId: '', //患者ID
    dryWeight: '', //当前干体重
    patientHistoryId: ''//干体重Id

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        patPatientHistoryList.patientId = GetQueryString('patientId');

        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList(patPatientHistoryList.patientId);  //查询列表
        getDryWeightInfor(patPatientHistoryList.patientId);
        avalon.scan();
        // 更新外部iframe高度
        if (window.parent.onAppBodyResize) { window.parent.onAppBodyResize(); }
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#patPatientHistoryList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'patPatientHistoryList_search'  //指定的lay-filter
        ,conds:[
            {field: 'updateTime', title: '调整日期：',type:'date_range'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            // var startTime=field.updateTime_begin;
            // var endTime=field.updateTime_end;
            // if(startTime > endTime){//判断起始日期不能大于结束时期
            //     warningToast("起始时间不能大于结束时间");
            // }
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('patPatientHistoryList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId": patientId
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#patPatientHistoryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'patPatientHistoryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis+ "/patPatientHistory/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'updateTime', title: '调整日期',align:'center',sortField:'pph_.updateTime'
                    ,templet: function(d){
                        return util.toDateString(d.updateTime,"yyyy-MM-dd HH:mm:ss");
                    }}
                ,{field: 'dryWeight', title: '干体重(kg)',align:'center',sortField:'pph_.dry_weight'}
                ,{field: 'dryWeightAdjust', title: '干体重调整值',align:'center',sortField:'pph_.dry_weight_adjust'
                    ,templet: function (d) {
                    return d.dryWeightAdjust>0 ?d.dryWeightAdjust+'↑': d.dryWeightAdjust<0 ? d.dryWeightAdjust+'↓': '--';
                    }}
                ,{field: 'adjustDoctor', title: '调整医生',align:'center',sortField:'pph_.update_by_'}
                ,{field: 'remarks', title: '备注',align:'left',sortField:'pph_.remarks'}

            ]],
            done: function () {
                // 更新外部iframe高度
                if (window.parent.onAppBodyResize) { window.parent.onAppBodyResize(); }
            }
        },
    });
}
/**
 * 获取患者信息(干体重)
 */
function getDryWeightInfor(patientId){
    var url="";
    if(isNotEmpty(patientId)){
        _ajax({
            type: "POST",
            //loading:true,  //是否ajax启用等待旋转框，默认是true
            url: $.config.services.dialysis+"/patPatientHistory/getInfo.do",
            data: {patientId: patientId},
            dataType: "json",
            done: function (data) {
                $("#dryWeight").val(data.dryWeight);
                patPatientHistoryList.dryWeight=data.dryWeight;
            }
        });

    }
}
/**
 * 获取单个实体
 */
function saveOrEdit(){
    var url="";
    var title="";
    title="调整确认";
    url=$.config.server+"/patient/patPatientHistoryEdit?patientId="+patPatientHistoryList.patientId+"&dryWeight="+patPatientHistoryList.dryWeight;
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        openInParent: true, //是否在父窗口打开弹窗，默认false
        url:url,  //弹框自定义的url，会默认采取type=2
        width:500, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:400,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin,layer){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功");
                    var table = layui.table; //获取layui的table模块
                    table.reload('patPatientHistoryList_table'); //重新刷新table
                    getDryWeightInfor(patPatientHistoryList.patientId);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

