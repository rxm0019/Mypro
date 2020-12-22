/**
 * diaSummaryList.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 */
var diaSummaryList = avalon.define({
    $id: "diaSummaryList",
    baseFuncInfo: baseFuncInfo//底层基本方法
});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        initSearch(); //初始化搜索框
        getList();  //查询列表
        avalon.scan();
    });
});
/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#diaSummaryList_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'diaSummaryList_search'  //指定的lay-filter
        ,conds:[
            {field: 'diaRecordId', title: '透析记录id	Ref:dia_record',type:'input'}
            ,{field: 'afterPlanWeight', title: '透后体重	取值范围(0, 200]，可输入两位小数',type:'input'}
            ,{field: 'afterRealWeight', title: '实际透后体重	取值范围(0, 200]，可输入两位小数',type:'input'}
            ,{field: 'differWeight', title: '体重差	取值范围(0, 200]，可输入两位小数',type:'input'}
            ,{field: 'actualDehydration', title: '实际脱水量	取值范围(0, 10000]，整数可输入两位小数',type:'input'}
            ,{field: 'machineDehydration', title: '机显脱水量	取值范围(0, 10000]，整数可输入两位小数',type:'input'}
            ,{field: 'dialysisTimeHour', title: '实际透析时长(小时)',type:'input'}
            ,{field: 'dialysisTimeMin', title: '实际透析时长(分钟)',type:'input'}
            ,{field: 'systolicPressure', title: '收缩压',type:'input'}
            ,{field: 'diastolicPressure', title: '舒张压',type:'input'}
            ,{field: 'pulse', title: '脉博',type:'input'}
            ,{field: 'substituteMode', title: '置换方式	选项来自数据字典“透析置换方式(SubstituteMode)”，单选',type:'input'}
            ,{field: 'replacementFluidTotal', title: '置换液总量	取值范围(0, 100]，可输入两位小数',type:'input'}
            ,{field: 'relReplacementFluidTotal', title: '实际置换液总量	取值范围(0, 100]，可输入两位小数',type:'input'}
            ,{field: 'replacementFluidFlowRate', title: '置换液流速	取值范围(0, 10000]，整数',type:'input'}
            ,{field: 'fallAssess', title: '坠床（跌倒）	来源字典',type:'input'}
            ,{field: 'catheterDrop', title: '导管脱出	来源字典',type:'input'}
            ,{field: 'diaCoagulation', title: '透析器凝血	来源字典',type:'input'}
            ,{field: 'dialyzerChange', title: '透析器更换	N-无，Y-有',type:'input'}
            ,{field: 'bloodClotting', title: '透析管路凝血	来源字典',type:'input'}
            ,{field: 'pipingChange', title: '管理更换	N-无，Y-有',type:'input'}
            ,{field: 'fever', title: '发热	来源字典',type:'input'}
            ,{field: 'dialysateIntakeType', title: '透中摄入	来源字典',type:'input'}
            ,{field: 'dialysateIntake', title: '透中摄入	取值范围(0, 10000]，整数可输入两位小数',type:'input'}
            ,{field: 'gaitWatch', title: '步态观察	来源字典',type:'input'}
            ,{field: 'accompanyUser', title: '陪同者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'hemostasis', title: '止血方式	来源字典',type:'input'}
            ,{field: 'hemostasisTime', title: '止血时间	来源字典',type:'input'}
            ,{field: 'fistulaTremor', title: '内瘘震颤	来源字典',type:'input'}
            ,{field: 'fistulaNoise', title: '内瘘杂音	来源字典',type:'input'}
            ,{field: 'fistulaOther', title: '内瘘其他	来源字典',type:'input'}
            ,{field: 'dressingChange', title: '是否已更换敷料	N-无，Y-有',type:'input'}
            ,{field: 'measuringPart', title: '测量部位	0-上肢，1-下肢',type:'input'}
            ,{field: 'sealingMethod', title: '封管方式',type:'input'}
            ,{field: 'capacityA', title: '管腔容量A	取值范围(0, 999]，可输入两位小数',type:'input'}
            ,{field: 'capacityV', title: '管腔容量V	取值范围(0, 999]，可输入两位小数',type:'input'}
            ,{field: 'drugSealing', title: '封管用药	来源字典',type:'input'}
            ,{field: 'catheterArterySide', title: '动脉端	来源字典',type:'input'}
            ,{field: 'catheterVeinSide', title: '静脉端	来源字典',type:'input'}
            ,{field: 'summary', title: '小结',type:'input'}
            ,{field: 'washpipeUser', title: '冲管者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'punctureUser', title: '穿刺者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'bloodReceiver', title: '接血者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'rebleedingUser', title: '回血者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'inspector', title: '巡视者	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'principalNurse', title: '责任护士	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'checkNurse', title: '查对护士	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'doctorSign', title: '医生签名	Ref: sys_user_info.user_id',type:'input'}
            ,{field: 'saveStatus', title: '保存标志	固定；Y-保存过，N-未保存过',type:'input'}
            ,{field: 'createBy', title: '建立人员(Ref: sys_user_info)',type:'input'}
            ,{field: 'createTime', title: '建立日期',type:'date'}
            ,{field: 'updateBy', title: '修改人员(Ref: sys_user_info)',type:'input'}
            ,{field: 'updateTime', title: '修改日期',type:'date'}
            ,{field: 'dataStatus', title: '数据状态(0-启用，1-停用，2-删除)',type:'input'}
            ,{field: 'dataSync', title: '数据同步状态(0-未同步，1-已同步)',type:'input'}
            ,{field: 'hospitalNo', title: '医院代码',type:'input'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            //...
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('diaSummaryList_table',{
                where:field
            });
        }
    });
}
/**
 * 查询列表事件
 */
