/**
 * bacPatientScheduleShow.jsp的js文件，包括列表查询、排序、增加、修改、删除基础操作
 * 患者管理 排床查询页面
 * @Author xcj
 * @version: 1.0
 * @Date 2020/10/7
 */
var bacPatientScheduleShow = avalon.define({
    $id: "bacPatientScheduleShow",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    list:[],//排班列表
    month:'',//月份显示
    curMonthIndex:0,//相对当前周的第几周，-1是上一周，0是当前周，1是下一周
    patientId:'',//选中的患者id

});
layui.use(['index'], function() {
    //加载layui的模块，index模块是基础模块，也可添加其它
    avalon.ready(function () {
        //所有的入口事件写在这里...
        var id = GetQueryString("patientId");  //接收变量
        if(isNotEmpty(id)){
            bacPatientScheduleShow.patientId = id;
        }else {
            warningToast("请选择患者");
            return false;
        }
        initSearch(); //初始化搜索框
        //监听tab切换
        element = layui.element;
        element.on('tab(showTab)', function(data){
            if(data.index == 1){
                var date = $("input[name='scheduleDate']").val();
                if(isEmpty(date)){
                    warningToast("请选择日期");
                    return false;
                }
                getTableList(date);
            }
        });

        getList(id);
        avalon.scan();
    });
});




/**
 * 初始化搜索框
 */
function initSearch(){
    _initSearch({
        elem: '#bacPatientScheduleShow_search' //指定搜索框表单的元素选择器（推荐id选择器）
        ,filter:'bacPatientScheduleShow_search'  //指定的lay-filter
        ,conds:[
            {field: 'scheduleDate', title: '排班日期：',type:'month'}
        ]
        ,done:function(filter,data){
            //完成html载入，可进行一些插件方法的初始化事件，或者加载下拉框
            var form=layui.form;
            var date = new Date();
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            var month = Y + M;
            form.val(filter,{
                "scheduleDate":month,
            });
        }
        ,search:function(data){
            //点击搜索返回的事件，用于处理搜索方法;获取搜索条件：data.field
            var field = data.field;
            var table = layui.table; //获取layui的table模块
            field.patientId = bacPatientScheduleShow.patientId;
            field.scheduleDate = field.scheduleDate + "-01";
            //重新刷新table,where:接口的其它参数。如：where: {token: 'sasasas', id: 123}
            table.reload('bacPatientScheduleShow_table',{
                where:field
            });
        }
    });
}

/**
 * 上一月
 */
function lastMonth() {
    if(isEmpty(bacPatientScheduleShow.patientId)){
        warningToast("请选择患者！");
        return false;
    }
    bacPatientScheduleShow.curMonthIndex = bacPatientScheduleShow.curMonthIndex - 1;
    getList(bacPatientScheduleShow.patientId);
}

/**
 * 下一月
 */
function nextMonth() {
    if(isEmpty(bacPatientScheduleShow.patientId)){
        warningToast("请选择患者！");
        return false;
    }
    bacPatientScheduleShow.curMonthIndex = bacPatientScheduleShow.curMonthIndex + 1;
    getList(bacPatientScheduleShow.patientId);
}


/**
 * 查询列表事件
 */
function getList(patientId) {
    var param = {
        "patientId":patientId,
        "monthIndex":bacPatientScheduleShow.curMonthIndex
    };
    _ajax({
        type: "POST",
        url: $.config.services.schedule + "/bacPatientSchedule/listPatientScheduleQuery.do",
        dataType: "json",
        data:param,
        done:function(data){
            bacPatientScheduleShow.month = data.month;
            var list = data.sevenList;
            bacPatientScheduleShow.list.clear();
            bacPatientScheduleShow.list.pushArray(list);

            //获取上午、下午、晚上的右侧数据div
            var trs = $("tbody tr");
            //获取上午、下午、晚上的div
            for(var i=0;i<trs.length;i++){
                var parentHeight = trs[i].offsetHeight;
                $(trs[i]).find("td").css("height",parentHeight);
            }
        }
    });
}


/**
 * 查询列表事件
 */
function getTableList(date) {
    var param = {
    };
    //获取layui的table模块
    var table=layui.table;
    //获取layui的util模块
    var util=layui.util;
     param.scheduleDate = date + "-01";
    param.patientId = bacPatientScheduleShow.patientId;
    _layuiTable({
        elem: '#bacPatientScheduleShow_table', //必填，指定原始表格元素选择器（推荐id选择器）
        filter:'bacPatientScheduleShow_table', ////必填，指定的lay-filter的名字
        //执行渲染table配置
        render:{
            height:'full-180', //table的高度，页面最大高度减去差值
            url:  $.config.services.schedule + "/bacPatientSchedule/listPatientScheduleShow.do", // ajax的url必须加上getRootPath()方法
            where:param, //接口的参数。如：where: {token: 'sasasas', id: 123}
            cols: [[ //表头
                {type: 'numbers', title: '序号',width:60 }  //序号
                ,{field: 'scheduleDate', title: '排班日期',align:'center',templet: function(d){
                        return util.toDateString(d.scheduleDate,"yyyy-MM-dd");
                    }}
                ,{field: 'scheduleShift', title: '班次',align:'center'}
                ,{field: 'regionId', title: '透析区域',align:'center'}
                ,{field: 'bedNumberId', title: '床号',align:'center'}
                ,{field: 'dialysisMode', title: '透析方式',align:'center'}
                ,{field: 'dialyzer', title: '透析器',align:'center'}
            ]]
        }
    });
}

/**
 * 按月预览
 */
function monthSchedule() {
    var url="";
    var title="";
    title="按月预览";
    url=$.config.server + "/backstage/bacPatientScheduleMonth";
    parent.parent.layui.index.openTabsPage(url, title);//这里要注意的是parent的层级关系
}