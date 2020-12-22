/**
 * diaRecordReport.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 透析记录报告
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/27
 */
var diaRecordReport = avalon.define({
    $id: "diaRecordReport",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    SysHospitalList:[],//区名和区名下的医护人员
    showType:'',//显示隐藏
    diaRecordId:'',
    diaRecordName:'',//透析记录pdf名称
    firstUnit:"\\",//首剂单位
    dosageAdd:"\\",//追加药剂
    addUnit:"\\",//追加单位=首剂单位+/h
    diaExecuteOrderLists:[],//执行医嘱
    diaUnusualItemList:[],//异常监测记录
    monitoringRecordHeader:[],//监测记录表头
    monitoringRecordData:[],//监测记录数据
    summary:'',//小结
    diagnosis:'',//诊断
    illness:'',//透前病情
    beforeWeight:'',//透前体重
    dryWeight:'',//干体重
    afterRealWeight:'',//实际透后体重
    machineDehydration:'',//机显脱水量（净脱水量）
    befAfterRealWeight:'',//前次透后体重
    weightAdd:'',//体重增加量 = 透前体重-前次透后体重
    dryWeightAdd:'',//较干体重增加量=透前体重-干体重
    afterWeightiLess:'',//本次透前体重下降量=透前体重-透后体重
    parameterDehydration:'',//处方脱水量
    replacementFluidFlow:'',//透析液流量
});

layui.use(['index','laypage','laydate'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        filterSelect();//监控下拉
        getDiaRecordList();
        avalon.scan();
    });
});

/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#diaRecordReport_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'diaRecordReport_search'  //指定的lay-filter
        ,conds:[
            {field: 'patientName', title: '患者姓名：',type:'input'}
            ,{field: 'scheduleShift', title: '班次：',type:'select',data:getSysDictByCode("Shift",true)}, //加载数据字典
            ,{field: 'dialysisDate', title: '日期：',type:'date_range'}
            ,{field: 'customerType',type:'select', title: '查询范围：'
                , data: getSysDictByCode($.dictType.customerType, true)}
            ,{field: 'hospitalNo',type:'select', title: '中心：'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var util=layui.util;
            form.val(filter,{
                "dialysisDate_begin":util.toDateString(new Date(),"yyyy-MM-dd"),
            });
            form.val(filter,{
                "dialysisDate_end":util.toDateString(new Date(),"yyyy-MM-dd")
            });
            getHospitalAndUser();
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('diaRecordReport_table',{
                where:field
            });
        }
    });
}

/**
 * 获取区名和区名下的医护人员下拉列表
 */
function getHospitalAndUser() {
    var param = {
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/listHospitalAndUser.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            if(data.length>0){
                diaRecordReport.SysHospitalList.pushArray(data);

                var userList = [];
                //清空数据，重新绑定值
                var htmlHospital ='';
                $.each(diaRecordReport.SysHospitalList,function(i,item){
                    htmlHospital+='<option value="'+item.hospitalNo+'">'+item.hospitalName+'</option>';
                    if(diaRecordReport.baseFuncInfo.userInfoData.hospitalNo == item.hospitalNo){
                        userList = item.sysUserList;
                    }
                });
                $("select[name='hospitalNo']").html(htmlHospital);
                $("select[name='hospitalNo']").val(diaRecordReport.baseFuncInfo.userInfoData.hospitalNo);
                var htmlUser ='';
                if(userList.length>0){
                    $.each(userList,function(i,item){
                        htmlUser+='<option value="'+item.id+'">'+item.userName+'</option>';
                    });
                }
                var form=layui.form;
                $("select[name='userId']").html(htmlUser);
                //刷新表单渲染
                form.render();
            }
        }
    });
}

/**
 * 监控下拉
 */
function filterSelect() {
    //监控教育类型，联动主题类型
    var form=layui.form;
    form.on('radio(showType)', function (data) {
        diaRecordReport.showType = data.value;
    });

}


/**
 * 获取透析记录
 */
function getDiaRecordList() {
    //获取layui的table模块
    var table=layui.table;
    var util=layui.util;
    var date = new Date();
    var param = {
        dialysisDate_begin:util.toDateString(date,"yyyy-MM-dd"),
        dialysisDate_end:util.toDateString(date,"yyyy-MM-dd"),
        hospitalNo:baseFuncInfo.userInfoData.hospitalNo
    };
    _layuiTable({
        elem: '#diaRecordReport_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaRecordReport_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-140', //table的高度，页面最大高度减去差值
            url: $.config.services.dialysis + "/patReport/getDiaRecordList.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            page: false,
            cols: [[ //表头
                {field: 'patientRecordNo', title: '病历号',align:'center'}
                ,{field: 'patientName', title: '姓名',align:'center'}
                ,{field: 'dialysisDate', title: '透析日期',align:'center',templet: function(d){
                        return util.toDateString(d.dialysisDate,"yyyy-MM-dd");
                    }}
            ]],
            done: function (res, curr, count) { //查询完成默认选择第一行数据
                $(".layui-table-view[lay-id='diaRecordReport_table'] .layui-table-body tr[data-index = '0' ]").click();
            }
        }
    });
    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(diaRecordReport_table)', function(obj){
        var data = obj.data;
        if(data!=null){
            getDiaRecordReport(data.diaRecordId);
            diaRecordReport.diaRecordId = data.diaRecordId;
            diaRecordReport.diaRecordName = data.patientName + util.toDateString(data.dialysisDate,"yyyy-MM-dd") ;
        }
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });
}

/**
 * 获取透析信息
 * @param diaRecordId
 */
function getDiaRecordReport(diaRecordId) {
    var param = {
        diaRecordId:diaRecordId
    };
    _ajax({
        type: "POST",
        url: $.config.services.dialysis + "/patReport/getDiaRecordReport.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){

            debugger

            diaRecordReport.diaExecuteOrderLists = data.diaExecuteOrderLists; //执行医嘱
            diaRecordReport.diaUnusualItemList = data.diaUnusualItemList;//异常监测记录
            diaRecordReport.monitoringRecordData = data.monitoringRecordData;//监测记录数据

            diaRecordReport.beforeWeight = data.beforeWeight;

            diaRecordReport.summary = data.summary;
            diaRecordReport.illness = data.illness;
            diaRecordReport.dryWeight = data.dryWeight;
            diaRecordReport.afterRealWeight = data.afterRealWeight;
            diaRecordReport.machineDehydration = data.machineDehydration;
            diaRecordReport.befAfterRealWeight = data.befAfterRealWeight;
            diaRecordReport.weightAdd = data.weightAdd;
            diaRecordReport.dryWeightAdd = data.dryWeightAdd;
            diaRecordReport.afterWeightiLess = data.afterWeightiLess;
            diaRecordReport.parameterDehydration = data.parameterDehydration;//处方脱水量
            diaRecordReport.replacementFluidFlow = data.replacementFluidFlow;//透析液流量
            //表单初始赋值
            var form=layui.form; //调用layui的form模块
            form.val('diaRecordReport_form', data);

        }
    });
}

/**
 * 导出pdf
 */
function exportPDF(){
    var name = "透析记录"+diaRecordReport.diaRecordName+".pdf";
    _downloadFile({
        url: $.config.services.dialysis + "/patReport/exportDiaRecordReport.do",
        data: { diaRecordId:diaRecordReport.diaRecordId,diaRecordName:diaRecordReport.diaRecordName},
        fileName: name
    });
}