function getList() {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
    _layuiTable({
        elem: '#diaSummaryList_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'diaSummaryList_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url: getRootPath() + "diaSummary/list.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {fixed: 'left',type:'checkbox'}  //开启编辑框
                ,{type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'diaRecordId', title: '透析记录id	Ref:dia_record',sort: true,sortField:'ds_.dia_record_id'}
                ,{field: 'afterPlanWeight', title: '透后体重	取值范围(0, 200]，可输入两位小数',sort: true,sortField:'ds_.after_plan_weight'}
                ,{field: 'afterRealWeight', title: '实际透后体重	取值范围(0, 200]，可输入两位小数',sort: true,sortField:'ds_.after_real_weight'}
                ,{field: 'differWeight', title: '体重差	取值范围(0, 200]，可输入两位小数',sort: true,sortField:'ds_.differ_weight'}
                ,{field: 'actualDehydration', title: '实际脱水量	取值范围(0, 10000]，整数可输入两位小数',sort: true,sortField:'ds_.actual_dehydration'}
                ,{field: 'machineDehydration', title: '机显脱水量	取值范围(0, 10000]，整数可输入两位小数',sort: true,sortField:'ds_.machine_dehydration'}
                ,{field: 'dialysisTimeHour', title: '实际透析时长(小时)',align:'right',sort: true,sortField:'ds_.dialysis_time_hour'}
                ,{field: 'dialysisTimeMin', title: '实际透析时长(分钟)',align:'right',sort: true,sortField:'ds_.dialysis_time_min'}
                ,{field: 'systolicPressure', title: '收缩压',sort: true,sortField:'ds_.systolic_pressure'}
                ,{field: 'diastolicPressure', title: '舒张压',sort: true,sortField:'ds_.diastolic_pressure'}
                ,{field: 'pulse', title: '脉博',sort: true,sortField:'ds_.pulse'}
                ,{field: 'substituteMode', title: '置换方式	选项来自数据字典“透析置换方式(SubstituteMode)”，单选',sort: true,sortField:'ds_.substitute_mode'}
                ,{field: 'replacementFluidTotal', title: '置换液总量	取值范围(0, 100]，可输入两位小数',sort: true,sortField:'ds_.replacement_fluid_total'}
                ,{field: 'relReplacementFluidTotal', title: '实际置换液总量	取值范围(0, 100]，可输入两位小数',sort: true,sortField:'ds_.rel_replacement_fluid_total'}
                ,{field: 'replacementFluidFlowRate', title: '置换液流速	取值范围(0, 10000]，整数',sort: true,sortField:'ds_.replacement_fluid_flow_rate'}
                ,{field: 'fallAssess', title: '坠床（跌倒）	来源字典',sort: true,sortField:'ds_.fall_assess'}
                ,{field: 'catheterDrop', title: '导管脱出	来源字典',sort: true,sortField:'ds_.catheter_drop'}
                ,{field: 'diaCoagulation', title: '透析器凝血	来源字典',sort: true,sortField:'ds_.dia_coagulation'}
                ,{field: 'dialyzerChange', title: '透析器更换	N-无，Y-有',sort: true,sortField:'ds_.dialyzer_change'}
                ,{field: 'bloodClotting', title: '透析管路凝血	来源字典',sort: true,sortField:'ds_.blood_clotting'}
                ,{field: 'pipingChange', title: '管理更换	N-无，Y-有',sort: true,sortField:'ds_.piping_change'}
                ,{field: 'fever', title: '发热	来源字典',sort: true,sortField:'ds_.fever'}
                ,{field: 'dialysateIntakeType', title: '透中摄入	来源字典',sort: true,sortField:'ds_.dialysate_intake_type'}
                ,{field: 'dialysateIntake', title: '透中摄入	取值范围(0, 10000]，整数可输入两位小数',sort: true,sortField:'ds_.dialysate_intake'}
                ,{field: 'gaitWatch', title: '步态观察	来源字典',sort: true,sortField:'ds_.gait_watch'}
                ,{field: 'accompanyUser', title: '陪同者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.accompany_user'}
                ,{field: 'hemostasis', title: '止血方式	来源字典',sort: true,sortField:'ds_.hemostasis'}
                ,{field: 'hemostasisTime', title: '止血时间	来源字典',sort: true,sortField:'ds_.hemostasis_time'}
                ,{field: 'fistulaTremor', title: '内瘘震颤	来源字典',sort: true,sortField:'ds_.fistula_tremor'}
                ,{field: 'fistulaNoise', title: '内瘘杂音	来源字典',sort: true,sortField:'ds_.fistula_noise'}
                ,{field: 'fistulaOther', title: '内瘘其他	来源字典',sort: true,sortField:'ds_.fistula_other'}
                ,{field: 'dressingChange', title: '是否已更换敷料	N-无，Y-有',sort: true,sortField:'ds_.dressing_change'}
                ,{field: 'measuringPart', title: '测量部位	0-上肢，1-下肢',sort: true,sortField:'ds_.measuring_part'}
                ,{field: 'sealingMethod', title: '封管方式',sort: true,sortField:'ds_.sealing_method'}
                ,{field: 'capacityA', title: '管腔容量A	取值范围(0, 999]，可输入两位小数',sort: true,sortField:'ds_.capacity_a'}
                ,{field: 'capacityV', title: '管腔容量V	取值范围(0, 999]，可输入两位小数',sort: true,sortField:'ds_.capacity_v'}
                ,{field: 'drugSealing', title: '封管用药	来源字典',sort: true,sortField:'ds_.drug_sealing'}
                ,{field: 'catheterArterySide', title: '动脉端	来源字典',sort: true,sortField:'ds_.catheter_artery_side'}
                ,{field: 'catheterVeinSide', title: '静脉端	来源字典',sort: true,sortField:'ds_.catheter_vein_side'}
                ,{field: 'summary', title: '小结',sort: true,sortField:'ds_.summary'}
                ,{field: 'washpipeUser', title: '冲管者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.washpipe_user'}
                ,{field: 'punctureUser', title: '穿刺者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.puncture_user'}
                ,{field: 'bloodReceiver', title: '接血者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.blood_receiver'}
                ,{field: 'rebleedingUser', title: '回血者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.rebleeding_user'}
                ,{field: 'inspector', title: '巡视者	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.inspector'}
                ,{field: 'principalNurse', title: '责任护士	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.principal_nurse'}
                ,{field: 'checkNurse', title: '查对护士	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.check_nurse'}
                ,{field: 'doctorSign', title: '医生签名	Ref: sys_user_info.user_id',sort: true,sortField:'ds_.doctor_sign'}
                ,{field: 'saveStatus', title: '保存标志	固定；Y-保存过，N-未保存过',sort: true,sortField:'ds_.save_status'}
                ,{field: 'createBy', title: '建立人员(Ref: sys_user_info)',sort: true,sortField:'ds_.create_by_'}
                ,{field: 'createTime', title: '建立日期',align:'center',sort: true,sortField:'ds_.create_time_'
                    ,templet: function(d){
                    return util.toDateString(d.createTime,"yyyy-MM-dd");
                }}
                ,{field: 'updateBy', title: '修改人员(Ref: sys_user_info)',sort: true,sortField:'ds_.update_by_'}
                ,{field: 'updateTime', title: '修改日期',align:'center',sort: true,sortField:'ds_.update_time_'
                    ,templet: function(d){
                    return util.toDateString(d.updateTime,"yyyy-MM-dd");
                }}
                ,{field: 'dataStatus', title: '数据状态(0-启用，1-停用，2-删除)',sort: true,sortField:'ds_.data_status'}
                ,{field: 'dataSync', title: '数据同步状态(0-未同步，1-已同步)',sort: true,sortField:'ds_.data_sync'}
                ,{field: 'hospitalNo', title: '医院代码',sort: true,sortField:'ds_.hospital_no'}
                ,{fixed: 'right',title: '操作',width: 140, align:'center'
                    ,toolbar: '#diaSummaryList_bar'}
            ]]
        },
        //监听工具条事件
        tool:function(obj,filter){
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if(layEvent === 'edit'){ //编辑
                //do something
                if(isNotEmpty(data.summaryId)){
                    saveOrEdit(data.summaryId);
                }
            }else if(layEvent === 'del'){ //删除
                layer.confirm('确认删除所选记录吗？', function(index){
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                    if(isNotEmpty(data.summaryId)){
                        var ids=[];
                        ids.push(data.summaryId);
                        del(ids);
                    }
                });
            }
        }
    });
}

/**
 * 获取单个实体
 */
function saveOrEdit(id){
    var url="";
    var title="";
    if(isEmpty(id)){  //id为空,新增操作
        title="新增";
        url=getRootPath()+"diaSummary/diaSummaryEdit";
    }else{  //编辑
        title="编辑";
        url=getRootPath()+"diaSummary/diaSummaryEdit?id="+id;
    }
    //_layerOpen系统弹框统一调用方法，done事件是定义的按钮的执行事件
    _layerOpen({
        url:url,  //弹框自定义的url，会默认采取type=2
        width:400, //弹框自定义的宽度，方法会自动判断是否超过宽度
        height:500,  //弹框自定义的高度，方法会自动判断是否超过高度
        title:title, //弹框标题
        done:function(index,iframeWin){
            /**
             * 确定按钮的回调,说明：index是关闭弹框用的，iframeWin是操作子iframe窗口的变量，
             * 利用iframeWin可以执行弹框的方法，比如save方法
             */
            var ids = iframeWin.save(
                //成功保存之后的操作，刷新页面
                function success() {
                    successToast("保存成功",500);
                    var table = layui.table; //获取layui的table模块
                    table.reload('diaSummaryList_table'); //重新刷新table
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            );
        }
    });
}

/**
 * 删除事件
 * @param ids
 */
function del(ids){
    var param={
        "ids":ids
    };
    _ajax({
        type: "POST",
        url: getRootPath()+"diaSummary/delete.do",
        data:param,  //必须字符串后台才能接收list,
        //loading:false,  //是否ajax启用等待旋转框，默认是true
        dataType: "json",
        done: function(data){
            successToast("删除成功",500);
            var table = layui.table; //获取layui的table模块
            table.reload('diaSummaryList_table'); //重新刷新table
        }
    });
}

/**
 * 批量删除
 */
function batchDel(){
    var table = layui.table; //获取layui的table模块
    var checkStatus = table.checkStatus('diaSummaryList_table'); //test即为基础参数id对应的值
    var data=checkStatus.data; //获取选中行的数据
    if(data.length==0){
        warningToast("请至少选择一条记录");
        return false;
    }else{
        layer.confirm('确认删除所选记录吗？', function(index){
            layer.close(index);
            var ids=[];
            $.each(data,function(i,item){
                ids.push(item.summaryId);
            });
            del(ids);
        });
    }
}

